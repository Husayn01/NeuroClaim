// config/openai.js
export const OPENAI_CONFIG = {
  apiKey: process.env.REACT_APP_OPENAI_API_KEY || 'your-openai-api-key-here',
  baseURL: 'https://api.openai.com/v1',
  model: 'gpt-4',
  temperature: 0.3,
  maxTokens: 2000
};