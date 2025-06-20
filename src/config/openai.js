// config/openai.js
const getOpenAIConfig = () => {
  // Safe way to access environment variables in browser
  let apiKey = '';
  try {
    apiKey = process?.env?.REACT_APP_OPENAI_API_KEY || '';
  } catch (e) {
    // Fallback for environments where process is not available
    apiKey = '';
  }
  
  return {
    apiKey,
    baseURL: 'https://api.openai.com/v1',
    model: 'gpt-4',
    temperature: 0.3,
    maxTokens: 2000
  };
};

export const OPENAI_CONFIG = getOpenAIConfig();
export { getOpenAIConfig };