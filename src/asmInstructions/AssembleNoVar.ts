import {AsmInstruction} from "./AsmInstruction";
import {Token} from "../Token";
import {Instruction} from "../types/Instruction";
import {ASM_ERROR_CODE, InternalAssemblerError} from "../errors/AssemblerError";

export class AssembleNoVar extends AsmInstruction {
    readonly EXPECTED_PARAMETER_LENGTH: number = 0;
    readonly instruction: Token;

    constructor(token: Token) {
        super();
        this.instruction = token;
    }


    assemble(): number {
        super.assemble();
        const {msb, x, kk} = this.bytes;

        return msb | x | kk;
    }

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