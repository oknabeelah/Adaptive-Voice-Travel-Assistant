/**
 * VoyceTrip Demo Script
 * Connects demo.html frontend with backend API
 * Handles voice and text input, displays chat interface
 */

const API_BASE_URL = 'http://localhost:5000/api';
const SESSION_ID = 'demo_' + Date.now();

// State management
let isRecording = false;
let mediaRecorder = null;
let audioChunks = [];

/**
 * Initialize the chat interface
 */
function initChatInterface() {
    console.log('🎙️ Initializing VoyceTrip Chat Interface...');

    // Start with greeting
    setTimeout(() => {
        addMessage('assistant', 'Hello! I\'m your VoyceTrip assistant. I\'m here to help plan your perfect trip. Where would you like to go?', ['Los Angeles', 'New York', 'Paris', 'Tokyo', 'Surprise me!']);
    }, 500);

    // Setup event listeners
    setupInputHandlers();
}

/**
 * Setup input event handlers
 */
function setupInputHandlers() {
    const micButton = document.querySelector('.mic-button');
    const inputField = document.querySelector('.chat-input');
    const sendButton = document.querySelector('.send-button');

    // Voice input
    if (micButton) {
        micButton.addEventListener('click', handleVoiceInput);
    }

    // Text input
    if (inputField) {
        inputField.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });
    }

    if (sendButton) {
        sendButton.addEventListener('click', sendMessage);
    }
}

/**
 * Handle voice input
 */
async function handleVoiceInput() {
    const micButton = document.querySelector('.mic-button');

    if (!isRecording) {
        // Start recording
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorder = new MediaRecorder(stream);

            audioChunks = [];

            mediaRecorder.ondataavailable = (event) => {
                audioChunks.push(event.data);
            };

            mediaRecorder.onstop = async () => {
                const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
                await processVoiceInput(audioBlob);
            };

            mediaRecorder.start();
            isRecording = true;

            // Update UI
            micButton.style.background = 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';
            micButton.innerHTML = '⏹️';

        } catch (error) {
            console.error('Error accessing microphone:', error);
            alert('Could not access microphone. Please check permissions and try text input instead.');
        }
    } else {
        // Stop recording
        mediaRecorder.stop();
        isRecording = false;

        // Reset UI
        micButton.style.background = '';
        micButton.innerHTML = '🎤';

        // Stop all tracks
        mediaRecorder.stream.getTracks().forEach(track => track.stop());
    }
}

/**
 * Process voice input (simulated for demo)
 */
async function processVoiceInput(audioBlob) {
    // In a real implementation, you would send this to a speech-to-text service
    // For demo purposes, we'll simulate with a prompt
    const transcribedText = prompt('Voice recorded! Enter what you said (simulated transcription):');

    if (transcribedText) {
        sendMessage(transcribedText, 'voice');
    }
}

/**
 * Send message to backend
 */
