import {OpcodeBytes} from "../interfaces/OpcodeBytes";


export const parseOpcode = (opcode: number): OpcodeBytes => {
    return {
        msb: (opcode & 0xF000) >> 12,
        lsb: (opcode & 0x000F),
        x: (opcode & 0x0F00) >> 8,
        y: (opcode & 0x00F0) >> 4,
        kk: (opcode & 0x0FF),
        nnn: (opcode & 0x0FFF)
    }
};

//Return the hexidecimal representation of a number
export const toHexString = (n: number): string => {
    return n.toString(16).toUpperCase();
};

//Return the binary representation of a number
export const toBinString = (n: number): string => {
    return n.toString(2);
};

export const toOpcodeString = (n: number): string => {
    return `0x${toHexString(n).padStart(4, '0')}`;
};

