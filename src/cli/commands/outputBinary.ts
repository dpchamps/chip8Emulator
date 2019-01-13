import {loadFile} from "../modules/loadFile";

export const outputBinary = async (args: Array<string>) => {
    const [fileName] = args;
    const program = await loadFile(fileName);
    const array = new Uint8Array(program);

    return '['+array.reduce((str, byte, idx) => {
        return `${str} ${byte}, ${idx !== 0 && idx % 16 === 0 ? '\n' : ''}`;
    }, '')+']';
};