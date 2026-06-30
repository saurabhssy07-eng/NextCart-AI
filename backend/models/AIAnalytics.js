import mongoose from 'mongoose';

const aiAnalyticsSchema = new mongoose.Schema(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Conversation',
      required: true,
    },
    query: {
      type: String,
      required: true,
    },
    provider: {
      type: String,
      required: true,
    },
    timings: {
      intentParsing: { type: Number, default: 0 },
      mongoQuery: { type: Number, default: 0 },
      relevanceEngine: { type: Number, default: 0 },
      gemini: { type: Number, default: 0 },
      formatting: { type: Number, default: 0 },
    },
    latency: {
      type: Number,
      required: true,
    },
    cacheHit: {
      type: Boolean,
      default: false,
    },
    candidateCount: {
      type: Number,
      default: 0,
    },
    resultCount: {
      type: Number,
      default: 0,
    },
    confidence: {
      type: String,
      enum: ['high', 'medium', 'low'],
      default: 'medium',
    },
    fallbackUsed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model('AIAnalytics', aiAnalyticsSchema);
