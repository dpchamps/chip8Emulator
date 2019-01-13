import {Chip8} from "../../../../src/emulator/Chip8";
import {rand} from "../../../../src/emulator/opcodes/rand";
import {Opcode} from "../../../../src/Opcode";

describe('rand', () => {
    const chip8 = new Chip8();

    it('Should store random numbers in register x', () => {
        chip8.currentOpcode = new Opcode(0xC0FF);
        let lastNumber = -1;
        let canContinue = true;
        let iterations = 1000;

        //instead of adding a seedable random number generator we just ensure that it produces different results
        while (canContinue) {
            iterations -= 1;
            rand.call(chip8);
            let currentNumber = chip8.registers[0x0];
            if (currentNumber > 0xFF || currentNumber < 0)
                fail("Got an unexpected number");

            if (lastNumber == -1) {
                lastNumber = currentNumber;
            } else if (lastNumber != currentNumber) {
                canContinue = false;
            } else if (iterations === 0) {
                fail("Failed to generate a different number in 1000 iterations");
            }

        }

    });
});