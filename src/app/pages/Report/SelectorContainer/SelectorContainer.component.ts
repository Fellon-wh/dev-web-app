/*
 * @Author: Fellon 
 * @Date: 2022-01-16 21:48:53 
 * @Last Modified by:   Fellon 
 * @Last Modified time: 2022-01-16 21:48:53 
 */
import { Component, ElementRef, OnInit } from "@angular/core";
import { combineLatest } from "rxjs";
import { LocatedRect } from "../Factory/LocatedRect.factory";
import { ResizerService } from "../Service/Resizer.service";
import { SelectorsService } from "../Service/Selectors.service";

@Component({
    selector: 'selector-container',
    templateUrl: './SelectorContainer.component.html',
    host: {
        class: 'selector-container',
    }
})
export class SelectorContainerComponent implements OnInit {

    rects: LocatedRect[] = [];

    constructor(
        private selectorService: SelectorsService,
        private resizerService: ResizerService,
        private containerRef: ElementRef<HTMLElement>,
    ) {
        this.containerRef.nativeElement.style.left = '0px';
        this.containerRef.nativeElement.style.top = '0px';
    }

    ngOnInit(): void {
        combineLatest([
            this.selectorService.selectorChanged,
            this.resizerService.rowResizer$,
            this.resizerService.columnResizer$
        ]).subscribe(([selectors]) => {
            this.rects = selectors.map((selector) => this.selectorService.locateRect(selector.selectArea));
        });
    }
}