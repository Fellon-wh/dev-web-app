/*
 * @Author: Fellon 
 * @Date: 2022-01-16 21:31:49 
 * @Last Modified by: Fellon
 * @Last Modified time: 2022-01-16 21:53:20
 */
import { Component,  OnInit } from "@angular/core";
import { LocatedRect, LocatedRectFactory } from "./Factory/LocatedRect.factory";
import { Selector, SelectorFactory } from "./Factory/Selector.factory";
import { SelectArea, SelectAreaFactory } from "./Factory/SelectorArea.factory";
import { ReportCellModel } from "./Models/ReportCellModel";
import { ReportColumnModel } from "./Models/ReportColumnModel";
import { ReportModel } from "./Models/ReportModel";
import { ReportRowModel } from "./Models/ReportRowModel";
import { ReportSectionModel } from "./Models/ReportSectionModel";
import { DataService } from "./Service/Data.service";
import { MouseEventService } from "./Service/MouseEvent.service";
import { RenderProxyService } from "./Service/RenderProxy.service";
import { ReportCanvasService } from "./Service/ReportCanvas.service";
import { ResizerService } from "./Service/Resizer.service";
import { RichTextService } from "./Service/RichText.service";
import { RulerService } from "./Service/Ruler.service";
import { SelectorsService } from "./Service/Selectors.service";

@Component({
    selector: 'report-editor',
    templateUrl: './ReportTemplate.component.html',
    providers: [
        RenderProxyService,
        RulerService,
        ReportCanvasService,
        DataService,
        MouseEventService,
        SelectorsService,
        {
            provide: Selector,
            useFactory: (c: SelectAreaFactory): SelectorFactory => (
                sectionIndex: number,
                startRowIndex: number,
                startColumnIndex: number,
                endRowIndex: number,
                endColumnIndex: number
            ) => new Selector(sectionIndex, startRowIndex, startColumnIndex, endRowIndex, endColumnIndex, c),
            deps: [SelectArea],
        },
        {
            provide: SelectArea,
            useFactory: (): SelectAreaFactory => (
                sectionIndex: number,
                startRowIndex: number,
                startColumnIndex: number,
                endRowIndex: number,
                endColumnIndex: number
            ) => new SelectArea(sectionIndex, startRowIndex, startColumnIndex, endRowIndex, endColumnIndex),
        },
        {
            provide: LocatedRect,
            useFactory: (): LocatedRectFactory => (
                left: number,
                top: number,
                width: number,
                height: number,
                selectArea: SelectArea
            ) => new LocatedRect(left, top, width, height, selectArea),
        },
        RichTextService,
        ResizerService,
    ],
})
export class ReportTemplateComponent implements OnInit {
    
    constructor(
        private dataService: DataService
    ) {}
    
    ngOnInit(): void {
        const reportModel = new ReportModel();
        this.dataService.reportModel = reportModel;

        this.initDataDemo(reportModel);
    }

