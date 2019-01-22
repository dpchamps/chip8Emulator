import {Token} from "../Token";
import {Instruction} from "../types/Instruction";
import {AssembleNoVar} from "./AssembleNoVar";
import {AssembleNNN} from "./AssembleNNN";
import {TokenType} from "../types/TokenType";
import {AssembleXY} from "./AssembleXY";
import {AssembleXKK} from "./AssembleXKK";
import {AssembleX} from "./AssembleX";
import {AssembleXYZ} from "./AssembleXYZ";
import {AssembleNOOP} from "./AssembleNOOP";

export const asmInstructionFactory = (instructionToken: Token, ...lookAheadTokens: Array<Token>) => {
    switch (instructionToken.value) {
        case Instruction.CLS:
        case Instruction.RET:
            return new AssembleNoVar(instructionToken);
        case Instruction.JMP:
        case Instruction.JSR:
        case Instruction.MVI:
        case Instruction.JMI:
            return new AssembleNNN(instructionToken);
        case Instruction.SKEQ:
        case Instruction.SKNE:
        case Instruction.MOV:
        case Instruction.RAND:
        case Instruction.OR:
        case Instruction.AND:
        case Instruction.XOR:
        case Instruction.ADD:
        case Instruction.SUB:
        case Instruction.RSB:
            const lookAhead = lookAheadTokens[1];

            if (lookAhead.is(TokenType.REGISTER)) {
                return new AssembleXY(instructionToken);
            } else {
                return new AssembleXKK(instructionToken);
            }
        case Instruction.SHR:
        case Instruction.SHL:
        case Instruction.SKPR:
        case Instruction.SKUP:
        case Instruction.GDEL:
        case Instruction.KEY:
        case Instruction.SDEL:
        case Instruction.SSND:
        case Instruction.ADI:
        case Instruction.FONT:
        case Instruction.BCD:
        case Instruction.STR:
        case Instruction.LDR:
            return new AssembleX(instructionToken);
        case Instruction.DRAW:
            return new AssembleXYZ(instructionToken);
        case Instruction.NOOP:
            return new AssembleNOOP(instructionToken);
        default:
            return false;
    }
};