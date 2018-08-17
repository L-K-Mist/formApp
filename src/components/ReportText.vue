<template>
    <v-layout row wrap>
        <v-container grid-list-sx>
            <v-flex xs12 sm10 offset-sm1 md8 offset-md2>
                <v-card>
                    <v-card-title primary-title>
                        <h1>The Fair Food Foundation</h1>
                    </v-card-title>
                    <v-card-text>
                        <v-flex xs12>
                          <template v-if="cropValue !== null">
                            <h3>{{ date }}</h3>
                            <br>
                            <h4>Seedling Supply</h4>
                            <p>In {{ date }}, approximately {{ seedlingSum }} seedlings were distributed to {{ supportedGrowers }} supported growers, as well as 2200 [DeeNote: this number not is non-calc, dunno where to pull from] to the Mariannhill Co-Op Gardens. This seedling sale figure equates to an approximated planted area of {{ plantedArea }} m<span>2</span>, which if all are successfully grown represent an estimated yield  of approximately {{ cropYield }}T, which at retail value is about R{{ cropValue }} 000.  </p>
                          </template>
                          <template v-if="countMentorVisits !== null">
                            <h4>Mentor Visits</h4>
                            <p>{{ countMentorVisits }} mentor visits were conducted in {{ date }} to {{ $store.getters.countGrowersVisited }} Growers.  Most mentor visits were conducted to capture crops in the ground (General Mentorship), to deliver seedlings, or collect produce/seed for sale.  </p>
                          </template>
                          <template>
                            <h4>Crop Updates [not real data yet]</h4>
                            <p>47 Crops were captured in July 2018 with a total of 1.02 Ha.  This area represents approximately 46.2 T of produce.  At an average retail rate of R10 000 per Ha the crops captured have a value of  R462 000.  </p>
                          </template>     
                          <template v-if="$store.getters.honeySold !== null">
                            <h4>Produce Sales [not real data yet]</h4>
                            <p>In July, produce was supplied to Shops and some veggie boxes were distributed to a few areas in and around Durban. Farmers supplied 1002kg and generated an income of about R10 900. </p>
                            <p>But on Dilly-Dee's tweaked csv:</p>
                            <ul>
                            <li>Vegetables Sold is: R {{ $store.getters.vegSold }}.00</li>
                            <li>Herbs Sold is: R {{ $store.getters.herbsSold }}.00</li>
                            <li>Fruit Sold is: R {{ $store.getters.fruitSold }}.00</li>
                            <li>Honey Sold is: R {{ $store.getters.honeySold }}.00</li>

                            </ul>
                          </template>                                                   
                        </v-flex>                              
                    </v-card-text>
                </v-card>             
            </v-flex>
        </v-container>
    </v-layout>
</template>
<script>
import moment from "moment";

export default {
  computed: {
    date() {
      return moment(this.$store.getters.reportMonth).format("MMMM YYYY");
    },
    seedlingSum() {
      return this.$store.getters.seedlingSum;
    },
    salesForm() {
      salesFormView = this.$store.getters.salesForm;
      console.log("​------------------------------------------");
      console.log("​salesForm -> salesFormView", salesFormView);
      console.log("​------------------------------------------");

      return salesFormView;
    },
    supportedGrowers() {
      return this.$store.getters.supportedGrowersCount;
    },
    plantedArea() {
      return this.$store.getters.plantedArea;
    },
    cropYield() {
      return this.$store.getters.cropYield;
    },
    cropValue() {
      return this.$store.getters.cropValue;
    },
    countMentorVisits() {
      return this.$store.getters.countMentorVisits;
    },
    countGrowersVisited() {
      return this.$store.getters.countGrowersVisited;
    }
    /**
     * ​visitsCount 46
CropUpdates.js?8c19:51 ​totalArea 1.30
CropUpdates.js?8c19:54 ​totalKg 58504.5
CropUpdates.js?8c19:58 ​totalValue 585045
CropUpdates.js?8c19:61 ​altTotalValue 585045
     */
  }
};
</script>
<style scoped>
span {
  vertical-align: super;
  font-size: 50%;
}
</style>


