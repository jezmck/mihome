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

function apiPOST(endpoint, params, focus, callback) {
    const URL = `${BASE_URL}${endpoint}`;
    console.log(URL);
    request({
        url: URL,
        method: 'POST',
        headers: {
            'User-Agent': user_agent,
            'Authorization': authentication,
            'content-type': "application/json",
        },
        body: JSON.stringify(params)
    }, (err, res, body) => {
       callback(err, body);
    });
}

/**
 * Turns devices either on or off.
 * @param state Either 1 or 'on' for on and 0 or 'off' for off.
 * @param id Id of the thing to power.
 */
function power(state, id, callback) {
    let URL = 'https://mihome4u.co.uk/api/v1/subdevices/power_';
    let newState = state.toLowerCase;
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
            "id": parseInt(id)
        }
    }, (err, res, body) => {
        if (body.status !== 'success') {
        	callback(`Request Error: ${json.status}`)
		} else {
        	callback(null, body['data']);
		}
    });
}

module.exports = {
	getAPIKey: (email, password, callback) => getAPIKey(email, password, callback),
	login: (email, apiKey) => login(email, apiKey),
	apiRequest: (endpoint, focus, callback) => apiGET(endpoint, focus, callback), // legacy method for quick scripting.
    apiPOST: (endpoint, params, focus, callback) => apiPOST(endpoint, params, focus, callback),

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
