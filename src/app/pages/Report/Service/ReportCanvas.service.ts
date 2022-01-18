/*
 * @Author: Fellon 
 * @Date: 2022-01-16 23:09:00 
 * @Last Modified by:   Fellon 
 * @Last Modified time: 2022-01-16 23:09:00 
 */
import { Injectable } from "@angular/core";
import { DEFAULT_BORDER_COLOR, DEFAULT_BORDER_WIDTH, DEFAULT_CELL_BACKGROUND, DEFAULT_PADDING, DEFAULT_RULER_HEIGHT, DEFAULT_TEXT_STYLE } from "../Constants";
import { ReportCellModel } from "../Models/ReportCellModel";
import { DataService } from "./Data.service";

@Injectable()
export class ReportCanvasService {
    
    // 画布
    private canvas!: HTMLCanvasElement;
    private context!: CanvasRenderingContext2D;

    // 蒙版
    private masker!: HTMLElement;

    get height(): number {
        return this.canvas.getBoundingClientRect().height;
    }
    
    get width(): number {
        return this.canvas.getBoundingClientRect().width;
    }

    constructor(private dataService: DataService) {}
    
    public init(canvas: HTMLCanvasElement, masker: HTMLElement): void {

        this.canvas = canvas;
        this.context = this.canvas.getContext("2d")!;
        this.canvas.width = this.dataService.width;
        this.canvas.height = this.dataService.height;

        this.masker = masker;
        // this.masker.style.left = `${DEFAULT_RULER_HEIGHT + DEFAULT_PADDING}px`;
        // this.masker.style.top = `${DEFAULT_RULER_HEIGHT + DEFAULT_PADDING}px`;
        // this.masker.style.width = `${this.dataService.width}px`;
        // this.masker.style.height = `${this.dataService.height}px`;
        
        this.masker.oncontextmenu = () => {return false;};
    }

    setStyle(styles: Partial<CanvasRenderingContext2D>): ReportCanvasService {
        Object.assign(this.context, styles);
        return this;
    }

    textStyle(style: {[key: string]: string | boolean | number}): ReportCanvasService {
        const s: {[key: string]: string | boolean | number} = {
            ...DEFAULT_TEXT_STYLE,
            ...style
        };

        this.setStyle({
            textAlign: s.textAlign,
            textBaseline: s.textBaseline,
            font: `${s.italic ? 'italic' : ''} ${s.bold ? 700 : 500} ${s.fontSize}px ${s.fontName}`,
            fillStyle: s.color
        } as Partial<CanvasRenderingContext2D>);
        return this;
    }

    setLineDash(segments: number[]): ReportCanvasService {
        this.context.setLineDash(segments);
        return this;
    }

    measureTextWidth(text: string): number {
        return this.context.measureText(text).width;
    }

    stroke(): ReportCanvasService {
        this.context.stroke();
        return this;
    }

    line(...points: number[]): ReportCanvasService {
        if (points.length == 4) {
            const [startLeft, startTop, endLeft, endTop] = points;
            this.beginPath();
            this.context.moveTo(startLeft, startTop);
            this.context.lineTo(endLeft, endTop);
            this.stroke();
            this.restore();
        }
        return this;
    }

    rect(left: number, top: number, width: number, height: number): void {
        this.context.rect(left, top, width, height);
    }

    fillRect(left: number, top: number, width: number, height: number): void {
        this.context.fillRect(left, top, width, height);
    }

    fill(): void {
        this.context.fill();
    }

    /**
     * 绘制段
     * @param sectionIndex 
     * @param startLeft
     * @param startTop 
     */
    drawSection(sectionIndex: number, startLeft: number, startTop: number): void {
        const section = this.dataService.getSection(sectionIndex);
        for (let rowIndex = 0; rowIndex < section.rows.length; rowIndex++) {
            let row = section.rows[rowIndex];
            let top = section.getTop(rowIndex);
            top += startTop;

            let rowBackColor = row.backColor;

            for (let cellIndex = 0; cellIndex < row.cells.length; cellIndex++) {
                let cell = row.cells[cellIndex];
                // 被合并的单元格忽略
                if (cell.isMerged && !cell.isMergedHead) {
                    continue;
                }

                let display = cell.display;

                // 背景色优先级：单元格 > 行
                let backColor = display.backColor || rowBackColor;

                let left = section.getLeft(cellIndex);
                left += startLeft;
                
                let columnSpan = <number>cell.mergedColumnSpan || 1;
                let rowSpan = <number>cell.mergedRowSpan || 1;
                let width = section.getWidth(cellIndex, columnSpan);
                let height = section.getHeight(rowIndex, rowSpan);
                
                // 绘制单元格填充内容
                this.save();
                this.beginPath();
                this.setStyle({ fillStyle: <string>backColor || DEFAULT_CELL_BACKGROUND });
                this.rect(left, top, width, height);
                this.fill();


                // 绘制单元格边框样式 上右下左-先绘制单个单元格
                // 绘制合并单元格的样式
                
                // 上边框
                for (let index = 0; index < columnSpan; index++) {
                    let offsetWidth = section.getWidth(cellIndex + index);

                    let currentDisplay = row.cells[cellIndex + index].display;
                    let currentBorder = currentDisplay.border;
                    
                    this.drawBorder(<string>currentBorder.topColor,
                        <number>currentBorder.topStyle,
                        left,
                        top,
                        left + offsetWidth,
                        top);
                    left += offsetWidth;
                }

                // 右边框
                for (let index = 0; index < rowSpan; index++) {
                    let offsetHeight = section.getHeight(rowIndex + index);

                    let currentRow = section.rows[rowIndex + index];
                    let currentDisplay = currentRow.cells[cellIndex + columnSpan - 1].display;
                    let currentBorder = currentDisplay.border;
                    
                    this.drawBorder(<string>currentBorder.rightColor,
                        <number>currentBorder.rightStyle,
                        left,
                        top,
                        left,
                        top + offsetHeight);
                    top += offsetHeight;
                }

                // 下边框
                for (let index = columnSpan; index > 0; index--) {
                    let offsetWidth = section.getWidth(cellIndex + index - 1);

                    let currentRow = section.rows[rowIndex + rowSpan - 1];
                    let currentDisplay = currentRow.cells[cellIndex + index - 1].display;
                    let currentBorder = currentDisplay.border;
                    this.drawBorder(<string>currentBorder.bottomColor,
                        <number>currentBorder.bottomStyle,
                        left,
                        top,
                        left - offsetWidth,
                        top);
                    left -= offsetWidth;
                }

                // 左边框
                for (let index = rowSpan; index > 0; index--) {
                    
                    let offsetHeight = section.getHeight(rowIndex + index - 1);

                    let currentRow = section.rows[rowIndex + index - 1];
                    let currentDisplay = currentRow.cells[cellIndex].display;
                    let currentBorder = currentDisplay.border;
                    
                    this.drawBorder(<string>currentBorder.leftColor,
                        <number>currentBorder.leftStyle,
                        left,
                        top,
                        left,
                        top - offsetHeight);
                    top -= offsetHeight;
                }
                

                // *绘制文本内容，先绘制居中的文本
                this.renderCellRichText(cell, left, top, width, height);

            }
            
        }
    }

