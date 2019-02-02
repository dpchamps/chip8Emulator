import {AsmInstruction} from "./AsmInstruction";
import {Instruction} from "../types/Instruction";
import {ASM_ERROR_CODE, InternalAssemblerError} from "../errors/AssemblerError";
import {IAssemblyData} from "../interfaces/IAssemblyData";
import {OPCODE_BYTE} from "../types/OpcodeByte";

export class AssembleNNN extends AsmInstruction {
    public readonly assemblyData: IAssemblyData = {
        nArgs: 1,
        assemblyBytes: [OPCODE_BYTE.MSB, OPCODE_BYTE.NNN]
    };

    setBytesFromInstruction(): void {
        switch (this.instruction.value) {
            case Instruction.JMP:
                this.bytes.msb = 0x1;
                break;
            case Instruction.JSR:
                this.bytes.msb = 0x2;
                break;
            case Instruction.MVI:
                this.bytes.msb = 0xA;
                break;
            case Instruction.JMI:
                this.bytes.msb = 0xB;
                break;
            default:
                throw new InternalAssemblerError(ASM_ERROR_CODE.INSTRUCTION_NOT_IMPLEMENTED);
        }
    }

    setBytesFromParams() {
        const [addressToken] = this.params;

        this.bytes.nnn = addressToken.value;
    }

}