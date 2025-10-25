import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(express.json());

const PORT = process.env.PORT || 10000;
const BITRIX_WEBHOOK = process.env.BITRIX_WEBHOOK;

// Основний маршрут
app.get("/", (_req, res) => {
  res.send("✅ Bitrix24 MCP proxy is running successfully!");
});

// Приклад маршруту для отримання даних з Bitrix24
app.get("/bitrix", async (req, res) => {
  try {
    const response = await fetch(`${BITRIX_WEBHOOK}/crm.lead.list.json`);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Помилка при зверненні до Bitrix:", error);
    res.status(500).json({ error: "Не вдалося отримати дані з Bitrix24" });
  }
});

// Запуск сервера
app.listen(PORT, () => console.log(`🚀 Server is running on port ${PORT}`));
