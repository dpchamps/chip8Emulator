import {Disassembler} from "../Disassembler";
import {h, Component, render} from 'preact';
import htm from 'htm';

const html = htm.bind(h);

interface IDisassemblyState {
    dasmMap: Map<number, string>,
    currentInstruction: HTMLElement|null
}

export default class Disassembly extends Component {
    dasmMap: Map<number, string> = new Map();
    props: any;

    readonly state : IDisassemblyState = {
        dasmMap: new Map(),
        currentInstruction: null
    };


    constructor(props: any) {
        super(props);

        if (props.program)
            this.loadDasm(props.program);
    }

    componentWillReceiveProps(nextProps: any, nextContext: any): void {
        if (nextProps.program)
            this.loadDasm(nextProps.program);
    }

    render(props: any, state: IDisassemblyState) {
        let found = false;
        return html`<div id='disassembly'>
            ${
            Array.from(state.dasmMap.entries()).map(([address, disassembly]) => {
                if (props.currentInstruction! === address) {
                    found = true;
                    return html`<pre class='highlight'> ${disassembly} </pre>`;
                } else if (found){
                    return html`<pre>${disassembly}</pre>`
                }
            })
            }
        </div>`;
    }

    private loadDasm(program: Uint8Array) {
        const dasm = new Disassembler(program);
        const dasmMap = new Map();
        Array.from(dasm.reachableAddresses.entries())
            .sort(([addressA], [addressB]) => addressA - addressB)
            .forEach(([address, opcode], index) => {
                dasmMap.set(address, `${index}: ${opcode.toString()}`);
            });

        this.setState({dasmMap});
    }
}