/**
 * AgentSkill: Event Creator
 * Creates a calendar event and returns it in iCal format + structured JSON.
 * No API key required.
 */

export async function execute(input) {
  const { title, startDate, startTime, endDate, endTime, location = '', description = '', organizer = '' } = input;
  if (!title || !startDate) throw new Error('title and startDate are required');

  const parseDateTime = (date, time = '00:00') => {
    const dt = new Date(`${date}T${time}:00`);
    return isNaN(dt.getTime()) ? null : dt;
  };

  const start = parseDateTime(startDate, startTime);
  if (!start) throw new Error('Invalid startDate/startTime');
  const end = endDate ? parseDateTime(endDate, endTime || startTime) : new Date(start.getTime() + 60 * 60 * 1000);

  const formatIcal = (dt) => dt.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  const uid = `${Date.now()}-${Math.random().toString(36).slice(2)}@toolbelt`;

  const ical = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Toolbelt//EventCreator//EN',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `SUMMARY:${title}`,
    `DTSTART:${formatIcal(start)}`,
    `DTEND:${formatIcal(end)}`,
    location ? `LOCATION:${location}` : '',
    description ? `DESCRIPTION:${description}` : '',
    organizer ? `ORGANIZER:mailto:${organizer}` : '',
    `DTSTAMP:${formatIcal(new Date())}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].filter(Boolean).join('\r\n');

  return {
    uid,
    title,
    start: start.toISOString(),
    end: end.toISOString(),
    location,
    description,
    ical,
    duration: Math.round((end - start) / 60000) + ' minutes',
  };
}

export const toolDefinition = {
  type: 'function',
  function: {
    name: 'event_creator',
    description: 'Create a calendar event and return it in iCal format for any calendar app.',
    parameters: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        startDate: { type: 'string', description: 'YYYY-MM-DD' },
        startTime: { type: 'string', description: 'HH:MM (24h)' },
        endDate: { type: 'string', description: 'YYYY-MM-DD (defaults to startDate)' },
        endTime: { type: 'string', description: 'HH:MM (24h, defaults to +1 hour)' },
        location: { type: 'string' },
        description: { type: 'string' },
        organizer: { type: 'string', description: 'Organizer email' },
      },
      required: ['title', 'startDate'],
    },
  },
};
