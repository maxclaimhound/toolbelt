/**
 * AgentSkill: Slack Message Formatter
 * Format a message for Slack with proper markdown, blocks, and structure.
 * No API key required — returns formatted payload ready for Slack API.
 */

export async function execute(input) {
  const { text, type = 'text', title, fields, color, bullets } = input;
  if (!text && !fields) throw new Error('text or fields is required');

  if (type === 'simple') {
    return { text, blocks: null };
  }

  if (type === 'section') {
    const blocks = [];
    if (title) blocks.push({ type: 'header', text: { type: 'plain_text', text: title } });
    if (text) blocks.push({ type: 'section', text: { type: 'mrkdwn', text } });
    if (bullets?.length) {
      blocks.push({ type: 'section', text: { type: 'mrkdwn', text: bullets.map(b => `• ${b}`).join('\n') } });
    }
    if (fields?.length) {
      blocks.push({
        type: 'section',
        fields: fields.map(f => ({ type: 'mrkdwn', text: `*${f.label}*\n${f.value}` })),
      });
    }
    blocks.push({ type: 'divider' });
    return { blocks, text: text || title || '' };
  }

  if (type === 'alert') {
    const colorMap = { success: '#36a64f', warning: '#f0ad4e', error: '#e74c3c', info: '#3498db' };
    return {
      attachments: [{
        color: colorMap[color] || color || colorMap.info,
        blocks: [
          title ? { type: 'header', text: { type: 'plain_text', text: title } } : null,
          { type: 'section', text: { type: 'mrkdwn', text } },
        ].filter(Boolean),
      }],
      text: title || text,
    };
  }

  return { text, blocks: null };
}

export const toolDefinition = {
  type: 'function',
  function: {
    name: 'slack_message_formatter',
    description: 'Format a message for Slack with proper Block Kit structure. Returns a payload ready for the Slack API.',
    parameters: {
      type: 'object',
      properties: {
        text: { type: 'string', description: 'Main message text (supports Slack markdown)' },
        type: { type: 'string', enum: ['simple', 'section', 'alert'], description: 'Message format type' },
        title: { type: 'string', description: 'Bold header title' },
        fields: { type: 'array', description: 'Key-value fields: [{ label, value }]' },
        bullets: { type: 'array', items: { type: 'string' }, description: 'Bullet point list' },
        color: { type: 'string', enum: ['success', 'warning', 'error', 'info'], description: 'Alert color (for alert type)' },
      },
      required: ['text'],
    },
  },
};
