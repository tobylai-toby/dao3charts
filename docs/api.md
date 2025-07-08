
# DAO3Charts API 文档
> 此文档由AI生成
---

## Canvas

### 概述
DAO3Charts 的 Canvas 提供像素级绘制能力，支持自动缩放、基础图形绘制等。

### 类型定义
- **CanvasOptions**
  - `node: UiRenderable`  要渲染到的 UI 节点
  - `pixelSize?: number`  像素大小，默认为 1
  - `autoResizeOptions?: { enabled: boolean; maxWidth: number; maxHeight: number; }`  自动调整大小选项
- **Color**
  - `rgb?: Vec3`  RGB 颜色向量
  - `a?: number`  透明度，0-1
- **Pos**
  - `{ x: number; y: number } | Vec2`  位置类型
- **CanvasDrawPixelOptions**
  - `pos: Pos`  像素位置
  - `color: Color`  像素颜色
- **CanvasDrawLineOptions**
  - `start: Pos`  起始位置
  - `end: Pos`  结束位置
  - `color: Color`  线条颜色
- **CanvasDrawRectOptions**
  - `start: Pos`  左上角位置
  - `end: Pos`  右下角位置
  - `color: Color`  颜色
- **CanvasDrawOutlinedCircleOptions**
  - `center: Pos`  圆心
  - `radius: number`  半径
  - `color: Color`  轮廓颜色
  - `startAngle?: number`  起始角度，默认 0
  - `endAngle?: number`  结束角度，默认 360
  - `thickness?: number`  轮廓厚度，默认 1
- **CanvasDrawFilledCircleOptions**
  - `center: Pos`  圆心
  - `radius: number`  半径
  - `color: Color`  填充颜色
  - `startAngle?: number`  起始角度，默认 0
  - `endAngle?: number`  结束角度，默认 360

### Canvas 类方法
- `constructor(options: CanvasOptions)`  创建画布实例
- `setPixel(options: CanvasDrawPixelOptions): void`  设置指定像素颜色
- `drawLine(options: CanvasDrawLineOptions): void`  绘制直线
- `drawOutlinedRect(options: CanvasDrawRectOptions): void`  绘制矩形轮廓
- `drawFilledRect(options: CanvasDrawRectOptions): void`  绘制填充矩形
- `drawOutlinedCircle(options: CanvasDrawOutlinedCircleOptions): void`  绘制圆形轮廓
- `drawFilledCircle(options: CanvasDrawFilledCircleOptions): void`  绘制填充圆形
- `autoResize(): void`  根据配置自动调整像素大小和位置

### 使用示例
```ts
import { Canvas } from "@dao3fun/charts";
const canvasNode = ui.findChildByName("canvas")!;
const canvas = new Canvas({
  node: canvasNode,
  pixelSize: 2,
  autoResizeOptions: { enabled: true, maxHeight: 250, maxWidth: 400 }
});
canvas.setPixel({ pos: { x: 10, y: 10 }, color: { rgb: Vec3.create({ r: 255, g: 0, b: 0 }) } });
canvas.drawLine({ start: { x: 0, y: 0 }, end: { x: 100, y: 100 }, color: { rgb: Vec3.create({ r: 255, g: 0, b: 0 }) } });
canvas.drawFilledRect({ start: { x: 10, y: 10 }, end: { x: 50, y: 50 }, color: { rgb: Vec3.create({ r: 0, g: 255, b: 0 }) } });
canvas.drawFilledCircle({ center: { x: 50, y: 50 }, radius: 50, color: { rgb: Vec3.create({ r: 0, g: 0, b: 255 }) }, startAngle: 120, endAngle: 240 });
```

---

## Charts

### 概述
DAO3Charts 提供了柱状图、折线图、饼图等多种基础图表，均基于 Canvas 实现。

### 通用类型
- **BaseChartOptions**
  - `canvas: Canvas`  画布对象
  - `pos: { x: number; y: number }`  图表左上角位置
  - `size: { width: number; height: number }`  图表尺寸

