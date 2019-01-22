import {Disassembler} from "../../Disassembler";
import {loadFile} from "../modules/loadFile";
import {getOpcodesFromBuffer} from "../../util/OpcodeUtils";
import {writeFile} from "../modules/writeFile";

const usage = `DISASSEMBLE filename
    Disassembles a file.`;

export const disassemble = async (args: Array<string>): Promise<string> => {
    const [filename, fileToSave] = args;

    if (typeof filename === 'undefined')
        return usage;

    const fileBuffer = await loadFile(filename);
    const dasm = new Disassembler(new Uint8Array(fileBuffer));

    if (fileToSave) {
        await writeFile('asm', fileToSave, dasm.toString());
    }
    return dasm.toString();
};