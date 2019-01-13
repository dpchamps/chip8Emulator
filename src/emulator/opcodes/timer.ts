import {Chip8} from "../Chip8";
import {IOpcode} from "../../interfaces/IOpcode";

/**
 * Defines opcodes that manage the chip8 timers
 */

/**
 * Set register x with the value of the delay timer
 */
export const gDelay: IOpcode = function (this: Chip8) {
    this.registers[this.currentOpcode.bytes.x] = this.timers.delay;

    this.advance();
};

/**
 * Set the delay timer with the value of register x
 */
export const sDelay: IOpcode = function (this: Chip8) {
    this.timers.delay = this.registers[this.currentOpcode.bytes.x];

    this.advance();
};

/**
 * Set the sound timer with the value of register x
 */
export const sSound: IOpcode = function (this: Chip8) {
    this.timers.sound = this.registers[this.currentOpcode.bytes.x];

    this.advance();
};


