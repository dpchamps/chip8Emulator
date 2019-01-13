import {Chip8} from "../../../../src/emulator/Chip8";
import {
    add,
    addConstant,
    and,
    invertedSubtract,
    or,
    setConstant, setRegisterXWithY,
    shiftLeft,
    shiftRight,
    subtract,
    xor
} from "../../../../src/emulator/opcodes/math";
import {Opcode} from "../../../../src/Opcode";

describe('math', () => {
    const chip8 = new Chip8();

    beforeEach(() => {
        chip8.programCounter = 0x200;
    });

    afterEach(() => {
        chip8.initialize();
    });

    describe('or', () => {
        it('Should advance the program counter', () => {
            expect(chip8.programCounter).toBe(0x200);
            or.call(chip8);
            expect(chip8.programCounter).toBe(0x202);
        });

        it('Should the result of the bitwise or operation between the contents of register x and register y', () => {
            chip8.registers[0xA] = 0b11000;
            chip8.registers[0xB] = 0b00101;
            chip8.currentOpcode = new Opcode(0x8AB1);
            or.call(chip8);

            expect(chip8.registers[0xA]).toBe(0b11101);
        });
    });

    describe('and', () => {
        it('Should advance the program counter', () => {
            expect(chip8.programCounter).toBe(0x200);
            and.call(chip8);
            expect(chip8.programCounter).toBe(0x202);
        });

        it('Should store the result of the bitwise and operation between the contents of register x and register y into register x', () => {
            chip8.registers[0x5] = 0b110011;
            chip8.registers[0x1] = 0b101010;
            chip8.currentOpcode = new Opcode(0x8512);

            and.call(chip8);
            expect(chip8.registers[0x5]).toBe(0b100010);
        });
    });

    describe('xor', () => {
        it('Should advance the program counter', () => {
            expect(chip8.programCounter).toBe(0x200);
            xor.call(chip8);
            expect(chip8.programCounter).toBe(0x202);
        });

        it('Should store the result of the bitwise xor operation between the contents of register x and register y into register x', () => {
            chip8.registers[0x0] = 0b1100101;
            chip8.registers[0xC] = 0b0101011;
            chip8.currentOpcode = new Opcode(0x80C3);

            xor.call(chip8);

            expect(chip8.registers[0x0]).toBe(0b1001110);
        });
    });

    describe('add', () => {
        it('Should advance the program counter', () => {
            expect(chip8.programCounter).toBe(0x200);
            add.call(chip8);
            expect(chip8.programCounter).toBe(0x202);
        });

        it('Should store the result of the addition operation between register x and register y into register x', () => {
            chip8.registers[0x2] = 10;
            chip8.registers[0x3] = 10;
            chip8.currentOpcode = new Opcode(0x8234);

            add.call(chip8);
            expect(chip8.registers[0x2]).toBe(20);
        });

        it('Should set register 0xF to 1 when there\'s a carry', () => {
            chip8.registers[0xA] = 0xFE;
            chip8.registers[0xB] = 0x2;
            chip8.currentOpcode = new Opcode(0x8AB4);

            add.call(chip8);
            expect(chip8.registers[0xF]).toBe(1);
        });

        it('Should set register 0xF to 0 when there is no carry', () => {
            chip8.registers[0xA] = 0xFE;
            chip8.registers[0xB] = 0x1;
            chip8.currentOpcode = new Opcode(0x8AB4);

            add.call(chip8);
            expect(chip8.registers[0xF]).toBe(0);
        })
    });

    describe('subtract', () => {
        it('Should advance the program counter', () => {
            subtract.call(chip8);
            expect(chip8.programCounter).toBe(0x202);
        });

        it('Should store the result of the subtraction operation between the contents of register x and register y into register x', () => {
            chip8.registers[0x2] = 0x8;
            chip8.registers[0x1] = 0x5;
            chip8.currentOpcode = new Opcode(0x8215);

            subtract.call(chip8);
            expect(chip8.registers[0x2]).toBe(0x3);
        });

        it('Should set register 0xF to 1 if a borrow occurs', () => {
            chip8.registers[0x1] = 0x5;
            chip8.registers[0x2] = 0x9;
            chip8.currentOpcode = new Opcode(0x8125);

            subtract.call(chip8);
            expect(chip8.registers[0xF]).toBe(0);
        });

        it('Should set register 0xF to 1 if a borrow occurs', () => {
            chip8.registers[0x1] = 0x5;
            chip8.registers[0x2] = 0x4;
            chip8.currentOpcode = new Opcode(0x8125);

            subtract.call(chip8);
            expect(chip8.registers[0xF]).toBe(1);
        });
    });

    describe('Shift right', () => {
        it('Should advance the program counter', () => {
            shiftRight.call(chip8);

            expect(chip8.programCounter).toBe(0x0202);
        });

        it('Should store the lsb of register x into register 0xf', () => {
            chip8.currentOpcode = new Opcode(0x8106);
            chip8.registers[0x1] = 0b11;
            shiftRight.call(chip8);

            expect(chip8.registers[0xF]).toBe(0b1);

            chip8.registers[0x1] = 0b10;
            shiftRight.call(chip8);

            expect(chip8.registers[0xF]).toBe(0b0);
        });

        it('Should shift the contents of register x to the right by 1', () => {
            chip8.currentOpcode = new Opcode(0x8206);
            chip8.registers[0x2] = 0b10011;

            shiftRight.call(chip8);
            expect(chip8.registers[0x2]).toBe(0b1001);
            shiftRight.call(chip8);
            expect(chip8.registers[0x2]).toBe(0b100);
        });
    });

    describe('Shift left', () => {
        it('Should advance the program counter', () => {
            shiftLeft.call(chip8);
            expect(chip8.programCounter).toBe(0x202);
        });

        it('Should store to most significant bit from register x into register 0xf', () => {
            chip8.currentOpcode = new Opcode(0x820E);
            chip8.registers[0x2] = 0b10000001;

            shiftLeft.call(chip8);
            expect(chip8.registers[0xF]).toBe(0b1);
            shiftLeft.call(chip8);
            expect(chip8.registers[0xF]).toBe(0b0);
        });

        it('Should shift register x to the left', () => {
            chip8.currentOpcode = new Opcode(0x820E);
            chip8.registers[0x2] = 0b01111111;

            shiftLeft.call(chip8);
            expect(chip8.registers[0x2]).toBe(0b11111110);
        });

        it('Should handle overflows', () => {
            chip8.currentOpcode = new Opcode(0x820E);
            chip8.registers[0x2] = 0b11111111;

            shiftLeft.call(chip8);
            expect(chip8.registers[0x2]).toBe(0b11111110);
        });
    });

    describe('invertedSubtract', () => {
        it('Should advance the program counter', () => {
            invertedSubtract.call(chip8);

            expect(chip8.programCounter).toBe(0x202);
        });

        it('Should store the subtraction results of register x from register y into register x', () => {
            chip8.registers[0x1] = 0x5;
            chip8.registers[0x2] = 0xB;
            chip8.currentOpcode = new Opcode(0x8127);

            invertedSubtract.call(chip8);

            expect(chip8.registers[0x1]).toBe(0x6);
        });

        it('Should set the 0xf register to 0 when a borrow occurs', () => {
            chip8.registers[0x1] = 0xF;
            chip8.registers[0x2] = 0xB;
            chip8.currentOpcode = new Opcode(0x8127);

            invertedSubtract.call(chip8);

            expect(chip8.registers[0xF]).toBe(1);
        });

        it('Should set the 0xf register to 1 when a borrow does not occur', () => {
            chip8.registers[0x1] = 0x3;
            chip8.registers[0x2] = 0xB;
            chip8.currentOpcode = new Opcode(0x8127);

            invertedSubtract.call(chip8);

            expect(chip8.registers[0xF]).toBe(0);
        });
    });

    describe('setConstant', () => {
        it('Should advance the program counter', () => {
            setConstant.call(chip8);

            expect(chip8.programCounter).toBe(0x202);
        });

        it('Should set register x to the KK constant stored in opcode', () => {
            chip8.registers[0x1] = 0xF;
            chip8.currentOpcode = new Opcode(0x61BB);

            setConstant.call(chip8);

            expect(chip8.registers[0x1]).toBe(0xBB);
        });
    });

    describe('addConstant', () => {
        it('Should advance the program counter', () => {
            addConstant.call(chip8);

            expect(chip8.programCounter).toBe(0x202);
        });

        it('Should add the constant kk to register x', () => {
            chip8.registers[0xD] = 0xA;
            chip8.currentOpcode = new Opcode(0x7D03);

            addConstant.call(chip8);

            expect(chip8.registers[0xD]).toBe(0xD);
        });
    });

    describe('setRegisterXWithY', () => {
        it('Should advance the program counter', () => {
            setRegisterXWithY.call(chip8);

            expect(chip8.programCounter).toBe(0x202);
        });

        it('Should set register x with register y', () => {
            chip8.registers[0x1] = 0xA;
            chip8.registers[0x2] = 0xB;
            chip8.currentOpcode = new Opcode(0x8120);

            setRegisterXWithY.call(chip8);

            expect(chip8.registers[0x1]).toBe(0xB);
        });
    });
});