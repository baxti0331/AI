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

  // Отправляем обратно тот же текст
  const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;

  const fetch = require('node-fetch');

  await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text: userText }),
  });

  res.status(200).send('OK');
};