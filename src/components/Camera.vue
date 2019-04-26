<template>
    <v-dialog v-model="this.$store.getters.showCameraDialog" fullscreen transition="dialog-bottom-transition" :overlay="false">
        <v-card>
            <v-toolbar dark color="primary">
                <v-btn icon @click.native="showCam(false)" dark>
                    <v-icon>close</v-icon>
                </v-btn>
                <v-toolbar-title>Take Some Photos and Pick the Best</v-toolbar-title>
                <v-spacer></v-spacer>
                <!-- <v-toolbar-items>
                    <v-btn dark flat @click.native="dialog = false">Save</v-btn>
                </v-toolbar-items> -->
            </v-toolbar>
            <v-container fill-height>
                <v-layout row wrap align-center>
                    <v-flex xs12 sm8 offset-sm2 class="text-xs-center"
                        v-if="cameraView">                    
                        <video ref="video" class="camera-stream"/> 
                        <v-icon color="pink" @click.stop="snapPic">camera</v-icon>    
                    </v-flex>
                    <v-flex v-else-if="!cameraView" xs12 sm8 offset-sm2 class="text-xs-center mt-3">            
                        <img class="camera-stream" :src="imageUrl"/>
                        <h4>Add to shortlist?</h4>
                        <v-icon class="ma-2" color="pink" @click.stop="shortlistPic">thumb_up</v-icon> 
                        <v-icon class="ma-2" color="pink" @click.stop="discardPic">thumb_down</v-icon>        
                    </v-flex>                    
                    <v-flex v-if="shortList.length > 0" xs12>
                        <h4>After you've got a few options choose the best to confirm</h4>
                        <v-layout row wrap align-content-start>
                            <v-flex class="text-xs-left" v-for="(image, index) in shortList" :key="index">
                                <img @click.stop="selectPic(image)" height="60vw" :src="image.src"/>
                            </v-flex>
                        </v-layout>
                    </v-flex>
                </v-layout>
            </v-container>
        </v-card>
    </v-dialog>
</template>
<script>
export default {
    data(){
        return {
            mediaStream: null,
            blob: null,
            imageUrl: "https://cdn.vuetifyjs.com/images/cards/desert.jpg",
            cameraView: true,
            shortList:[],
            
        }
    },
    mounted () {
      this.mountCam()
    },
    destroyed () {
        this.dismountCam()
    },
    methods: {
        mountCam(){
            navigator.mediaDevices.getUserMedia({video: { facingMode: "environment" } })  // Method asks user for permission to use camera AND selects the "environment" facing camera over "user" facing camera
            .then(mediaStream => {
                this.mediaStream = mediaStream
                this.$refs.video.srcObject = mediaStream
                this.$refs.video.play()
            })
            .catch(error => console.error('getUserMedia() error:', error))
        },
        dismountCam() {
            const tracks = this.mediaStream.getTracks()
            tracks.map(track => track.stop())
        },
        showCam(bool){
            this.$store.dispatch("showCameraDialog", bool)
        },
        snapPic() {
            const mediaStreamTrack = this.mediaStream.getVideoTracks()[0]
            const imageCapture = new window.ImageCapture(mediaStreamTrack)
            return imageCapture.takePhoto().then(blob => {
            console.log('​----------------------');
            console.log('​snapPic -> blob', blob);
            console.log('​----------------------');
                // this.$store.dispatch("captureImage", blob)
                this.blob = blob
                this.imageUrl = URL.createObjectURL(blob);
                this.cameraView = false
            })                        
        },
        discardPic() {
            this.cameraView = true
            this.mountCam()
        },
        shortlistPic() {
            this.shortList.push({
                src: this.imageUrl,
                blob: this.blob
                })
            console.log('​-----------------------------------------------');
            console.log('​shortlistPic -> this.shortList', this.shortList);
            console.log('​-----------------------------------------------');            
            this.mountCam()
            this.cameraView = true
        },
        selectPic(pic) {
        console.log('​----------------------');
        console.log('​selectPic -> pic', pic);
        console.log('​----------------------');
        this.$store.dispatch("selectPic", pic)
        this.$store.dispatch("showCameraDialog", false)
                    this.shortList = []
        }
    }
  }
</script>
<style scoped>
    .camera-stream {
        width: 100%;
        max-height: 70%;
    }
</style>
