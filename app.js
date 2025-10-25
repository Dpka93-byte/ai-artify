require('dotenv').config();
const express = require('express');
const OpenAI = require('openai');
const path = require('path');

const app = express();

// Allow JSON in requests
app.use(express.json());

// Serve static files from "public" (for index.html)
app.use(express.static(path.join(__dirname, 'public')));

// Home route - test server
app.get('/', (req, res) => {
  res.send('🎨 AI Artify is ready! Try POST /chat with a message.');
});

// Create OpenAI client using your API key
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Chat endpoint
app.post('/chat', async (req, res) => {
  try {
    const userMessage = req.body.message || '';

    const response = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: userMessage }],
    });

    res.json({ reply: response.choices[0].message.content });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to get AI response' });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running at http://localhost:${PORT}`));
