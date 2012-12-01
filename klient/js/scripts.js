  $(document).ready(function() {
        $.ajaxSetup({cache:false});
        $('#map').css('height', ($(window).height() - 40));
        $("#layertable").tableDnD();
        $('#addlayermodal').on('shown', function(){
          $('#layerinput').focus();
        });
      });

      $(window).resize(function () {
        $('#map').css('height', ($(window).height() - 40));
      }).resize();

      // initialize the map on the "map" div
      var map = new L.Map('map', {center: new L.LatLng(63.431, 10.395), zoom: 15});

      var backgroundlayer;
      setCloudmadeBack();
      map.addLayer(backgroundlayer);

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

      var socket = io.connect('http://localhost:3000');
      socket.on('dbresponse', function(name, data, wkt){
        console.log("NAME AFTER DB"+name);
        window.layermodel.addlayer(name, data, wkt);
      });

      function addnewosmlayer(){

        name = $('#layerinput').attr('value');
        socket.emit('dbcall' ,name, "SELECT ST_AsGeoJSON(ST_Transform(way, 4326)) as shape, ST_AsEWKT(ST_Transform(way, 4326)) as wkt FROM planet_osm_polygon WHERE name='"+name+"';");
      }