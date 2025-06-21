import type { Color } from "../canvas";
import { BaseChart, type BaseChartOptions } from "./base";

export interface LineChartOptions extends BaseChartOptions {
    lineColor?: Color;
}
export interface LineChartDrawItem {
    value: number;
    dotColor: Color;
    dotSize?: number;
}

export class LineChart extends BaseChart {
    constructor(public options: LineChartOptions) {
        super(options);
    }

    draw({ items }: { items: LineChartDrawItem[] }): void {
        this.clear();
        const spacing = Math.floor(
            this.options.size.width / (items.length + 1),
        );
        const startX = this.options.pos.x + spacing;
        const startY = this.options.pos.y;
        const maxHeight = Math.max(...items.map((item) => item.value))*1.2;
        const dots: { x: number; y: number; dotColor: Color; dotSize?: number }[] = [];
        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            const x = startX + spacing * (i + 1);
            const y = startY + this.options.size.height -
                (item.value / maxHeight) * this.options.size.height;
            dots.push({ x, y, dotColor: item.dotColor, dotSize: item.dotSize });
        }
        if (dots.length > 1) {
            for (let i = 1; i < dots.length; i++) {
                const prev = dots[i - 1];
                const curr = dots[i];
                this.options.canvas.drawLine({
                    start: { x: prev.x, y: prev.y },
                    end: { x: curr.x, y: curr.y },
                    color: this.options.lineColor || { rgb: Vec3.create({ r: 0, g: 0, b: 0 }) },
                });
            }
        }
        for (const dot of dots) {
            this.options.canvas.drawFilledCircle({
                center: { x: dot.x, y: dot.y },
                radius: dot.dotSize || 2,
                color: dot.dotColor,
            });
        }
        // draw coordinates
        this.options.canvas.drawLine({
            start: { x: startX, y: startY },
            end: { x: startX, y: startY + this.options.size.height },
            color: { rgb: Vec3.create({ r: 0, g: 0, b: 0 }) },
        });
        this.options.canvas.drawLine({
            start: { x: startX, y: startY + this.options.size.height },
            end: {
                x: startX + this.options.size.width,
                y: startY + this.options.size.height,
            },
            color: { rgb: Vec3.create({ r: 0, g: 0, b: 0 }) },
        });
    }
}
