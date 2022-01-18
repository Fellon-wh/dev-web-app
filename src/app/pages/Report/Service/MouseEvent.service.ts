/*
 * @Author: Fellon 
 * @Date: 2022-01-16 23:08:46 
 * @Last Modified by:   Fellon 
 * @Last Modified time: 2022-01-16 23:08:46 
 */
import { Injectable } from "@angular/core";
import { fromEvent } from "rxjs";
import { filter, map, pairwise, tap } from "rxjs/operators";
import { DataService } from "./Data.service";
import { RenderProxyService } from "./RenderProxy.service";
import { ResizerService } from "./Resizer.service";
import { RichTextService } from "./RichText.service";
import { SelectorsService } from "./Selectors.service";

@Injectable()
export class MouseEventService {
    
    private masker!: HTMLElement;
    private rowResizer!: HTMLElement;
    private columnResizer!: HTMLElement;

    // 正在选择单元格
    isSelecting: boolean = false;
    // 鼠标正在选择行
    isRowSelecting: boolean = false;
    // 鼠标正在选择列
    isColumnSelecting: boolean = false;
    // 鼠标正在选择段
    isSectionSelecting: boolean = false;

    // 鼠标正在选中行高
    isRowResizing: boolean = false;
    // 鼠标正在选中列宽
    isColumnResizing: boolean = false;

    // 选择的起点坐标 [sectionIndex, rowIndex, columnIndex]
    selectStartArea: [number | undefined, number | undefined, number | undefined] | undefined = undefined;
    
    constructor(
        private selectorsService: SelectorsService,
        private richTextService: RichTextService,
        private resizerService: ResizerService,
        private renderProxyService: RenderProxyService,
        private dataService: DataService,
    ) {}

