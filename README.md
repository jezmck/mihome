# mihome
A simple NodeJS wrapper and documentation for the [MiHome API](https://mihome4u.co.uk/).  
## Installing 
Just run `npm install mihome` for access to the API Wrapper.

## Usage
To get started you either need to get an API Key already or to get one.
If don't already have an API Key:
```js
mihome.getAPIKey('example@example.org', 'examplepassword', (err, apiKey) => {
   if (err) console.error(err);
   console.log(apiKey);
});
```
If you already have an API Key:
```js
mihome.login('example@example.org', 'exampleapikey'); 
```
### Weird Things.
Dates need to be expressed in the format `YYYY-MM-DD[T]HH:mm:SS.SSS[Z]`. You can use this String to `moment.format()`.  
Sometimes you get a validation error for a completely valid request that may then work. I am in contact with Energine to figure out what is going wrong.

## Methods
All methods use Promise Style Callback.
#### `getUserProfile` - Gets information about the user that is currenlty logged in.
```js
mihome.getUserProfile().then(profile => {
	console.log(profile);
}).catch(err => console.error(err));
```
### Devices
#### `list` - Lists the Devices Available (Hub)
#### `delete(id)` - Deletes the Device with that ID.

### SubDevices
#### `list` - Lists the Subdevices Available
#### `delete(id)` - Deletes the Subdevice with that ID.
#### `powerOn(id)` - Turns the ID on.
#### `powerOff(id)` - Turns the ID off.
#### `fetchUsageData(id, data_type, resolution, start_time, end_time, limit)` - Gets usage data between specific time
- id - The ID to get Usage Data.
- data_type - Either 'watts' or 'reported_temperature'
- resolution - Either 'instant', 'hourly', 'daily'
- start_time - Start Time (See Format)
- end_time - End Time (See Format)

### SubDeviceGroups
#### `list` - Lists the groups Available
#### `delete(id)` - Deletes the group with that ID.
#### `powerOn(id)` - Turns the ID on.
#### `powerOff(id)` - Turns the ID off.

### Push Notifications
#### `list` - Lists the notifications subscriptions.
