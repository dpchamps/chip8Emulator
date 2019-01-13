import {PROGRAM_OFFSET, STACK_LENGTH, MEMORY_LENGTH, REGISTER_LENGTH, FONTSET_OFFSET} from "../types/Chip8Specs";
import {GPU} from "./GPU";
import {SPU} from "./SPU";
import {Opcode} from "../Opcode";
import {IChip8Flags} from "../interfaces/IChip8Flags";
import {IChip8Timers} from "../interfaces/IChip8Timers";
import {IllegalMemorySpace, StackOverflowError} from "../errors/Chip8Errors";
import {fontSet} from "./fontSet";
import {Input} from "./Input";
import {opcodes} from "./opcodes";

const STACK_BUFFER = new ArrayBuffer(STACK_LENGTH);
const MEMORY_BUFFER = new ArrayBuffer(MEMORY_LENGTH);
const REGISTER_BUFFER = new ArrayBuffer(REGISTER_LENGTH);

export class Chip8 {
    gpu: GPU;
    spu: SPU;
    input: Input;
    isRunning: boolean = false;
    opcodes!: { [index: number]: Function };
    programCounter!: number;
    stackPointer!: number;
    indexRegister!: number;
    currentOpcode!: Opcode;
    stack!: Uint16Array;
    memory!: Uint8Array;
    registers!: Uint8Array;
    timers: IChip8Timers = {
        delay: 0,
        sound: 0
    };
    flags: IChip8Flags = {
        draw: false,
        sound: false
    };
    targetClockSpeed = 800;


    constructor() {
        this.gpu = new GPU();
        this.spu = new SPU();
        this.input = new Input();
        this.opcodes = opcodes.call(this);

        this.initialize();
        this.loadFontSet();
    }

    initialize(): void {
        this.isRunning = true;
        //pointers
        this.programCounter = PROGRAM_OFFSET;
        this.indexRegister = 0;
        this.stackPointer = 0;
        //timers
        this.timers.sound = 0;
        this.timers.delay = 0;
        //flags
        this.flags.sound = false;
        this.flags.draw = false;
        //memory
        this.stack = new Uint16Array(STACK_BUFFER);
        this.memory = new Uint8Array(MEMORY_BUFFER);
        this.registers = new Uint8Array(REGISTER_BUFFER);
        this.gpu.clearScreen();

        this.currentOpcode = new Opcode(0x0000, false);
    }

    load(program: Uint8Array): void {
        this.initialize();

        if (program.length > MEMORY_LENGTH - PROGRAM_OFFSET)
            throw new RangeError('Program overflows Chip8 memory buffer');

        for (let i = 0; i < program.length; i += 1) {
            this.memory[i + PROGRAM_OFFSET] = program[i];
        }
    }

    update(): void {
        this.gpu.update(this.flags);
        this.spu.update(this.flags);
        this.timers.delay -= this.timers.delay > 0 ? 1 : 0;
        this.timers.sound -= this.timers.sound > 0 ? 1 : 0;
        this.flags.sound = Boolean(this.timers.sound);
    }

    cycleCpu(): void {
        this.decodeOpcode(this.fetchOpcode());
        this.executeOpcode();

        if (this.programCounter > MEMORY_LENGTH)
            throw new StackOverflowError(this.programCounter, this.currentOpcode);

        if (this.programCounter < PROGRAM_OFFSET || isNaN(this.programCounter))
            throw new IllegalMemorySpace(this.programCounter, this.currentOpcode);
    }

    protected advance() {
        this.programCounter += 2;
    }

    private loadFontSet(): void {
        fontSet.forEach((byte, index) => {
            this.memory[index + FONTSET_OFFSET] = byte;
        });
    }

    private fetchOpcode(): number {
        const HIGH = this.memory[this.programCounter] << 8;
        const LOW = this.memory[this.programCounter + 1] | 0;

        return HIGH | LOW;
    }

    private decodeOpcode(opcode: number): void {
        this.currentOpcode = new Opcode(opcode, false);
    }

    private executeOpcode(): void {
        this.opcodes[this.currentOpcode.bytes.msb << 12]();
    }
}