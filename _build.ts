import { dts } from "bun-dts";
import { watch } from "node:fs";


async function build() {
    const time = Date.now();
    const res = await Bun.build({
        entrypoints: ["src/index.ts"],
        outdir: "dist",
        minify: true,
        format: "esm",
        plugins: [dts({
            entry: "src/index.ts",
        })],
    });
    console.log(`Build succeeded in ${Date.now() - time}ms`);
}
await build();
if (process.argv.join(" ").includes("watch")) {
    // 可能会build两次，不过我觉得无所谓了
    watch("src", { recursive: true }, async (eventType, filename) => {
        console.log(`File ${filename} was ${eventType}`);
        await build();
    });
}