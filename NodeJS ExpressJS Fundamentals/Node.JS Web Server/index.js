const http = require('http');
const url = require('url');

const handlers = require('./handlers/index');

const port = 8080;

http.createServer((req, res) => {
    req.pathname = url.parse(req.url).pathname;

    for (let handler of handlers) {
        let response = handler(req, res);
        if (response !== true) {
            break;
        }
    }
}).listen(port);

console.log(`Web server is listening on ${port}`);