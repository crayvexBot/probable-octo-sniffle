import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const users = {};
const sessions = {};

// SIGNUP
app.post("/signup", (req, res) => {
  const { username, password } = req.body;

  users[username] = password;
  sessions[username] = true;

  res.json({
    ok: true,
    message: "SYSTEM ACCESS GRANTED (simulation mode active)"
  });
});

// CHAT
app.post("/chat", async (req, res) => {
  try {
    const { message, username } = req.body;

    if (!sessions[username]) {
      return res.json({ reply: "ACCESS DENIED. Run SIGNUP protocol." });
    }

    const systemPrompt = `
You are AprilGPT.

You are a SIMULATION AI inside a fake Windows “April Virus” interface.

RULES:
- Always answer like a helpful AI
- Add light humor or system-style jokes
- NEVER be harmful or scary
- ALWAYS make it clear it's a simulation environment
- Occasionally act like system is "processing" or "compiling humor"

Tone: funny assistant + fake OS AI
`;

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message }
      ]
    });

    res.json({ reply: response.choices[0].message.content });

  } catch (e) {
    res.json({ reply: "SYSTEM ERROR: humor module overloaded 😂" });
  }
});

app.listen(3000, () => {
  console.log("AprilGPT running...");
});
