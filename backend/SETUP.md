# VoyceTrip Setup Guide

## ✅ What's Fixed

The demo page now has working:
- **Text input** - Type messages and press Enter or click Send
- **Voice input** - Click the microphone button to speak (Chrome/Edge recommended)
- **Backend integration** - Connects to automated workflow backend
- **Fallback mode** - Works even without backend running

## 🚀 Quick Start

### Frontend Only (Works Immediately)
The demo will work in fallback mode without any setup:

1. Open `/docs/demo.html` in your browser
2. Click the microphone or type a message
3. The chat will respond in demo mode

### With Backend (Full Features)

1. **Start the Backend**
```bash
cd docs
python3 backend_app.py
```

The backend will run on `http://localhost:5000`

2. **Open Demo Page**
- Navigate to `/docs/demo.html` in your browser
- The chat will automatically connect to the backend

## 🎤 How to Use

### Text Input
1. Type your message in the text box that appears in the chat
2. Press `Enter` or click `Send`
3. Wait for AI response

### Voice Input
1. Click the 🎤 microphone button
2. Allow microphone permissions when prompted
3. Speak your message
4. The speech will be transcribed and sent automatically

**Note:** Voice recognition requires:
- Chrome or Edge browser
- HTTPS connection (or localhost for testing)
- Microphone permissions

## 📁 File Structure

```
docs/
├── demo.html              # Main demo page with chat interface
├── demoscript.js          # Chat functionality + backend integration
├── backend_app.py         # Flask backend with automated workflow
├── requirements.txt       # Python dependencies
├── index.html            # Landing page
├── styles.css            # Shared styles
└── script.js             # General page scripts
```

## 🔧 Backend Workflow States

The backend guides users through these states:
1. **Greeting** - Welcome message
2. **Destination** - Where to travel
3. **Dates** - When to travel
4. **Preferences** - Travel style
5. **Budget** - Budget range
6. **Generate Itinerary** - Create personalized plan

## 🌐 Deploy to GitHub Pages

1. Push the `/docs` folder to GitHub
2. Go to Settings → Pages
3. Select `/docs` as source
4. Your site will be live at `https://username.github.io/repo-name`

**Note:** Backend needs separate hosting (Heroku, Railway, Render, etc.)

## ❓ Troubleshooting

### Chat not appearing?
- Check browser console for errors
- Make sure `demoscript.js` is loaded
- Refresh the page

### Voice not working?
- Use Chrome or Edge browser
- Check microphone permissions
- Try HTTPS or localhost
- Use text input as fallback

### Backend not connecting?
- Check if backend is running on port 5000
- Look for CORS errors in console
- Demo mode will activate automatically

### No response from backend?
- Verify backend is running: `http://localhost:5000/api/health`
- Check network tab for failed requests
- Backend logs will show errors

## 🎯 Next Steps

### For Production:
1. Deploy backend to cloud service
2. Update `demoscript.js` API URL to your backend URL
3. Add ElevenLabs for voice synthesis
4. Integrate real AI workflow (GPT, Claude, etc.)
5. Add Granola for memory persistence

### For Development:
1. Customize workflow states in `backend_app.py`
2. Modify chat UI in `demo.html`
3. Add more features to `demoscript.js`
