/**
 * Get a random quote from an API.
 *
 * @returns {Promise<{author: *, content: *}>}
 */
async function getRandomQuote() {

    const URL = "http://api.quotable.io/random?tags=technology";

    const { data: { author, content } } = await axios.get(URL);

    return { author, content };
}

/**
 * Shows quotes if it's user's first visit or if the feature is enabled.
 */
function handleQuotes() {

    // Check if it's the very first visit, if so we enable the quotes by default
    if (localStorage.getItem("quotes") === null) store.setQuoteState(true);

    // Quotes are enabled
    if (store.getQuoteState()) {

        const quoteDiv = document.querySelector("#quoteCard");
        const content = quoteDiv.querySelector("#quoteContent");
        const author = quoteDiv.querySelector("#quoteAuthor");

        // Get a random quote and display the data
        getRandomQuote().then((quote) => {

            content.innerText = quote.content;
            author.innerText = `“${quote.author}“`;

            quoteDiv.style.display = "flex";
        });
    }
}

/**
 * Main entry point and where we initialize the page.
 */
(function () {

    // Handle quotes on the home page
    handleQuotes();

    // Update the statistics
    updateStats();

    // Load all active tasks
    loadActiveTasks();

    // Create a dialog
    dialog.createDialog();
})();
