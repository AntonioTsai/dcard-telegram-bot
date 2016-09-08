/**
 * Created by antonio on 9/8/16.
 */

const request = require('request');
const cheerio = require('cheerio');

var url = 'https://www.dcard.tw/login';

request(url, function(error, response, body) {
    if(!error && response.statusCode == 200) {
        let $ = cheerio.load(body);
        let regExp = /csrfToken":"[^"]+/g;
        let csrfToken = $('script').text().match(regExp)[0].split('"').slice(-1)[0];
    }
});
