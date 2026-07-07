// Wraps a rendered GIF in an SVG container so GitHub serves an animated .svg.
// Usage: node scripts/wrap-svg.mjs <input.gif> <output.svg> <width> <height>
import {readFile, writeFile, mkdir} from 'node:fs/promises';
import {dirname} from 'node:path';

const [input, output, width = '640', height = '260'] = process.argv.slice(2);
if (!input || !output) {
  console.error('Usage: wrap-svg.mjs <input.gif> <output.svg> [width] [height]');
  process.exit(1);
}

const gif = await readFile(input);
const b64 = gif.toString('base64');

const svg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  <image width="${width}" height="${height}" xlink:href="data:image/gif;base64,${b64}"/>
</svg>
`;

await mkdir(dirname(output), {recursive: true});
await writeFile(output, svg);
console.log(`${output}: ${(svg.length / 1024).toFixed(0)} KiB`);
