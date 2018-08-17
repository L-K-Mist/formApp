<template>
  <div class="parse">
    <v-layout row wrap>
    <!-- <a
      @click='save'
      type='button'
      download >
      Save
    </a>
    <div class="body">
      <div class="entry">
        <textarea 
          class="entry-result"
          v-model='doc'
          placeholder="Type here">
        </textarea>
      </div>
    </div> -->
      <v-container grid-list-xs>
        <v-flex xs12 sm10 offset-sm1 md8 offset-md2>
          <h1>Monthly Narrative Report</h1>
          <month-picker></month-picker>

            <div id="holder" @drop="multiFile" @dragover="stopDefault">
              Drag your file here  [Experimental please ignore] 
            </div>
            <img v-if="src !== null"  :src="src">
            <template v-if="$store.getters.reportMonth !== null">
              <h3>Select CSV</h3>
              <h5>Better to load them in the order they appear in the report, but system can handle either way.</h5>
              <input 
                id="fileInput"
                type="file"
                @change="upload">
            </template>
          <v-flex xs12>
            <!-- <report-text v-if="$store.getters.cropValue !== null"></report-text> -->
            <br>
            <report-text v-if="$store.getters.cropValue !== null"></report-text>
            <br><br>
            <simple-table v-if="$store.getters.salesForm !== null"></simple-table>

            <v-btn @click.stop="$store.dispatch('connectImagesToVisits')"  color="info">Ready to Test the Union of Unconnected Tables?</v-btn>
          
          </v-flex>
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

export default {
  name: "parse",
  data() {
    return {
      doc: null,
      picker: null,
      src: null,
      imageIndex: []
    };
  },
  methods: {
    // multiFile(e) {
    //   e.preventDefault();
    //   e.stopPropagation();

    //   for (let f of e.dataTransfer.files) {
    //     console.log("File(s) you dragged here: ", f.path);
    //   }
    // },
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
      console.log("​asyncmultiFile -> fileNames", fileNames);

      this.imageIndex = fileNames;
      console.log("​asyncmultiFile -> this.imageIndex", this.imageIndex);
      this.$store.dispatch("processImageIndex", this.imageIndex);
    },
    upload(e) {
      const that = this;
      const fileToLoad = event.target.files[0];
      console.log("​---------------------------------");
      console.log("​upload -> fileToLoad", fileToLoad.name);
      console.log("​---------------------------------");

      const reader = new FileReader();
      reader.readAsText(fileToLoad);
      reader.onload = fileLoadedEvent => {
        Papa.parse(fileLoadedEvent.target.result, {
          header: true,
          complete(results) {
            if (fileToLoad.name.includes("salesforms")) {
              that.$store.dispatch("salesForm", results.data);
              console.log("​complete -> fileToLoad.name", fileToLoad.name);
            } else if (fileToLoad.name.includes("mentorvisit")) {
              that.$store.dispatch("mentorVisits", results.data);
            } else if (fileToLoad.name.includes("cropupdate")) {
              that.$store.dispatch("cropsCaptured", results.data);
            } else if (fileToLoad.name.includes("producesales")) {
              that.$store.dispatch("produceSales", results.data);
            }
            //   console.log('complete', results)
            // that.doc = JSON.stringify(results.data, null, 2)
          },
          error(errors) {
            console.log("error", errors);
          }
        });
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
    ReportText
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

