<template>
   <v-layout row wrap>
      <v-container grid-list-xs>
        <v-flex xs12 sm10 offset-sm1 md8 offset-md2>
          <h1 class="print-title">Mentor Visit Pictures</h1>
            <div class="not-print">
              <template>
                <reports-received></reports-received>
                <div id="cont" class="container">
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
            </template>
          </div> 
        </v-flex>
        <br><br><br>
        <mentor-pictures :photoReport="photoReport"  v-if="photoReport !== null"></mentor-pictures>
      <!-- <v-btn color="success" @click="saveToPouch">Save to Local</v-btn>   -->
        <v-btn class="not-print" @click="printPDF"  color="success">Convert to PDF</v-btn>
        <mentor-pictures :photoReport="photoReport" ></mentor-pictures>
      </v-container>   
    </v-layout>
</template>
<script>
import MentorPictures from "@/components/MentorPictures";
import ReportsReceived from "@/components/ReportsReceived";
import { ipcRenderer } from "electron";
import db from '@/api/pouchDB'
import { canvasToBlob } from "blob-util";

export default {
  mounted() {
    //this.$store.dispatch("splitByCommercial");
    ipcRenderer.on("wrote-pdf", (event, path) => {
      this.ipcMessage = `Wrote pdf to : ${path}`;
      console.log("TCL: mounted -> this.ipcMessage", this.ipcMessage);
    });
  },
  data() {
    return {
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

      this.$store.dispatch("agriActivityFilter", newVal);
      this.$store.dispatch("splitByCommercial");
      this.$store.dispatch("connectPhotos");
    },
    photoReport(newVal) {
      this.$store.dispatch("photoReport", newVal);
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
    }
  },
  methods: {
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
      //this.imageIndex = []; // clear the image index for a fresh "upload"
        var dt = e.dataTransfer;
        var files = dt.files;

        handleFiles(files);

        function handleFiles(files) {
          for (var i = 0; i < files.length; i++) {
            var file = files[i];
            
            if (!file.type.startsWith('image/')){ continue }
            
            var img = document.createElement("img");   
            img.src = window.URL.createObjectURL(file);
            img.file = file
            var cont = document.getElementById("cont")
            cont.appendChild(img); 
            var MAX_WIDTH = 800 * 0.8;
            var MAX_HEIGHT = 600 * 0.8;
            var width = img.width;
            var height = img.height;
            
            if (width > height) {
                if (width > MAX_WIDTH) {
                    height *= MAX_WIDTH / width;
                    width = MAX_WIDTH;
                }
            } else {
            if (height > MAX_HEIGHT) {
                width *= MAX_HEIGHT / height;
                height = MAX_HEIGHT;
                }
            }
            console.log('TCL: ----------------------------');
            console.log('TCL: handleFiles -> img', img);
            console.log('TCL: ----------------------------');

            var canvas = document.createElement('canvas')
            canvas.width = width;
            canvas.height = height;
            var ctx = canvas.getContext("2d"); // Once you have the image preview in an <img> element, you can draw this image in a <canvas> element to pre-process the file.
            console.log('TCL: ----------------------------------');
            console.log('TCL: handleFiles -> canvas', canvas);
            console.log('TCL: ----------------------------------');
            ctx.drawImage(img, width, height);

            canvasToBlob(canvas, "image/jpeg").then(function(blob) {
            console.log('TCL: --------------------------------');
            console.log('TCL: reader.onload -> blob', blob);
            console.log('TCL: --------------------------------');
              
              // try {
              //     var attachment = blob
              //     var result = await db.put({
              //       _id: file.name,
              //       _attachments: {
              //         [file.name + ".jpeg"]: {
              //           type: "image/jpeg",
              //           data: attachment
              //         }
              //       }
              //     });
              //     console.log('TCL: -------------------');
              //     console.log('TCL: result', result);
              //     console.log('TCL: -------------------');
                  
              // } catch (err) {
              //     console.log(err);
              // }
            })  
          }
       }
       
    },
      // this.$store.dispatch("receiveFile", imageIndex)
      // var fileNames = imageIndex.map(entry => {
      //   var fn = entry.match(/([^/])+/g);
      //   fn = fn[fn.length - 1];
      //   var obj = {
      //     path: entry,
      //     name: fn
      //   };
      //   return obj;
      // });

      // this.imageIndex = fileNames;
      // console.log("​asyncmultiFile -> this.imageIndex", this.imageIndex);
      // this.$store.dispatch("processImageIndex", this.imageIndex);
   

  },
  components: {
    MentorPictures,
    ReportsReceived
  }
  
};
</script>
<style>
@media print {
  /* @page {
    margin: 0.5cm;
  } */
  body {
    font: 6pt Georgia, "Times New Roman", Times, serif;
    color: "black";
    line-height: 1.3;
  }
  .print-title {
    position: absolute;
    top: -5mm;
  }
  .headline {
    font-size: 10pt;
  }
  h1 {
    font-size: 10pt;
    color: "black";
  }

  h2 {
    font-size: 8pt;
    margin-top: 25px;
  }
  h3 {
    color: "black";
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
  footer {
    display: none;
  }
  section {
    background: none;
  }
  .container,
  /* .content, */
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
