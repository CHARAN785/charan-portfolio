if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) { const observer = new IntersectionObserver(entries => entries.forEach(entry => {if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target);}}),{threshold:0.1}); document.querySelectorAll('.scene h2,.tiles,.tags').forEach(el=>{el.classList.add('reveal');observer.observe(el);}); }
const API_URL = "https://charan-ai-backend.onrender.com/chat";

async function askAI(message) {
    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message: message
            })
        });

        if (!response.ok) {
            throw new Error("API request failed");
        }

        const data = await response.json();
        return data.reply;

    } catch (error) {
        console.error(error);
        return "AI assistant is temporarily unavailable.";
    }
}


function toggleChat() {
    const chatbox = document.getElementById("chatbox");

    chatbox.style.display =
        chatbox.style.display === "block"
        ? "none" : "block";
}

let sending = false;

async function sendMessage() {
    const input = document.getElementById("user-input");
    const message = input.value.trim();

    if (!message || sending) return;

    sending = true;
    addMessage(message, "user-message");
    input.value = "";

    const loading = addMessage(
        "Thinking...", "bot-message"
    );

    try {
        const reply = await askAI(message);
        loading.textContent = reply;
    } catch (error) {
        loading.textContent = "AI assistant unavailable.";
    } finally {
        sending = false;
    }

    const messages = document.getElementById("chat-messages");
    messages.scrollTop = messages.scrollHeight;
}

function addMessage(text, className) {
    const messages = document.getElementById("chat-messages");
    const div = document.createElement("div");

    div.className = className;
    div.textContent = text;

    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;

    return div;
}
