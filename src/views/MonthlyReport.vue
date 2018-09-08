<template>
  <div class="parse">
    <v-layout row wrap>
      <v-container grid-list-xs>
        <v-flex xs12 sm10 offset-sm1 md8 offset-md2>
          <h1>Monthly Narrative Report</h1>
          <month-picker></month-picker>
          <v-slide-x-reverse-transition>
            <template v-if="$store.getters.reportMonth !== null">
              <v-flex xs12>
                <h3>Select CSV</h3>
                <h5>Better to load them in the order they appear in the report, but system can handle either way.</h5>
                <input
                  id="fileInput"
                  type="file"
                  @change="upload">
                
              </v-flex>
            </template>
          </v-slide-x-reverse-transition>
          <v-flex xs12>
            <reports-received transition="slide-x-reverse-transition" v-if="$store.getters.reportMonth !== null && $store.getters.ReportsReceived !== null"></reports-received>
            <!-- <report-text v-if="$store.getters.cropValue !== null"></report-text> -->
            <br>
            <report-text v-if="$store.getters.cropValue !== null"></report-text>
            <br><br>
            <simple-table v-if="$store.getters.salesForm !== null"></simple-table>
          </v-flex>
        </v-flex>

          <v-flex id="pouch" v-for="(doc, index) in docs" :key="index" xs12>
            {{ doc._id }}
            
          </v-flex>
      </v-container>     
    </v-layout>
  </div>
</template>

<script>
import Papa from "papaparse";
import Blob from "blob";
import FileSaver from "file-saver";
import MonthPicker from "@/components/MonthPicker";
import SimpleTable from "@/components/SimpleTable";
import ReportText from "@/components/ReportText";
import ReportsReceived from "@/components/ReportsReceived";
// import jsPDF from "jspdf";

export default {
  name: "parse",
  data() {
    return {
      imageIndex: []
    };
  },
  computed: {
    docs() {
      return this.$store.getters.docs;
    }
  },
  methods: {
    stopDefault(e) {
      e.preventDefault();
      e.stopPropagation();
    },

    // async multiFile(e) {
    //   e.preventDefault();
    //   e.stopPropagation();
    //   //this.imageIndex = []; // clear the image index for a fresh "upload"
    //   var imageIndex = [];
    //   for (let f of e.dataTransfer.files) {
    //     if (!f.path.includes(".hash")) {
    //       //console.log("File(s) you dragged here: ", f.path);
    //       imageIndex.push(f.path);
    //     }
    //   }
    //   var fileNames = imageIndex.map(entry => {
    //     var fn = entry.match(/([^/])+/g);
    //     fn = fn[fn.length - 1];
    //     var obj = {
    //       path: entry,
    //       name: fn
    //     };
    //     return obj;
    //   });
    //   console.log("​asyncmultiFile -> fileNames", fileNames);

    //   this.imageIndex = fileNames;
    //   console.log("​asyncmultiFile -> this.imageIndex", this.imageIndex);
    //   this.$store.dispatch("processImageIndex", this.imageIndex);
    // },
    upload(e) {
      var infoMailRoomNeeds = {};
      infoMailRoomNeeds.fileToLoad = event.target.files[0];
      console.log("​---------------------------------");
      console.log("​upload -> fileToLoad", infoMailRoomNeeds.fileToLoad.name);
      console.log("​---------------------------------");
      const reader = new FileReader();
      reader.readAsText(infoMailRoomNeeds.fileToLoad);
      reader.onload = fileLoadedEvent => {
        infoMailRoomNeeds.result = fileLoadedEvent.target.result;
        this.$store.dispatch("prepareCSV", infoMailRoomNeeds);
      };
    },
    save() {
      const blob = new Blob([this.parseJSONtoCSV()], { type: "text/csv" });
      FileSaver.saveAs(blob, "test.csv");
    }
    // parseJSONtoCSV () {
    //   return Papa.unparse(this.doc)
    // }
  },
  // watch: {
  //   imageIndex(newVal) {
  //     if (newVal.length > 0) {
  //       this.$store.dispatch("processImageIndex", newVal);
  //     } else return;
  //   }
  // },
  components: {
    MonthPicker,
    SimpleTable,
    ReportText,
    ReportsReceived
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.body {
  display: flex;
  justify-content: center;
  margin-top: 30px;
}
.entry {
  width: 40%;
}
.entry-result {
  width: 100%;
  height: 50vh;
}
.preview {
  width: 40%;
  text-align: left;
}
</style>

