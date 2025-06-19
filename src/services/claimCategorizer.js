export class ClaimCategorizer {
  constructor(openAIClient) {
    this.client = openAIClient;
  }

  async categorizeAndPrioritize(claimData, fraudAssessment) {
    const prompt = `
As a claims processing manager, categorize and prioritize this claim based on the information and fraud assessment:

Claim Data:
${JSON.stringify(claimData, null, 2)}

Fraud Assessment:
${JSON.stringify(fraudAssessment, null, 2)}

Provide categorization and prioritization in this JSON format:
{
  "category": {
    "primary": "auto_collision|auto_comprehensive|health_medical|health_dental|property_damage|property_theft|life|other",
    "secondary": "specific subcategory",
    "complexity": "simple|standard|complex|exceptional"
  },
  "priority": {
    "level": "urgent|high|normal|low",
    "score": 1-10,
    "reasoning": "explanation for priority assignment"
  },
  "routing": {
    "department": "auto_claims|health_claims|property_claims|special_investigations|fraud_unit",
    "assignmentType": "automated|junior_adjuster|senior_adjuster|specialist|investigation_team",
    "estimatedHandlingTime": "1-2 hours|1-2 days|3-5 days|1-2 weeks|extended_investigation"
  },
  "processignRecommendations": [
    "specific recommendations for processing this claim"
  ],
  "nextSteps": [
    "immediate actions required"
  ]
}
`;

    try {
      const response = await this.client.chatCompletion([
        { role: 'system', content: 'You are an experienced claims manager who excels at efficient claim routing and prioritization.' },
        { role: 'user', content: prompt }
      ]);

      return {
        success: true,
        categorization: JSON.parse(response.choices[0].message.content)
      };
    } catch (error) {
      console.error('Categorization failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}