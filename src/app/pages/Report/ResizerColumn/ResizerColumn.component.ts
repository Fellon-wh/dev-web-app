import { Component, ElementRef, OnInit } from "@angular/core";
import { MouseEventService } from "../Service/MouseEvent.service";
import { ResizerService } from "../Service/Resizer.service";

@Component({
    selector: 'resizer-column',
    templateUrl: './ResizerColumn.component.html',
    host: {
        class: 'resizer resizer-column',
    },
})
export class ResizerColumnComponent implements OnInit {

    constructor(
        private resizerColumnRef: ElementRef<HTMLElement>,
        public resizerService: ResizerService,
        public mouseEventService: MouseEventService,
    ) {}

    ngOnInit(): void {
        this.resizerService.columnResizer$.subscribe((left) => {
            if (left !== undefined) {
                this.resizerColumnRef.nativeElement.style.display = 'block';
                this.resizerColumnRef.nativeElement.style.left = `${left - 5}px`;
            } else {
                this.resizerColumnRef.nativeElement.style.display = 'none';
            }
        });
    }
}