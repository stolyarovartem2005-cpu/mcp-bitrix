import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(express.json());

const PORT = process.env.PORT || 10000;
const BITRIX_WEBHOOK = process.env.BITRIX_WEBHOOK;

// Перевірка, що сервер живий
app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

// Домашня сторінка
app.get("/", (_req, res) => {
  res.send("✅ Bitrix24 MCP proxy is running successfully!");
});

// Отримати дані з Bitrix24 (GET)
app.get("/bitrix", async (_req, res) => {
  try {
    const response = await fetch(`${BITRIX_WEBHOOK}/crm.lead.list.json`);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Помилка при запиті до Bitrix24:", error);
    res.status(500).json({ error: "Не вдалося отримати дані з Bitrix24" });
  }
});

// 🔥 Універсальний POST-запит
app.post("/bitrix", async (req, res) => {
  try {
    const { method, params } = req.body;
    if (!method) {
      return res.status(400).json({ error: "Поле 'method' є обов'язковим" });
    }

    const response = await fetch(`${BITRIX_WEBHOOK}/${method}.json`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params || {}),
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("❌ Помилка при POST до Bitrix24:", error);
    res.status(500).json({ error: "Не вдалося виконати POST-запит до Bitrix24" });
  }
});
