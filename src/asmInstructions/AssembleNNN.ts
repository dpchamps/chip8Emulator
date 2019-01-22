import {Token} from "../Token";
import {AsmInstruction} from "./AsmInstruction";
import {Instruction} from "../types/Instruction";
import {AssemblerError, ASM_ERROR_CODE, InternalAssemblerError} from "../errors/AssemblerError";

export class AssembleNNN extends AsmInstruction {
    readonly EXPECTED_PARAMETER_LENGTH: number = 1;
    readonly instruction: Token;

    constructor(token: Token) {
        super();
        this.instruction = token;
    }

    assemble(): number {
        super.assemble();
        const {msb, nnn} = this.bytes;

        return msb | nnn;
    }

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