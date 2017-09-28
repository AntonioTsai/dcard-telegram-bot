const cheerio = require('cheerio');
const config = require('./config.js');
const request = require('request');
var rq = request.defaults({
    baseUrl: 'https://www.dcard.tw/_api/',
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
                return resolve(response.headers['x-csrf-token']);
            }
            return reject(error);
        });
    });
}
