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

<a href="https://openrouter.ai/models"><picture><source media="(prefers-color-scheme: dark)" srcset="./assets/stat-models-dark.gif"><img src="./assets/stat-models-light.gif" alt="Models on OpenRouter" width="290"></picture></a>
<a href="https://openrouter.ai/models"><picture><source media="(prefers-color-scheme: dark)" srcset="./assets/stat-providers-dark.gif"><img src="./assets/stat-providers-light.gif" alt="Providers on OpenRouter" width="290"></picture></a>
<a href="https://openrouter.ai/rankings"><picture><source media="(prefers-color-scheme: dark)" srcset="./assets/stat-tokens-dark.gif"><img src="./assets/stat-tokens-light.gif" alt="Tokens routed per week" width="290"></picture></a>

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

## Quickstart with the OpenRouter SDKs

**TypeScript** — [`@openrouter/sdk`](https://github.com/OpenRouterTeam/typescript-sdk)

```bash
npm add @openrouter/sdk
```

```typescript
import { OpenRouter } from "@openrouter/sdk";

const openRouter = new OpenRouter(); // reads OPENROUTER_API_KEY

const result = await openRouter.chat.send({
  model: "openai/gpt-5.5",
  messages: [{ role: "user", content: "Hello, how are you?" }],
  provider: { sort: "price" }, // smart routing: cheapest provider first
  stream: true,
});

for await (const chunk of result) {
  console.log(chunk.choices[0].delta.content);
}
```

**Python** — [`openrouter`](https://github.com/OpenRouterTeam/python-sdk)

```bash
pip install openrouter
```

```python
import os
from openrouter import OpenRouter

with OpenRouter(api_key=os.getenv("OPENROUTER_API_KEY")) as open_router:
    res = open_router.chat.send(
        model="anthropic/claude-fable-5",
        messages=[{"role": "user", "content": "Hello, how are you?"}],
        provider={"sort": "price"},  # smart routing: cheapest provider first
    )
    print(res.choices[0].message.content)
```

Also available: [Go SDK](https://github.com/OpenRouterTeam/go-sdk) · [Agent SDK](https://github.com/OpenRouterTeam/typescript-agent) · plain [OpenAI-compatible REST API](https://openrouter.ai/docs/quickstart)

## 🔧 Our open source

### SDKs & agent tooling

| Repo | What it is |
| --- | --- |
| [typescript-sdk](https://github.com/OpenRouterTeam/typescript-sdk) | Official TypeScript SDK — type-safe access to 400+ models in any JS/TS runtime |
| [python-sdk](https://github.com/OpenRouterTeam/python-sdk) | Official Python SDK — sync + async clients, Pydantic types |
| [go-sdk](https://github.com/OpenRouterTeam/go-sdk) | Official Go SDK — provider routing, guardrails, and analytics |
| [typescript-agent](https://github.com/OpenRouterTeam/typescript-agent) | `@openrouter/agent` — tool orchestration, streaming, multi-turn agents |
| [ai-sdk-provider](https://github.com/OpenRouterTeam/ai-sdk-provider) | OpenRouter provider for the Vercel AI SDK |
| [skills](https://github.com/OpenRouterTeam/skills) | Agent skills for building with OpenRouter |

### Examples & integrations

| Repo | What it is |
| --- | --- |
| [openrouter-examples](https://github.com/OpenRouterTeam/openrouter-examples) | Examples of integrating the OpenRouter API |
| [openrouter-examples-python](https://github.com/OpenRouterTeam/openrouter-examples-python) | Calling OpenRouter models from Python |
| [tool-calling](https://github.com/OpenRouterTeam/tool-calling) | Tool calling demo for OpenRouter |
| [sign-in-with-openrouter](https://github.com/OpenRouterTeam/sign-in-with-openrouter) | Templates and skills for adding Sign In with OpenRouter |
| [awesome-openrouter](https://github.com/OpenRouterTeam/awesome-openrouter) | Community list of apps built on OpenRouter |

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
