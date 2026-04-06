# AgentSkill Schema v1.0

Every skill is a self-contained JSON module with an optional JS execution file.

## skill.json

```json
{
  "id": "string",              // unique slug e.g. "google-maps-search"
  "name": "string",           // human name e.g. "Google Maps Search"
  "version": "string",        // semver e.g. "1.0.0"
  "description": "string",    // what it does
  "author": "string",
  "license": "string",        // e.g. "MIT"
  "tier": "free | pro",
  "frameworks": ["string"],   // e.g. ["google-ai-edge", "lmstudio", "ollama", "generic"]
  "input": {
    "type": "object",
    "properties": {}          // JSON Schema for input params
  },
  "output": {
    "type": "object",
    "properties": {}          // JSON Schema for output
  },
  "execution": {
    "type": "js | python | http",
    "file": "string"          // path to execution file
  },
  "ui": {
    "renderer": "map | chart | table | markdown | html | none",
    "file": "string"          // optional UI template
  },
  "tags": ["string"]
}
```

## Compatibility

Skills are designed to be framework-agnostic. The schema maps to:
- Google AI Edge Gallery: JS skill format
- LM Studio: tool-call format
- Ollama: function calling format
- Generic: any OpenAI-compatible tool-calling API
