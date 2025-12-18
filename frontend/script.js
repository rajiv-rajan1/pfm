const form = document.getElementById('waitlist-form');
const emailInput = document.getElementById('email');
const messageDiv = document.getElementById('message');
const submitBtn = document.getElementById('submit-btn');

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = emailInput.value;
    if (!email) return;

    // Loading State
    setLoading(true);
    messageDiv.textContent = '';
    messageDiv.className = 'message';

    try {
        // NOTE: We use relative path here because Nginx will proxy /api to the backend
        const response = await fetch('/api/waitlist', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
        });

        const data = await response.json();

        if (response.ok) {
            showMessage(data.message || 'Thanks for joining!', 'success');
            form.reset();
        } else {
            showMessage(data.detail || 'Something went wrong.', 'error');
        }
    } catch (error) {
        showMessage('Connection error. Please try again.', 'error');
        console.error('Error:', error);
    } finally {
        setLoading(false);
    }
});

function setLoading(isLoading) {
    if (isLoading) {
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;
    } else {
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
    }
}

function showMessage(text, type) {
    messageDiv.textContent = text;
    messageDiv.className = `message ${type}`;
}
