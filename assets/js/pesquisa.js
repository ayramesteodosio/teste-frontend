(function () {
  "use strict";

  function initDatepickers() {
    var $ = window.jQuery;
    if (!$) return;
    if (!($.fn && $.fn.datepicker)) return;

    try {
      $(function () {
        $("#PesquisaDataDisponivel, #PesquisaDataTermino").each(function () {
          var $el = $(this);
          if ($el.data("datepicker-initialized")) return;
          $el.datepicker({ dateFormat: "dd/mm/yy" });
          $el.data("datepicker-initialized", true);
        });
      });
    } catch (e) {
      if (window.console && console.warn) console.warn("pesquisa.js: datepicker init failed", e);
    }
  }

  if (window.jQuery) {
    initDatepickers();
    try {
      initDateLimits();
    } catch (e) {
    }
  } else {
    document.addEventListener("DOMContentLoaded", function () {
      initDatepickers();
      try {
        initDateLimits();
      } catch (e) {
        /* ignore */
      }
    });
  }
})();

(function () {
  function pad(n) {
    return n < 10 ? "0" + n : n;
  }

  function initDateLimits() {
    var today = new Date();
    var y = today.getFullYear();
    var m = pad(today.getMonth() + 1);
    var d = pad(today.getDate());
    var min = y + "-" + m + "-" + d;
    var start = document.getElementById("PesquisaDataDisponivel");
    var end = document.getElementById("PesquisaDataTermino");
    if (start) {
      try {
        start.min = min;
        if (start.value && start.value < min) start.value = min;
      } catch (e) {
      }
    }
    if (end) {
      try {
        end.min = min;
        if (end.value && end.value < min) end.value = min;
      } catch (e) {
      }
    }

    if (start && end) {
      try {
        if (start.value) {
          end.min = start.value > min ? start.value : min;
          if (end.value && end.value < end.min) end.value = end.min;
        }

        start.addEventListener("change", function () {
          var sv = start.value || min;
          end.min = sv;
          if (end.value && end.value < sv) end.value = sv;
        });
      } catch (e) {
      }
    }
  }

  window.initDateLimits = initDateLimits;
})();
