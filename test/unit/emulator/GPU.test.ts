import {GPU} from "../../../src/emulator/GPU";
import {IChip8Flags} from "../../../src/interfaces/IChip8Flags";

const globalAny: any = global;

describe('GPU', () => {
    let gpu = new GPU();

    beforeEach(() => {
        gpu = new GPU();
    });

    describe('ctor', () => {

        afterAll(() => {
            globalAny.document = undefined;
        });

        it('Should not initialize the canvas or context if DOM doesn\'t exist', () => {
            expect(gpu.canvas).toBeUndefined();
            expect(gpu.context).toBeUndefined();
        });

        it('Should initialize a canvas and context if the dom exists', () => {
            const getElementById = jest.fn();
            const canvas = {
                getContext: jest.fn()
            };
            const context = jest.fn();

            getElementById.mockReturnValue(canvas);
            canvas.getContext.mockReturnValue(context);

            globalAny.document = {
                getElementById
            };

            gpu = new GPU();

            expect(gpu.canvas).toBe(canvas);
            expect(gpu.canvas!.height).toBe(GPU.HEIGHT * GPU.SCALE);
            expect(gpu.canvas!.width).toBe(GPU.WIDTH * GPU.SCALE);
            expect(gpu.context).toBe(context);
        });

        it('Initializing when DOM is present without a canvas should append a new canvas to the body', () => {
            const getElementById = jest.fn();
            const appendChild = jest.fn();
            const createElement = jest.fn();
            const canvas = {
                getContext: jest.fn()
            };
            const context = jest.fn();

            getElementById.mockReturnValue(undefined);
            canvas.getContext.mockReturnValue(context);
            createElement.mockReturnValue(canvas);

            globalAny.document = {
                getElementById,
                body: {
                    appendChild
                },
                createElement
            };

            gpu = new GPU();

            expect(globalAny.document.body.appendChild).toHaveBeenCalledWith(canvas);
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
            const getElementById = jest.fn();
            const canvas = {
                getContext: jest.fn()
            };
            const context = {
                fillStyle: jest.fn(),
                fillRect: jest.fn(),
                clearRect: jest.fn()
            };

            getElementById.mockReturnValue(canvas);
            canvas.getContext.mockReturnValue(context);

            globalAny.document = {
                getElementById
            };

            gpu = new GPU();
            gpu.screen[0] = 1;
            gpu.screen[3] = 1;
            gpu.screen[6] = 1;
            gpu.update(flags);

            expect(context.clearRect).toHaveBeenCalled();
            expect(context.fillRect).toHaveBeenCalledTimes(3);
            expect(context.fillRect).toHaveBeenCalledWith(0, 0, GPU.SCALE, GPU.SCALE);
            expect(context.fillRect).toHaveBeenCalledWith(3 * GPU.SCALE, 0, GPU.SCALE, GPU.SCALE);
            expect(context.fillRect).toHaveBeenCalledWith(6 * GPU.SCALE, 0, GPU.SCALE, GPU.SCALE);
        });
    });
});