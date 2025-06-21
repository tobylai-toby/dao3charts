import { Canvas } from "../canvas";

export interface BaseChartOptions {
    canvas: Canvas;
    pos: { x: number; y: number };
    size: { width: number; height: number };
}

export class BaseChart{
    constructor(public options: BaseChartOptions){}
    clear(): void{
        for(let x = this.options.pos.x; x < this.options.pos.x + this.options.size.width; x++){
            for(let y = this.options.pos.y; y < this.options.pos.y + this.options.size.height; y++){
                this.options.canvas.setPixel({ pos: { x, y }, color: {} });
            }
        }
    }
    draw(data:any): void{
        // Implement drawing logic here
    }
}