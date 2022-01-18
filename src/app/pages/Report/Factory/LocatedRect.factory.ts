import { SelectArea } from "./SelectorArea.factory";

export type LocatedRectFactory = (
    left: number,
    top: number,
    width: number,
    height: number,
    selectArea: SelectArea,
) => LocatedRect;

export class LocatedRect {
    constructor(
        public left: number,
        public top: number,
        public width: number,
        public height: number,
        public selectArea: SelectArea,
    ) {}
}
