/*
 * @Author: Fellon 
 * @Date: 2022-01-16 23:08:37 
 * @Last Modified by:   Fellon 
 * @Last Modified time: 2022-01-16 23:08:37 
 */
import { Injectable } from "@angular/core";
import { ReportCellModel } from "../Models/ReportCellModel";
import { ReportModel } from "../Models/ReportModel";
import { ReportSectionModel } from "../Models/ReportSectionModel";
import { RenderProxyService } from "./RenderProxy.service";

@Injectable()
export class DataService {
    
    reportModel!: ReportModel;
    
    constructor(private renderProxyService: RenderProxyService,) {}

    get sections(): (ReportSectionModel)[] {
        return this.reportModel.sections;
    }

    get width(): number {
        return this.reportModel.paperWidth;
    }

    get height(): number {
        return this.reportModel.paperHeight;
    }

    get leftMargin(): number {
        return this.reportModel.leftMargin;
    }

    get topMargin(): number {
        return this.reportModel.topMargin;
    }

    rerender(): void {
        this.renderProxyService.render('all');
    }

    getSection(index: number): ReportSectionModel {
        return this.reportModel.sections[index];
    }

    getCell(sectionIndex: number, rowIndex: number, columnIndex: number): ReportCellModel | undefined {
        
        if (sectionIndex === undefined || rowIndex === undefined || columnIndex === undefined) {
            console.log("Illegal argument exception!!!");
            return undefined;
        }
        if (sectionIndex < 0 || sectionIndex >= this.sections.length) {
            console.log("Illegal argument exception!!!");
            return undefined;
        }
        const section = this.reportModel.sections[sectionIndex];

        if (rowIndex < 0 || rowIndex >= section.rows.length) {
            console.log("Illegal argument exception!!!");
            return undefined;
        }

        const row = section.rows[rowIndex];
        if (columnIndex < 0 || columnIndex >= row.cells.length) {
            console.log("Illegal argument exception!!!");
            return undefined;
        }
        return row.cells[columnIndex];
    }

    /**
     * 获取段的起始位置（距离顶部）
     * @param index 
     * @returns 
     */
    getTop(index: number): number {
        return this.reportModel.getTop(index);
    }

    /**
     * 删除段
     * @param index 
     * @returns 
     */
     deleteSection(index: number): void {
        if (index < 0 || index >= this.sections.length) {
            console.log("Illegal argument exception!!!");
            return;
        }
        this.reportModel.deleteSection(index);
    }

    /**
     * 重设行高
     * @param sectionIndex 
     * @param rowIndex 
     * @param deltaY 
     */
    resizeRowHeight(sectionIndex: number, rowIndex: number, deltaY: number) {
        const section = this.getSection(sectionIndex);
        const row = section.rows[rowIndex];
        const previousHeight = row.height!;
        if (row) {
            row.height = previousHeight + deltaY;
        }
    }

    resizeColumnWidth(sectionIndex: number, columnIndex: number, deltaX: number) {
        const section = this.getSection(sectionIndex);
        const column = section.columns[columnIndex];
        const previousHeight = column.width!;
        if (column) {
            column.width = previousHeight + deltaX;
        }
    }
}