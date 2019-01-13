import * as Math from '../../../../src/emulator/opcodes/math';
import * as Display from '../../../../src/emulator/opcodes/display';
import * as Flow from '../../../../src/emulator/opcodes/flow';
import * as Rand from '../../../../src/emulator/opcodes/rand';
import * as Key from '../../../../src/emulator/opcodes/key';
import * as Timer from '../../../../src/emulator/opcodes/timer';
import * as Memory from '../../../../src/emulator/opcodes/memory';
import {Chip8} from "../../../../src/emulator/Chip8";
import {PROGRAM_OFFSET} from "../../../../src/types/Chip8Specs";
import {Opcode} from "../../../../src/Opcode";

jest.mock('../../../../src/emulator/opcodes/math');
jest.mock('../../../../src/emulator/opcodes/display');
jest.mock('../../../../src/emulator/opcodes/flow');
jest.mock('../../../../src/emulator/opcodes/rand');
jest.mock('../../../../src/emulator/opcodes/key');
jest.mock('../../../../src/emulator/opcodes/timer');
jest.mock('../../../../src/emulator/opcodes/memory');

describe('opcode map', () => {
    const chip8 = new Chip8();

    beforeEach(() => {
        chip8.currentOpcode = new Opcode(0x0000, false);
        chip8.programCounter = PROGRAM_OFFSET;
        jest.resetAllMocks();
    });

    it('Should advance the program counter in the event of a zero opcode (NOOP)', () => {
        chip8.opcodes[0x0000]();

        expect(chip8.programCounter).toBe(PROGRAM_OFFSET + 2);
    });

    it('Should clear the screen', () => {
        chip8.opcodes[0x00E0]();
        expect(Display.clearScreen).toHaveBeenCalled();
    });

    it('Should return from subroutine', () => {
        chip8.opcodes[0x00EE]();
        expect(Flow.returnFromSubroutine).toHaveBeenCalled();
    });

    it('Should jump to address', () => {
        chip8.opcodes[0x1000]();
        expect(Flow.jumpToAddress).toHaveBeenCalled();
    });

    it('Should jump to subroutine', () => {
        chip8.opcodes[0x2000]();
        expect(Flow.jumpToSubroutine).toHaveBeenCalled();
    });

    it('Should skip equals constant', () => {
        chip8.opcodes[0x3000]();
        expect(Flow.skeqXKK).toHaveBeenCalled();
    });

    it('Should skip not equals constant', () => {
        chip8.opcodes[0x4000]();
        expect(Flow.skneXKK).toHaveBeenCalled();
    });

    it('Should skip equals register', () => {
        chip8.opcodes[0x5000]();
        expect(Flow.skeqXY).toHaveBeenCalled();
    });

    it('Should set constant', () => {
        chip8.opcodes[0x6000]();
        expect(Math.setConstant).toHaveBeenCalled();
    });

    it('Should add constant', () => {
        chip8.opcodes[0x7000]();
        expect(Math.addConstant).toHaveBeenCalled();
    });

    it('Should set register x with y', () => {
        chip8.opcodes[0x8000]();
        expect(Math.setRegisterXWithY).toHaveBeenCalled();
    });

    it('Should or', () => {
        chip8.opcodes[0x8001]();
        expect(Math.or).toHaveBeenCalled();
    });

    it('Should and', () => {
        chip8.opcodes[0x8002]();
        expect(Math.and).toHaveBeenCalled();
    });

    it('Should xor', () => {
        chip8.opcodes[0x8003]();
        expect(Math.xor).toHaveBeenCalled();
    });

    it('Should add', () => {
        chip8.opcodes[0x8004]();
        expect(Math.add).toHaveBeenCalled();
    });

    it('Should subtract', () => {
        chip8.opcodes[0x8005]();
        expect(Math.subtract).toHaveBeenCalled();
    });

    it('Should shiftRight', () => {
        chip8.opcodes[0x8006]();
        expect(Math.shiftRight).toHaveBeenCalled();
    });

    it('Should invertedSubtract', () => {
        chip8.opcodes[0x8007]();
        expect(Math.invertedSubtract).toHaveBeenCalled();
    });

    it('Should shiftLeft', () => {
        chip8.opcodes[0x800E]();
        expect(Math.shiftLeft).toHaveBeenCalled();
    });

    it('Should skip not equals register', () => {
        chip8.opcodes[0x9000]();
        expect(Flow.skneXY).toHaveBeenCalled();
    });

    it('Should mvi', () => {
        chip8.opcodes[0xA000]();
        expect(Memory.mvi).toHaveBeenCalled();
    });

    it('Should rand', () => {
        chip8.opcodes[0xC000]();
        expect(Rand.rand).toHaveBeenCalled();
    });

    it('Should jump to address plus register', () => {
        chip8.opcodes[0xB000]();
        expect(Flow.jumpToAddressPlusRegister).toHaveBeenCalled();
    });

    it('Should draw', () => {
        chip8.opcodes[0xD000]();
        expect(Display.draw).toHaveBeenCalled();
    });

    it('Should skip press', () => {
        chip8.opcodes[0xE09E]();
        expect(Key.skpr).toHaveBeenCalled();
    });

    it('Should skip not press', () => {
        chip8.opcodes[0xE0A1]();
        expect(Key.skup).toHaveBeenCalled();
    });

    it('Should get delay', () => {
        chip8.opcodes[0xF007]();
        expect(Timer.gDelay).toHaveBeenCalled();
    });

    it('Should key', () => {
        chip8.opcodes[0xF00A]();
        expect(Key.key).toHaveBeenCalled();
    });

    it('Should set delay', () => {
        chip8.opcodes[0xF015]();
        expect(Timer.sDelay).toHaveBeenCalled()
    });

    it('Should set Sound', () => {
        chip8.opcodes[0xF018]();
        expect(Timer.sSound).toHaveBeenCalled();
    });

    it('Should adi', () => {
        chip8.opcodes[0xF01E]();
        expect(Memory.adi).toHaveBeenCalled();
    });

    it('Should font', () => {
        chip8.opcodes[0xF029]();
        expect(Memory.font).toHaveBeenCalled();
    });

    it('Should bcd', () => {
        chip8.opcodes[0xF033]();
        expect(Memory.bcd).toHaveBeenCalled();
    });

    it('Should str', () => {
        chip8.opcodes[0xF055]();
        expect(Memory.str).toHaveBeenCalled();
    });

    it('Should ldr', () => {
        chip8.opcodes[0xF065]();
        expect(Memory.ldr).toHaveBeenCalled();
    });

    it('Should delegate calls to higher-order opcodes', () => {
        chip8.currentOpcode.bytes.lsb = 1;
        chip8.currentOpcode.bytes.kk = 0xEE;
        const willNotThrow = () => {
            chip8.opcodes[0x0000]();
            chip8.opcodes[0x8000]();
            chip8.opcodes[0xE000]();
            chip8.opcodes[0xF000]();
        };

        expect(willNotThrow).not.toThrow();
    })
});