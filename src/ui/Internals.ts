import {h, Component, render} from 'preact';
import htm from 'htm';
import {Chip8} from "../emulator/Chip8";
import {toHexString} from "../util/OpcodeUtils";

const html = htm.bind(h);

interface IInternalsProps {
    chip8: Chip8
}

interface IInternalsState {

}

export default class Internals extends Component<IInternalsProps> {
    readonly state: IInternalsState = {};

    constructor(props: IInternalsProps) {
        super(props);
    }

    render(props: IInternalsProps, state: IInternalsState) {
        return html`
        <div id="internals">
            <table>
                <tr>
                    <th>pc:</th>
                    <th>${toHexString(props.chip8.programCounter)}</th>
                </tr>
                <tr>
                    <th>I:</th>
                    <th>${toHexString(props.chip8.indexRegister)}</th>
                </tr>
                ${
                    Array.from(this.props.chip8.registers).map( (register, index) => {
                        return html`
                            <tr>
                                <th> $${toHexString(index)}:</th>
                                <th> ${toHexString(register)}</th>
                            </tr>
                            `
                    })
                }
            </table>
            <div class="memory">
                ${
                    Array.from(this.props.chip8.memory).map( (byte, index) => {
                        const indexPointer   =  index === this.props.chip8.indexRegister ? 'idx-register' : '';
                        const programCounter = index === this.props.chip8.programCounter ? 'pgrm-counter' : '';
                        const classNames = indexPointer + ' '+ programCounter
                      return html`<span class="${classNames}">${toHexString(byte).padStart(2, '0')}</span>`;
                    }, '')
                }
            </div>
        </div>`;
    }
}
