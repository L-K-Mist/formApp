<template>
   <v-layout row wrap>
      <v-container grid-list-xs>
        <v-flex xs12 sm10 offset-sm1 md8 offset-md2>
            
          <h1>Mentor Visit Pictures</h1>
          <template>
                <div class="container">
                <!--UPLOAD-->
                    <div class="dropbox" @drop="multiFile" @dragover="stopDefault">
                    <h1>Upload images</h1>
                        <p>
                        Drag your image file(s) here to begin
                        </p>
                    </div>
            </div>
            <v-btn @click.stop="$store.dispatch('connectImagesToVisits')"  color="info">Ready to Test the Union of Unconnected Tables?</v-btn>
        </template>
        </v-flex>
        <br><br>
     <p>     [@Paula: The idea is that for every row (that has three pictures) one of these cards will appear - in date order. I do get the feeling though, that at some stage we may want to pivot around some repeated field (like date or geographic area) to more logically group the entries and avoid attribute repetition - but I'll leave that thinking to you.]
</p> <br>
        <mentor-pictures></mentor-pictures>
      </v-container>   
    </v-layout>
</template>
<script>
  import MentorPictures from "@/components/MentorPictures"
export default {
  data() {
    return {
      uploadedFiles: [],
      uploadError: null,
      currentStatus: null,
      uploadFieldName: "photos"
    };
  },
  computed: {},
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
    MentorPictures
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
