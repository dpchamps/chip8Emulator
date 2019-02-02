import {AsmInstruction} from "./AsmInstruction";
import {Instruction} from "../types/Instruction";
import {ASM_ERROR_CODE, InternalAssemblerError} from "../errors/AssemblerError";
import {IAssemblyData} from "../interfaces/IAssemblyData";
import {OPCODE_BYTE} from "../types/OpcodeByte";

export class AssembleX extends AsmInstruction {
    public readonly assemblyData: IAssemblyData = {
        nArgs: 1,
        assemblyBytes: [OPCODE_BYTE.MSB, OPCODE_BYTE.X, OPCODE_BYTE.Y, OPCODE_BYTE.LSB]
    };

    setBytesFromInstruction(): void {
        switch (this.instruction.value) {
            case Instruction.SHR:
                this.bytes.msb = 0x8;
                this.bytes.lsb = 0x6;
                break;
            case Instruction.SHL:
                this.bytes.msb = 0x8;
                this.bytes.lsb = 0xE;
                break;
            case Instruction.SKPR:
                this.bytes.msb = 0xE;
                this.bytes.y = 0x9;
                this.bytes.lsb = 0xE;
                break;
            case Instruction.SKUP:
                this.bytes.msb = 0xE;
                this.bytes.y = 0xA;
                this.bytes.lsb = 0x1;
                break;
            case Instruction.GDEL:
                this.bytes.msb = 0xF;
                this.bytes.lsb = 0x7;
                break;
            case Instruction.KEY:
                this.bytes.msb = 0xF;
                this.bytes.lsb = 0xA;
                break;
            case Instruction.SDEL:
                this.bytes.msb = 0xF;
                this.bytes.y = 0x1;
                this.bytes.lsb = 0x5;
                break;
            case Instruction.SSND:
                this.bytes.msb = 0xF;
                this.bytes.y = 0x1;
                this.bytes.lsb = 0x8;
                break;
            case Instruction.ADI:
                this.bytes.msb = 0xF;
                this.bytes.y = 0x1;
                this.bytes.lsb = 0xE;
                break;
            case Instruction.FONT:
                this.bytes.msb = 0xF;
                this.bytes.y = 0x2;
                this.bytes.lsb = 0x9;
                break;
            case Instruction.BCD:
                this.bytes.msb = 0xF;
                this.bytes.y = 0x3;
                this.bytes.lsb = 0x3;
                break;
            case Instruction.STR:
                this.bytes.msb = 0xF;
                this.bytes.y = 0x5;
                this.bytes.lsb = 0x5;
                break;
            case Instruction.LDR:
                this.bytes.msb = 0xF;
                this.bytes.y = 0x6;
                this.bytes.lsb = 0x5;
                break;
            default:
                throw new InternalAssemblerError(ASM_ERROR_CODE.INSTRUCTION_NOT_IMPLEMENTED);
        }

    }

    protected setBytesFromParams(): void {
        const [x] = this.params;

        this.bytes.x = x.value;
    }
}