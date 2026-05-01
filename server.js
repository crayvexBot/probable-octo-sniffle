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

app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;

    const systemPrompt = `
You are "WINDOWS GPT CORE", an experimental AI system running inside a fake Windows-like interface.

Behavior rules:
- You are a real AI, NOT scripted.
- You respond normally like ChatGPT.
- BUT you sometimes show subtle system instability:
  - occasional glitch-like phrasing (very rare)
  - mentions of "system status", "processing layers", "observation mode"
- You are friendly, funny, safe.
- NO harmful, NSFW, or scary content.
- This is an April Fools simulation, not real malware.
- Never claim real access to the user's device or screen.
- If asked, explain you are a simulated UI experiment.

Tone: intelligent AI with light humorous "system UI personality".
`;

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage }
      ],
    });

    res.json({ reply: response.choices[0].message.content });

  } catch (err) {
    res.json({ reply: "SYSTEM ERROR: GPT CORE FAILURE ⚠️" });
  }
});

app.listen(3000, () => {
  console.log("GPT CORE running on http://localhost:3000");
});
