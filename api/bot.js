const fetch = require('node-fetch');

const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const HF_API_KEY = process.env.HF_API_KEY;
const HF_API_URL = "https://api-inference.huggingface.co/models/Qwen/Qwen2.5-Coder-32B-Instruct";

async function queryHfApi(prompt) {
  const response = await fetch(HF_API_URL, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${HF_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      inputs: prompt,
      parameters: { max_new_tokens: 100, do_sample: false }
    }),
  });
  if (!response.ok) {
    return `Ошибка: ${response.status}`;
  }
  const data = await response.json();
  return data[0].generated_text;
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).send('Only POST requests allowed');
  }

  const update = req.body;
  if (!update.message || !update.message.text) {
    return res.status(200).send('No message');
  }

  const chatId = update.message.chat.id;
  const userText = update.message.text;

  const botReply = await queryHfApi(userText);

  // Отправляем ответ обратно в Telegram
  await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text: botReply
    }),
  });

  res.status(200).send('OK');
};
