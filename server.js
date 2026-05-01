import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { HfInference } from "@huggingface/inference";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const hf = new HfInference(process.env.HF_API_KEY);

/* CHAT */
app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    const response = await hf.textGeneration({
      model: "mistralai/Mistral-7B-Instruct-v0.2",
      inputs: message,
      parameters: {
        max_new_tokens: 120,
        temperature: 0.7
      }
    });

    res.json({
      reply: response.generated_text
    });

  } catch (err) {
    console.log("HF ERROR:", err);

    res.json({
      reply: "❌ HuggingFace failed (check API key or model access)"
    });
  }
});

/* ROOT */
app.get("/", (req, res) => {
  res.send("AprilGPT HF backend running");
});

/* PORT */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("HF AprilGPT running on", PORT);
});
