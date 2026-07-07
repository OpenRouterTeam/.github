// Renders all stat cards (dark + light) as transparent, play-once GIFs.
import {execSync} from 'node:child_process';

const stats = ['models', 'providers', 'tokens'];
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
      '--number-of-gif-loops=0',
      '--image-format=png',
      `--props=out/props-${stat}.json`,
    ].join(' ');
    console.log(`\n▶ ${id}`);
    execSync(cmd, {stdio: 'inherit'});
  }
}
