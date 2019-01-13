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
export const toBinString = (n: number, pad: number = 0): string => {
    return n.toString(2).padStart(pad, '0');
};

export const toOpcodeString = (n: number): string => {
    return `0x${toHexString(n).padStart(4, '0')}`;
};

export const getOpcodesFromBuffer = (buffer: Buffer | Uint8Array): Uint16Array => {
    const _tempBuffer = [];
    //pad the buffer so that an uneven buffer will have the correct final opcode
    const bufferLength = buffer.length % 2 === 0 ? buffer.length : buffer.length + 1;
    for (let i = 0; i < buffer.length; i += 2) {
        const HIGH = buffer[i] << 8;
        const LOW = buffer[i + 1] || 0;

        _tempBuffer.push(HIGH | LOW);
    }

    return new Uint16Array(_tempBuffer);
};
