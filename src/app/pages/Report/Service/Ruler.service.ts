import { Injectable } from "@angular/core";
import { DEFAULT_DPI, DEFAULT_INCH_MM, DEFAULT_RULER_HEIGHT } from "../Constants";
import { DataService } from "./Data.service";

@Injectable()
export class RulerService {
    
    // 水平标尺
    private hRuler!: HTMLCanvasElement;

    // 垂直标尺
    private vRuler!: HTMLCanvasElement;

    // 1毫米有多少像素
    get MMPI(): number {
        return DEFAULT_DPI / DEFAULT_INCH_MM;
    }

    constructor(private dataService: DataService) {}

    init(hRuler: HTMLCanvasElement, vRuler: HTMLCanvasElement) {
        this.hRuler = hRuler;
        this.vRuler = vRuler;

        this.hRuler.height = DEFAULT_RULER_HEIGHT;
        this.hRuler.width = this.dataService.width;

        this.vRuler.height = this.dataService.height;
        this.vRuler.width = DEFAULT_RULER_HEIGHT;
    }

    /**
     * 绘制水平标尺
     */
    drawHRuler(): void {
        // 分为三块，中间页面区，左右溢出区
        const context = this.hRuler.getContext('2d')!;
        context.textAlign = 'center';

        for (let index = 0; ; index++) {

            // 超出区域终止
            let left = index * 5 * this.MMPI;
            if (left > this.dataService.width) {
                break;
            }
            
            // 长影线
            if (index % 2 == 0) {
                this.line(context, left, DEFAULT_RULER_HEIGHT, left, DEFAULT_RULER_HEIGHT - 10);
                context.fillText(index / 2 + '', left, DEFAULT_RULER_HEIGHT - 10);

            } else {
                // 短影线
                this.line(context, left, DEFAULT_RULER_HEIGHT, left, DEFAULT_RULER_HEIGHT - 5);
            }
        }

    }

    /**
     * 绘制垂直标尺
     */
    drawVRuler(): void {
        const context = this.vRuler.getContext('2d')!;
        context.textAlign = 'right';
        context.textBaseline = 'middle';

        for (let index = 0; ; index++) {

            // 超出区域终止
            let top = index * 5 * this.MMPI;
            if (top > this.dataService.height) {
                break;
            }
            
            // 长影线
            if (index % 2 == 0) {
                this.line(context, DEFAULT_RULER_HEIGHT, top, DEFAULT_RULER_HEIGHT - 10, top);
                context.fillText(index / 2 + '', DEFAULT_RULER_HEIGHT - 10, top);

            } else {
                // 短影线
                this.line(context, DEFAULT_RULER_HEIGHT, top, DEFAULT_RULER_HEIGHT - 5, top);
            }
        }
    }

    line(context: CanvasRenderingContext2D, ...points: number[]): RulerService {
        if (points.length == 4) {
            const [startLeft, startTop, endLeft, endTop] = points;
            context.beginPath();
            context.moveTo(startLeft, startTop);
            context.lineTo(endLeft, endTop);
            context.stroke();
            context.restore();
        }
        return this;
    }
}