async function sendMessage(text = null, type = 'text') {
    const inputField = document.querySelector('.chat-input');
    const message = text || inputField?.value?.trim();

    if (!message) return;

    // Clear input field
    if (inputField && !text) {
        inputField.value = '';
    }

    // Add user message to chat
    addMessage('user', message);

    // Show typing indicator
    showTypingIndicator();

    try {
        // Send to backend
        const response = await fetch(`${API_BASE_URL}/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: message,
                type: type,
                session_id: SESSION_ID
            })
        });

        const data = await response.json();

        // Hide typing indicator
        hideTypingIndicator();

        if (data.success) {
            const responseData = data.response;

            // Add assistant response
            addMessage('assistant', responseData.message, responseData.suggestions);

            // Show itinerary if available
            if (responseData.itinerary) {
                displayItinerary(responseData.itinerary);
            }

            // Show loading if needed
            if (responseData.show_loading) {
                setTimeout(() => {
                    sendMessage('continue', 'system');
                }, 2000);
            }
        }

    } catch (error) {
        console.error('Error sending message:', error);
        hideTypingIndicator();

        // Fallback: Show offline message
        addMessage('assistant', 'I\'m having trouble connecting. Using demo mode...', []);

        // Simulate response
        simulateResponse(message);
    }
}

/**
 * Simulate response when backend is offline
 */
function simulateResponse(userMessage) {
    const responses = [
        {
            message: "That sounds like a great destination! When would you like to travel?",
            suggestions: ["This weekend", "Next month", "I'm flexible"]
        },
        {
            message: "Perfect! I'll start planning your trip. What's your budget?",
            suggestions: ["Budget ($)", "Moderate ($$)", "Luxury ($$$)"]
        },
        {
            message: "Excellent choice! Let me create your personalized itinerary...",
            suggestions: []
        }
    ];

    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    setTimeout(() => {
        addMessage('assistant', randomResponse.message, randomResponse.suggestions);
    }, 1000);
}

/**
 * Add message to chat
 */
function addMessage(role, content, suggestions = []) {
    const chatMessages = document.querySelector('.chat-messages');
    if (!chatMessages) return;

    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${role}-message`;

    const messageContent = document.createElement('div');
    messageContent.className = 'message-content';
    messageContent.textContent = content;

    messageDiv.appendChild(messageContent);

    // Add suggestions if provided
    if (suggestions && suggestions.length > 0) {
        const suggestionsDiv = document.createElement('div');
        suggestionsDiv.className = 'message-suggestions';

        suggestions.forEach(suggestion => {
            const suggestionBtn = document.createElement('button');
            suggestionBtn.className = 'suggestion-btn';
            suggestionBtn.textContent = suggestion;
            suggestionBtn.addEventListener('click', () => {
                sendMessage(suggestion, 'text');
            });
            suggestionsDiv.appendChild(suggestionBtn);
        });

        messageDiv.appendChild(suggestionsDiv);
    }

    chatMessages.appendChild(messageDiv);

    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;

    // Animate message in
    setTimeout(() => {
        messageDiv.style.opacity = '1';
        messageDiv.style.transform = 'translateY(0)';
    }, 10);
}

/**
 * Show typing indicator
 */
function showTypingIndicator() {
    const chatMessages = document.querySelector('.chat-messages');
    if (!chatMessages) return;

    const typingDiv = document.createElement('div');
    typingDiv.className = 'typing-indicator';
    typingDiv.id = 'typing-indicator';
    typingDiv.innerHTML = `
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
    `;

    chatMessages.appendChild(typingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

/**
 * Hide typing indicator
 */
function hideTypingIndicator() {
    const typingIndicator = document.getElementById('typing-indicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

/**
 * Display itinerary
 */
function displayItinerary(itinerary) {
    const chatMessages = document.querySelector('.chat-messages');
    if (!chatMessages) return;

    const itineraryDiv = document.createElement('div');
    itineraryDiv.className = 'itinerary-card';

    let html = `
        <h3>📍 ${itinerary.destination}</h3>
        <p class="itinerary-meta">${itinerary.duration} • ${itinerary.estimated_cost}</p>
    `;

    itinerary.days.forEach(day => {
        html += `
            <div class="day-card">
                <h4>Day ${day.day}: ${day.title}</h4>
                <div class="activities">
        `;

        day.activities.forEach(activity => {
            html += `
                <div class="activity">
                    <span class="activity-time">${activity.time}</span>
                    <span class="activity-name">${activity.activity}</span>
                </div>
            `;
        });

        html += `
                </div>
            </div>
        `;
    });

    itineraryDiv.innerHTML = html;
    chatMessages.appendChild(itineraryDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

/**
 * Reset conversation
 */
async function resetConversation() {
    const chatMessages = document.querySelector('.chat-messages');
    if (chatMessages) {
        chatMessages.innerHTML = '';
    }

    try {
        await fetch(`${API_BASE_URL}/reset`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                session_id: SESSION_ID
            })
        });
    } catch (error) {
        console.error('Error resetting conversation:', error);
    }

    // Restart
    initChatInterface();
}

// Initialize on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initChatInterface);
} else {
    initChatInterface();
}

// Export functions for global access
window.VoyceTrip = {
    sendMessage,
    resetConversation,
    handleVoiceInput
};
