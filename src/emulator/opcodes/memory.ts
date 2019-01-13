import {Chip8} from "../Chip8";
import {IOpcode} from "../../interfaces/IOpcode";

/**
 * Define instructions that handle memory
 */

/**
 * Load the index register with address stored in opcode
 */
export const mvi: IOpcode = function (this: Chip8) {
    this.indexRegister = this.currentOpcode.bytes.nnn;

    this.advance();
};

export const adi: IOpcode = function (this: Chip8) {
    this.indexRegister += this.registers[this.currentOpcode.bytes.x];

    this.advance()
};

/**
 * Set index register to the location of the font sprite store in register x
 */
export const font: IOpcode = function (this: Chip8) {
    const registerX = this.registers[this.currentOpcode.bytes.x];

    //font letters are 4 bytes long
    this.indexRegister = registerX * 5;

    this.advance();
};

/**
 * Store registers 0 - x in memory starting at index registers
 */
export const str: IOpcode = function (this: Chip8) {
    for (let i = 0; i <= this.currentOpcode.bytes.x; i += 1)
        this.memory[this.indexRegister + i] = this.registers[i];

    this.advance();
};

/**
 * Store data stored in memory in registers 0 - x
 */
export const ldr: IOpcode = function (this: Chip8) {
    for (let i = 0; i <= this.currentOpcode.bytes.x; i += 1)
        this.registers[i] = this.memory[this.indexRegister + i];

    this.advance();
};

/**
 * Store the 100's decimal digit at I+0, 10's decimal digit at I+1 and the 1's decimal digit at I+2
 */
export const bcd: IOpcode = function (this: Chip8) {
    const registerX = this.registers[this.currentOpcode.bytes.x];

    this.memory[this.indexRegister] = (registerX / 100) | 0;
    this.memory[this.indexRegister + 1] = ((registerX % 100) / 10) | 0;
    this.memory[this.indexRegister + 2] = (registerX % 10) | 0;

    this.advance();
};