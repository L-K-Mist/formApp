import db from '@/api/pouchDB'

const state = {
    imageIndex: []
}

const actions = {
    processImageIndex({
        rootState,
        state,
        dispatch
    }, items) {
        //var imageIndex = [];
        console.log('​items', items);

        for (var i = 0; i < items.length; i++) {
            // TODO also this moves to vuex
            // webkitGetAsEntry is where the magic happens
            var item = items[i].webkitGetAsEntry();
            if (item) {
                traverseFileTree(item);
            }
        }
        console.log('​imageIndex', state.imageIndex);

        function traverseFileTree(item, path) {
            // TODO for propagation issue: think I need to move this to vuex
            // A freaky self-referencing function. TODO Go through this carefully to clearly understand what's going on.

            // from main answer https://stackoverflow.com/questions/3590058/does-html5-allow-drag-drop-upload-of-folders-or-a-folder-tree
            path = path || "";
            if (item.isFile) {
                // Get file
                item.file(function (file) {
                    if (file.name.includes(".hash")) {
                        return false;
                    } else {
                        console.log("File:", path + file.name);
                        //let elecPath = file.path;
                        // console.log("​traverseFileTree -> elecPath", elecPath);
                        // that.src = "file:" + elecPath; // TODO refactor to string interpolation
                        state.imageIndex.push(file.path);
                    }
                });
            } else if (item.isDirectory) {
                // Get folder contents
                var dirReader = item.createReader();
                dirReader.readEntries(function (entries) {
                    for (var i = 0; i < entries.length; i++) {
                        traverseFileTree(entries[i], path + item.name + "/");
                    }
                });
            }
        }

        // db.put({
        //     _id: rootState.SeedlingSales.reportMonth + "MentorPhotos",
        //     fsImages: imageIndex
        // }).then(response => {
        //     console.log("dbResp", response)
        //     dispatch("connectImagesToVisits")
        // }).catch(function (err) {
        //     console.log(err);
        // })


        // state.imageIndex = imageIndex
        // const img = state.imageIndex
        // console.log('​img', img);

        // var imageIndexForDB = {
        //     _id: rootState.SeedlingSales.reportMonth + "MentorPhotos",
        //     fsImages: state.imageIndex
        // }


    },
    connectImagesToVisits({
        rootState,
        state,
        dispatch
    }) {
        var mentorVisits;
        var mentorPhotos;
        db.get(rootState.SeedlingSales.reportMonth + "MentorVisits")
            .then(function (doc) {
                console.log("fetching from db", doc);
                mentorVisits = doc
            })

        db.get(rootState.SeedlingSales.reportMonth + "MentorPhotos")
            .then(function (doc) {
                console.log("fetching from db", doc);
                mentorPhotos = doc
            })

    }
}

export default {
    state,
    // getters,
    actions
}