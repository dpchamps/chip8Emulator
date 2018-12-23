import {TokenType} from "./types/TokenType";
import {toHexString} from './util/OpcodeUtils';

export class Token {
    type: TokenType;
    value: any;

    constructor(type: TokenType, value: any) {
        this.type = type;
        this.value = value;
    }

    is(tokenType: TokenType): boolean {
        return this.type === tokenType;
    }

    like(token: Token): boolean {
        return this.type === token.type;
    }

    equals(value: any): boolean {
        return this.value === value;
    }

    toString(): string {
        switch (this.type) {
            case TokenType.REGISTER:
                return `$${toHexString(Number(this.value))}`;
            case TokenType.INTEGER:
                return `${toHexString(Number(this.value))}h`;
            case TokenType.LABEL:
                return `:${this.value}`;
            case TokenType.INSTRUCTION:
            case TokenType.VOID:
            default:
                return `${this.value}`;
        }
    }

    DEBUG(): string {
        return `${this.type} TOKEN (${this.value})`
    }
}