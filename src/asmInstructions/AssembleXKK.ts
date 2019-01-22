import {AsmInstruction} from "./AsmInstruction";
import {Token} from "../Token";
import {Instruction} from "../types/Instruction";
import {ASM_ERROR_CODE, InternalAssemblerError} from "../errors/AssemblerError";

export class AssembleXKK extends AsmInstruction {
    readonly EXPECTED_PARAMETER_LENGTH: number = 2;
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