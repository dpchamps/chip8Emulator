import {Token} from "../Token";
import {TokenType} from "../types/TokenType";
import {AssemblerError} from "../errors/AssemblerError";
import {IOpcodeBytes} from "../interfaces/IOpcodeBytes";
import {IAssemblyData} from "../interfaces/IAssemblyData";

export abstract class AsmInstruction {
    public abstract readonly assemblyData: IAssemblyData;

    protected abstract setBytesFromInstruction(): void;

    protected abstract setBytesFromParams(): void;

    protected params: Array<Token> = [];

    protected bytes: IOpcodeBytes = {
        msb: 0,
        lsb: 0,
        x: 0,
        y: 0,
        kk: 0,
        nnn: 0
    };

    readonly instruction: Token;

    constructor(instruction: Token) {
        this.instruction = instruction;
    }

    public addParam(token: Token) {
        if (token.is(TokenType.DATA) || token.is(TokenType.INSTRUCTION))
            throw new AssemblerError('Attempted to add an invalid token as an instruction parameter', token);

        this.params.push(token);
    }

    public resolveLabel(paramNumber: number, labelName: string, memoryLocation: number): void {
        const param = this.params[paramNumber];

        if (typeof param === 'undefined' || !param.is(TokenType.LABEL))
            throw new AssemblerError('Attempted to resolve a label that doesn\'t exist.');

        if (!param.equals(labelName))
            throw new AssemblerError(`Attempted to resolve mismatched label ${labelName}`, param);

        this.params[paramNumber] = new Token(TokenType.INTEGER, memoryLocation);
    }

    public assemble(): number {
        this.validate();
        this.setBytesFromInstruction();
        this.setBytesFromParams();

        //prep the opcode bytes for assembling into a proper opcode
        this.bytes = {
            ...this.bytes,
            msb: this.bytes.msb << 12,
            x: this.bytes.x << 8,
            y: this.bytes.y << 4,
        };

        return this.assemblyData.assemblyBytes
            .map(byte => this.bytes[byte])
            .reduce((number, nextByte) => number | nextByte, 0);
    }

    /**
     * Preform validation on the assembler. If too few or too many parameters have been added, the assembler will
     * not be able to produce a valid program.
     */
    protected validate() {
        if (this.params.length !== this.assemblyData.nArgs) {
            throw new AssemblerError(`Expected exactly ${this.assemblyData.nArgs} parameters, but got ${this.params.length} instead.`, this.instruction);
        }
    }
}