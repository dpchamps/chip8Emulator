import {Disassembler} from "../../Disassembler";
import {loadFile} from "../modules/loadFile";
import {getOpcodesFromBuffer} from "../../util/OpcodeUtils";

const usage = `DISASSEMBLE filename
    Disassembles a file.`;

export const disassemble = async (args: Array<string>): Promise<string> => {
    const [filename] = args;

    if (typeof filename === 'undefined')
        return usage;

    const fileBuffer = await loadFile(filename);
    const dasm = new Disassembler(new Uint8Array(fileBuffer));

    return dasm.toString();
};