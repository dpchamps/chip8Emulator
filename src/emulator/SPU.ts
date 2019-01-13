import {IComponent} from "../interfaces/IComponent";
import {IChip8Flags} from "../interfaces/IChip8Flags";

export class SPU implements IComponent {
    static HZ = 425;
    static GAIN_VOLUME = 0.3;
    static TIME_CONSTANT = 0.015;

    oscillator!: OscillatorNode;
    gain!: GainNode;
    context!: AudioContext;

    private isOn: boolean = false;

    constructor() {
        if (typeof AudioContext === 'undefined')
            return;

        this.context = new AudioContext();
        this.gain = this.createGainNode();
        this.gain.connect(this.context.destination);
        this.oscillator = this.createOscillatorNode();
        this.oscillator.connect(this.gain);
    }

    update(flags: IChip8Flags) {
        if (typeof this.context === 'undefined')
            return;

        if (this.context.state === 'suspended') {
            this.context.resume().then(() => {
            });
        }
        if (flags.sound && !this.isOn)
            this.start();


        if (!flags.sound)
            this.stop();
    };

    private createGainNode(): GainNode {
        const gain = this.context.createGain();
        gain.gain.value = 0;

        return gain;
    }

    private createOscillatorNode(): OscillatorNode {
        const oscillator = this.context.createOscillator();

        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(SPU.HZ, this.context.currentTime);
        oscillator.start(0);
        oscillator.connect(this.gain);

        return oscillator;
    }

    private start() {
        this.gain.gain.setTargetAtTime(SPU.GAIN_VOLUME, this.context.currentTime, SPU.TIME_CONSTANT);
        this.isOn = true;
    }

    private stop() {
        this.gain.gain.setTargetAtTime(0, this.context.currentTime, SPU.TIME_CONSTANT);
        this.isOn = false;
    }
}