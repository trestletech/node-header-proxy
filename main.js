var _ = require('underscore');

var http = require('http');
var httpProxy = require('http-proxy');


var port = 8000;
var destPort = 3838;
var destHostname = 'localhost';

var server = httpProxy.createServer(function (req, res, proxy) {

  proxy.proxyRequest(req, res, {
    host: destHostname,
    port: destPort
  });
});

server.listen(port);
server.on('upgrade', function (req, socket, head) {

    req.headers['SHINY_SERVER_CREDENTIALS'] = '{"user": "jeff", "groups":["group1", "group2"]}';

    server.proxy.proxyWebSocketRequest(req, socket, head, {host: destHostname, port: destPort});
});
