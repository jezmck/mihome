const request = require('request');
const moment = require('moment');
const user_agent = 'mihome';
const BASE_URL = 'http://mihome4u.co.uk';
const formatTime = 'YYYY-MM-DD[T]HH:mm:SS.SSS[Z]';

let accessEmail = '';
let accessKey = '';

/**
 * If you already have an API key use this function.
 * @param email Your email to login to https://mihome4u.co.uk/
 * @param apiKey Your API key that you would have got through either getAPIKey() or other means.
 */
function login(email, apiKey) {
	accessEmail = email;
	accessKey = apiKey;
}

/**
 * Gets an API Key from your Username and Password.
 * @param email Your email to login to https://mihome4u.co.uk/
 * @param password Your password, unfortuan
 * @param callback
 */
function getAPIKey(email, password, callback) {
	request({
		url: 'https://mihome4u.co.uk/api/v1/users/profile',
		headers: {
			'User-Agent': user_agent,
		},
		auth: {
			'username': accessEmail,
			'password': accessKey,
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

/**
 * Turns devices either on or off.
 * @param state Either 1 or 'on' for on and 0 or 'off' for off.
 * @param id Id of the thing to power.
 */
function power(state, id, callback) {
	let URL = 'https://mihome4u.co.uk/api/v1/subdevices/power_';
	const newState = state.toLowerCase;
	if (state === 1 || newState === 'on') {
		URL += 'on';
	} else if (state === 0 || newState === 'off') {
		URL += 'off';
	}
	request({
		url: URL,
		headers: {
			'User-Agent': 'mihome',
		},
		auth: {
			'username': accessEmail,
			'password': accessKey,
		},
		json: {
			'id': parseInt(id),
		},
	}, (err, res, body) => {
		if (body.status !== 'success') {
			callback(`Request Error: ${body.status}`);
		} else {
			callback(null, body['data']);
		}
	});
}

function simpleGET(endpoint, focus, callback) {
	const URL = `${BASE_URL}${endpoint}`;
	request({
		url: URL,
		method: 'GET',
		headers: {
			'User-Agent': user_agent,
		},
		auth: {
			'username': accessEmail,
			'password': accessKey,
		},
	}, (err, res, body) => {
		if (body.status !== 'success') {
			try {
				let json = JSON.parse(body);
				if (focus) {
					json = json[focus];
				}
				callback(null, json);
			} catch (err) {
				callback(`Request Error: ${err}`);
			}
		} else {
			callback(null, body);
		}
	});
}

module.exports = {
	fetchUserProfile: (callback) => simpleGET('/api/v1/users/profile', 'data', callback),

	getAPIKey: (email, password, callback) => getAPIKey(email, password, callback),
	login: (email, apiKey) => login(email, apiKey),

	devices: {
		list: (callback) => simpleGET('/api/v1/devices/list', 'data', callback),
	},

	subDevices: {
	    list: (callback) => simpleGET('/api/v1/subdevices/list', null, callback),
		power: {
	        on: (id, callback) => {
	            power(1, id, callback);
			},
			off: (id, callback) => {
				power(0, id, callback);
			},
		},
	},
};
