<div align="center">

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://openrouter.ai/brand/rebrand/Openrouter.White.Horizontal.svg">
  <source media="(prefers-color-scheme: light)" srcset="https://openrouter.ai/brand/rebrand/Openrouter.Black.Horizontal.svg">
  <img alt="OpenRouter" src="https://openrouter.ai/brand/rebrand/Openrouter.Black.Horizontal.svg" width="420">
</picture>

<br><br>

**The unified interface for LLMs.**

Find the best models & prices for your prompts — through a single, OpenAI-compatible API.

<br>

<a href="https://openrouter.ai/models"><img src="./assets/stat-models.svg" alt="Models on OpenRouter" width="290"></a>
<a href="https://openrouter.ai/models"><img src="./assets/stat-providers.svg" alt="Providers on OpenRouter" width="290"></a>
<a href="https://openrouter.ai/rankings"><img src="./assets/stat-tokens.svg" alt="Tokens routed per week" width="290"></a>

<sub>Live stats — regenerated daily by <a href="../.github/workflows/update-stats.yml">CI</a></sub>

[![Website](https://img.shields.io/badge/Website-openrouter.ai-1e293b?style=for-the-badge)](https://openrouter.ai)
[![Docs](https://img.shields.io/badge/Docs-openrouter.ai%2Fdocs-1e293b?style=for-the-badge)](https://openrouter.ai/docs)
[![Twitter](https://img.shields.io/badge/@openrouter-000000?style=for-the-badge&logo=x&logoColor=white)](https://twitter.com/openrouter)
[![Discord](https://img.shields.io/badge/Discord-Join-5865F2?style=for-the-badge&logo=discord&logoColor=white)](https://discord.gg/openrouter)

</div>

---

## Why OpenRouter?

- **One API, 340+ models.** Route requests to models from OpenAI, Anthropic, Google, Meta, Mistral, and many more — without changing your code.
- **Better prices & uptime.** Automatic fallbacks and price/performance routing across 90+ providers.
- **OpenAI-compatible.** Drop-in compatible with the OpenAI SDK — just change the base URL and key.
- **No lock-in.** Compare models, switch instantly, and pay as you go.

<div align="center">
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://openrouter.ai/perf-dark.png">
  <source media="(prefers-color-scheme: light)" srcset="https://openrouter.ai/perf-light.png">
  <img alt="OpenRouter performance" src="https://openrouter.ai/perf-light.png" width="640">
</picture>
</div>

## Quickstart

```bash
curl https://openrouter.ai/api/v1/chat/completions \
  -H "Authorization: Bearer $OPENROUTER_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "openrouter/auto",
    "messages": [{ "role": "user", "content": "Hello!" }]
  }'
```

### Not just a proxy — automatic fallbacks & smart routing

If a provider goes down or rate-limits you, your request still succeeds:

```python
from openai import OpenAI

client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key="OPENROUTER_API_KEY",
)

completion = client.chat.completions.create(
    model="anthropic/claude-sonnet-4.5",
    extra_body={
        "models": ["openai/gpt-5", "google/gemini-2.5-pro"],  # automatic fallbacks
    },
    messages=[{"role": "user", "content": "Hello!"}],
)
print(completion.choices[0].message.content)
```

Or let OpenRouter pick the best model for each prompt with `model="openrouter/auto"`.

## 🔧 Our open source

| Repo | What it is |
| --- | --- |
| [ai-sdk-provider](https://github.com/OpenRouterTeam/ai-sdk-provider) | OpenRouter provider for the Vercel AI SDK |
| [openrouter-examples](https://github.com/OpenRouterTeam/openrouter-examples) | Example apps and integration patterns |
| [openrouter-runner](https://github.com/OpenRouterTeam/openrouter-runner) | Inference engine powering OpenRouter's open-source models |
| [docs](https://openrouter.ai/docs) | API reference, guides, and feature docs |

## Resources

- 🌐 **Website:** https://openrouter.ai
- 📚 **Documentation:** https://openrouter.ai/docs
- 🧠 **Models & Pricing:** https://openrouter.ai/models
- 📊 **Rankings:** https://openrouter.ai/rankings
- 💬 **Community:** https://discord.gg/openrouter

---

<div align="center">
<sub>Built with ❤️ by the OpenRouter team.</sub>
</div>
