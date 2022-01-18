export type SelectAreaFactory = (
    sectionIndex: number,
    startRowIndex: number,
    startColumnIndex: number,
    endRowIndex: number,
    endColumnIndex: number,
) => SelectArea;

export class SelectArea {
    constructor(
        public sectionIndex: number,
        public startRowIndex: number,
        public startColumnIndex: number,
        public endRowIndex: number,
        public endColumnIndex: number,
    ) {}
}
