document.addEventListener("DOMContentLoaded", function () {
  var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-toggle="tooltip"]'));
  tooltipTriggerList.forEach(function (tooltipTriggerEl) {
    var tooltip = null;

    tooltipTriggerEl.addEventListener("mouseenter", function (e) {
      var title = this.getAttribute("title") || this.getAttribute("data-original-title");
      if (!title) return;

      // Criar tooltip
      tooltip = document.createElement("div");
      tooltip.className = "tooltip bottom in";
      tooltip.innerHTML = '<div class="tooltip-arrow"></div><div class="tooltip-inner">' + title + "</div>";

      document.body.appendChild(tooltip);

      tooltip.style.position = "absolute";
      tooltip.style.pointerEvents = "none";

      if (!this.hasAttribute("data-original-title")) {
        this.setAttribute("data-original-title", title);
        this.removeAttribute("title");
      }

      // Posicionar tooltip abaixo do elemento
      var rect = this.getBoundingClientRect();
      var tooltipRect = tooltip.getBoundingClientRect();

      tooltip.style.left = rect.left + rect.width / 2 - tooltipRect.width / 2 + window.scrollX + "px";
      tooltip.style.top = rect.bottom + 5 + window.scrollY + "px";
    });

    tooltipTriggerEl.addEventListener("mouseleave", function () {
      if (tooltip) {
        tooltip.remove();
        tooltip = null;
      }
    });
  });
});
