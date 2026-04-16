import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { risk_level } = req.query;

  if (!risk_level || typeof risk_level !== 'string') {
    return res.status(400).json({ error: 'Risk level parameter required' });
  }

  if (risk_level.toLowerCase() === 'high') {
    return res.status(200).json({
      urgent: true,
      recommendations: [
        "Schedule immediate family visit",
        "Arrange professional caregiver support",
        "Increase daily check-ins to 2-3x",
        "Consider therapeutic activities"
      ]
    });
  } else if (risk_level.toLowerCase() === 'medium') {
    return res.status(200).json({
      urgent: false,
      recommendations: [
        "Introduce weekly group activities",
        "Confirm contact frequency with family",
        "Track daily mood and energy changes",
        "Schedule regular wellness check-ins"
      ]
    });
  } else {
    return res.status(200).json({
      urgent: false,
      recommendations: [
        "Maintain current care routine",
        "Continue regular social activities",
        "Monitor for any changes in behavior",
        "Keep up with family communications"
      ]
    });
  }
}