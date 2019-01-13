import {Chip8} from "../Chip8";
import {IOpcode} from "../../interfaces/IOpcode";

/**
 * Instructions that manage key operations
 */

/**
 * Skip next instruction if key is pressed
 */
export const skpr: IOpcode = function (this: Chip8) {
    const registerX = this.registers[this.currentOpcode.bytes.x];

    if (this.input.activeKeys[registerX])
        this.advance();

    this.advance();
};

/**
 * Skip next instruction if key is not pressed
 */
export const skup: IOpcode = function (this: Chip8) {
    const registerX = this.registers[this.currentOpcode.bytes.x];

    if (!this.input.activeKeys[registerX])
        this.advance();

    this.advance();
};

export const key: IOpcode = function (this: Chip8) {
    this.isRunning = false;
    this.input.onNextKeyPress((key: number) => {
        this.isRunning = true;
        this.registers[this.currentOpcode.bytes.x] = key;
    });

    this.advance();
};