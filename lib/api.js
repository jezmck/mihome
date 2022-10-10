const request = require('request-promise');
const USER_AGENT = 'npmjs/mihome';
const BASE_URL = 'https://mihome4u.co.uk';

let accessEmail = '';
let accessKey = '';

/**
 * If you already have an API key use this function.
 * @param email Your email to login to https://mihome4u.co.uk/
 * @param apiKey Your API key that you would have got through either getAPIKey() or other means.
 */
async function login(email, apiKey) {
	accessEmail = email;
	accessKey = apiKey;
}

/**
 * Gets an API Key from your Username and Password.
 * @param email Your email to login to https://mihome4u.co.uk/
 * @param password Your password, unfortunately
 */
async function getAPIKey(username, password) {
	return new Promise((resolve, reject) => {
		request({
			url: 'https://mihome4u.co.uk/api/v1/users/profile',
			headers: {
				'User-Agent': USER_AGENT,
			},
			auth: {
				'username': username,
				'password': password,
			},
			json: true,
		}).then(body => {
			if (!body.hasOwnProperty('status')) {
				reject('Body does not have the property status, most likely an error in the request');
			} else if (body.status !== 'success' || !body.hasOwnProperty('data')) {
				reject(body.status);
			} else {
				resolve(body['data'].api_key);
			}
		}).catch(err => reject(err));
	});
}


async function simpleGET(endpoint, focus) {
	return new Promise((resolve, reject) => {
		const URL = `${BASE_URL}${endpoint}`;
		request({
			url: URL,
			method: 'GET',
			headers: {
				'User-Agent': USER_AGENT,
			},
			auth: {
				'username': accessEmail,
				'password': accessKey,
			},
			json: true,
		}, (err, res, body) => {
			if (err) {
				reject(err);
			} else if (!body.hasOwnProperty('status')) {
				reject('Body does not have the property status, most likely an error in the request');
			} else if (!body.status === 'success' || !body.hasOwnProperty('data')) {
				reject(body.status);
			} else if (!body.hasOwnProperty(focus)) {
				reject('Focus provided was not found, this is within the API. Please report this.');
			} else {
				resolve(body[focus]);
			}
		});
	});
}

/**
 * The majority of methods can be boiled down to a POST request with an ID and so this method manages that.
 * @param endpoint Specific endpoint of the API.
 * @param id The ID that you want sent, it is parsed as an Int.
 * @param focus Any specific focus of the response, usually just 'data'
 */
async function postWithID(endpoint, id, focus) {
	return new Promise((resolve, reject) => {
		const URL = `${BASE_URL}${endpoint}`;
		request({
			url: URL,
			method: 'POST',
			headers: {
				'User-Agent': USER_AGENT,
			},
			auth: {
				'username': accessEmail,
				'password': accessKey,
			},
			json: {
				'id' : parseInt(id),
			},
		}, (err, res, body) => {
			if (err) {
				reject(err);
			} else if (!body.hasOwnProperty('status')) {
				reject('Body does not have the property status, most likely an error in the request');
			} else if (!body.status === 'success' || !body.hasOwnProperty('data')) {
				reject(body.status);
			} else if (!body.hasOwnProperty(focus)) {
				reject('Focus provided was not found, this is within the API. Please report this.');
			} else {
				resolve(body[focus]);
			}
		});
	});
}

/**
 * Fetches Usage Data for a specific id.
 * @param id
 * @param data_type
 * @param resolution
 * @param start_time
 * @param end_time
 * @param limit
 * @returns {Promise<any>}
 */