    initMouseEvent(masker: HTMLElement, rowResizer: HTMLElement, columnResizer: HTMLElement) {
        this.masker = masker;
        this.rowResizer = rowResizer;
        this.columnResizer = columnResizer;

        fromEvent<MouseEvent>(this.masker, 'mousemove')
            // 通道
            .pipe(
                // 每次发射执行副作用，但返回与源相同的Observable
                tap((event) => {
                    let flag = this.isSelecting || this.isRowResizing || this.isColumnResizing;
                    if (flag) {
                        return;
                    }

                    let { cursorRow, cursorColumn } = this.cursorMouseEvent(event.offsetX, event.offsetY);

                    let cursorStyle = "default";
                    let [selectRow, selectColumn, selectSection] = [false, false, false]
                    if (cursorRow && cursorColumn) {
                        selectSection = true;
                        cursorStyle = "move";
                    } else if (cursorRow) {
                        selectRow = true;
                        cursorStyle = "url(assets/report/images/select-row.cur), auto";
                    } else if (cursorColumn) {
                        selectColumn = true;
                        cursorStyle = "url(assets/report/images/select-column.cur), auto";
                    }
                    
                    [this.isRowSelecting, this.isColumnSelecting, this.isSectionSelecting] = [selectRow, selectColumn, selectSection];
                    this.masker.style.cursor = cursorStyle;
                }),
                filter((event) => {
                    let flag = this.isRowSelecting || this.isColumnSelecting || this.isSectionSelecting;
                    if (flag) {
                        return false;
                    }

                    if (!this.isSelecting) {
                        if (this.isColumnResizing) {
                            this.resizerService.moveColumnResizer(event.movementX);
                        } else if (this.isRowResizing) {
                            this.resizerService.moveRowResizer(event.movementY);
                        } else {
                            
                            let { hitSectionIndex, hitRowIndex, hitColumnIndex } = this.getFocusArea(event.offsetX, event.offsetY);
                            if (hitSectionIndex !== undefined && hitRowIndex !== undefined && hitColumnIndex !== undefined) {

                                let section = this.dataService.getSection(hitSectionIndex);
                                let cell = this.dataService.getCell(hitSectionIndex, hitRowIndex, hitColumnIndex)!;

                                let currentRowIndex = hitRowIndex;
                                let currentColumnIndex = hitColumnIndex;
                                if (cell.isMerged) {
                                    if (!cell.isMergedHead) {

                                        loop:
                                        for (let x = 0; x <= hitRowIndex; x++) {
                                            let row = section.rows[x];
                                
                                            for (let y = 0; y <= hitColumnIndex; y++) {
                                                let cell = row.cells[y];
                                                let rowSpan = <number>cell.mergedRowSpan || 1;
                                                let columnSpan = <number>cell.mergedColumnSpan || 1;
                                
                                                if (x + rowSpan > hitRowIndex && y + columnSpan > hitColumnIndex) {
                                                    currentRowIndex = x;
                                                    currentColumnIndex = y;
                                                    break loop;
                                                }
                                            }
                                        }
                                    }
                                }
                                let mergedCell = this.dataService.getCell(hitSectionIndex, currentRowIndex, currentColumnIndex)!;
                                // 先判断鼠标是否在行线上
                                let top = this.dataService.topMargin + this.dataService.getTop(hitSectionIndex) + section.getTop(currentRowIndex + (<number>mergedCell.mergedRowSpan || 1));
                                if (event.offsetY > top - 5) {
                                    this.resizerService.hideColumnResizer().showRowResizer(hitSectionIndex, hitRowIndex, top, this.dataService.leftMargin, section.getLeft());
                                } else {
                                    
                                    // 先判断鼠标是否在列线上
                                    let left = this.dataService.leftMargin + section.getLeft(currentColumnIndex + (<number>mergedCell.mergedColumnSpan || 1));
                                    if (event.offsetX > left - 5) {
                                        this.resizerService.hideRowResizer().showColumnResizer(hitSectionIndex, hitColumnIndex, left, this.dataService.getTop(hitSectionIndex) + this.dataService.topMargin, section.getTop());
                                    } else {
                                        this.resizerService.hideRowResizer().hideColumnResizer();
                                    }
                                }

                            } else {
                                this.resizerService.hideRowResizer().hideColumnResizer();
                            }
                            
                        }
                    }
                    return this.isSelecting;
                }),
                map((event) => {
                    return {...this.getFocusArea(event.offsetX, event.offsetY)};
                }),
                pairwise(),
                filter(([previous, current]) => {
                    return (previous.hitSectionIndex === current.hitSectionIndex
                        && (previous.hitColumnIndex !== current.hitColumnIndex
                            || previous.hitRowIndex !== current.hitRowIndex));
                }),
                map(([before, after]) => after),
            )
            // 订阅通知
            .subscribe(({ hitSectionIndex, hitRowIndex, hitColumnIndex }) => {
                
                const [sectionIndex, startRowIndex, startColumnIndex] = this.selectStartArea!;
                if (hitSectionIndex !== undefined && sectionIndex !== hitSectionIndex) {
                    return;
                }
                if (startRowIndex === hitRowIndex && startColumnIndex === hitColumnIndex) {
                    return;
                }
                
                if (startRowIndex !== undefined && startColumnIndex !== undefined) {
                    if (hitRowIndex !== undefined && hitColumnIndex !== undefined) {
                        this.selectorsService.selectResizeTo(hitSectionIndex, hitRowIndex, hitColumnIndex);
                    }
                }
            });

        fromEvent<MouseEvent>(this.masker, "mousedown")
            .pipe(
                filter((event) => {
                    return event.which === 1;
                }),
            )
            .subscribe((event) => {
                event.preventDefault();

                // 单击、双击
                if (event.detail === 1) {

                    this.richTextService.focus();
                    this.isSelecting = true;

                    const { hitSectionIndex, hitRowIndex, hitColumnIndex } = this.getFocusArea(event.offsetX, event.offsetY);
                    this.selectStartArea = [hitSectionIndex, hitRowIndex, hitColumnIndex];

                    this.selectorsService.removeAll();
                    if (hitSectionIndex !== undefined && hitRowIndex !== undefined && hitColumnIndex !== undefined) {

                        let startRowIndex = hitRowIndex;
                        let startColumnIndex = hitColumnIndex;
                        let endRowIndex = hitRowIndex;
                        let endColumnIndex = hitColumnIndex;

                        const section = this.dataService.getSection(hitSectionIndex);
                        if (this.isRowSelecting) {
                            // 1.点击行
                            endColumnIndex = section.columns.length - 1;

                        } else if (this.isColumnSelecting) {
                            // 2.点击列
                            endRowIndex = section.rows.length - 1;

                        } else if (this.isSectionSelecting) {
                            // 3.点击段
                            endColumnIndex = section.columns.length - 1;
                            endRowIndex = section.rows.length - 1;

                        } else {
                            // 4.点击单元格,这里要处理是不是合并单元格
                            let currentCell = section.rows[startRowIndex].cells[startColumnIndex];
                            if (currentCell.isMerged) {
                                if (!currentCell.isMergedHead) {

                                    loop:
                                    for (let x = 0; x <= startRowIndex; x++) {
                                        let row = section.rows[x];
                            
                                        for (let y = 0; y <= startColumnIndex; y++) {
                                            let cell = row.cells[y];
                                            let rowSpan = <number>cell.mergedRowSpan || 1;
                                            let columnSpan = <number>cell.mergedColumnSpan || 1;
                            
                                            if (x + rowSpan > startRowIndex && y + columnSpan > startColumnIndex) {
                                                startRowIndex = x;
                                                startColumnIndex = y;
                                                currentCell = cell;
                                                break loop;
                                            }
                                        }
                                    }
                                }
                                let rowSpan = <number>currentCell.mergedRowSpan || 1;
                                let columnSpan = <number>currentCell.mergedColumnSpan || 1;

                                endRowIndex = startRowIndex + rowSpan - 1;
                                endColumnIndex = startColumnIndex + columnSpan - 1;
                            }
                        }
                        this.selectorsService.addArea(hitSectionIndex, startRowIndex, startColumnIndex, endRowIndex, endColumnIndex);
                    }

                } else if (event.detail === 2) {
                    if (!this.isSectionSelecting && !this.isRowSelecting && !this.isColumnSelecting) {
                        // 双击打开编辑
                        this.richTextService.focus(true);
                    }
                }
            });

        fromEvent(this.rowResizer, 'mousedown').subscribe(() => {
            this.richTextService.focus();
            this.isRowResizing = true;
        });

        fromEvent(this.columnResizer, 'mousedown').subscribe(() => {
            this.richTextService.focus();
            this.isColumnResizing = true;
        });

        fromEvent(document, "mouseup").subscribe((event) => {
            if (this.isRowResizing) {
                this.isRowResizing = false;
                this.resizerService.pinRowResizer().hideRowResizer();
                this.dataService.rerender();
            }
            if (this.isColumnResizing) {
                this.isColumnResizing = false;
                this.resizerService.pinColumnResizer().hideColumnResizer();
                this.dataService.rerender();
            }
            this.selectStartArea = undefined;
            this.isSelecting = false;
        });
    }
    

