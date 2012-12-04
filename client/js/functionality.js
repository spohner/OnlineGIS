function bufferlayers(){
		ko.utils.arrayForEach(window.layermodel.selectedItems(), function(layer){
			var wkt = ""+layer.wkt;
			var amount = $('#amount').val();
			var name = "Buffered_"+amount+"_"+layer.layername();
			var query = "SELECT ST_AsGeoJSON(ST_BUFFER(ST_GeogFromText('"+wkt+"'),"+amount+")) as shape, ST_AsText(ST_BUFFER(ST_GeogFromText('"+wkt+"'),"+amount+")) as wkt,'"+name+"'as name;";
			socket.emit('dbcall' ,name, query);
			layer.functionrdy = false;
			$('#buffers').slideToggle();
		});
}
function arealayer(){
	$('#areas').slideToggle();
	ko.utils.arrayForEach(window.layermodel.selectedItems(), function(layer){
	var wkt = layer.wkt;
	var name = layer.layername();
	var query = "SELECT DISTINCT ST_AREA(ST_GeogFromText('"+wkt+"')) as area, '"+name+"' as name;";
	socket.emit('areacall', name, query);
	layer.functionrdy = false;
	});
}