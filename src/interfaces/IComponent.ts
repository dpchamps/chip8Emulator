import {IChip8Flags} from "./IChip8Flags";

export interface IComponent {
    update(flags : IChip8Flags): void;
}