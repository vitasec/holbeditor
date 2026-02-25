lucide.createIcons();

const API_URL = "http://localhost:5000/format";

const inputCode = document.getElementById('input-code');
const fixedCode = document.getElementById('fixed-code');
const fixBtn = document.getElementById('fix-btn');
const btnText = document.getElementById('btn-text');
const wandIcon = document.getElementById('wand-icon');
const loader = document.getElementById('loader');
const loadingOverlay = document.getElementById('loading-overlay');
const placeholderText = document.getElementById('placeholder-text');
const errorBox = document.getElementById('error-box');
const errorText = document.getElementById('error-text');
const copyInputBtn = document.getElementById('copy-input');
const copyFixedBtn = document.getElementById('copy-fixed');
const clearBtn = document.getElementById('clear-input');

async function handleFixCode() {
    const code = inputCode.value.trim();
    if (!code) return;

    setLoading(true);
    errorBox.classList.add('hidden');

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code: code }),
        });

        if (!response.ok) {
            throw new Error('Backend is not responding. Make sure that Holbeditor service is running.');
        }

        const data = await response.json();
        
        fixedCode.value = data.formatted_code;
        placeholderText.classList.add('hidden');
        copyFixedBtn.classList.remove('hidden');

    } catch (err) {
        errorText.innerText = err.message || 'Error occured';
        errorBox.classList.remove('hidden');
    } finally {
        setLoading(false);
    }
}

function setLoading(isLoading) {
    if (isLoading) {
        fixBtn.disabled = true;
        btnText.innerText = 'Formatting...';
        wandIcon.classList.add('hidden');
        loader.classList.remove('hidden');
        loadingOverlay.classList.remove('hidden');
    } else {
        fixBtn.disabled = false;
        btnText.innerText = 'Format in Betty';
        wandIcon.classList.remove('hidden');
        loader.classList.add('hidden');
        loadingOverlay.classList.add('hidden');
    }
}

// Kopyalama funksiyası
async function copyToClipboard(text, btnElement) {
    try {
        await navigator.clipboard.writeText(text);
        const originalContent = btnElement.innerHTML;
        
        btnElement.innerHTML = `<i data-lucide="check"></i> <span>Copied!</span>`;
        lucide.createIcons(); // Yeni ikonu göstər
        
        setTimeout(() => {
            btnElement.innerHTML = originalContent;
            lucide.createIcons();
        }, 2000);
    } catch (err) {
        console.error('Could not copy', err);
    }
}

// Event Listeners
fixBtn.addEventListener('click', handleFixCode);

clearBtn.addEventListener('click', () => {
    inputCode.value = '';
    fixedCode.value = '';
    placeholderText.classList.remove('hidden');
    copyFixedBtn.classList.add('hidden');
    errorBox.classList.add('hidden');
});

copyInputBtn.addEventListener('click', () => copyToClipboard(inputCode.value, copyInputBtn));
copyFixedBtn.addEventListener('click', () => copyToClipboard(fixedCode.value, copyFixedBtn));
