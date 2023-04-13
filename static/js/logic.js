// Store the API endpoint as queryUrl.
let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL/
d3.json(queryUrl).then(function (data) {
  // Once we get a response, send the data.features object to the createFeatures function.
  createFeatures(data.features);
  console.log(data);
});

function createFeatures(earthquakeData) {

  // Define a function that we want to run once for each feature in the features array.
  // Give each feature a popup that describes the place and time of the earthquake.
  function onEachFeature(feature, layer) {
    layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}</p>`);
  }

  // Create a GeoJSON layer that contains the features array on the earthquakeData object.
  // Run the onEachFeature function once for each piece of data in the array.
  let earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,
    marker: eMarkers
  });

  // Send our earthquakes layer to the createMap function/
  createMap(earthquakes);
}

function createMap(earthquakes) {

  // Create the base layers.
  let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  })

  let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
  });

  // Create a baseMaps object.
  let baseMaps = {
    "Street Map": street,
    "Topographic Map": topo
  };

  // Create an overlay object to hold our overlay.
  let overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load.
  let myMap = L.map("map", {
    center: [
      39.27, -109.18
    ],
    zoom: 5,
    layers: [street, earthquakes]
  });

  // Create a layer control.
  // Pass it our baseMaps and overlayMaps.
  // Add the layer control to the map.
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

}

function eMarkers(){
  // Loop through the cities array, and create one marker for each city object.
  for (let i = 0; i < earthquakeData.length; i++) {

    // Conditionals for country gdp_pc
    let color = "";
    if (earthquakeData[i].features.geometry.coordinates[3] < 10) {
      color = "lime";
    }
    else if (earthquakeData[i].features.geometry.coordinates[3] < 30) {
      color = "yellow";
    }
    else if (earthquakeData[i].features.geometry.coordinates[3] < 50) {
      color = "gold";
    }
    else if (earthquakeData[i].features.geometry.coordinates[3] < 70) {
      color = "coral";
    }
    else if (earthquakeData[i].features.geometry.coordinates[3] <90) {
      color = "darkorange";
    }
    else {
      color = "red";
    }

    var lat = earthquakeData[i].features.geometry.coordinates[1];
    var lng = earthquakeData[i].features.geometry.coordinates[1];

    // Add circles to the map.
    L.circle([lat, lng], {
      fillOpacity: 0.75,
      color: "white",
      fillColor: color,
      // Adjust the radius.
      radius: Math.sqrt(earthquakeData[i].features.geometry.coordinates) * 50000
    }).bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}</p>`).addTo(myMap);
  };
}
