import {Chip8} from "../Chip8";
import {IOpcode} from "../../interfaces/IOpcode";

/**
 * Instructions that manage program flow
 */

/**
 *
 */
export const jumpToAddress: IOpcode = function (this: Chip8) {
    this.programCounter = this.currentOpcode.bytes.nnn;
};

export const jumpToSubroutine: IOpcode = function (this: Chip8) {
    this.stack[this.stackPointer++] = this.programCounter;
    this.programCounter = this.currentOpcode.bytes.nnn;
};

export const jumpToAddressPlusRegister: IOpcode = function (this: Chip8) {
    this.programCounter = this.registers[0x0] + this.currentOpcode.bytes.nnn;
};

export const returnFromSubroutine: IOpcode = function (this: Chip8) {
    this.programCounter = this.stack[--this.stackPointer];
    this.advance();
};

export const skeqXKK: IOpcode = function (this: Chip8) {
    const regX = this.registers[this.currentOpcode.bytes.x];

    if (regX === this.currentOpcode.bytes.kk)
        this.advance();


    this.advance();
};

export const skneXKK: IOpcode = function (this: Chip8) {
    const regX = this.registers[this.currentOpcode.bytes.x];

    if (regX !== this.currentOpcode.bytes.kk)
        this.advance();


    this.advance();
};

export const skeqXY: IOpcode = function (this: Chip8) {
    const regX = this.registers[this.currentOpcode.bytes.x];
    const regY = this.registers[this.currentOpcode.bytes.y];

    if (regX === regY)
        this.advance();

    this.advance();
};

export const skneXY: IOpcode = function (this: Chip8) {
    const regX = this.registers[this.currentOpcode.bytes.x];
    const regY = this.registers[this.currentOpcode.bytes.y];

    if (regX !== regY)
        this.advance();

    this.advance();
};
