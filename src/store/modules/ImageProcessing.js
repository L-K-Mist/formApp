import db from '@/api/pouchDB'
import { canvasToBlob } from "blob-util";

const state = {
    dunno: null,
    
}

const getters = {
    dunno(state) {
        return state.dunno
    },
    
}

const actions = { // If the file-name includes "mentorvisit" it is sent here
// Must pivot to grouped months, then count each unique occurance of member id
async receiveFile({
    rootState,
    dispatch
}, payload) {
    
    console.log('TCL: ---------------------');
    console.log('TCL: payload', payload);
    console.log('TCL: ---------------------');



    payload.forEach(async function(file) {
        /**
         * People are used to uploading images straight from their camera. This gives high resolution and extremely heavy (several megabyte) files. Depending on the usage, you may want to resize such images. A super easy trick is to simply have a small canvas (800×600 for example) and to draw the image tag into this canvas. Of course, you’ll have to update the canvas dimensions to keep the ratio of the image.
             */
        var reader = new FileReader()
        reader.onload = processFile(file);
        
        async function processFile(f){
            
            var img = document.createElement("img");
            img.src = await window.URL.createObjectURL(file); // This might not be necessary 
            var MAX_WIDTH = 800 * 0.8;
            var MAX_HEIGHT = 600 * 0.8;
            var width = img.width;
            var height = img.height;
            
            if (width > height) {
                if (width > MAX_WIDTH) {
                    height *= MAX_WIDTH / width;
                    width = MAX_WIDTH;
                }
            } else {
            if (height > MAX_HEIGHT) {
                width *= MAX_HEIGHT / height;
                height = MAX_HEIGHT;
                }
            }
    
            var canvas = document.createElement('canvas')
            canvas.width = width;
            canvas.height = height;
            var ctx = canvas.getContext("2d"); // Once you have the image preview in an <img> element, you can draw this image in a <canvas> element to pre-process the file.
            ctx.drawImage(img, 0, 0, width, height);
            var blob = canvasToBlob(canvas, "image/jpeg")
            
    
            try {
                var attachment = blob
                var result = await db.put({
                  _id: file.name,
                  _attachments: {
                    [file.name + ".jpeg"]: {
                      type: "image/jpeg",
                      data: blob
                    }
                  }
                });
                console.log('TCL: -------------------');
                console.log('TCL: result', result);
                console.log('TCL: -------------------');
                
            } catch (err) {
                console.log(err);
            }
        }


        // window.URL.revokeObjectURL(img.src)
        })
    }
}

export default {
    state,
    getters,
    actions
}