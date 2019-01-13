import {Chip8} from "../../emulator/Chip8";
import {loadFile} from "../modules/loadFile";
import {readInterface} from "../modules/readInterface";
import prompt from '../modules/prompt';

const usage = `EXECUTE FILENAME [fps=60]
    Run a file for nTicks at fps. Hit enter to stop execution.`;

export const executeTicks = async (args: Array<string>) => {
    const [fileName, fps] = args;
    const chip8 = new Chip8();

    if (!fileName)
        return usage;

    const fileBuffer = await loadFile(fileName);

    let fpsToRun = fps ? Number(fps) : 60;
    let ticksToRun = 1;

    readInterface.on('line', () => {
        ticksToRun = 0;
    });

    chip8.load(new Uint8Array(fileBuffer));

    while (ticksToRun > 0) {
        chip8.cycleCpu();

        ticksToRun = Number(await prompt('(enter -1 to stop)>')) || fpsToRun;
        fpsToRun = ticksToRun;
    }

    return true;
};