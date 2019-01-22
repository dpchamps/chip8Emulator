import {IOpcodeBytes} from "./interfaces/IOpcodeBytes";
import {parseOpcode, toOpcodeString} from "./util/OpcodeUtils";
import {Instruction} from "./types/Instruction";
import {Token} from "./Token";
import {TokenType} from "./types/TokenType";

export class Opcode {
    bytes: IOpcodeBytes;
    rawOpcode: number;
    instruction: Token;
    args: Array<Token>;
    label?: Token;
    comments: Map<string, string>;
    strict: boolean;

    static INSTRUCTION_PADDING: number = 6;
    static ARGUMENTS_PADDING: number = 20;

    constructor(opcode: number, strict: boolean = true) {
        this.strict = strict;
        this.rawOpcode = opcode;
        this.bytes = parseOpcode(opcode);
        this.comments = new Map();

        this.instruction = new Token(TokenType.INSTRUCTION, this.getInstructionToken());
        this.args = this.getArgs();
    }

    toString(): string {
        const instruction = this.instruction.toString().padEnd(Opcode.INSTRUCTION_PADDING, ' ');
        const comments = Array.from(this.comments).reduce((str, [key, val]) => `${str}; ${key} : ${val}`, '');
        const args = this.args.map(token => token.toString()).join(', ').padEnd(Opcode.ARGUMENTS_PADDING, ' ');

        if (this.label) {
            return `${instruction}${this.label.toString().padEnd(Opcode.ARGUMENTS_PADDING, ' ')}${comments}`;
        }

        return `${instruction}${args}${comments}`;
    }

    private getInstructionToken(): Instruction {
        switch (this.bytes.msb) {
            case 0x0:
                switch (this.bytes.kk) {
                    case 0xE0:
                        return Instruction.CLS;
                    case 0xEE:
                        return Instruction.RET;
                }
                break;
            case 0x1:
                return Instruction.JMP;
            case 0x2:
                return Instruction.JSR;
            case 0x3:
                return Instruction.SKEQ;
            case 0x4:
                return Instruction.SKNE;
            case 0x5:
                return Instruction.SKEQ;
            case 0x6:
                return Instruction.MOV;
            case 0x7:
                return Instruction.ADD;
            case 0x8:
                switch (this.bytes.lsb) {
                    case 0x0:
                        return Instruction.MOV;
                    case 0x1:
                        return Instruction.OR;
                    case 0x2:
                        return Instruction.AND;
                    case 0x3:
                        return Instruction.XOR;
                    case 0x4:
                        return Instruction.ADD;
                    case 0x5:
                        return Instruction.SUB;
                    case 0x6:
                        return Instruction.SHR;
                    case 0x7:
                        return Instruction.RSB;
                    case 0xE:
                        return Instruction.SHL;
                }
                break;
            case 0x9:
                return Instruction.SKNE;
            case 0xA:
                return Instruction.MVI;
            case 0xB:
                return Instruction.JMI;
            case 0xC:
                return Instruction.RAND;
            case 0xD:
                return Instruction.DRAW;
            case 0xE:
                switch (this.bytes.kk) {
                    case 0x9E:
                        return Instruction.SKPR;
                    case 0xA1:
                        return Instruction.SKUP;
                }
                break;
            case 0xF:
                switch (this.bytes.kk) {
                    case 0x07:
                        return Instruction.GDEL;
                    case 0x0A:
                        return Instruction.KEY;
                    case 0x15:
                        return Instruction.SDEL;
                    case 0x18:
                        return Instruction.SSND;
                    case 0x1E:
                        return Instruction.ADI;
                    case 0x29:
                        return Instruction.FONT;
                    case 0x33:
                        return Instruction.BCD;
                    case 0x55:
                        return Instruction.STR;
                    case 0x65:
                        return Instruction.LDR;
                }
                break;
        }

        if (this.strict) {
            throw new TypeError(`Opcode has no valid instruction: ${this.rawOpcode}`);
        } else {
            return Instruction.NOOP;
        }
    }

    private getArgs(): Array<Token> {
        switch (this.instruction.value) {
            case Instruction.CLS:
            case Instruction.RET:
                return [];
            case Instruction.JMP:
            case Instruction.JSR:
                return this.getArgs_NNN(true);
            case Instruction.MVI:
            case Instruction.JMI:
                return this.getArgs_NNN(false);
            case Instruction.SKEQ:
            case Instruction.SKNE:
            case Instruction.MOV:
            case Instruction.RAND:
            case Instruction.OR:
            case Instruction.AND:
            case Instruction.XOR:
            case Instruction.ADD:
            case Instruction.SUB:
            case Instruction.RSB:
                if (
                    [0x3, 0x4, 0x6, 0xC, 0x7].includes(this.bytes.msb)
                ) {
                    return this.getArgs_XNN();
                } else if (
                    [0x5, 0x9, 0x8].includes(this.bytes.msb)
                ) {
                    return this.getArgs_XY()
                }
                break;
            case Instruction.SHR:
            case Instruction.SHL:
            case Instruction.SKPR:
            case Instruction.SKUP:
            case Instruction.GDEL:
            case Instruction.KEY:
            case Instruction.SDEL:
            case Instruction.SSND:
            case Instruction.ADI:
            case Instruction.FONT:
            case Instruction.BCD:
                return this.getArgs_XREG();
            case Instruction.STR:
            case Instruction.LDR:
                return this.getArgs_XINT();
            case Instruction.DRAW:
                return this.getArgs_XYZ();
            default:
                return [new Token(TokenType.DATA, this.rawOpcode)];
        }

        throw new TypeError(`Opcode has no valid args: ${this.rawOpcode}`);
    }

    private getArgs_XYZ(): Array<Token> {
        return [
            new Token(TokenType.REGISTER, this.bytes.x),
            new Token(TokenType.REGISTER, this.bytes.y),
            new Token(TokenType.INTEGER, this.bytes.lsb),
        ];
    }

    private getArgs_NNN(isLabel: boolean): Array<Token> {
        if (isLabel)
            this.label = new Token(TokenType.LABEL, `label-${toOpcodeString(this.bytes.nnn)}`);

        return [
            new Token(TokenType.INTEGER, this.bytes.nnn)
        ];
    }

    private getArgs_XNN(): Array<Token> {
        return [
            new Token(TokenType.REGISTER, this.bytes.x),
            new Token(TokenType.INTEGER, this.bytes.kk)
        ];
    }

    private getArgs_XY(): Array<Token> {
        return [
            new Token(TokenType.REGISTER, this.bytes.x),
            new Token(TokenType.REGISTER, this.bytes.y)
        ];
    }

    private getArgs_XREG(): Array<Token> {
        return [
            new Token(TokenType.REGISTER, this.bytes.x)
        ];
    }

    private getArgs_XINT(): Array<Token> {
        return [
            new Token(TokenType.INTEGER, this.bytes.x)
        ];
    }

}