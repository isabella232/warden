# HTTP API #

The main interface to warden is a HTTP API. The API can be used to retrieve
vault tokens to authorized nodes. The endpoints are versioned to enable
changes without breaking backwards compatibility.

Each endpoint manages a different aspect of warden:

* health - Basic health check
* authenticate - Authenticates with vault to retrieve a token

## Health ##

The health endpoint is used to validate warden is running. The endpoint responds
to GET requests with a JSON body and a response code. Any other type of
request returns a 405 (Method Not Allowed) response code and includes an
`Allow: GET` header.

### /v1/health ###

An example response from the health API is:

~~~json
{
  "status": "okay",
  "uptime": 1222101
}
~~~

The status field is a string "okay". Anything besides a 200 or 405 response code
means that warden is not available.

The uptime field is an integer representing the number of milliseconds warden
has been running.

## Authenticate ##

The authenticate endpoint provides a way for servers to authenticate and receive
a token from vault. The endpoint responds to POST requests that contain an EC2
identity document about the server and a signed certificate with either a 200 (OK)
response and token from vault, or a 403 (Forbidden) response code.

Example token of a successful request. It should look exactly like a secret from
vault
```json
{
  "lease_duration": 300,
  "renewable": true,
  "data": {
    "token": "f45cf71b-1806-7c51-8b5b-c3018177ed8c"
  }
}
```

For more information about authentication, view the [authentication docs.][authentication]

### /v1/authenticate ###

POST requests return a vault token and a 200 (OK) response code, or a 403 response
code when the data sent is not enough to authenticate.

Any other type of request returns a 405 (Method Not Allowed) response code with
a header of `Allow: POST` header.

[authentication]: ./docs/authentication.md
