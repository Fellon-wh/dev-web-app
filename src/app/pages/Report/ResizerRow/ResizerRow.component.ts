import { Component, ElementRef, OnInit } from "@angular/core";
import { MouseEventService } from "../Service/MouseEvent.service";
import { ResizerService } from "../Service/Resizer.service";

@Component({
    selector: 'resizer-row',
    templateUrl: './ResizerRow.component.html',
    host: {
        class: 'resizer resizer-row',
    },
})
export class ResizerRowComponent implements OnInit {

    constructor(
        private resizerRowRef: ElementRef<HTMLElement>,
        public resizerService: ResizerService,
        public mouseEventService: MouseEventService,
    ) {}

    ngOnInit(): void {
        this.resizerService.rowResizer$.subscribe((top) => {
            if (top !== undefined) {
                this.resizerRowRef.nativeElement.style.display = 'block';
                this.resizerRowRef.nativeElement.style.top = `${top - 5}px`;
            } else {
                this.resizerRowRef.nativeElement.style.display = 'none';
            }
        });
    }
}