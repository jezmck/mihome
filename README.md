# mihome
A simple NodeJS wrapper and documentation for the [MiHome API](https://mihome4u.co.uk/).  
## Installing 
Just run `npm install mihome` for access to the API Wrapper.

## Usage
To get started you either need to get an API Key already or to get one.
If don't already have an API Key:
```js
mihome.getAPIKey('example@example.org', 'examplepassword').then(apiKey => {
	console.log(apiKey);
}).catch(err => console.error(err));
```
If you already have an API Key:
```js
mihome.login('example@example.org', 'exampleapikey'); 
```
### Weird Things.
#### Dates
As kinda of described in the [API Documentation](https://mihome4u.co.uk/docs/api-documentation), Timestamps need to be in the format. '2018-00-00T00:00:00.000Z', this String `YYYY-MM-DD[T]HH:mm:SS.SSS[Z]` can format them.  
To format dates easily I recommend [moment.js](https://momentjs.com/), and then using the format function.
```js
moment().format('YYYY-MM-DD[T]HH:mm:SS.SSS[Z]');
```
### Validation Error
For some strange reason a perfectly valid request will sometimes work but other times return a validation request.  
I will contact the Energinie Engineers to see what is causing this and hopefully fix it.
## Methods
**All methods use Promise Style Callback.**
#### `getUserProfile` - Gets information about the user that is currenlty logged in.
```js
mihome.getUserProfile().then(profile => {
	console.log(profile);
}).catch(err => console.error(err));
```
### Devices
#### `list` - Lists the Devices Available (Hub)
#### `delete(id)` - Deletes the Device with that ID.

### Sub Devices
#### `list` - Lists the Subdevices Available
#### `delete(id)` - Deletes the Subdevice with that ID.
#### `powerOn(id)` - Turns the ID on.
#### `powerOff(id)` - Turns the ID off.
#### `fetchUsageData(id, data_type, resolution, start_time, end_time, limit)` - Gets usage data between specific time
- id - The ID to get Usage Data.
- data_type - Either 'watts' or 'reported_temperature'
- resolution - Either 'instant', 'hourly', 'daily'
- start_time - Start Time: [See](#dates)
- end_time - End Time: [See](#dates)

### Subdevice Groups
#### `list` - Lists the groups Available
#### `delete(id)` - Deletes the group with that ID.
#### `powerOn(id)` - Turns the ID on.
#### `powerOff(id)` - Turns the ID off.

### Push Notifications
#### `list` - Lists the notifications subscriptions.
