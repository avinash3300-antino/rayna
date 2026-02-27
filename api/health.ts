import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  res.status(200).json({
    name: "Rayna Tours Chatbot API",
    version: "1.0.0",
    milestone: 1,
    status: "running",
    timestamp: new Date().toISOString(),
    endpoints: {
      chat:       "POST /api/chat",
      health:     "GET  /api/health",
    },
  });
}