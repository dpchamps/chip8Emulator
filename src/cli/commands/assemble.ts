import {loadFile} from "../modules/loadFile";
import {Lexer} from "../../Lexer";
import {Assembler} from "../../Assembler";
import {bytecodeArrayToString} from "../../util/OpcodeUtils";
import {writeFile} from "../modules/writeFile";

const usage = `ASSEMBLE filename
    Assembles a file.`;

export const assemble = async (args: Array<string>): Promise<string> => {
    const [filename, fileToWrite] = args;

    if (typeof filename === 'undefined')
        return usage;

    const fileBuffer = await loadFile(filename);
    const lex = new Lexer(fileBuffer.toString());
    const asm = new Assembler(lex.tokenize());

    if(fileToWrite)
        await writeFile('roms', fileToWrite, asm.program);

    return bytecodeArrayToString(asm.program);
};