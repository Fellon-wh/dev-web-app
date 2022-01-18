/*
 * @Author: Fellon 
 * @Date: 2022-01-16 21:47:11 
 * @Last Modified by: Fellon
 * @Last Modified time: 2022-01-16 22:59:15
 */
import { AfterViewInit, Component, ElementRef } from "@angular/core";
import { delay } from "rxjs/operators";
import { DEFAULT_PADDING, DEFAULT_RULER_HEIGHT } from "../Constants";
import { LocatedRect } from "../Factory/LocatedRect.factory";
import { DataService } from "../Service/Data.service";
import { RenderProxyService } from "../Service/RenderProxy.service";
import { RichTextService } from "../Service/RichText.service";
import { SelectorsService } from "../Service/Selectors.service";

@Component({
    selector: 'rich-text',
    templateUrl: './RichText.component.html',
    host: {
        class: 'rich-text',
    },
})
export class RichTextComponent implements AfterViewInit {

    private richText!: HTMLElement;
    rect!: LocatedRect;

    constructor(
        private richTextRef: ElementRef<HTMLElement>,
        private selectorsService: SelectorsService,
        private richTextService: RichTextService,
        private renderProxyService: RenderProxyService,
        private dataService: DataService,
    ) {}

    ngAfterViewInit(): void {
        // this.richTextRef.nativeElement.style.left = `${DEFAULT_RULER_HEIGHT + DEFAULT_PADDING}px`;
        // this.richTextRef.nativeElement.style.top = `${DEFAULT_RULER_HEIGHT + DEFAULT_PADDING}px`;

        this.richText = this.richTextRef.nativeElement.children[0] as HTMLElement;
        this.richText.hidden = true;

        this.richTextService.focus$.pipe(delay(50)).subscribe((state) => {
            if (state) {
                const selectArea = this.selectorsService.last.selectArea;
                this.rect = this.selectorsService.locateRect(selectArea);

                Object.assign(this.richText.style, {
                    left: `${this.rect.left}px`,
                    top: `${this.rect.top}px`,
                    width: `${this.rect.width}px`,
                    height: `${this.rect.height}px`,
                });

                const cell = this.dataService.getCell(selectArea.sectionIndex, selectArea.startRowIndex, selectArea.startColumnIndex);
                // 设置文本和光标位置
                if (cell) {
                    let text = cell.cellText || cell.caption || '';
                    this.richText.innerText = <string>text;
                    (this.richText as HTMLInputElement).setSelectionRange(0, text.length);
                }

                this.richText.hidden = false;
                this.richText.focus();
            } else {
                this.richText.blur();
                if (!this.richText.hidden) {

                    let previousText = this.richText.textContent;
                    let currentText = (this.richText as HTMLInputElement).value;
                    if (previousText !== currentText) {

                        const selectArea = this.rect.selectArea;
                        const cell = this.dataService.getCell(selectArea.sectionIndex, selectArea.startRowIndex, selectArea.startColumnIndex);
                        if (cell) {
                            cell.cellText = currentText;
                            this.dataService.rerender();
                        }
                    }
                }
                this.richText.hidden = true;
            }
        });
    }
}