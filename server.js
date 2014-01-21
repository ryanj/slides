var config = require('config');
var http   = require('http');
var shoe   = require('shoe');
var ecstatic = require('ecstatic')(__dirname + '/static');
var server = http.createServer(ecstatic);
var keys   = require('./js/keys.js');

var sock = shoe(function (stream) {
    stream.on('slidechanged', function(slideData) {
      if (typeof slideData.secret == 'undefined' || slideData.secret == null || slideData.secret === '') return;
      if (keys.create_hash(slideData.secret) === slideData.socketId) {
        slideData.secret = null;
        stream.broadcast.write(slideData.socketId, slideData);
      };
    });
    stream.on('navigation', function(data) {
      if (typeof data.secret == 'undefined' || data.secret == null || data.secret === '') return;
      if (keys.create_hash(data.secret) === data.socketId) {
        data.secret = null;
        stream.broadcast.write(data.socketId, data);
      };
    });

    stream.pipe(process.stdout, { end : false });
});
sock.install(server, '/slidetransitions');

server.listen(config.port, config.ip, function () {
  console.log( "Listening on " + config.ip + ", port " + config.port )
});
