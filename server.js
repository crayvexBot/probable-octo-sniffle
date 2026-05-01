import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

/* OPENAI */
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/* SIMPLE MEMORY */
const users = {};
const sessions = {};

/* SIGNUP */
app.post("/signup", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.json({
      ok: false,
      message: "Missing credentials"
    });
  }

  users[username] = password;
  sessions[username] = true;

  res.json({
    ok: true,
    message: "SYSTEM ACCESS GRANTED (AprilGPT simulation active)"
  });
});

/* CHAT */
app.post("/chat", async (req, res) => {
  try {
    const { message, username } = req.body;

    /* CHECK LOGIN */
    if (!sessions[username]) {
      return res.json({
        reply: "ACCESS DENIED. Run SIGNUP protocol."
      });
    }

    /* OPENAI CALL */
    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `
You are AprilGPT.

You are a simulation AI inside a fake Windows-style April Fools system.

Rules:
- Be helpful
- Be slightly funny
- Add occasional system-style phrases like "processing..."
- NEVER be scary or harmful
- Always stay clearly fictional
`
        },
        {
          role: "user",
          content: message
        }
      ]
    });

    res.json({
      reply: response.choices[0].message.content
    });

  } catch (error) {
    console.log("OpenAI Error:", error);

    /* SAFE FALLBACK */
    res.json({
      reply: "SYSTEM NOTICE: AI core unstable ⚠ switching to fallback simulation mode..."
    });
  }
});

/* ROOT */
app.get("/", (req, res) => {
  res.send("🟡 AprilGPT backend running (simulation active)");
});

/* START SERVER */
app.listen(3000, () => {
  console.log("AprilGPT running on port 3000");
});
