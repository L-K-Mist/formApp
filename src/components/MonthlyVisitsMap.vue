<template>
<v-flex xs12>
    <div v-if="$store.getters.showMap === true" class="full">
       <h1>Map</h1>
    <l-map  :zoom="zoom" :center="center" :min-zoom="minZoom" :max-zoom="maxZoom" 
        :attributionControl="attributionControl" :zoomend="zoomend">
        <l-tilelayer :url="url" :attribution="attribution"></l-tilelayer>
        <!-- <l-marker :position="center" :title="title" :opacity="opacity" :draggable="draggable"> -->
          <!-- <l-tooltip content="a tooltip"></l-tooltip>
          </l-marker>  -->
         <template v-for="(marker, index) in mapData" >
          <l-marker :key="index" :position="marker.gps" :title="marker.garden" :opacity="opacity" :draggable="false">
          <l-popup :content="marker.person"></l-popup>
          </l-marker>
        </template> 
    </l-map>

  <!--<l-map id="next">
  </l-map>-->
  </div>
  
</v-flex>
</template>

<script>
// TODOS bring markers in as a prop
//

import 'leaflet/dist/leaflet.css';
export default {
  data() {
    return {
      zoom: 13,
      center: ["-29.6725216666667", "30.70266"],
      //marker: ["-29.8677840828896", "30.7913825567812"],
      markers: [["-29.8677840828896", "30.7913825567812"], ["-29.8777840828896", "30.7813825567812"], ["-29.8277840828896", "30.8013825567812"]],
      minZoom: 8,
      maxZoom: 15,
      url: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
      attribution: 'vue-leaflet',
      title: 'vue-leaflet',
      opacity: 1,
      draggable: true,
      attributionControl: false,
    };
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
    zoomend() {
      console.log(1)
    }
  }
};
</script>

<style lang="css">
.full {
  /* width: 1000px; */
  height: 80vh;
}
#map,
#next {
  height: 100%;
}
body {
  padding: 0;
  margin: 0;
}
html,
body {
  height: 100%;
}
</style>