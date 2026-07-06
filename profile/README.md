<div align="center">

# OpenRouter

**The unified interface for LLMs.**

Find the best models & prices for your prompts across hundreds of models and providers — through a single, OpenAI-compatible API.

[![Website](https://img.shields.io/badge/Website-openrouter.ai-2563eb?style=for-the-badge)](https://openrouter.ai)
[![Docs](https://img.shields.io/badge/Docs-openrouter.ai%2Fdocs-1e293b?style=for-the-badge)](https://openrouter.ai/docs)
[![Twitter](https://img.shields.io/badge/Twitter-@openrouter-1DA1F2?style=for-the-badge&logo=x&logoColor=white)](https://twitter.com/openrouter)
[![Discord](https://img.shields.io/badge/Discord-Join-5865F2?style=for-the-badge&logo=discord&logoColor=white)](https://discord.gg/openrouter)

</div>

---

## Why OpenRouter?

- **One API, hundreds of models.** Route requests to models from OpenAI, Anthropic, Google, Meta, Mistral, and many more — without changing your code.
- **Better prices & uptime.** Automatic fallbacks and price/performance routing across providers.
- **OpenAI-compatible.** Drop-in compatible with the OpenAI SDK — just change the base URL and key.
- **No lock-in.** Compare models, switch instantly, and pay as you go.

## Quickstart

```bash
curl https://openrouter.ai/api/v1/chat/completions \
  -H "Authorization: Bearer $OPENROUTER_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "openai/gpt-4o",
    "messages": [{ "role": "user", "content": "Hello!" }]
  }'
```

Using the OpenAI SDK (Python):

```python
from openai import OpenAI

client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key="OPENROUTER_API_KEY",
)

completion = client.chat.completions.create(
    model="anthropic/claude-3.5-sonnet",
    messages=[{"role": "user", "content": "Hello!"}],
)
print(completion.choices[0].message.content)
```

## Resources

- 🌐 **Website:** https://openrouter.ai
- 📚 **Documentation:** https://openrouter.ai/docs
- 🧠 **Models & Pricing:** https://openrouter.ai/models
- 💬 **Community:** https://discord.gg/openrouter

---

<div align="center">
<sub>Built with ❤️ by the OpenRouter team.</sub>
</div>
