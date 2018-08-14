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
        <month-picker></month-picker>
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
          <report-text v-if="$store.getters.cropValue !== null"></report-text>
          <simple-table v-if="$store.getters.salesForm !== null"></simple-table>
          
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
      picker: null
    };
  },
  methods: {
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
              that.$store.dispatch("cropUpdate", results.data);
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

