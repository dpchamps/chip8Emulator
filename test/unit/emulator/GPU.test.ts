import {GPU} from "../../../src/emulator/GPU";
import {IChip8Flags} from "../../../src/interfaces/IChip8Flags";

const globalAny: any = global;

describe('GPU', () => {
    let gpu = new GPU();

    const contextMock = {
        fillStyle: '',
        fillRect: jest.fn(),
        clearRect: jest.fn()
    };

    const canvasMock = {
        getContext: jest.fn(),
    };

    canvasMock.getContext.mockReturnValue(contextMock);

    beforeEach(() => {
        gpu = new GPU();

        canvasMock.getContext.mockClear();
        contextMock.clearRect.mockClear();
        contextMock.fillRect.mockClear();
    });

    describe('ctor', () => {

        afterAll(() => {
            globalAny.document = undefined;
        });

        it('Should not initialize the canvas or context if not passed a canvas', () => {
            expect(gpu.canvas).toBeUndefined();
            expect(gpu.context).toBeUndefined();
        });

        it('Should initialize a canvas and context if the dom exists', () => {
            // @ts-ignore
            gpu = new GPU(<HTMLCanvasElement>canvasMock);

            expect(gpu.canvas).toBe(canvasMock);
            expect(gpu.canvas!.height).toBe(GPU.HEIGHT * GPU.SCALE);
            expect(gpu.canvas!.width).toBe(GPU.WIDTH * GPU.SCALE);
            expect(gpu.context).toBe(contextMock);
        });
    });

    describe('update', () => {
        const flags: IChip8Flags = {
            draw: true,
            sound: false
        };

        it('Should have no side effects if no context exists', () => {
            const screen = new Uint8Array(Array.from(gpu.screen).slice());
            const willNotThrow = () => {
                gpu.update(flags);
            };

            expect(willNotThrow).not.toThrow();
            expect(screen).toEqual(gpu.screen);
        });

        it('Should fill pixels in the canvas that correspond to the screen', () => {
            //@ts-ignore
            gpu = new GPU(canvasMock);
            gpu.screen[0] = 1;
            gpu.screen[3] = 1;
            gpu.screen[6] = 1;
            gpu.update(flags);

            expect(contextMock.clearRect).toHaveBeenCalled();
            expect(contextMock.fillRect).toHaveBeenCalledTimes(3);
            expect(contextMock.fillRect).toHaveBeenCalledWith(0, 0, GPU.SCALE, GPU.SCALE);
            expect(contextMock.fillRect).toHaveBeenCalledWith(3 * GPU.SCALE, 0, GPU.SCALE, GPU.SCALE);
            expect(contextMock.fillRect).toHaveBeenCalledWith(6 * GPU.SCALE, 0, GPU.SCALE, GPU.SCALE);
        });
    });
});