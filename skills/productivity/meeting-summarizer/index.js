/**
 * AgentSkill: Meeting Summarizer
 * Summarizes a meeting transcript into attendees, decisions, action items, and next steps.
 * No API key required — uses pattern matching and heuristics.
 */

export async function execute(input) {
  const { transcript, title = 'Meeting' } = input;
  if (!transcript) throw new Error('transcript is required');

  const lines = transcript.split(/\n/).map(l => l.trim()).filter(Boolean);

  // Extract attendees (lines like "John: ..." or "[John]" or "John said")
  const attendeeSet = new Set();
  lines.forEach(line => {
    const m = line.match(/^([A-Z][a-zA-Z\s]{1,30}):\s/);
    if (m) attendeeSet.add(m[1].trim());
  });

  // Extract decisions (lines with decision keywords)
  const decisions = lines.filter(l =>
    /\b(decided|agreed|confirmed|approved|resolved|conclusion|we will|we are going to)\b/i.test(l)
  ).map(l => l.replace(/^[^:]+:\s*/, '').trim());

  // Extract action items
  const actionItems = lines.filter(l =>
    /\b(action item|will|needs? to|going to|assigned to|follow up|todo|take care of)\b/i.test(l)
  ).map(l => l.replace(/^[^:]+:\s*/, '').trim());

  // Extract next steps / next meeting
  const nextSteps = lines.filter(l =>
    /\b(next step|next meeting|follow.?up|by end of|deadline|due date|schedule)\b/i.test(l)
  ).map(l => l.replace(/^[^:]+:\s*/, '').trim());

  // Build summary paragraph
  const summaryLines = [];
  if (attendeeSet.size) summaryLines.push(`${Array.from(attendeeSet).join(', ')} attended.`);
  if (decisions.length) summaryLines.push(`Key decisions: ${decisions.slice(0,3).join('; ')}.`);
  if (actionItems.length) summaryLines.push(`${actionItems.length} action item(s) identified.`);

  return {
    title,
    attendees: Array.from(attendeeSet),
    decisions: decisions.slice(0, 10),
    actionItems: actionItems.slice(0, 10),
    nextSteps: nextSteps.slice(0, 5),
    summary: summaryLines.join(' ') || 'Meeting transcript processed.',
    lineCount: lines.length,
  };
}

export const toolDefinition = {
  type: 'function',
  function: {
    name: 'meeting_summarizer',
    description: 'Summarize a meeting transcript into attendees, decisions, action items, and next steps.',
    parameters: {
      type: 'object',
      properties: {
        transcript: { type: 'string', description: 'Full meeting transcript text' },
        title: { type: 'string', description: 'Meeting title (optional)' },
      },
      required: ['transcript'],
    },
  },
};
