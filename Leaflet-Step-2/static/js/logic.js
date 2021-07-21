// Store API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
var link = "static/data/PB2002_boundaries.json";

// Creates tectonic plates layerGroup
var platesGroup = L.layerGroup();

// Perform a GET request to the query URL
d3.json(queryUrl).then(function(earthquakeData) {
  d3.json(link).then(function(platesData) {
    L.geoJSON(platesData, {
      color: "orange"
      }).addTo(platesGroup); 
  });

  
  var locationEarthquake = [];
  var earthquake = [];

    // Setup logic earthquake color basese on its deptht 
    for (var i = 0; i < earthquakeData.features.length; i++) {
      var color = "";
        if (earthquakeData.features[i].geometry.coordinates[2] >= -10 && earthquakeData.features[i].geometry.coordinates[2] <= 10) {
          color = "#99ee00";
        }
        else if (earthquakeData.features[i].geometry.coordinates[2] > 10 && earthquakeData.features[i].geometry.coordinates[2] <= 30) {
          color = "#d4ee00";
        }
        else if (earthquakeData.features[i].geometry.coordinates[2] > 30 && earthquakeData.features[i].geometry.coordinates[2] <= 50) {
          color = "#ffe181";
        }
        else if (earthquakeData.features[i].geometry.coordinates[2] > 50 && earthquakeData.features[i].geometry.coordinates[2] <= 70) {
          color = "#ffc000";
        }
        else if (earthquakeData.features[i].geometry.coordinates[2] > 70 && earthquakeData.features[i].geometry.coordinates[2] <= 90) {
          color = "#edb9a9";
        }
        else {
          color = "#fa735c";
        };
        
        // pushes earthquake lat and long into a list
        locationEarthquake.push([earthquakeData.features[i].geometry.coordinates[1], earthquakeData.features[i].geometry.coordinates[0]]);
        
      // Circles layer
      earthquake.push(L.circleMarker(locationEarthquake[i], {
          fillOpacity: 0.75,
          color: "black",
          stroke : true,
          weight : 1,
          fillColor: color,
          // Adjust radius
          radius:( earthquakeData.features[i].properties.mag)*2 
      }).bindPopup("<h1> Place: " + earthquakeData.features[i].properties.place + "</h1> <hr> <h3>Time: " + earthquakeData.features[i].properties.time + "</h3>"));
    };
    // Creates earthquake layerGroup
    var earthquakeGroup = L.layerGroup(earthquake);

    // Define variables for tile layers
    var satellite = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "satellite-v9",
      accessToken: API_KEY
    });

    var outdoors = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "outdoors-v11",
      accessToken: API_KEY
    });

    var grey = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "light-v10",
      accessToken: API_KEY
    });

    // Only one base layer can be shown at a time
    var baseMaps = {
      Satellite: satellite,
      Greyscalle: grey,
      Outdoors: outdoors
    };

    // Overlays that may be toggled on or off
    var overlayMaps = {
      "Earthquakes": earthquakeGroup,
      "Tectonic Plates": platesGroup
    };

    // Create map object and set default layers
    var myMap = L.map("map", {
      center: [38.69, -101.25],
      zoom: 4,
      layers: [satellite, earthquakeGroup, platesGroup]
    });


    // Pass map layers into the layer control
    // Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps).addTo(myMap);

    // Setup legend
    function getColor(d) {
      return d ==='-10-10' ? '#99ee00' :
              d ==='10-30' ? '#d4ee00' :
              d ==='30-50' ? '#ffe181' :
              d ==='50-70' ? '#ffc000' :
              d ==='70-90' ? '#edb9a9' : '#fa735c';
    };


    var legend = L.control({position: 'bottomright'});
    legend.onAdd = function (map) {
      var div = L.DomUtil.create('div', 'info legend');
      categories = ['-10-10','10-30','30-50','50-70','70-90','90+'];

      for (var i = 0; i < categories.length; i++) {
        div.innerHTML += 
          '<i style="background:' + getColor(categories[i]) + '"></i> ' +
          (categories[i] ? categories[i] : '90+')+'<br>';
      };
      return div;
    };
    legend.addTo(myMap);
});