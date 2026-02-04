/* eslint-env browser, jquery */
'use strict';

$(function() {
    initHamburgerMenuDropdowns();
    initSearchToggles();
    initDesktopMenuToggle();
    initDesktopDropdownToggle();
    sanitizeNavDropdowns();
    initFooterDropdowns();
    initNavbarScroll();
    initLatestNewsCarousel();
    initConsortiumCarousel();
    initObjectivesAccordion();
    $('nav').removeClass('no-transition');
});

// ---------- Navbar Scroll ----------

function initNavbarScroll() {
    var $navbar = $('#headernavbar');

    if (!$navbar.length) return;

    function handleScroll() {
        var scrollTop = $(window).scrollTop();

        if (scrollTop > 50) {
            $navbar.addClass('navbar-scrolled');
        } else {
            $navbar.removeClass('navbar-scrolled');
        }
    }

    $(window).on('scroll.navbarScroll', handleScroll);
    handleScroll();
}

// ---------- Search ----------

function initSearchToggles() {
    $('#searchToggle, #searchToggleMobile').on('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        showSearchForm();
    });
}

function showSearchForm() {
    $('#search').fadeIn(200);
    $('#search form').addClass('pop-in');
    $('#search input.search_input').val('').focus();
    $('body').addClass('search-open');
    $('body').css('overflow', 'hidden');

    $(document).on('click.searchClose', function(event) {
        var $search = $('#search form');
        var $searchToggle = $('#searchToggle');

        if (!$search.is(event.target) &&
            $search.has(event.target).length === 0 &&
            !$searchToggle.is(event.target) &&
            $searchToggle.has(event.target).length === 0 &&
            !$(event.target).closest('.close-search').length) {
            hideSearchForm();
        }
    });

    $(document).on('keydown.searchEscape', function(e) {
        if (e.key === 'Escape') {
            hideSearchForm();
        }
    });

    $('#search input.search_input').on('keydown.searchSubmit', function(e) {
        if (e.key === 'Enter') {
            $('#search form').submit();
        }
    });
}

function hideSearchForm() {
    $('#search form').removeClass('pop-in');
    $('#search').fadeOut(200);
    $('body').removeClass('search-open');
    $('body').css('overflow', '');
    $(document).off('click.searchClose');
    $(document).off('keydown.searchEscape');
    $('#search input.search_input').off('keydown.searchSubmit');
}

// ---------- Menu ----------

function initDesktopMenuToggle() {
    var $navbarNav = $('#headerNavbarNav');
    var $desktopToggle = $('#desktopMenuToggle');
    var $closeBtn = $('#closeMenuBtn');

    $desktopToggle.on('click.desktopMenu', function(e) {
        e.preventDefault();
        e.stopPropagation();
        $navbarNav.addClass('show');
        $desktopToggle.hide();
        $('body').addClass('menu-open');
    });

    $closeBtn.on('click.desktopMenu', function(e) {
        e.preventDefault();
        e.stopPropagation();
        $navbarNav.removeClass('show');
        $desktopToggle.show();
        $('body').removeClass('menu-open');
    });

    $(document).on('click.desktopMenuOutside', function(event) {
        if (
            $navbarNav.hasClass('show') &&
            !$navbarNav.is(event.target) &&
            $navbarNav.has(event.target).length === 0 &&
            !$desktopToggle.is(event.target) &&
            $desktopToggle.has(event.target).length === 0 &&
            !$closeBtn.is(event.target) &&
            $closeBtn.has(event.target).length === 0
        ) {
            $navbarNav.removeClass('show');
            $desktopToggle.show();
            $('body').removeClass('menu-open');
        }
    });

    $navbarNav.on('click.desktopMenu', function(e) { e.stopPropagation(); });
    $('.navbar-bottom-elements').on('click.desktopMenu', function(e) { e.stopPropagation(); });
}

