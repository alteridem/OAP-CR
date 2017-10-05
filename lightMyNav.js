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
	// var scrollPos = $(window).scrollTop();
	var windowPos = $(window).scrollTop();
	var windowHeight = $(window).height();
	var docHeight = $(document).height();


	$subpages.each(function() {
		var currSubpage = $(this);
		var subpageTop = currSubpage.offset().top;
		var subpageHeight = currSubpage.height();

		if (windowPos + 150 >= subpageTop && windowPos < (subpageTop + subpageHeight)) {
			var id = currSubpage.attr('id');

			var $navLink = subpageIdTonavLink[id];

			if (!$navLink.hasClass('active')) {
				$navLinks.removeClass('active');
				$navLink.addClass('active');
			}

		if (windowPos + windowHeight + 150 == docHeight) {
			if (!$('#light-my-nav dd:last-child a').hasClass('active')) {
				var navActiveCurrent = $('.active').attr("href");
				$("a[href'" + navActiveCurrent + "']").removeClass('.active');
				$('#light-my-nav dd:last-child a').addClass('.active');
			}
		}

		return false;
		}
	});
}

$(window).scroll(highlightNav);
	
});
