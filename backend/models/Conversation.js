import mongoose from 'mongoose';

const conversationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    conversationSummary: {
      type: String,
      default: '',
    },
    recentMessages: [
      {
        role: {
          type: String,
          enum: ['user', 'assistant', 'error'],
          required: true,
        },
        text: {
          type: String,
          required: true,
        },
        provider: {
          type: String,
          default: null,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    extractedContext: {
      lastCategory: {
        type: String,
        default: null,
      },
      budget: {
        type: Number,
        default: null,
      },
      brand: {
        type: String,
        default: null,
      },
      keywords: [
        {
          type: String,
        },
      ],
    },
  },
  { timestamps: true }
);

export default mongoose.model('Conversation', conversationSchema);
