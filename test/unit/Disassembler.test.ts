import {Disassembler} from "../../src/Disassembler";
import {DisassemblerError} from "../../src/errors/Chip8Errors";
import {Opcode} from "../../src/Opcode";
import {MEMORY_LENGTH, STACK_LENGTH} from "../../src/types/Chip8Specs";

const toByteStream = (opcodes: Array<number>): Uint8Array => {
    let buffer = [];
    for (let opcode of opcodes) {
        const high = (0xFF00 & opcode) >> 8;
        const low = (0xFF & opcode);

        buffer.push(high);
        buffer.push(low);
    }

    return new Uint8Array(buffer);
};

describe('Disassembler', () => {
    it('Shoud produce a disassembled program', () => {
        const opcodes = [
            0x8180,
            0x8280,
            0x8004,
            0x00e0
        ];
        const expectedMov1 = new Opcode(0x8180);
        const expectedMov2 = new Opcode(0x8280);
        const expectedAdd = new Opcode(0x8004);
        const expectedCls = new Opcode(0x00e0);

        const dasm = new Disassembler(toByteStream(opcodes), false);
        const [mov1, mov2, add, cls] = dasm.program;

        expect(mov1).toBe(expectedMov1.toString());
        expect(mov2).toBe(expectedMov2.toString());
        expect(add).toBe(expectedAdd.toString());
        expect(cls).toBe(expectedCls.toString());
        expect(dasm.program).toHaveLength(4);
    });

    it('Should produce a disassembled program with jumps', () => {
        const opcodes = [
            0x1206,
            0x0000,
            0x0000,
            0x8180,
            0x00e0
        ];

        const expectedJmp = new Opcode(0x1206);
        const expectedMov = new Opcode(0x8180);
        const expectedCls = new Opcode(0x00e0);

        const dasm = new Disassembler(toByteStream(opcodes), false);
        const [jmp, label, mov, cls] = dasm.program;
        expect(jmp).toBe(expectedJmp.toString());
        expect(label).toBe(':label-0x0206');
        expect(mov).toBe(expectedMov.toString());
        expect(cls).toBe(expectedCls.toString());
    });

    it('Should append data codes to the end of the program', () => {
        const opcodes = [
            0x1206,
            0x4567,
            0xABCD,
            0x8180,
            0x00e0
        ];

        const dasm = new Disassembler(toByteStream(opcodes));
        const [, , , , data1, data2, data3, data4] = dasm.program;

        expect(data1).toBe('DATA\t202h, 45h');
        expect(data2).toBe('DATA\t203h, 67h');
        expect(data3).toBe('DATA\t204h, ABh');
        expect(data4).toBe('DATA\t205h, CDh');
    });

    it('Should produce a correctly organized program with sub routines', () => {
        const opcodes = [
            0x2206,
            0xd123,
            0x8084,
            0x8180,
            0x00ee
        ];

        const dasm = new Disassembler(toByteStream(opcodes), false);

        const [jsr, draw, add, label, mov, ret] = dasm.program;
        const expectedJsr = new Opcode(0x2206);
        const expectedMov = new Opcode(0x8180);
        const expectedRet = new Opcode(0x00ee);
        const expectedDraw = new Opcode(0xd123);
        const expectedAdd = new Opcode(0x8084);

        expect(jsr).toBe(expectedJsr.toString());
        expect(draw).toBe(expectedDraw.toString());
        expect(add).toBe(expectedAdd.toString());
        expect(label).toBe(`:label-0x0206`);
        expect(mov).toBe(expectedMov.toString());
        expect(ret).toBe(expectedRet.toString());
    });

    it('Should produce a correctly organized program with skips', () => {
        const opcodes = [
            0x3000,
            0x4000,
            0xe09e,
            0xe0a1
        ];

        const expectedSkeq = new Opcode(0x3000);
        const expectedSkne = new Opcode(0x4000);
        const expectedSkpr = new Opcode(0xe09e);
        const expectedSkup = new Opcode(0xe0a1);

        const dasm = new Disassembler(toByteStream(opcodes), false);
        const [skeq, skne, skpr, skup] = dasm.program;

        expect(skeq).toBe(expectedSkeq.toString());
        expect(skne).toBe(expectedSkne.toString());
        expect(skpr).toBe(expectedSkpr.toString());
        expect(skup).toBe(expectedSkup.toString());
    });

    it('Should produce a full program in string form', () => {
        const opcodes = [
            0x2206,
            0xd123,
            0x8084,
            0x8180,
            0x00ee
        ];

        const expectedInstructions = [
            new Opcode(0x2206),
            new Opcode(0xd123),
            new Opcode(0x8084),
            ':label-0x0206',
            new Opcode(0x8180),
            new Opcode(0x00ee),
        ];

        const dasm = new Disassembler(toByteStream(opcodes), false);

        expect(dasm.toString()).toEqual(expectedInstructions.join('\n'))
    });

    it('Should produce a opcode dump', () => {
        const opcodes = [
            0x1234,
            0xd123,
            0xd123,
            0xd123,
            0xd123,
            0x8080,
            0x8080,
            0x8080,
            0x8080,
            0x8080,
            0x8080,
        ];

        const dasm = new Disassembler(toByteStream(opcodes));
        const expectedOutput = `12 34 d1 23 d1 23 d1 23 d1 23 80 80 80 80 80 80 80 \n80 80 80 80 80 `;

        expect(dasm.toRawString()).toEqual(expectedOutput.toUpperCase());
    });

    it('Should throw an error when a program jumps outside of memory space', () => {
        const opcodes = [
            0x1FFF,
        ];
        const filler = new Array(MEMORY_LENGTH-1);
        filler.fill(0x0);


        const willThrow = () => {
            new Disassembler(toByteStream([...opcodes, ...filler]))
        };

        expect(willThrow).toThrow(DisassemblerError);
    });

    it('Should throw an error when a program exceeds the max stack size of the chip8', () => {
        const opcodes = new Array(STACK_LENGTH*2);
        opcodes.fill(0x3000);

        const willThrow = () => {
            new Disassembler(toByteStream(opcodes));
        };

        expect(willThrow).toThrow(DisassemblerError);
    })
});