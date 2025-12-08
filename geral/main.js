document.addEventListener("DOMContentLoaded", function () {
  var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-toggle="tooltip"]'));
  tooltipTriggerList.forEach(function (tooltipTriggerEl) {
    var tooltip = null;

    tooltipTriggerEl.addEventListener("mouseenter", function (e) {
      var title = this.getAttribute("title") || this.getAttribute("data-original-title");
      if (!title) return;

      tooltip = document.createElement("div");
      tooltip.className = "tooltip bottom in";
      tooltip.innerHTML = '<div class="tooltip-arrow"></div><div class="tooltip-inner">' + title + "</div>";

      document.body.appendChild(tooltip);

      tooltip.style.position = "fixed";
      tooltip.style.pointerEvents = "none";

      if (!this.hasAttribute("data-original-title")) {
        this.setAttribute("data-original-title", title);
        this.removeAttribute("title");
      }

      var updatePosition = function (event) {
        if (tooltip) {
          var tooltipRect = tooltip.getBoundingClientRect();
          tooltip.style.left = event.clientX - tooltipRect.width / 2 + "px";
          tooltip.style.top = event.clientY + 15 + "px";
        }
      };

      updatePosition(e);
      tooltipTriggerEl.addEventListener("mousemove", updatePosition);
      tooltip._updatePosition = updatePosition;
    });

    tooltipTriggerEl.addEventListener("mouseleave", function () {
      if (tooltip) {
        if (tooltip._updatePosition) {
          tooltipTriggerEl.removeEventListener("mousemove", tooltip._updatePosition);
        }
        tooltip.remove();
        tooltip = null;
      }
    });
  });

  var rowCount = document.querySelectorAll(".table-resp tbody tr").length;
  var countSpan = document.getElementById("total-perguntas");
  if (countSpan) {
    countSpan.textContent = "(" + rowCount + ")";
  }

  var statusElement = document.getElementById("status-pesquisa");
  if (statusElement) {
    var statusText = statusElement.textContent.trim();
    var badgeClass = "";
    var badgeText = "";

    if (statusText === "Sim") {
      badgeClass = "disponivel";
      badgeText = "Disponível";
    } else {
      badgeClass = "indisponivel";
      badgeText = "Indisponível";
    }

    statusElement.innerHTML = '<span class="status-badge ' + badgeClass + '">' + badgeText + "</span>";
  }

  var btnEnviarPesquisa = document.getElementById("btn-enviar-pesquisa");
  if (btnEnviarPesquisa) {
    btnEnviarPesquisa.addEventListener("click", function (e) {
      if (this.classList && this.classList.contains("link_desabilitado")) {
        e.preventDefault();
        return;
      }

      e.preventDefault();

      var overlay = document.createElement("div");
      overlay.id = "simplemodal-overlay";
      overlay.style.cssText =
        "position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.5); z-index: 1000;";
      document.body.appendChild(overlay);

      var wrapper = document.createElement("div");
      wrapper.id = "simplemodal-wrapper";
      wrapper.style.cssText = "position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 1001;";

      var modalContainer = document.createElement("div");
      modalContainer.id = "osx-container";
      modalContainer.style.display = "block";

      var modalContent = document.getElementById("osx-modal-content");

      if (modalContent) {
        var clonedContent = modalContent.cloneNode(true);
        clonedContent.style.display = "block";

        var modalData = clonedContent.querySelector("#osx-modal-data");
        if (modalData) {
          modalData.style.display = "block";
        }

        modalContainer.appendChild(clonedContent);
        wrapper.appendChild(modalContainer);
        document.body.appendChild(wrapper);
      }

      overlay.addEventListener("click", function () {
        overlay.remove();
        wrapper.remove();
      });
    });
  }

  document.addEventListener("click", function (e) {
    if (e.target && e.target.id === "apenas-liberar") {
      e.preventDefault();
      var overlay = document.getElementById("simplemodal-overlay");
      var wrapper = document.getElementById("simplemodal-wrapper");
      if (overlay) overlay.remove();
      if (wrapper) wrapper.remove();
    }

    if (e.target && e.target.id === "liberar-e-enviar") {
      e.preventDefault();

      var overlay = document.getElementById("simplemodal-overlay");
      var wrapper = document.getElementById("simplemodal-wrapper");
      if (overlay) overlay.remove();
      if (wrapper) wrapper.remove();

      var btnEnviarPesquisa = document.getElementById("btn-enviar-pesquisa");
      if (btnEnviarPesquisa) {
        btnEnviarPesquisa.classList.add("link_desabilitado");
        btnEnviarPesquisa.removeAttribute("href");
        btnEnviarPesquisa.style.cursor = "not-allowed";

        var wrapperDiv = document.createElement("div");
        wrapperDiv.style.display = "inline-block";
        wrapperDiv.setAttribute("data-toggle", "tooltip");
        wrapperDiv.setAttribute("data-original-title", "Pesquisa já enviada");

        btnEnviarPesquisa.parentNode.insertBefore(wrapperDiv, btnEnviarPesquisa);
        wrapperDiv.appendChild(btnEnviarPesquisa);

        var tooltip = null;
        wrapperDiv.addEventListener("mouseenter", function (event) {
          var title = this.getAttribute("data-original-title");
          if (!title) return;

          tooltip = document.createElement("div");
          tooltip.className = "tooltip bottom in";
          tooltip.innerHTML = '<div class="tooltip-arrow"></div><div class="tooltip-inner">' + title + "</div>";
          document.body.appendChild(tooltip);
          tooltip.style.position = "fixed";
          tooltip.style.pointerEvents = "none";

          var updatePosition = function (e) {
            if (tooltip) {
              var tooltipRect = tooltip.getBoundingClientRect();
              tooltip.style.left = e.clientX - tooltipRect.width / 2 + "px";
              tooltip.style.top = e.clientY + 15 + "px";
            }
          };

          updatePosition(event);
          wrapperDiv._updatePosition = updatePosition;
          wrapperDiv.addEventListener("mousemove", updatePosition);
        });

        wrapperDiv.addEventListener("mouseleave", function () {
          if (tooltip) {
            if (wrapperDiv._updatePosition) {
              wrapperDiv.removeEventListener("mousemove", wrapperDiv._updatePosition);
            }
            tooltip.remove();
            tooltip = null;
          }
        });
      }
    }
  });

  var btnAdicionarPergunta = document.getElementById("btn-adicionar-pergunta");
  var btnCancelarPergunta = document.getElementById("btn-cancelar-pergunta");
  var formAdicionarPergunta = document.getElementById("form-adicionar-pergunta");
  var btnAdicionarWrapper = document.getElementById("btn-adicionar-wrapper");
  var editingRow = null;

  function showInputError(inputEl, message) {
    try {
      var existing =
        inputEl &&
        inputEl.parentNode &&
        inputEl.parentNode.querySelector &&
        inputEl.parentNode.querySelector(".field-error");
      if (existing && existing.parentElement) existing.parentElement.removeChild(existing);
    } catch (e) {}

    try {
      var node = document.createElement("div");
      node.className = "field-error";
      node.style.color = "#c00";
      node.style.fontSize = "12px";
      node.style.marginTop = "6px";
      node.textContent = message || "";
      var container =
        (inputEl && inputEl.closest && inputEl.closest(".input")) || (inputEl && inputEl.parentNode) || document.body;
      if (container && container.appendChild) container.appendChild(node);
      else document.body.appendChild(node);
      try {
        inputEl.focus();
      } catch (e) {}
    } catch (e) {}
  }

  if (btnAdicionarPergunta) {
    btnAdicionarPergunta.addEventListener("click", function () {
      try {
        var iprev = document.getElementById("input-pergunta");
        if (iprev) {
          var prevErr =
            iprev.parentNode && iprev.parentNode.querySelector && iprev.parentNode.querySelector(".field-error");
          if (prevErr && prevErr.parentElement) prevErr.parentElement.removeChild(prevErr);
        }
      } catch (e) {}

      btnAdicionarWrapper.style.display = "none";
      formAdicionarPergunta.style.display = "block";
    });
  }

  try {
    var inputPerguntaEl = document.getElementById("input-pergunta");
    if (inputPerguntaEl) {
      inputPerguntaEl.addEventListener("input", function () {
        try {
          var err = this.parentNode && this.parentNode.querySelector && this.parentNode.querySelector(".field-error");
          if (err && err.parentElement) err.parentElement.removeChild(err);
        } catch (e) {}
      });
    }
  } catch (e) {}

  function showBottomBar(mensagem) {
    try {
      if (typeof mostrarToastLocal === "function") {
        mostrarToastLocal(mensagem || "Sucesso");
        return;
      }

      try {
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
          (mensagem || "Sucesso") +
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
      } catch (e) {}
    } catch (e) {}
  }

  try {
    var paramsOnLoad = new URLSearchParams(location.search);
    var pc = paramsOnLoad.get("perguntaCriada");
    var pe = paramsOnLoad.get("perguntaEditada");
    if (pc || pe) {
      var msg = pc ? "Pergunta criada com sucesso!" : "Pergunta editada com sucesso!";
      try {
        showBottomBar(msg);
      } catch (e) {}
      paramsOnLoad.delete("perguntaCriada");
      paramsOnLoad.delete("perguntaEditada");
      var newUrl = location.pathname + (paramsOnLoad.toString() ? "?" + paramsOnLoad.toString() : "") + location.hash;
      try {
        history.replaceState(null, "", newUrl);
      } catch (e) {}
    }
  } catch (e) {}

  if (btnCancelarPergunta) {
    btnCancelarPergunta.addEventListener("click", function () {
      formAdicionarPergunta.style.display = "none";
      btnAdicionarWrapper.style.display = "block";
      document.getElementById("input-pergunta").value = "";
      document.getElementById("checkbox-obrigatorio").checked = false;
      editingRow = null;
      if (btnConfirmarAdicionar) btnConfirmarAdicionar.textContent = "Adicionar";
    });
  }

  var btnConfirmarAdicionar = document.getElementById("btn-confirmar-adicionar");
  if (btnConfirmarAdicionar) {
    btnConfirmarAdicionar.addEventListener("click", function () {
      var inputPergunta = document.getElementById("input-pergunta");
      var checkboxObrigatorio = document.getElementById("checkbox-obrigatorio");
      var perguntaTexto = inputPergunta.value.trim();

      if (!perguntaTexto) {
        showInputError(inputPergunta, "Por favor, digite uma pergunta.");
        return;
      }

      var tbody = document.querySelector(".table-resp tbody");
      if (!tbody) return;

      if (editingRow) {
        var tdPergunta = editingRow.querySelector('td[data-th="Nome"]');
        tdPergunta.textContent = perguntaTexto;
        if (checkboxObrigatorio.checked) {
          var spanObrigatorio = document.createElement("span");
          spanObrigatorio.className = "obrigatorio";
          spanObrigatorio.textContent = " *";
          tdPergunta.appendChild(spanObrigatorio);
        }

        editingRow = null;
        btnConfirmarAdicionar.textContent = "Adicionar";

        formAdicionarPergunta.style.display = "none";
        btnAdicionarWrapper.style.display = "block";
        inputPergunta.value = "";
        checkboxObrigatorio.checked = false;

        try {
          showBottomBar("Pergunta editada com sucesso!");
        } catch (e) {}

        return;
      }

      var rows = tbody.querySelectorAll("tr");
      var backgroundColor = rows.length % 2 === 0 ? "" : "rgb(248, 248, 248)";

      var novaLinha = document.createElement("tr");
      if (backgroundColor) {
        novaLinha.style.backgroundColor = backgroundColor;
      }

      var tdPergunta = document.createElement("td");
      tdPergunta.setAttribute("data-th", "Nome");
      tdPergunta.textContent = perguntaTexto;

      if (checkboxObrigatorio.checked) {
        var spanObrigatorio = document.createElement("span");
        spanObrigatorio.className = "obrigatorio";
        spanObrigatorio.textContent = " *";
        tdPergunta.appendChild(spanObrigatorio);
      }

      var tdAcoes = document.createElement("td");
      tdAcoes.setAttribute("data-th", "Ações");
      tdAcoes.style.textAlign = "center";
      tdAcoes.innerHTML =
        '<a href="#" style="margin-right: 5px"><div class="action-icon edit"></div></a>' +
        '<a href="#" class="red"><div class="action-icon delete"></div></a>';

      novaLinha.appendChild(tdPergunta);
      novaLinha.appendChild(tdAcoes);

      tbody.appendChild(novaLinha);

      var countSpan = document.getElementById("total-perguntas");
      if (countSpan) {
        var newCount = tbody.querySelectorAll("tr").length;
        countSpan.textContent = "(" + newCount + ")";
      }

      formAdicionarPergunta.style.display = "none";
      btnAdicionarWrapper.style.display = "block";
      inputPergunta.value = "";
      checkboxObrigatorio.checked = false;
      try {
        showBottomBar("Pergunta criada com sucesso!");
      } catch (e) {}
    });
  }

  document.addEventListener("click", function (e) {
    var editIcon = e.target.closest(".action-icon.edit");
    if (!editIcon) return;
    e.preventDefault();

    var row = editIcon.closest("tr");
    if (!row) return;

    var tdPergunta = row.querySelector('td[data-th="Nome"]');
    if (!tdPergunta) return;

    var clone = tdPergunta.cloneNode(true);
    var spanReq = clone.querySelector(".obrigatorio");
    if (spanReq) spanReq.remove();
    var perguntaTexto = clone.textContent.trim();

    document.getElementById("input-pergunta").value = perguntaTexto;
    var obrig = !!tdPergunta.querySelector(".obrigatorio");
    document.getElementById("checkbox-obrigatorio").checked = obrig;

    editingRow = row;
    formAdicionarPergunta.style.display = "block";
    btnAdicionarWrapper.style.display = "none";
    if (btnConfirmarAdicionar) btnConfirmarAdicionar.textContent = "Alterar";
  });

  var rowToDelete = null;

  document.addEventListener("click", function (e) {
    var deleteIcon = e.target.closest(".action-icon.delete");
    if (deleteIcon) {
      e.preventDefault();

      rowToDelete = deleteIcon.closest("tr");

      if (rowToDelete) {
        var overlay = document.createElement("div");
        overlay.id = "simplemodal-overlay-delete";
        overlay.style.cssText =
          "position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.5); z-index: 1000;";
        document.body.appendChild(overlay);

        var wrapper = document.createElement("div");
        wrapper.id = "simplemodal-wrapper-delete";
        wrapper.style.cssText =
          "position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 1001;";

        var modalContainer = document.createElement("div");
        modalContainer.id = "osx-container";
        modalContainer.style.display = "block";

        var modalContent = document.getElementById("osx-modal-content-delete");

        if (modalContent) {
          var clonedContent = modalContent.cloneNode(true);
          clonedContent.style.display = "block";

          var modalData = clonedContent.querySelector("#osx-modal-data");
          if (modalData) {
            modalData.style.display = "block";
          }

          modalContainer.appendChild(clonedContent);
          wrapper.appendChild(modalContainer);
          document.body.appendChild(wrapper);
        }

        overlay.addEventListener("click", function () {
          overlay.remove();
          wrapper.remove();
          rowToDelete = null;
        });
      }
    }

    if (e.target && e.target.id === "btn-cancelar-delete") {
      e.preventDefault();
      var overlay = document.getElementById("simplemodal-overlay-delete");
      var wrapper = document.getElementById("simplemodal-wrapper-delete");
      if (overlay) overlay.remove();
      if (wrapper) wrapper.remove();
      rowToDelete = null;
    }

    if (e.target && e.target.id === "btn-confirmar-delete") {
      e.preventDefault();

      if (rowToDelete) {
        var tbody = rowToDelete.parentElement;
        rowToDelete.remove();

        var rows = tbody.querySelectorAll("tr");
        rows.forEach(function (tr, index) {
          tr.style.backgroundColor = index % 2 === 0 ? "" : "rgb(248, 248, 248)";
        });

        var countSpan = document.getElementById("total-perguntas");
        if (countSpan) {
          countSpan.textContent = "(" + rows.length + ")";
        }
      }

      var overlay = document.getElementById("simplemodal-overlay-delete");
      var wrapper = document.getElementById("simplemodal-wrapper-delete");
      if (overlay) overlay.remove();
      if (wrapper) wrapper.remove();
      rowToDelete = null;
    }
  });
});
