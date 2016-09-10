const request = require('request');
const cheerio = require('cheerio');
const Telegram = require('node-telegram-bot-api');
const config = require('./config.js');
const url = 'https://www.dcard.tw';
const email = config.email;
const pwd = config.password;
const token = config.token;
const bot = new Telegram(token, {polling: true});

var regExp = /csrfToken":"[^"]+/g;
var headers = {
    cookie: '',
    'content-type': 'application/json',
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2743.116 Safari/537.36',
    'x-csrf-token': ''
};

const setCookies = (cookies) => {
    if(cookies) {
        headers.cookie = '';
        cookies.forEach(d => {
            headers.cookie += d.split(';')[0] + '; ';
        });
    }
};

const getDcard = (chatId) => {
    request(url + '/login', (error, response, body) => {
        if(!error && response.statusCode == 200) {
            let $ = cheerio.load(body);
            headers['x-csrf-token'] = $('script').text().match(regExp)[0].split('"').slice(-1)[0];
            setCookies(response.headers['set-cookie']);

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
                console.log(response.statusCode);
                headers['x-csrf-token'] = response.headers['x-csrf-token'];
                setCookies(response.headers['set-cookie']);

                if(!error && response.statusCode == '204') {
                    request(url + '/_api/dcard', {headers}, (error, response, body) => {
                        if(!error && response.statusCode == '200') {
                            let card = JSON.parse(body).dcard;
                            bot.sendPhoto(chatId, card.avatar, {caption: card.gender + ' ' + card.school + ' ' + card.department})
                                .catch((e) => {
                                    /*
                                     * Error: 400 {"ok":false,"error_code":400,"description":"Wrong file identifier\/HTTP URL specified"}
                                     * May cause by wrong headers(e.g., 'content-type:text/plain; charset=utf-8')
                                     */
                                    console.log(e);
                                    bot.sendMessage(chatId, 'Encounter an unknown error\n' +
                                        'The Dcard avatar is unavailable.\n' +
                                        'Here is the avatar URL.\n' + card.avatar);
                                });
                        }
                    });
                }
            });
        }
    });
};

bot.onText(/\/dcard/, msg => {
    //1console.log(msg);
    bot.sendMessage(msg.chat.id, 'Dcard is loading... Please Wait')
        .then(msg => {
            getDcard(msg.chat.id);
        });
});
