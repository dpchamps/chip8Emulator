import {Chip8} from "../Chip8";
import {clearScreen, draw} from "./display";
import {jumpToAddress, jumpToAddressPlusRegister, jumpToSubroutine, returnFromSubroutine, skeqXKK, skeqXY, skneXKK, skneXY} from "./flow";
import {add, addConstant, and, invertedSubtract, or, setConstant, setRegisterXWithY, shiftLeft, shiftRight, subtract, xor} from "./math";
import {adi, font, ldr, mvi, str, bcd} from "./memory";
import {rand} from "./rand";
import {key, skpr, skup} from "./key";
import {gDelay, sDelay, sSound} from "./timer";

/**
 * Provides a 1:1 mapping between opcode and opcode function.
 */
export const opcodes = function (this: Chip8): { [index: number]: Function } {

    return {
        0x0000: () => {
            if (this.currentOpcode.bytes.kk) {
                this.opcodes[this.currentOpcode.bytes.kk]();
            } else {
                this.advance()
            }
        },

        0x00E0: () => clearScreen.call(this),

        0x00EE: () => returnFromSubroutine.call(this),
        0x1000: () => jumpToAddress.call(this),
        0x2000: () => jumpToSubroutine.call(this),

        0x3000: () => skeqXKK.call(this),
        0x4000: () => skneXKK.call(this),
        0x5000: () => skeqXY.call(this),

        0x6000: () => setConstant.call(this),
        0x7000: () => addConstant.call(this),

        0x8000: () => {
            if (this.currentOpcode.bytes.lsb) {
                this.opcodes[this.currentOpcode.rawOpcode & 0xF00F]();
            } else {
                setRegisterXWithY.call(this);
            }
        },
        0x8001: () => or.call(this),
        0x8002: () => and.call(this),
        0x8003: () => xor.call(this),
        0x8004: () => add.call(this),
        0x8005: () => subtract.call(this),
        0x8006: () => shiftRight.call(this),
        0x8007: () => invertedSubtract.call(this),
        0x800E: () => shiftLeft.call(this),

        0x9000: () => skneXY.call(this),

        0xA000: () => mvi.call(this),

        0xB000: () => jumpToAddressPlusRegister.call(this),

        0xC000: () => rand.call(this),

        0xD000: () => draw.call(this),

        0xE000: () => this.opcodes[this.currentOpcode.rawOpcode & 0xF0FF](),
        0xE09E: () => skpr.call(this),
        0xE0A1: () => skup.call(this),

        0xF000: () => this.opcodes[this.currentOpcode.rawOpcode & 0xF0FF](),
        0xF007: () => gDelay.call(this),

        0xF00A: () => key.call(this),

        0xF015: () => sDelay.call(this),
        0xF018: () => sSound.call(this),

        0xF01E: () => adi.call(this),

        0xF029: () => font.call(this),

        0xF033: () => bcd.call(this),

        0xF055: () => str.call(this),
        0xF065: () => ldr.call(this)
    }
};