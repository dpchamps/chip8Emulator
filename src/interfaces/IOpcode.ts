import {Chip8} from "../emulator/Chip8";

export interface IOpcode {
    (this : Chip8) : void
}