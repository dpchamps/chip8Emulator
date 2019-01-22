import {Token} from "../Token";
import {TokenType} from "../types/TokenType";
import {AssemblerError} from "../errors/AssemblerError";
import {IOpcodeBytes} from "../interfaces/IOpcodeBytes";

export abstract class AsmInstruction {
    abstract readonly EXPECTED_PARAMETER_LENGTH: number;
    abstract readonly instruction: Token;

    protected abstract setBytesFromInstruction(): void;

    protected abstract setBytesFromParams(): void;

    protected params: Array<Token> = [];
    protected bytes: IOpcodeBytes = {
        msb: 0,
        lsb: 0,
        x: 0,
        y: 0,
        kk: 0,
        nnn: 0
    };

    public addParam(token: Token) {
        if (token.is(TokenType.DATA) || token.is(TokenType.INSTRUCTION))
            throw new AssemblerError('Attempted to add an invalid token as an instruction parameter', token);

        this.params.push(token);
    }

    public resolveLabel(paramNumber: number, labelName: string, memoryLocation: number): void {
        const param = this.params[paramNumber];

        if (typeof param === 'undefined' || !param.is(TokenType.LABEL))
            throw new AssemblerError('Attempted to resolve a label that doesn\'t exist.');

        if (!param.equals(labelName))
            throw new AssemblerError(`Attempted to resolve mismatches label ${labelName}`, param);

        this.params[paramNumber] = new Token(TokenType.INTEGER, memoryLocation);
    }

    public assemble() : number {
        this.validate();
        this.setBytesFromInstruction();
        this.setBytesFromParams();

        this.bytes = {
            ...this.bytes,
            msb: this.bytes.msb << 12,
            x: this.bytes.x << 8,
            y: this.bytes.y << 4,
        };

        return 0;
    }

    protected validate() {
        if (this.params.length !== this.EXPECTED_PARAMETER_LENGTH) {
            throw new AssemblerError(`Expected exactly ${this.EXPECTED_PARAMETER_LENGTH} parameters, but got ${this.params.length} instead.`, this.instruction);
        }
    }

    protected verify(potentialOpcode: string) {
        if (isNaN(Number(potentialOpcode)))
            throw new AssemblerError(`Couldn't parse instruction`, this.instruction);
    }

    protected createOpcode(...params: Array<number>) {
        const padding = 4 - params.length - 1;
        let opcodeString = '0x';

        params.forEach(param => opcodeString += param.toString(16));

        this.verify(opcodeString);

        return Number(opcodeString);
    }
}