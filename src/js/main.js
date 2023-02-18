import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { getAuth, signInAnonymously } from "firebase/auth";
import videojs from 'video.js';
import '../scss/styles.scss'
import '../css/style.css'
import * as bootstrap from 'bootstrap'
import Sortable from 'sortablejs';
import 'video.js/dist/video-js.css';
import * as $ from 'jquery'



const firebaseConfig = {

  apiKey: "AIzaSyBAnN60-yIbaJjKoQg1nDFebm2fGgGncgA",

  authDomain: "nlp-dynamic-impressions.firebaseapp.com",

  projectId: "nlp-dynamic-impressions",

  storageBucket: "nlp-dynamic-impressions.appspot.com",

  messagingSenderId: "914057375130",

  appId: "1:914057375130:web:6d8b8a8abd36f4c8fd1e23",

  measurementId: "G-YF915CTCP4"

};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);

signInAnonymously(auth)
  .then(() => {
    // Signed in..
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    // ...
  });

$("#reject").hide()
$("#instructions1").hide()
$("#instructions2").hide()
$("#video-section").hide()
$("#sorting-body").hide()
$("#finished").hide()


var subj_id = null
var videos = ["sample_audition_tape.mp4","yale_school_drama.mp4","usc_comedic_monologue.mp4"]
var current_vid = 0

$("#screen_submit").on("click", function() {
    if ($("#english_check_input").val() == "No") {
        $("#reject").show()
        $("#screener").hide()
    }

    else {
        subj_id = {
            "subj_id":$("#prolific_id").val()
        }
        $("#screener").hide()
        $("#instructions1").show()
        $("#welcome").hide()
        try {
            setDoc(doc(db, "studies/study1/participants", subj_id["subj_id"]), {
              "subj_id":subj_id["subj_id"]
            });
            console.log("Document written with ID: " + subj_id["subj_id"]);
          } catch (e) {
            console.error("Error adding document: ", e);
          }
    }
})

$("#next_instruct").on("click", function () {
    $("#instructions1").hide()
    $("#instructions2").show()
})

$("#start_task").on("click", function () {
    var url = new URL(window.location.href)
    url.searchParams.append('id', subj_id)
    $("#instructions2").hide()
    $("#video-section").show()
    $("#video_source").attr('src','assets/video/' + videos[current_vid])
})

//var whereYouAt = mainVideo.currentTime()
//console.log(whereYouAt)

$("#pause_notice").hide()
$("#too_early_notice").hide()
$("#cannot_unpause_notice").hide()
$("#cannot_add_notice").hide()

var descriptors = []
var current_terms = []

var emotions = null, traits = null, mental_states = null, identity = null

var recentTime = -2

$("#add_descript_form").on( "submit", function(event) {
    event.preventDefault();
    var input = $('#descript_input').val()

    if (current_terms.includes(input)) {
        $("#cannot_add_notice").show()
    }
    else {
        current_terms.push(input)

        $('#desc_sorter').append('<div class="justify-content-center"><li class="list-group-item" id=' + input + '> ' + input + '<button class="item_delete" type="button" id="' + input + '_delete">✖</button></li></div>')

        attach_delete_listener(input)
        console.log(current_terms)
        $("#descript_submit").removeAttr('disabled')
        $("#cannot_add_notice").hide()
        $('#descript_input').val("")
    }

})

$("#descript_submit").on("click", function () {
    recentTime = mainVideo.currentTime()
    let current_descriptors = []
    for (const i in current_terms) {
        let descriptor = {
            "name":current_terms[i],
            "timestamp":mainVideo.currentTime(),
            "category":""
        }
        current_descriptors.push(descriptor)
    }
    descriptors.push.apply(descriptors, current_descriptors)
    console.log(descriptors)

    $("#desc_sorter").empty()

    current_terms = []
    current_descriptors = []

    mainVideo.controlBar.playToggle.enable()
    mainVideo.options({
        userActions: {
            click: true
        }
    })

    $("#cannot_unpause_notice").hide()

    mainVideo.play()
})

