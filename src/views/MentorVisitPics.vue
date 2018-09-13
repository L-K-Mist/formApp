<template>
   <v-layout row wrap>
     <v-flex xs12>
       <v-container grid-list-xs>
          <form ref="fileform">
            <span>Drop the images here!</span>
            
          </form>
         
       </v-container>
     </v-flex>
     <v-container grid-list-md>
       <v-layout row wrap>
        <v-flex v-if="files.length > 0" 
              v-for="(file, key) in files" class="file-listing" :key="key">
              <img class="preview" v-bind:ref="'preview'+parseInt( key )"/>
              {{ file.name }}
        </v-flex>
         
       </v-layout>
       
     </v-container>


















      <v-container grid-list-xs>
        <v-flex xs12 sm10 offset-sm1 md8 offset-md2>
          <h1 class="print-title">Mentor Visit Pictures</h1>
            <div class="not-print">
              <template>
                <reports-received></reports-received>
                <div class="container">
                  <label>File
                    <input type="file" id="file" ref="file" v-on:change="handleFileUpload()"/>
                  </label>
                  <br><br>
                <!--UPLOAD-->
                  <div class="dropbox" @drop="multiFile" ref="files" @dragover="stopDefault">
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
                <next-monthly-visits-map></next-monthly-visits-map>
            </template> 
          </div> 
        </v-flex>
        <br><br><br>
        <v-btn color="success" @click="saveToPouch">Save to Local</v-btn>  
        <v-btn class="not-print" @click="printPDF"  color="success">Convert to PDF</v-btn>
        <mentor-pictures :photoReport="photoReport"  v-if="photoReport !== null"></mentor-pictures>
      </v-container>  
    </v-layout>
</template>
<script>
import MentorPictures from "@/components/MentorPictures";
import ReportsReceived from "@/components/ReportsReceived";
import { ipcRenderer } from "electron";
import NextMonthlyVisitsMap from "@/components/NextMonthlyVisitsMap";

