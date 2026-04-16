import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Mock trend data
  const trendsData = {
    weeklyData: [
      { day: "Mon", riskScore: 35, interactions: 5, mood: 3 },
      { day: "Tue", riskScore: 42, interactions: 4, mood: 2 },
      { day: "Wed", riskScore: 55, interactions: 3, mood: 2 },
      { day: "Thu", riskScore: 68, interactions: 2, mood: 1 },
      { day: "Fri", riskScore: 72, interactions: 2, mood: 1 },
      { day: "Sat", riskScore: 65, interactions: 3, mood: 2 },
      { day: "Sun", riskScore: 78, interactions: 1, mood: 1 },
    ]
  };

  res.status(200).json(trendsData);
}