export interface CanvasOptions {
    node: UiRenderable;
    pixelSize?: number;
    autoResizeOptions?: {
        enabled: boolean;
        maxWidth: number;
        maxHeight: number;
    };
}
export interface Color {
    rgb?: Vec3;
    a?: number;
}
export type Pos = { x: number; y: number } | Vec2;
export class Canvas {
    private pixelMap: Map<string, Color> = new Map();
    private nodeMap: Map<string, UiBox> = new Map();
    constructor(public options: CanvasOptions) {
        options.pixelSize = options.pixelSize || 1;
    }
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

    setPixel(
        { pos: { x, y }, color: { rgb, a } }: { pos: Pos; color: Color },
    ): void {
        if (rgb) {
            this.pixelMap.set(`${x},${y}`, { rgb, a: a || 1 });
            this._drawPixel(x, y);
        } else {
            this.pixelMap.delete(`${x},${y}`);
            this._drawPixel(x, y);
        }
    }

    drawLine(
        { start, end, color }: { start: Pos; end: Pos; color: Color },
    ): void {
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

            // 检查是否到达终点
            if (x0 === x1 && y0 === y1) break;

            const e2 = 2 * err;

            // 调整误差和x坐标
            if (e2 > -dy) {
                err -= dy;
                x0 += sx;
            }

            // 调整误差和y坐标
            if (e2 < dx) {
                err += dx;
                y0 += sy;
            }
        }
    }
    drawOutlinedRect(
        { start, end, color }: { start: Pos; end: Pos; color: Color },
    ): void {
        for (let x = start.x; x <= end.x; x++) {
            this.setPixel({ pos: { x, y: start.y }, color });
            this.setPixel({ pos: { x, y: end.y }, color });
        }
        for (let y = start.y; y <= end.y; y++) {
            this.setPixel({ pos: { x: start.x, y }, color });
            this.setPixel({ pos: { x: end.x, y }, color });
        }
    }
    drawFilledRect(
        { start, end, color }: { start: Pos; end: Pos; color: Color },
    ): void {
        for (let x = start.x; x <= end.x; x++) {
            for (let y = start.y; y <= end.y; y++) {
                this.setPixel({ pos: { x, y }, color });
            }
        }
    }
    drawOutlinedCircle(
        {
            center,
            radius,
            color,
            startAngle = 0,
            endAngle = 360,
            thickness = 1,
        }: {
            center: Pos;
            radius: number;
            color: Color;
            startAngle?: number;
            endAngle?: number;
            thickness?: number;
        },
    ): void {
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
    drawFilledCircle(
        { center, radius, color, startAngle = 0, endAngle = 360 }: {
            center: Pos;
            radius: number;
            color: Color;
            startAngle?: number;
            endAngle?: number;
        },
    ): void {
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
