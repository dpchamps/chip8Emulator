import {Chip8} from "../../../../src/emulator/Chip8";
import {draw, clearScreen} from "../../../../src/emulator/opcodes/display";
import {Opcode} from "../../../../src/Opcode";
import {GPU} from "../../../../src/emulator/GPU";

const getXYFromIdx = (idx: number) => {
    const x = (idx % GPU.WIDTH);
    const y = (idx / GPU.WIDTH) | 0;

    return [x, y];
};

const getIdxFromXY = (x: number, y: number) => {
    return x + GPU.WIDTH * y;
};

describe('display opcodes', () => {
    const chip8 = new Chip8();
    const screenSize = GPU.HEIGHT * GPU.WIDTH;

    beforeEach(() => {
        chip8.initialize();
    });

    describe('clearScreen', () => {
        jest.spyOn(chip8.gpu, 'clearScreen');

        afterAll(() => {
            jest.restoreAllMocks();
        });

        clearScreen.call(chip8);

        it('Should clear the screen', () => {
            expect(chip8.gpu.clearScreen).toHaveBeenCalled();
        });
    });

    describe('draw', () => {
        const sprite = 0b11111111;
        const sprite1 = 0b11110000;
        const sprite2 = 0b10101010;
        const expectedSprites = [sprite, sprite1, sprite2];

        it('Should draw sprites stored in memory starting from the index register', () => {
            chip8.registers[0x0] = 0x0;
            chip8.registers[0x1] = 0x0;
            chip8.memory[0x2] = sprite;
            chip8.memory[0x3] = sprite1;
            chip8.memory[0x4] = sprite2;
            chip8.indexRegister = 0x2;
            chip8.currentOpcode = new Opcode(0xD013);

            draw.call(chip8);

            const idx1 = getIdxFromXY(0, 0) + 7;
            const idx2 = getIdxFromXY(0, 1) + 7;
            const idx3 = getIdxFromXY(0, 2) + 7;

            [idx1, idx2, idx3].forEach((gpuIdx, loopIdx) => {
                let sprite = 0;
                for (let i = 0; i < 8; i += 1) {
                    const pixel = chip8.gpu.screen[gpuIdx - i];
                    sprite |= (pixel << i);
                }
                expect(expectedSprites[loopIdx]).toBe(sprite);
            });
        });

        it('Should set the 0xF register flag if a pixel is already set', () => {
            const sprite = 0x1;
            chip8.gpu.screen[0x7] = 1;
            chip8.registers[0x0] = 0x0;
            chip8.registers[0x1] = 0x0;
            chip8.memory[0x0] = sprite;
            chip8.currentOpcode = new Opcode(0xd001);

            expect(chip8.registers[0xf]).toBe(0);
            draw.call(chip8);
            expect(chip8.registers[0xf]).toBe(1);
        });

        it('Should flip pixels already set', () => {
            const sprite = 0b11110000;
            [1, 1, 1, 1, 1, 1, 1, 1].forEach((pixel, idx) => {
                chip8.gpu.screen[idx] = pixel;
            });

            chip8.memory[0x0] = sprite;
            chip8.currentOpcode = new Opcode(0xD001);

            draw.call(chip8);

            [0, 0, 0, 0, 1, 1, 1, 1].forEach((expectedPixel, idx) => {
                expect(chip8.gpu.screen[idx]).toBe(expectedPixel);
            })
        });

        it('Should set the draw flag to true', () => {
            expect(chip8.flags.draw).toBe(false);
            draw.call(chip8);
            expect(chip8.flags.draw).toBe(true);
        });

        it('Should the program counter', () => {
            expect(chip8.programCounter).toBe(0x200);
            draw.call(chip8);
            expect(chip8.programCounter).toBe(0x202);
        });
    });
});