export default {
  mounted() {
    //this.$store.dispatch("splitByCommercial");
    ipcRenderer.on("wrote-pdf", (event, path) => {
      this.ipcMessage = `Wrote pdf to : ${path}`;
      console.log("TCL: mounted -> this.ipcMessage", this.ipcMessage);
    });
    /*
      Listen to all of the drag events and bind an event listener to each
      for the fileform.
    */
    [
      "drag",
      "dragstart",
      "dragend",
      "dragover",
      "dragenter",
      "dragleave",
      "drop"
    ].forEach(
      function(evt) {
        /*
        For each event add an event listener that prevents the default action
        (opening the file in the browser) and stop the propagation of the event (so
        no other elements open the file in the browser)
      */
        this.$refs.fileform.addEventListener(
          evt,
          function(e) {
            e.preventDefault();
            e.stopPropagation();
          }.bind(this),
          false
        );
      }.bind(this)
    );

    /*
      Add an event listener for drop to the form
    */
    this.$refs.fileform.addEventListener(
      "drop",
      function(e) {
        /*
        Capture the files from the drop event and add them to our local files
        array.
      */
        for (let i = 0; i < e.dataTransfer.files.length; i++) {
          this.files.push(e.dataTransfer.files[i]);
        }
        this.getImagePreviews();
      }.bind(this) // bind the local component with the .bind(this) method to the function we are handling the drop event with. This gives us the capability to reference the component directly and set local parameters.
    );
  },
  data() {
    return {
      files: [],
      ipcMessage: "",
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
      this.$store.dispatch("splitByCommercial");
      this.$store.dispatch("connectPhotos");
    },
    photoReport(newVal) {
      this.$store.dispatch("photoReport", newVal);
      console.log("TCL: photoReport -> newVal", newVal);
      this.$store.dispatch("mapReportData", newVal);
    }
  },
  computed: {
    photoReport() {
      if (this.agriActivitiesSelected === null) {
        return [];
      } else if (this.agriActivitiesSelected === "Commercial") {
        return this.$store.getters.commercialThreePhotos;
      } else if (this.agriActivitiesSelected === "Non-Commercial") {
        return this.$store.getters.subsistenceThreePhotos;
      }
    },
    reportTitle() {
      if (this.agriActivitiesSelected === null) {
        return [];
      } else if (this.agriActivitiesSelected === "Commercial") {
        return "Commercial Mentoring";
      } else if (this.agriActivitiesSelected === "Non-Commercial") {
        return "Mentoring for Subsistance and Market Gardens";
      }
    }
  },
  methods: {
    imageInputInit() {},
    getImagePreviews() {
      /*
    Iterate over all of the files and generate an image preview for each one.
  */
      for (let i = 0; i < this.files.length; i++) {
        /*
      Ensure the file is an image file
    */
        if (/\.(jpe?g|png|gif)$/i.test(this.files[i].name)) {
          /*
        Create a new FileReader object
      */
          let reader = new FileReader();

          /*
        Add an event listener for when the file has been loaded
        to update the src on the file preview.
      */
          reader.addEventListener(
            "load",
            function() {
              this.$refs["preview" + parseInt(i)][0].src = reader.result;
            }.bind(this),
            false
          );

          /*
        Read the data for the file in through the reader. When it has
        been loaded, we listen to the event propagated and set the image
        src to what was loaded from the reader.
      */
          reader.readAsDataURL(this.files[i]);
        } else {
          console.log("not an image, but cool");
          /*
        We do the next tick so the reference is bound and we can access it.

        Since we are scoped outside of the file being an image, we know the file is a different file type. The catcher with this is we have to work inside the $nextTick method within VueJS. Since we are iterating over the files and VueJS is rendering the template, we have to make sure the references are bound so we can set the appropriate attribute on the src ta

        Now, the template is rendered and we can load the default file of our choice. We didn’t have to wait for the DOM to update on images, because the callback is on load which takes some time so our DOM is updated by the time the file is read in.
      */

          //     this.$nextTick(function() {
          //       this.$refs["preview" + parseInt(i)][0].src = "/images/file.png";
          //     });
        }
      }
    },
    printPDF() {
      ipcRenderer.send("print-to-pdf");
    },
    stopDefault(e) {
      e.preventDefault();
      e.stopPropagation();
    },

    async multiFile(e) {
      e.preventDefault();
      e.stopPropagation();
      this.files = this.$refs.files.files;
      console.log("TCL: asyncmultiFile ->  this.files", this.$refs.files);

      //this.imageIndex = []; // clear the image index for a fresh "upload"
      var imageIndex = [];
      var incomingImageFiles = [];
      for (let f of e.dataTransfer.files) {
        console.log("TCL: ---------------------------");
        console.log("TCL: asyncmultiFile -> f", f);
        console.log("TCL: ---------------------------");

        if (!f.path.includes(".hash")) {
          //console.log("File(s) you dragged here: ", f.path);
          imageIndex.push(f.path);
          incomingImageFiles.push(f);
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
    },
    async saveToPouch() {
      console.log("photoReport: ", photoReport);
    }
  },
  components: {
    MentorPictures,
    ReportsReceived,
    NextMonthlyVisitsMap
  }
};
</script>
<style>
div.file-listing img {
  height: 100px;
}
form {
  display: block;
  height: 400px;
  width: 400px;
  background: #ccc;
  margin: auto;
  margin-top: 40px;
  text-align: center;
  line-height: 400px;
  border-radius: 4px;
}
@media print {
  @page {
    size: A4;
    margin: 0.5cm;
  }
  #mentor-visit {
    color: black;
    /* position: absolute; */
    left: 0mm;
    page-break-inside: avoid;
    /* page-break-inside: auto; */
  }
  body {
    font: 6pt Georgia, "Times New Roman", Times, serif;
    color: black !important;
    line-height: 1.3;
  }
  ul {
    color: black !important;
  }
  .print-title {
    font-size: 15pt;
    position: absolute;
    top: -15mm;
  }
  /* .texty {
    color: "black";
  } */
  .headline {
    font-size: 15pt;
    color: black !important;
  }
  h1 {
    font-size: 10pt;
    color: black !important;
  }

  h2 {
    font-size: 8pt;
    margin-top: 25px;
  }
  h3 {
    color: black !important;
    font-size: 10pt;
  }
  .dropbox,
  .navbar,
  .not-print {
    display: none;
  }
  .v-toolbar {
    display: none;
  }
  nav,
  aside,
  footer,
  br {
    display: none;
  }
  section {
    background: none;
  }
  .container,
  .main {
    width: 90%;
    margin: 0px;
    padding: 0px;
  }
  .p-image {
    max-height: 50mm;
    float: left;
    width: 33.33%;
    /* width: 120; */
  }
  .p-card {
    margin: 2mm;
    padding: 2mm;
    max-height: 70mm;
    width: 98%;
    align-content: center;
  }
}
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
