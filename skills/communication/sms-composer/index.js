/**
 * AgentSkill: SMS Composer
 * Composes a concise SMS message. No API key required.
 */

export async function execute(input) {
  const { recipient, context, maxLength = 160, includeEmoji = false } = input;
  if (!context) throw new Error('context is required');

  // Trim to SMS limits
  const name = recipient ? `${recipient}, ` : '';
  let message = `${name}${context}`;

  if (message.length > maxLength) {
    message = message.substring(0, maxLength - 3) + '...';
  }

  return {
    message,
    characterCount: message.length,
    isWithinLimit: message.length <= 160,
    segments: Math.ceil(message.length / 160),
  };
}

export const toolDefinition = {
  type: 'function',
  function: {
    name: 'sms_composer',
    description: 'Compose a concise SMS message within character limits.',
    parameters: {
      type: 'object',
      properties: {
        recipient: { type: 'string', description: 'Recipient first name (optional)' },
        context: { type: 'string', description: 'What the message should say' },
        maxLength: { type: 'number', description: 'Max characters (default 160)' },
      },
      required: ['context'],
    },
  },
};
