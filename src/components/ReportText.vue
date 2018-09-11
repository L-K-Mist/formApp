<template>
    <v-layout row wrap>
        <v-container grid-list-sx>
            <v-flex xs12>
              <v-flex xs6>
                  <v-text-field
                    @click="mhSeedlings = ''"
                    v-model="mhSeedlings"
                    label="Seedlings supplied to Marianhill Co-op Gardens"
                    :value="mhSeedlings"
                    suffix="Seedlings"
                  ></v-text-field>                
                  <v-text-field
                    @click="farmers.supplied = ''"
                    v-model="farmers.supplied"
                    label="Kilograms supplied by farmers"
                    :value="farmers.supplied"
                    suffix="kg"
                  ></v-text-field>
                  <v-text-field
                    @click="farmers.generatedIncome = ''"
                    v-model="farmers.generatedIncome"
                    label="... generating an income of: "
                    :value="farmers.supplied"
                    prefix="R"
                  ></v-text-field>
                </v-flex>
              <v-card>
              </v-card>
                <v-card>
                    <v-card-title primary-title>
                        <h1>The Fair Food Foundation</h1>
                    </v-card-title>
                    <v-card-text>
                        <v-flex xs12>
                          <template transition="slide-y-transition">
                            <h3>{{ date }}</h3>
                            <br>
                            <h4>Seedling Supply</h4>
                            <p>In {{ date }}, approximately {{ seedlingSum.toLocaleString() }} seedlings were distributed to {{ supportedGrowers.toLocaleString() }} supported growers, as well as {{ mhSeedlings }} to the Mariannhill Co-Op Gardens. This seedling sale figure equates to an approximated planted area of {{ plantedArea.toLocaleString() }} m<span>2</span>, which if all are successfully grown represent an estimated yield  of approximately {{ cropYield.toLocaleString() }}T, which at retail value is about R{{ (cropValue * 1000).toLocaleString() }}.  </p>
                          </template>
                          <template transition="slide-y-transition"
                              v-if="countMentorVisits !== null">
                            <h4>Mentor Visits</h4>
                            <p>{{ countMentorVisits.toLocaleString() }} mentor visits were conducted in {{ date }} to {{ $store.getters.countGrowersVisited.toLocaleString() }} Growers.  Most mentor visits were conducted to capture crops in the ground (General Mentorship), to deliver seedlings, or collect produce/seed for sale.  </p>
                          </template>
                          <template transition="slide-y-transition"
                            v-if="totalValue !==null">
                            <h4>Crop Updates [not real data yet]</h4>
                            <p>{{ cropsRecorded.toLocaleString() }} Crops were captured in {{date}} with a total of {{ totalArea.toLocaleString() }} Ha.  This area represents approximately {{ totalKg.toLocaleString() }} T of produce.  At an average retail rate of R10 000 per Ton the crops captured have a value of  R{{ totalValue.toLocaleString() }}.  </p>
                          </template>     
                          <template transition="slide-y-transition"
                            v-if="$store.getters.honeySold !== null">
                            <h4>Produce Sales </h4>
                                                        <p>In {{month}}, produce was supplied to Shops and some veggie boxes were distributed to a few areas in and around Durban. Farmers supplied {{ farmers.supplied }}kg and generated an income of about R {{ farmers.generatedIncome }}. </p>
                            <p>Sales per category were as follows:</p>
                            <ul>
                            <li>Vegetables Sold is: R {{ $store.getters.vegSold.toLocaleString() }}.00</li>
                            <li>Herbs Sold is: R {{ $store.getters.herbsSold.toLocaleString() }}.00</li>
                            <li>Fruit Sold is: R {{ $store.getters.fruitSold.toLocaleString() }}.00</li>
                            <li v-if="$store.getters.honeySold > 1" >Honey Sold is: R {{ $store.getters.honeySold.toLocaleString() }}.00</li>

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
  data() {
    return {
      mhSeedlings: 10,
      farmers: {
        supplied: 1,
        generatedIncome: 1
      }
    };
  },
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


