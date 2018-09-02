<template>
    <v-layout row wrap>
        <v-flex xs12>
            <h3>Reports Received: </h3>
        </v-flex>
        <v-chip v-for="(report, index) in reportsReceived" :key="index" outline color="green">
      <v-icon left>check_circle</v-icon>
      {{ report.name }}
    </v-chip>
    </v-layout>
</template>
<script>
import _ from 'lodash'
import MonthPicker from './MonthPicker'
export default {
    computed: {
        reportMonth() {
            return this.$store.getters.reportMonth
        },
        reportsReceived(){
            return _.filter(this.$store.getters.filesReceived, { month: this.reportMonth });
        },
    },
    components: {
        MonthPicker
    }
}
</script>

