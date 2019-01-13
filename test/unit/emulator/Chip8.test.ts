import {Chip8} from "../../../src/emulator/Chip8";
import {FONTSET_OFFSET, MEMORY_LENGTH, PROGRAM_OFFSET} from "../../../src/types/Chip8Specs";
import {Opcode} from "../../../src/Opcode";
import {fontSet} from "../../../src/emulator/fontSet";
import {Instruction} from "../../../src/types/Instruction";
import {IllegalMemorySpace, StackOverflowError} from "../../../src/errors/Chip8Errors";

describe('Chip8', () => {
    const chip8 = new Chip8();

    afterEach(() => {
        chip8.initialize();
    });

    describe('initialize', () => {
        it('Should initialize upon construction', () => {
            expect(chip8.isRunning).toBe(true);
            expect(chip8.programCounter).toBe(PROGRAM_OFFSET);
            expect(chip8.indexRegister).toBe(0);
            expect(chip8.stackPointer).toBe(0);
            expect(chip8.timers.sound).toBe(0);
            expect(chip8.timers.delay).toBe(0);
            expect(chip8.flags.sound).toBe(false);
            expect(chip8.flags.draw).toBe(false);
            expect(chip8.stack).toBeInstanceOf(Uint16Array);
            expect(chip8.memory).toBeInstanceOf(Uint8Array);
            expect(chip8.registers).toBeInstanceOf(Uint8Array);
            expect(chip8.currentOpcode).toBeInstanceOf(Opcode);
        });

        it('Should load font set into memory starting at specified offset', () => {
            fontSet.forEach((byte, index) => {
                expect(chip8.memory[index + FONTSET_OFFSET]).toBe(byte);
            });
        });
    });

    describe('load', () => {
        it('Should call initialize before loading program', () => {
            jest.spyOn(chip8, 'initialize');
            chip8.load(new Uint8Array([1, 2, 3]));
            expect(chip8.initialize).toHaveBeenCalled();
            jest.restoreAllMocks();
        });

        it('Should load a program into memory starting at the designated program offset', () => {
            chip8.load(new Uint8Array([1, 3, 3, 7]));
            [1, 3, 3, 7].forEach((number, index) => {
                expect(chip8.memory[PROGRAM_OFFSET + index]).toBe(number);
            });
        });

        it('Should throw a range upon attempting to load a program larger than the memory buffer', () => {
            const sizeTooBig = (MEMORY_LENGTH - PROGRAM_OFFSET) + 1;
            const program = new Uint8Array(new Array(sizeTooBig).fill(0x1000));
            const willThrow = () => {
                chip8.load(program);
            };

            expect(willThrow).toThrow(RangeError);
        })
    });

    describe('update', () => {
        it('Should update peripherals', () => {
            jest.spyOn(chip8.gpu, 'update');
            jest.spyOn(chip8.spu, 'update');

            chip8.update();

            expect(chip8.gpu.update).toHaveBeenCalled();
            expect(chip8.spu.update).toHaveBeenCalled();

            jest.restoreAllMocks();
        });

        it('Should update timers', () => {
            chip8.timers.delay = 10;
            chip8.timers.sound = 3;

            chip8.update();
            chip8.update();
            chip8.update();

            expect(chip8.timers.delay).toBe(7);
            expect(chip8.timers.sound).toBe(0);
        });

        it('Should not update timers below zero', () => {
            chip8.update();
            chip8.update();
            chip8.update();

            expect(chip8.timers.delay).toBe(0);
            expect(chip8.timers.sound).toBe(0);
        });

        it('Should set sound flag if sound timer is greater than zero', () => {
            expect(chip8.flags.sound).toBe(false);
            chip8.timers.sound = 3;
            chip8.update();
            expect(chip8.flags.sound).toBe(true);
            chip8.update();
            chip8.update();
            expect(chip8.flags.sound).toBe(false);
        })
    });

    describe('cycleCpu', () => {
        it('Should fetch/decode/execute', () => {
            chip8.memory[chip8.programCounter] = 0xD1;
            chip8.memory[chip8.programCounter + 1] = 0xAB;

            chip8.cycleCpu();
            expect(chip8.currentOpcode.instruction.value).toBe(Instruction.DRAW);
        });

        it('Should throw a stack overflow error if the program counter goes outside of expected memory space', () => {
            chip8.programCounter = MEMORY_LENGTH;
            const willThrow = () => {
                chip8.cycleCpu();
            };

            expect(willThrow).toThrow(StackOverflowError);
        });

        it('Should throw an illegal memory space exception if the program counter drops below program offset', () => {
            chip8.programCounter = PROGRAM_OFFSET - 10;

            const willThrow = () => {
                chip8.cycleCpu();
            };

            expect(willThrow).toThrow(IllegalMemorySpace);
        });
    });
});