async function fetchUsageData(id, data_type, resolution, start_time, end_time, limit) {
	return new Promise((resolve, reject) => {
		const dataType = ['watts', 'reported_temperature'];
		const resoloutionOptions = ['instant', 'hourly', 'daily'];
		if (dataType.indexOf(data_type) === -1) {
			reject(`Data Type must be 'watts' or 'reported_temperature', you provided. ${data_type}`);
		} else if (resoloutionOptions.indexOf(resolution) === -1) {
			reject(`Resolution must be 'instant', 'hourly' or 'daily, you provided ${resolution}`);
		} else {
			request({
				url: 'https://mihome4u.co.uk/api/v1/subdevices/get_data',
				method: 'POST',
				headers: {
					'User-Agent': USER_AGENT,
				},
				auth: {
					'username': accessEmail,
					'password': accessKey,
				},
				json: {
					'id' : parseInt(id),
					'data_type': data_type,
					'resolution': resolution,
					'start_time': start_time,
					'end_time': end_time,
					'limit': parseInt(limit),
				},
			}, (err, res, body) => {
				if (err) {
					reject(err);
				} else if (!body.hasOwnProperty('status')) {
					reject('Body does not have the property status, most likely an error in the request');
				} else if (!body.status === 'success' || !body.hasOwnProperty('data')) {
					reject(body.status);
				} else {
					resolve(body['data']);
				}
			});
		}
	});
}

/**
 * Toggles the state for a certain id.
 * @param id Specific ID to control.
 * @returns {Promise<any>}
 */
async function toggleState(id) {
	return new Promise((resolve, reject) => {
		request({
			url: 'https://mihome4u.co.uk/api/v1/subdevices/show',
			method: 'POST',
			headers: {
				'User-Agent': USER_AGENT,
			},
			auth: {
				'username': accessEmail,
				'password': accessKey,
			},
			json: {
				'id': parseInt(id),
				'include_usage_data': 0,
			},
		}).then(body => {
			if (body['data'].power_state === 0 || body['data'].power_state === false) {
				postWithID('/api/v1/subdevices/power_on', id, 'data').then(res => resolve(res)).catch(err => reject(err));
			} else {
				postWithID('/api/v1/subdevices/power_off', id, 'data').then(res => resolve(res)).catch(err => reject(err));
			}
		});
	});
}

async function subDeviceInformation(id, showHistoryData) {
	return new Promise((resolve, reject) => {
		request({
			url: 'https://mihome4u.co.uk/api/v1/subdevices/show',
			method: 'POST',
			headers: {
				'User-Agent': USER_AGENT,
			},
			auth: {
				'username': accessEmail,
				'password': accessKey,
			},
			json: {
				'id': parseInt(id),
				'include_usage_data': parseInt(showHistoryData),
			},
		}).then(body => {
			resolve(body['data']);
		}).catch(err => reject(err));
	});
}

module.exports = {
	getUserProfile: () => simpleGET('/api/v1/users/profile', 'data'),

	getAPIKey: (email, password) => getAPIKey(email, password),
	login: (email, apiKey) => login(email, apiKey),

	devices: {
		list: () => simpleGET('/api/v1/devices/list', 'data'),
		delete: (id) => postWithID('/api/v1/devices/delete', id, 'data'),
		firmwareUpdate: (id) => postWithID('/api/v1/devices/update_latest_firmware', id, 'data'),
	},

	subDevices: {
		list: () => simpleGET('/api/v1/subdevices/list', 'data'),
		delete: (id) => postWithID('/api/v1/subdevices/delete', id, 'data'),
		powerOn: (id) => postWithID('/api/v1/subdevices/power_on', id, 'data'),
		powerOff: (id) => postWithID('/api/v1/subdevices/power_off', id, 'data'),
		fetchUsageData: (id, data_type, resolution, start_time, end_time, limit) => fetchUsageData(id, data_type, resolution, start_time, end_time, limit),
		information: (id, showHistoryData) => subDeviceInformation(id, showHistoryData),
	},

	subDeviceGroup: {
		list: () => simpleGET('/api/v1/device_groups/list', 'data'),
		delete: (id) => postWithID('/api/v1/device_groups/delete', id, 'data'),
		powerOn: (id) => postWithID('/api/v1/device_groups/power_on', id, 'data'),
		powerOff: (id) => postWithID('/api/v1/device_groups/power_off', id, 'data'),
	},

	pushNotifications: {
		list: () => simpleGET('/api/v1/notifications/list', 'data'),
	},

	toggleState: (id) => toggleState(id),
};
