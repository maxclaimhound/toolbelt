# Home Assistant Integration

Connect Toolbelt skills to [Home Assistant](https://www.home-assistant.io) — the most popular open-source smart home platform. Combined with a local AI model, you can build a voice-controlled smart home that runs entirely on your network.

---

## Overview

Home Assistant supports MCP (Model Context Protocol) and can integrate with local AI agents running via Ollama or LM Studio. Toolbelt skills add capabilities your smart home AI doesn't have natively — web search, email, scheduling, data parsing.

---

## Architecture

```
User → Home Assistant Voice → Local LLM (Ollama/LM Studio)
                                    ↓
                            Toolbelt Skills
                            (maps, calendar, email, etc.)
                                    ↓
                            Home Assistant Actions
                            (lights, thermostat, locks, etc.)
```

---

## Setup

### Step 1: Local LLM Running

Ensure Ollama or LM Studio is running with a tool-calling model:

```bash
ollama pull gemma4:e4b
ollama serve
```

### Step 2: Home Assistant Extended OpenAI Conversation

Install the [Extended OpenAI Conversation](https://github.com/jekalmin/extended_openai_conversation) custom integration in Home Assistant. Point it at your local Ollama or LM Studio endpoint.

**Configuration → Integrations → Add → Extended OpenAI Conversation**

- API Base URL: `http://your-mac-ip:11434/v1` (Ollama) or `http://your-mac-ip:1234/v1` (LM Studio)
- Model: `gemma4:e4b`

### Step 3: Register Toolbelt Skills as Tools

In the integration config, add Toolbelt tool definitions. Each skill's `toolDefinition` export maps directly to the OpenAI function format Home Assistant expects.

---

## Example Use Cases

| Voice Command | Toolbelt Skill Used |
|---|---|
| "Find the nearest pharmacy" | google-maps-search |
| "Email John that I'm running late" | email-composer |
| "Create a calendar event for the plumber tomorrow at 2pm" | event-creator |
| "Is my 3pm slot free?" | availability-checker |
| "How much will 5 hours of HVAC work cost at $85/hr plus tax?" | price-calculator |
| "Parse this CSV file of sensor data" | csv-parser |

---

## Smart Home + AI Skill Combinations

The real power is combining Home Assistant native capabilities with Toolbelt skills:

```
"Turn off the lights, set the alarm, and email Sarah that I've left for the night"
```

This triggers:
1. Home Assistant → lights off, alarm armed
2. Toolbelt email-composer → drafts and formats the email
3. Home Assistant notification → sends the email

---

## Resources

- [Home Assistant](https://www.home-assistant.io)
- [Extended OpenAI Conversation](https://github.com/jekalmin/extended_openai_conversation)
- [Home Assistant Voice](https://www.home-assistant.io/voice_control/)
