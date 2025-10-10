// ===== demoscript.js =====
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
        if (!userText) return;
        addMessage(userText, 'user');
        textInput.value = '';

        try {
            const resp = await fetch('/api/voice-response', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userInput: userText }) // Backend should call Codewords workflow here
            });

            const { text, audioUrl } = await resp.json();

            addMessage(text, 'ai');

            if (audioUrl) {
                const audio = new Audio(audioUrl);
                audio.play();
            }
        } catch (err) {
            console.error(err);
            addMessage('⚠️ Error: Could not get AI response.', 'ai');
        }
    };

    // --- Text input events ---
    sendButton.addEventListener('click', () => sendMessageToBackend(textInput.value));
    textInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessageToBackend(textInput.value);
    });

    // --- Voice input events ---
    const micButton = document.getElementById('micButton');
    if (micButton) {
        micButton.addEventListener('click', async () => {
            const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
            recognition.lang = 'en-US';
            recognition.interimResults = false;

            recognition.onstart = () => addMessage('🎤 Listening...', 'ai');

            recognition.onresult = async (event) => {
                const userText = event.results[0][0].transcript;
                await sendMessageToBackend(userText);
            };

            recognition.onerror = (event) => {
                console.error(event);
                addMessage('⚠️ Speech recognition error.', 'ai');
            };

            recognition.start();
        });
    }
});
