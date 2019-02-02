import {AsmInstruction} from "../../../src/asmInstructions/AsmInstruction";
import {IAssemblyData} from "../../../src/interfaces/IAssemblyData";
import {OPCODE_BYTE} from "../../../src/types/OpcodeByte";
import {Token} from "../../../src/Token";
import {TokenType} from "../../../src/types/TokenType";
import {Instruction} from "../../../src/types/Instruction";
import {AssemblerError} from "../../../src/errors/AssemblerError";

class TestAsmInstruction extends AsmInstruction {
    readonly assemblyData: IAssemblyData = {
        nArgs: 2,
        assemblyBytes: [OPCODE_BYTE.MSB, OPCODE_BYTE.NNN]
    };

    protected setBytesFromInstruction(): void {
        this.bytes.msb = 0xA;
    }

    protected setBytesFromParams(): void {
        this.bytes.nnn = this.params[0].value;
    }

}

describe('AsmInstruction', () => {
    let t: TestAsmInstruction;
    beforeEach(() => {
        t = new TestAsmInstruction(new Token(TokenType.INSTRUCTION, Instruction.NOOP));
    });
    it('Should assemble bytes to an opcode', () => {
        t.addParam(new Token(TokenType.INTEGER, 0x5));
        t.addParam(new Token(TokenType.INTEGER, 0x5));

        expect(t.assemble()).toBe(0xA005);
    });

    it('Should throw an assembler error upon receiving too many parameters', () => {
        t.addParam(new Token(TokenType.INTEGER, 0x5));
        t.addParam(new Token(TokenType.INTEGER, 0x5));
        t.addParam(new Token(TokenType.INTEGER, 0x5));

        expect(() => {
            t.assemble()
        }).toThrow(AssemblerError);
    });

    it('Should throw an assembler error upon receiving too few parameters', () => {
        t.addParam(new Token(TokenType.INTEGER, 0x5));

        expect(() => {
            t.assemble()
        }).toThrow(AssemblerError);
    });

    it('Should throw an assembler error upon receiving a non integer, register, or label token as a param', () => {
        expect(() => {
            t.addParam(new Token(TokenType.DATA, 0x5));
        }).toThrow(AssemblerError);
    });

    it('Should resolve a label', () => {
        t.addParam(new Token(TokenType.LABEL, 'label'));

        t.resolveLabel(0, 'label', 0xABC);
    });

    it('Should throw an error upon receiving an invalid param to resolve', () => {
        t.addParam(new Token(TokenType.INTEGER, 0x1));
        t.addParam(new Token(TokenType.LABEL, 'label'));

        expect(() => {
            t.resolveLabel(0, 'label', 0x500)
        }).toThrowError(AssemblerError)
    });

    it('Should throw an error upon receiving a mismatched label', () => {
        t.addParam(new Token(TokenType.INTEGER, 0x1));
        t.addParam(new Token(TokenType.INTEGER, 0x1));
        expect(() => {
            t.resolveLabel(1, 'take-damage', 0x500)
        }).toThrowError(AssemblerError)
    });

});