### BarChart
- **BarChartOptions**（继承 BaseChartOptions）
  - `barWidth?: number`  柱宽（可选）
- **BarChartDrawItem**
  - `value: number`  数值
  - `color: Color`  颜色
- **BarChart 类方法**
  - `constructor(options: BarChartOptions)`
  - `draw({ items: BarChartDrawItem[] }): void`  绘制柱状图

### LineChart
- **LineChartOptions**（继承 BaseChartOptions）
  - `lineColor?: Color`  线条颜色（可选）
- **LineChartDrawItem**
  - `value: number`  数值
  - `dotColor: Color`  点颜色
  - `dotSize?: number`  点大小（可选）
- **LineChart 类方法**
  - `constructor(options: LineChartOptions)`
  - `draw({ items: LineChartDrawItem[] }): void`  绘制折线图

### PieChart
- **PieChartOptions**（继承 BaseChartOptions）
- **PieChartDrawItem**
  - `value: number`  数值
  - `color: Color`  颜色
- **PieChart 类方法**
  - `constructor(options: PieChartOptions)`
  - `draw({ items: PieChartDrawItem[] }): void`  绘制饼图

### 图表使用示例

#### 柱状图 BarChart
```ts
import { BarChart } from "@dao3fun/charts";
const bar = new BarChart({
  canvas,
  pos: { x: 10, y: 10 },
  size: { width: 200, height: 100 },
});
bar.draw({ items: [
  { value: 30, color: { rgb: Vec3.create({ r: 255, g: 0, b: 0 }) } },
  { value: 70, color: { rgb: Vec3.create({ r: 0, g: 255, b: 0 }) } },
  { value: 50, color: { rgb: Vec3.create({ r: 0, g: 0, b: 255 }) } },
] });
```

#### 折线图 LineChart
```ts
import { LineChart } from "@dao3fun/charts";
const line = new LineChart({
  canvas,
  pos: { x: 10, y: 140 },
  size: { width: 200, height: 100 },
});
line.draw({ items: [
  { value: 30, dotColor: { rgb: Vec3.create({ r: 255, g: 0, b: 0 }) }, dotSize: 3 },
  { value: 70, dotColor: { rgb: Vec3.create({ r: 0, g: 255, b: 0 }) }, dotSize: 3 },
  { value: 50, dotColor: { rgb: Vec3.create({ r: 0, g: 0, b: 255 }) }, dotSize: 3 },
] });
```

#### 饼图 PieChart
```ts
import { PieChart } from "@dao3fun/charts";
const pie = new PieChart({
  canvas,
  pos: { x: 250, y: 10 },
  size: { width: 200, height: 100 },
});
pie.draw({ items: [
  { value: 100, color: { rgb: Vec3.create({ r: 255, g: 0, b: 0 }) } },
  { value: 80, color: { rgb: Vec3.create({ r: 0, g: 255, b: 0 }) } },
  { value: 60, color: { rgb: Vec3.create({ r: 0, g: 0, b: 255 }) } },
] });
```

---

## 常见问题与补充说明

- **像素坐标与实际显示尺寸**：`pixelSize` 决定每个像素的实际显示大小，适合像素风格渲染。
- **自动缩放**：`autoResizeOptions` 可让画布根据容器自动缩放，适配不同分辨率。
- **颜色类型**：所有颜色均为 `{ rgb: Vec3, a?: number }`，`Vec3.create({r,g,b})` 创建 RGB。
- **图表数据格式**：所有图表的 `draw` 方法均需传入 `items` 数组，详见各类型定义。
- **清空与重绘**：每次 `draw` 会自动清空当前区域，无需手动调用 `clear()`。

如需更复杂的自定义图形，可直接调用 Canvas 的低阶 API。

> 更多类型定义和详细参数请参考源码注释。

> 更多类型定义和详细参数请参考源码注释。
