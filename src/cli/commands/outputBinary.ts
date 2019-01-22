import {loadFile} from "../modules/loadFile";
import {bytecodeArrayToString} from "../../util/OpcodeUtils";

export const outputBinary = async (args: Array<string>): Promise<string> => {
    const [fileName] = args;
    const program = await loadFile(fileName);
    const array = new Uint8Array(program);

    return bytecodeArrayToString(array);
};