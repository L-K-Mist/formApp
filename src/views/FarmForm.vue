<template>
    <v-layout row wrap>
        <v-container grid-list-md>
            <v-flex xs12>
                <v-text-field
                    name="name"
                    label="name"
                    prepend-icon="person"
                ></v-text-field>
            </v-flex>
            <v-flex @click.stop="openCamera" xs12>
                <v-text-field
                    disabled=""
                    name="name"
                    label="click to add photo"
                    prepend-icon="camera_alt"
                    :prepend-icon-cb="openCamera"
                    
                ></v-text-field>
            </v-flex>
            <v-flex v-if="$store.getters.selectedPic !== null" xs12>
                <img height="90vh" :src="$store.getters.selectedPic.src"/>
            </v-flex>    
        </v-container>
        <cam-dialog></cam-dialog>
    </v-layout>
</template>
<script>
import CamDialog from '@/components/Camera.vue';
export default {
    methods: {
        openCamera() {
            this.$store.dispatch("showCameraDialog", true)
        }
    },
    components: {
        CamDialog
    }
}
</script>

