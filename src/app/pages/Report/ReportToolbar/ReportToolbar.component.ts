/*
 * @Author: Fellon 
 * @Date: 2022-01-16 21:41:29 
 * @Last Modified by:   Fellon 
 * @Last Modified time: 2022-01-16 21:41:29 
 */
import { Component } from "@angular/core";
import { ReportCellModel } from "../Models/ReportCellModel";
import { ReportColumnModel } from "../Models/ReportColumnModel";
import { ReportRowModel } from "../Models/ReportRowModel";
import { ReportSectionModel } from "../Models/ReportSectionModel";
import { DataService } from "../Service/Data.service";
import { RenderProxyService } from "../Service/RenderProxy.service";
import { SelectorsService } from "../Service/Selectors.service";

@Component({
    selector: 'report-toolbar',
    templateUrl: './ReportToolbar.component.html',
    host: {
        class: 'report-toolbar',
    },
})
export class ReportToolbarComponent {
    
    constructor(
        private dataService: DataService,
        private selectorsService: SelectorsService,
        private renderProxyService: RenderProxyService,
    ) {}

    onClickCellMerge() {
        const selectArea = this.selectorsService.last?.selectArea;

        if (selectArea) {
            const sectionModel = this.dataService.getSection(selectArea.sectionIndex);

            for (let rowIndex = selectArea.startRowIndex; rowIndex <= selectArea.endRowIndex; rowIndex++) {
                let rowModel = sectionModel.rows[rowIndex];

                for (let cellIndex = selectArea.startColumnIndex; cellIndex <= selectArea.endColumnIndex; cellIndex++) {
                    let cellModel = rowModel.cells[cellIndex];

                    cellModel.isMerged = true;

                    let rowSpan = rowIndex - selectArea.startRowIndex;
                    let columnSpan = cellIndex - selectArea.startColumnIndex;
                    if (rowSpan === 0 && columnSpan === 0) {
                        cellModel.isMergedHead = true;
                        cellModel.mergedRowSpan = selectArea.endRowIndex - rowIndex + 1;
                        cellModel.mergedColumnSpan = selectArea.endColumnIndex - cellIndex + 1;
                        continue;
                    }

                    cellModel.isMergedHead = false;
                    cellModel.mergedRowSpan = (rowSpan === 0 ? undefined : rowSpan);
                    cellModel.mergedColumnSpan = (columnSpan === 0 ? undefined : columnSpan);
                }
            }
            this.renderProxyService.render("body");
        }
    }

    onClickCellSplit() {
        const selectArea = this.selectorsService.last?.selectArea;

        if (selectArea) {
            const sectionModel = this.dataService.getSection(selectArea.sectionIndex);

            for (let rowIndex = selectArea.startRowIndex; rowIndex <= selectArea.endRowIndex; rowIndex++) {
                let rowModel = sectionModel.rows[rowIndex];

                for (let cellIndex = selectArea.startColumnIndex; cellIndex <= selectArea.endColumnIndex; cellIndex++) {
                    let cellModel = rowModel.cells[cellIndex];

                    cellModel.isMerged = false;
                    cellModel.isMergedHead = false;
                    cellModel.mergedRowSpan = undefined;
                    cellModel.mergedColumnSpan = undefined;
                }
            }
            this.renderProxyService.render("body");
        }
    }

    onClickRowInsertAbove() {
        const selectArea = this.selectorsService.last?.selectArea;

        if (selectArea) {
            const sectionModel = this.dataService.getSection(selectArea.sectionIndex);
            sectionModel.addRow(selectArea.startRowIndex);
            this.renderProxyService.render("body");
        }
    }

    onClickRowInsertBelow() {
        const selectArea = this.selectorsService.last?.selectArea;

        if (selectArea) {
            const sectionModel = this.dataService.getSection(selectArea.sectionIndex);
            sectionModel.addRow(selectArea.endRowIndex + 1);
            this.renderProxyService.render("body");
        }
    }

    onClickRowDelete() {
        const selectArea = this.selectorsService.last?.selectArea;

        if (selectArea) {
            const sectionModel = this.dataService.getSection(selectArea.sectionIndex);
            sectionModel.deleteRow(selectArea.startRowIndex);
            if (sectionModel.rows.length === 0) {
                this.dataService.deleteSection(selectArea.sectionIndex);
                this.selectorsService.removeAll();
            }
            this.renderProxyService.render("body");
        }
    }


    onClickColumnInsertLeft() {
        const selectArea = this.selectorsService.last?.selectArea;

        if (selectArea) {
            const sectionModel = this.dataService.getSection(selectArea.sectionIndex);
            sectionModel.addColumn(selectArea.startColumnIndex);
            this.renderProxyService.render("body");
        }
    }

    onClickColumnInsertRight() {
        const selectArea = this.selectorsService.last?.selectArea;

        if (selectArea) {
            const sectionModel = this.dataService.getSection(selectArea.sectionIndex);
            sectionModel.addColumn(selectArea.endColumnIndex + 1);
            this.renderProxyService.render("body");
        }
    }

    onClickColumnDelete() {
        const selectArea = this.selectorsService.last?.selectArea;

        if (selectArea) {
            const sectionModel = this.dataService.getSection(selectArea.sectionIndex);
            sectionModel.deleteColumn(selectArea.startColumnIndex);
            if (sectionModel.columns.length === 0) {
                this.dataService.deleteSection(selectArea.sectionIndex);
                this.selectorsService.removeAll();
            }
            this.renderProxyService.render("body");
        }
    }


    onClickSectionInsertAbove() {
        const selectArea = this.selectorsService.last?.selectArea;
        let insertIndex = selectArea?.sectionIndex || 0;
        
        const section = this.createSection();
        this.dataService.sections.splice(insertIndex, 0, section);
        this.renderProxyService.render("body");
    }

    onClickSectionInsertBelow() {
        const selectArea = this.selectorsService.last?.selectArea;

        let insertIndex = selectArea?.sectionIndex;
        if (insertIndex === undefined) {
            insertIndex = this.dataService.sections.length;
        } else {
            insertIndex++;
        }

        const section = this.createSection();
        this.dataService.sections.splice(insertIndex, 0, section);
        this.renderProxyService.render("body");
    }

    onClickSectionDelete() {
        const selectArea = this.selectorsService.last?.selectArea;

        if (selectArea) {
            this.dataService.deleteSection(selectArea.sectionIndex);
            this.selectorsService.removeAll();
            this.renderProxyService.render("body");
        }
    }

    private createSection(): ReportSectionModel {
        const section = new ReportSectionModel();
        for (let index = 0; index < 5; index++) {
            let column = new ReportColumnModel();
            column.width = 80;
            section.columns.push(column);
        }

        for (let rowIndex = 0; rowIndex < 3; rowIndex++) {
            let row = new ReportRowModel();
            row.height = 30;
            section.rows.push(row);

            for (let columnIndex = 0; columnIndex < section.columns.length; columnIndex++) {
                let cell = new ReportCellModel();
                row.cells.push(cell);
            }
        }

        return section;
    }
}