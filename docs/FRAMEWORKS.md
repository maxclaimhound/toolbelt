# Using Toolbelt with Different Frameworks

## Google AI Edge Gallery

```js
import { execute, toolDefinition } from './skills/maps/google-maps-search/index.js';

// Register as a skill
const skill = {
  name: toolDefinition.function.name,
  description: toolDefinition.function.description,
  parameters: toolDefinition.function.parameters,
  execute: (params) => execute(params, { GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY }),
};
agent.registerSkill(skill);
```

## LM Studio (OpenAI-compatible API)

```js
import skillDef from './skills/maps/google-maps-search/skill.json' assert { type: 'json' };
import { execute } from './skills/maps/google-maps-search/index.js';

// Pass tool definition in your API call
const response = await fetch('http://localhost:1234/v1/chat/completions', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    model: 'your-model',
    messages: [{ role: 'user', content: 'Find coffee shops near Brooklyn' }],
    tools: [skillDef], // skill.json is OpenAI tool-call compatible
  }),
});

// Handle tool calls in the response
const message = response.choices[0].message;
if (message.tool_calls) {
  for (const call of message.tool_calls) {
    const result = await execute(JSON.parse(call.function.arguments), env);
    // Feed result back into conversation
  }
}
```

## Ollama

Ollama supports OpenAI-compatible tool calling in recent versions:

```js
import { toolDefinition, execute } from './skills/productivity/task-extractor/index.js';

const response = await fetch('http://localhost:11434/api/chat', {
  method: 'POST',
  body: JSON.stringify({
    model: 'llama3.2',
    messages: [{ role: 'user', content: 'Extract tasks from these meeting notes: ...' }],
    tools: [toolDefinition],
  }),
});
```

## Generic OpenAI-Compatible API (Anthropic, Groq, Together, etc.)

Every skill exports a `toolDefinition` in OpenAI function-calling format. Use it directly:

```js
import { toolDefinition, execute } from './skills/payments/invoice-generator/index.js';

// Works with any OpenAI-compatible API
const tools = [toolDefinition];

// When the model returns a tool call, execute it:
const result = await execute(JSON.parse(toolCallArguments));
```

## Anthropic Claude API

Claude uses a slightly different tool format — convert like this:

```js
import { toolDefinition } from './skills/data/csv-parser/index.js';

const claudeTool = {
  name: toolDefinition.function.name,
  description: toolDefinition.function.description,
  input_schema: toolDefinition.function.parameters,
};
```
