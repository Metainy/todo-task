/**
 * Main entry point and where we initialize the page.
 */
(function () {

    // Update the statistics
    updateStats();

    // Load all active tasks
    loadActiveTasks();

    // Load all completed tasks
    loadCompletedTasks();

    // Create a dialog
    dialog.createDialog();
})();
