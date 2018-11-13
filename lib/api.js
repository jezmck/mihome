const request = require('request');
const moment = require('moment');
const user_agent = 'mihome';
const BASE_URL = 'http://mihome4u.co.uk';
const formatTime = 'YYYY-MM-DD[T]HH:mm:SS.SSS[Z]';

let authentication = '';

function login(email, apiKey) {
    authentication = 'Basic ' + Buffer.from(email + ':' + apiKey).from('base64');
}

function getAPIKey(username, password, callback) {
    let auth = 'Basic ' + Buffer.from(username + ':' + password).toString('base64');
    request({
       url: 'https://mihome4u.co.uk/api/v1/users/profile',
        headers: {
            "Authorization": auth,
            "User-Agent": user_agent
        }
    }, (err, res, body) => {
        try {
            let json = JSON.parse(body);
            if (json.status === 'success') {
                callback(null, json['data'].api_key);
            } else {
                callback(`Request Error: ${json.status}`);
            }
        } catch (err) {
            callback(err);
        }
    });
}

module.exports = {
    getAPIKey: (username, password, callback) => getAPIKey(username, password, callback),
    login: (apiKey) => login(apiKey),
};
