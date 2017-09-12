$(function() {

	// Custom JS
    $('a.add-social').magnificPopup();

    //active-link-term
    var $linkTerm = $('ul.term a');
    $linkTerm.click(function () {
       $linkTerm.removeClass('js-active-link-term');
       $(this).addClass('js-active-link-term');
    });

    //active-item-menu
    var $itemMenu = $('.menu .item a');
    $itemMenu.click(function () {
        $('.menu .item').removeClass('js-active-menu-item');
       $(this).parent('.item').addClass('js-active-menu-item');
    });

    //active-item-menu-bottom
    var $linkMenuBottom = $('.menu-bottom a');
    $linkMenuBottom.click(function () {
        $linkMenuBottom.removeClass('js-active-link-menu-bottom');
        $(this).addClass('js-active-link-menu-bottom');
    });

});
