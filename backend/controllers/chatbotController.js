import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

// Helper function to get API key and detect provider
function getApiConfig() {
  const rawKey = process.env.XAI_API_KEY || process.env.GROK_API_KEY || process.env.GROQ_API_KEY || process.env.OPENAI_API_KEY;
  const apiKey = typeof rawKey === 'string' ? rawKey.trim() : rawKey;

  if (!apiKey) {
    return { apiKey: null, isGroq: false, isXAI: false, isOpenAI: false };
  }

  // Detect provider based on explicit env vars or key prefix
  const isGroq = Boolean(process.env.GROQ_API_KEY) || (typeof apiKey === 'string' && apiKey.startsWith('gsk_'));
  const isXAI = Boolean(process.env.XAI_API_KEY || process.env.GROK_API_KEY) && !isGroq;
  const isOpenAI = !isGroq && !isXAI;

  return { apiKey, isGroq, isXAI, isOpenAI };
}

// Get config and log fingerprint
const config = getApiConfig();
try {
  const mask = (k) => (k && k.length >= 8 ? `${k.slice(0,2)}***${k.slice(-2)} (len:${k.length})` : '<none>');
  if (process.env.NODE_ENV !== 'production') {
    console.log('[xAI/OpenAI] API key fingerprint:', mask(config.apiKey));
  }
} catch (_) {}

// Create OpenAI client only if API key exists
let openai = null;
if (config.apiKey) {
  openai = new OpenAI({
    apiKey: config.apiKey,
    ...(config.isXAI ? { baseURL: 'https://api.x.ai/v1' } : {}),
    ...(config.isGroq ? { baseURL: 'https://api.groq.com/openai/v1' } : {}),
  });
}

export const chatWithBot = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || message.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Message is required'
      });
    }

    if (!openai || !config.apiKey) {
      return res.status(500).json({
        success: false,
        message: 'AI API key not configured. Please set XAI_API_KEY, GROQ_API_KEY, or OPENAI_API_KEY in your .env file.'
      });
    }

    // Create a legal-focused system prompt
    const systemPrompt = `You are a helpful legal assistant for LawSphere, a legal services platform. You help users with:

1. General legal questions and guidance
2. Information about legal services offered
3. How to find and book lawyers
4. Legal document assistance
5. Court procedures and legal processes
6. Legal rights and responsibilities

Guidelines:
- Provide helpful, accurate legal information
- Always recommend consulting with a qualified lawyer for specific legal matters
- Be professional and empathetic
- Keep responses concise but informative
- If you don't know something, admit it and suggest consulting a lawyer
- Focus on Pakistani law when relevant
- Be encouraging about using LawSphere's services

Remember: You are not providing legal advice, just general legal information and guidance.`;

    const completion = await openai.chat.completions.create({
      model: (
        config.isXAI
          ? (process.env.XAI_MODEL || process.env.GROK_MODEL || "grok-2-latest")
          : config.isGroq
            ? (process.env.GROQ_MODEL || "llama-3.3-70b-versatile")
            : (process.env.OPENAI_MODEL || "gpt-4o-mini")
      ),
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: message
        }
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    const botResponse = completion.choices[0]?.message?.content || 'Sorry, I could not process your request at the moment.';

    res.json({
      success: true,
      response: botResponse,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    // Log detailed error diagnostics to help troubleshoot
    try {
      const status = error?.status || error?.code;
      const message = error?.message;
      const body = error?.response?.data || error?.error || error?.body;
      console.error('Chatbot error:', { status, message, body });
    } catch (_) {
      console.error('Chatbot error (raw):', error);
    }
    
    // Handle specific Grok API errors
    if (error.code === 'insufficient_quota' || error.status === 402) {
      return res.status(402).json({
        success: false,
        message: 'Grok API insufficient balance. Please add credits to your account.'
      });
    }
    
    if (error.code === 'invalid_api_key' || error.status === 401) {
      return res.status(401).json({
        success: false,
        message: 'Grok API key is invalid.'
      });
    }
    
    if (error.code === 'rate_limit_exceeded' || error.status === 429) {
      return res.status(429).json({
        success: false,
        message: 'Rate limit exceeded. Please try again later.'
      });
    }

    const fallbackMsg = error?.response?.data?.error?.message || error?.message;
    res.status(500).json({
      success: false,
      message: fallbackMsg || 'Sorry, I encountered an error while processing your request. Please try again.'
    });
  }
};

export const getChatHistory = async (req, res) => {
  try {
    // For now, return empty history. In a real app, you'd store chat history in database
    res.json({
      success: true,
      history: []
    });
  } catch (error) {
    console.error('Get chat history error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve chat history'
    });
  }
};

