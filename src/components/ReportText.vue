<template>
    <v-layout row wrap>
        <v-container grid-list-sx>
            <v-card>
                <v-flex xs12>
                    <h1>The Fair Food Foundation</h1>
                    <h3>{{ date }}</h3>
                    <br>
                    <p>In {{ date }}, approximately {{ seedlingSum }} seedlings were distributed to {{ supportedGrowers }} supported growers, as well as 2200 to the Mariannhill Co-Op Gardens. This seedling sale figure equates to an approximated planted area of 933m2, which if all are successfully grown represent an estimated yield  of approximately 4.19T, which at retail value is about R41 000.  
</p>
                </v-flex>           
                
            </v-card>
        </v-container>
    </v-layout>
</template>
<script>
import moment from "moment";

export default {
    computed: {
        date(){
            return moment(this.$store.getters.reportMonth).format("MMMM YYYY")
        },
        seedlingSum(){
            return this.$store.getters.seedlingSum
        },
        salesForm() {
            salesFormView = this.$store.getters.salesForm
            console.log('​------------------------------------------');
            console.log('​salesForm -> salesFormView', salesFormView);
            console.log('​------------------------------------------');
            
            return salesFormView
        },
        supportedGrowers(){
            
            return this.$store.getters.supportedGrowersCount
            
        }
    }
}
</script>

