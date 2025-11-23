function shareViaWhatsApp() {
    const summary = document.getElementById('summary-text').textContent;
    const text = `Medical Summary:\n\n${summary}\n\n📱 Shared via MedBrief`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
}

function shareViaSMS() {
    const summary = document.getElementById('summary-text').textContent;
    const text = `Medical Summary:\n\n${summary}`;
    const url = `sms:?body=${encodeURIComponent(text)}`;
    window.location.href = url;
}

function shareViaEmail() {
    const summary = document.getElementById('summary-text').textContent;
    const subject = 'Medical Summary from MedBrief';
    const body = `Hi,\n\nHere is a simplified medical summary:\n\n${summary}\n\nBest regards`;
    const url = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = url;
}

async function copyToClipboard() {
    const summary = document.getElementById('summary-text').textContent;
    try {
        await navigator.clipboard.writeText(summary);

        const btn = event.target;
        const originalText = btn.innerHTML;
        btn.innerHTML = '✓ Copied!';
        btn.style.background = '#28a745';

        setTimeout(() => {
            btn.innerHTML = originalText;
            btn.style.background = '';
        }, 2000);
    } catch (err) {
        alert('Failed to copy. Please select and copy manually.');
    }
}

async function getMedicationInfo(medName) {
    const modal = document.getElementById('medication-modal');
    const modalContent = document.getElementById('medication-modal-content');

    modalContent.innerHTML = '<div class="loading">Loading medication information...</div>';
    modal.classList.remove('hidden');

    try {
        const response = await fetch('/medication_info', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ medication: medName })
        });

        const data = await response.json();

        if (data.error) {
            modalContent.innerHTML = `<p class="error">${data.error}</p>`;
            return;
        }

        modalContent.innerHTML = `
            <h3>${data.name}</h3>
            ${data.generic_name ? `<p><strong>Generic Name:</strong> ${data.generic_name}</p>` : ''}
            <p><strong>Purpose:</strong> ${data.purpose}</p>
            ${data.alternatives.length > 0 ? `
                <div class="alternatives">
                    <h4>Alternatives:</h4>
                    <ul>
                        ${data.alternatives.map(alt => `<li>${alt}</li>`).join('')}
                    </ul>
                </div>
            ` : ''}
            <div class="pharmacies">
                <h4>Where to Buy:</h4>
                ${data.pharmacies.map(p => `
                    <a href="${p.url}" target="_blank" class="pharmacy-link">
                        ${p.name} →
                    </a>
                `).join('')}
            </div>
            <p class="disclaimer">⚠️ This is for informational purposes only. Always consult your doctor before changing medications.</p>
        `;
    } catch (error) {
        modalContent.innerHTML = '<p class="error">Failed to load medication information.</p>';
    }
}

function closeMedicationModal() {
    document.getElementById('medication-modal').classList.add('hidden');
}

document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('medication-modal');
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeMedicationModal();
            }
        });
    }
});
