$(document).ready(function() {

var $navLinks = $('#light-my-nav dd a');
var $subpages = $($(".subpage-item").get().reverse());

var subpageIdTonavLink = {};
$subpages.each(function() {
	var id = $(this).attr('id');
	subpageIdTonavLink[id] = $('#light-my-nav dd a[href=#' + id + ']');
});

function highlightNav() {
	// var scrollPos = $(window).scrollTop();
	var windowPos = $(window).scrollTop();

	$subpages.each(function() {
		var currSubpage = $(this);
		var subpageTop = currSubpage.offset().top;
		var subpageHeight = currSubpage.height();

		if (windowPos + 150 >= subpageTop && windowPos < (subpageTop + subpageHeight)) {
			var id = currSubpage.attr('id');

			var $navLink = subpageIdTonavLink[id];

			if (!$navLink.parent().hasClass('active')) {
				$navLinks.parent().removeClass('active');
				$navLink.parent().addClass('active');
			}

		return false;
		}
	});
}

$(window).scroll(highlightNav);
	
});
