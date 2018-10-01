<template>
  <v-layout row wrap>
        <v-btn class="not-print" color="info" @click="checkRefs">Compress Images</v-btn>
    <v-container>
        <v-card id="mentor-visit"  class="p-card texty" v-for="(item, index) in photoReport" :key="index" >
          <v-container  @click="$delete(photoReport, index)" grid-list-xs> 
            <v-layout row wrap>
              <v-flex class="pb-0 mb-0" xs12>
                <h3 class="mb-0 ml-1"> {{ headlineSelect(item.name, item.gardenName)}} &nbsp; | &nbsp; {{ item.date }}</h3>
              </v-flex>
              <v-layout row >
                <v-flex xs4>
                  <ul class="texty mt-2" >
                    <!-- <li>Activity: {{item.farmingActivity}}</li> -->
                    <li>Person Mentored: {{ item.name }}</li>
                    <li>GPS Co-ordinates: {{ item.gps }}</li>
                  </ul>
                </v-flex>
              <v-layout class="mt-3" row justify-end>
                <v-flex class="p-image mb-4 mr-2 " xs3
                  v-for="(i, index) in item.photos" :key="index" >
                  <img ref="images"  :src="'File:' + i.path">           
                </v-flex>
              </v-layout>
              </v-layout>
            </v-layout>
          </v-container>
        </v-card> 
    </v-container>
  </v-layout>
</template>

<script>
import moment from "moment";
import { createObjectURL, canvasToBlob } from "blob-util";
//  + ' index: ' + index + ' key: ' + key
export default {
  props: ["photoReport"],
  computed: {
    // photoReport() {
    //   return this.$store.getters.photoReport
    // }
  },
  methods: {
    headlineSelect(person, garden) {
      // chooses headline from metadata. If there's a garden name then garden else person name
      if (garden !== "") {
        // If garden name is not empty...
        return garden + " Community Garden"; // ... say the garden name and "Community Garden"
      } else {
        return person + "'s Garden"; // Or if garden name is empty say So-and-so's Garden
      }
    },
    checkRefs() {
      var rawImages = this.$refs.images;
      var compressedImages = [];
      for (const image of rawImages) {
        var canvas = document.createElement("canvas");
        var rawImageSrc = image.src;

        canvas.width = image.clientWidth * 2;
        canvas.height = image.clientHeight * 2;
        var ctx = canvas.getContext("2d"); // Once you have the image preview in an <img> element, you can draw this image in a <canvas> element to pre-process the file.
        ctx.drawImage(
          image,
          0,
          0,
          image.clientWidth * 2,
          image.clientHeight * 2
        );

        canvasToBlob(canvas, "image/jpeg").then(function(blob) {
          console.log("TCL: --------------------------------");
          console.log("TCL: reader.onload -> blob", blob);
          console.log("TCL: --------------------------------");
          compressedImages.push(blob);
          var blobURL = createObjectURL(blob);
          image.src = blobURL;
        });
      }
      console.log("TCL: checkRefs -> rawImages", rawImages);
      var compressedImages = [];
    }
  },
  components: {}
};
</script>

<style>
img {
  object-fit: contain;
  align-items: center;
  flex-flow: row nowrap;
  display: flex;
  max-width: 100%;
}
</style>
