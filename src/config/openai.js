// config/openai.js - Updated for production deployment
const getOpenAIConfig = () => {
  // Only use API key in development or when explicitly provided
  const apiKey = process.env.NODE_ENV === 'development' 
    ? process.env.REACT_APP_OPENAI_API_KEY || ''
    : ''; // Empty for production builds
  
  return {
    apiKey,
    baseURL: 'https://api.openai.com/v1',
    model: 'gpt-4o-mini',
    temperature: 0.3,
    maxTokens: 2000
  };
};

export const OPENAI_CONFIG = getOpenAIConfig();
export { getOpenAIConfig };