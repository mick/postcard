$(document).ready(function(){

    $("div.aloha").click(function(){
        if($(this).is(".flip")){
            $("div.aloha").removeClass("flip");
        }else{
            $("div.aloha").addClass("flip");
        }

    });


    $(window).resize(function(){
        // change the position of the card / flip buttons..
    });


});