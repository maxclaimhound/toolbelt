# Toolbelt

**Pre-built tool plugins for local AI. Drop skills into any agent.**

Local models are here — Gemma 4, Apple Intelligence, Phi-4, Qwen. Every app that calls a cloud API today will run locally tomorrow. But there's a gap: the **skills layer**.

Every developer building local AI apps is hand-writing the same map skill, the same email composer, the same calendar tool. Thousands of devs, duplicated work, no standard.

Toolbelt fixes that.

---

## What is a skill?

A skill is a small, self-contained JS module that lets a local AI model take actions in the real world — search maps, compose emails, parse data, generate invoices. Drop it into your app, and your model can use it in minutes.

Each skill ships with:
- **`index.js`** — real, working execution logic (no stubs)
- **`skill.json`** — schema definition + OpenAI-compatible tool definition
- Works with any framework that supports function/tool calling

---

## Skills (16 free, MIT licensed)

```
skills/
├── maps/
│   ├── google-maps-search/     → Search places by query + location
│   └── route-planner/          → Turn-by-turn directions
├── calendar/
│   ├── event-creator/          → Create events, returns iCal format
│   └── availability-checker/   → Check if a time slot is free
├── communication/
│   ├── email-composer/         → Compose professional emails
│   ├── sms-composer/           → Compose SMS within character limits
│   └── slack-message-formatter/ → Format Slack Block Kit messages
├── data/
│   ├── json-transformer/       → Filter, sort, flatten, reshape JSON
│   ├── csv-parser/             → Parse CSV into structured JSON
│   └── web-scraper-lite/       → Extract content from any URL
├── productivity/
│   ├── task-extractor/         → Extract action items from text
│   ├── meeting-summarizer/     → Summarize transcripts into decisions + next steps
│   └── document-classifier/   → Classify documents into categories
├── payments/
│   ├── invoice-generator/      → Generate invoices with line items + tax
│   └── price-calculator/       → Calculate totals with discounts + tax
└── search/
    └── web-search-adapter/     → Unified adapter for Brave + Serper APIs
```

---

## Quick Start

### 1. Clone or copy a skill

```bash
git clone https://github.com/reganbuilds/toolbelt.git
```

Or just copy the skill folder you need into your project.

### 2. Import and use

```js
import { execute, toolDefinition } from './skills/productivity/task-extractor/index.js';

// Use toolDefinition with any OpenAI-compatible framework
// Use execute() to run the skill directly
const result = await execute({
  text: 'We need to ship by Friday. John will handle testing. Maria should update the docs.'
});
// → { tasks: [...], count: 3 }
```

### 3. Register with your framework

**Ollama:**
```js
const res = await fetch('http://localhost:11434/api/chat', {
  method: 'POST',
  body: JSON.stringify({ model: 'gemma4:e4b', messages: [...], tools: [toolDefinition], stream: false }),
});
```

**LM Studio:**
```js
const res = await fetch('http://127.0.0.1:1234/v1/chat/completions', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ model: 'gemma-4-e4b-it', messages: [...], tools: [toolDefinition] }),
});
```

**Google AI Edge Gallery:**
```js
agent.registerSkill({
  name: toolDefinition.function.name,
  description: toolDefinition.function.description,
  parameters: toolDefinition.function.parameters,
  execute: (params) => execute(params),
});
```

---

## Framework Compatibility

| Framework | Status |
|---|---|
| Ollama | ✅ Full support |
| LM Studio | ✅ Full support |
| Google AI Edge Gallery | ✅ Full support |
| OpenAI API | ✅ Full support |
| Anthropic Claude API | ✅ Full support |
| Any OpenAI-compatible API | ✅ Full support |

---

## Recommended Models

Works best with models that have native function/tool calling:

| Model | Size | Via |
|---|---|---|
| **Gemma 4 E4B** | 4B | Ollama, LM Studio, AI Edge |
| **Gemma 4 26B A4B** | 26B MoE (4B active) | Ollama, LM Studio |
| **Qwen 3.5 4B** | 4B | Ollama, LM Studio |
| **Llama 3.1 8B** | 8B | Ollama |

---

## Integration Guides

Step-by-step setup for popular frameworks and tools:

| Guide | Description |
|---|---|
| [Ollama](docs/integrations/ollama.md) | Most popular local AI runtime |
| [LM Studio](docs/integrations/lm-studio.md) | Desktop app, OpenAI-compatible API |
| [Google AI Edge Gallery](docs/integrations/google-ai-edge.md) | Local AI on iOS and Android |
| [Gemma 4 Function Calling](docs/integrations/gemma-4-function-calling.md) | Google's latest open model — just released |
| [X API via XMCP](docs/integrations/x-api.md) | Official X MCP server — post, search, engage |
| [Home Assistant](docs/integrations/home-assistant.md) | Smart home + local AI agent |

---

## Contributing

Want to add a skill?

1. Fork this repo
2. Copy `templates/skill-template/` to `skills/<category>/<your-skill-slug>/`
3. Fill in `skill.json`, `index.js`, and `README.md`
4. Submit a PR

**Quality bar:** Real working code only. No stubs. No npm dependencies (use native fetch/JS). See [CONTRIBUTING.md](docs/CONTRIBUTING.md).

---

## Roadmap

- [ ] CLI installer: `npx toolbelt add google-maps-search`
- [ ] Web-based skill browser (search, preview, copy)
- [ ] npm package for programmatic skill loading
- [ ] Premium API tier — server-side skills for complex data tasks
- [ ] Skill testing framework
- [ ] More skills: GitHub, Stripe, Notion, Airtable, Twilio

---

## License

MIT — free for personal and commercial use.

---

## Disclaimer

Users are responsible for complying with the Terms of Service of any third-party APIs, services, or websites they interact with using these skills.

---

*Built for the local AI era. The models are here. Now give them hands.*
