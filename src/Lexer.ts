import {Token} from "./Token";
import {TokenType} from "./types/TokenType";
import {LexerError} from "./errors/LexerErrors";
import {BIN_RADIX, CHAR, COMMENT, DIGIT, HEX_RADIX, LABEL, NEWLINE, OCT_RADIX, RADIX, REGISTER, WHITESPACE} from "./LexerSymbol";
import {Instruction} from "./types/Instruction";

const VALID_INSTRUCTION_TOKEN = new RegExp(Object.keys(Instruction).join('|'));
type LexerSymbol = RegExp;

/**
 * An ASM Lexer.
 *
 * Given some Chip8 Disassembly, produce a stream of tokens.
 */
export class Lexer {
    tokens: Array<Token> = [];

    private readonly buffer: string;
    private currentChar: string | null = null;
    private currentLine: number = 1;
    private currentCol: number = 1;
    private index: number = 0;


    constructor(buffer: string) {
        this.buffer = buffer;
        this.currentChar = this.buffer[this.index] || null;
    }

    tokenize(): Array<Token> {
        let lastToken = new Token(TokenType.VOID, null);

        while (lastToken.type !== TokenType.EOF) {
            lastToken = this.getNextToken();
            this.tokens.push(lastToken);
        }

        return this.tokens;
    }

    /**
     * Determine if the current char matches a LexerSymbol
     * @param matcher - The lexer symbol to compare against the current char.
     */
    private is(matcher: LexerSymbol): boolean {
        if (this.currentChar === null)
            return false;

        return this.currentChar.match(matcher) !== null;
    }

    /**
     * Consume the current char, advance to the next.
     *
     * Keeps track of the position of the lexer in terms of lines / columns.
     * If the character at the next index is undefined, the next character will be null.
     */
    private advance() {
        this.index += 1;
        this.currentCol += 1;
        this.currentChar = this.buffer[this.index] || null;

        if (this.is(NEWLINE)) {
            this.currentLine += 1;
            this.currentCol = 1;
        }
    }

    /**
     * For error reporting. Returns the last and next couple of characters, emphasizing the current char.
     */
    private getContext(): string {
        const startIdx = (this.index - 5) < 0 ? 0 : this.index - 5;
        const endIdx = (this.index + 5) > this.buffer.length ? this.buffer.length : this.index + 5;
        const pre = this.buffer.slice(startIdx, this.index);
        const post = this.buffer.slice(this.index + 1, endIdx);

        return `${pre} > ${this.currentChar} < ${post}`.replace(/\n/, '\\n');
    }

    private skipWhitespace(): void {
        while (this.is(WHITESPACE))
            this.advance();
    }

    private skipComment(): void {
        //skip up to the new line
        while (!this.is(NEWLINE) && this.currentChar !== null)
            this.advance();

        //eat the newline and remaining space
        this.skipWhitespace();
    }

    /**
     * Attempts to lex a digit. If it fails, it rolls back the advances and returns a number that is NaN
     */
    private getDigit(): number {
        let str = '';

        while (this.is(DIGIT)) {
            str += this.currentChar;
            this.advance();
        }

        //If no radix, the digit is assumed to be base10
        if (this.is(RADIX)) {
            switch (this.currentChar!.toLowerCase()) {
                case HEX_RADIX:
                    str = '0x' + str;
                    break;
                case OCT_RADIX:
                    str = '0o' + str;
                    break;
                case BIN_RADIX:
                    str = '0b' + str;
            }
            //clear the radix symbol
            this.advance();
        }

        //Because we're anticipating hexadecimal digits, there's some potential collision between char / digit
        // e.g: AND $1, $2; the `AND` string will be lexed as a digit first (a is a valid digit).
        // So when we get to the end of our digit, we check if it's actually a number. If not, rollback the changes.
        if (isNaN(Number(str))) {
            this.index -= str.length + 1;
            this.advance();
        }

        return Number(str);
    }


    private getRegister(): number {
        let str = '';

        //skip the initial register symbol
        this.advance();

        while (this.is(DIGIT)) {
            str += this.currentChar;
            this.advance();
        }

        return Number('0x' + str);
    }

    /**
     * Safety first: Does not allow for invalid instructions.
     */
    private getInstruction(): string {
        let str = '';

        while (this.is(CHAR)) {
            str += this.currentChar!.toUpperCase();
            this.advance();
        }

        //Ensure that the current string is a valid asm instruction
        if (str.match(VALID_INSTRUCTION_TOKEN) === null)
            throw new LexerError(this.currentLine, this.currentCol, this.getContext(), `Encountered an invalid instruction: ${str}.`);

        return str;
    }

    /**
     * Safety first, does not allow for empty labels
     */
    private getLabel(): string {
        let str = '';

        //clear initial label symbol
        this.advance();

        while (!this.is(WHITESPACE) && this.currentChar !== null) {
            str += this.currentChar;
            this.advance();
        }

        if (str === '')
            throw new LexerError(this.currentLine, this.currentCol, this.getContext(), 'Encountered an empty label.');

        return str;
    }

    private getNextToken(): Token {
        this.skipWhitespace();

        if (this.is(COMMENT))
            this.skipComment();

        const lineNum = this.currentLine;
        const colNum = this.currentCol;

        //Digit takes precedent over char, explained in digit comments above
        if (this.is(DIGIT)) {
            const digit = this.getDigit();
            if (!isNaN(digit))
                return new Token(TokenType.INTEGER, digit, lineNum, colNum);
        }

        if (this.is(CHAR)) {
            const instruction = this.getInstruction();
            const tokenType = instruction.toUpperCase() === 'DATA' ? TokenType.DATA : TokenType.INSTRUCTION;
            return new Token(tokenType, instruction, lineNum, colNum);
        }

        if (this.is(LABEL)) {
            return new Token(TokenType.LABEL, this.getLabel(), lineNum, colNum);
        }

        if (this.is(REGISTER)) {
            return new Token(TokenType.REGISTER, this.getRegister(), lineNum, colNum);
        }

        if (this.currentChar === null) {
            return new Token(TokenType.EOF, null, lineNum, colNum);
        }

        throw new LexerError(this.currentLine, this.currentCol, this.getContext(), `Encountered an unexpected symbol.`);
    }
}