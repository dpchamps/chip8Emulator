import {
    jumpToAddress,
    jumpToAddressPlusRegister,
    jumpToSubroutine,
    returnFromSubroutine,
    skeqXKK,
    skneXKK,
    skeqXY,
    skneXY
} from "../../../../src/emulator/opcodes/flow";

import {Chip8} from "../../../../src/emulator/Chip8";
import {Opcode} from "../../../../src/Opcode";

describe('flow', () => {
    const chip8 = new Chip8();

    afterEach(() => {
        chip8.initialize();
    });

    describe('jumpToAddress', () => {
        it('Should jump to an address specified in opcode', () => {
            chip8.currentOpcode = new Opcode(0x1234);
            expect(chip8.programCounter).toBe(0x200);
            jumpToAddress.call(chip8);
            expect(chip8.programCounter).toBe(0x234);
        });
    });

    describe('jumpToSubroutine', () => {
        it('Should push the current pc onto the stack', () => {
            chip8.programCounter = 0x300;
            jumpToSubroutine.call(chip8);
            expect(chip8.stackPointer).toBe(0x1);
            expect(chip8.stack[0x0]).toBe(0x300);
        });

        it('Should jump to address in opcode', () => {
            chip8.currentOpcode = new Opcode(0x2345);
            jumpToSubroutine.call(chip8);
            expect(chip8.programCounter).toBe(0x345);
        });
    });

    describe('jumpToAddressPlusRegister', () => {
        it('Should jump to an address in opcode + value stored in register 0', () => {
            chip8.currentOpcode = new Opcode(0xB001);
            chip8.registers[0x0] = 0x5;

            jumpToAddressPlusRegister.call(chip8);
            expect(chip8.programCounter).toBe(0x6);

            chip8.registers[0x0] = 0xf;

            jumpToAddressPlusRegister.call(chip8);
            expect(chip8.programCounter).toBe(0x10);
        });
    });

    describe('returnFromSubroutine', () => {
        it('Should advance past the address on the top of the stack', () => {
            chip8.stackPointer = 0x2;
            chip8.stack[0x0] = 0x500;
            chip8.stack[0x1] = 0x123;

            returnFromSubroutine.call(chip8);
            expect(chip8.programCounter).toBe(0x125);
            returnFromSubroutine.call(chip8);
            expect(chip8.programCounter).toBe(0x502);
        });
    });

    describe('skeqXKK', () => {
        it('Should skip the next opcode if register x is equal to kk', () => {
            chip8.currentOpcode = new Opcode(0x30ff);
            chip8.registers[0x0] = 0xff;

            skeqXKK.call(chip8);
            expect(chip8.programCounter).toBe(0x204);
        });

        it('Should not skip the next opcode if register x is not equal to kk', () => {
            chip8.currentOpcode = new Opcode(0x30ff);
            chip8.registers[0x0] = 0xfe;

            skeqXKK.call(chip8);
            expect(chip8.programCounter).toBe(0x202);
        });
    });

    describe('skneXKK', () => {
        it('Should skip the next opcode if register x is not equal to kk', () => {
            chip8.registers[0x5] = 0xAB;
            chip8.currentOpcode = new Opcode(0x45AA);

            skneXKK.call(chip8);
            expect(chip8.programCounter).toBe(0x204);
        });

        it('Should not skip the next opcode if register x is equal to kk', () => {
            chip8.registers[0x4] = 0xCC;
            chip8.currentOpcode = new Opcode(0x44CC);

            skneXKK.call(chip8);
            expect(chip8.programCounter).toBe(0x202);
        });
    });

    describe('skeqXY', () => {
        it('Should skip the next opcode if register x is equal to register y', () => {
            chip8.registers[0x2] = 0xC;
            chip8.registers[0xA] = 0xC;
            chip8.currentOpcode = new Opcode(0x52A0);

            skeqXY.call(chip8);

            expect(chip8.programCounter).toBe(0x204);
        });

        it('Should not skip the next opcode if register x is not equal to register y', () => {
            chip8.registers[0xE] = 0x4;
            chip8.registers[0x0] = 0x1;
            chip8.currentOpcode = new Opcode(0x5E00);

            skeqXY.call(chip8);

            expect(chip8.programCounter).toBe(0x202);
        });
    });

    describe('skneXY', () => {
        it('Should not skip the next opcode if register x and register y are equal', () => {
            chip8.registers[0xC] = 0xD;
            chip8.registers[0x2] = 0xD;
            chip8.currentOpcode = new Opcode(0x9C20);

            skneXY.call(chip8);

            expect(chip8.programCounter).toBe(0x202);
        });

        it('Should skip the next opcode if register x is not equal to register y', () => {
            chip8.registers[0xC] = 0xD;
            chip8.registers[0x2] = 0x1;
            chip8.currentOpcode = new Opcode(0x9C20);

            skneXY.call(chip8);

            expect(chip8.programCounter).toBe(0x204);
        });
    });
});