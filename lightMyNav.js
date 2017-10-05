$(document).ready(function() {

var $navLinks = $('#light-my-nav dd a');
var $subpages = $($(".subpage-item").get().reverse());

var subpageIdTonavLink = {};
$subpages.each(function() {
	var id = $(this).attr('id');
	console.log(id);
	subpageIdTonavLink[id] = $('#light-my-nav dd a[href=#' + id + ']');
});

function highlightNav() {
	var scrollPos = $(window).scrollTop();

	$subpages.each(function() {
		var currSubpage = $(this);
		var subpageTop = currSubpage.offset().top;

		if (scrollPos >= subpageTop) {
			console.log("Ya made it!");
			var id = currSubpage.attr('id');

			var $navLink = subpageIdTonavLink[id];

			if (!$navLink.hasClass('active')) {
				$navLinks.removeClass('active');
				$navLink.addClass('active');
			}
		return false;
		}
	});
}

$(window).scroll(highlightNav);
	
});
