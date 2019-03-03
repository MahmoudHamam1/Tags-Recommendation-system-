colors=['success','primary','info','warning','dark','light','secondary','primary']
test = ['C#','php','html','javascript','linux','.net','ajax','jquery']
count=0

$(function () {
    $('.textarea').wysihtml5({
        toolbar: { fa: true }
    })
    
    $('.recommended .btn').on('click',function(e){
        add_event($(this))
      
    })

    $('.selected .btn').on('click',function(e){
        remove_event($(this))
    })

    $('.recommend_btn').on('click',function(){
        get_recommended()
    })

    $('.perview_btn').on('click',function(){
        publish_perview()
    })

    $('.publish_btn').on('click',function(){
        publish_post()
    })

    $('.Back_btn').on('click',function(){
        $('.stack_overflow_preview').fadeOut(100)
        $('.form_preview').fadeIn(100)
        $('.upload_file').fadeOut(100)
    })

    $(".upload_link").on('click',function(){
        $('.stack_overflow_preview').fadeOut(100)
        $('.form_preview').fadeOut(100)
        $('.upload_file').fadeIn(100)
    })

    $("#upload_voice").on('submit',function (e) {
        e.preventDefault();
        voiceToTxt()
      })

    $("#upload_img").on('submit',function (e) {
        e.preventDefault();
        imgToTxt()

 
    })

    $("#imgInp").change(function() {
        readimg(this);
      });

      $("#voiceInp").change(function() {
        readvoice(this);
      });
})

function readimg(input) {

  if (input.files && input.files[0]) {
    var reader = new FileReader();

    reader.onload = function(e) {
      $('#myImage').html('')
      $('#myImage').append('<img src="'+e.target.result+'" style="width:100%;height:100%" class=" img-thumbnail"  >');
    }

    reader.readAsDataURL(input.files[0]);
  }
}

function readvoice(input) {
    
    if (input.files && input.files[0]) {
      var reader = new FileReader();
  
      reader.onload = function(e) {
        $('#myVoice').html("")
        $('#myVoice').append(' <audio controls id="myVoice" style="margin-top:20px"><source src="'+e.target.result+'" ></audio>');
      }
      reader.readAsDataURL(input.files[0]);
      $('#myVoice').load()
    }
  }


function add_selected(txt){
    $('.selected .row').append('<span style="margin:5px" onclick="remove_event(this);" class=" btn btn-'+colors[count%8]+'">'+txt+'</span>');
    count++;    
}

function remove_selected(txt){
    $('.recommended .row').append('<span style="margin:5px" onclick="add_event(this);" class=" btn btn-'+colors[count%8]+'">'+txt+'</span>');
    count++;
}

function add_event(e){
    if($('.selected .row .btn').length < 5){
        txt=$(e).text()
        $(e).remove()
        add_selected(txt)
    }else{
        $('.card-outline').prepend('<div class="alert alert-danger alert-dismissible"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><h5><i class="icon fa fa-ban"></i> Alert!</h5>you mustn\'t select more than 5 tags</div>');
    }
}

function remove_event(e){
    txt=$(e).text()
    $(e).remove()
    remove_selected(txt)
}

function get_recommended(){
    if( $('.textarea').val().length > 0 && $('.title').val().length > 0){
        $('.recommended .row').html("")
        $('.selected .row').html("")
        title=$('.title').val()
        body=$('.textarea').val()

        console.log("Title: " + title)
        console.log("Body: " + body)
        
        // $.each(test, function (i, v) { 
        //     $('.recommended .row').append('<span style="margin:5px" onclick="add_event(this);" class="col-md-2 btn btn-'+colors[count%8]+'">'+v+'</span>');
        //     count++;
        // });
        
        $.ajax({
            type: "get",
            url: "http://127.0.0.1:9090/api/tags",
            data: {'title':title,'body':body},
            success: function (response) {

                $.each(response['tags'], function (i, v) { 
                    $('.recommended .row').append('<span style="margin:5px" onclick="add_event(this);" class=" btn btn-'+colors[count%8]+'">'+v+'</span>');
                    count++;
                });
        
            }
        });
    }else{
        $('.card-outline').prepend('<div class="alert alert-danger alert-dismissible"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><h5><i class="icon fa fa-ban"></i> Alert!</h5>you must write a Title and Question(Body) </div>');

    }


    

}

