import {Assembler} from "../../src/Assembler";
import {Lexer} from "../../src/Lexer";
import {TokenType} from "../../src/types/TokenType";
import {Token} from "../../src/Token";
import {Instruction} from "../../src/types/Instruction";
import {AssemblerError} from "../../src/errors/AssemblerError";
import {MEMORY_LENGTH, PROGRAM_OFFSET} from "../../src/types/Chip8Specs";


const validProgram = `
MOV $2, 8h
MOV $3, 5h
MVI 20Bh
JSR :endloop

:endloop
JMP :endloop

;Letters
DATA 20Ah,  10010000n ; H
            10010000n
            11110000n
            10010000n
            10010000n
`;

const offsetDataProgram = `
DATA 210h, Ah, Bh`;

describe('Assembler', () => {
    const parse = (program: string): Uint8Array => {
        const lex = new Lexer(program);
        const asm = new Assembler(lex.tokenize());

        return asm.program;
    };

    it('Should parse a valid program into bytecode', () => {
        const bytecode = parse(validProgram);

        expect(Array.from(bytecode)).toEqual([
            0x62, 0x08, //mov
            0x63, 0x05, //mov
            0xA2, 0x0B, //mvi
            0x22, 0x08, //jsr
            0x12, 0x08, //jmp
            0b10010000, //data...
            0b10010000,
            0b11110000,
            0b10010000,
            0b10010000
        ])
    });

    it('Should parse a valid program with offset data', () => {
        const bytecode = parse(offsetDataProgram);

        expect(bytecode).toHaveLength(0x12);
        expect(bytecode[0x10]).toBe(0xA);
        expect(bytecode[0x11]).toBe(0xB);
    });

    describe('assembler errors', () => {
        it('Should throw an error upon receiving a a token stream with an undefined token or without an EOF', () => {
            const undefinedTokenStream = [
                new Token(TokenType.INSTRUCTION, Instruction.NOOP),
                undefined,
                new Token(TokenType.EOF, null)
            ];

            const neverEndingTokenStream = [
                new Token(TokenType.INSTRUCTION, Instruction.NOOP),
                new Token(TokenType.INTEGER, 0x8500)
            ];

            expect(() => {
                // @ts-ignore
                new Assembler(undefinedTokenStream)
            }).toThrow(AssemblerError);

            expect(() => {
                new Assembler(neverEndingTokenStream)
            }).toThrow(AssemblerError)
        });
    });

    it('Should throw an error upon receiving a program that is poorly constructed', () => {
        const poorlyConstructedPrograms = [
            `add 1h, 2h, 3h`, // additional argument
            `JMP JMP`,        // additional instruction
            `ret :ret $1`,    // non-sensical register
            `:label jsr :label :label`, //duplicate labels
            `jsr :oops-i-did-it-again`, //non existent label reference
            `DATA $1, $2, $3`, //no mem location data
            `DATA 215h`, //no data at mem location
        ];

        poorlyConstructedPrograms
            .map(program => {
                const lex = new Lexer(program);
                return lex.tokenize()
            })
            .forEach((tokens: Array<Token>) => {
                expect(() => {
                    new Assembler(tokens)
                }).toThrow(AssemblerError)
            })
    });

    it('Should throw an error when data and instruction collide', () => {
        //In this case, in order to avoid frustration with the DATA instruction
        // or too-smart code, we can never land in a position where we're trying to insert an instruction between two
        // pieces of data:

        // [data instruction places bytes in memory here]         0x1
        // [assembler wants to place an opcode here]              0x2
        // [but data instruction is placing byte in memory here]  0x3
        expect(() => {
            parse(`MOV $1, Ah DATA 201h 1h DATA 203h Ah`)
        }).toThrow(AssemblerError);
    });

    it('Should throw an error when a program exceeds the max allowed memory space for chip8', () => {
        expect(() => {
            parse(`DATA 1000h Ah`)
        }).toThrow(AssemblerError)
    });
});