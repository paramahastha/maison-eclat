import { mkdir, writeFile, copyFile } from "node:fs/promises";
import sharp from "sharp";
const variants = [
  ["obsidian", "OBSIDIAN", "01", "#282b24", "#80562c"],
  ["neroli", "NEROLI", "02", "#b3a17c", "#c6a75a"],
  ["santal", "SANTAL", "03", "#624a30", "#965c31"],
];
await Promise.all(
  [
    "public/posters",
    "public/branding",
    "public/textures",
    "public/fonts",
    "public/models",
  ].map((p) => mkdir(p, { recursive: true })),
);
for (const [id, name, num, cap, liquid] of variants) {
  const label = `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="720" viewBox="0 0 640 720"><rect width="640" height="720" fill="#e9e0ce"/><rect x="24" y="24" width="592" height="672" fill="none" stroke="#ae9871" stroke-width="2"/><text x="320" y="140" text-anchor="middle" fill="#342c20" font-family="Georgia,serif" font-size="34" letter-spacing="4">MAISON ÉCLAT</text><path d="M290 225L320 195L350 225L320 255Z M305 225L320 210L335 225L320 240Z" fill="none" stroke="#9e8254" stroke-width="2"/><text x="320" y="370" text-anchor="middle" fill="#342c20" font-family="Georgia,serif" font-size="57" letter-spacing="3">${name}</text><text x="320" y="430" text-anchor="middle" fill="#5c4b32" font-family="Georgia,serif" font-size="33">No. ${num}</text><text x="320" y="600" text-anchor="middle" fill="#5c4b32" font-family="Arial,sans-serif" font-size="17" letter-spacing="4">EAU DE PARFUM</text><text x="320" y="640" text-anchor="middle" fill="#5c4b32" font-family="Arial,sans-serif" font-size="13" letter-spacing="2">AN OLFACTORY STUDY</text></svg>`;
  await writeFile(`public/textures/label-${id}.svg`, label);
  await sharp(Buffer.from(label))
    .png()
    .toFile(`public/textures/label-${id}.png`);
  const poster = `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="1200" viewBox="0 0 900 1200"><defs><linearGradient id="glass"><stop stop-color="#a58c57"/><stop offset=".08" stop-color="#d0b77b" stop-opacity=".6"/><stop offset=".16" stop-color="#36382c" stop-opacity=".8"/><stop offset=".5" stop-color="#4c503d" stop-opacity=".5"/><stop offset=".86" stop-color="#c4b47e" stop-opacity=".6"/><stop offset="1" stop-color="#746f4b"/></linearGradient><linearGradient id="liquid" x2=".7" y2="1"><stop stop-color="${liquid}"/><stop offset="1" stop-color="#b99044" stop-opacity=".7"/></linearGradient><linearGradient id="cap"><stop stop-color="#10140f"/><stop offset=".2" stop-color="${cap}"/><stop offset=".5" stop-color="${cap}"/><stop offset=".7" stop-color="#5b604b"/><stop offset="1" stop-color="#161c14"/></linearGradient></defs><g transform="translate(190 80)"><rect x="100" y="90" width="320" height="180" rx="23" fill="url(#cap)"/><path d="M118 100L397 100" stroke="#b19b71" stroke-opacity=".6"/><rect x="165" y="263" width="190" height="48" rx="10" fill="#b49860"/><rect x="10" y="310" width="500" height="690" rx="62" fill="url(#glass)" stroke="#c6b786" stroke-width="2"/><rect x="45" y="390" width="430" height="560" rx="35" fill="url(#liquid)"/><rect x="22" y="321" width="476" height="666" rx="53" fill="none" stroke="#e2d3a4" stroke-opacity=".5" stroke-width="3"/><path d="M40 415V890" stroke="#f3e8c5" stroke-opacity=".7" stroke-width="6"/><path d="M477 405V928" stroke="#f3e8c5" stroke-opacity=".45" stroke-width="4"/><rect x="89" y="480" width="342" height="385" fill="#e9e0ce"/><rect x="101" y="492" width="318" height="361" fill="none" stroke="#aa9672"/><text x="260" y="548" text-anchor="middle" fill="#342c20" font-family="Georgia,serif" font-size="20" letter-spacing="2">MAISON ÉCLAT</text><path d="M245 590L260 575L275 590L260 605Z" fill="none" stroke="#9e8254"/><text x="260" y="675" text-anchor="middle" fill="#342c20" font-family="Georgia,serif" font-size="32" letter-spacing="1">${name}</text><text x="260" y="709" text-anchor="middle" fill="#5c4b32" font-family="Georgia,serif" font-size="20">No. ${num}</text><text x="260" y="799" text-anchor="middle" fill="#5c4b32" font-family="Arial,sans-serif" font-size="10" letter-spacing="3">EAU DE PARFUM</text><path d="M55 970Q260 1005 465 970" stroke="#e2d3a4" stroke-opacity=".7" stroke-width="8" fill="none"/></g></svg>`;
  await writeFile(`public/posters/${id}.svg`, poster);
  await sharp(Buffer.from(poster))
    .webp({ quality: 90 })
    .toFile(`public/posters/${id}.webp`);
}
let paths = "";
for (let j = 0; j < 3; j++) {
  let cx = 160 + j * 200,
    cy = 300 + (j % 2) * 80;
  for (let i = 0; i < 14; i++) {
    const a = (i * Math.PI * 2) / 14;
    let x = cx + Math.cos(a) * 110,
      y = cy + Math.sin(a) * 180;
    paths += `<path d="M${cx} ${cy}Q${cx + Math.sin(a) * 150} ${cy + Math.cos(a) * 80} ${x} ${y}Q${cx - Math.sin(a) * 90} ${cy - Math.cos(a) * 70} ${cx} ${cy}"/>`;
  }
}
await writeFile(
  "public/textures/botanical.svg",
  `<svg xmlns="http://www.w3.org/2000/svg" width="700" height="700" viewBox="0 0 700 700"><g fill="none" stroke="#b79b68" stroke-width=".65">${paths}<ellipse cx="350" cy="350" rx="270" ry="210" transform="rotate(-28 350 350)"/><ellipse cx="350" cy="350" rx="240" ry="290" transform="rotate(35 350 350)"/></g></svg>`,
);
const macro = `<svg xmlns="http://www.w3.org/2000/svg" width="1800" height="1200"><defs><linearGradient id="g" x1="0" y1="1" x2="1" y2="0"><stop stop-color="#171813"/><stop offset=".5" stop-color="#413122"/><stop offset=".72" stop-color="#b28343"/><stop offset=".8" stop-color="#e6c48e"/><stop offset=".86" stop-color="#71542e"/><stop offset="1" stop-color="#1b1b15"/></linearGradient></defs><rect width="1800" height="1200" fill="#211f17"/>${Array.from({ length: 18 }, (_, i) => `<path d="M${650 + i * 29} -80C${2100 - i * 20} ${200 + i * 5} ${400 + i * 9} 700 ${1700 + i * 40} 1300L1900 1300V-80Z" fill="url(#g)" opacity=".55"/>`).join("")}</svg>`;
await sharp(Buffer.from(macro))
  .webp({ quality: 88 })
  .toFile("public/textures/light-study.webp");
