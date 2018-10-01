<template>
   <v-layout row wrap>
      <v-container grid-list-xs>

        <v-flex xs12 sm10 offset-sm1 md8 offset-md2>
          <h1 class="not-print">Mentor Visit Pictures</h1>
            <div class="not-print">
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
                      

                <next-monthly-visits-map></next-monthly-visits-map>
            </template> 
          </div> 
        </v-flex>
        <br><br><br>
        <!-- <v-btn class="not-print" color="success" @click="saveToPouch">Save to Local</v-btn>   -->
        <v-btn class="not-print" @click="printPDF"  color="success">Convert to PDF</v-btn>
        <h1 class="print-title">{{ reportTitle }}</h1>
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
      console.log("refs: " + this.$refs.images);
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
      var imageIndex = [];
      for (let f of e.dataTransfer.files) {
        console.log("TCL: ---------------------------");
        console.log("TCL: asyncmultiFile -> f", f);
        console.log("TCL: ---------------------------");

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
