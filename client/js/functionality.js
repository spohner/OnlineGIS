function buffer(layer){
		var wkt = ""+layer.wkt;
		var name = "Buffered_"+layer.layername();
		var query = "SELECT ST_AsGeoJSON(ST_BUFFER(ST_GeogFromText('"+wkt+"'),100)) as shape, ST_AsText(ST_BUFFER(ST_GeogFromText('"+wkt+"'),100)) as wkt,'"+name+"'as name;";
        socket.emit('dbcall' ,name, query);
}