<template>
    <v-flex>
        <h1>The Fair Food Foundation</h1>
        <h4>{{ date }}</h4>
    </v-flex>
</template>
<script>
import moment from "moment";

export default {
    computed: {
        date(){
            return moment(this.$store.getters.reportMonth).format("MMMM YYYY")
        }
    }
}
</script>

