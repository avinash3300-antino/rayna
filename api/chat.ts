import type { VercelRequest, VercelResponse } from '@vercel/node';
import { v4 as uuid } from 'uuid';

// Import your existing modules
import '../src/config';
import { config } from '../src/config';
import { ChatService } from '../src/chat/chat.service';
import { ChatRequestSchema } from '../src/chat/dto/chat.dto';
import type { ChatResponse, ErrorResponse } from '../src/chat/dto/chat.dto';

const chatService = new ChatService();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', config.server.corsOrigin);
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const parsed = ChatRequestSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        error: "Invalid request",
        details: parsed.error.errors.map((e) => e.message).join(", "),
      });
    }

    const { message, session_id } = parsed.data;
    const sessionId = session_id ?? uuid();

    const { reply, tourCarousel, metadata } = await chatService.chat(sessionId, message);
    
    const response: ChatResponse = {
      message: reply,
      session_id: sessionId,
      tourCarousel,
      metadata
    };
    
    res.status(200).json(response);
  } catch (error) {
    console.error('Chat API error:', error);
    const errorResponse: ErrorResponse = {
      error: "Something went wrong. Please try again.",
      details: process.env.NODE_ENV === "development" ? String(error) : undefined,
    };
    res.status(500).json(errorResponse);
  }
}