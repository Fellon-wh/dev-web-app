/*
 * @Author: Fellon 
 * @Date: 2022-01-16 21:36:51 
 * @Last Modified by: Fellon
 * @Last Modified time: 2022-01-16 22:51:59
 */
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { DEFAULT_BOUND_COLOR, DEFAULT_BOUND_SIZE, DEFAULT_DIVIDER_STYLE, DEFAULT_PADDING, DEFAULT_RULER_HEIGHT } from "../Constants";
import { ResizerColumnComponent } from "../ResizerColumn/ResizerColumn.component";
import { ResizerRowComponent } from "../ResizerRow/ResizerRow.component";
import { DataService } from "../Service/Data.service";
import { MouseEventService } from "../Service/MouseEvent.service";
import { RenderProxyService } from "../Service/RenderProxy.service";
import { ReportCanvasService } from "../Service/ReportCanvas.service";
import { RulerService } from "../Service/Ruler.service";
import { SelectorsService } from "../Service/Selectors.service";

@Component({
    selector: 'report-designer',
    templateUrl: './ReportDesigner.component.html',
})
export class ReportDesignerComponent implements OnInit, AfterViewInit {

    @ViewChild("reportDesigner", { read: ElementRef })
    private reportDesignerRef!: ElementRef<HTMLElement>;

    // 水平标尺
    @ViewChild("hRuler", { read: ElementRef })
    private hRulerRef!: ElementRef<HTMLCanvasElement>;
    // 垂直标尺
    @ViewChild("vRuler", { read: ElementRef })
    private vRulerRef!: ElementRef<HTMLCanvasElement>;
    
    @ViewChild("mainDesigner", { read: ElementRef })
    private mainDesignerRef!: ElementRef<HTMLElement>;


    @ViewChild("reportCanvas")
    public canvasRef!: ElementRef<HTMLCanvasElement>;

    @ViewChild("masker", { read: ElementRef })
    public maskerRef!: ElementRef<HTMLElement>
    
    @ViewChild(ResizerRowComponent, { read: ElementRef })
    rowResizerRef!: ElementRef<HTMLElement>;

    @ViewChild(ResizerColumnComponent, { read: ElementRef })
    columnResizerRef!: ElementRef<HTMLElement>;

    // 观察者刷新界面，刷新整个界面/刷新画布界面
    

    constructor(
        private rulerService: RulerService,
        private canvasService: ReportCanvasService,
        private dataService: DataService,
        private mouseEventService: MouseEventService,
        private selectorsService: SelectorsService,
        private renderProxyService: RenderProxyService,
    ) {}
    
    ngOnInit(): void {
        
    }

    ngAfterViewInit(): void {
        // 设置网格界面
        const reportDesigner = this.reportDesignerRef.nativeElement;
        reportDesigner.style.gridTemplateColumns = `${DEFAULT_RULER_HEIGHT}px auto`;
        reportDesigner.style.gridTemplateRows = `${DEFAULT_RULER_HEIGHT}px auto`;

        // 设置标尺
        const hRuler = this.hRulerRef.nativeElement;
        hRuler.style.marginLeft = `${DEFAULT_PADDING}px`;

        const vRuler = this.vRulerRef.nativeElement;
        vRuler.style.marginTop = `${DEFAULT_PADDING}px`;

        this.rulerService.init(this.hRulerRef.nativeElement, this.vRulerRef.nativeElement);
        // 开始绘制主界面前，需绘制标尺
        this.rulerService.drawHRuler();
        this.rulerService.drawVRuler();

        // 设置主要设计界面
        const mainDesigner = this.mainDesignerRef.nativeElement;
        mainDesigner.style.margin = `${DEFAULT_PADDING}px`;

        this.canvasService.init(this.canvasRef.nativeElement, this.maskerRef.nativeElement);

        this.mouseEventService.initMouseEvent(this.maskerRef.nativeElement, this.rowResizerRef.nativeElement, this.columnResizerRef.nativeElement);

        this.renderProxyService.shouldRender$.subscribe(({ type }) => {
            this.canvasService.clear();
            this.renderGrid();
        });
    }

    
    private renderGrid() {
        let startLeft: number = this.dataService.leftMargin;
        let startTop: number = this.dataService.topMargin;

        // 1.绘制页面边界
        this.canvasService.setStyle({ fillStyle: DEFAULT_BOUND_COLOR });
        // 左上
        this.canvasService.line(startLeft, startTop, startLeft - DEFAULT_BOUND_SIZE, startTop);
        this.canvasService.line(startLeft, startTop, startLeft, startTop - DEFAULT_BOUND_SIZE);
        // 右上
        this.canvasService.line(this.dataService.width - startLeft, startTop, this.dataService.width - startLeft + DEFAULT_BOUND_SIZE, startTop);
        this.canvasService.line(this.dataService.width - startLeft, startTop, this.dataService.width - startLeft, startTop - DEFAULT_BOUND_SIZE);
        // 左下
        this.canvasService.line(startLeft, this.dataService.height - startTop, startLeft - DEFAULT_BOUND_SIZE, this.dataService.height - startTop);
        this.canvasService.line(startLeft, this.dataService.height - startTop, startLeft, this.dataService.height - startTop + DEFAULT_BOUND_SIZE);
        // 右下
        this.canvasService.line(this.dataService.width - startLeft, this.dataService.height - startTop, this.dataService.width - startLeft + DEFAULT_BOUND_SIZE, this.dataService.height - startTop);
        this.canvasService.line(this.dataService.width - startLeft, this.dataService.height - startTop, this.dataService.width - startLeft, this.dataService.height - startTop + DEFAULT_BOUND_SIZE);
        
        // 2.绘制单元格-遍历section
        this.canvasService.save();
        for (let index = 0; index < this.dataService.sections.length; index++) {
            let top = startTop + this.dataService.reportModel.getTop(index);
            this.canvasService.drawSection(index, startLeft, top);
        }

        // 3.绘制段分割线
        for (let index = 1; index < this.dataService.sections.length; index++) {
            let height = this.dataService.getTop(index);
            this.canvasService.setLineDash([4, 10]);
            this.canvasService.setStyle(DEFAULT_DIVIDER_STYLE);
            this.canvasService.line(0, startTop + height, this.dataService.width, startTop + height);
        }
        
    }
    
}