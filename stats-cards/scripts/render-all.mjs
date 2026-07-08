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
    // Recompress below GitHub's ~10MB camo proxy limit (2x renders are ~15MB).
    execSync(`gifsicle -O3 --lossy=60 ${out} -o ${out}`, {stdio: 'inherit'});
  }
}
