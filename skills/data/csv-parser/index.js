/**
 * AgentSkill: CSV Parser
 * Parses CSV text into a structured JSON array. No API key required.
 */

export async function execute(input) {
  const { csv, delimiter = ',', hasHeader = true } = input;
  if (!csv) throw new Error('csv is required');

  const lines = csv.trim().split(/\r?\n/).filter(l => l.trim());
  if (!lines.length) return { rows: [], headers: [], count: 0 };

  const parse = (line) => {
    const result = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') {
        if (inQuotes && line[i + 1] === '"') { current += '"'; i++; }
        else inQuotes = !inQuotes;
      } else if (ch === delimiter && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += ch;
      }
    }
    result.push(current.trim());
    return result;
  };

  const headers = hasHeader ? parse(lines[0]) : lines[0].split(delimiter).map((_, i) => `col${i}`);
  const dataLines = hasHeader ? lines.slice(1) : lines;

  const rows = dataLines.map(line => {
    const values = parse(line);
    const row = {};
    headers.forEach((h, i) => { row[h] = values[i] ?? ''; });
    return row;
  });

  return { rows, headers, count: rows.length };
}

export const toolDefinition = {
  type: 'function',
  function: {
    name: 'csv_parser',
    description: 'Parse CSV text into a structured JSON array of objects.',
    parameters: {
      type: 'object',
      properties: {
        csv: { type: 'string', description: 'Raw CSV text to parse' },
        delimiter: { type: 'string', description: 'Column delimiter (default: comma)' },
        hasHeader: { type: 'boolean', description: 'Whether first row is a header (default: true)' },
      },
      required: ['csv'],
    },
  },
};
