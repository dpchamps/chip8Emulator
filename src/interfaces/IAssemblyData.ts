import {OPCODE_BYTE} from "../types/OpcodeByte";

/**
 * Interface for use with {@link AsmInstruction} implementation classes.
 *
 * Describes the number of arguments an asm instruction contains and
 * the bytes to assemble into an opcode.
 */
export interface IAssemblyData {
    nArgs : number;
    assemblyBytes : Array<OPCODE_BYTE>
}