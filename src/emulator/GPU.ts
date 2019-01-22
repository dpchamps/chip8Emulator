import {IComponent} from "../interfaces/IComponent";
import {IChip8Flags} from "../interfaces/IChip8Flags";

export class GPU implements IComponent {
    static HEIGHT = 32;
    static WIDTH = 64;
    static SCALE = 7;

    screen: Uint8Array;
    canvas?: HTMLCanvasElement;
    context?: CanvasRenderingContext2D;

    constructor(canvas: undefined | HTMLCanvasElement = undefined) {
        this.screen = new Uint8Array(GPU.WIDTH * GPU.HEIGHT);
        this.canvas = canvas;
        if (canvas)
            this.canvasSetup();

    }

    update(flags: IChip8Flags) {
        if (flags.draw && this.context)
            this.draw();
    }

    clearScreen() {
        for (let i = 0; i < GPU.WIDTH * GPU.HEIGHT; i += 1) {
            this.screen[i] = 0;
        }
    }

    setCanvas(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.canvasSetup();
    }

    private draw() {
        this.context!.clearRect(0, 0, GPU.WIDTH * GPU.SCALE, GPU.HEIGHT * GPU.SCALE);
        this.screen.forEach((cell, index) => {
            const x = (index % GPU.WIDTH) * GPU.SCALE;
            const y = ((index / GPU.WIDTH) | 0) * GPU.SCALE;
            const colorWrap = index % (GPU.HEIGHT * GPU.SCALE);

            if (cell) {
                this.context!.fillStyle = `hsl(${42 + colorWrap * 0.06}, 63%, 72%)`;
                this.context!.fillRect(x, y, GPU.SCALE, GPU.SCALE);
            }
        })
    }

    private canvasSetup(): void {
        if (!this.canvas)
            throw new TypeError(`Canvas has not been set`);

        const context = this.canvas.getContext('2d')!;

        this.canvas.height = GPU.HEIGHT * GPU.SCALE;
        this.canvas.width = GPU.WIDTH * GPU.SCALE;

        this.context = context;
    }
}