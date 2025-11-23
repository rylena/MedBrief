document.addEventListener('DOMContentLoaded', () => {
    const translateBtn = document.getElementById('translate-btn');
    const medicalNotesInput = document.getElementById('medical-notes');
    const resultSection = document.getElementById('result-section');
    const summaryText = document.getElementById('summary-text');
    const audioPlayer = document.getElementById('audio-player');
    const btnText = translateBtn.querySelector('.btn-text');
    const loader = translateBtn.querySelector('.loader');

    const pdfUpload = document.getElementById('pdf-upload');
    const errorMessage = document.getElementById('error-message');
    const privacyModeCheckbox = document.getElementById('privacy-mode');
    const keyTermsContainer = document.getElementById('key-terms-container');
    const keyTermsList = document.getElementById('key-terms-list');

    pdfUpload.addEventListener('change', (e) => {
        const fileName = e.target.files[0]?.name;
        const label = e.target.parentElement;
        const span = label.querySelector('span');

        if (fileName) {
            span.innerHTML = `<strong>${fileName}</strong> <br> (Ready to analyze)`;
            label.style.borderColor = 'var(--primary-color)';
            label.style.backgroundColor = '#f0f8ff';
        } else {
            span.textContent = 'Upload Medical Report (PDF) or Image (X-Ray, Scan)';
            label.style.borderColor = '#e0e0e0';
            label.style.backgroundColor = 'white';
        }
    });

    translateBtn.addEventListener('click', async () => {
        const text = medicalNotesInput.value.trim();
        const file = pdfUpload.files[0];
        const privacyMode = privacyModeCheckbox.checked;

        errorMessage.classList.add('hidden');
        errorMessage.textContent = '';
        keyTermsContainer.classList.add('hidden');
        keyTermsList.innerHTML = '';

        if (!text && !file) {
            showError('Please enter some medical notes or upload a PDF.');
            return;
        }

        let loadingText = 'Translating...';
        if (file) {
            if (file.type.startsWith('image/')) {
                loadingText = 'Analyzing Image...';
            } else {
                loadingText = 'Processing PDF...';
            }
        }
        setLoading(true, loadingText);
        resultSection.classList.add('hidden');

        try {
            const formData = new FormData();
            if (file) {
                formData.append('file', file);
            } else {
                formData.append('text', text);
            }
            formData.append('privacy_mode', privacyMode);

            const response = await fetch('/summarize', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Network response was not ok');
            }

            const data = await response.json();

            if (data.error) {
                throw new Error(data.error);
            }

            summaryText.textContent = data.summary;
            audioPlayer.src = data.audio_url;

            if (data.key_terms && data.key_terms.length > 0) {
                data.key_terms.forEach(term => {
                    const tag = document.createElement('span');
                    tag.className = 'term-tag';
                    tag.textContent = term;
                    keyTermsList.appendChild(tag);
                });
                keyTermsContainer.classList.remove('hidden');
            }

            let contextToSave = "";
            if (!text && file) {
                contextToSave = `Summary of the note: ${data.summary}`;
            } else {
                contextToSave = text;
            }
            sessionStorage.setItem('medicalContext', contextToSave);

            resultSection.classList.remove('hidden');

            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                await supabase.from('summaries').insert({
                    user_id: session.user.id,
                    original_text: text || "[File Upload]",
                    summary: data.summary,
                    key_terms: data.key_terms,
                    audio_url: data.audio_url
                });
            }

        } catch (error) {
            console.error('Error:', error);
            showError(error.message || 'An error occurred while translating. Please try again.');
        } finally {
            setLoading(false);
        }
    });


    function setLoading(isLoading, text = 'Translate to Simple English') {
        translateBtn.disabled = isLoading;
        if (isLoading) {
            btnText.textContent = text;
            loader.classList.remove('hidden');
        } else {
            btnText.textContent = 'Translate to Simple English';
            loader.classList.add('hidden');
        }
    }

    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.classList.remove('hidden');
    }

    const dragOverlay = document.getElementById('drag-overlay');

    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        document.body.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    ['dragenter', 'dragover'].forEach(eventName => {
        document.body.addEventListener(eventName, highlight, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        document.body.addEventListener(eventName, unhighlight, false);
    });

    function highlight(e) {
        if (e.dataTransfer.types && Array.from(e.dataTransfer.types).includes('Files')) {
            dragOverlay.classList.remove('hidden');
        }
    }

    function unhighlight(e) {
        if (e.type === 'drop' || e.relatedTarget === null) {
            dragOverlay.classList.add('hidden');
        }
    }

    document.body.addEventListener('drop', handleDrop, false);

    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;

        if (files.length > 0) {
            const file = files[0];
            if (file.type === 'application/pdf' || file.type.startsWith('image/')) {
                pdfUpload.files = files;
                const event = new Event('change');
                pdfUpload.dispatchEvent(event);

                translateBtn.click();
            } else {
                showError("Invalid file type. Please upload a PDF or Image.");
            }
        }
    }
});
