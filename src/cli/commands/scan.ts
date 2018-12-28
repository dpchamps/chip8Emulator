import {Opcode} from "../../Opcode";
import {loadFile} from "../modules/loadFile";
import {toOpcodeString, getOpcodesFromBuffer, toHexString} from "../../util/OpcodeUtils";
import {PROGRAM_OFFSET} from "../../types/Chip8Specs";

const usage = `SCAN filename [offsetIdx] [stopIdx]
    Starting from offsetIdx to stopIdx, scan a file and disassemble each opcode.`;
export const scan = async (args: Array<string>): Promise<string> => {
    const [filename, offset, stop] = args;
    const offsetIdx = typeof offset === 'undefined' ? 0 : Number(offset);
    const stopIdx = typeof stop === 'undefined' ? undefined : Number(stop);

    if (args.length < 1 || filename === 'help')
        return usage;
    if (isNaN(offsetIdx))
        throw new TypeError(`Expected offset to be number but got ${offset}`);

    const fileBuffer = new Uint8Array(await loadFile(filename));
    const opcodeArray = getOpcodesFromBuffer(fileBuffer.slice(offsetIdx, stopIdx));

    return opcodeArray.reduce((str, rawOpcode, idx) => {
        const opcode = new Opcode(rawOpcode, false);

        return `${str} ${opcode.toString()} - ${toOpcodeString(rawOpcode)} ADDR: ${toHexString((offsetIdx+(idx*2)) + PROGRAM_OFFSET)}\n`;
    }, '');
};