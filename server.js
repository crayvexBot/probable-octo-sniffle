const API = "https://aprilgpt-vi60.onrender.com/chat";

// boot animation
setTimeout(() => {
  document.getElementById("boot").style.display = "none";
  document.getElementById("chat").style.display = "block";
}, 1500);

// TYPE ANIMATION (safe + smooth)
function typeText(text) {
  const out = document.getElementById("output");

  const line = document.createElement("div");
  out.appendChild(line);

  // safety fallback
  if (!text || text.trim().length < 2) {
    text = "…my joke engine crashed into a wall of silence.";
  }

  let i = 0;

  const interval = setInterval(() => {
    line.innerText = "pythonAI> " + text.slice(0, i);
    i++;

    if (i > text.length) clearInterval(interval);

    out.scrollTop = 999999;
  }, 12);
}

// SEND MESSAGE
async function send() {
  const input = document.getElementById("msg");
  const msg = input.value;

  // ❌ ignore empty input
  if (!msg || msg.trim().length < 1) return;

  input.value = "";

  const out = document.getElementById("output");
  out.innerHTML += `cmd>User: ${msg}\n`;

  try {
    const r = await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: msg })
    });

    const d = await r.json();

    typeText(d.reply);

  } catch (err) {
    typeText("AI ERROR: CONNECTION LOST TO APRIL GPT SERVER");
  }
}
