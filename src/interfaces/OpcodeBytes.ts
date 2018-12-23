/**
 * Contains a breakdown of an opcode in various useful byte representation:
 * 0xF133
 * msb : F
 * lsb : 3
 * x   : 1
 * y   : 3
 * kk  : 33
 * nnn : 133
 */
export interface OpcodeBytes {
    msb: number,
    lsb: number,
    x: number,
    y: number,
    kk: number,
    nnn: number
}