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
  /**
   * Add headers onto HTTP requests. Shiny Server Pro will check the whitelist_headers
   * property to see if it should save and then forward this header onto the Shiny
   * web socket connection. If so, this object should be available as the
   * session$request object.
   */
  req.headers['SOME_AUTH'] = 'SOMETHING';
  
  proxy.proxyRequest(req, res, {
    host: destHostname,
    port: destPort
  });
});

server.listen(port);
server.on('upgrade', function (req, socket, head) {
    /**
     * This line will add a header onto the /web socket/ request. This is how Shiny gets
     * information. In particular, the SHINY_SERVER_CREDENTIALS header is a special header
     * which will be parsed as JSON then added to the Shiny session as 'user' and 'group'
     * objects. 
     *
     * Web socket headers (generally) don't get passed through SockJS/Shiny Server, so 
     * this has no effect when running through Shiny Server.
     */
    //req.headers['SHINY_SERVER_CREDENTIALS'] = '{"user": "jeff", "groups":["group1", "group2"]}';

    server.proxy.proxyWebSocketRequest(req, socket, head, {host: destHostname, port: destPort});
});
