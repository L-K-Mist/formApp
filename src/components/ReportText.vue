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
                          <template>
                            <h3>{{ date }}</h3>
                            <br>
                            <h4>Seedling Supply</h4>
                            <p>In {{ date }}, approximately {{ seedlingSum.toLocaleString() }} seedlings were distributed to {{ supportedGrowers.toLocaleString() }} supported growers, as well as [manual amount] to the Mariannhill Co-Op Gardens. This seedling sale figure equates to an approximated planted area of {{ plantedArea.toLocaleString() }} m<span>2</span>, which if all are successfully grown represent an estimated yield  of approximately {{ cropYield.toLocaleString() }}T, which at retail value is about R{{ (cropValue * 1000).toLocaleString() }}.  </p>
                          </template>
                          <template v-if="countMentorVisits !== null">
                            <h4>Mentor Visits</h4>
                            <p>{{ countMentorVisits.toLocaleString() }} mentor visits were conducted in {{ date }} to {{ $store.getters.countGrowersVisited.toLocaleString() }} Growers.  Most mentor visits were conducted to capture crops in the ground (General Mentorship), to deliver seedlings, or collect produce/seed for sale.  </p>
                          </template>
                          <template v-if="totalValue !==null">
                            <h4>Crop Updates [not real data yet]</h4>
                            <p>{{ cropsRecorded.toLocaleString() }} Crops were captured in {{date}} with a total of {{ totalArea.toLocaleString() }} Ha.  This area represents approximately {{ totalKg.toLocaleString() }} T of produce.  At an average retail rate of R10 000 per Ton the crops captured have a value of  R{{ totalValue.toLocaleString() }}.  </p>
                          </template>     
                          <template v-if="$store.getters.honeySold !== null">
                            <h4>Produce Sales </h4>
                            <p>[ @Paula: I'm not sure what figures you count for income generated. Since categorising is easy, might you rather want a text verion of the break-down bulleted below? ]</p>
                            <p>In {{month}}, produce was supplied to Shops and some veggie boxes were distributed to a few areas in and around Durban. Farmers supplied 1002kg and generated an income of about R10 900[text not calc]. </p>
                            <p>Sales per category were as follows:</p>
                            <ul>
                            <li>Vegetables Sold is: R {{ $store.getters.vegSold.toLocaleString() }}.00</li>
                            <li>Herbs Sold is: R {{ $store.getters.herbsSold.toLocaleString() }}.00</li>
                            <li>Fruit Sold is: R {{ $store.getters.fruitSold.toLocaleString() }}.00</li>
                            <li>Honey Sold is: R {{ $store.getters.honeySold.toLocaleString() }}.00</li>

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
    month() {
      return moment(this.$store.getters.reportMonth).format("MMMM");
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
    },

    cropsRecorded() {
      return this.$store.getters.cropsRecorded;
    },
    totalArea() {
      return this.$store.getters.totalArea;
    },
    totalKg() {
      return this.$store.getters.totalKg;
    },
    totalValue() {
      return this.$store.getters.totalValue;
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


