# Google AI Edge Gallery Integration

Connect Toolbelt skills to [Google AI Edge Gallery](https://github.com/nicotrop/ai-edge-gallery) — Google's framework for running AI models directly on mobile devices.

This is how Gemma 4 runs natively on an iPhone or Android device with full tool-use capabilities.

---

## Overview

Google AI Edge Gallery runs models like Gemma 4 E2B directly on device using the Neural Engine (iOS) or GPU (Android). It supports **Agent Skills** — JS tool plugins the model can call. This is exactly what Toolbelt skills are built for.

---

## Using Toolbelt Skills

### Step 1: Choose a Skill

Each Toolbelt skill has:
- `skill.json` — schema definition
- `index.js` — execution logic

### Step 2: Register as an AI Edge Skill

```js
import { execute, toolDefinition } from './skills/maps/google-maps-search/index.js';

// Convert to AI Edge Gallery skill format
const aiEdgeSkill = {
  name: toolDefinition.function.name,
  description: toolDefinition.function.description,
  parameters: toolDefinition.function.parameters,
  execute: async (params) => {
    return await execute(params, {
      GOOGLE_MAPS_API_KEY: 'your-key-here',
    });
  },
};

// Register with the agent
agent.registerSkill(aiEdgeSkill);
```

### Step 3: The Model Calls the Skill

When a user asks "Find coffee shops near me," the on-device Gemma 4 model will:
1. Recognize the intent matches the skill
2. Format the parameters
3. Call the skill's execute function
4. Render the results (map, list, etc.)

---

## Best Skills for Mobile / On-Device

Not all skills make sense on-device. Here are the best fits:

| Skill | Why It Works On-Device |
|---|---|
| google-maps-search | Location-aware, visual output |
| event-creator | Calendar integration, no cloud needed |
| email-composer | Draft locally, send when ready |
| sms-composer | Native to phone use case |
| task-extractor | Process local notes/screenshots |
| price-calculator | Quick math, no API needed |
| csv-parser | Parse local files |

Skills requiring API keys (web-search-adapter, route-planner) need network access but still run the skill logic on-device.

---

## Recommended Models

| Model | Device | RAM |
|---|---|---|
| Gemma 4 E2B | iPhone 15+, Pixel 8+ | ~2GB |
| Gemma 4 E4B | iPad Pro, flagship Android | ~4GB |

---

## Resources

- [Google AI Edge Gallery](https://ai.google.dev/edge)
- [Gemma 4 Model Card](https://ai.google.dev/gemma/docs/core/model_card_4)
- [AI Edge Gallery App (iOS/Android)](https://github.com/nicotrop/ai-edge-gallery)
