// Fetches live OpenRouter stats and writes per-composition props files.
import {mkdir, writeFile} from 'node:fs/promises';

const get = async (url) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${url} -> ${res.status}`);
  return res.json();
};

const getText = async (url) => {
  const res = await fetch(url, {headers: {'user-agent': 'Mozilla/5.0'}});
  if (!res.ok) throw new Error(`${url} -> ${res.status}`);
  return res.text();
};

const [find, providers, rankings, homepage] = await Promise.all([
  // Full marketplace listing (all modalities), unlike /api/v1/models which
  // only covers chat-completions models.
  get('https://openrouter.ai/api/frontend/v1/models/find'),
  get('https://openrouter.ai/api/v1/providers'),
  // Monthly window to match the homepage's canonical "Monthly Tokens" stat.
  get('https://openrouter.ai/api/frontend/v1/rankings/models?view=month').catch(
    () => null // undocumented endpoint — tolerate failure
  ),
  // No public API exposes the user count; the homepage stat card is the
  // canonical source ("10M+ Global Users"). Tolerate failure.
  getText('https://openrouter.ai/').catch(() => null),
]);

// Count only active root models: an active model has a non-null endpoint,
// and :variant slugs (e.g. ":free", ":extended") are excluded so each model
// is counted once.
const modelCount = new Set(
  find.data.models
    .filter((m) => m.endpoint != null && !m.slug.includes(':'))
    .map((m) => m.slug)
).size;
const providerCount = providers.data.length;

// Round down to a "nice" number: nearest 100 at/above 100, nearest 10 below.
// Avoids oddly specific live counts on the homepage (e.g. 411 -> 400).
const nice = (n) => (n >= 100 ? Math.floor(n / 100) * 100 : Math.floor(n / 10) * 10);

// Parse "<value>M+ ... Global Users" from the homepage stats section.
let usersM = 10; // fallback matching the current homepage
if (homepage) {
  const m = homepage.match(/(\d+(?:\.\d+)?)M\+<\/p>[^<]*<p[^>]*>Global Users/);
  if (m) usersM = Number(m[1]);
}

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
  models: {value: nice(modelCount), suffix: '+', label: 'Models'},
  providers: {value: nice(providerCount), suffix: '+', label: 'Providers'},
  tokens: {value: tokensT, suffix: 'T', label: 'Tokens / month'},
  users: {value: usersM, suffix: 'M+', label: 'Global users'},
};

for (const [id, p] of Object.entries(props)) {
  await writeFile(`out/props-${id}.json`, JSON.stringify(p));
  console.log(`${id}: ${p.value}${p.suffix}`);
}
