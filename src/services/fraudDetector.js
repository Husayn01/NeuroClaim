export class FraudDetector {
  constructor(openAIClient) {
    this.client = openAIClient;
  }

  async assessFraudRisk(claimData, additionalContext = '') {
    const prompt = `
You are an expert insurance fraud analyst. Analyze the following claim for potential fraud indicators:

Claim Information:
${JSON.stringify(claimData, null, 2)}

Additional Context:
${additionalContext}

Provide a fraud risk assessment in the following JSON format:
{
  "riskLevel": "low|medium|high|critical",
  "riskScore": 0-100,
  "fraudIndicators": [
    {
      "indicator": "description of suspicious element",
      "weight": "low|medium|high",
      "explanation": "why this is concerning"
    }
  ],
  "legitimacyIndicators": [
    {
      "indicator": "description of legitimate element",
      "explanation": "why this supports legitimacy"
    }
  ],
  "recommendedActions": [
    "immediate approval|standard processing|additional verification|investigation|rejection"
  ],
  "investigationAreas": ["areas that need further investigation"],
  "overallAssessment": "detailed explanation of the fraud risk assessment",
  "confidence": "high|medium|low"
}

Consider factors like:
- Timing patterns
- Claim amounts vs typical patterns
- Documentation quality
- Incident circumstances
- Claimant history indicators
- Geographic factors
`;

    try {
      const response = await this.client.chatCompletion([
        { role: 'system', content: 'You are a meticulous fraud detection specialist with years of experience identifying suspicious patterns in insurance claims.' },
        { role: 'user', content: prompt }
      ]);

      return {
        success: true,
        assessment: JSON.parse(response.choices[0].message.content),
        analyzedAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('Fraud assessment failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}