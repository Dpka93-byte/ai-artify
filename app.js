require('dotenv').config();
const express = require('express');
const OpenAI = require('openai');
const path = require('path');

const app = express();

app.use(express.json());
// ✅ Serve static files from "public" folder (for index.html)
app.use(express.static(path.join(__dirname, 'public')));

// Create an OpenAI client using your API key
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Endpoint for AI chat
app.post('/chat', async (req, res) => {
  try {
    const userMessage = req.body?.message || '';

    const response = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: userMessage }],
    });

    res.json({ reply: response.choices[0]?.message?.content || '(No reply)' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to get AI response' });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running at http://localhost:${PORT}`));
