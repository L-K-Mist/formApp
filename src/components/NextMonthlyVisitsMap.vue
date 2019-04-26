<template>
  <div v-if="showMap">
    <div>
      <h1>Map</h1>
    </div>
    <div style="height: 47%; overflow: auto;">
      Zoom: level <input v-model="map.zoom" type="number">
      <br>
      Center : <span> {{ map.center }} </span><br>
      Bounds : <span> {{ map.bounds }} </span><br>
      <hr/>
    </div>
      <l-map style="height: 70vh" :zoom="map.zoom" :options="map.options"
      :center="map.center" :min-zoom="map.minZoom" :max-zoom="map.maxZoom" >
      <l-control-layers :position="map.layersPosition"/>
      <l-tile-layer v-for="(tileProvider, index) in tileProviders" :key="index"
        layerType="base" :name="tileProvider.name" :visible="tileProvider.visible"
        :url="tileProvider.url" :attribution="tileProvider.attribution" :token="token"/>
      <l-control-zoom :position="map.zoomPosition" />
      <l-control-attribution :position="map.attributionPosition" :prefix="map.attributionPrefix" />
      <l-control-scale :imperial="map.imperial" />
      <l-layer-group v-for="item in stuff" :key="item.id" :visible="item.visible" >
        <l-layer-group :visible="item.markersVisible" >
          <l-marker v-for="(row, index) in visitData" :key="index"
            :visible="true" :draggable="false"
            :lat-lng="row.gps" @click="alert(row)" />
        </l-layer-group>
       </l-layer-group>
    </l-map>
  </div>
</template>

<script>
import {
  LMap,
  LTileLayer,
  LMarker,
  LLayerGroup,
  LTooltip,
  LPopup,
  LControlZoom,
  LControlAttribution,
  LControlScale,
  LControlLayers
} from "vue2-leaflet";
import Glyph from "leaflet.icon.glyph";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css";
import "leaflet-defaulticon-compatibility";
//
var customIcon = L.icon({
  iconUrl: "images/layers.png",
  shadowUrl: ""
});
const tileProviders = [
  {
    name: "OpenStreetMap",
    visible: true,
    attribution:
      '&copy; <a target="_blank" href="http://osm.org/copyright">OpenStreetMap</a> contributors',
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
  },
  {
    name: "OpenTopoMap",
    visible: false,
    url: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
    attribution:
      'Map data: &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
  }
];
export default {
  name: "example",
  components: {
    LMap,
    LTileLayer,
    LMarker,
    LLayerGroup,
    LTooltip,
    LPopup,
    LControlZoom,
    LControlAttribution,
    LControlScale,
    LControlLayers
  },
  data() {
    return {
      map: {
        center: { lng: 30.8021097164601, lat: -29.9852711241692 },
        bounds: L.latLngBounds(
          { lat: 46.573931908971865, lng: -4.757080078125001 },
          { lat: 48.850224803672056, lng: 4.603271484375001 }
        ),
        options: { zoomControl: false, attributionControl: false },
        zoom: 10,
        minZoom: 1,
        maxZoom: 20,
        zoomPosition: "topleft",
        attributionPosition: "bottomright",
        layersPosition: "topright",
        attributionPrefix: "Vue2Leaflet",
        imperial: false
      },

      opacity: 0.6,
      token: "your token if using mapbox",

      Positions: ["topleft", "topright", "bottomleft", "bottomright"],
      tileProviders: tileProviders,
      stuff: [{ id: "s1", visible: true, markersVisible: true }]
    };
  },
  computed: {
    visitData() {
      return this.$store.getters.mapData;
    },
    showMap() {
      return this.$store.getters.showMap;
    }
  },
  methods: {
    alert(item) {
      alert("this is " + JSON.stringify(item));
    }
  }
};
</script>