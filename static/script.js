document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector("form");
    const responseArea = document.getElementById("response-area");
    const themeToggle = document.getElementById("theme-toggle");

    form.addEventListener("submit", async function (e) {
        e.preventDefault();
        responseArea.innerHTML = "🤖 Thinking... Please wait.";

        const formData = new FormData(form);

        try {
            const res = await fetch("http://127.0.0.1:5000/analyze", {
                method: "POST",
                body: formData
            });
            const data = await res.json();
            responseArea.innerHTML = `<div class="bot-bubble">${data.response}</div><br>
                <label>Would you like suggestions or improvements?</label><br>
                <button onclick="sendSuggestions('yes')">Yes</button>
                <button onclick="sendSuggestions('no')">No</button>`;
        } catch (err) {
            responseArea.innerText = "⚠️ Failed to get response.";
        }
    });

    window.sendSuggestions = async function (reply) {
        const formData = new FormData(form);
        formData.append("suggestions", reply);
        responseArea.innerHTML = "🤖 Working on it...";

        try {
            const res = await fetch("http://127.0.0.1:5000/analyze", {
                method: "POST",
                body: formData
            });
            const data = await res.json();
            responseArea.innerHTML = `<div class="bot-bubble">${data.response}</div>`;

            if (reply === 'no') {
                responseArea.innerHTML = `<div class="bot-bubble">💜 Thank you for choosing Circuit Explainer! We're always here to spark your curiosity ⚡️</div>`;
            } else {
                responseArea.innerHTML = `<div class="bot-bubble">${data.response}</div>`;
            }
    
        } catch (err) {
            responseArea.innerText = "⚠️ Error generating suggestions.";
        }
    };

    themeToggle.addEventListener("click", () => {
        document.body.classList.toggle("light-mode");
    });
});
