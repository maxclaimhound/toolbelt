/**
 * AgentSkill: Invoice Generator
 * Generates a professional invoice as structured JSON and plain text.
 * No API key required.
 */

export async function execute(input) {
  const {
    invoiceNumber = `INV-${Date.now()}`,
    issueDate = new Date().toISOString().split('T')[0],
    dueDate,
    seller,
    client,
    items = [],
    taxRate = 0,
    currency = 'USD',
    notes = '',
  } = input;

  if (!client || !items.length) throw new Error('client and items are required');

  const fmt = (n) => Number(n).toLocaleString('en-US', { style: 'currency', currency });

  const lineItems = items.map(item => {
    const quantity = Number(item.quantity || 1);
    const rate = Number(item.rate || 0);
    const subtotal = quantity * rate;
    return { ...item, quantity, rate, subtotal };
  });

  const subtotal = lineItems.reduce((s, i) => s + i.subtotal, 0);
  const taxAmount = subtotal * (taxRate / 100);
  const total = subtotal + taxAmount;

  const dueDateStr = dueDate || (() => {
    const d = new Date(issueDate);
    d.setDate(d.getDate() + 30);
    return d.toISOString().split('T')[0];
  })();

  // Plain text version
  const separator = '─'.repeat(50);
  const textInvoice = [
    `INVOICE ${invoiceNumber}`,
    separator,
    seller ? `From: ${seller.name}\n      ${seller.email || ''}\n      ${seller.address || ''}` : '',
    `To:   ${client.name}\n      ${client.email || ''}\n      ${client.address || ''}`,
    `Issue Date: ${issueDate}   Due: ${dueDateStr}`,
    separator,
    'ITEMS:',
    ...lineItems.map(i => `  ${i.description.padEnd(30)} ${String(i.quantity).padStart(4)} x ${fmt(i.rate).padStart(10)} = ${fmt(i.subtotal).padStart(12)}`),
    separator,
    `${'Subtotal:'.padEnd(46)}${fmt(subtotal).padStart(12)}`,
    taxRate ? `${'Tax (' + taxRate + '%):'.padEnd(46)}${fmt(taxAmount).padStart(12)}` : '',
    `${'TOTAL:'.padEnd(46)}${fmt(total).padStart(12)}`,
    separator,
    notes ? `Notes: ${notes}` : '',
  ].filter(Boolean).join('\n');

  return {
    invoiceNumber,
    issueDate,
    dueDate: dueDateStr,
    seller,
    client,
    lineItems,
    subtotal,
    taxRate,
    taxAmount,
    total,
    currency,
    notes,
    textInvoice,
  };
}

export const toolDefinition = {
  type: 'function',
  function: {
    name: 'invoice_generator',
    description: 'Generate a professional invoice with line items, tax, and totals.',
    parameters: {
      type: 'object',
      properties: {
        client: { type: 'object', description: 'Client info: { name, email, address }' },
        items: { type: 'array', description: 'Line items: [{ description, quantity, rate }]' },
        seller: { type: 'object', description: 'Your info: { name, email, address }' },
        taxRate: { type: 'number', description: 'Tax percentage (default 0)' },
        currency: { type: 'string', description: 'Currency code (default USD)' },
        notes: { type: 'string', description: 'Additional notes' },
        invoiceNumber: { type: 'string' },
        issueDate: { type: 'string' },
        dueDate: { type: 'string' },
      },
      required: ['client', 'items'],
    },
  },
};
