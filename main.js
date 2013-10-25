var _ = require('underscore');

var http = require('http');
var httpProxy = require('http-proxy');

var opts = require('optimist')
  .usage('Test auth proxy.\nUsage: $0 [extPort] [destPort] [destHostName]')
  .demand(0);
var argv = opts.argv;

var port = argv._[0]?argv._[0] : 8000;
var destPort = argv._[1]?argv._[1] : 3838;
var destHostname = (argv._[2])?argv._[2] : 'localhost';

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
