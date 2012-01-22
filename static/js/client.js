$(document).ready(function(){
    var howToTimer = 0;
    var hideHowTo = function(){
        $("div.howto").hide();
        clearTimeout(howToTimer);
        howToTimer = setTimeout(showHowTo, 5000);
    }
    hideHowTo();
    var showHowTo = function(){
        $("div.howto").fadeIn("normal");
    };

    $("div.aloha").click(function(){
        if($(this).is(".flip")){
            $("div.aloha").removeClass("flip");
            hideHowTo();
        }else{
            $("div.aloha").addClass("flip");
            hideHowTo();
        }

    });


    $("input#submit").click(function(){
        var postdata = {"toname":$("#toname").val(),
                        "toaddress":$("#toaddress").val(),
                        "fromname":$("#fromname").val(),
                        "fromaddress":$("#fromaddress").val(),
                        "message":$("#message").val()
                       };
        $.post("/send", postdata, function(data){
            if(data.status == "ok"){
                $("#form").html("<div class='status'>Postcard Sent!</div>");
            }else{
                $("#status").html("Something went wrong, try again");
            }
        }, "json");
    });



});