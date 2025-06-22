/** 设置像素点参数 */
export interface CanvasDrawPixelOptions {
    /** 像素位置 */
    pos: Pos;
    /** 像素颜色 */
    color: Color;
}
/** 绘制直线参数 */
export interface CanvasDrawLineOptions {
    /** 起始位置 */
    start: Pos;
    /** 结束位置 */
    end: Pos;
    /** 线条颜色 */
    color: Color;
}
/** 绘制矩形参数 */
export interface CanvasDrawRectOptions {
    /** 左上角位置 */
    start: Pos;
    /** 右下角位置 */
    end: Pos;
    /** 颜色 */
    color: Color;
}
/** 绘制圆形轮廓参数 */
export interface CanvasDrawOutlinedCircleOptions {
    /** 圆心位置 */
    center: Pos;
    /** 圆的半径 */
    radius: number;
    /** 轮廓颜色 */
    color: Color;
    /** 起始角度（默认0度） */
    startAngle?: number;
    /** 结束角度（默认360度） */
    endAngle?: number;
    /** 轮廓厚度（默认1像素） */
    thickness?: number;
}
/** 绘制填充圆形参数 */
export interface CanvasDrawFilledCircleOptions {
    /** 圆心位置 */
    center: Pos;
    /** 圆的半径 */
    radius: number;
    /** 填充颜色 */
    color: Color;
    /** 起始角度（默认0度） */
    startAngle?: number;
    /** 结束角度（默认360度） */
    endAngle?: number;
}

/** Canvas 画布的配置选项 */
export interface CanvasOptions {
    /** 要渲染到的UI节点 */
    node: UiRenderable;
    /** 像素大小，默认为1 */
    pixelSize?: number;
    /** 自动调整大小的选项 */
    autoResizeOptions?: {
        /** 是否启用自动调整大小 */
        enabled: boolean;
        /** 最大宽度 */
        maxWidth: number;
        /** 最大高度 */
        maxHeight: number;
    };
}
/** 颜色定义接口 */
export interface Color {
    /** RGB颜色向量 */
    rgb?: Vec3;
    /** 透明度，0-1之间 */
    a?: number;
}
/** 位置类型，可以是简单的x,y对象或Vec2向量 */
export type Pos = { x: number; y: number } | Vec2;
/** 像素画布类，用于绘制各种基本图形 */
export class Canvas {
    /** 存储像素颜色信息的映射表 */
    private pixelMap: Map<string, Color> = new Map();
    /** 存储像素节点的映射表 */
    private nodeMap: Map<string, UiBox> = new Map();
    /**
     * 创建一个新的Canvas实例
     * @param options 画布配置选项
     */
    constructor(public options: CanvasOptions) {
        options.pixelSize = options.pixelSize || 1;
    }
    /**
     * 在画布上绘制单个像素
     * @param x 像素的X坐标
     * @param y 像素的Y坐标
     */
    private _drawPixel(x: number, y: number): void {
        const color = this.pixelMap.get(`${x},${y}`);
        if (color && color.rgb) {
            const node = this.nodeMap.get(`${x},${y}`);
            if (node) {
                node.parent = undefined;
            }
            const pixelNode = UiBox.create();

            pixelNode.backgroundColor.copy(color.rgb);
            pixelNode.backgroundOpacity = color.a || 1;
            pixelNode.parent = this.options.node;
            if (this.options.autoResizeOptions?.enabled) {
                const px = 1 / (this.options.autoResizeOptions?.maxWidth || 1),
                    py = 1 / (this.options.autoResizeOptions?.maxHeight || 1);
                pixelNode.position.offset.x = pixelNode.position.offset.y = pixelNode.size.offset.x = pixelNode.size.offset.y = 0;
                pixelNode.position.scale.x = x * px;
                pixelNode.position.scale.y = y * py;
                pixelNode.size.scale.x = px;
                pixelNode.size.scale.y = py;
            } else {
                pixelNode.position.offset.x = x * this.options.pixelSize!;
                pixelNode.position.offset.y = y * this.options.pixelSize!;
                pixelNode.size.offset.x = this.options.pixelSize!;
                pixelNode.size.offset.y = this.options.pixelSize!;
            }
            this.nodeMap.set(`${x},${y}`, pixelNode);
        } else {
            const node = this.nodeMap.get(`${x},${y}`);
            if (node) {
                node.parent = undefined;
            }
            this.nodeMap.delete(`${x},${y}`);
        }
    }

