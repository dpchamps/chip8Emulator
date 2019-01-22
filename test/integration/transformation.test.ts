import {loadFile} from "../../src/cli/modules/loadFile";
import {Disassembler} from "../../src/Disassembler";
import {Lexer} from "../../src/Lexer";
import {Assembler} from "../../src/Assembler";
import fs from "fs";
import path from "path";
import {readFilesInDirectory} from "../../src/cli/modules/readFilesInDirectory";

// @ts-ignore
/**
 * Tests to ensure that all necessary data is preserved while transforming data from different intermediate representations
 */


describe('transformation', () => {
    it('Should maintain the integrity of a binary', async () => {
        const files = await readFilesInDirectory('roms');

        for(let file of files){
            console.log(file);
            const romBuffer = await loadFile(file);
            const rom = new Uint8Array(romBuffer);
            const dasm = new Disassembler(new Uint8Array(romBuffer));
            const lex = new Lexer(dasm.toString());
            const asm = new Assembler(lex.tokenize());
            expect(asm.program).toEqual(rom);
        }
    });
});
