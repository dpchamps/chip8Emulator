import {AsmInstruction} from "./AsmInstruction";
import {Token} from "../Token";

export class AssembleXYZ extends AsmInstruction {
    readonly EXPECTED_PARAMETER_LENGTH: number = 3;
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
        this.bytes.msb = 0xD;
    }

    protected setBytesFromParams(): void {
        const [x, y, z] = this.params;

        this.bytes.x = x.value;
        this.bytes.y = y.value;
        this.bytes.lsb = z.value;
    }
}