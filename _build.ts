import { dts } from 'bun-dts';

const time=Date.now();
const res=await Bun.build({
	entrypoints: ['src/index.ts'],
	outdir: 'dist',
    minify: true,
    format: "esm",
	plugins: [dts({
        entry: 'src/index.ts',
    })],
});
console.log(`Build succeeded in ${Date.now() - time}ms`);