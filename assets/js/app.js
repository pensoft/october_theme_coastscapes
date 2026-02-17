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

    initAboutScrollAnimations();
    initObjectivesAccordion();
    initOurWorkTabs();
    initWorkPackageCards();
    initScopePillTabs();
    initScopeButtons();
    initNewsCategoryTabs();
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

    function openMenu() {
        $navbarNav.addClass('show');
        $desktopToggle.attr('aria-expanded', 'true');
        $navbarNav.attr('aria-hidden', 'false');
        $('body').addClass('menu-open');
    }

    function closeMenu() {
        $navbarNav.removeClass('show');
        $desktopToggle.attr('aria-expanded', 'false');
        $navbarNav.attr('aria-hidden', 'true');
        $('body').removeClass('menu-open');
    }

    // Toggle on hamburger click
    $desktopToggle.on('click.desktopMenu', function(e) {
        e.preventDefault();
        e.stopPropagation();
        if ($navbarNav.hasClass('show')) {
            closeMenu();
        } else {
            openMenu();
        }
    });

    // Close on Escape key
    $(document).on('keydown.desktopMenu', function(e) {
        if (e.key === 'Escape' && $navbarNav.hasClass('show')) {
            closeMenu();
        }
    });

    // Prevent clicks inside menu content from closing menu
    $navbarNav.find('.menu-content').on('click.desktopMenu', function(e) {
        e.stopPropagation();
    });
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

// ---------- Consortium Carousel (removed – now CSS-only marquee) ----------

// ---------- About Page Scroll Animations ----------

function initAboutScrollAnimations() {
    const $circles = $('.about-circle');
    if (!$circles.length) return;

    const $conn1Path = $('.connector-1 path');
    const $conn2Path = $('.connector-2 path');

    function updateConnectors() {
        const resilienceIn = $('.circle-resilience').hasClass('in-view');
        const adaptationIn = $('.circle-adaptation').hasClass('in-view');
        const collaborationIn = $('.circle-collaboration').hasClass('in-view');

        if (resilienceIn || adaptationIn) {
            $conn1Path.css({ stroke: 'url(#connector-gradient-1)', 'stroke-width': 3 });
        } else {
            $conn1Path.css({ stroke: '', 'stroke-width': '' });
        }

        if (adaptationIn || collaborationIn) {
            $conn2Path.css({ stroke: 'url(#connector-gradient-2)', 'stroke-width': 3 });
        } else {
            $conn2Path.css({ stroke: '', 'stroke-width': '' });
        }
    }

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                $(entry.target).addClass('in-view');
            } else {
                $(entry.target).removeClass('in-view');
            }
        });
        updateConnectors();
    }, {
        threshold: 0.5,
        rootMargin: '-20% 0px'
    });

    $circles.each(function() {
        observer.observe(this);
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

// ---------- Our Work Tabs ----------

function initOurWorkTabs() {
    var $tabs = $('.circular-tab');
    var $panels = $('.tab-panel');

    if (!$tabs.length) return;

    // Tab click handler
    $tabs.on('click', function() {
        var $clickedTab = $(this);
        var targetPanel = $clickedTab.data('tab');

        // Update active tab
        $tabs.removeClass('active').attr('aria-selected', 'false');
        $clickedTab.addClass('active').attr('aria-selected', 'true');

        // Update active panel
        $panels.removeClass('active');
        $('#' + targetPanel).addClass('active');
    });

    // Keyboard navigation
    $tabs.on('keydown', function(e) {
        var $currentTab = $(this);
        var $allTabs = $tabs;
        var currentIndex = $allTabs.index($currentTab);
        var newIndex;

        switch (e.key) {
            case 'ArrowLeft':
            case 'ArrowUp':
                e.preventDefault();
                newIndex = currentIndex > 0 ? currentIndex - 1 : $allTabs.length - 1;
                $allTabs.eq(newIndex).focus().click();
                break;
            case 'ArrowRight':
            case 'ArrowDown':
                e.preventDefault();
                newIndex = currentIndex < $allTabs.length - 1 ? currentIndex + 1 : 0;
                $allTabs.eq(newIndex).focus().click();
                break;
            case 'Home':
                e.preventDefault();
                $allTabs.first().focus().click();
                break;
            case 'End':
                e.preventDefault();
                $allTabs.last().focus().click();
                break;
        }
    });
}

// ---------- Work Package Cards Toggle ----------

function initWorkPackageCards() {
    var $pills = $('.wp-pill[data-wp-target]');
    var $cards = $('.wp-card');

    if (!$pills.length) return;

    $pills.on('click', function() {
        var $pill = $(this);
        var targetId = $pill.data('wp-target');
        var $targetCard = $('#' + targetId);

        if ($pill.hasClass('active')) {
            // Close the card
            $pill.removeClass('active');
            $targetCard.slideUp(300);
        } else {
            // Close any open card
            $pills.removeClass('active');
            $cards.slideUp(300);

            // Open the clicked one
            $pill.addClass('active');
            $targetCard.slideDown(300);
        }
    });

    // Close button handler
    $cards.find('.wp-card-close').on('click', function() {
        var $card = $(this).closest('.wp-card');
        $card.slideUp(300);
        $pills.removeClass('active');
    });
}

// ---------- Scope Pilot Pill Tabs ----------

function initScopePillTabs() {
    var $pills = $('.scope-pills .scope-pill');
    var $panels = $('.scope-panel');

    if (!$pills.length) return;

    $pills.on('click', function() {
        var $clicked = $(this);
        var target = $clicked.data('scope');

        // Update active pill
        $pills.removeClass('active').attr('aria-selected', 'false');
        $clicked.addClass('active').attr('aria-selected', 'true');

        // Update active panel
        $panels.removeClass('active');
        $('#scope-' + target).addClass('active');
    });
}

// ---------- Scope Buttons Toggle ----------

function initScopeButtons() {
    $('.scope-btn[data-toggle]').on('click', function() {
        var $btn = $(this);
        var $section = $btn.closest('.scope-section');
        var target = $btn.data('toggle');
        var $targetPanel = $section.find('.scope-expand-panel[data-panel="' + target + '"]');

        if ($btn.hasClass('active')) {
            $btn.removeClass('active');
            $targetPanel.slideUp(300);
        } else {
            $section.find('.scope-btn').removeClass('active');
            $section.find('.scope-expand-panel').slideUp(300);

            $btn.addClass('active');
            $targetPanel.slideDown(300);
        }
    });
}

// ---------- News Category Tabs ----------

function initNewsCategoryTabs() {
    var $tabs = $('.news-category-tabs .tab-link');
    if (!$tabs.length) return;

    // Highlight active tab based on current URL
    var urlParams = new URLSearchParams(window.location.search);
    var currentCategory = urlParams.get('categoryId') || 'all';

    $tabs.each(function() {
        var $tab = $(this);
        var tabCategory = $tab.data('category');

        if (String(tabCategory) === String(currentCategory)) {
            $tab.addClass('active').attr('aria-selected', 'true');
        } else {
            $tab.removeClass('active').attr('aria-selected', 'false');
        }
    });
}
