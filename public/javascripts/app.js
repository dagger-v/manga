document.addEventListener("DOMContentLoaded", function () {
  // Get the div element by its ID
  let divElement = document.getElementById("manga");

  // Add a click event listener to the div
  divElement.addEventListener("click", function () {
    // Redirect to the desired page
    window.location.href = "/manga/title";
  });
});
