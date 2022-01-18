import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { DEFAULT_PADDING, DEFAULT_RULER_HEIGHT } from "../Constants";
import { DataService } from "./Data.service";

type RowResizerTop = number | undefined;
type ColumnResizerLeft = number | undefined;

@Injectable()
export class ResizerService {
    // 段索引
    private sectionIndex: number | undefined = undefined;
    // 行索引
    private rowIndex: number | undefined = undefined;
    private columnIndex: number | undefined = undefined;

    startLeft: number | undefined = undefined;
    lineWidth: number | undefined = undefined;

    startTop: number | undefined = undefined;
    lineHeight: number | undefined = undefined;

    // 偏移量-垂直方向
    private deltaY = 0;
    private deltaX = 0;

    private _rowResizer$ = new BehaviorSubject<RowResizerTop>(undefined);
    private _columnResizer$ = new BehaviorSubject<ColumnResizerLeft>(undefined);
    
    get rowResizer$(): Observable<RowResizerTop> {
        return this._rowResizer$.asObservable();
    }

    get columnResizer$(): Observable<ColumnResizerLeft> {
        return this._columnResizer$.asObservable();
    }

    constructor(private dataService: DataService) {}

    showRowResizer(sectionIndex: number, rowIndex: number, offsetTop: number, startPosition: number, resizerLine: number): ResizerService {
        this._rowResizer$.next(offsetTop);
        this.sectionIndex = sectionIndex;
        this.rowIndex = rowIndex;
        this.startLeft = startPosition;
        this.lineWidth = resizerLine;
        this.deltaY = 0;
        return this;
    }

    showColumnResizer(sectionIndex: number, columnIndex: number, offsetLeft: number, startPosition: number, resizerLine: number) {
        this._columnResizer$.next(offsetLeft);
        this.sectionIndex = sectionIndex;
        this.columnIndex = columnIndex;
        this.startTop = startPosition;
        this.lineHeight = resizerLine;
        this.deltaX = 0;
        return this;
    }

    moveRowResizer(movementY: number): ResizerService {
        const oldHeight = this.dataService.getSection(this.sectionIndex!).getHeight(this.rowIndex!);

        if (oldHeight + this.deltaY + movementY >= 5) {
            this.deltaY += movementY;
            this._rowResizer$.next(this._rowResizer$.value! + movementY);
        }
        return this;
    }

    moveColumnResizer(movementX: number): ResizerService {
        const oldWidth = this.dataService.getSection(this.sectionIndex!).getWidth(this.columnIndex!);
        if (oldWidth + this.deltaX + movementX >= 5) {
            this.deltaX += movementX;
            this._columnResizer$.next(this._columnResizer$.value! + movementX);
        }
        return this;
    }

    pinRowResizer() : ResizerService {
        this.dataService.resizeRowHeight(this.sectionIndex!, this.rowIndex!, this.deltaY);
        return this;
    }

    pinColumnResizer() : ResizerService {
        this.dataService.resizeColumnWidth(this.sectionIndex!, this.columnIndex!, this.deltaX);
        return this;
    }

    hideRowResizer(): ResizerService {
        this._rowResizer$.next(undefined);
        this.sectionIndex = undefined;
        this.rowIndex = undefined;
        this.startLeft = undefined;
        this.lineWidth = undefined;
        this.deltaY = 0;
        return this;
    }

    hideColumnResizer(): ResizerService {
        this._columnResizer$.next(undefined);
        this.sectionIndex = undefined;
        this.columnIndex = undefined;
        this.startTop = undefined;
        this.lineHeight = undefined;
        this.deltaX = 0;
        return this;
    }
}