/**
 * AgentSkill: Availability Checker
 * Check if a time slot is free given a list of existing events.
 * No API key required.
 */

export async function execute(input) {
  const { proposedStart, proposedEnd, events = [], bufferMinutes = 0 } = input;
  if (!proposedStart || !proposedEnd) throw new Error('proposedStart and proposedEnd are required');

  const toMs = (s) => new Date(s).getTime();
  const buffer = bufferMinutes * 60000;

  const pStart = toMs(proposedStart) - buffer;
  const pEnd = toMs(proposedEnd) + buffer;

  const conflicts = events.filter(evt => {
    const eStart = toMs(evt.start);
    const eEnd = toMs(evt.end);
    return eStart < pEnd && eEnd > pStart;
  });

  const available = conflicts.length === 0;

  return {
    available,
    proposedStart,
    proposedEnd,
    conflicts: conflicts.map(e => ({ title: e.title || 'Busy', start: e.start, end: e.end })),
    conflictCount: conflicts.length,
    message: available
      ? 'Time slot is available.'
      : `Conflicts with ${conflicts.length} event(s): ${conflicts.map(e => e.title || 'Busy').join(', ')}`,
  };
}

export const toolDefinition = {
  type: 'function',
  function: {
    name: 'availability_checker',
    description: 'Check if a proposed time slot is free given a list of existing calendar events.',
    parameters: {
      type: 'object',
      properties: {
        proposedStart: { type: 'string', description: 'ISO datetime for proposed start' },
        proposedEnd: { type: 'string', description: 'ISO datetime for proposed end' },
        events: { type: 'array', description: 'Existing events: [{ title, start, end }]' },
        bufferMinutes: { type: 'number', description: 'Buffer time around events in minutes (default 0)' },
      },
      required: ['proposedStart', 'proposedEnd'],
    },
  },
};
