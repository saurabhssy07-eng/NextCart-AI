export const buildRecommendPrompt = (candidates, query) => {
  const formattedCandidates = candidates.map((item, idx) => {
    return `Candidate Index: ${idx}
Name: ${item.product.name}
Brand: ${item.product.brand}
Price: ₹${(item.product.discountPrice || item.product.price).toLocaleString('en-IN')}
Rating: ${item.product.averageRating || 0}/5
Specifications: ${JSON.stringify(item.product.specifications || {})}
Description: ${item.product.description || ''}
Match Score (pre-calculated): ${item.matchScore}%
Breakdown: ${JSON.stringify(item.scoreBreakdown)}
---`;
  }).join('\n');

  return `You are a conversational product recommendation engine. Rank and explain the candidate products based on the user's query: "${query}".

Here are the candidate products from our database (with their pre-calculated relevance scores):
${formattedCandidates}

Instructions:
1. You MUST rank and explain ONLY the provided products using their Candidate Index.
2. Select up to 4 best matches. If no candidates are good matches, return an empty array for "rankings" and provide alternative suggestions (e.g., suggesting a budget increase, or looking at other brands).
3. Do not invent or hallucinate specifications. If information is unavailable, explicitly state it is not available.
4. For each selected candidate, calculate a finalized matchScore (out of 100) and compile exactly 2-3 specific bullet reasoning points explaining why they match the user's query.
5. Set confidence level to "high", "medium", or "low".

Your response must be a valid JSON object matching this structure EXACTLY:
{
  "summary": "A friendly conversational summary introducing the options.",
  "confidence": "high",
  "rankings": [
    {
      "index": 0,
      "matchScore": 95,
      "reasons": [
        "Fits your target price range.",
        "Contains an Intel Core i7 specs configuration as requested."
      ]
    }
  ],
  "suggestions": [
    "Increase budget by ₹5,000 for better graphics options."
  ]
}

Ensure your response is valid JSON. Do not wrap it in markdown code blocks like \`\`\`json. Return only the raw JSON.`;
};
export const recommendSystemInstruction = `You are an expert conversational shopping assistant. Rank database products factually, and do not make up specifications. If details are not available, say so.`;
