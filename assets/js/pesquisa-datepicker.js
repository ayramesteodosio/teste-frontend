(function () {
  function init() {
    if (!window.jQuery || typeof jQuery.fn.datepicker !== "function") {
      console.warn("jQuery UI datepicker not available (pesquisa-datepicker)");
      return;
    }

    jQuery(function ($) {
      var $start = $("#PesquisaDataDisponivel");
      var $end = $("#PesquisaDataTermino");
      if (!$start.length || !$end.length) return;

      var today = new Date();
      today.setHours(0, 0, 0, 0);
      var tomorrow = new Date(today.getTime());
      tomorrow.setDate(tomorrow.getDate() + 1);

      var opts = {
        dateFormat: "dd/mm/yy",
        changeMonth: true,
        changeYear: true,
        showAnim: "fadeIn",
      };

      function safeParse(val) {
        try {
          return $.datepicker.parseDate("dd/mm/yy", val);
        } catch (e) {
          return null;
        }
      }

      $start.datepicker(
        $.extend({}, opts, {
          minDate: today,
          onSelect: function (sel) {
            var d = safeParse(sel);
            if (!d) return;
            var min = new Date(d.getTime());
            min.setDate(min.getDate() + 1);
            if (min < tomorrow) {
              min = new Date(tomorrow.getTime());
            }
            $end.datepicker("option", "minDate", min);
            var ev = $end.val();
            var ed = safeParse(ev);
            if (ed && ed <= min) {
              $end.val("");
            }
          },
        })
      );

      $end.datepicker(
        $.extend({}, opts, {
          minDate: tomorrow,
          onSelect: function (sel) {
            var d = safeParse(sel);
            if (!d) return;
            var max = new Date(d.getTime());
            max.setDate(max.getDate() - 1);
            if (max < today) {
              $start.val("");
              $start.datepicker("option", "maxDate", null);
            } else {
              $start.datepicker("option", "maxDate", max);
              var sv = $start.val();
              var sd = safeParse(sv);
              if (sd && sd > max) {
                $start.val("");
              }
            }
          },
        })
      );

      var sv = $start.val();
      var sd = safeParse(sv);
      if (sd) {
        if (sd < today) {
          $start.val("");
        } else {
          var min = new Date(sd.getTime());
          min.setDate(min.getDate() + 1);
          if (min < tomorrow) min = new Date(tomorrow.getTime());
          $end.datepicker("option", "minDate", min);
        }
      }
      var ev = $end.val();
      var ed = safeParse(ev);
      if (ed) {
        if (ed <= today) {
          $end.val("");
        } else {
          var max = new Date(ed.getTime());
          max.setDate(max.getDate() - 1);
          if (max < today) {
            $start.val("");
          } else {
            $start.datepicker("option", "maxDate", max);
          }
        }
      }
    });
  }

  if (window.jQuery && typeof jQuery.fn.datepicker === "function") {
    init();
  } else {
    var tries = 0;
    var id = setInterval(function () {
      tries++;
      if (window.jQuery && typeof jQuery.fn.datepicker === "function") {
        clearInterval(id);
        init();
      } else if (tries > 20) {
        clearInterval(id);
        console.warn("pesquisa-datepicker: jQuery UI not available after waiting");
      }
    }, 100);
  }
})();
