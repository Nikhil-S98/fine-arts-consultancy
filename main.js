(function () {
  var panels = document.querySelectorAll(".panel");
  var reset = document.querySelector(".reset");

  function syncReset() {
    if (!reset) return;
    var open = Array.prototype.some.call(panels, function (el) {
      return el.matches(":target");
    });
    reset.hidden = !open;
  }

  syncReset();
  window.addEventListener("hashchange", syncReset);

  reset &&
    reset.addEventListener("click", function (e) {
      e.preventDefault();
      if (history.replaceState) {
        history.replaceState(null, "", window.location.pathname + window.location.search);
      } else {
        window.location.hash = "";
      }
      syncReset();
      var content = document.getElementById("content");
      if (content) content.focus({ preventScroll: true });
    });
})();
