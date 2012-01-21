$(document).ready(function(){

    $("div.aloha").click(function(){
        if($(this).is(".flip")){
            $("div.aloha").removeClass("flip");
        }else{
            $("div.aloha").addClass("flip");
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
                //$("#form").html("Sent");
            }else{
                $("#status").html("Something went wrong, try again");
            }
        }, "json");
    });



});