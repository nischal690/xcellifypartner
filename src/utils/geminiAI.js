import axios from 'axios';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export const callGeminiRefineAPI = async (text) => {
  const prompt = `
You are an expert product copywriter. Refine the following product description to make it more persuasive, clear, and professional, while preserving its structure and original meaning.

- Keep the result close to the original length (do NOT shorten it too much).
- Use rich formatting (e.g., bold, bullet points, headings) where appropriate.
- Output must be in HTML format, under 1000 characters.

Here is the product description to improve:
${text}
`;

  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        contents: [{ parts: [{ text: prompt }] }],
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    return response?.data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
  } catch (error) {
    console.error('Gemini AI API error:', error);
    return '⚠️ Unable to refine content. Please try again.';
  }
};
