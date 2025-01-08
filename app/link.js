// Function to extract query parameters from the URL
function getQueryParam(name) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name);
}

// Event listener for when the DOM content is loaded
document.addEventListener("DOMContentLoaded", function () {
  // Get all links in the document
  const allLinks = document.querySelectorAll("a");

  // Event listener for each link
  allLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      const userId = getQueryParam("user_id"); // Get user ID from query parameters
      if (userId) {
        // Append user_id to the URL
        const href = link.getAttribute("href");
        if (href && href.indexOf("?") === -1) {
          // If the link does not already have query parameters
          event.currentTarget.href = `${href}?user_id=${userId}`;
        } else {
          // If the link already has query parameters, append user_id
          event.currentTarget.href = `${href}&user_id=${userId}`;
        }
      }
    });
  });
});
