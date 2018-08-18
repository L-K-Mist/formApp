<template>
  <v-layout row wrap>
      <v-card>
        <v-container grid-list-lg>
          <v-layout row wrap>
            <v-flex xs12>
              <h3 class="headline mb-0">{{ date }} &nbsp; | &nbsp; {{ headlineSelect(name, gardenName)}}</h3>
              <br>
              <ul>
                <li>Activity: {{farmingActivity}}</li>
                <li>Person Mentored: {{ name }}</li>
                <li>GPS Co-ordinates: {{ gps }}</li>
              </ul>
            </v-flex>
            <v-flex xs4
            v-for="(item, index) in visitPics" :key="index" >
            <img :src="'File:' + item">           
            </v-flex>
          </v-layout>
        </v-container>
      </v-card>
  </v-layout>
</template>

<script>
import moment from "moment";
export default {
  data(){
    return{ // this data represents one row of the pouch db dataset. We then program the view to produce one such card for every row of the dataset.
      date: moment("2018-07-31").format("DD MMMM YYYY"),
      farmingActivity: "Subsistence_grows_food_to_eat",
      gardenName: "Savanna Park",
      gps: "-29.87613, 30.8306783333333",
      memberArea: "KwaSanti",
      memberId: "2126",
      name: "Emelda Mfukengi",
      nationalId: "5409100591088", 
      visitPics: [ 
        "/home/dylan/Downloads/src/assets/rawData for edemame/mentor_visit/IMG_20180703_125441.jpg", 
        "/home/dylan/Downloads/src/assets/rawData for edemame/mentor_visit/IMG_20180703_125021.jpg", 
        "/home/dylan/Downloads/src/assets/rawData for edemame/mentor_visit/IMG_20180703_125155.jpg"
      ]
    }
  },
  methods: {
    headlineSelect(person, garden) { // chooses headline from metadata. If there's a garden name then garden else person name
    if(garden !== ""){ // If garden name is not empty...
      return garden + " Community Garden" // ... say the garden name and "Community Garden"
    } else { 
      return person + "'s Garden" // Or if garden name is empty say So-and-so's Garden
    }

    }
  }
}
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
