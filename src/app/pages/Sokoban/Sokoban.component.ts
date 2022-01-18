import { AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild } from "@angular/core";
import { SOKOBAN_DATA } from "src/app/constants";

@Component({
    selector: 'app-sokoban',
    templateUrl: './Sokoban.component.html',
    styleUrls: ['./Sokoban.component.css']
})
export class SokobanComponent implements OnInit, AfterViewInit {
    // 游戏数据
    data!: { map: number[][];}[];

    // 类型
    category: string[] = ["wall", "wolf", "sheep", "prison"];
    // 地图数据
    mapData: { [key: string]: number[] } = {
        wall: <number[]>[],
        wolf: <number[]>[],
        sheep: <number[]>[],
        prison: <number[]>[]
    };

    width!: number;
    height!: number;
    // 朝向
    direction: string = "below";
    

    images: { [key: string]: HTMLImageElement } = {
        wall: new Image(),
        wolf_above: new Image(),
        wolf_below: new Image(),
        wolf_left: new Image(),
        wolf_right: new Image(),
        sheep: new Image(),
        prison: new Image()
    };

    wallImage = new Image();
    wolfImage = new Image();
    sheepImage = new Image();
    prisonImage = new Image();

    @ViewChild("sokobanCanvas")
    public canvasRef!: ElementRef<HTMLCanvasElement>;

    // 这才是画布
    sokobanCanvas!: HTMLCanvasElement;

    context!: CanvasRenderingContext2D;

    ngOnInit(): void {
        this.data = SOKOBAN_DATA;
        this.initMap();

        this.images.wall.src = "assets/images/sokoban/tree.png";
        this.images.wolf_above.src = "assets/images/sokoban/wolf-above.png";
        this.images.wolf_below.src = "assets/images/sokoban/wolf-below.png";
        this.images.wolf_left.src = "assets/images/sokoban/wolf-left.png";
        this.images.wolf_right.src = "assets/images/sokoban/wolf-right.png";
        
        this.images.sheep.src = "assets/images/sokoban/sheep.png";
        this.images.prison.src = "assets/images/sokoban/prison.png";
    }
    
    ngAfterViewInit(): void {
        this.sokobanCanvas = this.canvasRef.nativeElement;
        this.context = this.sokobanCanvas.getContext("2d")!;

        this.width = this.sokobanCanvas.width / 16;
        this.height = this.sokobanCanvas.height / 12;

        let self = this;
        this.images.prison.onload = function() {
            self.draw();
        }
    }

    @HostListener('document:keydown', ['$event'])
    onKeydownHandle(event: KeyboardEvent) {
        let step = [-1, -16, 1, 16][event.keyCode - 37];
        if (!step) {
            return;
        }
        
        let nextStep = this.mapData["wolf"][0] + step;
        // 1.撞上树了
        if (this.mapData.wall.includes(nextStep)) {
            return;
        }

        // 2.抓住羊了
        if (this.mapData["sheep"].includes(nextStep)) {
            
            // 羊身后有同伴，或者有树就推不动了
            let nextNextStep = nextStep + step;
            if (this.mapData["sheep"].includes(nextNextStep) || this.mapData["wall"].includes(nextNextStep)) {
                return;
            }
            
            this.mapData["sheep"][this.mapData["sheep"].indexOf(nextStep)] = nextNextStep;
        }

        this.mapData.wolf[0] = nextStep;
        this.direction = ["left", "above", "right", "below"][event.keyCode - 37];
        
        this.context.clearRect(0, 0, this.sokobanCanvas.width, this.sokobanCanvas.height);
        this.draw();

        setTimeout(() => {
            if (this.mapData["prison"].every((prison) => this.mapData["sheep"].includes(prison))) {
                alert("抓羊成功！！！");
            }
        }, 100);
    }
    
    initMap() {
        let map = this.data[3].map,
            rowIndex = -1,
            columnIndex = -1;
        
        map.forEach(row => {
            rowIndex ++;
            columnIndex = -1;

            row.forEach(column => {
                columnIndex ++;
                if (column == 0) {
                    return;
                }

                let position = this.getPosition(column);
                this.mapData[this.category[position]].push(rowIndex * 16 + columnIndex);
            });
        });
    }

    getPosition(column: number) : number {
        let position = -1;
        for (let index = 0; ; index++) {
            if ( column == Math.pow(2, index)) {
                position = index;
                break;
            }
        }

        return position;
    }

    draw() {
        this.category.forEach(temp => {
            this.mapData[temp].forEach(child => {
                if (temp == "wolf") {
                    temp += "_" + this.direction;
                }
                
                this.drawImage(this.images[temp], child);
            });
        });
    }

    drawImage(image: HTMLImageElement, sequence: number): void {
        let columnIndex = sequence % 16,
            rowIndex = (sequence - columnIndex) / 16;

        this.context.drawImage(image, columnIndex * this.width, rowIndex * this.height, this.height, this.width);
    }
}