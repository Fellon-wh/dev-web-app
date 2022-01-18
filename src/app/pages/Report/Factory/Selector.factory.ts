import { Inject } from "@angular/core";
import { SelectArea, SelectAreaFactory } from "./SelectorArea.factory";

export type SelectorFactory = (
    sectionIndex: number,
    startRowIndex: number,
    startColumnIndex: number,
    endRowIndex: number,
    endColumnIndex: number
) => Selector;

export class Selector {
    
    // 起始位置
    public startArea!: SelectArea;

    // 选中区域
    public selectArea!: SelectArea;

    constructor(
        sectionIndex: number,
        startRowIndex: number,
        startColumnIndex: number,
        endRowIndex: number,
        endColumnIndex: number,
        @Inject(SelectArea) private selectAreaFactory: SelectAreaFactory
    ) {
        this.startArea = this.selectAreaFactory(sectionIndex, startRowIndex, startColumnIndex, endRowIndex, endColumnIndex);
        this.selectArea = this.selectAreaFactory(sectionIndex, startRowIndex, startColumnIndex, endRowIndex, endColumnIndex);
    }

    resizeTo(resizeArea: { sectionIndex: number | undefined; startRowIndex: number; startColumnIndex: number; endRowIndex: number; endColumnIndex: number; }) {
        this.selectArea.startRowIndex = resizeArea.startRowIndex;
        this.selectArea.startColumnIndex = resizeArea.startColumnIndex;
        this.selectArea.endRowIndex = resizeArea.endRowIndex;
        this.selectArea.endColumnIndex = resizeArea.endColumnIndex;
    }
}