function initDesktopDropdownToggle() {
    // Only apply click-based dropdown toggle for mobile slide-out menu
    // Desktop menu uses CSS hover states
    $('.navbar-collapse .nav-item.dropdown > a').on('click.desktopDropdown', function(e) {
        e.preventDefault();
        var $dropdownMenu = $(this).siblings('.dropdown-menu');
        if ($dropdownMenu.hasClass('show')) {
            $dropdownMenu.removeClass('show');
            $(this).parent().removeClass('active');
        } else {
            $('.navbar-collapse .dropdown-menu.show').removeClass('show');
            $('.navbar-collapse .nav-item.dropdown').removeClass('active');
            $dropdownMenu.addClass('show');
            $(this).parent().addClass('active');
        }
    });
}

function sanitizeNavDropdowns() {
    // Only sanitize dropdowns in mobile menu and footer, not desktop nav
    $('.navbar-collapse .nav-item, .footer-navigation .nav-item').children('a').each(function() {
        var $link = $(this);
        if ($link.attr('data-toggle') === 'dropdown') {
            $link
                .removeAttr('data-toggle')
                .off('click.navSanitize')
                .on('click.navSanitize', function(e) {
                    e.preventDefault();
                    $(this).siblings('.dropdown-menu').toggleClass('show');
                });
        }
    });
}

function initHamburgerMenuDropdowns() {
    // This function handles the mobile slide-out menu dropdowns only
    var $mobileMenu = $('#headerNavbarNav');

    function autoExpandActiveDropdowns() {
        var activeSubItems = $mobileMenu.find('.dropdown-menu .nav-item.active');
        activeSubItems.each(function() {
            var parentDropdown = $(this).closest('.nav-item.dropdown');
            if (parentDropdown.length) {
                var dropdownMenu = parentDropdown.find('.dropdown-menu');
                parentDropdown.addClass('active');
                if (dropdownMenu.length) {
                    dropdownMenu.addClass('show');
                }
            }
        });
    }

    autoExpandActiveDropdowns();

    // Only bind click handlers for dropdowns inside the mobile slide-out menu
    var dropdownItems = $mobileMenu.find('.nav-item.dropdown > a');
    dropdownItems.each(function() {
        $(this).off('click.dropdown').on('click.dropdown', function(e) {
            e.preventDefault();
            var parentItem = $(this).parent();
            var dropdownMenu = parentItem.find('.dropdown-menu');
            if (dropdownMenu.length) {
                parentItem.toggleClass('active');
                dropdownMenu.toggleClass('show');
                var otherDropdowns = $mobileMenu.find('.nav-item.dropdown');
                otherDropdowns.each(function() {
                    if (this !== parentItem[0]) {
                        $(this).removeClass('active');
                        var otherMenu = $(this).find('.dropdown-menu');
                        if (otherMenu.length) {
                            otherMenu.removeClass('show');
                        }
                    }
                });
            }
        });
    });

    function closeAllDropdowns() {
        var activeDropdowns = $mobileMenu.find('.nav-item.dropdown.active');
        activeDropdowns.each(function() {
            $(this).removeClass('active');
            var menu = $(this).find('.dropdown-menu');
            if (menu.length) {
                menu.removeClass('show');
            }
        });
    }

    function handleMenuToggle() {
        setTimeout(function() {
            autoExpandActiveDropdowns();
        }, 100);
    }

    var closeMenuBtn = $('#closeMenuBtn');
    if (closeMenuBtn.length) {
        closeMenuBtn.off('click.dropdown').on('click.dropdown', closeAllDropdowns);
    }

    var menuToggleBtn = $('#desktopMenuToggle');
    if (menuToggleBtn.length) {
        menuToggleBtn.off('click.dropdown').on('click.dropdown', handleMenuToggle);
    }

    $(document).off('click.dropdownOutside').on('click.dropdownOutside', function(e) {
        var menuToggle = $('#desktopMenuToggle');
        if ($mobileMenu.length && !$mobileMenu.is(e.target) && $mobileMenu.has(e.target).length === 0 &&
            !menuToggle.is(e.target) && menuToggle.has(e.target).length === 0) {
            closeAllDropdowns();
        }
    });
}

