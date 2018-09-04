<template>
  <v-layout row wrap>
    <v-container grid-list-xl>
      <v-flex xs12>
        <v-card class="mb-2" v-for="(item, index) in photoReport" :key="index">
          <v-container grid-list-lg> 
            <v-layout row wrap>
              <v-flex xs12>
                <h3 class="headline mb-0">{{ item.date }} &nbsp; | &nbsp; {{ headlineSelect(item.name, item.gardenName)}}</h3>
                <br>
                <ul>
                  <li>Activity: {{item.farmingActivity}}</li>
                  <li>Person Mentored: {{ item.name }}</li>
                  <li>GPS Co-ordinates: {{ item.gps }}</li>
                </ul>
              </v-flex>
              <v-flex xs4
                v-for="(i, index) in item.photos" :key="index" >
                <img :src="'File:' + i.path">           
              </v-flex>
            </v-layout>
          </v-container>
        </v-card>
        
      </v-flex>
    </v-container>
  </v-layout>
</template>

<script>
import moment from "moment";

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
