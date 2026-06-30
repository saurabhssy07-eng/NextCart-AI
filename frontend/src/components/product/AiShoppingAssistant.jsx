import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Send, Star, AlertTriangle, ShieldCheck, HelpCircle } from 'lucide-react';
import { aiService } from '../../services/api';
import { useAnalytics } from '../../hooks/useAnalytics';
import { toast } from 'react-toastify';

const AiShoppingAssistant = ({ productId, productRating, isAuthenticated }) => {
  const { trackEvent } = useAnalytics();
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isFallback, setIsFallback] = useState(false);

  // Chat Q&A states
  const [question, setQuestion] = useState('');
  const [chatLog, setChatLog] = useState([]);
  const [asking, setAsking] = useState(false);

  const chatEndRef = useRef(null);

  useEffect(() => {
    loadInsights();
    // Track page summary view event
    trackEvent('AI Summary Viewed', { productId });
  }, [productId]);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatLog]);

  const loadInsights = async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await aiService.getProductInsights(productId);
      if (res.success && res.data) {
        setInsights(res.data);
        setIsFallback(res.provider === 'fallback');
        if (res.provider === 'fallback') {
          trackEvent('AI Fallback Used', { productId });
        }
      } else {
        setError(true);
      }
    } catch (err) {
      console.error('Failed to load AI insights:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleAskQuestion = async (textToAsk) => {
    const queryText = textToAsk || question;
    if (!queryText.trim()) return;

    if (!isAuthenticated) {
      toast.error('Please log in to ask the AI assistant questions.');
      return;
    }

    const startTime = Date.now();
    setAsking(true);
    setQuestion('');

    // Add user message to log
    const userMsg = { role: 'user', text: queryText };
    setChatLog((prev) => [...prev, userMsg]);

    trackEvent('AI Question Asked', { productId, prompt: queryText });

    try {
      const res = await aiService.askQuestion(productId, queryText);
      const latency = Date.now() - startTime;

      if (res.success) {
        setChatLog((prev) => [...prev, { role: 'ai', text: res.answer, provider: res.provider }]);
        trackEvent('Gemini Request Success', { productId, latency, provider: res.provider });
      } else {
        setChatLog((prev) => [...prev, { role: 'error', text: 'Sorry, I couldn\'t process that question.' }]);
        trackEvent('Gemini Request Failed', { productId, latency });
      }
    } catch (err) {
      console.error('AI Q&A Error:', err);
      setChatLog((prev) => [...prev, { role: 'error', text: 'Could not connect to AI service. Please try again.' }]);
      trackEvent('Gemini Request Failed', { productId, latency: Date.now() - startTime });
    } finally {
      setAsking(false);
    }
  };

  const suggestedQuestions = [
    'Is this good for gaming?',
    'Is it worth buying?',
    'Battery backup?',
    'Is this good for coding?'
  ];

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/10 dark:to-indigo-900/10 border border-purple-100 dark:border-purple-800/30 rounded-2xl p-8 mb-12 animate-pulse h-96">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-purple-200 dark:bg-purple-800 rounded-lg"></div>
          <div className="h-6 bg-purple-200 dark:bg-purple-800 rounded w-1/3"></div>
        </div>
        <div className="space-y-4">
          <div className="h-4 bg-purple-200 dark:bg-purple-800 rounded w-3/4"></div>
          <div className="h-4 bg-purple-200 dark:bg-purple-800 rounded w-1/2"></div>
          <div className="h-24 bg-purple-200 dark:bg-purple-800 rounded w-full"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 rounded-2xl p-6 mb-12 flex flex-col items-center text-center">
        <AlertTriangle className="w-12 h-12 text-red-500 mb-4" />
        <h4 className="text-red-900 dark:text-red-300 font-bold text-lg">Couldn't generate a response</h4>
        <p className="text-red-700 dark:text-red-400 text-sm mt-1">We ran into an error connecting to our AI server. Please reload to try again.</p>
        <button onClick={loadInsights} className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-semibold transition-colors">
          Retry AI Summary
        </button>
      </div>
    );
  }

  const score = (productRating * 2).toFixed(1);

  return (
    <div className="bg-gradient-to-br from-purple-50 via-white to-indigo-50/50 dark:from-purple-900/20 dark:via-gray-900 dark:to-indigo-900/10 border border-purple-100 dark:border-purple-800/30 rounded-2xl p-6 md:p-8 mb-12 shadow-sm relative overflow-hidden">
      {/* Sparkles background icon */}
      <div className="absolute top-0 right-0 p-8 opacity-5 dark:opacity-10 pointer-events-none">
        <Sparkles className="w-32 h-32 text-purple-600" />
      </div>

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-purple-100 dark:border-purple-900/30">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-purple-600 rounded-xl shadow-md shadow-purple-500/20">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-gray-900 dark:text-purple-100 font-extrabold text-2xl tracking-tight">AI Shopping Assistant</h3>
              {isFallback && (
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-yellow-100 text-yellow-800 border border-yellow-200 uppercase">
                  Fallback Mode
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500 dark:text-purple-300/70 font-medium">Smart shopper summary and real-time context Q&A</p>
          </div>
        </div>

        {/* Overall Score */}
        <div className="bg-white/80 dark:bg-black/30 backdrop-blur px-5 py-2.5 rounded-2xl border border-purple-200 dark:border-purple-800/50 flex flex-col items-center shrink-0 w-32 shadow-sm">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Overall Score</span>
          <div className="flex items-end gap-0.5">
            <span className="text-2xl font-black text-purple-600 dark:text-purple-400 leading-none">{score}</span>
            <span className="text-gray-400 font-medium text-xs">/ 10</span>
          </div>
        </div>
      </div>

      {/* Amazon AI Insights Columns */}
      <div className="space-y-6">
        {/* Quick Summary */}
        <div className="prose dark:prose-invert max-w-none">
          <h4 className="text-sm font-bold text-purple-700 dark:text-purple-400 uppercase tracking-wider mb-2">⭐ Quick Summary</h4>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
            {insights?.summary}
          </p>
        </div>

        {/* Pros & Cons Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
          <div className="bg-white/60 dark:bg-black/20 rounded-2xl p-5 border border-purple-100/50 dark:border-purple-900/20 shadow-sm">
            <h5 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <span className="text-green-500">👍</span> Pros
            </h5>
            <ul className="space-y-2.5 text-sm text-gray-700 dark:text-gray-300">
              {insights?.pros?.map((pro, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 shrink-0" />
                  <span>{pro}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white/60 dark:bg-black/20 rounded-2xl p-5 border border-purple-100/50 dark:border-purple-900/20 shadow-sm">
            <h5 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <span className="text-red-500">👎</span> Cons
            </h5>
            <ul className="space-y-2.5 text-sm text-gray-700 dark:text-gray-300">
              {insights?.cons?.map((con, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 shrink-0" />
                  <span>{con}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Best For & Alternatives */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* Best For */}
          <div className="bg-purple-50/50 dark:bg-purple-950/10 p-5 rounded-2xl border border-purple-100/30 dark:border-purple-900/10">
            <h5 className="font-semibold text-purple-950 dark:text-purple-200 mb-2 flex items-center gap-2">
              <span className="text-purple-600 dark:text-purple-400">🎯</span> Best For
            </h5>
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
              {insights?.bestFor}
            </p>
          </div>

          {/* Alternatives */}
          <div className="bg-purple-50/50 dark:bg-purple-950/10 p-5 rounded-2xl border border-purple-100/30 dark:border-purple-900/10">
            <h5 className="font-semibold text-purple-950 dark:text-purple-200 mb-2 flex items-center gap-2">
              <span className="text-indigo-600 dark:text-indigo-400">🔄</span> Alternatives
            </h5>
            <ul className="space-y-2 text-xs text-gray-700 dark:text-gray-300">
              {insights?.alternatives?.map((alt, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="text-purple-400">•</span>
                  <span>{alt}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Chat / Ask Anything Section */}
        <div className="pt-6 border-t border-purple-100 dark:border-purple-900/30 mt-6">
          <h4 className="text-sm font-bold text-purple-700 dark:text-purple-400 uppercase tracking-wider mb-4 flex items-center gap-1.5">
            <HelpCircle className="w-4 h-4" /> Ask Anything
          </h4>

          {/* Messages Log */}
          {chatLog.length > 0 && (
            <div className="mb-4 space-y-3 max-h-60 overflow-y-auto p-4 bg-gray-50 dark:bg-black/30 border border-gray-100 dark:border-gray-800 rounded-xl">
              {chatLog.map((msg, idx) => {
                const isUser = msg.role === 'user';
                const isError = msg.role === 'error';
                return (
                  <div key={idx} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${
                      isUser 
                        ? 'bg-purple-600 text-white rounded-br-none' 
                        : isError
                        ? 'bg-red-50 text-red-800 border border-red-100 rounded-bl-none dark:bg-red-950/20 dark:border-red-900/30 dark:text-red-300'
                        : 'bg-white text-gray-800 border dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700 rounded-bl-none shadow-sm'
                    }`}>
                      {msg.text}
                      {!isUser && !isError && msg.provider === 'fallback' && (
                        <span className="block text-[9px] text-gray-400 mt-1 uppercase tracking-wider font-bold">
                          Fallback generated
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
              {asking && (
                <div className="flex justify-start">
                  <div className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-2xl rounded-bl-none px-4 py-2.5 shadow-sm text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
                    <span className="w-2 h-2 bg-purple-600 rounded-full animate-bounce duration-500" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-purple-600 rounded-full animate-bounce duration-500" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-purple-600 rounded-full animate-bounce duration-500" style={{ animationDelay: '300ms' }} />
                    <span className="text-xs italic ml-1">Thinking...</span>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>
          )}

          {/* Quick Prompts */}
          <div className="flex flex-wrap gap-2 mb-3">
            {suggestedQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleAskQuestion(q)}
                disabled={asking}
                className="px-3.5 py-1.5 rounded-full border border-purple-200 dark:border-purple-800/60 text-xs text-purple-700 hover:bg-purple-50 dark:text-purple-300 dark:hover:bg-purple-900/20 transition-colors bg-white dark:bg-gray-800 font-medium"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Query input Form */}
          <form 
            onSubmit={(e) => { e.preventDefault(); handleAskQuestion(); }}
            className="flex items-center gap-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-1.5 focus-within:border-purple-500 dark:focus-within:border-purple-500 transition-colors shadow-inner"
          >
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              disabled={asking}
              placeholder="Ask anything about this product (e.g. Is it durable?)"
              className="flex-1 bg-transparent px-4 py-2 outline-none text-sm text-gray-900 dark:text-white placeholder-gray-400"
            />
            <button
              type="submit"
              disabled={asking || !question.trim()}
              className="p-3 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white rounded-lg transition-colors flex items-center justify-center"
              aria-label="Send query"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AiShoppingAssistant;
