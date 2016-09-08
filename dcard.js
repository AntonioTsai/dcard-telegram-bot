/**
 * Created by antonio on 9/8/16.
 */

const request = require('request');
const cheerio = require('cheerio');
const url = 'https://www.dcard.tw';
const email = '';
const pwd = '';

request(url + '/login', (error, response, body) => {
    if(!error && response.statusCode == 200) {
        let $ = cheerio.load(body);
        let regExp = /csrfToken":"[^"]+/g;
        let csrfToken = $('script').text().match(regExp)[0].split('"').slice(-1)[0];
        let cookies = '';
        response.headers['set-cookie'].forEach(d => {
           cookies += d.split(';')[0] + '; ';
        });

        //console.log(csrfToken);
        //console.log(cookies);

        let options = {
            url: url + '/_api/sessions',
            headers: {
                cookie: cookies,
                'content-type': 'application/json',
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2743.116 Safari/537.36',
                'x-csrf-token': csrfToken
            },
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
