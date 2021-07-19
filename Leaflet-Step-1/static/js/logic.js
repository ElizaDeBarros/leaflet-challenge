// Store API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL
d3.json(queryUrl).then(function(data) {

  // Creating map object
  var myMap = L.map("map", {
    center: [
      38.69, -101.25],
    zoom: 6,
    });

  // Adding tile layer
  L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "light-v10",
    accessToken: API_KEY
  }).addTo(myMap);


  console.log(data.features);
  var location = [];
  for (var i = 0; i < data.features.length; i++) {
    
    var color = "";
      if (data.features[i].geometry.coordinates[2] >= -10 && data.features[i].geometry.coordinates[2] <= 10) {
        color = "#99ee00";
      }
      else if (data.features[i].geometry.coordinates[2] > 10 && data.features[i].geometry.coordinates[2] <= 30) {
        color = "#d4ee00";
      }
      else if (data.features[i].geometry.coordinates[2] > 30 && data.features[i].geometry.coordinates[2] <= 50) {
        color = "#ffe181";
      }
      else if (data.features[i].geometry.coordinates[2] > 50 && data.features[i].geometry.coordinates[2] <= 70) {
        color = "#ffc000";
      }
      else if (data.features[i].geometry.coordinates[2] > 70 && data.features[i].geometry.coordinates[2] <= 90) {
        color = "#edb9a9";
      }
      else {
        color = "#fa735c";
      };
      
      
      location.push([data.features[i].geometry.coordinates[1], data.features[i].geometry.coordinates[0]]);

    // Add circles to map
    L.circleMarker(location[i], {
        fillOpacity: 0.75,
        color: "black",
        stroke : true,
        weight : 1,
        fillColor: color,
        // Adjust radius
        radius:( data.features[i].properties.mag)*2 
    }).bindPopup("<h1> Place: " + data.features[i].properties.place + "</h1> <hr> <h3>Time: " + data.features[i].properties.time + "</h3>").addTo(myMap);
  
  };


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