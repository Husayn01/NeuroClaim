// config/openai.js
const getOpenAIConfig = () => {
  // Access environment variables safely in React
  const apiKey = process.env.REACT_APP_OPENAI_API_KEY || '';
  
  return {
    apiKey,
    baseURL: 'https://api.openai.com/v1',
    model: 'gpt-4o-mini', // Changed to more accessible model
    temperature: 0.3,
    maxTokens: 2000
  };
};

export const OPENAI_CONFIG = getOpenAIConfig();
export { getOpenAIConfig };