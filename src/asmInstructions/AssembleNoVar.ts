import {AsmInstruction} from "./AsmInstruction";
import {Instruction} from "../types/Instruction";
import {ASM_ERROR_CODE, InternalAssemblerError} from "../errors/AssemblerError";
import {IAssemblyData} from "../interfaces/IAssemblyData";
import {OPCODE_BYTE} from "../types/OpcodeByte";

export class AssembleNoVar extends AsmInstruction {
    public readonly assemblyData: IAssemblyData = {
        nArgs: 0,
        assemblyBytes: [OPCODE_BYTE.MSB, OPCODE_BYTE.X, OPCODE_BYTE.KK]
    };

    protected setBytesFromInstruction(): void {
        switch (this.instruction.value) {
            case Instruction.CLS:
                this.bytes.kk = 0xE0;
                break;
            case Instruction.RET:
                this.bytes.kk = 0xEE;
                break;
            default:
                throw new InternalAssemblerError(ASM_ERROR_CODE.INSTRUCTION_NOT_IMPLEMENTED);
        }
    }

    protected setBytesFromParams(): void {
    }

}