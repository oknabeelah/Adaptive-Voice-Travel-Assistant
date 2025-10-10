// ===== demoscript.js =====

// ========================================
// ADD YOUR CREDENTIALS HERE
// ========================================
const ELEVENLABS_API_KEY = 'your_elevenlabs_api_key_here';  // Replace with your ElevenLabs key
const CODEWORDS_API_KEY = 'your_codewords_api_key_here';     // Replace with your Codewords key
const CODEWORDS_WORKFLOW_ID = 'your_workflow_id_here';       // Replace with your Workflow ID
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    const voiceInputSection = document.querySelector('.voice-input-section');
    if (!voiceInputSection) return;

    // --- Create chat container ---
    const chatContainer = document.createElement('div');
    chatContainer.id = 'chatContainer';
    chatContainer.style.maxHeight = '300px';
    chatContainer.style.overflowY = 'auto';
    chatContainer.style.padding = '1rem';
    chatContainer.style.border = '1px solid #ccc';
    chatContainer.style.borderRadius = '10px';
    chatContainer.style.background = 'white';
    chatContainer.style.display = 'flex';
    chatContainer.style.flexDirection = 'column';
    chatContainer.style.gap = '0.5rem';
    voiceInputSection.appendChild(chatContainer);

    // --- Input wrapper ---
    const inputWrapper = document.createElement('div');
    inputWrapper.style.display = 'flex';
    inputWrapper.style.gap = '0.5rem';
    inputWrapper.style.marginTop = '0.5rem';

    const textInput = document.createElement('input');
    textInput.type = 'text';
    textInput.placeholder = 'Type a message...';
    textInput.style.flex = '1';
    textInput.style.padding = '0.5rem 1rem';
    textInput.style.borderRadius = '12px';
    textInput.style.border = '1px solid #ccc';
    textInput.style.fontSize = '1rem';

    const sendButton = document.createElement('button');
    sendButton.textContent = 'Send';
    sendButton.style.padding = '0.5rem 1rem';
    sendButton.style.borderRadius = '12px';
    sendButton.style.border = 'none';
    sendButton.style.background = '#10b981';
    sendButton.style.color = 'white';
    sendButton.style.cursor = 'pointer';

    inputWrapper.appendChild(textInput);
    inputWrapper.appendChild(sendButton);
    chatContainer.appendChild(inputWrapper);

    // --- Chat bubble helper ---
    function addMessage(text, sender = 'ai') {
        const messageDiv = document.createElement('div');
        messageDiv.textContent = text;
        messageDiv.style.padding = '0.5rem 1rem';
        messageDiv.style.borderRadius = '12px';
        messageDiv.style.maxWidth = '80%';
        messageDiv.style.wordWrap = 'break-word';
        messageDiv.style.whiteSpace = 'pre-wrap';
        messageDiv.style.lineHeight = '1.4';
        messageDiv.style.display = 'inline-block';

        if (sender === 'user') {
            messageDiv.style.background = '#DCF8C6';
            messageDiv.style.alignSelf = 'flex-end';
            messageDiv.style.marginLeft = '20%';
        } else {
            messageDiv.style.background = '#F1F0F0';
            messageDiv.style.alignSelf = 'flex-start';
            messageDiv.style.marginRight = '20%';
        }

        chatContainer.insertBefore(messageDiv, inputWrapper);
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }

    // --- Backend call function ---
    const sendMessageToBackend = async (userText) => {
        if (!userText || !userText.trim()) return;
        addMessage(userText, 'user');
        textInput.value = '';

        // Show typing indicator
        const typingMsg = document.createElement('div');
        typingMsg.textContent = '💬 Typing...';
        typingMsg.style.padding = '0.5rem 1rem';
        typingMsg.style.borderRadius = '12px';
        typingMsg.style.background = '#F1F0F0';
        typingMsg.style.fontStyle = 'italic';
        typingMsg.className = 'typing-indicator';
        chatContainer.insertBefore(typingMsg, inputWrapper);

        try {
            // Call Codewords Workflow
            console.log('Calling Codewords workflow...');

            const codewordsResp = await fetch('https://api.codewords.io/workflow/run', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${CODEWORDS_API_KEY}`
                },
                body: JSON.stringify({
                    input: userText,
                    workflow_id: CODEWORDS_WORKFLOW_ID
                })
            });

            if (!codewordsResp.ok) {
                throw new Error(`Codewords API error: ${codewordsResp.status}`);
            }

            const codewordsData = await codewordsResp.json();
            console.log('Codewords response:', codewordsData);

            // Extract text response from Codewords
            const aiResponseText = codewordsData.text || codewordsData.output || 'I received your message!';

            // Remove typing indicator
            typingMsg.remove();

            // Add AI response to chat
            addMessage(aiResponseText, 'ai');

            // Optionally: Convert text to speech with ElevenLabs
            if (ELEVENLABS_API_KEY && ELEVENLABS_API_KEY !== 'your_elevenlabs_api_key_here') {
                await playElevenLabsAudio(aiResponseText);
            }

        } catch (err) {
            console.error('Error calling Codewords:', err);
            // Remove typing indicator
            typingMsg.remove();

            // Fallback to demo mode
            addMessage('⚠️ Error connecting to Codewords. Using demo mode...', 'ai');

            // Simple demo responses
            const demoResponses = [
                "That sounds like a great destination! When would you like to travel?",
                "Perfect! I can help you plan an amazing trip. What's your budget?",
                "Excellent choice! Let me create a personalized itinerary for you...",
                "I'd love to help with that! Tell me more about what you're looking for."
            ];

            setTimeout(() => {
                const randomResponse = demoResponses[Math.floor(Math.random() * demoResponses.length)];
                addMessage(randomResponse, 'ai');
            }, 1000);
        }
    };

    // Function to play audio using ElevenLabs
    async function playElevenLabsAudio(text) {
        try {
            console.log('Generating voice with ElevenLabs...');

            // ElevenLabs voice ID (default: Rachel voice)
            const voiceId = '21m00Tcm4TlvDq8ikWAM'; // You can change this to any voice ID

            const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
                method: 'POST',
                headers: {
                    'Accept': 'audio/mpeg',
                    'Content-Type': 'application/json',
                    'xi-api-key': ELEVENLABS_API_KEY
                },
                body: JSON.stringify({
                    text: text,
                    model_id: 'eleven_monolingual_v1',
                    voice_settings: {
                        stability: 0.5,
                        similarity_boost: 0.5
                    }
                })
            });

            if (response.ok) {
                const audioBlob = await response.blob();
                const audioUrl = URL.createObjectURL(audioBlob);
                const audio = new Audio(audioUrl);
                audio.play();
                console.log('Playing voice response...');
            } else {
                console.error('ElevenLabs error:', response.status);
            }
        } catch (error) {
            console.error('Error with ElevenLabs:', error);
            // Silent fail - text response still works
        }
    }

    // Function to display itinerary
    function displayItinerary(itinerary) {
        const itineraryDiv = document.createElement('div');
        itineraryDiv.style.background = 'linear-gradient(135deg, #667eea20 0%, #764ba220 100%)';
        itineraryDiv.style.border = '2px solid #667eea';
        itineraryDiv.style.borderRadius = '12px';
        itineraryDiv.style.padding = '1rem';
        itineraryDiv.style.margin = '0.5rem 0';

        let html = `<h3 style="margin: 0 0 0.5rem 0;">📍 ${itinerary.destination}</h3>`;
        html += `<p style="margin: 0 0 1rem 0; opacity: 0.8;">${itinerary.duration} • ${itinerary.estimated_cost}</p>`;

        if (itinerary.days) {
            itinerary.days.forEach(day => {
                html += `<div style="background: white; padding: 0.75rem; border-radius: 8px; margin: 0.5rem 0;">`;
                html += `<strong>Day ${day.day}: ${day.title}</strong>`;
                html += `</div>`;
            });
        }

        itineraryDiv.innerHTML = html;
        chatContainer.insertBefore(itineraryDiv, inputWrapper);
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }

    // --- Text input events ---
    sendButton.addEventListener('click', () => sendMessageToBackend(textInput.value));
    textInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessageToBackend(textInput.value);
    });

    // --- Voice input events ---
    const micButton = document.querySelector('.mic-button');
    if (micButton) {
        micButton.addEventListener('click', async () => {
            if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
                addMessage('⚠️ Speech recognition not supported in this browser. Please use Chrome.', 'ai');
                return;
            }

            const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
            recognition.lang = 'en-US';
            recognition.interimResults = false;

            recognition.onstart = () => {
                addMessage('🎤 Listening...', 'ai');
                micButton.style.background = 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';
            };

            recognition.onresult = async (event) => {
                const userText = event.results[0][0].transcript;
                micButton.style.background = '';
                await sendMessageToBackend(userText);
            };

            recognition.onerror = (event) => {
                console.error(event);
                addMessage('⚠️ Speech recognition error: ' + event.error, 'ai');
                micButton.style.background = '';
            };

            recognition.onend = () => {
                micButton.style.background = '';
            };

            recognition.start();
        });
    } else {
        console.error('Mic button not found');
    }
});
