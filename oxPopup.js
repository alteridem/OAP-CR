var closeOnce = 0;

$(window).scroll(function(){
	if (closeOnce < 1) {
		if($(document).scrollTop()>=$(document).height()/9) {
		$(".oxpopup").show("slow"); 
	} else {
		$(".oxpopup").hide("slow");
	}
	}
});

function closeOxPopup(){
	$(".oxpopup").hide("slow");
	closeOnce++; 
}
