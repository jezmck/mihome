# Authentication
Authentication works by first getting a user's API key, this is only possible currenlty through the api itself.  
You perform the first authentication through the user's username and password; this has to be base 64 encoded, the template for this is `username:password.  
Once you have performed the first request and are able to get the Users API key, you will want to replace the password with the api key, the template for this is `username:apikey` which also has to be Base64 Encoded.
