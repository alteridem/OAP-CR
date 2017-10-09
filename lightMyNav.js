$(document).ready(function() {

var $navLinks = $('.light-my-nav dd a');
var $subpages = $($(".subpage-item").get().reverse());

var subpageIdTonavLink = {};
$subpages.each(function() {
	var id = $(this).attr('id');
	subpageIdTonavLink[id] = $('.light-my-nav dd a[href=#' + id + ']');
});
	
// throttle function, enforces a minimum time interval; credit to David @ github
function throttle(fn, interval) {
    var lastCall, timeoutId;
    return function () {
        var now = new Date().getTime();
        if (lastCall && now < (lastCall + interval) ) {
            // if we are inside the interval we wait
            clearTimeout(timeoutId);
            timeoutId = setTimeout(function () {
                lastCall = now;
                fn.call();
            }, interval - (now - lastCall) );
        } else {
            // otherwise, we directly call the function 
            lastCall = now;
            fn.call();
        }
    };
}

function highlightNav() {
	var windowPos = $(window).scrollTop();

	$subpages.each(function() {
		var currSubpage = $(this);
		var subpageTop = currSubpage.offset().top;
		var subpageHeight = currSubpage.height();
		var id = currSubpage.attr('id');
		var $navLink = subpageIdTonavLink[id];

		if (windowPos + 150 >= subpageTop && windowPos < (subpageTop + subpageHeight)) {
			$navLinks.parent().removeClass('active');
			$navLink.parent().addClass('active');
		return false;
		} else {
			$navLink.parent().removeClass('active');	
		}
	});
}

$(window).scroll( throttle(highlightNav, 100) );
	
});
