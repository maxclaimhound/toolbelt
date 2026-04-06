/**
 * AgentSkill: JSON Transformer
 * Transform, filter, flatten, and reshape JSON data structures.
 * No API key required.
 */

export async function execute(input) {
  const { data, operation, field, value, fields, from, to } = input;
  if (!data || !operation) throw new Error('data and operation are required');

  const arr = Array.isArray(data) ? data : [data];

  switch (operation) {
    case 'filter':
      if (!field || value === undefined) throw new Error('filter requires field and value');
      return { result: arr.filter(item => item[field] == value), count: arr.filter(item => item[field] == value).length };

    case 'pick':
      if (!fields?.length) throw new Error('pick requires fields array');
      return { result: arr.map(item => Object.fromEntries(fields.map(f => [f, item[f]]))) };

    case 'omit':
      if (!fields?.length) throw new Error('omit requires fields array');
      return { result: arr.map(item => Object.fromEntries(Object.entries(item).filter(([k]) => !fields.includes(k)))) };

    case 'rename':
      if (!from || !to) throw new Error('rename requires from and to');
      return { result: arr.map(item => { const r = { ...item }; r[to] = r[from]; delete r[from]; return r; }) };

    case 'flatten':
      const flatten = (obj, prefix = '') => {
        return Object.keys(obj).reduce((acc, k) => {
          const key = prefix ? `${prefix}.${k}` : k;
          if (typeof obj[k] === 'object' && obj[k] !== null && !Array.isArray(obj[k])) {
            Object.assign(acc, flatten(obj[k], key));
          } else {
            acc[key] = obj[k];
          }
          return acc;
        }, {});
      };
      return { result: arr.map(flatten) };

    case 'unique':
      if (!field) throw new Error('unique requires field');
      const seen = new Set();
      return { result: arr.filter(item => { const v = item[field]; if (seen.has(v)) return false; seen.add(v); return true; }) };

    case 'sort':
      if (!field) throw new Error('sort requires field');
      const dir = value === 'desc' ? -1 : 1;
      return { result: [...arr].sort((a, b) => (a[field] > b[field] ? 1 : -1) * dir) };

    case 'pluck':
      if (!field) throw new Error('pluck requires field');
      return { result: arr.map(item => item[field]) };

    default:
      throw new Error(`Unknown operation: ${operation}. Supported: filter, pick, omit, rename, flatten, unique, sort, pluck`);
  }
}

export const toolDefinition = {
  type: 'function',
  function: {
    name: 'json_transformer',
    description: 'Transform JSON data: filter, pick fields, omit fields, rename keys, flatten nested objects, deduplicate, sort, or pluck values.',
    parameters: {
      type: 'object',
      properties: {
        data: { description: 'JSON array or object to transform' },
        operation: { type: 'string', enum: ['filter', 'pick', 'omit', 'rename', 'flatten', 'unique', 'sort', 'pluck'] },
        field: { type: 'string', description: 'Field name (for filter/rename/sort/etc.)' },
        value: { description: 'Value to filter by, or sort direction (asc/desc)' },
        fields: { type: 'array', items: { type: 'string' }, description: 'List of fields (for pick/omit)' },
        from: { type: 'string', description: 'Original field name (for rename)' },
        to: { type: 'string', description: 'New field name (for rename)' },
      },
      required: ['data', 'operation'],
    },
  },
};