    /**
     * 按照起始终止节点绘制单元格的边框
     * @param topColor 
     * @param topStyle 
     * @param startLeft 
     * @param startTop 
     * @param endLeft 
     * @param endtop 
     */
    drawBorder(topColor: string, topStyle: number, startLeft: number, startTop: number, endLeft: number, endtop: number): void {
        this.save();
        let topBorderColor = DEFAULT_BORDER_COLOR;
        let topBorderWidth = DEFAULT_BORDER_WIDTH;
        if (topColor) {
            topBorderColor = topColor;
        }
        if (topStyle == 3) {
            topBorderWidth = 2;
        }
        if (topStyle == 2) {
            this.setLineDash([2, 2]);
        }
        this.setStyle({ strokeStyle: topBorderColor, lineWidth: topBorderWidth });
        this.line(startLeft, startTop, endLeft, endtop);
    }

    /**
     * 绘制单元格文本内容
     * @param cell 
     * @param left 
     * @param top 
     * @param width 
     * @param height 
     */
    renderCellRichText(cell: ReportCellModel, left: number, top: number, width: number, height: number) {
        let richText = (cell.cellText || cell.caption) as string;
        if (!richText) {
            return;
        }

        const style: {[key: string]: string | boolean | number} = {};
        const display = cell.display;
        if (display.halign) {
            style.textAlign = display.halign.toLowerCase();
        }

        if (display.valign) {
            style.textBaseline = display.valign.toLowerCase();
        }

        const font = display.font;
        if (font.bold) {
            style.bold = <boolean>font.bold;
        }

        if (font.italic) {
            style.italic = <boolean>font.italic;
        }

        if (font.underLine) {
            style.underline = <string>font.underLine;
        }

        if (font.size) {
            style.fontSize = <number>font.size;
        }

        if (font.name) {
            style.fontName = <string>font.name;
        }

        if (display.foreColor) {
            style.color = <string>display.foreColor;
        }

        this.textStyle(style);

        // 下划线的位置
        let underLineX = left;
        let underLineY = top;
        let textWidth = this.measureTextWidth(richText);
        
        // 计算文本的位置
        let positionX = left;
        if (display.halign == 'Center') {
            positionX += width / 2;
            underLineX += width / 2 - textWidth / 2;
        } else if (display.halign == 'Right') {
            positionX += width;
            underLineX += width - textWidth;
        }

        let positionY = top;
        if (display.valign == 'Middle') {
            positionY += height / 2;
            underLineY += height / 2 + <number>font.size / 2;
        } else if (display.valign == 'Bottom') {
            positionY += height;
            underLineY += height;
        } else {
            underLineY += <number>font.size;
        }
        console.log("fill text center and middle, 暂时不对文本截断处理。");
        this.context.fillText(richText, positionX, positionY);

        // 添加下划线
        let lineWidth;
        if (font.underLine == 'SolidNormal') {
            lineWidth = 1;
        } else if (font.underLine == 'Dashed') {
            this.setLineDash([2, 2]);
            lineWidth = 1;
        } else if (font.underLine == 'SolidBold') {
            lineWidth = 2;
        }
        if (lineWidth) {
            this.setStyle({ strokeStyle: '#000', lineWidth: lineWidth });
            this.line(underLineX, underLineY, underLineX + textWidth, underLineY);
        }
    }

    public save(): ReportCanvasService {
        this.context.save();
        return this;
    }

    restore(): ReportCanvasService {
        this.context.restore();
        return this;
    }

    clear(): ReportCanvasService {
        const { width, height } = this.canvas;
        this.context.clearRect(0, 0, width, height);
        return this;
    }

    beginPath(): ReportCanvasService {
        this.context.beginPath();
        return this;
    }
}