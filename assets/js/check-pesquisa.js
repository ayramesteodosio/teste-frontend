(function () {
  "use strict";

  function readDescricaoValue(desc) {
    try {
      if (window.CKEDITOR) {
        var inst = window.CKEDITOR.instances && window.CKEDITOR.instances.PesquisaDescricao;
        if (inst && typeof inst.getData === "function") return inst.getData();
      }
    } catch (e) {}
    return desc ? desc.value : "";
  }

  document.addEventListener("DOMContentLoaded", function () {
    try {
      var params = new URLSearchParams(location.search);
      if (params.get("pesquisaCriada") || params.get("pesquisaEditada")) {
        try {
          if (params.get("pesquisaEditada")) mostrarToastLocal("Pesquisa editada!");
          else mostrarToastLocal("Pesquisa criada!");
        } catch (e) {}
        params.delete("pesquisaCriada");
        params.delete("pesquisaEditada");
        var newUrl = location.pathname + (params.toString() ? "?" + params.toString() : "") + location.hash;
        try {
          history.replaceState(null, "", newUrl);
        } catch (e) {}
      }
    } catch (e) {}

    var form = document.getElementById("PesquisaAdminEditForm");
    if (form) {
      var nome = document.getElementById("PesquisaNome");
      var desc = document.getElementById("PesquisaDescricao");

      function removeFieldErrorFor(el) {
        try {
          if (!el) return;
          var container = el && el.closest && el.closest(".input");
          if (!container) container = el && el.parentNode;
          if (container) {
            var err = container.querySelector && container.querySelector(".field-error");
            if (err) err.remove();
            return;
          }
        } catch (e) {}
        try {
          var anyErr = document.querySelector(".field-error");
          if (anyErr) anyErr.remove();
        } catch (e) {}
      }

      try {
        if (nome && nome.addEventListener) {
          nome.addEventListener("input", function () {
            removeFieldErrorFor(nome);
          });
        }

        if (desc) {
          try {
            if (window.CKEDITOR) {
              var inst = window.CKEDITOR.instances && window.CKEDITOR.instances.PesquisaDescricao;
              if (inst && typeof inst.on === "function") {
                inst.on("change", function () {
                  removeFieldErrorFor(desc);
                });
              }
            }
          } catch (e) {}
          try {
            if (desc.addEventListener) {
              desc.addEventListener("input", function () {
                removeFieldErrorFor(desc);
              });
            }
          } catch (e) {}
        }

        try {
          var dataInicioEl = document.getElementById("PesquisaDataDisponivel");
          var dataFimEl = document.getElementById("PesquisaDataTermino");
          var bindDateHandler = function (el) {
            if (!el) return;
            var handler = function () {
              removeFieldErrorFor(el);
            };
            try {
              if (el.addEventListener) {
                el.addEventListener("change", handler);
                el.addEventListener("input", handler);
                el.addEventListener("blur", handler);
              }
            } catch (e) {}
            try {
              if (window.jQuery && typeof window.jQuery === "function") {
                try {
                  window.jQuery(el).on("change input", handler);
                } catch (e) {}
              }
            } catch (e) {}
          };

          bindDateHandler(dataInicioEl);
          bindDateHandler(dataFimEl);
        } catch (e) {}

        // If jQuery UI datepicker is used, wrap its onSelect to ensure a 'change' event is triggered
        try {
          if (window.jQuery && window.jQuery.fn && typeof window.jQuery.fn.datepicker === "function") {
            try {
              [dataInicioEl, dataFimEl].forEach(function (el) {
                if (!el) return;
                try {
                  var $el = window.jQuery(el);
                  var orig = $el.datepicker("option", "onSelect");
                  var wrapper = function (sel) {
                    try {
                      if (typeof orig === "function") orig.call(this, sel);
                    } catch (ee) {}
                    try {
                      window.jQuery(this).trigger("change");
                    } catch (eee) {}
                  };
                  $el.datepicker("option", "onSelect", wrapper);
                } catch (e) {}
              });
            } catch (e) {}
          }
        } catch (e) {}

        try {
          var enviarRadios = document.querySelectorAll('input[name="data[Pesquisa][enviar_para]"]');
          if (enviarRadios && enviarRadios.length) {
            enviarRadios.forEach(function (r) {
              r.addEventListener("change", function () {
                var fieldset = document.querySelector(".opcoes_enviar_para") || form;
                removeFieldErrorFor(fieldset);
              });
            });
          }
        } catch (e) {}
      } catch (e) {}

      form.addEventListener("submit", function (e) {
        e.preventDefault();

        document.querySelectorAll(".field-error").forEach(function (el) {
          el.remove();
        });

        function showErrorAfter(el, message) {
          var node = document.createElement("div");
          node.className = "field-error";
          node.style.color = "#c00";
          node.style.fontSize = "12px";
          node.style.marginTop = "6px";
          node.textContent = message;
          var container = el && el.closest && el.closest(".input");
          if (!container) container = el && el.parentNode;
          if (container && container.appendChild) container.appendChild(node);
          else document.body.appendChild(node);
        }

        function stripHtml(s) {
          if (!s) return "";
          try {
            var d = document.createElement("div");
            d.innerHTML = s;
            return (d.textContent || d.innerText || "").replace(/\u00A0/g, "").trim();
          } catch (e) {
            return s
              .replace(/<[^>]*>/g, "")
              .replace(/&nbsp;|&#160;/g, " ")
              .trim();
          }
        }

        var errors = [];

        if (!nome || !nome.value || !nome.value.trim()) {
          showErrorAfter(nome, "Não foi preenchido");
          errors.push("Não foi preenchido");
        }

        var descricaoVal = readDescricaoValue(desc);
        var descricaoLimpa = stripHtml(descricaoVal);
        if (!descricaoLimpa) {
          showErrorAfter(desc, "Não foi preenchido");
          errors.push("Não foi preenchido");
        } else if (descricaoLimpa.length < 10) {
          showErrorAfter(desc, "A descrição deve ter pelo menos 10 caracteres.");
          errors.push("Descrição muito curta");
        }

        var dataInicio = document.getElementById("PesquisaDataDisponivel");
        var dataFim = document.getElementById("PesquisaDataTermino");
        var inicioVal = dataInicio ? (dataInicio.value || "").trim() : "";
        var fimVal = dataFim ? (dataFim.value || "").trim() : "";
        if (!inicioVal || !fimVal) {
          var periodContainer =
            (dataInicio && dataInicio.closest && dataInicio.closest(".period")) ||
            (dataFim && dataFim.closest && dataFim.closest(".period")) ||
            form;
          showErrorAfter(periodContainer, "Não foi preenchido");
          errors.push("Não foi preenchido");
        }

        var enviarChecked = document.querySelector('input[name="data[Pesquisa][enviar_para]"]:checked');
        if (!enviarChecked) {
          var fieldset = document.querySelector(".opcoes_enviar_para") || form;
          showErrorAfter(fieldset, "Não foi selecionado");
          errors.push("Não foi selecionado");
        }

        if (errors.length) {
          try {
            if (nome && (!nome.value || !nome.value.trim())) nome.focus();
            else if (dataInicio && !dataInicio.value) dataInicio.focus();
            else if (dataFim && !dataFim.value) dataFim.focus();
            else if (desc) desc.focus();
          } catch (e) {}
          return;
        }

        try {
          var submitBtn = form.querySelector('button[type="submit"], input[type="submit"]');
          if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.setAttribute("aria-disabled", "true");
            submitBtn.classList && submitBtn.classList.add("submitting");
          }
        } catch (e) {}

        var iframeName = "pesquisa-submit-iframe";
        var iframe = document.getElementById(iframeName);
        var redirected = false;
        var originalTarget = form.getAttribute("target");

        var cleanup = function () {
          try {
            if (iframe && typeof onIframeLoad === "function") iframe.removeEventListener("load", onIframeLoad);
          } catch (e) {}
          try {
            if (originalTarget === null) form.removeAttribute("target");
            else form.setAttribute("target", originalTarget);
          } catch (e) {}
        };

        if (!iframe) {
          iframe = document.createElement("iframe");
          iframe.style.display = "none";
          iframe.id = iframeName;
          iframe.name = iframeName;
          document.body.appendChild(iframe);
        }

        form.setAttribute("target", iframeName);

        var isEdit = (location.pathname || "").indexOf("/editar-pesquisa") !== -1;
        var redirectParam = isEdit ? "pesquisaEditada=1" : "pesquisaCriada=1";

        var onIframeLoad = function () {
          if (redirected) return;
          redirected = true;
          try {
            cleanup();
          } catch (e) {}
          try {
            location.href = "/pages/geral/index.html?" + redirectParam;
          } catch (e) {}
        };

        var fallbackTimer = setTimeout(function () {
          if (redirected) return;
          redirected = true;
          try {
            cleanup();
          } catch (e) {}
          try {
            location.href = "/pages/geral/index.html?" + redirectParam;
          } catch (e) {}
        }, 5000);

        try {
          iframe.addEventListener("load", onIframeLoad);
        } catch (e) {}

        try {
          form.submit();
        } catch (err) {
          try {
            var action = form.getAttribute("action") || location.href;
            var method = (form.getAttribute("method") || "POST").toUpperCase();
            var fd = new FormData(form);
            fetch(action, { method: method, body: fd, credentials: "include" })
              .then(function () {
                if (redirected) return;
                redirected = true;
                clearTimeout(fallbackTimer);
                try {
                  cleanup();
                } catch (e) {}
                location.href = "/pages/geral/index.html?" + redirectParam;
              })
              .catch(function () {
                if (redirected) return;
                redirected = true;
                clearTimeout(fallbackTimer);
                try {
                  cleanup();
                } catch (e) {}
                location.href = "/pages/geral/index.html?" + redirectParam;
              });
          } catch (e) {
            clearTimeout(fallbackTimer);
            try {
              cleanup();
            } catch (ee) {}
            location.href = "/pages/geral/index.html";
          }
          return;
        }
      });
    }
  });

  function mostrarToastLocal(mensagem) {
    var container = document.getElementById("toast-container");
    if (!container) {
      container = document.createElement("div");
      container.id = "toast-container";
      container.className = "toast-container";
      document.body.appendChild(container);
    }

    var toast = document.createElement("div");
    toast.className = "toast";

    toast.innerHTML =
      '\n      <button class="toast-close-btn" onclick="this.parentElement.classList.add(\'hiding\'); setTimeout(() => this.parentElement.remove(), 300)">\n        <img src="/assets/icons/messageClose.svg" alt="Fechar" />\n      </button>\n      <img src="/assets/icons/FlashMes-success.svg" alt="Sucesso" class="toast-icon" />\n      <div class="toast-content">\n        <p class="toast-message">' +
      (mensagem || "") +
      "</p>\n      </div>\n    ";

    container.appendChild(toast);

    setTimeout(function () {
      if (toast.parentElement) {
        toast.classList.add("hiding");
        setTimeout(function () {
          toast.remove();
        }, 300);
      }
    }, 3000);
  }
})();
