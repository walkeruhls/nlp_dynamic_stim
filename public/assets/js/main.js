$("#reject").hide()
$("#instructions1").hide()
$("#instructions2").hide()
$("#video-section").hide()
$("#sorting-body").hide()


var subj_id = null
var videos = ["sample_audition_tape.mp4","yale_school_drama.mp4"]
var current_vid = 0

function submit_screener() {
    if ($("#english_check_input").val() == "No") {
        $("#reject").show()
        $("#screener").hide()
    }

    else {
        subj_id = $("#prolific_id").val()
        $("#screener").hide()
        $("#instructions1").show()
        $("#welcome").hide()
    }
}

$("#next_instruct").click(function () {
    $("#instructions1").hide()
    $("#instructions2").show()
})

$("#start_task").click(function () {
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
var current_descript = []

var emotions = traits = mental_states = identity = null

var recentTime = -2

function add_descript() {

    var input = $('#descript_input').val()

    if (current_descript.includes(input)) {
        $("#cannot_add_notice").show()
    }
    else {
        current_descript.push(input)

        $('#desc_sorter').append('<div class="justify-content-center"><li class="list-group-item" id=' + input + '_main> ' + input + '<button class="item_delete" type="button" id="' + input + '">✖</button></li></div>')

        attach_delete_listener(input)
        console.log(current_descript)
        $("#descript_submit").removeAttr('disabled')
        $("#cannot_add_notice").hide()
        $('#descript_input').val("")
    }

}

$("#descript_submit").click(function () {
    recentTime = mainVideo.currentTime()
    descriptors.push.apply(descriptors, current_descript)
    console.log(descriptors)
    $("#desc_sorter").empty()
    current_descript = []
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
    $("#" + input).click(function() {
        console.log('delete')
        let item_id = $(this).attr("id")
        current_descript.splice(current_descript.indexOf(item_id), 1)
        $("#" + item_id + "_main").remove()
        console.log(current_descript)
        if (current_descript.length == 0) {
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

    for (let descript of descriptors) {
        $('#mental_state_sorter').append('<li class="list-group-item" id=' + descript + '_main> ' + descript + '<button class="item_delete" type="button" id="' + descript + '">✖</button></li>')
    }

    emotions = Sortable.create(emotion_sorter, {
        animation: 100,
        group: 'shared',
        draggable: '.list-group-item'
    })

    traits = Sortable.create(trait_sorter, {
        animation: 100,
        group: 'shared',
        draggable: '.list-group-item'
    })

    mental_states = Sortable.create(mental_state_sorter, {
        animation: 100,
        group: 'shared',
        draggable: '.list-group-item'
    })

    identity = Sortable.create(identity_sorter, {
        animation: 100,
        group: 'shared',
        draggable: '.list-group-item'
    })
})

$("#sorting_submit").click(function () {
    current_vid++
    if (current_vid < videos.length) {
        descriptors = []
        current_descript = []
        emotions = traits = mental_states = identity = null
        recentTime = -2
        mainVideo.src({ type: 'video/mp4', src: 'assets/video/' + videos[current_vid] })
        mainVideo = videojs('main_video')
        mainVideo.controlBar.progressControl.disable()
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
})