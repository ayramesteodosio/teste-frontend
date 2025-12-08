(function () {
  function pad(n) {
    return n < 10 ? "0" + n : n;
  }
  function formatDate(d) {
    return pad(d.getDate()) + "/" + pad(d.getMonth() + 1) + "/" + d.getFullYear();
  }

  function buildCalendar(year, month, selectedDate) {
    var first = new Date(year, month, 1);
    var startDay = first.getDay();
    var daysInMonth = new Date(year, month + 1, 0).getDate();

    var table = document.createElement("table");
    table.className = "jCalendar";
    var thead = document.createElement("thead");
    var tr = document.createElement("tr");
    ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].forEach(function (d) {
      var th = document.createElement("th");
      th.textContent = d;
      tr.appendChild(th);
    });
    thead.appendChild(tr);
    table.appendChild(thead);

    var tbody = document.createElement("tbody");
    var row = null;
    var day = 1;
    for (var r = 0; r < 6; r++) {
      row = document.createElement("tr");
      for (var c = 0; c < 7; c++) {
        var td = document.createElement("td");
        if (r === 0 && c < startDay) {
          td.textContent = "";
          td.className = "other-month";
        } else if (day > daysInMonth) {
          td.textContent = "";
          td.className = "other-month";
        } else {
          td.textContent = day;
          td.dataset.day = day;
          var thisDate = new Date(year, month, day);
          if (
            selectedDate &&
            selectedDate.getFullYear() === year &&
            selectedDate.getMonth() === month &&
            selectedDate.getDate() === day
          ) {
            td.className = "selected";
          }
          if (thisDate.toDateString() === new Date().toDateString()) {
            td.className = (td.className ? td.className + " " : "") + "today";
          }
          day++;
        }
        row.appendChild(td);
      }
      tbody.appendChild(row);
      if (day > daysInMonth) break;
    }
    table.appendChild(tbody);
    return table;
  }

  function createPopup() {
    var popup = document.createElement("div");
    popup.className = "dp-popup";
    popup.id = "dp-popup";
    popup.style.display = "block";
    popup.innerHTML =
      '<div class="dp-nav"><button type="button" class="dp-prev">&lt;</button><span class="dp-month-year"></span><button type="button" class="dp-next">&gt;</button></div>';
    var container = document.createElement("div");
    container.className = "dp-container";
    popup.appendChild(container);
    document.body.appendChild(popup);
    return popup;
  }

  function positionPopup(popup, input) {
    var rect = input.getBoundingClientRect();
    var left = rect.left + window.pageXOffset;
    var top = rect.bottom + window.pageYOffset + 6;
    popup.style.position = "absolute";
    popup.style.left = left + "px";
    popup.style.top = top + "px";
    popup.style.zIndex = 9999;
  }

  function attach(input) {
    var wrapper = input.closest(".date-wrapper") || input.parentNode;
    var popup = null;
    var current = { year: null, month: null };

    function show(selectedDate) {
      if (!popup) popup = createPopup();
      var container = popup.querySelector(".dp-container");
      var monthYear = popup.querySelector(".dp-month-year");
      var prev = popup.querySelector(".dp-prev");
      var next = popup.querySelector(".dp-next");

      var sel = null;
      if (input.value) {
        var parts = input.value.split("/");
        if (parts.length === 3) {
          sel = new Date(parts[2], parseInt(parts[1], 10) - 1, parts[0]);
        }
      }
      var today = sel || new Date();
      current.year = today.getFullYear();
      current.month = today.getMonth();

      function render() {
        monthYear.textContent = current.month + 1 + "/" + current.year;
        container.innerHTML = "";
        var table = buildCalendar(current.year, current.month, sel);
        container.appendChild(table);
        container.querySelectorAll("td").forEach(function (td) {
          if (td.dataset.day) {
            td.addEventListener("click", function (e) {
              var d = new Date(current.year, current.month, parseInt(td.dataset.day, 10));
              input.value = formatDate(d);
              input.dispatchEvent(new Event("input", { bubbles: true }));
              input.dispatchEvent(new Event("change", { bubbles: true }));
              hide();
            });
          }
        });
      }

      prev.onclick = function () {
        current.month--;
        if (current.month < 0) {
          current.month = 11;
          current.year--;
        }
        render();
      };
      next.onclick = function () {
        current.month++;
        if (current.month > 11) {
          current.month = 0;
          current.year++;
        }
        render();
      };

      render();
      positionPopup(popup, input);
      setTimeout(function () {
        document.addEventListener("click", outsideHandler);
      }, 0);
    }

    function hide() {
      if (popup) popup.style.display = "none";
      document.removeEventListener("click", outsideHandler);
    }

    function outsideHandler(e) {
      if (!popup) return;
      if (e.target === input) return;
      if (popup.contains(e.target)) return;
      hide();
    }

    input.addEventListener("focus", function () {
      show();
    });
    input.addEventListener("click", function (e) {
      e.stopPropagation();
      show();
    });
    window.addEventListener("resize", function () {
      if (popup && popup.style.display !== "none") positionPopup(popup, input);
    });
    window.addEventListener(
      "scroll",
      function () {
        if (popup && popup.style.display !== "none") positionPopup(popup, input);
      },
      true
    );
  }

  document.addEventListener("DOMContentLoaded", function () {
    var inputs = document.querySelectorAll("#PesquisaAdminEditForm .date-wrapper input.period-input");
    inputs.forEach(function (inp) {
      attach(inp);
    });
  });
})();
