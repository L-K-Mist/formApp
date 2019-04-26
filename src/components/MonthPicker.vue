<template>
  <v-layout row wrap>
    <v-flex xs11 sm5>
      <v-dialog
        ref="dialog"
        v-model="modal"
        :return-value.sync="date"
        persistent
        lazy
        full-width
        width="290px"
      >
        <v-text-field
          slot="activator"
          v-model="date"
          label="Month in question"
          prepend-icon="event"
          readonly
        ></v-text-field>
        <v-date-picker :picker-date="date"   v-model="date" type="month" scrollable>
          <v-spacer></v-spacer>
          <v-btn flat color="primary" @click="modal = false">Cancel</v-btn>
          <v-btn flat color="primary" @click="saveDate(date)">OK</v-btn>
        </v-date-picker>
      </v-dialog>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  mounted() {
    this.date = this.$store.getters.reportMonth;
    console.log("TCL: created -> this.date", this.date);
  },
  data: () => ({
    date: null,
    menu: false,
    modal: false
  }),
  methods: {
    saveDate(date) {
      this.$refs.dialog.save(date);
      this.$store.dispatch("reportMonth", date);
    }
  }
};
</script>