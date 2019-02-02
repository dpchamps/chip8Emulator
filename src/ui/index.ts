import {Chip8} from "../emulator/Chip8";
import Disassembly from './Disassembly';
import Internals from './Internals';
import {h, Component, render} from 'preact';
import htm from 'htm';
import {loadFile} from "../util/FileLoader";
import {PROGRAM_OFFSET} from "../types/Chip8Specs";
import {invaders} from "../demo/invaders";

const html = htm.bind(h);
const chip8 = new Chip8();

interface IAppState {
    program: Uint8Array,
    currentInstruction: number
    isStep: boolean,
    canStep: boolean
}

interface IAppProps {
    program: string
}

export default class App extends Component<IAppProps, any> {
    readonly state: IAppState = {
        program: new Uint8Array([]),
        currentInstruction: PROGRAM_OFFSET,
        isStep: false,
        canStep: true
    };

    private animationFrame: number | null;
    private canvasRef: HTMLCanvasElement | null = null;

    constructor(props: IAppProps) {
        super(props);
        this.animationFrame = null;

        this.load().then(() => this.start());
        this.start();
    }

    componentDidMount(): void {
        if (this.canvasRef !== null)
            chip8.gpu.setCanvas(this.canvasRef);

        document.body.addEventListener('keydown', this.onKeyDown.bind(this));
    }

    async load() {
        const file = await loadFile(this.props.program);
        console.log(file);
        chip8.load(file);
        this.setState({program: file});
    }

    start() {
        this.animationFrame = requestAnimationFrame(this.update.bind(this));
    }

    render(props: any, state: IAppState) {
        return html`
        <div id="chip8">
            <div class="col1">
                <canvas ref="${(canvas: HTMLCanvasElement) => this.canvasRef = canvas}"/>
                ${this.state.isStep &&
        html`<${Disassembly} program=${state.program} currentInstruction=${state.currentInstruction} />`
            }
            </div>
            <div class="col2">
                ${this.state.isStep &&
        html`<${Internals} chip8=${chip8} />`
            }
            </div>  
        </div>`;
    }

    private update() {
        if (this.state.isStep && !this.state.canStep) {
        } else {
            let cpuCycles = chip8.targetClockSpeed / 60;

            while (cpuCycles-- > 0 && this.state.canStep) {
                chip8.cycleCpu();
                this.setState({
                    canStep: !this.state.isStep
                });
                this.setState({currentInstruction: chip8.programCounter});
            }


            chip8.update();
        }


        this.animationFrame = requestAnimationFrame(this.update.bind(this));
    }

    private onKeyDown(e: KeyboardEvent) {
        switch (e.code) {
            case 'Space' :
                this.setState({
                    canStep: true
                });
                break;
            case 'KeyP' :
                this.setState({
                    isStep: !this.state.isStep,
                    canStep: true
                });
                break;
            case 'Escape':
                chip8.initialize();
                chip8.load(this.state.program);
        }
    }
}