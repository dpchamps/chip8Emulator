import {AsmInstruction} from "./AsmInstruction";
import {Token} from "../Token";
import {Instruction} from "../types/Instruction";
import {ASM_ERROR_CODE, InternalAssemblerError} from "../errors/AssemblerError";

export class AssembleXY extends AsmInstruction {
    readonly EXPECTED_PARAMETER_LENGTH: number = 2;
    readonly instruction: Token;

    constructor(token: Token) {
        super();
        this.instruction = token;
    }

    assemble(): number {
        super.assemble();
        const {msb, x, y, lsb} = this.bytes;

        return msb | x | y | lsb;
    }

    protected setBytesFromInstruction(): void {
        switch (this.instruction.value) {
            case Instruction.SKEQ:
                this.bytes.msb = 0x5;
                break;
            case Instruction.MOV:
                this.bytes.msb = 0x8;
                break;
            case Instruction.OR:
                this.bytes.msb = 0x8;
                this.bytes.lsb = 0x1;
                break;
            case Instruction.AND:
                this.bytes.msb = 0x8;
                this.bytes.lsb = 0x2;
                break;
            case Instruction.XOR:
                this.bytes.msb = 0x8;
                this.bytes.lsb = 0x3;
                break;
            case Instruction.ADD:
                this.bytes.msb = 0x8;
                this.bytes.lsb = 0x4;
                break;
            case Instruction.SUB:
                this.bytes.msb = 0x8;
                this.bytes.lsb = 0x5;
                break;
            case Instruction.RSB:
                this.bytes.msb = 0x8;
                this.bytes.lsb = 0x7;
                break;
            case Instruction.SKNE:
                this.bytes.msb = 0x9;
                break;
            default:
                throw new InternalAssemblerError(ASM_ERROR_CODE.INSTRUCTION_NOT_IMPLEMENTED)
        }
    }

    protected setBytesFromParams(): void {
        const [x, y] = this.params;

        this.bytes.x = x.value;
        this.bytes.y = y.value;
    }
}