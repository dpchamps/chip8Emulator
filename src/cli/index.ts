import prompt from './modules/prompt';
import {Opcode} from "../Opcode";
import {commands} from "./Commands";
import {scan} from "./commands/scan";
import {disassemble} from "./commands/disassemble";
import {executeTicks} from "./commands/executeTicks";
import {outputBinary} from "./commands/outputBinary";
import {assemble} from "./commands/assemble";

const showCommands = () => {
    console.log(`Available commands:
                        ${commands.EXIT} - Exit the cli.
                        ${commands.OPCODE} - disassemble an opcode.
                        ${commands.DISASSEMBLE} - disassemble a program.
                        ${commands.SCAN} - scan a program, from offset.
                        ${commands.EXECUTE} - execute a program for n ticks at fps.
                        ${commands.BINARY} - output a chip binary as a UInt8 Array.
                        ${commands.ASSEMBLE} - assemble a program.
                    `);
};
const REPL = async () => {
    showCommands();
    let isRunning = true;
    while (isRunning) {
        try {
            const input = await prompt();
            const [command, ...args] = input.split(' ').map(x => x.trim());

            switch (command.toUpperCase()) {
                case commands.EXIT:
                    isRunning = false;
                    break;
                case commands.OPCODE:
                    const opcode = new Opcode(Number(args[0]));
                    console.log(opcode.toString());
                    break;
                case commands.SCAN:
                    console.log(await scan(args));
                    break;
                case commands.DISASSEMBLE:
                    console.log(await disassemble(args));
                    break;
                case commands.EXECUTE:
                    console.log(await executeTicks(args));
                    break;
                case commands.BINARY:
                    console.log(await outputBinary(args));
                    break;
                case commands.ASSEMBLE:
                    console.log(await assemble(args));
                    break;
                default:
                    showCommands();

            }
        } catch (error) {
            console.error(`Encountered an error processing last command: ${error}.`);
        }
    }
};

console.clear();
console.log(`Entering the Chip8 REPL`);

REPL()
    .then(() => process.exit())
    .catch(error => {
        console.error(`Encountered a fatal error ${error}.\nExiting...`);
        process.exit(1);
    });
