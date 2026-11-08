import { stat, readFile, readdir, writeFile } from "node:fs/promises";
import sharp from "sharp";
const assets = [];
for (const folder of ["models", "posters", "textures", "branding", "fonts"])
  for (const filename of await readdir(`public/${folder}`)) {
    const path = `public/${folder}/${filename}`;
    const file = await stat(path);
    if (!file.isFile()) continue;
    if (file.size === 0) throw new Error(`Empty asset ${path}`);
    if (/\.(png|webp|jpg)$/.test(filename)) await sharp(path).metadata();
    assets.push({ path, bytes: file.size });
  }
const buffer = await readFile("public/models/maison-bottle.glb");
if (buffer.toString("utf8", 0, 4) !== "glTF") throw new Error("Invalid GLB");
const jsonLength = buffer.readUInt32LE(12);
const gltf = JSON.parse(buffer.toString("utf8", 20, 20 + jsonLength));
for (const name of [
  "Bottle_Glass",
  "Bottle_Liquid",
  "Bottle_Cap",
  "Bottle_Collar",
  "Bottle_Label",
  "Bottle_Base",
])
  if (!gltf.nodes.some((node) => node.name === name))
    throw new Error(`Missing ${name}`);
for (const name of ["obsidian", "neroli", "santal"]) {
  await stat(`public/posters/${name}.webp`);
  await stat(`public/posters/${name}-live.webp`);
  await stat(`public/posters/${name}-detail.webp`);
  await stat(`public/posters/${name}-detail-mobile.webp`);
}
for (const name of ["studio-water.webp", "studio-water-highlights.webp"])
  await stat(`public/textures/${name}`);
await writeFile(
  "docs/asset-budget.json",
  JSON.stringify(
    {
      assets,
      totalBytes: assets.reduce((sum, a) => sum + a.bytes, 0),
      modelBytes: buffer.length,
      modelNodes: gltf.nodes.length,
    },
    null,
    2,
  ),
);
console.log(
  `Validated ${assets.length} assets; GLB ${(buffer.length / 1024).toFixed(1)} KiB with all required objects.`,
);
