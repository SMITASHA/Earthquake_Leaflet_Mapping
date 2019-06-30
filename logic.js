// Store our API endpoint inside queryUrl
var myMap = L.map("map", {
  center: [0, 0],
  zoom: 3,
});
L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.streets",
  accessToken: API_KEY
}).addTo(myMap);

var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL
d3.json(queryUrl).then(function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data.features);
});
// Determines marker size based on magnitude
function markerSize(magnitude) {
  return magnitude * 30000;
}

function markercolor(mag){
  colors=['#ADFF2F','#9ACD32','#FFFF00','#ffd700','#FFA500','#FF0000'];
  if (mag>5){
    color=colors[5];
  }
  else if (mag>=4)
  {
    color=colors[4];
  }
  else if (mag>=3)
  {
    color=colors[3];
  }
  else if (mag>=2)
  {
    color=colors[2];
  }
  else if (mag>=1)
  {
    color=colors[1];
  }
  else
  {
     color=colors[0];
  }
  return color;
}
function createFeatures(earthquakeData) {


  // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the place and time of the earthquake
  function onEachFeature(feature, layer) {
    var marker =L.circle(feature.geometry.coordinates, {
      fillOpacity:1,
      color:"black",
      weight:1,
      fillColor: markercolor(feature.properties.mag),
      radius: markerSize(feature.properties.mag)
    });
    marker.addTo(myMap);
    var magni=feature.properties.mag;
    var rnd_mag=magni.toFixed(3);
    marker.bindPopup("<h3>" + feature.properties.place +"</h3></h2> Magnitude: "+rnd_mag+
      "</h2><hr><p>"+ new Date(feature.properties.time) + "</p>");
  }

  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature
  });

}

// Create legend
var legend = L.control({
  position: "bottomright"
});

legend.onAdd = function() {
  var div = L.DomUtil.create("div", "legend");
  var magnitudes = ["< 1", "1 - 2", "2 - 3", "3 - 4", "4 - 5", " > 5"
  ];
  var colors=['#ADFF2F','#9ACD32','#FFFF00','#ffd700','#FFA500','#FF0000'];

  div.innerHTML += "<h4>Magnitude</h4>";
  for (var i = 0; i < magnitudes.length; i++) {
    div.innerHTML +=
    '<i style="background: ' + colors[i] + '"></i><span>' + magnitudes[i] + '</span><br>';
  }
  return div;
};

legend.addTo(myMap);



  
  
  
 




