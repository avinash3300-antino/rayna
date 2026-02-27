import type { VercelRequest, VercelResponse } from '@vercel/node';

// Import your existing modules
import '../../src/config';
import { config } from '../../src/config';
import { ChatService } from '../../src/chat/chat.service';
import { HistoryRequestSchema } from '../../src/chat/dto/chat.dto';
import type { HistoryResponse, ErrorResponse, HistoryMessage } from '../../src/chat/dto/chat.dto';

const chatService = new ChatService();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', config.server.corsOrigin);
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { sessionId } = req.query;
    
    if (!sessionId || typeof sessionId !== 'string') {
      return res.status(400).json({ error: 'Session ID is required' });
    }

    const { limit } = HistoryRequestSchema.parse({
      limit: req.query.limit ? parseInt(req.query.limit as string) : 10,
    });

    // Map messages to enforce "user" | "assistant" role type
    const messages: HistoryMessage[] = chatService.getHistory(sessionId, limit).map((msg) => ({
      role: msg.role === "user" ? "user" : "assistant",
      content: msg.content,
    }));

    const response: HistoryResponse = {
      session_id: sessionId,
      messages
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('History API error:', error);
    const errorResponse: ErrorResponse = {
      error: "Could not load chat history.",
      details: process.env.NODE_ENV === "development" ? String(error) : undefined,
    };
    res.status(500).json(errorResponse);
  }
}