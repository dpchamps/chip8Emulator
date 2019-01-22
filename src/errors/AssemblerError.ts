import {Token} from "../Token";
import {TokenType} from "../types/TokenType";

export class AssemblerError extends Error {
    token: Token;
    message: string;

    constructor(message: string, token?: Token) {
        super();

        this.token = token || new Token(TokenType.VOID, null);
        this.message = message
    }

    toString() {
        return `[ASSEMBLER ERROR] - The Assembler encountered an error.
Token: ${this.token.DEBUG()}        
@[line, col] ${this.token.lineNumber}, ${this.token.colNumber}: ${this.message}`;
    }
}

export class InternalAssemblerError extends Error {
    message: string;
    code: ASM_ERROR_CODE;

    constructor(code: ASM_ERROR_CODE, message?: string) {
        super();
        this.message = message || '';
        this.code = code;
    }

    toString() {
        return `[INTERNAL ASSEMBLER ERROR] ${this.code} - ${this.message}`;
    }
}

export const enum ASM_ERROR_CODE {
    INSTRUCTION_NOT_IMPLEMENTED,
    UNEXPECTED_UNDEFINED_VALUE
}