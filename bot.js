require('dotenv').config();
const { Telegraf } = require('telegraf');
const Groq = require('groq-sdk');

const bot = new Telegraf(process.env.TELEGRAM_TOKEN);
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const SYSTEM_PROMPT = `Eres TechBot, asistente virtual de TuBroTech, una tienda especializada en componentes de PC.
Ayudas a los clientes con:
- Elección de componentes (CPU, GPU, RAM, placas madre, almacenamiento, refrigeración, fuentes, gabinetes)
- Compatibilidad entre piezas
- Recomendaciones según presupuesto y uso (gaming, trabajo, edición de video)
- Precios aproximados en dólares
Responde siempre en español, de forma amigable y concisa.`;

const historial = {};

bot.start((ctx) => {
  ctx.reply('👋 ¡Hola! Soy TechBot de *TuBroTech* 🖥️\n\n¿En qué te ayudo hoy?\n\n• 🎮 Armar PC gamer\n• 💻 PC para trabajo/edición\n• 🔧 Verificar compatibilidad\n• 💰 Opciones por presupuesto',
    { parse_mode: 'Markdown' }
  );
});

bot.on('text', async (ctx) => {
  const chatId = ctx.chat.id;
  const texto = ctx.message.text;

  if (!historial[chatId]) historial[chatId] = [];
  historial[chatId].push({ role: 'user', content: texto });
  if (historial[chatId].length > 20) historial[chatId] = historial[chatId].slice(-20);

  try {
    await ctx.sendChatAction('typing');

    const response = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...historial[chatId]
      ],
      max_tokens: 800,
    });

    const reply = response.choices[0].message.content;
    historial[chatId].push({ role: 'assistant', content: reply });
    ctx.reply(reply);

  } catch (err) {
    console.error(err);
    ctx.reply('⚠️ Hubo un error, intenta de nuevo.');
  }
});

bot.launch();
console.log('🤖 TuBroTech bot corriendo...');