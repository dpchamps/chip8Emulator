import {Assembler} from "../../src/Assembler";
import {Lexer} from "../../src/Lexer";
import {bytecodeArrayToString} from "../../src/util/OpcodeUtils";
import {Disassembler} from "../../src/Disassembler";



const prog = `JSR   :label-0x02F6       ; addr : 200; opcode : 0x22F6
MOV   $B, Ch              ; addr : 202; opcode : 0x6B0C
MOV   $C, 3Fh             ; addr : 204; opcode : 0x6C3F
MOV   $D, Ch              ; addr : 206; opcode : 0x6D0C
MVI   2EAh                ; addr : 208; opcode : 0xA2EA
DRAW  $A, $B, 6h          ; addr : 20A; opcode : 0xDAB6
DRAW  $C, $D, 6h          ; addr : 20C; opcode : 0xDCD6
MOV   $E, 0h              ; addr : 20E; opcode : 0x6E00
JSR   :label-0x02D4       ; addr : 210; opcode : 0x22D4
MOV   $6, 3h              ; addr : 212; opcode : 0x6603
MOV   $8, 2h              ; addr : 214; opcode : 0x6802
:label-0x0216
MOV   $0, 60h             ; addr : 216; opcode : 0x6060
SDEL  $0                  ; addr : 218; opcode : 0xF015
:label-0x021A
GDEL  $0                  ; addr : 21A; opcode : 0xF007
SKEQ  $0, 0h              ; addr : 21C; opcode : 0x3000
JMP   :label-0x021A       ; addr : 21E; opcode : 0x121A
RAND  $7, 17h             ; addr : 220; opcode : 0xC717
ADD   $7, 8h              ; addr : 222; opcode : 0x7708
MOV   $9, FFh             ; addr : 224; opcode : 0x69FF
MVI   2F0h                ; addr : 226; opcode : 0xA2F0
DRAW  $6, $7, 1h          ; addr : 228; opcode : 0xD671
:label-0x022A
MVI   2EAh                ; addr : 22A; opcode : 0xA2EA
DRAW  $A, $B, 6h          ; addr : 22C; opcode : 0xDAB6
DRAW  $C, $D, 6h          ; addr : 22E; opcode : 0xDCD6
MOV   $0, 1h              ; addr : 230; opcode : 0x6001
SKUP  $0                  ; addr : 232; opcode : 0xE0A1
ADD   $B, FEh             ; addr : 234; opcode : 0x7BFE
MOV   $0, 4h              ; addr : 236; opcode : 0x6004
SKUP  $0                  ; addr : 238; opcode : 0xE0A1
ADD   $B, 2h              ; addr : 23A; opcode : 0x7B02
MOV   $0, 1Fh             ; addr : 23C; opcode : 0x601F
AND   $B, $0              ; addr : 23E; opcode : 0x8B02
DRAW  $A, $B, 6h          ; addr : 240; opcode : 0xDAB6
MOV   $0, Ch              ; addr : 242; opcode : 0x600C
SKUP  $0                  ; addr : 244; opcode : 0xE0A1
ADD   $D, FEh             ; addr : 246; opcode : 0x7DFE
MOV   $0, Dh              ; addr : 248; opcode : 0x600D
SKUP  $0                  ; addr : 24A; opcode : 0xE0A1
ADD   $D, 2h              ; addr : 24C; opcode : 0x7D02
MOV   $0, 1Fh             ; addr : 24E; opcode : 0x601F
AND   $D, $0              ; addr : 250; opcode : 0x8D02
DRAW  $C, $D, 6h          ; addr : 252; opcode : 0xDCD6
MVI   2F0h                ; addr : 254; opcode : 0xA2F0
DRAW  $6, $7, 1h          ; addr : 256; opcode : 0xD671
ADD   $6, $8              ; addr : 258; opcode : 0x8684
ADD   $7, $9              ; addr : 25A; opcode : 0x8794
MOV   $0, 3Fh             ; addr : 25C; opcode : 0x603F
AND   $6, $0              ; addr : 25E; opcode : 0x8602
MOV   $1, 1Fh             ; addr : 260; opcode : 0x611F
AND   $7, $1              ; addr : 262; opcode : 0x8712
SKNE  $6, 0h              ; addr : 264; opcode : 0x4600
JMP   :label-0x0278       ; addr : 266; opcode : 0x1278
SKNE  $6, 3Fh             ; addr : 268; opcode : 0x463F
JMP   :label-0x0282       ; addr : 26A; opcode : 0x1282
:label-0x026C
SKNE  $7, 1Fh             ; addr : 26C; opcode : 0x471F
MOV   $9, FFh             ; addr : 26E; opcode : 0x69FF
SKNE  $7, 0h              ; addr : 270; opcode : 0x4700
MOV   $9, 1h              ; addr : 272; opcode : 0x6901
DRAW  $6, $7, 1h          ; addr : 274; opcode : 0xD671
JMP   :label-0x022A       ; addr : 276; opcode : 0x122A
:label-0x0278
MOV   $8, 2h              ; addr : 278; opcode : 0x6802
MOV   $3, 1h              ; addr : 27A; opcode : 0x6301
MOV   $0, $7              ; addr : 27C; opcode : 0x8070
SUB   $0, $B              ; addr : 27E; opcode : 0x80B5
JMP   :label-0x028A       ; addr : 280; opcode : 0x128A
:label-0x0282
MOV   $8, FEh             ; addr : 282; opcode : 0x68FE
MOV   $3, Ah              ; addr : 284; opcode : 0x630A
MOV   $0, $7              ; addr : 286; opcode : 0x8070
SUB   $0, $D              ; addr : 288; opcode : 0x80D5
:label-0x028A
SKEQ  $F, 1h              ; addr : 28A; opcode : 0x3F01
JMP   :label-0x02A2       ; addr : 28C; opcode : 0x12A2
MOV   $1, 2h              ; addr : 28E; opcode : 0x6102
SUB   $0, $1              ; addr : 290; opcode : 0x8015
SKEQ  $F, 1h              ; addr : 292; opcode : 0x3F01
JMP   :label-0x02BA       ; addr : 294; opcode : 0x12BA
SUB   $0, $1              ; addr : 296; opcode : 0x8015
SKEQ  $F, 1h              ; addr : 298; opcode : 0x3F01
JMP   :label-0x02C8       ; addr : 29A; opcode : 0x12C8
SUB   $0, $1              ; addr : 29C; opcode : 0x8015
SKEQ  $F, 1h              ; addr : 29E; opcode : 0x3F01
JMP   :label-0x02C2       ; addr : 2A0; opcode : 0x12C2
:label-0x02A2
MOV   $0, 20h             ; addr : 2A2; opcode : 0x6020
SSND  $0                  ; addr : 2A4; opcode : 0xF018
JSR   :label-0x02D4       ; addr : 2A6; opcode : 0x22D4
ADD   $E, $3              ; addr : 2A8; opcode : 0x8E34
JSR   :label-0x02D4       ; addr : 2AA; opcode : 0x22D4
MOV   $6, 3Eh             ; addr : 2AC; opcode : 0x663E
SKEQ  $3, 1h              ; addr : 2AE; opcode : 0x3301
MOV   $6, 3h              ; addr : 2B0; opcode : 0x6603
MOV   $8, FEh             ; addr : 2B2; opcode : 0x68FE
SKEQ  $3, 1h              ; addr : 2B4; opcode : 0x3301
MOV   $8, 2h              ; addr : 2B6; opcode : 0x6802
JMP   :label-0x0216       ; addr : 2B8; opcode : 0x1216
:label-0x02BA
ADD   $9, FFh             ; addr : 2BA; opcode : 0x79FF
SKNE  $9, FEh             ; addr : 2BC; opcode : 0x49FE
MOV   $9, FFh             ; addr : 2BE; opcode : 0x69FF
JMP   :label-0x02C8       ; addr : 2C0; opcode : 0x12C8
:label-0x02C2
ADD   $9, 1h              ; addr : 2C2; opcode : 0x7901
SKNE  $9, 2h              ; addr : 2C4; opcode : 0x4902
MOV   $9, 1h              ; addr : 2C6; opcode : 0x6901
:label-0x02C8
MOV   $0, 4h              ; addr : 2C8; opcode : 0x6004
SSND  $0                  ; addr : 2CA; opcode : 0xF018
ADD   $6, 1h              ; addr : 2CC; opcode : 0x7601
SKNE  $6, 40h             ; addr : 2CE; opcode : 0x4640
ADD   $6, FEh             ; addr : 2D0; opcode : 0x76FE
JMP   :label-0x026C       ; addr : 2D2; opcode : 0x126C
:label-0x02D4
MVI   2F2h                ; addr : 2D4; opcode : 0xA2F2
BCD   $E                  ; addr : 2D6; opcode : 0xFE33
LDR   2h                  ; addr : 2D8; opcode : 0xF265
FONT  $1                  ; addr : 2DA; opcode : 0xF129
MOV   $4, 14h             ; addr : 2DC; opcode : 0x6414
MOV   $5, 0h              ; addr : 2DE; opcode : 0x6500
DRAW  $4, $5, 5h          ; addr : 2E0; opcode : 0xD455
ADD   $4, 15h             ; addr : 2E2; opcode : 0x7415
FONT  $2                  ; addr : 2E4; opcode : 0xF229
DRAW  $4, $5, 5h          ; addr : 2E6; opcode : 0xD455
RET                       ; addr : 2E8; opcode : 0x00EE
:label-0x02F6
MOV   $B, 20h             ; addr : 2F6; opcode : 0x6B20
MOV   $C, 0h              ; addr : 2F8; opcode : 0x6C00
MVI   2EAh                ; addr : 2FA; opcode : 0xA2EA
:label-0x02FC
DRAW  $B, $C, 1h          ; addr : 2FC; opcode : 0xDBC1
ADD   $C, 1h              ; addr : 2FE; opcode : 0x7C01
SKEQ  $C, 20h             ; addr : 300; opcode : 0x3C20
JMP   :label-0x02FC       ; addr : 302; opcode : 0x12FC
MOV   $A, 0h              ; addr : 304; opcode : 0x6A00
RET                       ; addr : 306; opcode : 0x00EE
DATA    2EAh, 80h
DATA    2EBh, 80h
DATA    2ECh, 80h
DATA    2EDh, 80h
DATA    2EEh, 80h
DATA    2EFh, 80h
DATA    2F0h, 80h
DATA    2F1h, 0h
DATA    2F2h, 0h
DATA    2F3h, 0h
DATA    2F4h, 0h
DATA    2F5h, 0h`;

describe('test', () => {
    const lex = new Lexer(prog);
    const asm = new Assembler(lex.tokenize());

    console.log(bytecodeArrayToString(asm.program));
    const dasm = new Disassembler(asm.program);
    // console.log(dasm.toString());
    it('hello', () => {});
});