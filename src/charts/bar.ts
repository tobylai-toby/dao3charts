import type { Color } from "../canvas";
import { type BaseChartOptions,BaseChart } from "./base";

/**
 * 柱状图配置选项
 */
export interface BarChartOptions extends BaseChartOptions {
    /** 柱子的宽度（可选） */
    barWidth?: number;
}
/**
 * 柱状图单项数据
 */
export interface BarChartDrawItem {
    /** 数值 */
    value: number;
    /** 颜色 */
    color: Color;
}

/**
 * 柱状图类
 */
export class BarChart extends BaseChart {
    /**
     * 构造函数
     * @param options 柱状图配置选项
     */
    constructor(public options: BarChartOptions) {
        super(options);
    }

    /**
     * 绘制柱状图
     * @param param0 items为柱状图数据项数组
     */
    draw({items}: {items: BarChartDrawItem[]}): void {
        this.clear();
        let barWidth=this.options.barWidth
        if(!barWidth){
            // 自动计算宽度
            barWidth = Math.floor(this.options.size.width / (items.length*1.5));
        }
        const spacing = Math.floor((this.options.size.width - (barWidth * items.length)) / (items.length + 1));
        const startX = this.options.pos.x;
        const startY = this.options.pos.y;
        const maxHeight = Math.max(...items.map(item => item.value))*1.2;
        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            const x = startX + spacing * (i + 1) + barWidth * i;
            const y = startY + this.options.size.height - (item.value / maxHeight) * this.options.size.height;
            this.options.canvas.drawFilledRect({ start: { x, y }, end: { x: x + barWidth, y: startY + this.options.size.height }, color: item.color });
        }
        // 绘制坐标轴
        this.options.canvas.drawLine({ start: { x: startX, y: startY }, end: { x: startX, y: startY + this.options.size.height }, color: { rgb: Vec3.create({r:0,g:0,b:0}) } });
        this.options.canvas.drawLine({ start: { x: startX, y: startY + this.options.size.height }, end: { x: startX + this.options.size.width, y: startY + this.options.size.height }, color: { rgb: Vec3.create({r:0,g:0,b:0}) } });
    }
}