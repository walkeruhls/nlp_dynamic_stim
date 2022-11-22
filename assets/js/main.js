$("#reject").hide()
$("#instructions1").hide()
$("#instructions2").hide()
$("#video-section").hide()
$("#sorting-body").hide()


var subj_id = null;

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
    var url = new URL(window.location.href);
    url.searchParams.append('id', subj_id);
    $("#instructions2").hide()
    $("#video-section").show()
});

//var whereYouAt = myPlayer.currentTime();
//console.log(whereYouAt)

$("#pause_notice").hide()

var descriptors = []
var current_descript = []

var emotions = traits = mental_states = identity = null

function add_descript() {

    var input = $('#descript_input').val()

    current_descript.push(input)

    $('#desc_sorter').append('<div class="justify-content-center"><li class="list-group-item" id=' + input + '_main> ' + input + '<button class="item_delete" type="button" id="' + input + '">✖</button></li></div>')

    attach_listeners()
    console.log(current_descript)

}

function submit_descriptors() {
    descriptors.push.apply(descriptors, current_descript)
    console.log(descriptors)
    $("#desc_sorter").empty()
    current_descript = []
}

function attach_listeners() {
    $(".item_delete").click(function () {
        console.log('delete')
        current_descript.splice(current_descript.indexOf(item_id), 1)
        var item_id = $(this).attr("id");
        $("#" + item_id + "_main").remove()
        console.log(current_descript)
    })
    $("#descript_submit").click(function () {
        submit_descriptors()
    })
}

$("#main_video").on("pause", function () {
    $("#descript_submit").removeAttr('disabled')
    $("#descript_add").removeAttr('disabled')
    $("#descript_input").removeAttr('disabled')
    $("#pause_notice").hide()
});

$("#main_video").on("play", function () {
    $("#descript_submit").attr('disabled', 'disabled')
    $("#descript_add").attr('disabled', 'disabled');
    $("#descript_input").attr('disabled', 'disabled');
    $("#pause_notice").show()
})

var myPlayer = videojs('main_video');
myPlayer.controlBar.progressControl.disable();

myPlayer.on('ended', function () {
    this.dispose();
    $("#experiment-body").hide()
    $('#sorting-body').show()
    for (let descript of descriptors) {
        $('#mental_state_sorter').append('<li class="list-group-item" id=' + descript + '_main> ' + descript + '<button class="item_delete" type="button" id="' + descript + '">✖</button></li>')
    }

    emotions = Sortable.create(emotion_sorter, {
        animation: 100,
        group: 'shared',
        draggable: '.list-group-item'
    });

    traits = Sortable.create(trait_sorter, {
        animation: 100,
        group: 'shared',
        draggable: '.list-group-item'
    });

    mental_states = Sortable.create(mental_state_sorter, {
        animation: 100,
        group: 'shared',
        draggable: '.list-group-item'
    });

    identity = Sortable.create(identity_sorter, {
        animation: 100,
        group: 'shared',
        draggable: '.list-group-item'
    });
});