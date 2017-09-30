const cheerio = require('cheerio');
const config = require('./config.js');
const request = require('request');
var cookieJar = request.jar();
const host = 'https://www.dcard.tw/'
var rq = request.defaults({
    baseUrl: host,
    headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36'
    },
    jar: cookieJar
});

// Return today's Dcard infomation
exports.getDcard = async () => {
    try {
        const response = await login();
        // Check if login success
        if (response.statusCode == 204) {
            const options = {
                method: 'GET',
                uri: '/_api/dcard',
                headers: {
                    'x-csrf-token': response.headers['x-csrf-token']
                }
            }
            const dcard = await promiseRequest(options);

            return JSON.parse(dcard.body);
        }
    } catch (e) {
        console.error(e);
    }
};

// Send invitation request to Dcard
exports.sendInvitation;


// Return x-csrf-token string
const getCSRFToken = async () => {
    try {
        // Request '/_api/_ping' to get x-csrf-token
        const options = {
            method: 'GET',
            uri: '/_api/_ping',
        }
        const response = await promiseRequest(options);

        if (response.headers['x-csrf-token'] != undefined) {
            return response.headers['x-csrf-token'];
        }
    } catch (e) {
        console.error(e);
    }

}

const login = async () => {
    try {
        // Request '/_api/sessions' to login
        const options = {
            method: "POST",
            uri: '/_api/sessions',
            headers: {
                'x-csrf-token': await getCSRFToken()
            },
            json: true,
            body: {
                email: config.email,
                password: config.password
            }
        }

        return await promiseRequest(options);
    } catch (e) {
        console.error(e);
    }
}
exports.login = login;

const promiseRequest = (options) => {
    return new Promise((reslove, reject) => {
        rq(options, (error, response, body) => {
            if (!error) {
                return reslove(response);
            }
            return reject(error);
        });
    });
}
