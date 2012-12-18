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
	self.functionrdy = ko.observable(false);
	self.functionrdyalt = ko.observable(false);
	self.wkt = wkt;

	self.geojsonlayer.bindPopup(self.layername());
	
	self.editing = function(){
		if(!editing){
			editing = true;
		}
		else editing = false;
	};

	self.selected.subscribe(function(){
		if(!self.selected()){
			map.removeLayer(self.geojsonlayer);
		}
		else{
			map.addLayer(self.geojsonlayer);
		}
	});
	
	self.renameFunction =  function(layer,event){
		var element = event.target;
		var input = $('<input />', {'type':'text', 'name':'nameinput', 'id' : 'nameinput', 'value':$(element).parent().children('#nametag').html()});
		$(element).parent().children("#nametag").hide();
		$(element).parent().append(input);
		input.focus();

		$(input).on('blur', function(){
			self.layername($(input).val());
			$(input).hide();
			$(element).parent().children('#nametag').show();
		});
		$(input).on('keydown', function(e){
			var code = (e.keyCode ? e.keyCode : e.which);
			if (code == 13){
				self.layername($(input).val());
				$(input).hide();
				$(element).parent().children('#nametag').show();
				self.geojsonlayer.bindPopup(self.layername());
			}
		});

	};
	self.zoomTo = function(){
		map.fitBounds(self.geojsonlayer.getBounds());
	}
};

var GeoLayers = function(){
	var self = this;
	this.layers = ko.observableArray();
	this.addlayer = function(name, data, wkt){
		self.layers.push(new GeoJSONLayer(name, data, wkt));
	};
	this.removeLayer = function(layer){
		map.removeLayer(layer.geojsonlayer);
		self.layers.remove(layer);
	};
	this.selectedItems = ko.dependentObservable(function() {
        return ko.utils.arrayFilter(this.layers(), function(layer) {
            return layer.functionrdy();
        });
    }, this);
    this.selectedItemsAlt = ko.dependentObservable(function() {
        return ko.utils.arrayFilter(this.layers(), function(layer) {
            return layer.functionrdyalt();
        });
    }, this);

};

var layermodel = new GeoLayers();
ko.applyBindings(layermodel);

function getColor(){
	return '#'+Math.floor(Math.random()*16777215).toString(16);
}
