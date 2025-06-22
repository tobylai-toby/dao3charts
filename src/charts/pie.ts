import type { Color } from "../canvas";
import { BaseChart, type BaseChartOptions } from "./base";

/**
 * 饼图配置选项
 */
export interface PieChartOptions extends BaseChartOptions {
    // 目前无额外配置
}
/**
 * 饼图单项数据
 */
export interface PieChartDrawItem {
    /** 数值 */
    value: number;
    /** 颜色 */
    color: Color;
}

/**
 * 饼图类
 */
export class PieChart extends BaseChart {
    /**
     * 构造函数
     * @param options 饼图配置选项
     */
    constructor(public options: PieChartOptions) {
        super(options);
    }

    /**
     * 绘制饼图
     * @param param0 items为饼图数据项数组
     */
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
