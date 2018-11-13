const request = require('request');
const moment = require('moment');
const user_agent = 'mihome';
const BASE_URL = 'http://mihome4u.co.uk';
const formatTime = 'YYYY-MM-DD[T]HH:mm:SS.SSS[Z]';

let authentication = '';

function login(email, apiKey) {
	authentication = 'Basic ' + Buffer.from(email + ':' + apiKey).toString('base64');
	console.log(authentication);
}

function getAPIKey(email, password, callback) {
	const auth = 'Basic ' + Buffer.from(email + ':' + password).toString('base64');
	request({
		url: 'https://mihome4u.co.uk/api/v1/users/profile',
		headers: {
			'Authorization': auth,
			'User-Agent': user_agent,
		},
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

function apiGet(endpoint, focus, callback) {
	const URL = `${BASE_URL}${endpoint}`;
	console.log(`Endpoint: ${endpoint}, Focus: ${focus}`);
	request({
		url: URL,
        method: 'GET',
		headers: {
			'User-Agent': user_agent,
			'Authorization': authentication,
		},
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
	apiRequest: (endpoint, params, focus, callback) => apiGet(endpoint, params, focus, callback), // legacy method for quick scripting.
};
