/**
 * Living Labs Map Interactive Functionality
 * Handles click-based popups for the living labs map
 */

(function() {
    'use strict';

    /**
     * Initialize the living labs map functionality
     */
    function initializeLivingLabsMap() {
        // Get the SVG container
        const svg = document.querySelector('.living-labs-map svg');
        if (!svg) return;

        // Get partner data from global variables
        const partnersData = window.livingLabsPartners || {};
        const countryNames = window.countryNames || {};
        const cityNames = window.cityNames || {};

        // Get popup element
        const popup = document.getElementById('living-labs-popup');
        if (!popup) return;

        // Get all circle markers (dots) with data-country attribute
        const markers = svg.querySelectorAll('circle.living-lab-marker[data-country]');

        // Shared handler function for setting up click events
        function setupClickEvents(elements) {
            elements.forEach(element => {
                const countryCode = element.getAttribute('data-country');

                if (countryCode && partnersData[countryCode]) {
                    const countryData = partnersData[countryCode];
                    const locationName = `${cityNames[countryCode]}, ${countryNames[countryCode]}`;

                    // Add event listener for click
                    element.addEventListener('click', () => {
                        showLivingLabsPopup(countryCode, countryData, locationName);
                    });

                    // Add cursor pointer style
                    element.style.cursor = 'pointer';
                }
            });
        }

        // Setup hover effects on dot markers to highlight corresponding image circles
        function setupDotHoverEffects() {
            markers.forEach(marker => {
                const countryCode = marker.getAttribute('data-country');
                if (!countryCode) return;

                // Find the corresponding image circle
                const imageCircle = svg.querySelector(`circle.living-lab-image[data-country="${countryCode}"]`);
                if (!imageCircle) return;

                marker.addEventListener('mouseenter', () => {
                    imageCircle.classList.add('is-highlighted');
                });

                marker.addEventListener('mouseleave', () => {
                    imageCircle.classList.remove('is-highlighted');
                });
            });
        }

        // Apply click handlers to marker dots only
        setupClickEvents(markers);

        // Apply hover effects to dots (highlights corresponding image circles)
        setupDotHoverEffects();
    }

    /**
     * Show living labs popup with country and partner data
     * @param {string} countryCode - The country code
     * @param {Object} countryData - The country data object
     * @param {string} locationName - The location display name (city, country)
     */
    function showLivingLabsPopup(countryCode, countryData, locationName) {
        const popup = document.getElementById('living-labs-popup');

        if (!popup) return;

        // Get the first partner (since we're showing only one)
        const firstPartner = countryData.partners && countryData.partners[0];
        if (!firstPartner) return;

        // Populate partner information with location name and country code
        populatePartnerInfo(firstPartner, locationName, countryCode);

        // Show popup
        popup.style.display = 'block';

        // Add event listeners for closing popup
        setTimeout(() => {
            document.addEventListener('click', handlePopupOutsideClick);
            document.addEventListener('keydown', handlePopupKeydown);
        }, 100);
    }

    /**
     * Populate the partner information in the popup
     * @param {Object} partner - The partner data object
     * @param {string} locationName - The location display name (city, country)
     * @param {string} countryCode - The country code (e.g., 'PT', 'BE')
     */
    function populatePartnerInfo(partner, locationName, countryCode) {
        const backgroundImg = document.getElementById('popup-background-img');
        const countryName = document.getElementById('popup-country-name');
        const contact = document.getElementById('popup-contact');
        const findOutBtn = document.getElementById('popup-find-out-btn');
        const logoImg = document.getElementById('popup-logo');

        // Country-specific logo mapping
        const countryLogos = {
            'PT': 'assets/images/libing-lab-portugal.svg',
            'BE': 'assets/images/living-lab-belgium.svg',
            'FI': 'assets/images/living-lab-finland.svg',
            'GB': 'assets/images/living-lab-uk.svg',
            'RO': 'assets/images/living-lab-romania.svg'
        };

        // Update logo based on country code
        if (logoImg && countryCode && countryLogos[countryCode] && window.themeUrl) {
            logoImg.src = window.themeUrl + '/' + countryLogos[countryCode];
        }

        // Background image (placeholder color shows via CSS when no image)
        if (backgroundImg) {
            if (partner.background) {
                backgroundImg.src = partner.background;
                backgroundImg.style.display = 'block';
            } else {
                backgroundImg.src = '';
                backgroundImg.style.display = 'none';
            }
        }

        // Country name
        if (countryName) {
            countryName.textContent = locationName || '';
        }

        // Contact (institution)
        if (contact) {
            contact.textContent = partner.institution ? `Contact: ${partner.institution}` : '';
        }

        // Find out more button
        if (findOutBtn) {
            if (partner.url) {
                findOutBtn.href = partner.url;
                findOutBtn.style.display = 'inline-flex';
            } else {
                findOutBtn.style.display = 'none';
            }
        }
    }

    /**
     * Close living labs popup
     */
    function closeLivingLabsPopup() {
        const popup = document.getElementById('living-labs-popup');
        if (popup) {
            popup.style.display = 'none';
            document.removeEventListener('click', handlePopupOutsideClick);
            document.removeEventListener('keydown', handlePopupKeydown);
        }
    }

    /**
     * Handle clicking outside popup to close it
     * @param {Event} event - The click event
     */
    function handlePopupOutsideClick(event) {
        const popup = document.getElementById('living-labs-popup');
        if (popup && !popup.contains(event.target)) {
            closeLivingLabsPopup();
        }
    }

    /**
     * Handle keyboard events for popup
     * @param {Event} event - The keyboard event
     */
    function handlePopupKeydown(event) {
        if (event.key === 'Escape') {
            closeLivingLabsPopup();
        }
    }

    // Make closeLivingLabsPopup globally available for the close button onclick
    window.closeLivingLabsPopup = closeLivingLabsPopup;

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeLivingLabsMap);
    } else {
        initializeLivingLabsMap();
    }

})(); 