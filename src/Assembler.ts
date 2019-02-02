import {Token} from "./Token";
import {TokenType} from "./types/TokenType";
import {AssemblerError} from "./errors/AssemblerError";
import {AsmInstruction} from "./asmInstructions/AsmInstruction";
import {MEMORY_LENGTH, PROGRAM_OFFSET} from "./types/Chip8Specs";
import {ILabelReference} from "./interfaces/ILabelReference";
import {asmInstructionFactory} from "./asmInstructions/asmInstructionFactory";

export class Assembler {
    public readonly program: Uint8Array = new Uint8Array([]);

    private readonly tokens: Array<Token>;
    //keeps track all all valid asm instructions
    private instructions: Array<AsmInstruction> = [];
    //Keep track of all program labels
    private programLabels: Array<string> = [];
    //Stores a label name at where it occurred in the assembly (referred to as the program index).
    private labelLocations: Map<number, string> = new Map();
    //Stores all references made to program labels
    private labelReferences: Map<string, Array<ILabelReference>> = new Map();
    //Stores all unreachable code (address : value)
    private data: Map<number, number> = new Map();
    private maxDataOffset: number = 0;


    constructor(tokens: Array<Token>) {
        this.tokens = tokens.slice();
        this.program = this.parse();
    }

    private parse(): Uint8Array {
        while (true) {
            const nextToken = this.getNextToken();

            switch (nextToken.type) {
                case TokenType.INSTRUCTION:
                    this.parseInstructionToken(nextToken);
                    break;
                case TokenType.LABEL:
                    this.parseProgramLabelToken(nextToken);
                    break;
                case TokenType.DATA:
                    this.parseDataToken();
                    break;
                case TokenType.EOF:
                    return this.generateProgram();
                default:
                    throw new AssemblerError('Arrived at an invalid token', nextToken)
            }
        }
    }

    private getNextToken(): Token {
        const token = this.tokens.shift();

        if (typeof token === 'undefined')
            throw new AssemblerError('Received an undefined token in an unexpected place. Either an undefined value made it into the token stream, or an EOF token was not present');

        return token;
    }

    private parseInstructionToken(token: Token): void {
        let assembler = asmInstructionFactory(token, ...this.tokens.slice(0, 2));

        if (assembler === false)
            throw new AssemblerError('Encountered a mysterious token', token);

        for (let i = 0; i < assembler.assemblyData.nArgs; i += 1) {
            const param = this.getNextToken();

            //If the parameter token is a label, we need to keep track of it and resolve it to an actual memory address down the line
            if (param.is(TokenType.LABEL))
                this.addLabelReference(param.value, this.instructions.length, i);

            //Add the parameter to the assembler
            assembler.addParam(param);
        }

        this.instructions.push(assembler);
    }

    private parseProgramLabelToken(token: Token): void {
        if (this.programLabels.includes(token.value))
            throw new AssemblerError(`Received a duplicate label token`, token);

        this.labelLocations.set(this.instructions.length, token.value);
        this.programLabels.push(token.value);
    }

    /**
     * Data Tokens are an assembler-specific instruction.
     *
     * A valid program contains at least two integer token following a data token:
     *  The first is the memory address to place the data
     *  The second is the value of the data to store in memory
     *
     * Any proceeding integer tokens is considered to be data @ initial memory location + the nth integer token.
     */
    private parseDataToken() {
        const memoryLocationToken = this.getNextToken();
        let memoryLocation = memoryLocationToken.value;

        if (!memoryLocationToken.is(TokenType.INTEGER))
            throw new AssemblerError('Data instruction expects to receive a memory location as it\'s first param.', memoryLocationToken);

        while (this.tokens[0].is(TokenType.INTEGER)) {
            let dataToken = this.getNextToken();
            this.data.set(memoryLocation, dataToken.value);
            memoryLocation++;
        }
        this.maxDataOffset = (this.maxDataOffset < memoryLocation) ? memoryLocation : this.maxDataOffset;

        if (memoryLocation === memoryLocationToken.value)
            throw new AssemblerError('The data instruction expects at least one value.', this.tokens[0]);
    }

