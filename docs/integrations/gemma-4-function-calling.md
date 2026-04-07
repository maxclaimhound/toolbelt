# Gemma 4 Function Calling Guide

Gemma 4 has native function-calling support — meaning it can decide when to call a Toolbelt skill, format the parameters correctly, and reason about the results. This guide covers how to wire it up.

---

## Gemma 4 Model Sizes

| Model | Params | Active Params | RAM Needed | Context | Best For |
|---|---|---|---|---|---|
| E2B | 2B | 2B | ~2GB | 128K | Mobile (iPhone, Android) |
| E4B | 4B | 4B | ~4GB | 128K | Laptops, Mac mini, phones |
| 26B A4B | 25.2B MoE | 3.8B | ~10-14GB | 256K | Desktop, quality + speed balance |
| 31B | 31B | 31B | ~19GB+ | 256K | Servers, high-end desktops |

All sizes support:
- ✅ Function/tool calling (native)
- ✅ Vision (image input)
- ✅ Audio (E2B and E4B only)
- ✅ Configurable thinking/reasoning modes
- ✅ 140+ languages

---

## Function Calling with Gemma 4

### Via Ollama

```js
import { toolDefinition, execute } from './skills/data/csv-parser/index.js';

const res = await fetch('http://localhost:11434/api/chat', {
  method: 'POST',
  body: JSON.stringify({
    model: 'gemma4:e4b',
    messages: [{ role: 'user', content: 'Parse this CSV: name,age,city\nAlice,30,NYC\nBob,25,LA' }],
    tools: [toolDefinition],
    stream: false,
  }),
});

const data = await res.json();
if (data.message.tool_calls?.length) {
  const args = data.message.tool_calls[0].function.arguments;
  const result = await execute(args);
  console.log(result);
  // { rows: [{ name: 'Alice', age: '30', city: 'NYC' }, ...], headers: ['name','age','city'], count: 2 }
}
```

### Via LM Studio

```js
import { toolDefinition, execute } from './skills/productivity/meeting-summarizer/index.js';

const res = await fetch('http://127.0.0.1:1234/v1/chat/completions', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    model: 'gemma-4-e4b-it',
    messages: [{ role: 'user', content: 'Summarize this meeting: John: We need to ship by Friday...' }],
    tools: [toolDefinition],
  }),
});

const data = await res.json();
const call = data.choices[0].message.tool_calls?.[0];
if (call) {
  const result = await execute(JSON.parse(call.function.arguments));
  console.log(result.summary);
}
```

---

## Thinking / Reasoning Modes

Gemma 4 supports configurable thinking. For complex tool-calling chains, enable thinking:

```json
{
  "model": "gemma4:26b-a4b",
  "messages": [{ "role": "user", "content": "your prompt" }],
  "tools": [...],
  "options": {
    "thinking": true
  }
}
```

This lets the model reason about which tool to call and how to use the results before responding.

---

## Multi-Tool Agent Pattern

Gemma 4's function calling works well with multiple Toolbelt skills:

```js
import { toolDefinition as mapTool, execute as runMap } from './skills/maps/google-maps-search/index.js';
import { toolDefinition as emailTool, execute as runEmail } from './skills/communication/email-composer/index.js';
import { toolDefinition as calTool, execute as runCal } from './skills/calendar/event-creator/index.js';

const tools = [mapTool, emailTool, calTool];
const executors = {
  google_maps_search: (args) => runMap(args, { GOOGLE_MAPS_API_KEY: process.env.GMAPS_KEY }),
  email_composer: runEmail,
  event_creator: runCal,
};

// User: "Find Italian restaurants near Times Square, email John about dinner, and create a calendar event for Friday at 7pm"
// Gemma 4 will call all three tools in sequence
```

---

## Running Gemma 4 Locally

**Ollama:**
```bash
ollama pull gemma4:e4b    # 4B, fits anywhere
ollama pull gemma4:26b    # 26B MoE, needs ~12GB
```

**LM Studio:**
Search for "gemma-4" in the Discover tab and download.

**Google AI Edge (mobile):**
Available in the AI Edge Gallery app for iOS and Android.

---

## Resources

- [Gemma 4 Announcement](https://blog.google/technology/developers/gemma-4/)
- [Gemma 4 Model Card](https://ai.google.dev/gemma/docs/core/model_card_4)
- [LM Studio Gemma 4 Page](https://lmstudio.ai/models/gemma-4)