    /**
     * 鼠标位置是否选中行、列、段
     * @param offsetX 
     * @param offsetY 
     */
    private cursorMouseEvent(offsetX: number, offsetY: number): { cursorRow: boolean; cursorColumn: boolean } {
        let result = { cursorRow: false, cursorColumn: false };
        
        let startTop = this.dataService.topMargin;
        let startLeft = this.dataService.leftMargin;
        // 在面板内
        if (offsetX > startLeft
            && offsetY > startTop
            && offsetY < startTop + this.dataService.reportModel.getTop()) {
            
            if (offsetX < startLeft + 5) {
                result.cursorRow = true;
            }

            for (let sectionIndex = 0; sectionIndex < this.dataService.sections.length; sectionIndex++) {
                const section = this.dataService.sections[sectionIndex];
                
                let currentTop = this.dataService.reportModel.getTop(sectionIndex) + startTop;
                if (currentTop < offsetY && currentTop + 5 > offsetY && offsetX < section.getLeft()) {
                    result.cursorColumn = true;
                    break;
                }
            }
        }

        return result;
    }

    /**
     * 通过鼠标坐标计算点击的位置
     * @param offsetX 
     * @param offsetY 
     */
    private getFocusArea(offsetX: number, offsetY: number): { hitSectionIndex: number | undefined; hitRowIndex: number | undefined; hitColumnIndex: number | undefined} {
        let result = { hitSectionIndex: <number | undefined>undefined, hitRowIndex: <number | undefined>undefined, hitColumnIndex: <number | undefined>undefined };

        let startTop = this.dataService.topMargin;
        let startLeft = this.dataService.leftMargin;
        
        if (offsetX > startLeft
            && offsetY > startTop
            && offsetY < startTop + this.dataService.reportModel.getTop()) {

            for (let sectionIndex = 0; sectionIndex < this.dataService.sections.length; sectionIndex++) {
                const section = this.dataService.sections[sectionIndex];
                
                // 鼠标坐标在该段内
                let currentTop = this.dataService.reportModel.getTop(sectionIndex) + startTop;
                if (currentTop < offsetY && currentTop + section.getTop() > offsetY) {
                    // 查找行坐标
                    for (let rowIndex = 0; rowIndex < section.rows.length; rowIndex++) {
                        let rowHeight = section.getHeight(rowIndex);
                        if (currentTop + rowHeight > offsetY) {
                            result.hitSectionIndex = sectionIndex;
                            result.hitRowIndex = rowIndex;
                            break;
                        }
                        currentTop += rowHeight;
                    }

                    // 查找列坐标
                    let currentLeft = startLeft;
                    for (let columnIndex = 0; columnIndex < section.columns.length; columnIndex++) {
                        let columnWidth = section.getWidth(columnIndex);
                        if (currentLeft + columnWidth > offsetX) {
                            result.hitColumnIndex = columnIndex;
                            break;
                        }
                        currentLeft += columnWidth;
                    }
                }
                // 找到后就中断了
                if (currentTop > offsetY) {
                    break;
                }
                
            }
        }
        return result;
    }

}