# AgentSkills

**The skill marketplace for on-device AI.**

On-device models are here — Gemma 4, Apple Intelligence, Phi-4, Qwen. Every app that calls a cloud API today will run locally tomorrow. But there's a gap: the **skills layer**.

Every developer building on-device AI apps is hand-writing the same map skill, the same email composer, the same calendar tool. Thousands of devs, duplicated work, no standard.

AgentSkills fixes that.

---

## What is a skill?

A skill is a small, self-contained tool plugin that lets an on-device AI model take actions in the real world — search maps, compose emails, parse data, generate invoices. Drop it into your app, and your model can use it in minutes.

```
skills/
├── maps/
│   ├── google-maps-search/
│   └── route-planner/
├── calendar/
│   ├── event-creator/
│   └── availability-checker/
├── communication/
│   ├── email-composer/
│   ├── sms-composer/
│   └── slack-message-formatter/
├── data/
│   ├── json-transformer/
│   ├── csv-parser/
│   └── web-scraper-lite/
├── productivity/
│   ├── task-extractor/
│   ├── meeting-summarizer/
│   └── document-classifier/
├── payments/
│   ├── invoice-generator/
│   └── price-calculator/
└── search/
    └── web-search-adapter/
```

---

## Quick Start

### 1. Browse and pick a skill

Find a skill in the `skills/` directory. Each has a `README.md` with inputs, outputs, and examples.

### 2. Drop it into your app

Copy the skill's `index.js` and `skill.json` into your project.

### 3. Register it with your framework

**Google AI Edge Gallery:**
```js
import { skill } from './skills/maps/google-maps-search/index.js';
agent.registerSkill(skill);
```

**LM Studio (tool calling):**
```js
const tool = require('./skills/maps/google-maps-search/skill.json');
// Pass as tool definition in your LM Studio API call
```

**Ollama / OpenAI-compatible:**
```js
const toolDef = require('./skills/maps/google-maps-search/skill.json');
// Use in tools[] array of your chat completion call
```

---

## Framework Compatibility

| Framework | Support |
|---|---|
| Google AI Edge Gallery | ✅ |
| LM Studio | ✅ |
| Ollama | ✅ |
| OpenAI tool-calling API | ✅ |
| Anthropic tool-use API | ✅ |
| Generic (any JSON schema tools) | ✅ |

---

## Skill Categories

| Category | Skills | Description |
|---|---|---|
| 🗺️ maps | 2 | Location search, routing, geocoding |
| 📅 calendar | 2 | Event creation, availability checking |
| 💬 communication | 3 | Email, SMS, Slack composition |
| 📊 data | 3 | JSON transform, CSV parse, web scraping |
| ✅ productivity | 3 | Task extraction, meeting summaries, classification |
| 💳 payments | 2 | Invoice generation, price calculation |
| 🔍 search | 1 | Web search API adapter |

---

## Contributing

Want to add a skill? 

1. Fork this repo
2. Copy `templates/skill-template/` to `skills/<category>/<your-skill-slug>/`
3. Fill in `skill.json`, `index.js`, and `README.md`
4. Submit a PR

See [CONTRIBUTING.md](docs/CONTRIBUTING.md) for the full guide.

---

## Roadmap

- [ ] Web-based skill browser (search, preview, copy)
- [ ] CLI installer (`agentskills add google-maps-search`)
- [ ] npm package for programmatic skill loading
- [ ] Premium skill tier (complex, API-powered skills)
- [ ] Skill testing framework
- [ ] Community leaderboard

---

## License

MIT — use freely in personal and commercial projects.

---

*Built for the on-device AI era. The models are here. Now give them hands.*
