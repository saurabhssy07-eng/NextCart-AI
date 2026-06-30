export const buildQAPrompt = (context, question) => {
  return `Answer the following user question about the product.

Instructions:
1. Answer using ONLY the supplied product data (specifications, description, reviews, variants).
2. If the answer is not present or cannot be inferred from the context, reply exactly: "I don't have enough information to answer this question."
3. Be concise and direct. Keep your answer under 3-4 sentences.
4. Do not speculate or make up features that are not explicitly stated.

Product Context:
${JSON.stringify(context, null, 2)}

User Question:
${question}

Answer:`;
};
