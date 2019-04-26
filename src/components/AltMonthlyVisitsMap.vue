<template>
<v-layout row wrap>
  <v-flex xs12>
      <div id="map" class="full"></div>
    
  </v-flex>
  
</v-layout>
</template>

<script>
// TODOS bring markers in as a prop
//

import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css'; // Re-uses images from ~leaflet package
import * as L from 'leaflet';
import 'leaflet-defaulticon-compatibility';

export default {
  data() {
    return {
      map: null,
      tileLayer: null,
      marker: null
    }
  },
  mounted() {
  this.initMap();
  // this.initLayers();
  },
  computed: {
    docs(){
      return this.$store.getters.docs
    },
    mapData() {
      return this.$store.getters.mapData
    }
  },
  methods: {
    initMap() {
      this.map = L.map('map').setView(["-29.6725216666667", "30.70266"], 12); // uses Leaflet (the L object) to bind a new map to the <div id="map"> element, then sets the view to be at latitude 38.63 and longitude -90.23 with a zoom level of 12. This sets the map to be zoomed in right over Saint Louis, MO.
      this.tileLayer = L.tileLayer( //sets the tile layer, which you can think of as a collection of images which outline streets, rivers, city names, and other visual aspects of a map.
        'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
        {
          maxZoom: 18,
          attribution: 'vue-leaflet',
        }
      );
      this.tileLayer.addTo(this.map);

      this.marker = L.marker(["-29.6725216666667", "30.70266"]).addTo(this.map)
      .bindPopup('A pretty CSS3 popup.<br> Easily customizable.')
      .openPopup();
    },
    addMarkers(markerArray) { // Takes in object array and assigns markers accordingly
      markerArray.forEach(function (row) {
        L.marker(row.gps).addTo(this.map)
      })

    },
    // USE LATER for layer changes
    initLayers() {
        this.layers.forEach((layer) => {
          const markerFeatures = layer.features.filter(feature => feature.type === 'marker');
          // const polygonFeatures = layer.features.filter(feature => feature.type === 'polygon');

          markerFeatures.forEach((feature) => {
            feature.leafletObject = L.marker(feature.coords)
              .bindPopup(feature.name);
          });

          // polygonFeatures.forEach((feature) => {
          //   feature.leafletObject = L.polygon(feature.coords)
          //     .bindPopup(feature.name);
          // });

        });
    },
    // USE LATER for layer changes
    layerChanged(layerId, active) {
      /* Show or hide the features in the layer */
      const layer = this.layers.find(layer => layer.id === layerId);
      layer.features.forEach((feature) => {
        /* Show or hide the feature depending on the active argument */
        if (active) {
          feature.leafletObject.addTo(this.map);
        } else {
          feature.leafletObject.removeFrom(this.map);
        }
      });
    },
  }
};
</script>

<style lang="css">
.full {
  /* width: 1000px; */
  height: 80vh;
}
/* #map,
#next {
  height: 100%;
} */
body {
  padding: 0;
  margin: 0;
}
html,
body {
  height: 100%;
}
</style>