import {gDelay, sDelay, sSound} from "../../../../src/emulator/opcodes/timer";
import {Chip8} from "../../../../src/emulator/Chip8";
import {Opcode} from "../../../../src/Opcode";

describe('timer', () => {
    const chip8 = new Chip8();

    afterEach(() => {
        chip8.initialize();
    });

    describe('gDelay', () => {
        it('Should advance the program counter', () => {
            gDelay.call(chip8);
            expect(chip8.programCounter).toBe(0x202);
        });

        it('Should this register x with the value stored in the delay timer', () => {
            chip8.timers.delay = 0xF;
            chip8.currentOpcode = new Opcode(0xF007);

            gDelay.call(chip8);

            expect(chip8.registers[0]).toBe(0xf);
        });
    });

    describe('sDelay', () => {
        it('Should advance the program counter', () => {
            sDelay.call(chip8);

            expect(chip8.programCounter).toBe(0x202);
        });

        it('Should set the delay timer', () => {
            chip8.registers[0xA] = 0xC;
            chip8.currentOpcode = new Opcode(0xFA07);
            sDelay.call(chip8);

            expect(chip8.timers.delay).toBe(0xC);
        });
    });

    describe('sSound', () => {
        it('Should advance the program counter', () => {
            sSound.call(chip8);

            expect(chip8.programCounter).toBe(0x202);
        });

        it('Should set the delay timer', () => {
            chip8.registers[0xA] = 0xC;
            chip8.currentOpcode = new Opcode(0xFA07);
            sSound.call(chip8);

            expect(chip8.timers.sound).toBe(0xC);
        });
    });
});