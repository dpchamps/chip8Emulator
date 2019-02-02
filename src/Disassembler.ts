import {MEMORY_LENGTH, PROGRAM_OFFSET, STACK_LENGTH} from "./types/Chip8Specs";
import {Opcode} from "./Opcode";
import {Token} from "./Token";
import {Instruction} from "./types/Instruction";
import {DisassemblerError} from "./errors/Chip8Errors";
import {toHexString, toOpcodeString} from "./util/OpcodeUtils";
import {DataCode} from "./DataCode";

export class Disassembler {
    static MAX_BRANCHES = STACK_LENGTH * 3;
    buffer: Array<number>;
    stack: Array<number>;
    reachableAddresses: Map<number, Opcode>;
    labels: Map<number, Token>;
    program: Array<string>;
    addComments: boolean;

    constructor(buffer: Uint8Array, addComments = true) {
        this.buffer = Array.from(buffer);
        this.stack = [PROGRAM_OFFSET];
        this.reachableAddresses = new Map();
        this.labels = new Map();
        this.program = [];
        this.addComments = addComments;

        this.disassemble();
    }

    disassemble(): void {
        while (this.stack.length > 0)
            this.walkBranch(this.stack.pop()!);

        this.program = this.generateProgram();
    }

    toString() {
        return this.program.join('\n');
    }

    toRawString(): string {
        return this.buffer.reduce((str: string, opcode: number, index: number) => {
            const isNewLine = (index !== 0 && index % 16 === 0);
            return `${str}${toHexString(opcode)} ${isNewLine ? '\n' : ''}`;
        }, "")
    }

    private walkBranch(address: number): void {
        while (address < this.buffer.length + PROGRAM_OFFSET - 1 && !this.reachableAddresses.has(address)) {
            const opcode = this.getOpcodeFromOffsetAddress(address);
            const lastAddress = address;

            this.reachableAddresses.set(address, opcode);

            if (opcode.instruction.equals(Instruction.RET)) {
                break;
            }

            address = this.getNextAddress(address, opcode);

            if (address >= MEMORY_LENGTH)
                throw new DisassemblerError(lastAddress, opcode.rawOpcode, `Program exceeds max address space, ${toHexString(address)}`);
            if (this.stack.length > Disassembler.MAX_BRANCHES)
                throw new DisassemblerError(lastAddress, opcode.rawOpcode, `Program exceeds the max stack length`);
        }
    }

    private getNextAddress(currentAddress: number, currentOpcode: Opcode): number {
        let nextAddress = currentAddress + 2;

        switch (currentOpcode.instruction.value) {
            case Instruction.JMP:
                nextAddress = currentOpcode.bytes.nnn;
                this.labels.set(nextAddress, currentOpcode.label!);
                break;
            case Instruction.JSR:
                this.stack.push(nextAddress);
                nextAddress = currentOpcode.bytes.nnn;
                this.labels.set(nextAddress, currentOpcode.label!);
                break;
            case Instruction.SKEQ:
            case Instruction.SKNE:
            case Instruction.SKUP:
            case Instruction.SKPR:
                this.stack.push(nextAddress);
                nextAddress += 2;
                break;
            case Instruction.MVI:
            //let's think about this
        }

        return nextAddress;
    }

    private generateProgram(): Array<string> {
        let program: Array<string> = [];
        let data: Array<string> = [];
        let address: number = PROGRAM_OFFSET;

        while (address <= this.buffer.length + PROGRAM_OFFSET - 1) {
            if (this.labels.has(address))
                program.push(this.labels.get(address)!.toString());
            if (this.reachableAddresses.has(address)) {
                program.push(this.reachableAddresses.get(address)!.toString());
            } else {
                const dataCode = new DataCode(address, this.buffer[address - PROGRAM_OFFSET]);
                data.push(dataCode.toString());
            }

            address += (this.reachableAddresses.has(address)) ? 2 : 1;
        }

        return [...program, ...data];
    }

    private getOpcodeFromOffsetAddress(address: number): Opcode {
        const localAddress = address - PROGRAM_OFFSET;
        const HIGH = this.buffer[localAddress] << 8;
        const LOW = this.buffer[localAddress + 1] || 0;
        const rawOpcode = HIGH | LOW;
        const opcode = new Opcode(rawOpcode, false);

        if (this.addComments) {
            opcode.comments.set('addr', toHexString(address));
            opcode.comments.set('opcode', toOpcodeString(opcode.rawOpcode));
        }

        return opcode
    }
}
