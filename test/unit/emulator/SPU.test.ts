import {SPU} from "../../../src/emulator/SPU";
import {IChip8Flags} from "../../../src/interfaces/IChip8Flags";

const globalAny: any = global;

const audioContextDestination = Symbol('destination');
const currentTime = Symbol('currentTime');
let state = '';

const mockGainNode = {
    gain: {
        setTargetAtTime: jest.fn()
    },
    connect: jest.fn()
};

const mockOscillatorNode = {
    frequency: {
        setValueAtTime: jest.fn()
    },
    start: jest.fn(),
    connect: jest.fn()
};

const resume = jest.fn();
resume.mockResolvedValue(true);
const AudioContextMock = jest.fn().mockImplementation(() => {
    return {
        createOscillator: () => mockOscillatorNode,
        resume,
        createGain: () => mockGainNode,
        destination: audioContextDestination,
        currentTime,
        state
    }
});

const flags: IChip8Flags = {
    draw: false,
    sound: true
};

describe('SPU', () => {
    afterEach(() => {
        globalAny.AudioContext = undefined;
    });

    describe('ctor', () => {

        it('Should produce no side effects if AudioContext is not defined', () => {
            const spu = new SPU();

            expect(spu.context).toBeUndefined();
            expect(spu.gain).toBeUndefined();
            expect(spu.oscillator).toBeUndefined();
        });

        it('Should wire the oscillator and gain nodes to context when audiocontext is defined', () => {
            globalAny.AudioContext = AudioContextMock;

            const spu = new SPU();

            expect(spu.context).not.toBeUndefined();
            expect(spu.oscillator).toBe(mockOscillatorNode);
            expect(spu.gain).toBe(mockGainNode);
            expect(spu.gain.connect).toHaveBeenCalledWith(audioContextDestination);
            expect(spu.oscillator.connect).toHaveBeenCalledWith(mockGainNode);
            expect(spu.oscillator.frequency.setValueAtTime).toHaveBeenCalledWith(SPU.HZ, currentTime);
        });
    });

    describe('update', () => {
        it('Should produce no side effects if AudioContext is undefined', () => {
            const spu = new SPU();

            const willNotThrow = () => {
                spu.update(flags)
            };

            expect(willNotThrow).not.toThrow();
        });

        it('Should attempt to resume the audiocontext if it\'s suspended', () => {
            state = 'suspended';
            globalAny.AudioContext = AudioContextMock;

            const spu = new SPU();

            spu.update(flags);

            expect(resume).toHaveBeenCalled();
        });

        it('Should start sound timer when flag was previously false', () => {
            state = '';
            globalAny.AudioContext = AudioContextMock;

            const spu = new SPU();

            spu.update(flags);

            expect(mockGainNode.gain.setTargetAtTime).toHaveBeenCalledWith(SPU.GAIN_VOLUME, currentTime, SPU.TIME_CONSTANT);
        });

        it('Should stop the sound timer when flag was previously true', () => {
            state = '';
            globalAny.AudioContext = AudioContextMock;

            const spu = new SPU();

            spu.update(flags);
            flags.sound = false;
            spu.update(flags);

            expect(mockGainNode.gain.setTargetAtTime).toHaveBeenCalledWith(0, currentTime, SPU.TIME_CONSTANT);
        });
    });
});