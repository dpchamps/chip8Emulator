import {Chip8} from "../Chip8";
import {IOpcode} from "../../interfaces/IOpcode";

export const rand: IOpcode = function (this: Chip8) {
    const randomNumber = Math.random() * 0xFF;
    this.registers[this.currentOpcode.bytes.x] = (randomNumber & this.currentOpcode.bytes.kk) | 0;

    this.advance();
};