/**
 * Update the toggle button state based on the value in localstorage.
 */
function syncSettingUI() {

    const quoteBtn = document.querySelector("#quoteToggleBtn");
    const themeBtn = document.querySelector("#themeToggleBtn");

    // Sync buttons state
    quoteBtn.checked = store.getQuoteState() || false;
    themeBtn.checked = store.getThemeState() || false;
}

/**
 * Quotes toggle button on change handler.
 *
 * @param event
 */
function onQuoteChange(event) {

    // Get button state and update localstorage with the new state
    store.setQuoteState(event.target.checked);
}

/**
 * Quotes toggle button on change handler.
 *
 * @param event
 */
function onThemeChange(event) {

    // Get button state and update localstorage with the new state
    store.setThemeState(event.target.checked);

    // Change the theme
    changeTheme(event.target.checked);
}

/**
 * Reset button on click handler.
 *
 * @param event
 */
function onResetClick(event) {

    // Reset all tasks
    store.resetAll();
}

/**
 * Main entry point and where we initialize the page.
 */
(function () {

    // Set the toggle button state on page load
    syncSettingUI();

    // Update the statistics
    updateStats();
})();
