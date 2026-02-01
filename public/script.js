document.addEventListener('DOMContentLoaded', () => {
    const chatBox = document.getElementById('chat-box');
    const chatForm = document.getElementById('chat-form');
    const userInput = document.getElementById('user-input');

    const addMessage = (text, sender) => {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', `${sender}-message`);
        messageElement.innerText = text;
        chatBox.appendChild(messageElement);
        chatBox.scrollTop = chatBox.scrollHeight;
        return messageElement;
    };

    const handleFormSubmit = async (event) => {
        event.preventDefault();
        const userMessage = userInput.value.trim();
        if (!userMessage) return;

        addMessage(userMessage, 'user');
        userInput.value = '';

        const thinkingMessage = addMessage('Thinking...', 'bot');

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    conversation: [{ role: 'user', text: userMessage }],
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to get response from server.');
            }

            const data = await response.json();

            if (data.result) {
                thinkingMessage.innerText = data.result;
            } else {
                thinkingMessage.innerText = 'Sorry, no response received.';
            }
        } catch (error) {
            console.error('Error:', error);
            thinkingMessage.innerText = 'Failed to get response from server.';
        }
    };

    chatForm.addEventListener('submit', handleFormSubmit);
});