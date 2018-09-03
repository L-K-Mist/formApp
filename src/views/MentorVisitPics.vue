<template>
   <v-layout row wrap>
      <v-container grid-list-xs>
        <v-flex xs12 sm10 offset-sm1 md8 offset-md2>
            
          <h1>Mentor Visit Pictures</h1>
          <template>
            <reports-received></reports-received>
            <div class="container">
            <!--UPLOAD-->
              <div class="dropbox" @drop="multiFile" @dragover="stopDefault">
              <h1>Upload images</h1>
                  <p>
                  Drag your image file(s) here to begin
                  </p>
                  <!-- <h3 v-if="photoReport !== null">Number of rows: {{ photoReport.length }}</h3> -->
              </div>               
            </div>
            <v-select
              :items="agriActivities"
              v-model="agriActivitiesSelected"
              label="Commercial or Non?"
            ></v-select>
            <v-btn color="success" @click="threePhotos = true">Remove Visits Missing Three Photos</v-btn>
            <!-- <v-btn @click.stop="$store.dispatch('connectImagesToVisits')"  color="info">Produce Draft Report for Editing</v-btn> -->
        </template>
        </v-flex>
        <br><br><br>
        <mentor-pictures :photoReport="photoReport" ></mentor-pictures>
      </v-container>   
    </v-layout>
</template>
<script>
import MentorPictures from "@/components/MentorPictures";
import ReportsReceived from "@/components/ReportsReceived";
export default {
  beforeCreate() {
    this.$store.dispatch("splitByCommercial");
  },
  data() {
    return {
      threePhotos: false,
      agriActivitiesSelected: "",
      agriActivities: ["Commercial", "Non-Commercial"],
      uploadedFiles: [],
      uploadError: null,
      currentStatus: null,
      uploadFieldName: "photos"
    };
  },
  watch: {
    agriActivitiesSelected(newVal) {
      console.log(
        "TCL: ---------------------------------------------------------------------------------------------"
      );
      console.log(
        "TCL: agriActivitiesSelected -> agriActivitiesSelected(newVal)",
        newVal
      );
      console.log(
        "TCL: ---------------------------------------------------------------------------------------------"
      );

      this.$store.dispatch("agriActivityFilter", newVal);
    }
  },
  computed: {
    photoReport() {
      if (this.agriActivitiesSelected === null) {
        return [];
      } else if (this.agriActivitiesSelected === "Commercial") {
        return this.$store.getters.commercialVisits;
      } else if (this.agriActivitiesSelected === "Non-Commercial") {
        return this.$store.getters.nonCommercialVisits;
      } else if (this.threePhotos === true) {
        return this.mustHaveThreePhotos(photoReport);
      }
    }
  },
  methods: {
    stopDefault(e) {
      e.preventDefault();
      e.stopPropagation();
    },

    async multiFile(e) {
      e.preventDefault();
      e.stopPropagation();
      //this.imageIndex = []; // clear the image index for a fresh "upload"
      var imageIndex = [];
      for (let f of e.dataTransfer.files) {
        if (!f.path.includes(".hash")) {
          //console.log("File(s) you dragged here: ", f.path);
          imageIndex.push(f.path);
        }
      }
      var fileNames = imageIndex.map(entry => {
        var fn = entry.match(/([^/])+/g);
        fn = fn[fn.length - 1];
        var obj = {
          path: entry,
          name: fn
        };
        return obj;
      });

      this.imageIndex = fileNames;
      console.log("​asyncmultiFile -> this.imageIndex", this.imageIndex);
      this.$store.dispatch("processImageIndex", this.imageIndex);
    }
  },
  components: {
    MentorPictures,
    ReportsReceived
  }
};
</script>
<style scoped>
.dropbox {
  outline: 2px dashed grey;
  /* the dash box */
  outline-offset: -10px;
  background: lightcyan;
  color: dimgray;
  padding: 10px 10px;
  min-height: 200px;
  /* minimum height */
  position: relative;
  cursor: pointer;
}
.input-file {
  opacity: 0;
  /* invisible but it's there! */
  width: 100%;
  height: 200px;
  position: absolute;
  cursor: pointer;
}
.dropbox:hover {
  background: lightblue;
  /* when mouse over to the drop zone, change color */
}
.dropbox p {
  font-size: 1.2em;
  text-align: center;
  padding: 50px 0;
}
</style>
