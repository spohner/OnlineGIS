  $(document).ready(function() {
        $.ajaxSetup({cache:false});
        $('#map').css('height', ($(window).height() - 40));
        $("#layertable").tableDnD();
        $('#addnewlayerbutton').on('click', function(){
          $('#layerinput').focus();
        });
      });

      $(window).resize(function () {
        $('#map').css('height', ($(window).height() - 40));
      }).resize();

      $("#layerinput").keyup(function (e) {
        if (e.keyCode == 13) {
        addnewosmlayer();
        $("#addnewlayers").slideToggle();
        $("#controls").slideToggle();
    }
});

      // initialize the map on the "map" div
      //var map = new L.Map('map', {center: new L.LatLng(63.431, 10.395), zoom: 15, crs: L.CRS.EPSG4326});
      var map = new L.Map('map', {center: new L.LatLng(63.431, 10.395), zoom: 15});

      var backgroundlayer;
      setCloudmadeBack();
      map.addLayer(backgroundlayer);
      map.addControl(new L.Control.Scale());

      function backgroundmapchange(name){
        map.removeLayer(backgroundlayer);
        if(name == 'cloudmade'){
          setCloudmadeBack();
        }
        else if(name =='mapquest'){
          setMapQuest();
        }
        else if(name =='mapquestsat'){
          setMapQuestSat();
        }
        else if(name =='osm'){
          setOSMBack();
        }
        else if(name =='bing'){
          var bing = new L.BingLayer('Anqm0F_JjIZvT0P3abS6KONpaBaKuTnITRrnYuiJCE0WOhH6ZbE4DzeT6brvKVR5');
          backgroundlayer = bing;
        }
        else if(name =='googlehybrid'){
          var gglh = new L.Google();
          gglh._type = 'HYBRID';
          backgroundlayer = gglh;
        }
        else if(name =='googleroad'){
          var gglr = new L.Google();
          gglr._type = 'ROADMAP';
          backgroundlayer = gglr;
        }
        else if(name =='googlesat'){
          var ggls = new L.Google();
          ggls._type = 'SATELLITE';
          backgroundlayer = ggls;
        }
        else if(name =='topo2'){
          setTopo2();
        }
         else if(name =='topo2graatone'){
          setTopo2graatone();
        }
        else if(name =='toporaster2'){
          setToporaster2();
        }
        else{
          backgroundlayer = new L.StamenTileLayer(name);
        }
        map.addLayer(backgroundlayer);
      }

      function setCloudmadeBack(){
      var cloudmadeUrl = 'http://{s}.tile.cloudmade.com/a48e28c08af84ca9938d7b4cd07aa502/997/256/{z}/{x}/{y}.png',
      cloudmadeAttribution = 'Map by CloudMade - Code by @spohner';
      backgroundlayer = new L.TileLayer(cloudmadeUrl, {
      maxZoom: 18,
      attribution: cloudmadeAttribution
      });
      }

      function setMapQuest(){
       var mapQuestUrl = 'http://otile1.mqcdn.com/tiles/1.0.0/osm/{z}/{x}/{y}.jpg',
        mapQuestAttribution = 'Map by MapQuest - Code by @spohner';
        backgroundlayer = new L.TileLayer(mapQuestUrl, {
          maxZoom: 18,
          attribution: mapQuestAttribution
        });
      }

      function setMapQuestSat(){
        var mapQuestUrlSat = 'http://oatile1.mqcdn.com/tiles/1.0.0/sat/{z}/{x}/{y}.jpg',
        mapQuestSatAttribution = 'Map by MapQuest - Code by @spohner';
        backgroundlayer = new L.TileLayer(mapQuestUrlSat, {
          maxZoom: 11,
          attribution: mapQuestSatAttribution
        });
         (map.getZoom()>11) ? map.setZoom(11) : false;
      }

      function setOSMBack(){
        var osmUrl = 'http://a.tile.openstreetmap.org/{z}/{x}/{y}.png',
        osmAttribution = 'Map by OpenStreetMap - Code by @spohner';
        backgroundlayer = new L.TileLayer(osmUrl, {
          maxZoom: 18,
          attribution: osmAttribution
        });
      }

      function setTopo2(){
        var topo2Url = 'http://opencache.statkart.no/gatekeeper/gk/gk.open_gmaps?layers=topo2&zoom={z}&x={x}&y={y}',
        kartverketAttribution = 'Map by Kartverket - Code by @spohner';
        backgroundlayer = new L.TileLayer(topo2Url, {
          minZoom: 0,
          maxZoom: 17,
          tileSize: 256,
          attribution: kartverketAttribution
        });
      }
      function setTopo2graatone(){
        var topo2graatoneUrl = 'http://opencache.statkart.no/gatekeeper/gk/gk.open_gmaps?layers=topo2graatone&zoom={z}&x={x}&y={y}',
        kartverketAttribution = 'Map by Kartverket - Code by @spohner';
        backgroundlayer = new L.TileLayer(topo2graatoneUrl, {
          minZoom: 0,
          maxZoom: 17,
          tileSize: 256,
          attribution: kartverketAttribution
        });

        // var wmslayer = new L.TileLayer.WMS('http://wms.geonorge.no/skwms1/wms.norgeibilder', {
        //   layers: 'SatelliteImage',
        //   format: 'image/png',
        //   transparent: true
        // });
        // backgroundlayer = wmslayer;
      }
      function setToporaster2(){
        var toporaster2Url = 'http://opencache.statkart.no/gatekeeper/gk/gk.open_gmaps?layers=toporaster2&zoom={z}&x={x}&y={y}',
        kartverketAttribution = 'Map by Kartverket - Code by @spohner';
        backgroundlayer = new L.TileLayer(toporaster2Url, {
          minZoom: 0,
          maxZoom: 17,
          tileSize: 256,
          attribution: kartverketAttribution
        });
      }

      function addnewosmlayer(){
        name = $('#layerinput').attr('value');
        document.getElementById("inputform").reset();
        socket.emit('dbcall' ,name, "SELECT ST_AsGeoJSON(ST_Transform(way, 4326)) as shape, ST_AsText(ST_Transform(way, 4326)) as wkt FROM planet_osm_polygon WHERE name='"+name+"';");
      }

      //Recieving data from server
      var socket = io.connect('http://localhost:3000');
      socket.on('dbresponse', function(name, data, wkt){
        window.layermodel.addlayer(name, data, wkt);
      });

      socket.on('arearesponse', function(name, area){
        var area = Math.round(area*10)/10;
        var display = 'Area of '+name+' is: '+area+" squaremeters";
        $('#areadisplay').text(display);
        $('#arearesult').slideToggle();
        window.setTimeout(function(){$('#arearesult').slideToggle();},3000);
      });

      socket.on('distresponse', function(name, dist){
        var dist = Math.round(dist*10)/10;
        var display = name + dist +" meters";
        $('#areadisplay').text(display);
        $('#arearesult').slideToggle();
        window.setTimeout(function(){$('#arearesult').slideToggle();},3000);
      });
