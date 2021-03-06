function bufferlayers(){
		ko.utils.arrayForEach(window.layermodel.selectedItems(), function(layer){
			if(layer.functionrdy){
			var wkt = ""+layer.wkt;
			var amount = $('#amount').val();
			var name = "Buffered_"+amount+"_"+layer.layername();
			var query = "SELECT ST_AsGeoJSON(ST_BUFFER(ST_GeogFromText('"+wkt+"'),"+amount+")) as shape, ST_AsText(ST_BUFFER(ST_GeogFromText('"+wkt+"'),"+amount+")) as wkt,'"+name+"'as name;";
			socket.emit('dbcall' ,name, query);
			layer.functionrdy(false);
			$('#buffers').slideToggle();
			}
		});
}
function arealayer(){
	$('#areas').slideToggle();
		ko.utils.arrayForEach(window.layermodel.selectedItems(), function(layer){
		var wkt = layer.wkt;
		var name = layer.layername();
		var query = "SELECT DISTINCT ST_AREA(ST_GeogFromText('"+wkt+"')) as area";
		socket.emit('areacall', name, query);
		layer.functionrdy(false);
	});
}
function mergelayers(){
	$('#merge').slideToggle();
	var name = "Merged";
	var wkt = "";
	ko.utils.arrayForEach(window.layermodel.selectedItems(), function(layer){
		wkt = wkt +"ST_GeomFromText('"+layer.wkt+"'),";
		name = name+"_"+layer.layername();
		layer.functionrdy(false);
	});
	wkt = wkt.slice(0,-1);
	var query = "SELECT ST_AsGeoJSON(ST_Union(ARRAY["+wkt+"])) as shape, ST_AsText(ST_Union(ARRAY["+wkt+"])) as wkt, '"+name+"' as name;";
	socket.emit('dbcall', name, query);
}
function subtractlayers(){
	$('#subtract').slideToggle();
	var name = "Subtracted";
	var wkt = "";
	ko.utils.arrayForEach(window.layermodel.selectedItems(), function(layer){
		wkt = wkt +"ST_GeomFromText('"+layer.wkt+"'),";
		name = name + "_" + layer.layername();
		layer.functionrdy(false);
	});
	ko.utils.arrayForEach(window.layermodel.selectedItemsAlt(), function(layer){
		wkt = wkt +"ST_GeomFromText('"+layer.wkt+"')";
		layer.functionrdyalt(false);
	});
	var query = "SELECT ST_AsGeoJSON(ST_Difference("+wkt+")) as shape, ST_AsText(ST_Difference("+wkt+")) as wkt, '"+name+"' as name;";
	socket.emit('dbcall', name, query);
}
function intersectlayers(){
	$('#intersect').slideToggle();
	var name = "Intersection";
	var wkt = "";
	ko.utils.arrayForEach(window.layermodel.selectedItems(), function(layer){
		wkt = wkt +"ST_GeomFromText('"+layer.wkt+"'),";
		name = name+"_"+layer.layername();
		layer.functionrdy(false);
	});
	wkt = wkt.slice(0,-1);
	var query = "SELECT ST_AsGeoJSON(ST_Intersection("+wkt+")) as shape, ST_AsText(ST_Intersection("+wkt+")) as wkt, '"+name+"' as name;";
	socket.emit('dbcall', name, query);
}
function distancelayers(){
	$('#distance').slideToggle();
	var name = "Distance between ";
	var wkt = "";
	ko.utils.arrayForEach(window.layermodel.selectedItems(), function(layer){
		wkt = wkt +"ST_Transform(ST_GeomFromText('"+layer.wkt+"',4326),32633),";
		name = name + layer.layername();
		layer.functionrdy(false);
	});
	ko.utils.arrayForEach(window.layermodel.selectedItemsAlt(), function(layer){
		wkt = wkt +"ST_Transform(ST_GeomFromText('"+layer.wkt+"',4326),32633)";
		layer.functionrdyalt(false);
		name = name +" and " + layer.layername() +" is: ";
	});
	var query = "SELECT ST_Distance("+wkt+") as dist";
	socket.emit('distcall', name, query);
}
function simplifylayer(){
	$('#simple').slideToggle();
		ko.utils.arrayForEach(window.layermodel.selectedItems(), function(layer){
		var wkt = layer.wkt;
		var name = "Simplified_"+layer.layername();
		var query = "SELECT ST_AsGeoJSON(ST_SimplifyPreserveTopology(ST_GeomFromText('"+wkt+"'),50)) as shape";
		console.log(query);
		socket.emit('dbcall', name, query);
		layer.functionrdy(false);
	});
}