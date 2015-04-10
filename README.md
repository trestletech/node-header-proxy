
# Header-Appending Proxy in NodeJS

This nodeJS app will proxy traffic from one port on localhost to the given hostname/port, but will add a series of headers along the way. You control these headers by creating files in the `headers` directory with the content you want appended. For instance, creating a file named `headers/SOME_AUTH` with the content `myuser` will append the header `SOME_AUTH` with the content `myuser` to outgoing HTTP requests.

The proxying code does no caching of these files in the `headers` directory, so any changes to those files or additional/deleted files will apply immediately to the subsequent request.

## Installation and Running

1. Install NodeJS and npm (`brew install node` on a Mac with brew)
2. `cd` to this directory and run `npm install` to get the necessary dependencies
3. `node main.js 8000 80 yahoo.com` would start the proxy, running locally on port 8000, and proxying all traffic to port 80 of yahoo.com. You can, of course, proxy to another local port by doing something like `node main.js 8000 8787 localhost`.
 
