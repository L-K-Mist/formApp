<template>
<div>
  <div>
            <div style="text-align:center;">
                <input type="text" placeholder="Please select a file" id="actual-file" disabled="disabled"/>
                <input type="button" value="Choose a file" id="select-file"/>
            </div>
            <br><br>
            <textarea id="content-editor" rows="5"></textarea><br><br>
            <input type="button" id="save-changes" value="Save changes"/>
            <input type="button" id="delete-file" value="Delete file"/>
        </div>
        <hr>
        <div style="text-align:center;">
            <p>
                The file content will be the same as the editor.
            </p>
            <input type="button" value="Choose a file" id="create-new-file"/>
        </div>

</div>
</template>

<script>
import { remote } from "electron";
import { fs } from "electron";
//var dialog = remote.require("dialog");
const { dialog } = require("electron").remote;

console.log(remote.window);

export default {
  created() {
    //remote.getCurrentWindow().setFullScreen(true);
    dialog.showOpenDialog(
      {
        title: "Upload Attachments",
        buttonLabel: "Upload",
        filters: [
          { name: "Images", extensions: ["jpg", "png", "gif"] },
          { name: "All Files", extensions: ["*"] }
        ],
        properties: ["openFile", "multiSelections"]
      },
      function(filenames) {
        if (filenames) {
          let d = "";
          filenames.forEach(function(element) {
            d = element;
          });
          // here i get a path of file correctly something like /path/to/file.jpg

          reqApi.uploadattachmnets({ photo: fs.createReadStream(d) }).then(
            response => {
              console.log(response);
            },
            error => {
              console.log(error);
            }
          );
          //  })
        }
      }
    );
  }
};
</script>
