import {Chip8} from "../../../../src/emulator/Chip8";
import {adi, font, ldr, mvi, str, bcd} from "../../../../src/emulator/opcodes/memory";
import {Opcode} from "../../../../src/Opcode";

describe('memory', () => {
    const chip8 = new Chip8();

    beforeEach(() => {
        chip8.programCounter = 0x200;
    });

    afterEach(() => {
        chip8.initialize();
    });

    describe('mvi', () => {
        it('Should advance the program counter', () => {
            mvi.call(chip8);
            expect(chip8.programCounter).toBe(0x202);
        });

        it('Should set memory at index register to the address in opcode', () => {
            chip8.indexRegister = 0x500;
            chip8.currentOpcode = new Opcode(0xA123);
            mvi.call(chip8);

            expect(chip8.indexRegister).toBe(0x123);
        });
    });

    describe('adi', () => {
        it('Should advance the program counter', () => {
            adi.call(chip8);

            expect(chip8.programCounter).toBe(0x202);
        });

        it('Should set the index register to the value += the current value stored in register x', () => {
            chip8.registers[0xb] = 0xA;
            chip8.indexRegister = 0x100;
            chip8.currentOpcode = new Opcode(0xFB1E);

            adi.call(chip8);

            expect(chip8.indexRegister).toBe(0x10A);
        });
    });

    describe('font', () => {
        it('Should advance the program counter', () => {
            font.call(chip8);

            expect(chip8.programCounter).toBe(0x202);
        });

        it('Should set the index register to the font stored in register x', () => {
            chip8.registers[0x2] = 0xA;
            chip8.currentOpcode = new Opcode(0xF229);

            font.call(chip8);

            expect(chip8.indexRegister).toBe(0x32);
        })
    });

    describe('str', () => {
        it('Should advance the program counter', () => {
            str.call(chip8);

            expect(chip8.programCounter).toBe(0x202);
        });

        it('Should store values stored in registers 0 - x in memory from index register 0 - x', () => {
            chip8.registers[0x0] = 0x1;
            chip8.registers[0x1] = 0x3;
            chip8.registers[0x2] = 0x3;
            chip8.registers[0x3] = 0x7;
            chip8.indexRegister = 0x500;
            chip8.currentOpcode = new Opcode(0xF355);
            str.call(chip8);

            expect(chip8.memory[0x500]).toBe(0x1);
            expect(chip8.memory[0x501]).toBe(0x3);
            expect(chip8.memory[0x502]).toBe(0x3);
            expect(chip8.memory[0x503]).toBe(0x7);
        });

        it('Should not affect the index register', () => {
            chip8.currentOpcode = new Opcode(0xFF65);
            chip8.indexRegister = 0x10;

            str.call(chip8);

            expect(chip8.indexRegister).toBe(0x10);
        });
    });

    describe('ldr', () => {
        it('Should advance the program counter', () => {
            ldr.call(chip8);

            expect(chip8.programCounter).toBe(0x202);
        });

        it('Should load values stored in memory from index register + 0 to x into registers 0 to x', () => {
            chip8.memory[0x500] = 0xF;
            chip8.memory[0x501] = 0xA;
            chip8.memory[0x502] = 0x7;
            chip8.memory[0x503] = 0x5;
            chip8.memory[0x504] = 0x0;
            chip8.registers[0xA] = 0x4;
            chip8.registers[0x4] = 0x9;
            chip8.indexRegister = 0x500;
            chip8.currentOpcode = new Opcode(0xFA65);

            ldr.call(chip8);

            expect(chip8.registers[0x0]).toBe(0xF);
            expect(chip8.registers[0x1]).toBe(0xA);
            expect(chip8.registers[0x2]).toBe(0x7);
            expect(chip8.registers[0x3]).toBe(0x5);
            expect(chip8.registers[0x4]).toBe(0x0);
        });

        it('Should not affect the index register', () => {
            chip8.currentOpcode = new Opcode(0xFF65);
            chip8.indexRegister = 0x5;

            ldr.call(chip8);

            expect(chip8.indexRegister).toBe(0x5);
        });
    });

    describe('binaryCodedDecimal', () => {
        it('Should advance the program counter', () => {
            bcd.call(chip8);

            expect(chip8.programCounter).toBe(0x202);
        });

        it('Should store the BCD in memory', () => {
            chip8.registers[0x5] = 249;
            chip8.indexRegister = 0x500;
            chip8.currentOpcode = new Opcode(0xD533);

            bcd.call(chip8);
            expect(chip8.memory[0x500]).toBe(2);
            expect(chip8.memory[0x501]).toBe(4);
            expect(chip8.memory[0x502]).toBe(9);
        })
    });
});