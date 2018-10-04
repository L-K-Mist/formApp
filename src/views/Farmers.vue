<template>
<v-container grid-list-xs>
    <v-layout row wrap>
        <v-card>
            <v-text-field box label="name or email contains: " v-model="filterValue"></v-text-field>
            <v-btn @click="$store.dispatch('filterFarmers', filterValue)" color="success">Filter By Selection</v-btn>
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
  computed: {}
};
</script>

