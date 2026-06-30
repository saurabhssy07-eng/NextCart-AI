import { GoogleGenerativeAI } from '@google/generative-ai';
import { buildInsightsPrompt } from '../prompts/insights.js';
import { buildQAPrompt } from '../prompts/qa.js';
import { systemInstruction } from '../prompts/system.js';
import { buildRecommendPrompt, recommendSystemInstruction } from '../prompts/recommend.js';

class GeminiProvider {
  constructor(apiKey) {
    if (!apiKey) {
      throw new Error('Gemini API Key is required');
    }
    const genAI = new GoogleGenerativeAI(apiKey);
    
    this.model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      systemInstruction: systemInstruction
    });

    this.recommendModel = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      systemInstruction: recommendSystemInstruction
    });
  }

  async generateInsights(context) {
    const prompt = buildInsightsPrompt(context);
    const result = await this.model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: { responseMimeType: 'application/json' }
    });
    
    const responseText = result.response.text();
    return JSON.parse(responseText);
  }

  async answerQuestion(context, question) {
    const prompt = buildQAPrompt(context, question);
    const result = await this.model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }]
    });
    
    return result.response.text().trim();
  }

  async recommendProducts(candidates, query) {
    const prompt = buildRecommendPrompt(candidates, query);
    const result = await this.recommendModel.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: { responseMimeType: 'application/json' }
    });

    const responseText = result.response.text();
    return JSON.parse(responseText);
  }
}

export default GeminiProvider;
