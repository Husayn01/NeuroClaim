// utils/apiClient.js
class OpenAIClient {
  constructor(config = OPENAI_CONFIG) {
    this.config = config;
  }

  async makeRequest(endpoint, payload) {
    try {
      const response = await fetch(`${this.config.baseURL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('OpenAI API request failed:', error);
      throw error;
    }
  }

  async chatCompletion(messages, options = {}) {
    const payload = {
      model: options.model || this.config.model,
      messages,
      temperature: options.temperature || this.config.temperature,
      max_tokens: options.maxTokens || this.config.maxTokens,
      ...options
    };

    return this.makeRequest('/chat/completions', payload);
  }
}

export const openAIClient = new OpenAIClient();