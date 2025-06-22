import { Canvas } from "../canvas";

/**
 * 基础图表配置选项
 */
export interface BaseChartOptions {
    /** 画布对象 */
    canvas: Canvas;
    /** 图表左上角位置 */
    pos: { x: number; y: number };
    /** 图表尺寸 */
    size: { width: number; height: number };
}

/**
 * 基础图表类，所有图表的父类
 */
export class BaseChart{
    /**
     * 构造函数
     * @param options 图表配置选项
     */
    constructor(public options: BaseChartOptions){}
    /**
     * 清空当前图表区域的像素
     */
    clear(): void{
        for(let x = this.options.pos.x; x < this.options.pos.x + this.options.size.width; x++){
            for(let y = this.options.pos.y; y < this.options.pos.y + this.options.size.height; y++){
                this.options.canvas.setPixel({ pos: { x, y }, color: {} });
            }
        }
    }
    /**
     * 绘制图表（需子类实现）
     * @param data 绘制所需的数据
     */
    draw(data:any): void{
        // Implement drawing logic here
    }
}