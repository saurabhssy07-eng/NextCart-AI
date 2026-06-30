export const AI_CONFIG = {
  provider: process.env.AI_PROVIDER || 'gemini',
  model: 'gemini-1.5-flash',
  temperature: 0.2,
  insightsRateLimit: 60, // per minute
  qaRateLimit: 20       // per minute
};
