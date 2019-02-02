import {Lexer} from "../../src/Lexer";
import {LexerError} from "../../src/errors/LexerErrors";
import {TokenType} from "../../src/types/TokenType";
import {Instruction} from "../../src/types/Instruction";

describe('Lexer', () => {
    const validASM = `DRAW $1, $2, 3h
    JSR :wiggle ; jump into the wiggle routine
    ADD $A, $B
    :wiggle
    XOR $F, ABh
    SKEQ $A, $F
    SSND $F
    RET`;

    it('Should tokenize valid asm', () => {
        const lexer = new Lexer(validASM);
        const tokens = lexer.tokenize();

        expect(tokens).toHaveLength(20);
    });

    describe('digits', () => {
        it('Should produce correct decimal digits', () => {
            const lexerDec = new Lexer('1 2 3 10 20');
            const decDigits = lexerDec.tokenize();
            const [one, two, three, ten, twenty] = decDigits;

            //get rid of EOF
            decDigits.pop();

            expect(decDigits).toHaveLength(5);
            decDigits.forEach(token => expect(token.type).toBe(TokenType.INTEGER));
            expect(one.value).toBe(1);
            expect(two.value).toBe(2);
            expect(three.value).toBe(3);
            expect(ten.value).toBe(10);
            expect(twenty.value).toBe(20);
        });

        it('Should produce correct hexadecimal digits', () => {
            const lexerHex = new Lexer('1h 2h Ah Ch FFh');
            const hexDigits = lexerHex.tokenize();
            const [one, two, ten, twelve, twofiftyfive] = hexDigits;

            hexDigits.pop();

            expect(hexDigits).toHaveLength(5);
            hexDigits.forEach(token => expect(token.type).toBe(TokenType.INTEGER))
            expect(one.value).toBe(1);
            expect(two.value).toBe(2);
            expect(ten.value).toBe(10);
            expect(twelve.value).toBe(12);
            expect(twofiftyfive.value).toBe(255);
        });

        it('Should produce correct octal digits', () => {
            const lexerOct = new Lexer('1o 2o 12o 14o 100o');
            const octDigits = lexerOct.tokenize();
            const [one, two, ten, twelve, sixtyfour] = octDigits;
            octDigits.pop();

            octDigits.forEach(token => expect(token.type).toBe(TokenType.INTEGER));

            expect(one.value).toBe(1);
            expect(two.value).toBe(2);
            expect(ten.value).toBe(10);
            expect(twelve.value).toBe(12);
            expect(sixtyfour.value).toBe(64);
        });

        it('Shouldnt parse non-integers as digits', () => {
            const lex = new Lexer('AND OR');
            const tokens = lex.tokenize();
            const [and, or] = tokens;

            expect(and.type).not.toBe(TokenType.INTEGER);
            expect(or.type).not.toBe(TokenType.INTEGER);
            expect(tokens).toHaveLength(3);
        });
    });

    it('Should disregard all whitespace', () => {
        const lex = new Lexer(`                         AND 1h 
           
           
           
           
           
           
           
           $3 \t\t\t\t\t\t :some-label`);

        const tokens = lex.tokenize();

        expect(tokens).toHaveLength(5);
    });

    it('Should not tokenize comments', () => {
        const lex = new Lexer(`;author : deon sanders
            And 1, 2
            ;DRAW $1, $2, 6h
            CLS ; clear the screen`);

        const tokens = lex.tokenize();
        const [and, one, two, clearscreen] = tokens;

        expect(tokens).toHaveLength(5);
        expect(and.type).toBe(TokenType.INSTRUCTION);
        expect(one.type).toBe(TokenType.INTEGER);
        expect(two.type).toBe(TokenType.INTEGER);
        expect(clearscreen.type).toBe(TokenType.INSTRUCTION);
    });

    it('Should tokenize registers', () => {
        const lex = new Lexer(`$1 $2 $A $FF`);
        const tokens = lex.tokenize();

        expect(tokens).toHaveLength(5);
        tokens.pop();
        tokens.forEach(token => expect(token.type).toBe(TokenType.REGISTER));
        //registers are always in hexadecimal
        expect(tokens[0].value).toBe(1);
        expect(tokens[1].value).toBe(2);
        expect(tokens[2].value).toBe(10);
        expect(tokens[3].value).toBe(255);
    });

    describe('labels', () => {
        it('Should tokenize labels', () => {
            const lex = new Lexer(':label-in-first-position\n\nJSR :label-in-second-position');
            const tokens = lex.tokenize();

            expect(tokens).toHaveLength(4);
            expect(tokens[0].value).toBe('label-in-first-position');
            expect(tokens[2].value).toBe('label-in-second-position');
        });

        it('Should throw an error when encountering an empty label', () => {
            const lex = new Lexer('JSR :jumpy-jumpy\n\n :\n AND 1, 2');
            const shouldThrow = () => {
                lex.tokenize();
            };

            expect(shouldThrow).toThrow(LexerError);
        });
    });

    describe('characters', () => {
        it('Should produce tokens for valid instructions', () => {
            const instructions = Object.keys(Instruction);
            const lex = new Lexer(instructions.join(' '));
            const tokens = lex.tokenize();

            tokens.pop();

            tokens.forEach((token, index) => {
                if (token.equals(Instruction.DATA)) {
                    //Account for a special case here: DATA instructions are not instruction tokens, but
                    //  a message for the assembler.
                    expect(token.type).toBe(TokenType.DATA);
                } else {
                    expect(token.type).toBe(TokenType.INSTRUCTION);
                }
                expect(token.value).toBe(instructions[index]);
            });
        });

        it('Should throw an error upon receiving an invalid instruction', () => {
            const lex = new Lexer("PINECONE $1, $2, 3h");
            const shouldThrow = () => {
                lex.tokenize();
            };

            expect(shouldThrow).toThrow(LexerError);
        });
    });

    it('Should throw an error upon encountering an unexpected character', () => {
        const lex = new Lexer("ADD 1 + 2");
        const shouldThrow = () => {
            lex.tokenize();
        };

        expect(shouldThrow).toThrow(LexerError);
    });

    it('The last token of the token stream should be EOF', () => {
        const lex = new Lexer('1, 2, 3, ah, bh, ch');
        const tokens = lex.tokenize();
        const eof = tokens.pop();

        expect(eof!.type).toBe(TokenType.EOF);
    });

    it('Should tokenize an empty buffer without throwing', () => {
        const lex = new Lexer("");
        const [eof] = lex.tokenize();

        expect(eof.type).toBe(TokenType.EOF);
    })
});