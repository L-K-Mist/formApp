<template>
  <v-layout row wrap>
    <v-btn color="info" @click="checkRefs">check refs</v-btn>
    <v-container grid-list-xl>
        <v-card id="mentor-visit"  class="p-card texty" ref="visitCards" v-for="(item, index) in photoReport" :key="index">
          <v-container grid-list-lg> 
            <v-layout row wrap>
              <v-flex xs12>
                <h3 class=" mb-0"> {{ headlineSelect(item.name, item.gardenName)}} &nbsp; | &nbsp; {{ item.date }}</h3>
                <br>
              </v-flex>
              <v-layout row >
                <v-flex xs4>
                  <ul class="texty">
                    <!-- <li>Activity: {{item.farmingActivity}}</li> -->
                    <li>Person Mentored: {{ item.name }}</li>
                    <li>GPS Co-ordinates: {{ item.gps }}</li>
                  </ul>
                </v-flex>
              <v-layout row justify-end>
   
                  <v-flex class="p-image mb-4 mr-4 "   xs3
                    v-for="(i, index) in item.photos" :key="index" >
                    <img  ref='images'  :src="'File:' + i.path">           
                  </v-flex>
                <v-flex id="cont" xs12>
                  
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
import { canvasToBlob } from "blob-util";
import { createObjectURL } from "blob-util";
/**
 * TODO Next:  Intercept these images right on upload, compress them then before attaching to the report.
 */
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
      // var imageData = rawImages.map(
      //   image => image.currentSrc,
      //   image.clientHeight,
      //   image.clientWidth,
      //   image.src
      // );
      for (let index = 0; index < rawImages.length; index++) {
        const image = rawImages[index];
        console.log("TCL: checkRefs -> element", image);

        var canvas = document.createElement("canvas");
        var rawImageSrc = image.currentSrc;

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
        console.log("TCL: checkRefs -> canvas", canvas);
        canvasToBlob(canvas, "image/jpeg").then(function(blob) {
          console.log("TCL: --------------------------------");
          console.log("TCL: reader.onload -> blob", blob);
          console.log("TCL: --------------------------------");
          compressedImages.push(blob);
          if (compressedImages.length == rawImages.length) {
            replaceImages();
          }
        });
      }

      // rawImages.forEach(function(image) {
      // var canvas = document.createElement("canvas");
      // canvas.width = width;
      // canvas.height = height;
      // var ctx = canvas.getContext("2d"); // Once you have the image preview in an <img> element, you can draw this image in a <canvas> element to pre-process the file.
      // console.log("TCL: ----------------------------------");
      // console.log("TCL: handleFiles -> canvas", canvas);
      // console.log("TCL: ----------------------------------");
      // ctx.drawImage(img, width, height);
      // canvasToBlob(canvas, "image/jpeg").then(function(blob) {
      //   console.log("TCL: --------------------------------");
      //   console.log("TCL: reader.onload -> blob", blob);
      //   console.log("TCL: --------------------------------");
      // });
      // });
      function replaceImages() {
        var selectedBlob = compressedImages[2];
        var blobURL = createObjectURL(selectedBlob);
        console.log("TCL: checkRefs -> blobURL", blobURL);

        var newImage = document.createElement("img");
        newImage.src = blobURL;
        var cont = document.getElementById("cont");
        cont.appendChild(newImage);
        console.log("TCL: checkRefs -> rawImages", rawImages);
        console.log("TCL: checkRefs -> compressedImages", compressedImages);
        console.log("this.photoReport", this.photoReport);
      }
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
