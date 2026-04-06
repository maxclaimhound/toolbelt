/**
 * AgentSkill: Email Composer
 * Composes a professional email given recipient context and bullet points.
 * No API key required — pure logic skill.
 */

export async function execute(input) {
  const { recipient, subject, points, tone = 'professional', senderName = '' } = input;
  if (!recipient || !points) throw new Error('recipient and points are required');

  const toneGuide = {
    professional: { greeting: `Hi ${recipient},`, closing: 'Best regards' },
    friendly: { greeting: `Hey ${recipient}!`, closing: 'Cheers' },
    formal: { greeting: `Dear ${recipient},`, closing: 'Sincerely' },
    brief: { greeting: `Hi ${recipient},`, closing: 'Thanks' },
  };

  const t = toneGuide[tone] || toneGuide.professional;
  const bulletList = Array.isArray(points) ? points : [points];

  // Build body paragraphs from bullet points
  const body = bulletList.length === 1
    ? bulletList[0]
    : bulletList.map(p => `• ${p}`).join('\n');

  const emailBody = `${t.greeting}\n\n${body}\n\n${t.closing}${senderName ? `,\n${senderName}` : ''}`;

  return {
    subject: subject || '(no subject)',
    body: emailBody,
    recipient,
    characterCount: emailBody.length,
    wordCount: emailBody.split(/\s+/).filter(Boolean).length,
  };
}

export const toolDefinition = {
  type: 'function',
  function: {
    name: 'email_composer',
    description: 'Compose a professional email given a recipient name, subject, and key points to cover.',
    parameters: {
      type: 'object',
      properties: {
        recipient: { type: 'string', description: 'Recipient first name or full name' },
        subject: { type: 'string', description: 'Email subject line' },
        points: {
          oneOf: [
            { type: 'string', description: 'Single paragraph or context' },
            { type: 'array', items: { type: 'string' }, description: 'List of key points to cover' },
          ],
        },
        tone: { type: 'string', enum: ['professional', 'friendly', 'formal', 'brief'], description: 'Tone of the email' },
        senderName: { type: 'string', description: 'Your name for the sign-off' },
      },
      required: ['recipient', 'points'],
    },
  },
};