    private initDataDemo(reportModel: ReportModel) {
        let section = new ReportSectionModel();
        reportModel.sections.push(section);
        
        for (let columnIndex = 0; columnIndex < 6; columnIndex++) {
            let column = new ReportColumnModel();
            section.columns.push(column);
        }

        let row = new ReportRowModel(); // row1
        section.rows.push(row);

        let cell = new ReportCellModel();
        row.cells.push(cell);
        cell.cellText = '名称';

        cell = new ReportCellModel();
        row.cells.push(cell);
        cell.cellText = '内瑟斯';

        cell = new ReportCellModel();
        row.cells.push(cell);
        cell.cellText = '潘森';

        cell = new ReportCellModel();
        row.cells.push(cell);
        cell.cellText = '剑圣';

        cell = new ReportCellModel();
        row.cells.push(cell);
        cell.cellText = '贾克斯';

        cell = new ReportCellModel();
        row.cells.push(cell);
        cell.cellText = '剑姬';

        row = new ReportRowModel(); // row2
        section.rows.push(row);
        cell = new ReportCellModel();
        row.cells.push(cell);
        cell.cellText = '用例';

        cell = new ReportCellModel();
        row.cells.push(cell);
        cell.cellText = '001';

        cell = new ReportCellModel();
        row.cells.push(cell);
        cell.cellText = '002';

        cell = new ReportCellModel();
        row.cells.push(cell);
        cell.cellText = '003';
        let display = cell.display;
        let border = display.border;
        border.bottomColor = '#1a4d1a';
        border.bottomStyle = 1;

        cell = new ReportCellModel();
        row.cells.push(cell);
        cell.cellText = '004';
        display = cell.display;
        border = display.border;
        border.bottomColor = '#b3b31a';
        border.bottomStyle = 3;

        cell = new ReportCellModel();
        row.cells.push(cell);
        cell.cellText = '005';

        row = new ReportRowModel(); // row3
        section.rows.push(row);
        cell = new ReportCellModel();
        row.cells.push(cell);
        cell.cellText = '颜色';

        cell = new ReportCellModel();
        row.cells.push(cell);
        cell.cellText = '红底';
        display = cell.display;
        display.backColor = '#b31a1a';

        cell = new ReportCellModel();
        row.cells.push(cell);
        cell.cellText = '文字蓝';
        display = cell.display;
        display.foreColor = '#1a3399';

        cell = new ReportCellModel();
        row.cells.push(cell);
        cell.cellText = '上边框绿';
        display = cell.display;
        border = display.border;
        border.topColor = '#1a4d1a';
        border.topStyle = 1;

        cell = new ReportCellModel();
        row.cells.push(cell);
        cell.cellText = '上下边框';
        display = cell.display;
        border = display.border;
        border.topColor = '#b3b31a';
        border.topStyle = 3;
        border.bottomColor = '#996600';
        border.bottomStyle = 2;

        cell = new ReportCellModel();
        row.cells.push(cell);
        cell.cellText = '005';


        //section2
        section = new ReportSectionModel();
        reportModel.sections.push(section);
        
        for (let columnIndex = 0; columnIndex < 7; columnIndex++) {
            let column = new ReportColumnModel();
            section.columns.push(column);
        }

        row = new ReportRowModel(); // row1
        section.rows.push(row);

        cell = new ReportCellModel();
        row.cells.push(cell);
        cell.cellText = '合并行';
        cell.isMerged = true;
        cell.isMergedHead = true;
        cell.mergedColumnSpan = 2;
        cell.mergedRowSpan = 1;
        border = cell.display.border;
        border.bottomColor = '#b31a1a';
        border.bottomStyle = 1;

        cell = new ReportCellModel();
        row.cells.push(cell);
        cell.isMerged = true;
        cell.mergedColumnSpan = 1;
        border = cell.display.border;
        border.bottomColor = '#b31a1a';
        border.bottomStyle = 1;

        cell = new ReportCellModel();
        row.cells.push(cell);
        cell.cellText = '文本加粗';
        let font = cell.display.font;
        font.name = '宋体';
        font.size = 14;
        font.bold = true;

        cell = new ReportCellModel();
        row.cells.push(cell);
        cell.cellText = '合并列';
        cell.isMerged = true;
        cell.isMergedHead = true;
        cell.mergedColumnSpan = 1;
        cell.mergedRowSpan = 2;
        border = cell.display.border;
        border.rightColor = '#b31a1a';
        border.rightStyle = 1;

        cell = new ReportCellModel();
        row.cells.push(cell);
        cell.cellText = '边框';
        border = cell.display.border;
        border.leftColor = '#b31a1a';
        border.leftStyle = 1;
        border.bottomColor = '#b31a1a';
        border.bottomStyle = 1;
        border.rightColor = '#b31a1a';
        border.rightStyle = 1;
        border.topColor = '#b31a1a';
        border.topStyle = 1;

        cell = new ReportCellModel();
        row.cells.push(cell);
        cell.cellText = '文本左对齐';
        display = cell.display;
        display.halign = 'Left';
        font = display.font;
        font.name = '宋体';
        font.size = 14;
        border = display.border;
        border.leftColor = '#b31a1a';
        border.leftStyle = 1;
        
        cell = new ReportCellModel();
        row.cells.push(cell);
        cell.cellText = '文本右对齐';
        display = cell.display;
        display.halign = 'Right';
        font = display.font;
        font.name = 'Arial';
        font.size = 12;

        row = new ReportRowModel(); // row2
        section.rows.push(row);
        cell = new ReportCellModel();
        row.cells.push(cell);
        cell.cellText = '合并行列';
        cell.isMerged = true;
        cell.isMergedHead = true;
        cell.mergedColumnSpan = 2;
        cell.mergedRowSpan = 2;
        border = cell.display.border;
        border.leftColor = '#b31a1a';
        border.leftStyle = 1;
        border.topColor = '#b31a1a';
        border.topStyle = 1;

        cell = new ReportCellModel();
        row.cells.push(cell);
        cell.isMerged = true;
        cell.mergedColumnSpan = 1;
        border = cell.display.border;
        border.rightColor = '#b31a1a';
        border.rightStyle = 1;
        border.topColor = '#b31a1a';
        border.topStyle = 1;

        cell = new ReportCellModel();
        row.cells.push(cell);
        cell.cellText = '文本倾斜';
        font = cell.display.font;
        font.name = '宋体';
        font.size = 14;
        font.italic = true;
        border = cell.display.border;
        border.leftColor = '#b31a1a';
        border.leftStyle = 1;

        cell = new ReportCellModel();
        row.cells.push(cell);
        cell.isMerged = true;
        cell.mergedRowSpan = 1;

        cell = new ReportCellModel();
        row.cells.push(cell);
        cell.cellText = '6';
        display = cell.display;
        border = display.border;
        border.topColor = '#b3b31a';
        border.topStyle = 3;
        let format = display.format;
        format.dataType = 'Money';
        format.formatString = '$##,###.##';

        cell = new ReportCellModel();
        row.cells.push(cell);
        cell.cellText = '文本上对齐';
        display = cell.display;
        display.valign = 'Top';

        cell = new ReportCellModel();
        row.cells.push(cell);
        cell.cellText = '文本下对其';
        display = cell.display;
        display.valign = 'Bottom';
        font = display.font;
        font.name = '微软雅黑';
        font.size = 12;

        row = new ReportRowModel(); // row3
        section.rows.push(row);
        cell = new ReportCellModel();
        row.cells.push(cell);
        cell.isMerged = true;
        cell.mergedRowSpan = 1;
        border = cell.display.border;
        border.leftColor = '#b31a1a';
        border.leftStyle = 1;
        border.bottomColor = '#b31a1a';
        border.bottomStyle = 1;

        cell = new ReportCellModel();
        row.cells.push(cell);
        cell.isMerged = true;
        cell.mergedColumnSpan = 1;
        cell.mergedRowSpan = 1;
        border = cell.display.border;
        border.rightColor = '#b31a1a';
        border.rightStyle = 1;
        border.bottomColor = '#b31a1a';
        border.bottomStyle = 1;

        cell = new ReportCellModel();
        row.cells.push(cell);
        cell.cellText = '文本下划线';
        font = cell.display.font;
        font.name = '宋体';
        font.size = 12;
        font.underLine = 'SolidNormal';
        border = cell.display.border;
        border.leftColor = '#b31a1a';
        border.leftStyle = 1;

        cell = new ReportCellModel();
        row.cells.push(cell);
        cell.cellText = '4';

        cell = new ReportCellModel();
        row.cells.push(cell);
        cell.cellText = '5';

        cell = new ReportCellModel();
        row.cells.push(cell);
        cell.cellText = '文本截断文本截断文本加段文本截断';
        cell.overflow = 3;

        cell = new ReportCellModel();
        row.cells.push(cell);
        cell.cellText = '文本换行\n文本换行\n换行文本';
    }
}