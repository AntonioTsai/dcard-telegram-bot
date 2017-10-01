process.env.TZ = 'Asia/Taipei';
const config = require('./config.js');
const Dcard = require('./dcard.js');
const TelegramBot = require('node-telegram-bot-api');
const token = config.token;
const bot = new TelegramBot(token, { polling: true });
const welcomeMessage = `Hello! I'm Dcard bot.
By the way, I'm still in development.`;


bot.onText(/\/accept/, msg => {
    //1console.log(msg);
    // bot.sendMessage(msg.chat.id, 'Sending invite... Please Wait')
    //     .then(msg => {
    //         sendAcceptance(msg.chat.id);
    //     });
});

bot.onText(/\/dcard/, msg => {
    //1console.log(msg);
    // bot.sendMessage(msg.chat.id, 'Dcard is loading... Please Wait')
    //     .then(msg => {
    //         getDcard(msg.chat.id);
    //     });
});

/**
 * Send welcome message when user send '/start',
 * and set a "Get Dcard" custom keyboard on user's chat screen.
 */
bot.onText(/\/start/, (msg) => {
    console.log(`[${new Date().toLocaleString('zh-TW')}][User ${msg.chat.id}] ${msg.chat.username} start using this bot.`);

    bot.sendMessage(msg.chat.id, welcomeMessage, {
        "reply_markup": {
            "keyboard": [["Get Dcard"]],
            "resize_keyboard": true
        }
    });
});
