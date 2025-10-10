// Example for Node.js backend
const codewordsResp = await axios.post(
  'https://api.codewords.io/workflow/run',
  { input: userInput, workflow_id: 'YOUR_WORKFLOW_ID' },
  { headers: { Authorization: `Bearer ${process.env.CODEWORDS_API_KEY}` } }
);

const codewordsText = codewordsResp.data.text;

// Then send codewordsText to ElevenLabs TTS for audio
