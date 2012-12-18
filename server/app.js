var express = require('express');
var pg = require('pg');
var app = express()
  , http = require('http')
  , server = http.createServer(app)
  , io = require('socket.io').listen(server);

io.enable('browser client minification');  // send minified client
io.enable('browser client etag');          // apply etag caching logic based on version number
io.enable('browser client gzip');          // gzip the file
io.set('log level', 2);                    // reduce logging

// enable all transports (optional if you want flashsocket support, please note that some hosting
// providers do not allow you to create servers that listen on a port different than 80 or their
// default port)
io.set('transports', [
    'websocket'
  , 'flashsocket'
  , 'htmlfile'
  , 'xhr-polling'
  , 'jsonp-polling'
]);

server.listen(3000);
console.log('Listening on port 3000');

var connString = 'tcp://steffenp@localhost:5432/onlinegisdb';

io.sockets.on('connection', function(socket){
		console.log("connected to client");
		socket.on('dbcall', function(name, query){

			pg.connect(connString, function(err, client){
				var featureCollection = new FeatureCollection();
				var wktString = '';
			client.query(query, function(err, result) {
				if(result !== undefined){

					for (var i = 0; i < result.rows.length; i++) {
						featureCollection.features[i] = JSON.parse(result.rows[i].shape);
					}
					if(result.rows[0] !== undefined) {
						wktString = result.rows[0].wkt;	
					}
					else{
						name = "Not found :(";
					}
					
				}
				else{
						name = "Not found :( ";
					}
				socket.emit('dbresponse', name, featureCollection, wktString);
			});
		});
		});
		socket.on('areacall', function(name, query){

			pg.connect(connString, function(err, client){
				client.query(query, function(err, result){
					if(result != undefined){
						socket.emit('arearesponse', name, result.rows[0].area);
					}
				});
			});
		});
		socket.on('distcall', function(name, query){

		pg.connect(connString, function(err, client){				
		client.query(query, function(err, result){
				if(result != undefined){
					socket.emit('distresponse', name, result.rows[0].dist);
				}
			});
		});

	});
});


//for GEOJSON syntax
function FeatureCollection(){
	this.type = 'FeatureCollection';
	this.features = new Array();
}
