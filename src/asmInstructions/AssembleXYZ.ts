import {AsmInstruction} from "./AsmInstruction";
import {OPCODE_BYTE} from "../types/OpcodeByte";
import {IAssemblyData} from "../interfaces/IAssemblyData";

export class AssembleXYZ extends AsmInstruction {
    public readonly assemblyData: IAssemblyData = {
        nArgs: 3,
        assemblyBytes: [OPCODE_BYTE.MSB, OPCODE_BYTE.X, OPCODE_BYTE.Y, OPCODE_BYTE.LSB]
    };

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