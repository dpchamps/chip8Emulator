import {key, skpr, skup} from "../../../../src/emulator/opcodes/key";
import {Chip8} from "../../../../src/emulator/Chip8";
import {Opcode} from "../../../../src/Opcode";

describe('key', () => {
    const chip8 = new Chip8();

    afterEach(() => {
        chip8.initialize();
    });

    describe('skpr', () => {
        it('Should skip the next instruction if key at register x is pressed', () => {
            chip8.registers[0xA] = 0xB;
            chip8.input.activeKeys[0xB] = true;
            chip8.currentOpcode = new Opcode(0xEA9E);

            skpr.call(chip8);
            expect(chip8.programCounter).toBe(0x204);
        });

        it('Should not skip the next instruction if key at register x is not pressed', () => {
            chip8.registers[0xA] = 0xC;
            chip8.input.activeKeys[0x7] = true;
            chip8.currentOpcode = new Opcode(0xEA9E);

            skpr.call(chip8);
            expect(chip8.programCounter).toBe(0x202);
        });
    });

    describe('skup', () => {
        it('should skip the next instruction if the key at register x is not pressed', () => {
            chip8.registers[0x9] = 0x4;
            chip8.input.activeKeys = [
                true, true, true, true, false, true, true,
                true, true, true, true, true, true, true,
                true, true
            ];
            chip8.currentOpcode = new Opcode(0xE9A1);

            skup.call(chip8);
            expect(chip8.programCounter).toBe(0x204);
        });

        it('Should not skip the next instruction if the key at register x is pressed', () => {
            chip8.registers[0x9] = 0x4;
            chip8.input.activeKeys = [
                false, false, false, false, true, false, false,
                false, false, false, false, false, false, false,
                false, false
            ];
            chip8.currentOpcode = new Opcode(0xE9A1);

            skup.call(chip8);
            expect(chip8.programCounter).toBe(0x202);
        });
    });

    describe('key', () => {
        it('Should halt the chip8', () => {
            key.call(chip8);
            expect(chip8.isRunning).toBe(false);
        });

        it('Should advance the program counter', () => {
            key.call(chip8);
            expect(chip8.programCounter).toBe(0x202);
        });

        it('Should resume the chip when the next key press callback is called', () => {
            key.call(chip8);
            expect(chip8.input.nextKeyPressFn).not.toBeNull();
            chip8.input.nextKeyPressFn!(0x1);
            expect(chip8.isRunning).toBe(true);
        })
    });
});