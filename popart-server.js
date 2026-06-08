import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3003;

app.use(cors());
app.use(express.json());

app.post('/api/popart/generate', async (req, res) => {
  const { system, prompt } = req.body;

  if (!system || !prompt) {
    return res.status(400).json({
      error: 'Missing system or prompt in request body'
    });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({
      error: 'ANTHROPIC_API_KEY environment variable not set'
    });
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 16000,
        system,
        messages: [
          {
            role: 'user',
            content: prompt + '\n\nIMPORTANT: Output MUST be complete, valid JSON with all layers fully closed. Do not truncate.'
          }
        ]
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Anthropic API error:', data);
      return res.status(response.status).json(data);
    }

    res.json(data);
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({
      error: 'Server error: ' + err.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`🎨 Pop Art server running on http://localhost:${PORT}`);
  console.log('Set ANTHROPIC_API_KEY environment variable before starting');
});
