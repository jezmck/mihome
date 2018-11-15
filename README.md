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

## Methods
All methods use Promise Style Callback.
#### `getUserProfile` - Gets information about the user that is currenlty logged in.
```js
mihome.getUserProfile().then(profile => {
	console.log(profile);
}).catch(err => console.error(err));
```
### Devices
#### `list` - Lists the Devices Available (Hubs)
#### `delete(id)` - Deletes the Device with that ID.
