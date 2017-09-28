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