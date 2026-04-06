/**
 * AgentSkill: Task Extractor
 * Extracts actionable tasks from unstructured text (meeting notes, emails, etc.)
 * No API key required — uses pattern matching + heuristics.
 */

export async function execute(input) {
  const { text, assignee = null } = input;
  if (!text) throw new Error('text is required');

  // Action verb patterns that signal a task
  const actionPatterns = [
    /\b(need to|needs to|should|must|will|going to|have to|has to|action item|follow up|follow-up|todo|to-do|assign|assigned to|responsible for|take care of|handle|reach out|send|schedule|book|review|check|update|create|build|fix|prepare|draft|finalize|confirm|call|email|meet|discuss)\b/i,
  ];

  const sentences = text
    .replace(/\n+/g, ' ')
    .split(/(?<=[.!?])\s+|(?:\n)/)
    .map(s => s.trim())
    .filter(s => s.length > 10);

  const tasks = [];

  sentences.forEach(sentence => {
    const isTask = actionPatterns.some(p => p.test(sentence));
    if (isTask) {
      // Try to extract who it's assigned to
      const ownerMatch = sentence.match(/\b([A-Z][a-z]+)\s+(will|should|needs? to|is going to|has to)\b/);
      const owner = ownerMatch ? ownerMatch[1] : assignee;

      // Try to find a deadline
      const deadlineMatch = sentence.match(/\b(by|before|due|until|on)\s+([A-Z][a-z]+(?:\s+\d+)?|\d+\/\d+(?:\/\d+)?|tomorrow|next\s+\w+|end of\s+\w+)\b/i);
      const deadline = deadlineMatch ? deadlineMatch[2] : null;

      tasks.push({
        task: sentence.replace(/^[-•*]\s*/, '').trim(),
        assignee: owner || null,
        deadline: deadline || null,
        priority: /urgent|asap|immediately|critical|important/i.test(sentence) ? 'high' : 'normal',
      });
    }
  });

  return {
    tasks,
    count: tasks.length,
    source: text.substring(0, 100) + (text.length > 100 ? '...' : ''),
  };
}

export const toolDefinition = {
  type: 'function',
  function: {
    name: 'task_extractor',
    description: 'Extract actionable tasks from meeting notes, emails, or any unstructured text.',
    parameters: {
      type: 'object',
      properties: {
        text: { type: 'string', description: 'The text to extract tasks from' },
        assignee: { type: 'string', description: 'Default assignee if none found in text' },
      },
      required: ['text'],
    },
  },
};
