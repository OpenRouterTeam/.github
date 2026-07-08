// Fetches live OpenRouter stats and writes per-composition props files.
import {mkdir, writeFile} from 'node:fs/promises';

const get = async (url) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${url} -> ${res.status}`);
  return res.json();
};

const [models, providers, rankings] = await Promise.all([
  get('https://openrouter.ai/api/v1/models'),
  get('https://openrouter.ai/api/v1/providers'),
  // Monthly window to match the homepage's canonical "Monthly Tokens" stat.
  get('https://openrouter.ai/api/frontend/v1/rankings/models?view=month').catch(
    () => null // undocumented endpoint — tolerate failure
  ),
]);

const modelCount = models.data.length;
const providerCount = providers.data.length;

let tokensT = 100; // conservative fallback
if (rankings?.data?.length) {
  // The response contains multiple date buckets; only the latest one is
  // the trailing-month window. Summing all rows would double-count
  // stale partial buckets.
  const latest = rankings.data.reduce(
    (max, r) => (r.date > max ? r.date : max),
    rankings.data[0].date
  );
  // Canonical "tokens processed" formula (site's getTotalTokens):
  // prompt + completion, excluding reasoning/cached columns.
  const total = rankings.data
    .filter((r) => r.date === latest)
    .reduce(
      (sum, r) =>
        sum + (r.total_prompt_tokens ?? 0) + (r.total_completion_tokens ?? 0),
      0
    );
  if (total > 1e12) tokensT = Math.round(total / 1e12);
}

await mkdir('out', {recursive: true});

const props = {
  models: {value: modelCount, suffix: '+', label: 'Models'},
  providers: {value: providerCount, suffix: '+', label: 'Providers'},
  tokens: {value: tokensT, suffix: 'T', label: 'Tokens / month'},
};

for (const [id, p] of Object.entries(props)) {
  await writeFile(`out/props-${id}.json`, JSON.stringify(p));
  console.log(`${id}: ${p.value}${p.suffix}`);
}
