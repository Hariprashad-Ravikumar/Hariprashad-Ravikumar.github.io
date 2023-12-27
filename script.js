document.addEventListener("DOMContentLoaded", function () {
  var currentPath = window.location.pathname;
  var navLinks = document.querySelectorAll("nav a");

  navLinks.forEach(function (link) {
    if (link.getAttribute("href") === currentPath) {
      link.parentElement.classList.add("current");
    }
  });
});
