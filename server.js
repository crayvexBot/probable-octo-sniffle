import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { HfInference } from "@huggingface/inference";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// =======================
// HUGGING FACE SETUP
// =======================
const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

// simple memory storage
const sessions = {};

// =======================
// SIGNUP ROUTE
// =======================
app.post("/signup", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.json({
      ok: false,
      message: "Missing fields"
    });
  }

  sessions[username] = true;

  res.json({
    ok: true,
    message: "AprilGPT system access granted"
  });
});

// =======================
// CHAT ROUTE (MAIN AI)
// =======================
app.post("/chat", async (req, res) => {
  try {
    const { message, username } = req.body;

    console.log("USER:", username);
    console.log("MESSAGE:", message);

    // optional: fake system personality
    const prompt = `
You are AprilGPT, a funny chaotic assistant.
You sometimes act like a broken AI for humor.
User: ${message}
Reply:
`;

    const result = await hf.textGeneration({
      model: "mistralai/Mistral-7B-Instruct-v0.2",
      inputs: prompt,
      parameters: {
        max_new_tokens: 200,
        temperature: 0.9,
        return_full_text: false
      }
    });

    let reply = result.generated_text;

    if (!reply) reply = "AprilGPT glitched 💀";

    res.json({ reply });

  } catch (error) {
    console.log("HF ERROR:", error);

    res.json({
      reply: "❌ AprilGPT core failed (HuggingFace error)"
    });
  }
});

// =======================
// ROOT
// =======================
app.get("/", (req, res) => {
  res.send("AprilGPT backend running (HuggingFace mode)");
});

// =======================
// START SERVER
// =======================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("AprilGPT running on port", PORT);
});
