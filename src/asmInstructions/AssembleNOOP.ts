import {AsmInstruction} from "./AsmInstruction";
import {IAssemblyData} from "../interfaces/IAssemblyData";
import {OPCODE_BYTE} from "../types/OpcodeByte";

export class AssembleNOOP extends AsmInstruction {
    public readonly assemblyData: IAssemblyData = {
        nArgs: 1,
        assemblyBytes: [OPCODE_BYTE.MSB, OPCODE_BYTE.NNN]
    };

    protected setBytesFromInstruction(): void {
    }

    protected setBytesFromParams(): void {
        const [address] = this.params;

        this.bytes.msb = (0xF000 & address.value) >> 12;
        this.bytes.nnn = (0xFFF & address.value);
    }
}