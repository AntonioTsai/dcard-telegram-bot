process.env.TZ = 'Asia/Taipei';
const Dcard = require('./dcard.js');
const TelegramBot = require('node-telegram-bot-api');
const TOKEN = process.env.TOKEN;
const NODE_ENV = process.env.NODE_ENV;
const welcomeMessage = `Hello! I'm Dcard bot.
By the way, I'm still in development.`;
var bot;


switch (NODE_ENV) {
    case "development":
        bot = new TelegramBot(TOKEN, { polling: true });
        break;
    case "production":
        const options = {
            webHook: {
                // Port to which you should bind is assigned to $PORT variable
                // See: https://devcenter.heroku.com/articles/dynos#local-environment-variables
                port: process.env.PORT
            }
        };
        // Heroku routes from port :443 to $PORT
        // Add URL of your app to env variable or enable Dyno Metadata
        // to get this automatically
        // See: https://devcenter.heroku.com/articles/dyno-metadata
        const url = process.env.APP_URL || `https://${process.env.HEROKU_APP_NAME}.herokuapp.com:443`;
        bot = new TelegramBot(TOKEN, options);

        // This informs the Telegram servers of the new webhook.
        // Note: we do not need to pass in the cert, as it already provided
        bot.setWebHook(`${url}/bot${TOKEN}`);
        break;
    default:
        bot = new TelegramBot(TOKEN, { polling: true });
        break;
}

// TODO Handle event callback_query
bot.on('callback_query', (msg) => {
    // console.log(msg);
    /**
     * Telegram clients will display a progress bar until you call answerCallbackQuery,
     * so call it without specifying any of the optional parameters will not send notification.
     */
    bot.answerCallbackQuery({
        callback_query_id: msg.id,
        text: "Feature Coming Soon"
    });
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
                },
                {
                    text: "Get Info",
                    callback_data: "getInfo"
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