    /**
     * Distinct from a Program Label Token, a label reference is an instruction argument.
     *
     * Before assembling the program, all label references must be accounted for.
     *
     * Multiple instructions may reference the same Program Label, so we store references in a
     * one-to-many structure.
     *
     * @param label - The labelname
     * @param instructionIndex - the program index, or the location in the assembly where the label reference occurred
     * @param parameterIndex - the argument number the label reference exists at.
     */
    private addLabelReference(label: string, instructionIndex: number, parameterIndex: number) {
        let references: Array<ILabelReference> = this.labelReferences.get(label) || [];
        references.push({instructionIndex, parameterIndex});

        this.labelReferences.set(label, references);
    }

    /**
     * Resolve any label references associated with a label name to a location in memory
     *
     * @param labelName - Name of the program label
     * @param memoryLocation - Location in memory
     */
    private resolve(labelName: string, memoryLocation: number) {
        const references = this.labelReferences.get(labelName) || [];

        references.forEach(reference => {
            const {instructionIndex, parameterIndex} = reference;

            this.instructions[instructionIndex].resolveLabel(parameterIndex, labelName, memoryLocation);
        });

        //Once the labels have been resolved to actual memory locations, remove them.
        // If some exist after all memory calculations have been made, it means that
        // some instructions reference labels that do not exist and the program is
        // not valid.
        this.labelReferences.delete(labelName!);
    }

    /**
     * For all instructions in the assembly, determine where they belong in memory.
     * The following algorithm is used:
     *
     *  Starting from the Chip8 program offset as an initial memory index and 0 as the initial program index,
     *
     *  If data exists at a given memory index, increment the memory index by one until no data occupies the current index
     *
     *  If a label exists at a given program index, resolve all references to that label with the current memory index
     *
     *  Associate the instruction at program index with the current memory index and move on to the next instruction.
     *  Note: memoryIndex must be incremented by two because instructions occupy two bytes in memory.
     */
    private calculateMemoryLocations(): { [key: number]: AsmInstruction } {
        const memoryLocations: { [key: number]: AsmInstruction } = {};

        let programIndex = 0;
        let memoryIndex = PROGRAM_OFFSET;

        for (; programIndex < this.instructions.length; programIndex += 1, memoryIndex += 2) {
            const instruction = this.instructions[programIndex];
            //skip any locations in memory reserved for data
            while (this.data.has(memoryIndex))
                memoryIndex += 1;

            //if a label exists at this program index, we need to resolve any instructions that refer to it
            const labelName = this.labelLocations.get(programIndex);
            if (labelName)
                this.resolve(labelName, memoryIndex);

            //If there's not enough room to write the current instruction into memory, the program isn't valid
            if (this.data.has(memoryIndex + 1))
                throw new AssemblerError(`Data and Instruction collide at ${memoryIndex}`, instruction.instruction);

            memoryLocations[memoryIndex] = instruction;
        }

        //There can exist labels that are not referenced, but a program that references non-existent labels is invalid.
        if (this.labelReferences.size > 0)
            throw new AssemblerError('The assembly references labels that do not exist');

        return memoryLocations;
    }

    /**
     * Calculate the size of the program and the memory locations of data / instructions.
     * For each byte in the program, write data and assembled instructions to a buffer.
     */
    private generateProgram(): Uint8Array {
        const programSize: number = Math.max(
            this.maxDataOffset - PROGRAM_OFFSET,
            this.instructions.length * 2 + this.data.size
        );
        const program: Array<number> = new Array<number>(programSize).fill(0);
        const memoryMap = this.calculateMemoryLocations();

        //The program is invalid if the calculated program size if greater
        // than the size of the chip8 memory space.
        //Note: we have to account from whatever the program size it + the program offset.
        if ((programSize+PROGRAM_OFFSET) > MEMORY_LENGTH)
            throw new AssemblerError('Assembled program is greater than max chip memory space.');

        for (let programIndex = 0; programIndex < programSize; programIndex += 1) {
            let memoryIndex = programIndex + PROGRAM_OFFSET;

            if (this.data.has(memoryIndex))
                program[programIndex] = this.data.get(memoryIndex)!;

            if (memoryMap[memoryIndex]) {
                const opcode = memoryMap[memoryIndex].assemble();
                const HIGH = (opcode & 0xFF00) >> 8;
                const LOW = (opcode & 0xFF) || 0;
                program[programIndex] = HIGH;
                program[++programIndex] = LOW;
            }
        }

        return new Uint8Array(program);
    }
}