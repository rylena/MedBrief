let recognition;
let isListening = false;

function initVoiceInput() {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        console.log('Speech recognition not supported');
        return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;

    const currentLang = sessionStorage.getItem('selectedLanguage') || 'en';
    const langMap = {
        'en': 'en-US', 'es': 'es-ES', 'fr': 'fr-FR', 'de': 'de-DE', 'it': 'it-IT',
        'pt': 'pt-PT', 'ru': 'ru-RU', 'zh': 'zh-CN', 'ja': 'ja-JP', 'ko': 'ko-KR',
        'ar': 'ar-SA', 'hi': 'hi-IN', 'bn': 'bn-IN', 'ur': 'ur-PK', 'vi': 'vi-VN',
        'th': 'th-TH', 'tr': 'tr-TR', 'pl': 'pl-PL', 'nl': 'nl-NL', 'sv': 'sv-SE',
        'ml': 'ml-IN'
    };
    recognition.lang = langMap[currentLang] || 'en-US';

    recognition.onresult = (event) => {
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

        const textarea = document.getElementById('medical-notes');
        if (finalTranscript) {
            textarea.value += finalTranscript;
        }
    };

    recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        stopVoiceInput();
    };

    recognition.onend = () => {
        if (isListening) {
            recognition.start();
        }
    };
}

function toggleVoiceInput() {
    const btn = document.getElementById('voice-input-btn');
    const icon = btn.querySelector('.voice-icon');

    if (!isListening) {
        recognition.start();
        isListening = true;
        btn.classList.add('listening');
        icon.textContent = '🔴';
        btn.title = 'Stop recording';
    } else {
        stopVoiceInput();
    }
}

function stopVoiceInput() {
    if (recognition) {
        recognition.stop();
    }
    isListening = false;
    const btn = document.getElementById('voice-input-btn');
    const icon = btn.querySelector('.voice-icon');
    btn.classList.remove('listening');
    icon.textContent = '🎤';
    btn.title = 'Voice input';
}

document.addEventListener('DOMContentLoaded', () => {
    initVoiceInput();
});
