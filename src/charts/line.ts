import type { Color } from "../canvas";
import { BaseChart, type BaseChartOptions } from "./base";

/**
 * 折线图配置选项
 */
export interface LineChartOptions extends BaseChartOptions {
    /** 线条颜色（可选） */
    lineColor?: Color;
}
/**
 * 折线图单项数据
 */
export interface LineChartDrawItem {
    /** 数值 */
    value: number;
    /** 点的颜色 */
    dotColor: Color;
    /** 点的大小（可选） */
    dotSize?: number;
}

/**
 * 折线图类
 */
export class LineChart extends BaseChart {
    /**
     * 构造函数
     * @param options 折线图配置选项
     */
    constructor(public options: LineChartOptions) {
        super(options);
    }

    /**
     * 绘制折线图
     * @param param0 items为折线图数据项数组
     */
    draw({ items }: { items: LineChartDrawItem[] }): void {
        this.clear();
        const spacing = Math.floor(
            this.options.size.width / (items.length + 1),
        );
        const startX = this.options.pos.x;
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
        // 绘制坐标轴
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
