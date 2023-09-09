//Create map

let basemap = L.tileLayer(
    "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png'",
    {    
        attribution:
            'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
    }); 
// We create the map object with options.
let map = L.map("map", {
    center: [
      40.7, -94.5
    ],
    zoom: 3
  });
  
  // Then we add our 'basemap' tile layer to the map.
basemap.addTo(map);


  // Here we make an AJAX call that retrieves our earthquake geoJSON data.
  d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(function (data) {
  
    // This function returns the style data for each of the earthquakes we plot on the map. We pass the magnitude of the earthquake into two separate functions to calculate the color and radius.
    function styleInfo(feature) {
      return {
        opacity: 1,
        fillOpacity: 1,
        fillColor: getColor(feature.geometry.coordinates[2]),
        color: "black",
        radius: getRadius(feature.properties.mag),
        stroke: true,
        weight: 0.5
      };
    }
  
    // set the color of the marker based on the magnitude of the earthquake.
    function getColor(depth) {
      switch (true) {
        case depth > 90:
          return "navy";
        case depth > 70:
          return "royalblue";
        case depth > 50:
          return "coral";
        case depth > 30:
          return "darkorange";
        case depth > 10:
          return "yellow";
        default:
          return "lime";
      }
    }
  
    // This function determines the radius of the earthquake marker based on its magnitude.
    
    function getRadius(magnitude) {
      if (magnitude === 0) {
        return 1;
      }
  
      return magnitude * 4;
    }
  
    // Here we add a GeoJSON layer to the map once the file is loaded.
    L.geoJson(data, {
      // We turn each feature into a circleMarker on the map.
      pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng);
      },
      // We set the style for each circleMarker using our styleInfo function.
      style: styleInfo,
      // We create a popup for each marker to display the magnitude and location of the earthquake after the marker has been created and styled
      onEachFeature: function (feature, layer) {
        layer.bindPopup(
          "Magnitude: "
          + feature.properties.mag
          + "<br>Depth: "
          + feature.geometry.coordinates[2] //3rd element: the depth of the earth
          + "<br>Location: "
          + feature.properties.place
        );
      }
    }).addTo(map);
  
    // Here we create a legend control object.
    let legend = L.control({position: "bottomright"});
  
    // Then add all the details for the legend
    legend.onAdd = function () {
      let div = L.DomUtil.create("div", "info legend");
  
      let depth = [-10, 10, 30, 50, 70, 90];
      let colors = [ "lime", "yellow", "darkorange", "coral", "royalblue", "navy"];
      
      div.innerHTML += "<h3 style='text-align: center'>Depth</h3>"
      // Looping through our intervals to generate a label with a colored square for each interval.
      for (let i = 0; i < depth.length; i++) {
        div.innerHTML +=
        "<i style='background: " + colors[i] + "'></i> "
          + depth[i] + (depth[i + 1] ? "&ndash;" + depth[i + 1] + "<br>" : "+");
      }
      return div;
    };  
    // Finally, we our legend to the map.
    legend.addTo(map);
  });
  