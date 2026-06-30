import GeminiProvider from './geminiProvider.js';
import FallbackProvider from './fallbackProvider.js';

class ProviderFactory {
  getProvider(providerName = 'gemini') {
    const apiKey = process.env.GEMINI_API_KEY;

    if (providerName === 'gemini' && apiKey) {
      try {
        console.log('✨ AI Service: Initializing Google Gemini Model');
        return new GeminiProvider(apiKey);
      } catch (err) {
        console.error('❌ AI Service: Gemini initialization failed, falling back', err);
      }
    }

    console.log('🛡️ AI Service: Initializing Fallback Rule Engine');
    return new FallbackProvider();
  }
}

export default new ProviderFactory();
