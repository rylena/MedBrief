document.addEventListener('DOMContentLoaded', () => {
    const chatHistory = document.getElementById('chat-history');
    const chatInput = document.getElementById('chat-input');
    const sendChatBtn = document.getElementById('send-chat');
    const chatLoading = document.getElementById('chat-loading');

    const currentContext = sessionStorage.getItem('medicalContext') || "";

    if (!currentContext) {
        addChatMessage("I don't see any recent medical note to discuss. Please go to the Home page and translate a note first.", 'bot');
    }

    sendChatBtn.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });

    async function sendMessage() {
        const message = chatInput.value.trim();
        if (!message) return;

        addChatMessage(message, 'user');
        chatInput.value = '';

        chatLoading.classList.remove('hidden');
        chatHistory.scrollTop = chatHistory.scrollHeight;

        try {
            const response = await fetch('/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: message, context: currentContext })
            });

            const data = await response.json();
            if (data.answer) {
                addChatMessage(data.answer, 'bot');
            } else {
                addChatMessage("Sorry, I couldn't process that.", 'bot');
            }
        } catch (error) {
            addChatMessage("Error connecting to assistant.", 'bot');
        } finally {
            chatLoading.classList.add('hidden');
        }
    }

    function addChatMessage(text, sender) {
        const div = document.createElement('div');
        div.className = `chat-message ${sender}`;

        if (sender === 'bot') {
            div.innerHTML = marked.parse(text);
        } else {
            div.textContent = text;
        }

        chatHistory.appendChild(div);
        chatHistory.scrollTop = chatHistory.scrollHeight;
    }
});
