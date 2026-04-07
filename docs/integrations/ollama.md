# Ollama Integration

Connect Toolbelt skills to [Ollama](https://ollama.com) — the most popular local AI runtime.

---

## Prerequisites

- [Ollama](https://ollama.com/download) installed
- A model with tool-calling support (Llama 3.1+, Gemma 4, Qwen 3.5, Mistral)

```bash
ollama pull llama3.1
# or
ollama pull gemma4:e4b
```

---

## Using Toolbelt Skills with Ollama

Ollama supports OpenAI-compatible tool calling via its API. Every Toolbelt skill exports a `toolDefinition` that works directly.

### Basic Example

```js
import { toolDefinition, execute } from './skills/productivity/task-extractor/index.js';

const response = await fetch('http://localhost:11434/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    model: 'llama3.1',
    messages: [{ role: 'user', content: 'Extract tasks from: We need to ship the feature by Friday. John will handle testing. Maria should update the docs.' }],
    tools: [toolDefinition],
    stream: false,
  }),
});

const data = await response.json();

// Check if the model wants to call a tool
if (data.message?.tool_calls?.length) {
  for (const call of data.message.tool_calls) {
    const result = await execute(call.function.arguments);
    console.log('Tasks found:', result);
  }
}
```

### Multiple Skills

```js
import { toolDefinition as taskTool, execute as runTaskExtractor } from './skills/productivity/task-extractor/index.js';
import { toolDefinition as emailTool, execute as runEmailComposer } from './skills/communication/email-composer/index.js';
import { toolDefinition as csvTool, execute as runCsvParser } from './skills/data/csv-parser/index.js';

const tools = [taskTool, emailTool, csvTool];

const response = await fetch('http://localhost:11434/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    model: 'gemma4:e4b',
    messages: [{ role: 'user', content: 'Your prompt here' }],
    tools,
    stream: false,
  }),
});
```

### Agent Loop Pattern

For multi-step tasks where the model calls tools and reasons about results:

```js
async function agentLoop(model, userMessage, tools, executors) {
  let messages = [{ role: 'user', content: userMessage }];

  while (true) {
    const res = await fetch('http://localhost:11434/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model, messages, tools, stream: false }),
    });
    const data = await res.json();
    messages.push(data.message);

    if (!data.message.tool_calls?.length) return data.message.content;

    for (const call of data.message.tool_calls) {
      const executor = executors[call.function.name];
      const result = executor
        ? await executor(call.function.arguments)
        : { error: `Unknown tool: ${call.function.name}` };
      messages.push({ role: 'tool', content: JSON.stringify(result) });
    }
  }
}
```

---

## Recommended Models

| Model | Params | Tool Calling | Notes |
|---|---|---|---|
| Gemma 4 E4B | 4B | ✅ Native | Best for 16GB RAM devices |
| Gemma 4 26B A4B | 26B MoE (4B active) | ✅ Native | Excellent quality, needs ~12GB |
| Llama 3.1 8B | 8B | ✅ | Reliable tool calling |
| Qwen 3.5 | 4B–32B | ✅ | Strong function calling |
| Mistral Nemo | 12B | ✅ | Good balance of speed/quality |

---

## Resources

- [Ollama Tool Calling Docs](https://ollama.com/blog/tool-support)
- [Ollama API Reference](https://github.com/ollama/ollama/blob/main/docs/api.md)
