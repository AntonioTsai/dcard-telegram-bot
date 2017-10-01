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

bot.onText(/Get Dcard/, async (msg) => {
    try {
        console.log(`[${new Date().toLocaleString('zh-TW')}][User ${msg.chat.id}] ${msg.chat.username} request today's dcard.`);

        // Let user see status 'sending photo'
        bot.sendChatAction(msg.chat.id, 'upload_photo');

        const dcard = await Dcard.getDcard();
        const options = {
            caption: `${dcard.dcard.gender == "M" ? "男同學" : "女同學"} ${dcard.dcard.school} ${dcard.dcard.department}`,

            /**
             * dcard.accept == false => have not send invitation yet
             * Show inline keyboard button to enable user to send request
             */
            reply_markup: dcard.accept ? {} : {
                inline_keyboard: [[{
                    text: "Send Invitation",
                    callback_data: "sendInvitation"
                }]]
            }
        };

        bot.sendPhoto(msg.chat.id, dcard.dcard.avatar, options);
    } catch (e) {
        console.log(e);
    }
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
