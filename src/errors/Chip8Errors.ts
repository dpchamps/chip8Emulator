import {toHexString, toOpcodeString} from "../util/OpcodeUtils";
import {Opcode} from "../Opcode";

class Chip8Error extends Error {
    constructor(message: string, ...args: any) {
        super(args);
        this.message = message;
    }

    toString(): string {
        return `${this.constructor.name} - ${this.message}`;
    }
}

export class DisassemblerError extends Chip8Error {
    opcode: number;
    address: number;

    constructor(address: number, opcode: number, message: string) {
        super(message);
        this.address = address;
        this.opcode = opcode;
    }

    toString(): string {
        return `Couldn't disassemble opcode ${toOpcodeString(this.opcode)} from address ${toHexString(this.address)}, ${this.message}`;
    }
}

export class StackOverflowError extends Chip8Error {
    programCounter: number;
    opcode: Opcode;

    constructor(programCounter: number, opcode: Opcode, message?: string) {
        super(message || '');
        this.programCounter = programCounter;
        this.opcode = opcode;
    }

    toString() {
        return `The program caused a stack overflow at address ${toHexString(this.programCounter)} from opcode ${this.opcode}`;
    }
}

export class IllegalMemorySpace extends Chip8Error{
    programCounter: number;
    opcode: Opcode;

    constructor(programCounter: number, opcode: Opcode, message?: string) {
        super(message || '');
        this.programCounter = programCounter;
        this.opcode = opcode;
    }

    toString() {
        return `The program accessed illegal memory space ${toHexString(this.programCounter)} from opcode ${this.opcode}`;
    }
}