import {Input} from "../../../../src/emulator/Input";
import {IChip8Flags} from "../../../../src/interfaces/IChip8Flags";

const globalAny: any = global;

const eventRegistry: Map<string, Function> = new Map();

const document = {
    addEventListener(eventType: string, event: Function) {
        eventRegistry.set(eventType, event);
    }
};

const flags: IChip8Flags = {
    sound: false,
    draw: false
};

describe('Input', () => {
    afterEach(() => {
        globalAny.document = undefined;
        eventRegistry.clear();
    });

    describe('ctor', () => {

        it('Should do nothing if the DOM doesn\'t exist', () => {
            const willNotThrow = () => {
                new Input();
            };

            expect(willNotThrow).not.toThrow();
        });

        it('Should add two event listeners to the document', () => {
            globalAny.document = document;

            new Input();

            expect(typeof eventRegistry.get('keydown') === 'function').toBe(true);
            expect(typeof eventRegistry.get('keyup') === 'function').toBe(true);
        });
    });

    describe('update', () => {
        it('Should fire the nextKeyPressed function under the right conditions', () => {
            const nextKeyPressFnMock = jest.fn();
            const input = new Input();

            input.lastKeyPressed = 0x2;
            input.nextKeyPressFn = nextKeyPressFnMock;
            input.activeKeys[0x2] = true;

            input.update(flags);

            expect(nextKeyPressFnMock).toHaveBeenCalled();
            expect(input.nextKeyPressFn).toBeUndefined();
        });

        it('Should not fire the nextKeyPressed function if there is no last key pressed, or the last key pressed is no longer active', () => {
            const nextKeyPressFnMock = jest.fn();
            const input = new Input();

            input.nextKeyPressFn = nextKeyPressFnMock;

            input.lastKeyPressed = 0x5;

            input.update(flags);

            input.lastKeyPressed = null;
            input.activeKeys[0x5] = true;

            input.update(flags);

            expect(nextKeyPressFnMock).not.toHaveBeenCalled();
        })
    });

    describe('keypress events', () => {
        globalAny.document = document;

        let keyBoardEvent  = {};
        const input = new Input();
        const keyDownEvent = eventRegistry.get('keydown');
        const keyUpEvent = eventRegistry.get('keyup');

        it('Should register key press events for expected keys, do nothing for unexpected keys', () => {
            keyDownEvent!({code : 'Digit1'});
            keyDownEvent!({code : 'KeyV'});
            keyDownEvent!({code : 'Space'});

            expect(input.activeKeys[0x0]).toBe(true);
            expect(input.activeKeys[0xF]).toBe(true);
            expect(input.lastKeyPressed).toBe(0xF);
        });

        it('Should deregister keys that have been pressed, do nothing for unexpected or non-registered keys', () => {
            keyDownEvent!({code : 'Digit1'});
            keyDownEvent!({code : 'KeyV'});

            keyUpEvent!({code : 'Digit1'});
            keyUpEvent!({code : 'KeyV'});

            keyUpEvent!({code : 'Space'});
            keyUpEvent!({code : 'Digit2'});

            expect(input.activeKeys[0x0]).toBe(false);
            expect(input.activeKeys[0x1]).toBe(false);
            expect(input.activeKeys[0xF]).toBe(false);
            expect(input.lastKeyPressed).toBe(0xF);
        });
    })
});