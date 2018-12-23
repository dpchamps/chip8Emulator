import prompt from './modules/prompt';
import {Opcode} from "../Opcode";
import {commands} from "./Commands";

const REPL = async () => {

    while (true) {
        try {
            const input = await prompt();
            const [command, ...args] = input.split(' ').map(x => x.trim());

            switch (command.toUpperCase()) {
                case commands.EXIT:
                    process.exit(0);
                    break;
                case commands.OPCODE:
                    const opcode = new Opcode(Number(args[0]));
                    console.log(opcode.toString());
                    break;
                default:
                    console.log(`Available commands:
                        ${commands.EXIT} - Exit the cli
                        ${commands.OPCODE} - disassemble an opcode
                    `);

            }
        } catch (error) {
            console.error(`Encountered an error processing last command: ${error}.`);
        }
    }
};

console.clear();
console.log(`Entering the Chip8 REPL`);
REPL();