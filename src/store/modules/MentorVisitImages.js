import db from '@/api/pouchDB'

const state = {
    imageIndex: []
}

const actions = {
    processImageIndex({
        rootState,
        state,
        dispatch
    }, imageIndex) {
        state.imageIndex = imageIndex

        db.put({
            _id: rootState.SeedlingSales.reportMonth + "MentorPhotos",
            fsImages: imageIndex
        }).then(response => {
            console.log("dbResp", response)
            // dispatch("connectImagesToVisits")
        }).catch(function (err) {
            console.log(err);
        })
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

//     countItems(items);
//     //var imageIndex = [];
//     function toArray(list) {
//         return Array.prototype.slice.call(list || [], 0);
//     }

//     function countItems(items) {
//         //elItems.innerHTML = '';
//         for (var i = 0, l = items.length; i < l; i++) {
//             var item = items[i];
//             countItem(item);
//         }
//     }

//     function renderItem(name, num) {
//         // var elItem = document.createElement('li');
//         var text = name + ' (' + num + ' file(s))';
//         console.log('​renderItem -> text', text);

//         // elItem.appendChild(document.createTextNode(text));
//         // elItems.appendChild(elItem);
//     }

//     function countItem(item) {
//         var entry = item.getAsEntry || item.webkitGetAsEntry();
//         if (entry.isDirectory) {
//             var dirReader = entry.createReader();
//             var num = 0;
//             readEntries();
//             var readEntries = function () {
//                 dirReader.readEntries(function (results) {
//                     if (!results.length) {
//                         renderItem(entry.name, num);
//                     } else {
//                         num = num + results.length;
//                         readEntries();
//                     }
//                 });
//             };
//         } else {
//             renderItem(entry.name, 1); // Dee thinks this is for the case where there is just one file in the directory
//         }
//     }

//     console.log('​imageIndex', imageIndex);

// processImageIndex({
//     rootState,
//     state,
//     dispatch
// }, items) {
//     //var imageIndex = [];
//     console.log('​items', items);

//     for (var i = 0; i < items.length; i++) {
//         // TODO also this moves to vuex
//         // webkitGetAsEntry is where the magic happens
//         var item = items[i].webkitGetAsEntry();
//         if (item) {
//             traverseFileTree(item);
//         }
//     }
//     console.log('​imageIndex', state.imageIndex);

//     function traverseFileTree(item, path) {
//         // TODO to overcome the limit of 100 files at a time do something like http://jsfiddle.net/02pzex52/8/
//         // A freaky self-referencing function. TODO Go through this carefully to clearly understand what's going on.

//         // from main answer https://stackoverflow.com/questions/3590058/does-html5-allow-drag-drop-upload-of-folders-or-a-folder-tree
//         path = path || "";
//         if (item.isFile) {
//             // Get file
//             item.file(function (file) {
//                 if (file.name.includes(".hash")) {
//                     return false;
//                 } else {
//                     console.log("File:", path + file.name);
//                     //let elecPath = file.path;
//                     // console.log("​traverseFileTree -> elecPath", elecPath);
//                     // that.src = "file:" + elecPath; // TODO refactor to string interpolation
//                     state.imageIndex.push(file.path);
//                 }
//             });
//         } else if (item.isDirectory) {
//             // Get folder contents
//             var dirReader = item.createReader();
//             dirReader.readEntries(function (entries) {
//                 for (var i = 0; i < entries.length; i++) {
//                     traverseFileTree(entries[i], path + item.name + "/");
//                 }
//             });
//         }
//     }



//     // state.imageIndex = imageIndex
//     // const img = state.imageIndex
//     // console.log('​img', img);

//     // var imageIndexForDB = {
//     //     _id: rootState.SeedlingSales.reportMonth + "MentorPhotos",
//     //     fsImages: state.imageIndex
//     // }


// },