    /** 根据配置的自动调整选项重新调整所有像素的大小和位置 */
    autoResize(): void {
        if (this.options.autoResizeOptions?.enabled) {
            // re assign all pos&size of pixelNode
            this.pixelMap.forEach((color:Color,pixel:string)=>{
                const pixelNode=this.nodeMap.get(pixel)!;
                const [x,y]=pixel.split(",").map(Number);
                const px = 1 / (this.options.autoResizeOptions?.maxWidth || 1),
                    py = 1 / (this.options.autoResizeOptions?.maxHeight || 1);
                pixelNode.position.offset.x = pixelNode.position.offset.y = pixelNode.size.offset.x = pixelNode.size.offset.y = 0;
                pixelNode.position.scale.x = x * px;
                pixelNode.position.scale.y = y * py;
                pixelNode.size.scale.x = px;
                pixelNode.size.scale.y = py;
            });
        }
    }    
    /**
     * 设置指定位置的像素颜色
     * @param options 设置像素点参数
     */
    setPixel(options: CanvasDrawPixelOptions): void {
        const { pos: { x, y }, color: { rgb, a } } = options;
        if (rgb) {
            this.pixelMap.set(`${x},${y}`, { rgb, a: a || 1 });
            this._drawPixel(x, y);
        } else {
            this.pixelMap.delete(`${x},${y}`);
            this._drawPixel(x, y);
        }
    }
    /**
     * 在画布上绘制一条直线
     * @param options 绘制直线参数
     */
    drawLine(options: CanvasDrawLineOptions): void {
        const { start, end, color } = options;
        let x0 = Math.round(start.x);
        let y0 = Math.round(start.y);
        let x1 = Math.round(end.x);
        let y1 = Math.round(end.y);
        const dx = Math.abs(x1 - x0);
        const dy = Math.abs(y1 - y0);
        const sx = x0 < x1 ? 1 : -1;
        const sy = y0 < y1 ? 1 : -1;
        let err = dx - dy;
        while (true) {
            this.setPixel({ pos: { x: x0, y: y0 }, color });
            if (x0 === x1 && y0 === y1) break;
            const e2 = 2 * err;
            if (e2 > -dy) {
                err -= dy;
                x0 += sx;
            }
            if (e2 < dx) {
                err += dx;
                y0 += sy;
            }
        }
    }
    /**
     * 绘制矩形轮廓
     * @param options 绘制矩形参数
     */
    drawOutlinedRect(options: CanvasDrawRectOptions): void {
        const { start, end, color } = options;
        for (let x = start.x; x <= end.x; x++) {
            this.setPixel({ pos: { x, y: start.y }, color });
            this.setPixel({ pos: { x, y: end.y }, color });
        }
        for (let y = start.y; y <= end.y; y++) {
            this.setPixel({ pos: { x: start.x, y }, color });
            this.setPixel({ pos: { x: end.x, y }, color });
        }
    }
    /**
     * 绘制填充矩形
     * @param options 绘制矩形参数
     */
    drawFilledRect(options: CanvasDrawRectOptions): void {
        const { start, end, color } = options;
        for (let x = start.x; x <= end.x; x++) {
            for (let y = start.y; y <= end.y; y++) {
                this.setPixel({ pos: { x, y }, color });
            }
        }
    }
    /**
     * 绘制圆形轮廓
     * @param options 绘制圆形轮廓参数
     */
    drawOutlinedCircle(options: CanvasDrawOutlinedCircleOptions): void {
        let { center, radius, color, startAngle = 0, endAngle = 360, thickness = 1 } = options;
        // 规范化角度
        startAngle = ((startAngle % 360) + 360) % 360;
        endAngle = ((endAngle % 360) + 360) % 360;
        if (endAngle < startAngle) endAngle += 360;

        const startRad = startAngle * Math.PI / 180;
        const endRad = endAngle * Math.PI / 180;

        const isAngleInRange = (angle: number): boolean => {
            const normalizedAngle = (angle + 2 * Math.PI) % (2 * Math.PI);
            return (normalizedAngle >= startRad && normalizedAngle <= endRad) ||
                (endAngle > 360 && normalizedAngle <= endRad - 2 * Math.PI);
        };

        let x = radius;
        let y = 0;
        let err = 0;

        while (x >= y) {
            const points = [
                { x: center.x + x, y: center.y + y }, // 第一象限
                { x: center.x - x, y: center.y + y }, // 第二象限
                { x: center.x - x, y: center.y - y }, // 第三象限
                { x: center.x + x, y: center.y - y }, // 第四象限
                { x: center.x + y, y: center.y + x }, // 45°对称
                { x: center.x - y, y: center.y + x },
                { x: center.x - y, y: center.y - x },
                { x: center.x + y, y: center.y - x },
            ];

            for (const point of points) {
                const angle = Math.atan2(
                    point.y - center.y,
                    point.x - center.x,
                );
                if (isAngleInRange(angle)) {
                    if (thickness === 1) {
                        this.setPixel({ pos: point, color });
                    } else {
                        for (let r = 0; r < thickness; r++) {
                            const ratio = (radius + r) / radius;
                            const thickPoint = {
                                x: Math.round(
                                    center.x + (point.x - center.x) * ratio,
                                ),
                                y: Math.round(
                                    center.y + (point.y - center.y) * ratio,
                                ),
                            };
                            this.setPixel({ pos: thickPoint, color });
                        }
                    }
                }
            }

            y += 1;
            err += 1 + 2 * y;
            if (2 * (err - x) + 1 > 0) {
                x -= 1;
                err += 1 - 2 * x;
            }
        }
    }    
    
    /**
     * 绘制填充圆形
     * @param options 绘制填充圆形参数
     */
    drawFilledCircle(options: CanvasDrawFilledCircleOptions): void {
        const { center, radius, color, startAngle = 0, endAngle = 360 } = options;
        // 转换为弧度
        const startRad = startAngle * Math.PI / 180;
        const endRad = endAngle * Math.PI / 180;

        for (let r = 0; r <= radius; r++) {
            for (
                let angleRad = startRad;
                angleRad <= endRad;
                angleRad += 0.01
            ) { // 角度步长0.01弧度≈0.57°
                const x = Math.round(center.x + r * Math.cos(angleRad));
                const y = Math.round(center.y + r * Math.sin(angleRad));
                this.setPixel({ pos: { x, y }, color });
            }
            // 处理跨360°的情况（如绘制330°→30°）
            if (endAngle > 360) {
                for (
                    let angleRad = 0;
                    angleRad <= endRad - 2 * Math.PI;
                    angleRad += 0.01
                ) {
                    const x = Math.round(center.x + r * Math.cos(angleRad));
                    const y = Math.round(center.y + r * Math.sin(angleRad));
                    this.setPixel({ pos: { x, y }, color });
                }
            }
        }
    }
}
