<template>
<v-container fluid grid-list-xl>
    <v-layout row>
      <v-flex xs3>
        <v-card>
            <v-text-field box label="name or email contains: " v-model="filterValue"></v-text-field>
            <v-checkbox v-model="selected" label="John" value="John"></v-checkbox>
            <v-checkbox v-model="selected" label="Jacob" value="Jacob"></v-checkbox>
        </v-card>
            <v-btn :loading="loading" :disabled="loading"
              @click="$store.dispatch('filterFarmers', filterValue)" color="success">Filter By Selection</v-btn>        
      </v-flex>
    </v-layout>
    <v-container grid-list-xs>
    <v-layout v-for="person in filteredFarmers" :key="person.name"
      v-if="filteredFarmers" row>
      <v-flex xs12>
      <v-card>
        <v-card-title primary-title>
          <h3>{{person.name}} {{person.personalDetails.lastName}}</h3>        
        </v-card-title>
        <v-card-text>
          <h3>Farming Activities</h3>
          <p v-if="person.farmingActivities.category">Farming Category: {{person.farmingActivities.category}}</p> 
          <p v-if="person.farmingActivities.longDescription">Farming Activities: {{person.farmingActivities.longDescription}}</p>         
          <p>{{ person.email}}</p> 
        </v-card-text>
      </v-card>
      </v-flex>
    </v-layout>
    </v-container>
</v-container>
</template>

<script>
export default {
  mounted() {
    this.$store.dispatch("filterFarmers", ""); // Start off with nothing filtered ie. All showing
  },
  data() {
    return {
      filterValue: null,
      selected: []
    };
  },
  computed: {
    filteredFarmers() {
      return this.$store.getters.filteredFarmers;
    },
    loading() {
      return this.$store.getters.farmerFilterLoading;
    }
  }
};
</script>

<style>
/* .custom-loader {
  animation: loader 1s infinite;
  display: flex;
}
@-moz-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@-webkit-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@-o-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
} */
</style>