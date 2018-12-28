import {toHexString, toOpcodeString} from "../util/OpcodeUtils";

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