const icon =
  '<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180"><rect width="180" height="180" fill="#11120f"/><text x="90" y="131" font-family="Georgia,serif" font-size="140" text-anchor="middle" fill="#b79b68">É</text></svg>';
await writeFile("public/branding/favicon.svg", icon);
await sharp(Buffer.from(icon))
  .png()
  .toFile("public/branding/apple-touch-icon.png");
const og =
  '<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630"><rect width="1200" height="630" fill="#11120f"/><text x="90" y="260" font-family="Georgia,serif" font-size="100" fill="#f3efe6">MAISON ÉCLAT</text><text x="95" y="350" font-family="Georgia,serif" font-size="48" fill="#b79b68">The art of lingering.</text><text x="95" y="540" font-family="Arial,sans-serif" font-size="18" letter-spacing="3" fill="#f3efe6">AN OLFACTORY STUDY · COLLECTION 01</text></svg>';
await sharp(Buffer.from(og))
  .jpeg({ quality: 90 })
  .toFile("public/branding/og.jpg");
for (const font of ["cormorant-garamond", "manrope"])
  await copyFile(
    `node_modules/@fontsource/${font}/LICENSE`,
    `public/fonts/${font}-LICENSE.txt`,
  );
console.log(
  "Original fallback posters, label textures, botanical, light study and branding generated.",
);
