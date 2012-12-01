var GeoJSONLayer = function(name, data, wkt){
	var self = this;
	var editing = false;
	var myStyle = {
    "color": getColor(),
    "weight": 5,
    "opacity": 0.8
	};

	self.geojsonlayer = new L.GeoJSON(data, {
		style: myStyle
	}).addTo(map);
	self.layername = ko.observable(name);
	self.selected = ko.observable(true);
	self.wkt = wkt;
	
	self.editing = function(){
		if(!editing){
			editing = true;
			console.log("editing!");
		}
		else editing = false;
		buffer(self);
	};

	self.selected.subscribe(function(){
		if(!self.selected()){
			map.removeLayer(self.geojsonlayer);
		}
		else{
			map.addLayer(self.geojsonlayer);
		}

	});
};

var GeoLayers = function(){
	var self = this;
	this.layers = ko.observableArray();
	this.addlayer = function(name, data, wkt){
		self.layers.push(new GeoJSONLayer(name, data, wkt));
	};
	this.removeLayer = function(layer){
		console.log("REMOVED: " + layer.layername());
		map.removeLayer(layer.geojsonlayer);
		self.layers.remove(layer);
	};
};

var layermodel = new GeoLayers();
ko.applyBindings(layermodel);

function getColor(){
	return '#'+Math.floor(Math.random()*16777215).toString(16);
}
