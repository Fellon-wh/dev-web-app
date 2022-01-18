/*
 * @Author: Fellon 
 * @Date: 2022-01-16 23:09:28 
 * @Last Modified by:   Fellon 
 * @Last Modified time: 2022-01-16 23:09:28 
 */
import { Inject, Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { LocatedRect, LocatedRectFactory } from "../Factory/LocatedRect.factory";
import { Selector, SelectorFactory } from "../Factory/Selector.factory";
import { SelectArea } from "../Factory/SelectorArea.factory";
import { ReportSectionModel } from "../Models/ReportSectionModel";
import { DataService } from "./Data.service";

@Injectable()
export class SelectorsService {
    
    
    private selectors$ = new BehaviorSubject<Selector[]>([]);

    get selectorChanged(): Observable<Selector[]> {
        return this.selectors$.asObservable();
    }

    selectors: Selector[] = [];
    get isEmpty(): boolean {
        return this.selectors.length === 0;
    }

    get isNotEmpty(): boolean {
        return this.selectors.length !== 0;
    }

    get last(): Selector {
        return this.selectors[this.selectors.length - 1];
    }

    constructor(
        @Inject(Selector) private selectorFactory: SelectorFactory,
        @Inject(LocatedRect) private locatedRectFactory: LocatedRectFactory,
        private dataService: DataService,
    ) {}

    /**
     * 清除所有的选中区域
     */
    public removeAll() {
        this.selectors = [];
        this.selectors$.next(this.selectors);
    }

    /**
     * 添加一块选中区域
     * @param sectionIndex 
     * @param startRowIndex 
     * @param startColumnIndex 
     */
    public addArea(sectionIndex: number, startRowIndex: number, startColumnIndex: number, endRowIndex: number, endColumnIndex: number) {

        this.selectors.push(this.selectorFactory(sectionIndex, startRowIndex, startColumnIndex, endRowIndex, endColumnIndex));
        this.selectors$.next(this.selectors);
    }

    /**
     * 扩展选中的区域
     * @param sectionIndex 
     * @param rowIndex 
     * @param columnIndex 
     */
    selectResizeTo(sectionIndex: number | undefined, rowIndex: number, columnIndex: number) {
        const { startRowIndex, startColumnIndex, endRowIndex, endColumnIndex } = this.last.startArea;
        if (startRowIndex !== undefined && startColumnIndex !== undefined && endRowIndex !== undefined && endColumnIndex !== undefined) {
            // 拓展成为一块新的领地
            const resizeArea = {
                sectionIndex: sectionIndex,
                startRowIndex: Math.min(rowIndex, startRowIndex),
                startColumnIndex: Math.min(columnIndex, startColumnIndex),
                endRowIndex: Math.max(rowIndex, endRowIndex),
                endColumnIndex: Math.max(columnIndex, endColumnIndex),
            };
            
            this.correctArea(resizeArea);
            this.last.resizeTo(resizeArea);
        }
        this.selectors$.next(this.selectors);
    }

    /**
     * 修正选中区域，含跨行跨列
     * @param resizeArea 
     */
    private correctArea(resizeArea: { sectionIndex: number | undefined; startRowIndex: number; startColumnIndex: number; endRowIndex: number; endColumnIndex: number; }) {
        const section = this.dataService.getSection(resizeArea.sectionIndex!);

        let cachaStartRowIndex = resizeArea.startRowIndex;
        let cachaStartColumnIndex = resizeArea.startColumnIndex;
        let cachaEndRowIndex = resizeArea.endRowIndex;
        let cachaEndColumnIndex = resizeArea.endColumnIndex;

        for (let index = cachaStartColumnIndex; index <= cachaEndColumnIndex; index++) {
            // 找长的最矮的
            let tempArea = this.expandArea(section, cachaStartRowIndex, index);
            if (tempArea.startRowIndex < cachaStartRowIndex) {
                cachaStartRowIndex = tempArea.startRowIndex;
            }
            
            // 找长的最高的
            tempArea = this.expandArea(section, cachaEndRowIndex, index);
            if (tempArea.endRowIndex > cachaEndRowIndex) {
                cachaEndRowIndex = tempArea.endRowIndex;
            }
        }

        for (let index = cachaStartRowIndex; index <= cachaEndRowIndex; index++) {
            // 找跑的最近的
            let tempArea = this.expandArea(section, index, cachaStartColumnIndex);
            if (tempArea.startColumnIndex < cachaStartColumnIndex) {
                cachaStartColumnIndex = tempArea.startRowIndex;
            }

            // 找跑的最远的
            tempArea = this.expandArea(section, index, cachaEndColumnIndex);
            if (tempArea.endColumnIndex > cachaEndColumnIndex) {
                cachaEndColumnIndex = tempArea.endColumnIndex;
            }
        }

        let flag = resizeArea.startRowIndex != cachaStartRowIndex
            || resizeArea.startColumnIndex != cachaStartColumnIndex
            || resizeArea.endRowIndex != cachaEndRowIndex
            || resizeArea.endColumnIndex != cachaEndColumnIndex;
        if (flag) {
            resizeArea.startRowIndex = cachaStartRowIndex;
            resizeArea.startColumnIndex = cachaStartColumnIndex;
            resizeArea.endRowIndex = cachaEndRowIndex;
            resizeArea.endColumnIndex = cachaEndColumnIndex;
            this.correctArea(resizeArea);
        }
    }

    /**
     * 该坐标单元格所占的区域。
     * @param section 
     * @param rowIndex 
     * @param columnIndex 
     * @returns 
     */
    private expandArea(section: ReportSectionModel, rowIndex: number, columnIndex: number): {startRowIndex: number, startColumnIndex: number, endRowIndex: number, endColumnIndex: number} {
        const resultArea = { startRowIndex: <number>rowIndex, startColumnIndex: <number>columnIndex, endRowIndex: <number>rowIndex, endColumnIndex: <number>columnIndex };

        let currentCell = section.rows[rowIndex].cells[columnIndex];
        if (currentCell.isMerged) {
            if (!currentCell.isMergedHead) {

                loop:
                for (let x = 0; x <= rowIndex; x++) {
                    let row = section.rows[x];
        
                    for (let y = 0; y <= columnIndex; y++) {
                        let cell = row.cells[y];
                        let rowSpan = <number>cell.mergedRowSpan || 1;
                        let columnSpan = <number>cell.mergedColumnSpan || 1;
        
                        if (x + rowSpan > rowIndex && y + columnSpan > columnIndex) {
                            resultArea.startRowIndex = x;
                            resultArea.startColumnIndex = y;
                            currentCell = cell;
                            break loop;
                        }
                    }
                }
            }
            let rowSpan = <number>currentCell.mergedRowSpan || 1;
            let columnSpan = <number>currentCell.mergedColumnSpan || 1;

            resultArea.endRowIndex = resultArea.startRowIndex + rowSpan - 1;
            resultArea.endColumnIndex = resultArea.startColumnIndex + columnSpan - 1;
        }
        return resultArea;
    }

    /**
     * 计算选中区域
     * @param selectArea 
     * @returns 
     */
    locateRect(selectArea: SelectArea): LocatedRect {
        let top = this.dataService.getTop(selectArea.sectionIndex);
        top += this.dataService.topMargin;

        const section = this.dataService.sections[selectArea.sectionIndex];
        top += section.getTop(selectArea.startRowIndex);

        let left = section.getLeft(selectArea.startColumnIndex);
        left += this.dataService.leftMargin;

        let width = section.getWidth(selectArea.startColumnIndex, selectArea.endColumnIndex - selectArea.startColumnIndex + 1);

        let height = section.getHeight(selectArea.startRowIndex, selectArea.endRowIndex - selectArea.startRowIndex + 1);

        return this.locatedRectFactory(left, top, width, height, selectArea);
    }

}