# VoyceTrip - Workflow Credentials Guide

## 📝 Where to Add Credentials

### Step 1: Create .env File

In the `/docs` directory, create a file named `.env`:

```bash
cd docs
cp .env.example .env
```

### Step 2: Add Your API Keys

Open the `.env` file and add your credentials:

```env
# ElevenLabs API (for voice synthesis)
ELEVENLABS_API_KEY=sk_your_actual_elevenlabs_key_here

# OpenAI API (for GPT intelligence)
OPENAI_API_KEY=sk-your_actual_openai_key_here

# Granola API (for context memory)
GRANOLA_API_KEY=your_granola_api_key_here

# Codewords Workflow (if using)
CODEWORDS_API_KEY=your_codewords_api_key_here
CODEWORDS_WORKFLOW_ID=your_workflow_id_here

# Flask Configuration
SECRET_KEY=your_random_secret_key_here
```

### Step 3: NEVER Commit .env to Git

The `.gitignore` file is already configured to ignore `.env` files, so your credentials stay private.

## 🔑 How to Get API Keys

### ElevenLabs (Voice Synthesis)
1. Go to https://elevenlabs.io
2. Sign up for an account
3. Navigate to Profile → API Keys
4. Copy your API key
5. Add to `.env` as `ELEVENLABS_API_KEY=sk_...`

### OpenAI (GPT Intelligence)
1. Go to https://platform.openai.com
2. Sign up or log in
3. Go to API Keys section
4. Create new secret key
5. Add to `.env` as `OPENAI_API_KEY=sk-...`

### Granola (Context Memory)
1. Go to https://granola.io
2. Sign up and get your API key
3. Add to `.env` as `GRANOLA_API_KEY=...`

### Codewords (Workflow Automation)
1. Go to https://codewords.io (or your workflow platform)
2. Get your API key
3. Get your workflow ID
4. Add both to `.env`

## 🛠️ Using Credentials in Code

The credentials are automatically loaded in `backend_app.py`:

```python
from dotenv import load_dotenv
import os

load_dotenv()

ELEVENLABS_API_KEY = os.getenv('ELEVENLABS_API_KEY')
OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')
```

## 📋 File Structure

```
docs/
├── .env                    # YOUR CREDENTIALS (never commit!)
├── .env.example            # Template (safe to commit)
├── .gitignore              # Protects .env from git
├── backend_app.py          # Backend uses credentials
└── CREDENTIALS_GUIDE.md    # This file
```

## 🔒 Security Best Practices

### ✅ DO:
- Keep `.env` file local only
- Use different keys for dev/production
- Rotate keys regularly
- Use environment variables in production

### ❌ DON'T:
- Commit `.env` to git
- Share API keys publicly
- Hard-code credentials in files
- Use production keys in development

## 🚀 Production Deployment

For production (Heroku, Railway, Render, etc.), set environment variables through the platform's dashboard:

### Heroku:
```bash
heroku config:set ELEVENLABS_API_KEY=sk_your_key
heroku config:set OPENAI_API_KEY=sk_your_key
```

### Railway/Render:
Use the web dashboard to add environment variables in Settings → Environment Variables

## ✅ Verify Setup

Test if credentials are loaded:

```bash
cd docs
python3 -c "from dotenv import load_dotenv; import os; load_dotenv(); print('Keys loaded:', bool(os.getenv('OPENAI_API_KEY')))"
```

Should output: `Keys loaded: True`

## 🧪 Testing Without Credentials

The backend works in demo mode without any API keys. It will:
- Use simulated responses
- Generate sample itineraries
- Work offline

Perfect for testing the workflow before adding real integrations!

## 📞 Integration Examples

### Using OpenAI in Workflow:

```python
import openai
openai.api_key = OPENAI_API_KEY

response = openai.ChatCompletion.create(
    model="gpt-4",
    messages=[{"role": "user", "content": user_input}]
)
```

### Using ElevenLabs for Voice:

```python
import requests

url = "https://api.elevenlabs.io/v1/text-to-speech/voice_id"
headers = {"xi-api-key": ELEVENLABS_API_KEY}
data = {"text": "Your travel itinerary is ready!"}

response = requests.post(url, headers=headers, json=data)
```

## ❓ Troubleshooting

**Environment variables not loading?**
- Check `.env` file exists in `/docs` directory
- Ensure `python-dotenv` is installed: `pip install python-dotenv`
- Verify no spaces around `=` in `.env` file

**Still getting errors?**
- Run backend with: `python3 backend_app.py`
- Check console for error messages
- Verify API keys are valid and active

**Want to test without keys?**
- Just run the backend without creating `.env`
- It will work in demo/fallback mode automatically
