import {Token} from "../../src/Token";
import {TokenType} from "../../src/types/TokenType";
import {Instruction} from "../../src/types/Instruction";

describe('Token', () => {
    test('instantiation', () => {
        new Token(TokenType.LABEL, '');
    });

    test('toString', () => {
        const registerToken = new Token(TokenType.REGISTER, 0xA);
        const integerToken = new Token(TokenType.INTEGER, 9);
        const labelToken = new Token(TokenType.LABEL, 'myLabel');
        const instructionToken = new Token(TokenType.INSTRUCTION, Instruction.RET);

        expect(registerToken.toString()).toBe(`$A`);
        expect(integerToken.toString()).toBe(`9h`);
        expect(labelToken.toString()).toBe(`:myLabel`);
        expect(instructionToken.toString()).toBe(`${Instruction.RET}`);
    });

    test('is', () => {
        const token = new Token(TokenType.INSTRUCTION, Instruction.DRAW);

        expect(token.is(TokenType.INSTRUCTION)).toBe(true)
        expect(token.is(TokenType.VOID)).toBe(false);
    });

    test('like', () => {
        const token1 = new Token(TokenType.VOID, null);
        const token2 = new Token(TokenType.INTEGER, 11);
        const token3 = new Token(TokenType.INTEGER, 11);
        const token4 = new Token(TokenType.INTEGER, 99);

        expect(token1.like(token2)).toBe(false);
        expect(token2.like(token3)).toBe(true);
        expect(token2.like(token4)).toBe(true);
    });

    test('equals', () => {
        const uniqueVoidTokenValue = Symbol();
        const token1 = new Token(TokenType.INSTRUCTION, Instruction.DRAW);
        const token2 = new Token(TokenType.VOID, uniqueVoidTokenValue);
        const token3 = new Token(TokenType.LABEL, "aLabel");

        expect(token1.equals(Instruction.DRAW)).toBe(true);
        expect(token1.equals(Instruction.RET)).toBe(false);

        expect(token2.equals(uniqueVoidTokenValue)).toBe(true);
        expect(token2.equals(Symbol())).toBe(false);

        expect(token3.equals('aLabel')).toBe(true);
        expect(token3.equals(1234)).toBe(false);
    });

    test('DEBUG', () => {
        const token = new Token(TokenType.INSTRUCTION, Instruction.NOOP);
        const token1 = new Token(TokenType.INTEGER, 90);

        expect(token.DEBUG()).toBe(`INSTRUCTION TOKEN (NOOP)`);
        expect(token1.DEBUG()).toBe(`INTEGER TOKEN (90)`);
    });
});