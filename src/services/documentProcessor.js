// services/documentProcessor.js
export class DocumentProcessor {
  constructor(openAIClient) {
    this.client = openAIClient;
  }

  async extractClaimInformation(documentText) {
    const prompt = `
You are an expert insurance claims processor. Extract structured information from the following claim document.

Document Text:
${documentText}

Please extract and return a JSON object with the following structure:
{
  "claimNumber": "string or null",
  "policyNumber": "string or null",
  "claimantName": "string or null",
  "dateOfIncident": "YYYY-MM-DD or null",
  "dateOfClaim": "YYYY-MM-DD or null",
  "claimType": "auto|health|property|life|other",
  "incidentLocation": "string or null",
  "damageDescription": "string",
  "estimatedAmount": "number or null",
  "witnessInformation": "string or null",
  "medicalTreatment": "string or null",
  "vehicleInformation": {
    "make": "string or null",
    "model": "string or null",
    "year": "number or null",
    "licensePlate": "string or null"
  },
  "extractedFields": ["array of field names successfully extracted"],
  "missingFields": ["array of required fields that are missing"],
  "confidence": "high|medium|low"
}

Only include fields that are clearly present in the document. Mark confidence as:
- high: Most key information is present and clear
- medium: Some key information is present but unclear or incomplete
- low: Very little information is extractable

Return only valid JSON without any additional text or formatting.
`;

    try {
      const response = await this.client.chatCompletion([
        { role: 'system', content: 'You are a precise document processing assistant that returns only valid JSON.' },
        { role: 'user', content: prompt }
      ]);

      const extractedData = JSON.parse(response.choices[0].message.content);
      
      return {
        success: true,
        data: extractedData,
        processingTime: new Date().toISOString()
      };
    } catch (error) {
      console.error('Document extraction failed:', error);
      return {
        success: false,
        error: error.message,
        data: null
      };
    }
  }

  async validateClaimInformation(claimData) {
    const prompt = `
As an insurance claims validator, review the following extracted claim information for completeness and validity:

Claim Data:
${JSON.stringify(claimData, null, 2)}

Provide validation results in the following JSON format:
{
  "validationStatus": "valid|incomplete|invalid",
  "validationScore": 0-100,
  "issues": [
    {
      "field": "fieldName",
      "issue": "description of the issue",
      "severity": "critical|warning|info"
    }
  ],
  "recommendations": ["array of recommendations to improve claim"],
  "requiredActions": ["array of actions needed before processing"],
  "estimatedProcessingTime": "immediate|1-3 days|3-7 days|investigation required"
}

Return only valid JSON without any additional text or formatting.
`;

    try {
      const response = await this.client.chatCompletion([
        { role: 'system', content: 'You are a thorough claims validation specialist.' },
        { role: 'user', content: prompt }
      ]);

      return {
        success: true,
        validation: JSON.parse(response.choices[0].message.content)
      };
    } catch (error) {
      console.error('Validation failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}