import type { VercelRequest, VercelResponse } from '@vercel/node';

// Import your existing modules
import '../../src/config';
import { config } from '../../src/config';
import { ChatService } from '../../src/chat/chat.service';

const chatService = new ChatService();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', config.server.corsOrigin);
  res.setHeader('Access-Control-Allow-Methods', 'DELETE,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { sessionId } = req.query;
    
    if (!sessionId || typeof sessionId !== 'string') {
      return res.status(400).json({ error: 'Session ID is required' });
    }

    chatService.clearSession(sessionId);
    
    res.status(200).json({ 
      success: true, 
      message: 'Session cleared' 
    });
  } catch (error) {
    console.error('Clear session API error:', error);
    res.status(500).json({ 
      error: 'Could not clear session',
      details: process.env.NODE_ENV === "development" ? String(error) : undefined,
    });
  }
}