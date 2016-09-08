/**
 * Created by antonio on 9/8/16.
 */

const request = require('request');
const cheerio = require('cheerio');
const url = 'https://www.dcard.tw';
const email = '';
const pwd = '';

var regExp = /csrfToken":"[^"]+/g;
var headers = {
    cookie: '',
    'content-type': 'application/json',
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2743.116 Safari/537.36',
    'x-csrf-token' : ''
};

request(url + '/login', (error, response, body) => {
    if(!error && response.statusCode == 200) {
        let $ = cheerio.load(body);
        headers['x-csrf-token'] = $('script').text().match(regExp)[0].split('"').slice(-1)[0];
        response.headers['set-cookie'].forEach(d => {
           headers.cookie += d.split(';')[0] + '; ';
        });

        console.log('CSRF-Token', headers['x-csrf-token']);
        console.log('Cookie', headers['cookie']);
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
        });
    }
});
