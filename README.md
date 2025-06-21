# dao3charts
Draw charts like bar,line,pie on Arena(dao3.fun)
在神岛Arena中绘制柱状图、折线图、饼状图等图表。

## 安装
```bash
# npm
npm i @dao3fun/charts
# bun
bun i @dao3fun/charts
```

## 示例
```typescript
import { Canvas,BarChart,PieChart,LineChart } from "@dao3fun/charts";

// 创建画布，需要提前创建一个ui box命名为canvas
const canvas = new Canvas({
    node: ui.findChildByName("canvas")!,
    pixelSize: 2,
});
// 柱状图
const bar=new BarChart({
    canvas,
    pos: { x: 10, y: 10 },
    size: { width: 200, height: 100 },
});
bar.draw({items:[
    {value:30,color:{rgb:Vec3.create({r:255,g:0,b:0})}},
    {value:70,color:{rgb:Vec3.create({r:0,g:255,b:0})}},
    {value:50,color:{rgb:Vec3.create({r:0,g:0,b:255})}},
    {value:30,color:{rgb:Vec3.create({r:255,g:0,b:0})}},
    {value:70,color:{rgb:Vec3.create({r:0,g:255,b:0})}},
    {value:50,color:{rgb:Vec3.create({r:0,g:0,b:255})}},
    {value:30,color:{rgb:Vec3.create({r:255,g:0,b:0})}},
    {value:70,color:{rgb:Vec3.create({r:0,g:255,b:0})}},
    {value:50,color:{rgb:Vec3.create({r:0,g:0,b:255})}},
]});
// 饼状图
const pie=new PieChart({
    canvas,
    pos: {x:250,y:10},
    size: { width: 200, height: 100 }
});
pie.draw({
    items:[
        {value:100,color:{rgb:Vec3.create({r:255,g:0,b:0})}},
        {value:80,color:{rgb:Vec3.create({r:0,g:255,b:0})}},
        {value:60,color:{rgb:Vec3.create({r:0,g:0,b:255})}},
    ]
})
// 折线图
const line=new LineChart({
    canvas,
    pos: { x: 10, y: 150 },
    size: { width: 200, height: 100 },
});
line.draw({items:[
    {value:30,dotColor:{rgb:Vec3.create({r:255,g:0,b:0})},dotSize:3},
    {value:70,dotColor:{rgb:Vec3.create({r:0,g:255,b:0})},dotSize:3},
    {value:50,dotColor:{rgb:Vec3.create({r:0,g:0,b:255})},dotSize:3},
    {value:30,dotColor:{rgb:Vec3.create({r:255,g:0,b:0})},dotSize:3},
    {value:70,dotColor:{rgb:Vec3.create({r:0,g:255,b:0})},dotSize:3},
    {value:50,dotColor:{rgb:Vec3.create({r:0,g:0,b:255})},dotSize:3},
    {value:30,dotColor:{rgb:Vec3.create({r:255,g:0,b:0})},dotSize:3},
    {value:70,dotColor:{rgb:Vec3.create({r:0,g:255,b:0})},dotSize:3},
    {value:50,dotColor:{rgb:Vec3.create({r:0,g:0,b:255})},dotSize:3},
]});
```