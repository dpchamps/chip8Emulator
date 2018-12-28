import {Token} from "./Token";
import {TokenType} from "./types/TokenType";
import {Instruction} from "./types/Instruction";

export class DataCode {
    instruction: Token;
    address: Token;
    value: Token;

    constructor(address: number, value: number) {
        this.instruction = new Token(TokenType.INSTRUCTION, Instruction.DATA);
        this.address = new Token(TokenType.INTEGER, address);
        this.value = new Token(TokenType.INTEGER, value);
    }

    toString() {
        return `${this.instruction.toString()}\t${this.address.toString()}, ${this.value.toString()}`;
    }
}