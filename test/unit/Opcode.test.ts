import {Opcode} from "../../src/Opcode";
import {Instruction} from "../../src/types/Instruction";

describe('Opcode', () => {
    test('Should instantiate', () => {
        new Opcode(0x00EE);
    });

    test('CLS', () => {
        const cls = new Opcode(0x00E0);

        expect(cls.instruction.value).toBe(Instruction.CLS);
        expect(cls.args).toHaveLength(0);
    });

    test('RET', () => {
        const ret = new Opcode(0x00EE);

        expect(ret.instruction.value).toBe(Instruction.RET);
        expect(ret.args).toHaveLength(0);
    });

    test('JMP', () => {
        const jmp = new Opcode(0x1234);
        const [address] = jmp.args;

        expect(jmp.instruction.value).toBe(Instruction.JMP);
        expect(jmp.args).toHaveLength(1);
        expect(address.value).toBe(0x234);
        if (jmp.label) {
            expect(jmp.label.value).toBe(`label-0x0234`);
        } else {
            fail();
        }
    });

    test('JSR', () => {
        const jsr = new Opcode(0x2345);
        const [address] = jsr.args;

        expect(jsr.instruction.value).toBe(Instruction.JSR);
        expect(jsr.args).toHaveLength(1);
        expect(address.value).toBe(0x0345);
        if (jsr.label) {
            expect(jsr.label.value).toBe(`label-0x0345`);
        } else {
            fail();
        }
    });

    test('SKEQ', () => {
        const skeq1 = new Opcode(0x3123);
        const skeq2 = new Opcode(0x5456);
        const [x, kk] = skeq1.args;
        const [_x, y] = skeq2.args;

        expect(skeq1.instruction.value).toBe(Instruction.SKEQ);
        expect(skeq1.args).toHaveLength(2);
        expect(x.value).toBe(0x1);
        expect(kk.value).toBe(0x23);

        expect(skeq2.instruction.value).toBe(Instruction.SKEQ);
        expect(skeq2.args).toHaveLength(2);
        expect(_x.value).toBe(0x4);
        expect(y.value).toBe(0x5);
    });

    test('SKNE', () => {
        const skne1 = new Opcode(0x4567);
        const skne2 = new Opcode(0x9012);
        const [x, kk] = skne1.args;
        const [_x, y] = skne2.args;

        expect(skne1.instruction.value).toBe(Instruction.SKNE);
        expect(skne1.args).toHaveLength(2);
        expect(x.value).toBe(0x5);
        expect(kk.value).toBe(0x67);

        expect(skne2.instruction.value).toBe(Instruction.SKNE);
        expect(skne2.args).toHaveLength(2);
        expect(_x.value).toBe(0x0);
        expect(y.value).toBe(0x1);
    });

    test('MOV', () => {
        const mov1 = new Opcode(0x6123);
        const mov2 = new Opcode(0x8220);
        const [x, kk] = mov1.args;
        const [_x, y] = mov2.args;

        expect(mov1.instruction.value).toBe(Instruction.MOV);
        expect(mov1.args).toHaveLength(2);
        expect(x.value).toBe(0x1);
        expect(kk.value).toBe(0x23);

        expect(mov2.instruction.value).toBe(Instruction.MOV);
        expect(mov2.args).toHaveLength(2);
        expect(_x.value).toBe(0x2);
        expect(y.value).toBe(0x2);
    });

    test('ADD', () => {
        const add1 = new Opcode(0x7F23);
        const add2 = new Opcode(0x8124);
        const [x, kk] = add1.args;
        const [_x, y] = add2.args;

        expect(add1.instruction.value).toBe(Instruction.ADD);
        expect(add1.args).toHaveLength(2);
        expect(x.value).toBe(0xF);
        expect(kk.value).toBe(0x23);

        expect(add2.instruction.value).toBe(Instruction.ADD);
        expect(add2.args).toHaveLength(2);
        expect(_x.value).toBe(0x1);
        expect(y.value).toBe(0x2);
    });

    test('OR', () => {
        const or = new Opcode(0x8AB1);
        const [x, y] = or.args;

        expect(or.instruction.value).toBe(Instruction.OR);
        expect(or.args).toHaveLength(2);
        expect(x.value).toBe(0xA);
        expect(y.value).toBe(0xB);
    });

    test('AND', () => {
        const and = new Opcode(0x89C2);
        const [x, y] = and.args;

        expect(and.instruction.value).toBe(Instruction.AND);
        expect(and.args).toHaveLength(2);
        expect(x.value).toBe(0x9);
        expect(y.value).toBe(0xC);
    });

    test('RAND', () => {
        const rand = new Opcode(0xC345);
        const [x, kk] = rand.args;

        expect(rand.instruction.value).toBe(Instruction.RAND);
        expect(rand.args).toHaveLength(2);
        expect(x.value).toBe(0x3);
        expect(kk.value).toBe(0x45);
    });

    test('XOR', () => {
        const xor = new Opcode(0x8AB3);
        const [x, y] = xor.args;

        expect(xor.instruction.value).toBe(Instruction.XOR);
        expect(xor.args).toHaveLength(2);
        expect(x.value).toBe(0xA);
        expect(y.value).toBe(0xB);
    });

    test('SUB', () => {
        const sub = new Opcode(0x8995);
        const [x, y] = sub.args;

        expect(sub.instruction.value).toBe(Instruction.SUB);
        expect(sub.args).toHaveLength(2);
        expect(x.value).toBe(0x9);
        expect(y.value).toBe(0x9);
    });

    test('SHR', () => {
        const shr = new Opcode(0x8006);
        const [x] = shr.args;

        expect(shr.instruction.value).toBe(Instruction.SHR);
        expect(shr.args).toHaveLength(1);
        expect(x.value).toBe(0x0);
    });

    test('RSB', () => {
        const rsb = new Opcode(0x8127);
        const [x, y] = rsb.args;

        expect(rsb.instruction.value).toBe(Instruction.RSB);
        expect(rsb.args).toHaveLength(2);
        expect(x.value).toBe(0x1);
        expect(y.value).toBe(0x2);
    });

    test('SHL', () => {
        const shl = new Opcode(0x8EEE);
        const [x] = shl.args;

        expect(shl.instruction.value).toBe(Instruction.SHL);
        expect(shl.args).toHaveLength(1);
        expect(x.value).toBe(0xE);
    });

    test('MVI', () => {
        const mvi = new Opcode(0xAAAA);
        const [address] = mvi.args;

        expect(mvi.instruction.value).toBe(Instruction.MVI);
        expect(mvi.args).toHaveLength(1);
        expect(address.value).toBe(0xAAA);
    });

    test('JMI', () => {
        const jmi = new Opcode(0xBFEA);
        const [address] = jmi.args;

        expect(jmi.instruction.value).toBe(Instruction.JMI);
        expect(jmi.args).toHaveLength(1);
        expect(address.value).toBe(0xFEA);
    });

    test('DRAW', () => {
        const draw = new Opcode(0xD123);
        const [x, y, z] = draw.args;

        expect(draw.instruction.value).toBe(Instruction.DRAW);
        expect(draw.args).toHaveLength(3);
        expect(x.value).toBe(0x1);
        expect(y.value).toBe(0x2);
        expect(z.value).toBe(0x3);
    });

    test('SKPR', () => {
        const skpr = new Opcode(0xE49E);
        const [x] = skpr.args;

        expect(skpr.instruction.value).toBe(Instruction.SKPR);
        expect(skpr.args).toHaveLength(1);
        expect(x.value).toBe(0x4);
    });

    test('SKUP', () => {
        const skup = new Opcode(0xE0A1);
        const [x] = skup.args;

        expect(skup.instruction.value).toBe(Instruction.SKUP);
        expect(skup.args).toHaveLength(1);
        expect(x.value).toBe(0x0);
    });

    test('GDEL', () => {
        const gdel = new Opcode(0xF107);
        const [x] = gdel.args;

        expect(gdel.instruction.value).toBe(Instruction.GDEL);
        expect(gdel.args).toHaveLength(1);
        expect(x.value).toBe(0x1);
    });

    test('KEY', () => {
        const key = new Opcode(0xFF0A);
        const [x] = key.args;

        expect(key.instruction.value).toBe(Instruction.KEY);
        expect(key.args).toHaveLength(1);
        expect(x.value).toBe(0xF);
    });

    test('SDEL', () => {
        const sdel = new Opcode(0xFD15);
        const [x] = sdel.args;

        expect(sdel.instruction.value).toBe(Instruction.SDEL);
        expect(sdel.args).toHaveLength(1);
        expect(x.value).toBe(0xD);
    });

    test('SSND', () => {
        const ssnd = new Opcode(0xFC18);
        const [x] = ssnd.args

        expect(ssnd.instruction.value).toBe(Instruction.SSND);
        expect(ssnd.args).toHaveLength(1);
        expect(x.value).toBe(0xC);
    });

    test('ADI', () => {
        const adi = new Opcode(0xF31E);
        const [x] = adi.args;

        expect(adi.instruction.value).toBe(Instruction.ADI);
        expect(adi.args).toHaveLength(1);
        expect(x.value).toBe(0x3);
    });

    test('FONT', () => {
        const font = new Opcode(0xFA29);
        const [x] = font.args;

        expect(font.instruction.value).toBe(Instruction.FONT);
        expect(font.args).toHaveLength(1);
        expect(x.value).toBe(0xA);
    });

    test('BCD', () => {
        const bcd = new Opcode(0xF033);
        const [x] = bcd.args;

        expect(bcd.instruction.value).toBe(Instruction.BCD);
        expect(bcd.args).toHaveLength(1);
        expect(x.value).toBe(0x0);
    });

    test('STR', () => {
        const str = new Opcode(0xFC55);
        const [x] = str.args;

        expect(str.instruction.value).toBe(Instruction.STR);
        expect(str.args).toHaveLength(1);
        expect(x.value).toBe(0xC);
    });

    test('LDR', () => {
        const ldr = new Opcode(0xFB65);
        const [x] = ldr.args;

        expect(ldr.instruction.value).toBe(Instruction.LDR);
        expect(ldr.args).toHaveLength(1);
        expect(x.value).toBe(0xB);
    });

    it('Should throw an error upon receiving an invalid opcode', () => {
        const shouldThrow = () => {
            new Opcode(0x0000);
        };

        expect(shouldThrow).toThrow(TypeError);
    });

    it('Should format output', () => {
        const draw = new Opcode(0xDABC);
        const expectedDrawInstruction = Instruction.DRAW;
        const expectedDrawArguments = 'Ah, Bh, Ch';

        const cls = new Opcode(0x00E0);
        const expectedClsInstruction = Instruction.CLS;
        const expectedClsArguments = '';

        expect(draw.toString()).toBe(`${expectedDrawInstruction.padEnd(Opcode.INSTRUCTION_PADDING, ' ')}${expectedDrawArguments.padEnd(Opcode.ARGUMENTS_PADDING, ' ')}`)
        expect(cls.toString()).toBe(`${expectedClsInstruction.padEnd(Opcode.INSTRUCTION_PADDING, ' ')}${expectedClsArguments.padEnd(Opcode.ARGUMENTS_PADDING, ' ')}`)

    });
});