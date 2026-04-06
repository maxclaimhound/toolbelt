/**
 * AgentSkill: Document Classifier
 * Classify a document into one of a provided list of categories using keyword scoring.
 * No API key required.
 */

export async function execute(input) {
  const { text, categories, topN = 3 } = input;
  if (!text || !categories?.length) throw new Error('text and categories are required');

  const words = text.toLowerCase().split(/\W+/).filter(Boolean);
  const wordFreq = {};
  words.forEach(w => { wordFreq[w] = (wordFreq[w] || 0) + 1; });

  const scores = categories.map(cat => {
    const catWords = cat.toLowerCase().split(/\W+/).filter(Boolean);
    let score = 0;
    catWords.forEach(cw => { score += (wordFreq[cw] || 0) * 2; });
    // Bonus if category name appears verbatim in text
    if (text.toLowerCase().includes(cat.toLowerCase())) score += 10;
    return { category: cat, score, confidence: 0 };
  });

  const maxScore = Math.max(...scores.map(s => s.score), 1);
  scores.forEach(s => { s.confidence = Math.round((s.score / maxScore) * 100); });
  scores.sort((a, b) => b.score - a.score);

  return {
    topCategory: scores[0].category,
    confidence: scores[0].confidence,
    rankings: scores.slice(0, topN),
    wordCount: words.length,
  };
}

export const toolDefinition = {
  type: 'function',
  function: {
    name: 'document_classifier',
    description: 'Classify a document into one of a provided list of categories.',
    parameters: {
      type: 'object',
      properties: {
        text: { type: 'string', description: 'Document text to classify' },
        categories: { type: 'array', items: { type: 'string' }, description: 'List of possible categories' },
        topN: { type: 'number', description: 'Number of top matches to return (default 3)' },
      },
      required: ['text', 'categories'],
    },
  },
};
