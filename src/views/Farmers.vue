<template>
<v-container grid-list-xl>
    <v-layout row>
        <v-card>
            <v-text-field box label="name or email contains: " v-model="filterValue"></v-text-field>
            <v-btn :loading="loading" :disabled="loading"
              @click="$store.dispatch('filterFarmers', filterValue)" color="success">Filter By Selection</v-btn>
        </v-card>
    </v-layout>
    <v-layout v-for="person in filteredFarmers" :key="person.name"
      v-if="filteredFarmers" row>
      <v-card >
        Name: {{person.name}} 
        
        Email: {{ person.email}}
      </v-card>
    </v-layout>
</v-container>
</template>

<script>
export default {
  mounted() {
    this.$store.dispatch("filterFarmers", ""); // Start off with nothing filtered ie. All showing
  },
  data() {
    return {
      filterValue: null
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