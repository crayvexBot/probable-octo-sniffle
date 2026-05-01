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

/* SIMPLE SESSION SYSTEM */
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

  sessions[username] = true;

  res.json({
    ok: true,
    message: "SYSTEM ACCESS GRANTED — AprilGPT simulation active"
  });
});

/* CHAT */
app.post("/chat", async (req, res) => {
  try {
    const { message, username } = req.body;

    if (!sessions[username]) {
      return res.json({
        reply: "ACCESS DENIED. Run SIGNUP protocol."
      });
    }

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are AprilGPT, a funny simulation AI. Be helpful, slightly humorous, and stay clearly fictional."
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
    console.log("OpenAI error:", error);

    res.json({
      reply: "⚠ SYSTEM NOTICE: AI temporarily unavailable (simulation fallback active)"
    });
  }
});

/* ROOT */
app.get("/", (req, res) => {
  res.send("🟡 AprilGPT backend running");
});

/* START */
app.listen(3000, () => {
  console.log("AprilGPT running");
});
