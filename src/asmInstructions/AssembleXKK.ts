import {AsmInstruction} from "./AsmInstruction";
import {Instruction} from "../types/Instruction";
import {ASM_ERROR_CODE, InternalAssemblerError} from "../errors/AssemblerError";
import {IAssemblyData} from "../interfaces/IAssemblyData";
import {OPCODE_BYTE} from "../types/OpcodeByte";

export class AssembleXKK extends AsmInstruction {
    public readonly assemblyData: IAssemblyData = {
        nArgs: 2,
        assemblyBytes: [OPCODE_BYTE.MSB, OPCODE_BYTE.X, OPCODE_BYTE.KK]
    };

    setBytesFromInstruction(): void {
        switch (this.instruction.value) {
            case Instruction.SKEQ:
                this.bytes.msb = 0x3;
                break;
            case Instruction.SKNE:
                this.bytes.msb = 0x4;
                break;
            case Instruction.MOV:
                this.bytes.msb = 0x6;
                break;
            case Instruction.ADD:
                this.bytes.msb = 0x7;
                break;
            case Instruction.RAND:
                this.bytes.msb = 0xC;
                break;
            default:
                throw new InternalAssemblerError(ASM_ERROR_CODE.INSTRUCTION_NOT_IMPLEMENTED);
        }
    }


    protected setBytesFromParams(): void {
        this.validate();

        const [x, kk] = this.params;

        this.bytes.x = x.value;
        this.bytes.kk = kk.value;
    }
}