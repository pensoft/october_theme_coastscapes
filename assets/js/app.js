/* eslint-env browser, jquery */
'use strict';

$(function() {
    initHamburgerMenuDropdowns();
    initSearchToggles();
    initDesktopMenuToggle();
    initDesktopDropdownToggle();
    sanitizeNavDropdowns();
    initFooterDropdowns();
    $('nav').removeClass('no-transition');
});

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
        $navbarNav.addClass('show').css({
            right: '0',
            opacity: '1',
            visibility: 'visible'
        });
        $desktopToggle.hide();
        $('body').addClass('menu-open');
    });

    $closeBtn.on('click.desktopMenu', function(e) {
        e.preventDefault();
        e.stopPropagation();
        $navbarNav.removeClass('show').css({
            right: '-300px',
            opacity: '0',
            visibility: 'hidden'
        });
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
            $navbarNav.removeClass('show').css({
                right: '-300px',
                opacity: '0',
                visibility: 'hidden'
            });
            $desktopToggle.show();
            $('body').removeClass('menu-open');
        }
    });

    $navbarNav.on('click.desktopMenu', function(e) { e.stopPropagation(); });
    $('.navbar-bottom-elements').on('click.desktopMenu', function(e) { e.stopPropagation(); });
}

function initDesktopDropdownToggle() {
    $('.nav-item.dropdown > a').on('click.desktopDropdown', function(e) {
        e.preventDefault();
        var $dropdownMenu = $(this).siblings('.dropdown-menu');
        if ($dropdownMenu.hasClass('show')) {
            $dropdownMenu.removeClass('show');
        } else {
            $('.dropdown-menu.show').removeClass('show');
            $dropdownMenu.addClass('show');
        }
    });
}

function sanitizeNavDropdowns() {
    $('.nav-item').children('a').each(function() {
        var $link = $(this);
        if ($link.closest('.footer-navigation').length) {
            return;
        }
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
    function autoExpandActiveDropdowns() {
        var activeSubItems = $('#headerNavbarNav .dropdown-menu .nav-item.active');
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

    var dropdownItems = $('#headerNavbarNav .nav-item.dropdown > a');
    dropdownItems.each(function() {
        $(this).off('click.dropdown').on('click.dropdown', function(e) {
            e.preventDefault();
            var parentItem = $(this).parent();
            var dropdownMenu = parentItem.find('.dropdown-menu');
            if (dropdownMenu.length) {
                parentItem.toggleClass('active');
                dropdownMenu.toggleClass('show');
                var otherDropdowns = $('#headerNavbarNav .nav-item.dropdown');
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
        var activeDropdowns = $('#headerNavbarNav .nav-item.dropdown.active');
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
        var navbar = $('#headerNavbarNav');
        var menuToggle = $('#desktopMenuToggle');
        if (navbar.length && !navbar.is(e.target) && navbar.has(e.target).length === 0 &&
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
