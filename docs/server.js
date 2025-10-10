import express from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(express.json());

app.post('/api/codewords', async (req, res) => {
  const userText = req.body.text;

  try {
    // Call Codewords API securely from the server
    const cwResp = await fetch('https://api.codewords.ai/v1/workflow/run', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.CODEWORDS_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        workflow_id: process.env.CODEWORDS_WORKFLOW_ID,
        input: { text: userText },
      }),
    });

    const cwData = await cwResp.json();

    // Optional: convert to speech using ElevenLabs
    let audioUrl = null;
    if (process.env.ELEVENLABS_API_KEY) {
      const voiceId = '21m00Tcm4TlvDq8ikWAM';
      const tts = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': process.env.ELEVENLABS_API_KEY,
        },
        body: JSON.stringify({
          text: cwData.output?.text || cwData.text || 'Response ready.',
          model_id: 'eleven_monolingual_v1',
        }),
      });

      const audioBuffer = await tts.arrayBuffer();
      const base64Audio = Buffer.from(audioBuffer).toString('base64');
      audioUrl = `data:audio/mpeg;base64,${base64Audio}`;
    }

    res.json({
      text: cwData.output?.text || cwData.text || 'No response from workflow.',
      audioUrl,
    });
  } catch (error) {
    console.error('Error connecting to Codewords:', error.message);
    res.json({
      text: 'Error connecting to Codewords. Using demo mode...',
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
