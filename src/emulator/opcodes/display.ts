import {Chip8} from "../Chip8";
import {GPU} from "../GPU";
import {IOpcode} from "../../interfaces/IOpcode";

/**
 * Instructions that manage the CHIP-8 Display
 */

/**
 * Clears the screen
 */
export const clearScreen: IOpcode = function (this: Chip8) {
    this.gpu.clearScreen();
    this.advance()
};

/**
 * Draws a sprite at coordinate (VX, VY) that has a width of 8 pixels and a height of N pixels.
 * Each row of 8 pixels is read as bit-coded starting from memory location I --
 * I value doesn't change after the execution of this instruction.
 *
 * As described above, VF is set to 1 if any screen pixels are flipped from set to
 * unset when the sprite is drawn, and to 0 if that doesn't happen
 */
export const draw: IOpcode = function (this: Chip8) {
    const {x, y, lsb: height} = this.currentOpcode.bytes;

    for (let row = 0; row < height; row += 1) {
        const sprite = this.memory[this.indexRegister + row];
        const spriteMask = 0b10000000;

        for (let col = 0; col < 8; col += 1) {
            const mask = spriteMask >> col;
            const isActivePixel = Boolean(sprite & mask);

            if (isActivePixel) {
                const screenX = this.registers[x] + col;
                const screenY = this.registers[y] + row;
                const screenIdx = (screenX + GPU.WIDTH * screenY) % (GPU.HEIGHT*GPU.WIDTH);

                this.registers[0xF] = this.gpu.screen[screenIdx];
                this.gpu.screen[screenIdx] ^= 1;
            }
        }
    }

    this.flags.draw = true;
    this.advance();
};