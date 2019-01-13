import {IComponent} from "../interfaces/IComponent";
import {IChip8Flags} from "../interfaces/IChip8Flags";
import {INextKeypress} from "../interfaces/INextKeypress";

export class Input implements IComponent {
    activeKeys: Array<boolean> = new Array(0xF).fill(false);
    nextKeyPressFn?: INextKeypress;
    lastKeyPressed: number | null = null;

    private keys: Array<string> = [
        'Digit1', 'Digit2', 'Digit3', 'Digit4',
        'KeyQ', 'KeyW', 'KeyE', 'KeyR',
        'KeyA', 'KeyS', 'KeyD', 'KeyF',
        'KeyZ', 'KeyX', 'KeyC', 'KeyV'
    ];

    constructor() {
        if (typeof document === 'undefined')
            return;

        document.addEventListener('keydown', this.onKeyDown.bind(this));
        document.addEventListener('keyup', this.onKeyUp.bind(this));
    }

    update(flags: IChip8Flags): void {
        if (this.nextKeyPressFn
            && this.lastKeyPressed
            && this.activeKeys[this.lastKeyPressed]) {
            this.nextKeyPressFn(this.lastKeyPressed);
            this.nextKeyPressFn = undefined;
        }
    }

    onNextKeyPress(cb: INextKeypress) {
        this.nextKeyPressFn = cb;
    }

    private onKeyDown(e: KeyboardEvent): void {
        const keyIdx = this.keys.indexOf(e.code);
        if (keyIdx === -1)
            return;

        this.lastKeyPressed = keyIdx;
        this.activeKeys[keyIdx] = true;
    }

    private onKeyUp(e: KeyboardEvent): void {
        const keyIdx = this.keys.indexOf(e.code);
        if (keyIdx === -1)
            return;

        this.activeKeys[keyIdx] = false;
    }
}