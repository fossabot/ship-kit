import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import OpenAI from 'openai';

const app = express();
app.use(cors());
app.use(express.json());

// Initialize OpenAI API client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post('/api/autocomplete', async (req, res) => {
  const { text } = req.body;

  try {
    // Use OpenAI client to create chat completion with a custom system prompt
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content:
            'You are an AI assistant that helps complete the user\'s text input. Provide a natural continuation of the text without adding any questions or extra conversation.',
        },
        {
          role: 'user',
          content: text,
        },
      ],
      max_tokens: 10,
      temperature: 0.5,
      n: 1,
      stop: null, // Ensure that the assistant doesn't stop early
    });

    const suggestion = response.choices[0].message.content.trim();
    res.json({ suggestion });
  } catch (error) {
    console.error(
      'Error fetching suggestion:',
      error.response?.data || error.message
    );
    res.status(500).json({ error: 'Error fetching suggestion' });
  }
});

app.listen(4000, () => {
  console.log('Server running on port 4000');
});