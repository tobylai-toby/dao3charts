import type { Color } from "../canvas";
import { BaseChart, type BaseChartOptions } from "./base";

export interface PieChartOptions extends BaseChartOptions {
    
}
export interface PieChartDrawItem {
    value: number;
    color: Color;
}

export class PieChart extends BaseChart {
    constructor(public options: PieChartOptions) {
        super(options);
    }

    draw({ items }: { items: PieChartDrawItem[] }): void {
        this.clear();
        let total=0;
        let startAngle = 0;
        for (const item of items) {
            total += item.value;
        }
        for (const item of items) {
            const sliceAngle = (item.value / total) * 360;
            this.options.canvas.drawFilledCircle({
                center: { x: this.options.pos.x + this.options.size.width / 2, y: this.options.pos.y + this.options.size.height / 2 },
                radius: Math.min(this.options.size.width, this.options.size.height) / 2,
                startAngle,
                endAngle: startAngle + sliceAngle,
                color: item.color,
            });
            startAngle += sliceAngle;
        }
    }
}
