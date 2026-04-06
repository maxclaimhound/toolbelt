/**
 * AgentSkill: Price Calculator
 * Calculate pricing with discounts, taxes, and totals. No API key required.
 */

export async function execute(input) {
  const { items = [], discountPercent = 0, discountAmount = 0, taxRate = 0, currency = 'USD' } = input;
  if (!items.length) throw new Error('items array is required');

  const fmt = (n) => Number(n).toFixed(2);

  const lineItems = items.map(item => {
    const qty = Number(item.quantity || 1);
    const price = Number(item.price || item.rate || 0);
    return { ...item, quantity: qty, unitPrice: price, lineTotal: qty * price };
  });

  const subtotal = lineItems.reduce((s, i) => s + i.lineTotal, 0);
  const discountValue = discountAmount || (subtotal * discountPercent / 100);
  const afterDiscount = subtotal - discountValue;
  const taxAmount = afterDiscount * (taxRate / 100);
  const total = afterDiscount + taxAmount;

  return {
    lineItems,
    subtotal: Number(fmt(subtotal)),
    discountPercent,
    discountAmount: Number(fmt(discountValue)),
    afterDiscount: Number(fmt(afterDiscount)),
    taxRate,
    taxAmount: Number(fmt(taxAmount)),
    total: Number(fmt(total)),
    currency,
    summary: `Subtotal: $${fmt(subtotal)} | Discount: -$${fmt(discountValue)} | Tax: $${fmt(taxAmount)} | Total: $${fmt(total)}`,
  };
}

export const toolDefinition = {
  type: 'function',
  function: {
    name: 'price_calculator',
    description: 'Calculate pricing with line items, discounts, and taxes.',
    parameters: {
      type: 'object',
      properties: {
        items: { type: 'array', description: 'Line items: [{ name, quantity, price }]' },
        discountPercent: { type: 'number', description: 'Discount as percentage' },
        discountAmount: { type: 'number', description: 'Flat discount amount' },
        taxRate: { type: 'number', description: 'Tax percentage' },
        currency: { type: 'string', description: 'Currency code' },
      },
      required: ['items'],
    },
  },
};
