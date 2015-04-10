var _ = require('underscore');
var http = require('http');
var httpProxy = require('http-proxy');
var https = require('https');
var fs = require('fs');
var path = require('path');

var opts = require('optimist')
.usage('Test auth proxy.\nUsage: $0 [extPort] [destPort] [destHostName] --ssl')
.describe('ssl', 'Enable SSL on both the client and expect it on the target.')
.demand(0);
var argv = opts.argv;

var port = argv._[0]?argv._[0] : 8000;
var destPort = argv._[1]?argv._[1] : 3838;
var destHostname = (argv._[2])?argv._[2] : 'localhost';

var options = {
  target: {
    https: argv.ssl,
    rejectUnauthorized: false
  }
};

if (argv.ssl){
  options.https = {
    key: fs.readFileSync('/home/jeff/workspace/test-key.pem'),
    cert: fs.readFileSync('/home/jeff/workspace/test-cert.pem')
  };
}
var proxy = new httpProxy.HttpProxy({ 
  target: {
    host: destHostname, 
    port: destPort,
    https: argv.ssl,
    rejectUnauthorized: false
  }
});

if (argv.ssl){
  https.createServer(options.https, function (req, res) {    
    appendHeaders(req);
    proxy.proxyRequest(req, res);
  }).listen(port);
} else{
  http.createServer(function (req, res) {
    appendHeaders(req);
    proxy.proxyRequest(req, res);
  }).listen(port);
}

function appendHeaders(req){
  var files = fs.readdirSync(path.resolve(__dirname, "headers/"));

  console.log("Request for " + req.url + ", appending headers...");

  _.each(files, function(f){
    // Exclude hidden files
    if (f.match(/^\./)){
      return;
    }
  
    var file = fs.readFileSync(path.resolve(__dirname, "headers/", f), {encoding: 'utf8'});
    file = file.replace(/\n$/, '');
    console.log("\t'" + f + "' => '" + file + "'");
    req.headers[f] = file;
  });
}
