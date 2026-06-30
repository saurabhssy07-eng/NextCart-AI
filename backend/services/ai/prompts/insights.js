export const buildInsightsPrompt = (context) => {
  return `Generate product insights based on the provided product context.

Analyze the product details, reviews, and related products provided in the context below. For the "alternatives" field, you MUST select from the "relatedProducts" list provided in the context and explain why they are good alternatives (e.g., comparing their prices, reviews, or specifications).

Your response must be a valid JSON object matching this structure EXACTLY:
{
  "summary": "A 2-3 sentence overview of the product's main features and key value proposition in simple language.",
  "pros": [
    "Pro 1 (based on specifications/reviews)",
    "Pro 2",
    "Pro 3"
  ],
  "cons": [
    "Con 1 (limitations or complaints from reviews)",
    "Con 2"
  ],
  "bestFor": "Brief target audience description and why.",
  "alternatives": [
    "Comparison explaining why Product A (selected from relatedProducts) is an alternative",
    "Comparison explaining why Product B (selected from relatedProducts) is an alternative"
  ]
}

Product Context:
${JSON.stringify(context, null, 2)}

Ensure your response is valid JSON. Do not wrap it in markdown code blocks or add any additional commentary. Return only the raw JSON.`;
};
