const cheerio = require('cheerio');
const config = require('./config.js');
const request = require('request');
var rq = request.defaults({
    baseUrl: 'https://www.dcard.tw/_api/',
    headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36'
    },
    jar: true
});

// Return today's Dcard infomation
exports.getDcard;

// Send invitation request to Dcard
exports.sendInvitation;


const getCSRFToken = () => {
    return new Promise((resolve, reject) => {
        // Send request to /_ping to get x-csrf-token
        rq.get('/_ping', (error, response, body) => {
            if (!error) {
                if (response.headers['x-csrf-token'] != undefined) {
                    return resolve(response.headers['x-csrf-token']);
                } else {
                    return reject('No x-csrf-token in headers');
                }
            }
            return reject(error);
        });
    });
}
