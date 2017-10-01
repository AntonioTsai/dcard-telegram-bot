process.env.TZ = 'Asia/Taipei';
const config = require('./config.js');
const TelegramBot = require('node-telegram-bot-api');
const token = config.token;
const bot = new TelegramBot(token, { polling: true });
const welcomeMessage = `Hello! I'm Dcard bot.
By the way, I'm still in development.`;


const getDcard = (chatId) => {
    request(url + '/login', (error, response, body) => {
        if(!error && response.statusCode == 200) {
            let $ = cheerio.load(body);
            let regExp = /csrfToken":"[^"]+/g;
            setHeaders(response.headers['set-cookie'], $('script').text().match(regExp)[0].split('"').slice(-1)[0]);

            let options = {
                url: url + '/_api/sessions',
                headers: headers,
                json: true,
                body: {
                    email: email,
                    password: pwd
                }
            };
            request.post(options, (error, response, body) => {
                setHeaders(response.headers['set-cookie'], response.headers['x-csrf-token']);

                if(!error && response.statusCode == '204') {
                    request(url + '/_api/dcard', {headers}, (error, response, body) => {
                        if(!error && response.statusCode == '200') {
                            setHeaders(response.headers['set-cookie'], response.headers['x-csrf-token']);
                            let card = JSON.parse(body).dcard;
                            let caption = card.gender + ' ' + card.school + ' ' + card.department;
                            bot.sendPhoto(chatId, card.avatar, {caption: caption})
                                .catch((e) => {
                                    request({url: card.avatar, encoding: null}, (error, response, body) => {
                                        bot.sendPhoto(chatId, body, {caption: caption});
                                    });
                                });
                        }
                    });
                }
            });
        }
    });
};

const sendAcceptance = (chatId) => {
    let option = {
        url: url + '/_api/dcard/accept',
        headers: headers,
        json: true,
        body: {firstMessage: "Hi by telegram bot."},
    };
    request.post(option, (error, response, body) => {
        if(!error && response.statusCode == '200') {
            bot.sendMessage(chatId, 'Accepted.');
        } else {
            let message = error + ' ' + response.statusCode;
            bot.sendMessage(chatId, 'Oops! Something went wrong.\nHow about accept him/her yourself?');
        }
        console.log(error, 'Status Code', response.statusCode);
        console.log(body);
    });
};

const setHeaders = (cookies = '', csrfToken = headers['x-csrf-token']) => {
    headers['x-csrf-token'] = csrfToken;
    if(cookies) {
        cookies.forEach(d => {
            let cookieName = d.split('=')[0];
            let cookieContent = d.split(';')[0] + '; ';
            let reg = new RegExp(cookieName + '=[^ ]+ ', 'g');
            // Replace
            headers.cookie = headers.cookie.replace(reg, cookieContent);
            // Check d in cookie
            if (!headers.cookie.match(cookieName)) {
                headers.cookie += cookieContent;
            }
        });
    }
};

bot.onText(/\/accept/, msg => {
    //1console.log(msg);
    bot.sendMessage(msg.chat.id, 'Sending invite... Please Wait')
        .then(msg => {
            sendAcceptance(msg.chat.id);
        });
});

bot.onText(/\/dcard/, msg => {
    //1console.log(msg);
    bot.sendMessage(msg.chat.id, 'Dcard is loading... Please Wait')
        .then(msg => {
            getDcard(msg.chat.id);
        });
});

/**
 * Send welcome message when user send '/start',
 * and set a "Get Dcard" custom keyboard on user's chat screen.
 */
bot.onText(/\/start/, (msg) => {
    bot.sendMessage(msg.chat.id, welcomeMessage, {
        "reply_markup": {
            "keyboard": [["Get Dcard"]],
            "resize_keyboard": true
        }
    })
});
