// Renders all stat cards (dark + light) as transparent, play-once GIFs.
import {execSync} from 'node:child_process';

const hasGifsicle = (() => {
  try {
    execSync('gifsicle --version', {stdio: 'ignore'});
    return true;
  } catch {
    return false;
  }
})();
if (!hasGifsicle) {
  throw new Error(
    'gifsicle is required (2x renders exceed the ~10MB GitHub camo limit without it). brew/apt install gifsicle.'
  );
}

const stats = ['models', 'providers', 'tokens', 'users'];
const themes = ['dark', 'light'];

for (const stat of stats) {
  for (const theme of themes) {
    const id = `${stat}-${theme}`;
    const out = `../profile/assets/stat-${id}.gif`;
    const cmd = [
      'npx remotion render',
      id,
      out,
      '--codec=gif',
      // Supersample 2x (1760x712): GIF alpha is 1-bit, so the anti-aliased
      // corner pixels that pass the 50% threshold form a light 1px ring.
      // At the README's 202px display width, doubling the source resolution
      // halves that ring's contribution to each screen pixel.
      '--scale=2',
      '--number-of-gif-loops=0',
      '--image-format=png',
      `--props=out/props-${stat}.json`,
    ].join(' ');
    console.log(`\n▶ ${id}`);
    execSync(cmd, {stdio: 'inherit'});
    // High-quality Lanczos downscale to exactly 2x the README's 208px
    // display width. Browsers downscale with cheap bilinear filtering
    // (~4 samples per output pixel), so shipping the raw 1760px render
    // aliased the text edges at 8.5x; a clean 2:1 step for the browser
    // keeps glyph edges smooth. Also recompresses ~15MB -> well under
    // GitHub's ~10MB camo proxy limit.
    execSync(
      `gifsicle -O3 --lossy=60 --resize-width 416 --resize-method lanczos3 --resize-colors 255 ${out} -o ${out}`,
      {stdio: 'inherit'}
    );
  }
}
