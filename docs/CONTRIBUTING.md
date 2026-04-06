# Contributing to AgentSkills

Thanks for wanting to add a skill. Here's how.

## Quick Start

1. Fork the repo
2. Copy `templates/skill-template/` to `skills/<category>/<your-skill-slug>/`
3. Fill in `skill.json`, `index.js`, and `README.md`
4. Test your skill locally
5. Submit a pull request

## Skill Requirements

### skill.json
- Must follow the [schema](../SCHEMA.md)
- `id` must be unique and match the folder name
- `tier` must be `free` for community submissions
- List all required API keys in `requirements.apiKeys`

### index.js
- Must export an `execute(input, env)` async function
- Must export a `toolDefinition` object (OpenAI tool-calling format)
- Real working code only — no stubs
- Handle errors gracefully with clear messages
- No external npm dependencies (use fetch, native JS only)

### README.md
- What the skill does
- Input parameters with types and descriptions
- Output structure with examples
- Example call
- Any API keys required and where to get them

## Categories

Pick the closest existing category or propose a new one:
- `maps` — location, routing, geocoding
- `calendar` — events, scheduling, availability
- `communication` — email, SMS, chat
- `data` — parsing, transformation, scraping
- `productivity` — summarization, extraction, classification
- `payments` — invoicing, pricing, billing
- `search` — web search, knowledge lookup

## What Gets Accepted

✅ Real, working code
✅ No external dependencies
✅ Clear, useful purpose
✅ Handles edge cases
✅ Well-documented

❌ Stubs or placeholder code
❌ npm dependencies (except built-in Node/browser APIs)
❌ Skills that require paid APIs with no free tier
❌ Duplicate functionality without meaningful improvement

## Code Style

- ES Modules (`export`, `import`)
- Async/await
- Descriptive variable names
- Comments on non-obvious logic
- Error messages that tell the user what to fix
