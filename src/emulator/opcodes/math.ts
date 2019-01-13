import {Chip8} from "../Chip8";
import {IOpcode} from "../../interfaces/IOpcode";

/**
 * Provides definitions for opcodes that preform math and bitwise operations.
 */

/**
 * Bitwise OR,
 *
 * Store the result of Register X | Register Y into Register X
 */
export const or: IOpcode = function (this: Chip8) {
    const registerX = this.registers[this.currentOpcode.bytes.x];
    const registerY = this.registers[this.currentOpcode.bytes.y];

    this.registers[this.currentOpcode.bytes.x] = registerX | registerY;

    this.advance();
};

/**
 * Bitwise AND,
 *
 * Store the result of Register X & Register Y into Register X
 */
export const and: IOpcode = function (this: Chip8) {
    const registerX = this.registers[this.currentOpcode.bytes.x];
    const registerY = this.registers[this.currentOpcode.bytes.y];

    this.registers[this.currentOpcode.bytes.x] = registerX & registerY;
    this.advance();
};

/**
 * Bitwise XOR
 *
 * Store the result of Register X ^ Register Y into Register X
 */
export const xor: IOpcode = function (this: Chip8) {
    const registerX = this.registers[this.currentOpcode.bytes.x];
    const registerY = this.registers[this.currentOpcode.bytes.y];

    this.registers[this.currentOpcode.bytes.x] = registerX ^ registerY;

    this.advance();
};

/**
 * Addition
 *
 * Store the result of register X + Register Y into Register X
 * Set register 0xF to 1 if there's a carry, 0 if no carry occurs
 */
export const add: IOpcode = function (this: Chip8) {
    const registerX = this.registers[this.currentOpcode.bytes.x];
    const registerY = this.registers[this.currentOpcode.bytes.y];

    this.registers[0xF] = Number(registerX > (0xFF - registerY));
    this.registers[this.currentOpcode.bytes.x] = registerX + registerY;

    this.advance();
};

/**
 * Subtraction
 *
 * Store the result of register X - Register Y into register X
 * Set Register 0xF to 1 if there's a borrow, 0 if no borrow occurs
 */
export const subtract: IOpcode = function (this: Chip8) {
    const registerX = this.registers[this.currentOpcode.bytes.x];
    const registerY = this.registers[this.currentOpcode.bytes.y];

    this.registers[0xF] = Number(registerY < registerX);
    this.registers[this.currentOpcode.bytes.x] = registerX - registerY;

    this.advance();
};

/**
 * Shift right
 *
 * Shift register x to the right by one
 * Store the LSB of register x into register 0xf prior to shift
 */
export const shiftRight: IOpcode = function (this: Chip8) {
    const registerX = this.registers[this.currentOpcode.bytes.x];

    this.registers[0xF] = registerX & 0b1;
    this.registers[this.currentOpcode.bytes.x] = registerX >> 1;

    this.advance();
};

/**
 * Subtract the value stored in register x from the value stored in register y
 *
 * Set the 0xF register to 1 when a borrow DOES NOT occur.
 */
export const invertedSubtract: IOpcode = function (this: Chip8) {
    const registerX = this.registers[this.currentOpcode.bytes.x];
    const registerY = this.registers[this.currentOpcode.bytes.y];

    this.registers[0xF] = registerX > registerY ? 1 : 0;
    this.registers[this.currentOpcode.bytes.x] = registerY - registerX;

    this.advance();
};

/**
 * Shift left
 *
 * Shift register x to the left by one
 * Store the MSB of register x into register 0xF prior to shift
 */
export const shiftLeft: IOpcode = function (this: Chip8) {
    const registerX = this.registers[this.currentOpcode.bytes.x];

    this.registers[0xF] = (registerX & 0b10000000) ? 0b1 : 0b0;
    this.registers[this.currentOpcode.bytes.x] = registerX << 1;

    this.advance();
};

/**
 * Store the value of KK into register x
 */
export const setConstant: IOpcode = function (this: Chip8) {
    this.registers[this.currentOpcode.bytes.x] = this.currentOpcode.bytes.kk;

    this.advance();
};

/**
 * Add the constant value of KK to  register x
 */
export const addConstant: IOpcode = function (this: Chip8) {
    this.registers[this.currentOpcode.bytes.x] += this.currentOpcode.bytes.kk;

    this.advance();
};

/**
 * Set register x with the contents of register y
 */
export const setRegisterXWithY: IOpcode = function (this: Chip8) {
    this.registers[this.currentOpcode.bytes.x] = this.registers[this.currentOpcode.bytes.y];

    this.advance();
};