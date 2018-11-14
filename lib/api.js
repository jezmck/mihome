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

/**
 * The majority of methods can be boiled down to a POST request with an ID and so this method manages that.
 * @param endpoint Specific endpoint of the API.
 * @param id The ID that you want sent, it is parsed as an Int.
 * @param focus Any specific focus of the response, usually just 'data'
 * @param callback Callback.
 */
function postWithID(endpoint, id, focus, callback) {
	const URL = `${BASE_URL}${endpoint}`;
	request({
		url: URL,
		method: 'POST',
		headers: {
			'User-Agent': user_agent,
		},
		auth: {
			'username': accessEmail,
			'password': accessKey,
		},
		json: {
			'id' : parseInt(id),
		},
	}, (err, res, body) => {
		if (body.status !== 'success') {
			callback(`Status: ${body.status}`);
		} else {
			let response = body;
			if (focus) {
				response = response[focus];
			}
			callback(null, response);
		}
	});
}

module.exports = {
	fetchUserProfile: (callback) => simpleGET('/api/v1/users/profile', 'data', callback),

	getAPIKey: (email, password, callback) => getAPIKey(email, password, callback),
	login: (email, apiKey) => login(email, apiKey),

	devices: {
		list: (callback) => simpleGET('/api/v1/devices/list', 'data', callback),
		delete: (id, callback) => postWithID('/api/v1/devices/delete', id, 'data', callback),
	},

	subDevices: {
		list: (callback) => simpleGET('/api/v1/subdevices/list', 'data', callback),
		delete: (id, callback) => postWithID('/api/v1/subdevices/delete', id, 'data', callback),
		powerOn: (id, callback) => postWithID('/api/v1/subdevices/power_on', id, 'data', callback),
		powerOff: (id, callback) => postWithID('/api/v1/subdevices/power_off', id, 'data', callback),
	},

	subDeviceGroup: {
		list: (callback) => simpleGET('/api/v1/device_groups/list', 'data', callback),
		delete: (id, callback) => postWithID('/api/v1/device_groups/delete', id, 'data', callback),
		powerOn: (id, callback) => postWithID('/api/v1/device_groups/power_on', id, 'data', callback),
		powerOff: (id, callback) => postWithID('/api/v1/device_groups/power_off', id, 'data', callback),
	},

	pushNotifications: {
		list: (callback) => simpleGET('/api/v1/notifications/list', 'data', callback),
	},

	timers: {
		list: (subdevice_id, callback) => postWithID('/api/v1/timers/list', subdevice_id, 'data', callback),
	},
};
