//The code that is fired upon page load
//to check your plugin js is working uncomment the next line.
$(document).ready(function(){
    $("#expand").click(function(){
        $("#overlay").animate({width: "300px"});
    });
    $("#collapse").click(function(){
        $("#overlay").animate({width: "100px"});
    });
	
	$( "#toggle" ).click(function() {
		$( "#overlay" ).slideToggle( "slow" );
	});

	$(function() {
		$( "#overlay" ).resizable();
	});
});



