import { NextApiRequest, NextApiResponse } from 'next';

interface AssessmentInput {
  meals: string;
  outings: string;
  activities: string;
  interactions: string;
  mood: string;
  moodScore: number;
  socialConnections: string;
  familyContact: string;
  notes: string;
  uclaLoneliness: number;
}

interface AssessmentResult {
  risk: string;
  summary: string;
  recommendations: string[];
  alert?: string;
}

const mockAssessment = (assessment: AssessmentInput): AssessmentResult => {
  const interactions = parseInt(assessment.interactions) || 0;
  const mood_score = assessment.moodScore || 3;

  const ucla_score = assessment.uclaLoneliness;

  // High risk: UCLA score 16-20 OR combination of severe factors
  if (ucla_score >= 16 || (assessment.mood in ["Sad", "Withdrawn"] && (interactions < 3 || mood_score < 2))) {
    return {
      risk: "High",
      summary: `UCLA Loneliness Scale score of ${ucla_score}/20 indicates significant loneliness. Combined with other behavioral indicators, immediate intervention is recommended.`,
      recommendations: [
        "Increase frequency of family or volunteer visits",
        "Arrange for group activities or social programs",
        "Consider counseling or peer support groups",
        "Schedule regular check-ins and meaningful conversations"
      ],
      alert: `🚨 High loneliness alert (UCLA: ${ucla_score}/20). Immediate care attention recommended.`
    };
  }

  // Medium risk: UCLA score 10-15 OR moderate isolation signals
  if (ucla_score >= 10 || assessment.mood == "Neutral" || (interactions < 7 && interactions >= 3)) {
    return {
      risk: "Medium",
      summary: `UCLA Loneliness Scale score of ${ucla_score}/20 suggests moderate loneliness. Consider increasing social engagement and support.`,
      recommendations: [
        "Introduce weekly group activities or hobbies",
        "Increase family contact frequency to 2-3 times weekly",
        "Encourage participation in community events",
        "Track mood patterns and social engagement trends"
      ]
    };
  }

  // Low risk: UCLA score 5-9 AND positive social indicators
  return {
    risk: "Low",
    summary: `UCLA Loneliness Scale score of ${ucla_score}/20 indicates low loneliness. Positive social patterns and engagement are present.`,
    recommendations: [
      "Maintain current social routines and activities",
      "Continue regular family contact and outings",
      "Encourage hobbies and interests that bring joy",
      "Monitor for any changes in mood or social engagement"
    ]
  };
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const assessment: AssessmentInput = req.body;

    // For now, use mock assessment since OpenAI API key isn't configured
    const result = mockAssessment(assessment);

    res.status(200).json(result);
  } catch (error) {
    console.error('Assessment error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}