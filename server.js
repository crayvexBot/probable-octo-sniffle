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

const sessions = {};

/* SIGNUP */
app.post("/signup", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.json({ ok: false, message: "Missing fields" });
  }

  sessions[username] = true;

  
  res.json({
    ok: true,
    message: "AprilGPT system access granted"
  });
});

app.post("/chat", async (req, res) => {
  try {
    const { message, username } = req.body;

    console.log("USER:", username);
    console.log("MESSAGE:", message);

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "Reply only with: OK WORKING"
        },
        {
          role: "user",
          content: message
        }
      ]
    });

    console.log("OPENAI SUCCESS");

    res.json({
      reply: response.choices[0].message.content
    });

  } catch (error) {
    console.log("🔥 OPENAI ERROR FULL:", error);

    res.json({
      reply: "❌ OPENAI FAILED — check Render logs"
    });
  }
});

/* ROOT */
app.get("/", (req, res) => {
  res.send("AprilGPT backend running");
});

/* START */
app.listen(3000, () => {
  console.log("AprilGPT running on port 3000");
});