function publish_perview(){
    if( $('.textarea').val().length > 0 && $('.title').val().length > 0){

        if($('.selected .row .btn').length > 0){

            $('.stack_overflow_preview').fadeIn(100)
            $('.form_preview').fadeOut(100)
            $('.upload_file').fadeOut(100)

            title=$('.title').val()
            body=$('.textarea').val()

            $('.stack_overflow_preview .card-title').html(title)
            $('.stack_overflow_preview .card-body .body').html(body)
            $('.stack_overflow_preview .card-body .tags').html("")

            $.each($('.selected .row .btn'), function (i, v) { 
                badg='<span style="font-size: 12px;padding:8px 13px;margin:5px;color:#39739d;background-color: #E1ECF4;border-color: #E1ECF4;" class="badge">'+$(v).html()+'</span>'
                console.log(badg)
                $('.stack_overflow_preview .card-body .tags').append(badg)
            });  

        }else{
            $('.card-outline').prepend('<div class="alert alert-danger alert-dismissible"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><h5><i class="icon fa fa-ban"></i> Alert!</h5>you must select at least 1 tag</div>');
        }
    }else{
        $('.card-outline').prepend('<div class="alert alert-danger alert-dismissible"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><h5><i class="icon fa fa-ban"></i> Alert!</h5>you must write a Title and Question(Body) </div>');
    }
}

function  publish_post(){
    if( $('.textarea').val().length > 0 && $('.title').val().length > 0){
        if($('.selected .row .btn').length > 0){
            alert("publish")
        }else{
            $('.card-outline').prepend('<div class="alert alert-danger alert-dismissible"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><h5><i class="icon fa fa-ban"></i> Alert!</h5>you must select at least 1 tag</div>');
        }
    }
    else{
        $('.card-outline').prepend('<div class="alert alert-danger alert-dismissible"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><h5><i class="icon fa fa-ban"></i> Alert!</h5>you must write a Title and Question(Body) </div>');
    }
}


function voiceToTxt(){
    var form_data = new FormData($('#upload_voice')[0]);
        $.ajax({
            type: 'post',
            url: 'http://127.0.0.1:9090/api/voice',
            data: form_data,
            contentType: false,
            cache: false,
            processData: false,
            success: function(data) {
                //$('.textarea').data("wysihtml5").editor.setValue(Text)
                var Text=data["Text"]
                console.log(Text);
                $('.textarea', $('.wysihtml5-sandbox').contents()).removeClass('placeholder')
                $('.textarea', $('.wysihtml5-sandbox').contents()).empty()
                $('.textarea', $('.wysihtml5-sandbox').contents()).append(Text)
                $('.stack_overflow_preview').fadeOut(100)
                $('.form_preview').fadeIn(100)
                $('.upload_file').fadeOut(100)
            },
        });
}

function imgToTxt(){
    var form_data = new FormData($('#upload_img')[0]);
        $.ajax({
            type: 'post',
            url: 'http://127.0.0.1:9090/api/img',
            data: form_data,
            contentType: false,
            cache: false,
            processData: false,
            success: function(data) {
                //$('.textarea').data("wysihtml5").editor.setValue(Text)
                var Text=data["Text"]
                console.log(Text);
                $('.textarea', $('.wysihtml5-sandbox').contents()).removeClass('placeholder')
                $('.textarea', $('.wysihtml5-sandbox').contents()).empty()
                $('.textarea', $('.wysihtml5-sandbox').contents()).append(Text)
                $('.stack_overflow_preview').fadeOut(100)
                $('.form_preview').fadeIn(100)
                $('.upload_file').fadeOut(100)
            },
        });
}
