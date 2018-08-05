<template>
    <v-dialog v-model="this.$store.getters.showCameraDialog" fullscreen transition="dialog-bottom-transition" :overlay="false">
        <v-card>
            <v-toolbar dark color="primary">
                <v-btn icon @click.native="showCam(false)" dark>
                    <v-icon>close</v-icon>
                </v-btn>
                <v-toolbar-title>Settings</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-toolbar-items>
                    <v-btn dark flat @click.native="dialog = false">Save</v-btn>
                </v-toolbar-items>
            </v-toolbar>
            <video ref="video" class="camera-stream"/>
        </v-card>
    </v-dialog>
</template>
<script>
  export default {
    mounted () {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(mediaStream => {
          this.$refs.video.srcObject = mediaStream
          this.$refs.video.play()
        })
        .catch(error => console.error('getUserMedia() error:', error))
    },
    methods: {
        showCam(bool){
            this.$store.dispatch("showCameraDialog", bool)
        }
    }
  }
</script>
