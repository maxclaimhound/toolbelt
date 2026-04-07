# LM Studio Integration

Connect Toolbelt skills to [LM Studio](https://lmstudio.ai) — a desktop app for running local AI models with an OpenAI-compatible API.

---

## Prerequisites

- [LM Studio](https://lmstudio.ai/download) installed
- A model loaded with tool-calling support
- LM Studio server running (Start → Server tab → Start Server)

LM Studio runs an OpenAI-compatible API at `http://127.0.0.1:1234/v1` by default.

---

## Using Toolbelt Skills

Every Toolbelt skill exports a `toolDefinition` in OpenAI function-calling format — LM Studio accepts these directly.

### Basic Example

```js
import { toolDefinition, execute } from './skills/payments/invoice-generator/index.js';

const response = await fetch('http://127.0.0.1:1234/v1/chat/completions', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    model: 'gemma-4-e4b-it',
    messages: [{ role: 'user', content: 'Create an invoice for Acme Corp: 10 hours consulting at $150/hr and 5 hours design at $100/hr' }],
    tools: [toolDefinition],
  }),
});

const data = await response.json();
const toolCall = data.choices[0].message.tool_calls?.[0];

if (toolCall) {
  const result = await execute(JSON.parse(toolCall.function.arguments));
  console.log(result.textInvoice);
}
```

### Multiple Skills

```js
import { toolDefinition as invoiceTool, execute as runInvoice } from './skills/payments/invoice-generator/index.js';
import { toolDefinition as priceTool, execute as runPrice } from './skills/payments/price-calculator/index.js';
import { toolDefinition as emailTool, execute as runEmail } from './skills/communication/email-composer/index.js';

const tools = [invoiceTool, priceTool, emailTool];

// LM Studio will choose the right tool based on the user's request
const response = await fetch('http://127.0.0.1:1234/v1/chat/completions', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    model: 'your-loaded-model',
    messages: [{ role: 'user', content: 'Your prompt here' }],
    tools,
  }),
});
```

### Using the LM Studio CLI

If you use the embedded LM Studio CLI:

```bash
# List models
lms ls

# Load a model
lms get gemma-4-e4b-it

# Start server
lms server start
```

---

## Recommended Models

| Model | RAM Needed | Tool Calling | Speed |
|---|---|---|---|
| Gemma 4 E4B | ~4GB | ✅ Native | Fast |
| Qwen 3.5 4B | ~3GB | ✅ | Very fast |
| Qwen 3.5 9B | ~6GB | ✅ | Good |
| Gemma 4 26B A4B (Q4) | ~12GB | ✅ Native | Moderate |

---

## Configuration Tips

- **Server port:** Default 1234. Change in Settings → Server if needed
- **Context length:** Set to at least 4096 for tool-calling conversations
- **Temperature:** Use 0.1–0.3 for reliable tool calling (lower = more deterministic)
- **GPU offload:** Max out GPU layers for best speed on Apple Silicon

---

## Resources

- [LM Studio](https://lmstudio.ai)
- [LM Studio Docs](https://lmstudio.ai/docs)
