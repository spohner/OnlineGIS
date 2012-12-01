var express = require('express');
var pg = require('pg');
var app = express()
  , http = require('http')
  , server = http.createServer(app)
  , io = require('socket.io').listen(server);

server.listen(3000);
console.log('Listening on port 3000');

io.sockets.on('connection', function(socket){
		console.log("connected to client");
		socket.on('dbcall', function(name, query){

			var connString = 'tcp://steffenp@localhost:5432/onlinegisdb';

			pg.connect(connString, function(err, client){
				var featureCollection = new FeatureCollection();
				var wktString = '';
			client.query(query, function(err, result) {

				for (var i = 0; i < result.rows.length; i++) {
					featureCollection.features[i] = JSON.parse(result.rows[i].shape);
				}
				if(result.rows[0].wkt !== null) {
					wktString = result.rows[0].wkt;
				}
				else{
					name = "Not found :( ";
				}
				socket.emit('dbresponse', name, featureCollection, wktString);
			});
		});
		});

	});

function FeatureCollection(){
	this.type = 'FeatureCollection';
	this.features = new Array();
}