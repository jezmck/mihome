const request = require('request');
const moment = require('moment');
const user_agent = 'mihome';
const BASE_URL = 'http://mihome4u.co.uk';
const formatTime = 'YYYY-MM-DD[T]HH:mm:SS.SSS[Z]';

let accessEmail = '';
let accessKey = '';

function login(email, apiKey) {
	accessEmail = email;
	accessKey = apiKey;
}

function getAPIKey(email, password, callback) {
	request({
		url: 'https://mihome4u.co.uk/api/v1/users/profile',
		headers: {
			'User-Agent': user_agent,
		},
		auth: {
			'username': accessEmail,
			'password': accessKey
		}
	}, (err, res, body) => {
		try {
			const json = JSON.parse(body);
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

function apiGET(endpoint, focus, callback) {
	const URL = `${BASE_URL}${endpoint}`;
	console.log(`Endpoint: ${endpoint}, Focus: ${focus}`);
	request({
		url: URL,
        method: 'GET',
		headers: {
			'User-Agent': user_agent,
		},
        auth: {
		    'username': accessEmail,
            'password': accessKey
        }
	}, (err, res, body) => {
		try {
			const json = JSON.parse(body);
			if (json.status === 'success') {
				if (focus) {
					callback(null, json['data'][focus]);
				} else {
					callback(null, json['data']);
				}
			} else {
				callback(`Request Error: ${json.status}`);
			}
		} catch (err) {
			callback(err);
		}
	});
}

module.exports = {
	getAPIKey: (email, password, callback) => getAPIKey(email, password, callback),
	login: (email, apiKey) => login(email, apiKey),
    subDevices: {
	    list: (callback) => apiGET('/api/v1/subdevices/list', null, callback),
        power: {
	        on: (id, callback) => {
	            power(1, id, callback);
            },
            off: (id, callback) => {
                power(0, id, callback);
            },
        },
    }
};