function attach_delete_listener(input) {
    $("#" + input + "_delete").on("click", function() {
        console.log('delete')
        let item_id = $(this).attr("id").replace('_delete','')
        current_terms.splice(current_terms.indexOf(item_id), 1)
        $("#" + item_id).remove()
        console.log(current_terms)
        if (current_terms.length == 0) {
            $("#descript_submit").attr('disabled','disabled')
        }
    })
}


$("#main_video").on("pause", function () {
    if (mainVideo.currentTime() - recentTime <= 2) {
        mainVideo.play()
        $("#too_early_notice").show()
    }
    else {
        $("#descript_add").removeAttr('disabled')
        $("#descript_input").removeAttr('disabled')
        $("#pause_notice").hide()
        $("#too_early_notice").hide()
        $("#cannot_unpause_notice").show()
        mainVideo.controlBar.playToggle.disable()
        mainVideo.options({
            userActions: {
                click: false
            }
        })
    }
})

$("#main_video").on("play", function () {
    $("#descript_submit").attr('disabled', 'disabled')
    $("#descript_add").attr('disabled', 'disabled')
    $("#descript_input").attr('disabled', 'disabled')
    $("#pause_notice").show()
})

var mainVideo = videojs('main_video')
mainVideo.controlBar.progressControl.disable()

mainVideo.on('ended', function () {
    $("#experiment-body").hide()
    $('#sorting-body').show()

    for (const descriptor of descriptors) {
        $('#mental_state_sorter').append('<li class="list-group-item" id=' + descriptor.name + '> ' + descriptor.name + '<button class="item_delete" type="button" id="' + descriptor.name + '_delete">✖</button></li>')
    }

    emotions = Sortable.create(emotion_sorter, {
        animation: 100,
        group: 'shared',
        draggable: '.list-group-item',
        dataIdAttr: 'id'
    })

    traits = Sortable.create(trait_sorter, {
        animation: 100,
        group: 'shared',
        draggable: '.list-group-item',
        dataIdAttr: 'id'
    })

    mental_states = Sortable.create(mental_state_sorter, {
        animation: 100,
        group: 'shared',
        draggable: '.list-group-item',
        dataIdAttr: 'id'
    })

    identity = Sortable.create(identity_sorter, {
        animation: 100,
        group: 'shared',
        draggable: '.list-group-item',
        dataIdAttr: 'id'
    })
})

function categorizeDescriptors(category, categoryName) {
    category = category.toArray()
    for (const i in descriptors) {
        if (category.includes(descriptors[i].name)){
            descriptors[i].category = categoryName
        }
    }
}

$("#sorting_submit").on("click", function () {

    categorizeDescriptors(emotions, "emotion")
    categorizeDescriptors(traits, "trait")
    categorizeDescriptors(mental_states, "mental_state")
    categorizeDescriptors(identity, "identity")

    let submission = {
        ...subj_id,
        "data":{
            "descriptors":descriptors
        },
        "video":videos[current_vid]
    }
    try {
        const docRef = setDoc(doc(db, "studies/study1/participants/" + submission["subj_id"] + "/video_responses", submission["video"]), submission["data"]);
        console.log("Document written with ID: ", docRef.id);
      } catch (e) {
        console.error("Error adding document: ", e);
    }
    
    console.log(descriptors)
    current_vid++
    
    if (current_vid < videos.length) {

        descriptors = []
        current_terms = []
        emotions = traits = mental_states = identity = null

        recentTime = -2
        mainVideo.src({ type: 'video/mp4', src: 'assets/video/' + videos[current_vid] })
        mainVideo = videojs('main_video')
        mainVideo.controlBar.progressControl.disable()
        mainVideo.controlBar.playToggle.enable()
        mainVideo.options({
            userActions: {
                click: true
            }
        })

        $("#pause_notice").hide()
        $("#too_early_notice").hide()
        $("#cannot_unpause_notice").hide()
        $("#cannot_add_notice").hide()
        $('#sorting-body').hide()
        $("#experiment-body").show()
        $("#mental_state_sorter").empty()
        $("#emotion_sorter").empty()
        $("trait_sorter").empty()
        $("identity_sorter").empty()
    }
    
    else {
        $("#instructions2").hide()
        $("#video-section").hide()
        $("#finished").show()
    }
})