/**
 * AgentSkill: Your Skill Name
 * Brief description of what this skill does.
 * 
 * Requirements: none / SOME_API_KEY
 */

/**
 * Execute the skill
 * @param {Object} input - Input parameters as defined in skill.json
 * @param {Object} env - Environment variables / API keys
 * @returns {Object} - Output as defined in skill.json
 */
export async function execute(input, env = {}) {
  const { exampleParam } = input;

  // Validate required inputs
  if (!exampleParam) throw new Error('exampleParam is required');

  // Your skill logic here
  const result = `Processed: ${exampleParam}`;

  return { result };
}

/**
 * OpenAI / LM Studio / Ollama tool definition
 * This is used by AI frameworks to understand how to call this skill.
 */
export const toolDefinition = {
  type: 'function',
  function: {
    name: 'your_skill_slug', // Use underscores, match skill.json id
    description: 'One sentence description for the AI model to understand when to use this skill.',
    parameters: {
      type: 'object',
      properties: {
        exampleParam: {
          type: 'string',
          description: 'What this parameter is and how to fill it',
        },
      },
      required: ['exampleParam'],
    },
  },
};
