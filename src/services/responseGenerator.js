// services/responseGenerator.js
export class ResponseGenerator {
  constructor(openAIClient) {
    this.client = openAIClient;
  }

  async generateClaimSummary(claimData, fraudAssessment, categorization) {
    const prompt = `
Create a comprehensive but concise claim summary for internal use:

Claim Data: ${JSON.stringify(claimData, null, 2)}
Fraud Assessment: ${JSON.stringify(fraudAssessment, null, 2)}
Categorization: ${JSON.stringify(categorization, null, 2)}

Generate a summary in this format:
{
  "executiveSummary": "2-3 sentence overview",
  "keyDetails": {
    "claimant": "name and basic info",
    "incident": "what happened",
    "damages": "description and estimated amount",
    "riskFactors": "main concerns"
  },
  "processingStatus": "current status and next steps",
  "recommendations": [
    "actionable recommendations"
  ],
  "timeline": "expected processing timeline",
  "specialNotes": "any special considerations"
}

Return only valid JSON without any additional text or formatting.
`;

    try {
      const response = await this.client.chatCompletion([
        { role: 'system', content: 'You are a professional claims summarizer who creates clear, actionable summaries.' },
        { role: 'user', content: prompt }
      ]);

      return {
        success: true,
        summary: JSON.parse(response.choices[0].message.content)
      };
    } catch (error) {
      console.error('Summary generation failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async generateCustomerResponse(claimData, processingDecision, customerFriendly = true) {
    const tone = customerFriendly ? 'professional but warm and empathetic' : 'formal and professional';
    
    const prompt = `
Generate a customer-facing response about their claim status:

Claim Information: ${JSON.stringify(claimData, null, 2)}
Processing Decision: ${processingDecision}

Create a ${tone} response that:
- Acknowledges their claim
- Explains the current status
- Provides clear next steps
- Sets appropriate expectations
- Includes contact information for questions

Format as a professional email/letter response.
`;

    try {
      const response = await this.client.chatCompletion([
        { role: 'system', content: `You are a skilled customer service representative who creates ${tone} communications.` },
        { role: 'user', content: prompt }
      ]);

      return {
        success: true,
        response: response.choices[0].message.content
      };
    } catch (error) {
      console.error('Customer response generation failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}