function initFooterDropdowns() {
    $('.footer-navigation .nav-item').each(function() {
        var $item = $(this);
        var $submenu = $item.find('.dropdown-menu');
        if ($submenu.length > 0) {
            $item.addClass('dropdown');
        }
    });

    (function() {
        var $resourceLinks = $('.footer-navigation .nav-item > a').filter(function() {
            var $link = $(this);
            var text = ($link.text() || '').trim().toLowerCase();
            var href = String($link.attr('href') || '').replace(/\/$/, '');
            return text === 'resources' || href.endsWith('/resources');
        });

        $resourceLinks.each(function() {
            var $link = $(this);
            var $parentItem = $link.parent();
            $link.attr('href', '/resources/library');
            $link.removeAttr('data-toggle aria-expanded');
            $link.off('click.dropdown click.navSanitize');
            $parentItem.removeClass('dropdown');
            $parentItem.find('.dropdown-menu').remove();
            $link.off('click');
        });
    })();

    $('.footer-navigation .nav-item.dropdown > a').on('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        var $parentItem = $(this).parent();
        var $dropdownMenu = $parentItem.find('.dropdown-menu');
        if ($dropdownMenu.length) {
            $('.footer-navigation .nav-item.dropdown').not($parentItem).removeClass('active');
            $('.footer-navigation .dropdown-menu').not($dropdownMenu).removeClass('show');
            $parentItem.toggleClass('active');
            $dropdownMenu.toggleClass('show');
        }
    });

    $(document).on('click.footerDropdown', function(e) {
        if (!$(e.target).closest('.footer-navigation').length) {
            $('.footer-navigation .nav-item.dropdown').removeClass('active');
            $('.footer-navigation .dropdown-menu').removeClass('show');
        }
    });

    $('.footer-navigation .dropdown-menu').on('click', function(e) {
        e.stopPropagation();
    });

    $('.footer-navigation .dropdown-menu a').on('click', function() {
        setTimeout(function() {
            $('.footer-navigation .nav-item.dropdown').removeClass('active');
            $('.footer-navigation .dropdown-menu').removeClass('show');
        }, 100);
    });
}

// ---------- Latest News Carousel ----------

function initLatestNewsCarousel() {
    var $carousel = $('.news-carousel');
    if (!$carousel.length) return;

    $carousel.slick({
        slidesToShow: 3,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 4000,
        pauseOnHover: true,
        arrows: false,
        dots: false,
        infinite: true,
        centerMode: true,
        centerPadding: '10%',
        responsive: [
            {
                breakpoint: 1200,
                settings: {
                    slidesToShow: 3,
                    centerPadding: '5%'
                }
            },
            {
                breakpoint: 992,
                settings: {
                    slidesToShow: 2,
                    centerPadding: '8%'
                }
            },
            {
                breakpoint: 576,
                settings: {
                    slidesToShow: 1,
                    centerPadding: '20px'
                }
            }
        ]
    });
}

// ---------- Consortium Carousel ----------

function initConsortiumCarousel() {
    var $carousel = $('.consortium-carousel');
    if (!$carousel.length) return;

    $carousel.slick({
        slidesToShow: 6,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        pauseOnHover: true,
        arrows: false,
        dots: false,
        infinite: true,
        centerMode: true,
        centerPadding: '5%',
        responsive: [
            {
                breakpoint: 1400,
                settings: {
                    slidesToShow: 5,
                    centerPadding: '3%'
                }
            },
            {
                breakpoint: 1200,
                settings: {
                    slidesToShow: 4,
                    centerPadding: '3%'
                }
            },
            {
                breakpoint: 992,
                settings: {
                    slidesToShow: 3,
                    centerPadding: '5%'
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 2,
                    centerPadding: '10%'
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    centerPadding: '20%'
                }
            }
        ]
    });
}

// ---------- Objectives Accordion ----------

function initObjectivesAccordion() {
    $('.objective-toggle').on('click', function() {
        var $item = $(this).closest('.objective-item');
        var $content = $item.find('.objective-content');
        var $btn = $item.find('.objective-btn');

        if ($item.hasClass('active')) {
            // Close this item
            $item.removeClass('active');
            $content.slideUp(300);
            $btn.attr('aria-expanded', 'false');
        } else {
            // Close other items and open this one
            $('.objective-item.active').removeClass('active')
                .find('.objective-content').slideUp(300);
            $('.objective-item .objective-btn').attr('aria-expanded', 'false');

            $item.addClass('active');
            $content.slideDown(300);
            $btn.attr('aria-expanded', 'true');
        }
    });
}
