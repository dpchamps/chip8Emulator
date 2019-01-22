import {AsmInstruction} from "./AsmInstruction";
import {Token} from "../Token";

export class AssembleNOOP extends AsmInstruction {
    readonly EXPECTED_PARAMETER_LENGTH: number = 1;
    readonly instruction: Token;

    constructor(token: Token) {
        super();
        this.instruction = token;
    }

    assemble() {
        super.assemble();

        const {msb, nnn} = this.bytes;

        return msb | nnn;
    }

    protected setBytesFromInstruction(): void {
    }

    protected setBytesFromParams(): void {
        const [address] = this.params;

        this.bytes.msb = (0xF000 & address.value) >> 12;
        this.bytes.nnn = (0xFFF & address.value);
    }

}