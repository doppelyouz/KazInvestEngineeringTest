import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import OpenAI from 'openai';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Initialize OpenAI conditionally. If API key is missing, we'll return a mocked response
// so the frontend can still be tested and developed uninterrupted.
let openai;
if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

app.post('/api/chat', async (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: 'Text is required' });
  }

  try {
    if (!openai) {
      console.warn("No OPENAI_API_KEY found, returning mocked response. Add API key to backend/.env");
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      return res.json({
        reply: `This is a mock response from the server to test interaction. You said: "${text}". Please provide a valid OPENAI_API_KEY in backend/.env to use real AI.`
      });
    }

    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: text }],
      model: "gpt-3.5-turbo",
    });

    const reply = completion.choices[0]?.message?.content || 'No response from AI';
    res.json({ reply });

  } catch (error) {
    console.error('Error calling ChatGPT API:', error);
    res.status(500).json({ error: 'Failed to communicate with AI API' });
  }
});

app.listen(port, () => {
  console.log(`Backend server listening at http://localhost:${port}`);
  if (!process.env.OPENAI_API_KEY) {
    console.log(`⚠️  Warning: OPENAI_API_KEY is not set in backend/.env. Using mocked responses.`);
  }
});
