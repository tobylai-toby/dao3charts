import type { Color } from "../canvas";
import { type BaseChartOptions,BaseChart } from "./base";

export interface BarChartOptions extends BaseChartOptions {
    barWidth?: number;
}
export interface BarChartDrawItem {
    value: number;
    color: Color;
}

export class BarChart extends BaseChart {
    constructor(public options: BarChartOptions) {
        super(options);
    }

    draw({items}: {items: BarChartDrawItem[]}): void {
        this.clear();
        let barWidth=this.options.barWidth
        if(!barWidth){
            // calculate
            barWidth = Math.floor(this.options.size.width / (items.length*1.5));
        }
        const spacing = Math.floor((this.options.size.width - (barWidth * items.length)) / (items.length + 1));
        const startX = this.options.pos.x + spacing;
        const startY = this.options.pos.y;
        const maxHeight = Math.max(...items.map(item => item.value))*1.2;
        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            const x = startX + spacing * (i + 1) + barWidth * i;
            const y = startY + this.options.size.height - (item.value / maxHeight) * this.options.size.height;
            this.options.canvas.drawFilledRect({ start: { x, y }, end: { x: x + barWidth, y: startY + this.options.size.height }, color: item.color });
        }
        // draw coordinates
        this.options.canvas.drawLine({ start: { x: startX, y: startY }, end: { x: startX, y: startY + this.options.size.height }, color: { rgb: Vec3.create({r:0,g:0,b:0}) } });
        this.options.canvas.drawLine({ start: { x: startX, y: startY + this.options.size.height }, end: { x: startX + this.options.size.width, y: startY + this.options.size.height }, color: { rgb: Vec3.create({r:0,g:0,b:0}) } });
    }
}