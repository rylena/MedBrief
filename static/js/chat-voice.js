let chatRecognition;
let isChatListening = false;

function initChatVoiceInput() {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        console.log('Speech recognition not supported');
        const voiceBtn = document.getElementById('chat-voice-btn');
        if (voiceBtn) {
            voiceBtn.style.display = 'none';
        }
        return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    chatRecognition = new SpeechRecognition();
    chatRecognition.continuous = false;
    chatRecognition.interimResults = true;

    const currentLang = sessionStorage.getItem('selectedLanguage') || 'en';
    const langMap = {
        'en': 'en-US', 'es': 'es-ES', 'fr': 'fr-FR', 'de': 'de-DE', 'it': 'it-IT',
        'pt': 'pt-PT', 'ru': 'ru-RU', 'zh': 'zh-CN', 'ja': 'ja-JP', 'ko': 'ko-KR',
        'ar': 'ar-SA', 'hi': 'hi-IN', 'bn': 'bn-IN', 'ur': 'ur-PK', 'vi': 'vi-VN',
        'th': 'th-TH', 'tr': 'tr-TR', 'pl': 'pl-PL', 'nl': 'nl-NL', 'sv': 'sv-SE',
        'ml': 'ml-IN'
    };
    chatRecognition.lang = langMap[currentLang] || 'en-US';

    chatRecognition.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
                finalTranscript += transcript + ' ';
            } else {
                interimTranscript += transcript;
            }
        }

        const chatInput = document.getElementById('chat-input');
        if (finalTranscript) {
            chatInput.value = finalTranscript.trim();
        } else if (interimTranscript) {
            chatInput.value = interimTranscript;
        }
    };

    chatRecognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        stopChatVoiceInput();
    };

    chatRecognition.onend = () => {
        stopChatVoiceInput();
    };

    const voiceBtn = document.getElementById('chat-voice-btn');
    if (voiceBtn) {
        voiceBtn.addEventListener('click', toggleChatVoiceInput);
    }
}

function toggleChatVoiceInput() {
    const btn = document.getElementById('chat-voice-btn');
    const icon = btn.querySelector('.voice-icon');

    if (!isChatListening) {
        chatRecognition.start();
        isChatListening = true;
        btn.classList.add('listening');
        icon.textContent = '🔴';
        btn.title = 'Stop recording';
    } else {
        stopChatVoiceInput();
    }
}

function stopChatVoiceInput() {
    if (chatRecognition) {
        chatRecognition.stop();
    }
    isChatListening = false;
    const btn = document.getElementById('chat-voice-btn');
    if (btn) {
        const icon = btn.querySelector('.voice-icon');
        btn.classList.remove('listening');
        icon.textContent = '🎤';
        btn.title = 'Voice input';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    initChatVoiceInput();
});
