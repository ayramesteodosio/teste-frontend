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

  // Abrir modal ao clicar em "Enviar pesquisa"
  var btnEnviarPesquisa = document.getElementById("btn-enviar-pesquisa");
  if (btnEnviarPesquisa) {
    btnEnviarPesquisa.addEventListener("click", function (e) {
      // Ignore clicks if the button was previously disabled
      if (this.classList && this.classList.contains("link_desabilitado")) {
        e.preventDefault();
        return;
      }

      e.preventDefault();

      // Criar overlay
      var overlay = document.createElement("div");
      overlay.id = "simplemodal-overlay";
      overlay.style.cssText =
        "position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.5); z-index: 1000;";
      document.body.appendChild(overlay);

      // Criar wrapper centralizado
      var wrapper = document.createElement("div");
      wrapper.id = "simplemodal-wrapper";
      wrapper.style.cssText = "position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 1001;";

      // Criar container do modal
      var modalContainer = document.createElement("div");
      modalContainer.id = "osx-container";
      modalContainer.style.display = "block";

      var modalContent = document.getElementById("osx-modal-content");

      if (modalContent) {
        var clonedContent = modalContent.cloneNode(true);
        clonedContent.style.display = "block";

        // Garantir que o conteúdo interno também fique visível
        var modalData = clonedContent.querySelector("#osx-modal-data");
        if (modalData) {
          modalData.style.display = "block";
        }

        modalContainer.appendChild(clonedContent);
        wrapper.appendChild(modalContainer);
        document.body.appendChild(wrapper);
      }

      // Fechar ao clicar no overlay
      overlay.addEventListener("click", function () {
        overlay.remove();
        wrapper.remove();
      });
    });
  }

  // Fechar modal ao clicar em Cancelar
  document.addEventListener("click", function (e) {
    if (e.target && e.target.id === "apenas-liberar") {
      e.preventDefault();
      var overlay = document.getElementById("simplemodal-overlay");
      var wrapper = document.getElementById("simplemodal-wrapper");
      if (overlay) overlay.remove();
      if (wrapper) wrapper.remove();
    }

    // Simular envio da pesquisa
    if (e.target && e.target.id === "liberar-e-enviar") {
      e.preventDefault();

      // Fechar modal
      var overlay = document.getElementById("simplemodal-overlay");
      var wrapper = document.getElementById("simplemodal-wrapper");
      if (overlay) overlay.remove();
      if (wrapper) wrapper.remove();

      // Desabilitar botão de enviar pesquisa
      var btnEnviarPesquisa = document.getElementById("btn-enviar-pesquisa");
      if (btnEnviarPesquisa) {
        btnEnviarPesquisa.classList.add("link_desabilitado");
        btnEnviarPesquisa.removeAttribute("href");
        btnEnviarPesquisa.style.cursor = "not-allowed";

        // Criar wrapper para tooltip
        var wrapperDiv = document.createElement("div");
        wrapperDiv.style.display = "inline-block";
        wrapperDiv.setAttribute("data-toggle", "tooltip");
        wrapperDiv.setAttribute("data-original-title", "Pesquisa já enviada");

        // Substituir botão por wrapper
        btnEnviarPesquisa.parentNode.insertBefore(wrapperDiv, btnEnviarPesquisa);
        wrapperDiv.appendChild(btnEnviarPesquisa);

        // Adicionar tooltip ao wrapper
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

  // Controle do formulário de adicionar pergunta
  var btnAdicionarPergunta = document.getElementById("btn-adicionar-pergunta");
  var btnCancelarPergunta = document.getElementById("btn-cancelar-pergunta");
  var formAdicionarPergunta = document.getElementById("form-adicionar-pergunta");
  var btnAdicionarWrapper = document.getElementById("btn-adicionar-wrapper");
  var editingRow = null; // referência à linha que está sendo editada (se houver)

  if (btnAdicionarPergunta) {
    btnAdicionarPergunta.addEventListener("click", function () {
      btnAdicionarWrapper.style.display = "none";
      formAdicionarPergunta.style.display = "block";
    });
  }

  if (btnCancelarPergunta) {
    btnCancelarPergunta.addEventListener("click", function () {
      formAdicionarPergunta.style.display = "none";
      btnAdicionarWrapper.style.display = "block";
      // Limpar campos
      document.getElementById("input-pergunta").value = "";
      document.getElementById("checkbox-obrigatorio").checked = false;
      // cancelar modo edição, se houver
      editingRow = null;
      if (btnConfirmarAdicionar) btnConfirmarAdicionar.textContent = "Adicionar";
    });
  }

  // Adicionar pergunta à lista
  var btnConfirmarAdicionar = document.getElementById("btn-confirmar-adicionar");
  if (btnConfirmarAdicionar) {
    btnConfirmarAdicionar.addEventListener("click", function () {
      var inputPergunta = document.getElementById("input-pergunta");
      var checkboxObrigatorio = document.getElementById("checkbox-obrigatorio");
      var perguntaTexto = inputPergunta.value.trim();

      if (!perguntaTexto) {
        alert("Por favor, digite uma pergunta.");
        return;
      }

      // Obter tbody da tabela
      var tbody = document.querySelector(".table-resp tbody");
      if (!tbody) return;

      // Se estivermos editando uma linha existente, atualize-a
      if (editingRow) {
        var tdPergunta = editingRow.querySelector('td[data-th="Nome"]');
        // Limpa o conteúdo e adiciona o novo texto
        tdPergunta.textContent = perguntaTexto;
        if (checkboxObrigatorio.checked) {
          var spanObrigatorio = document.createElement("span");
          spanObrigatorio.className = "obrigatorio";
          spanObrigatorio.textContent = " *";
          tdPergunta.appendChild(spanObrigatorio);
        }

        // Resetar estado de edição
        editingRow = null;
        btnConfirmarAdicionar.textContent = "Adicionar";

        // Fechar formulário e limpar
        formAdicionarPergunta.style.display = "none";
        btnAdicionarWrapper.style.display = "block";
        inputPergunta.value = "";
        checkboxObrigatorio.checked = false;

        return;
      }

      // Caso contrário, criar nova linha (modo adicionar)
      var rows = tbody.querySelectorAll("tr");
      var backgroundColor = rows.length % 2 === 0 ? "" : "rgb(248, 248, 248)";

      // Criar nova linha
      var novaLinha = document.createElement("tr");
      if (backgroundColor) {
        novaLinha.style.backgroundColor = backgroundColor;
      }

      // Criar célula da pergunta
      var tdPergunta = document.createElement("td");
      tdPergunta.setAttribute("data-th", "Nome");
      tdPergunta.textContent = perguntaTexto;

      // Adicionar asterisco se obrigatória
      if (checkboxObrigatorio.checked) {
        var spanObrigatorio = document.createElement("span");
        spanObrigatorio.className = "obrigatorio";
        spanObrigatorio.textContent = " *";
        tdPergunta.appendChild(spanObrigatorio);
      }

      // Criar célula de ações
      var tdAcoes = document.createElement("td");
      tdAcoes.setAttribute("data-th", "Ações");
      tdAcoes.style.textAlign = "center";
      tdAcoes.innerHTML =
        '<a href="#" style="margin-right: 5px"><div class="action-icon edit"></div></a>' +
        '<a href="#" class="red"><div class="action-icon delete"></div></a>';

      // Adicionar células à linha
      novaLinha.appendChild(tdPergunta);
      novaLinha.appendChild(tdAcoes);

      // Adicionar linha à tabela
      tbody.appendChild(novaLinha);

      // Atualizar contador
      var countSpan = document.getElementById("total-perguntas");
      if (countSpan) {
        var newCount = tbody.querySelectorAll("tr").length;
        countSpan.textContent = "(" + newCount + ")";
      }

      // Resetar formulário
      formAdicionarPergunta.style.display = "none";
      btnAdicionarWrapper.style.display = "block";
      inputPergunta.value = "";
      checkboxObrigatorio.checked = false;
    });
  }

  // Abrir formulário para edição quando clicarem no ícone de editar na tabela
  document.addEventListener("click", function (e) {
    var editIcon = e.target.closest(".action-icon.edit");
    if (!editIcon) return;
    e.preventDefault();

    var row = editIcon.closest("tr");
    if (!row) return;

    var tdPergunta = row.querySelector('td[data-th="Nome"]');
    if (!tdPergunta) return;

    // Clonar o texto da pergunta sem o span obrigatorio
    var clone = tdPergunta.cloneNode(true);
    var spanReq = clone.querySelector(".obrigatorio");
    if (spanReq) spanReq.remove();
    var perguntaTexto = clone.textContent.trim();

    // Preencher o formulário
    document.getElementById("input-pergunta").value = perguntaTexto;
    var obrig = !!tdPergunta.querySelector(".obrigatorio");
    document.getElementById("checkbox-obrigatorio").checked = obrig;

    // Entrar em modo edição
    editingRow = row;
    formAdicionarPergunta.style.display = "block";
    btnAdicionarWrapper.style.display = "none";
    if (btnConfirmarAdicionar) btnConfirmarAdicionar.textContent = "Alterar";
  });

  // Deletar pergunta
  var rowToDelete = null;

  document.addEventListener("click", function (e) {
    // Verificar se clicou no ícone de deletar ou no link pai
    var deleteIcon = e.target.closest(".action-icon.delete");
    if (deleteIcon) {
      e.preventDefault();

      // Encontrar a linha (tr) mais próxima
      rowToDelete = deleteIcon.closest("tr");

      if (rowToDelete) {
        // Criar overlay
        var overlay = document.createElement("div");
        overlay.id = "simplemodal-overlay-delete";
        overlay.style.cssText =
          "position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.5); z-index: 1000;";
        document.body.appendChild(overlay);

        // Criar wrapper centralizado
        var wrapper = document.createElement("div");
        wrapper.id = "simplemodal-wrapper-delete";
        wrapper.style.cssText =
          "position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 1001;";

        // Criar container do modal
        var modalContainer = document.createElement("div");
        modalContainer.id = "osx-container";
        modalContainer.style.display = "block";

        var modalContent = document.getElementById("osx-modal-content-delete");

        if (modalContent) {
          var clonedContent = modalContent.cloneNode(true);
          clonedContent.style.display = "block";

          // Garantir que o conteúdo interno também fique visível
          var modalData = clonedContent.querySelector("#osx-modal-data");
          if (modalData) {
            modalData.style.display = "block";
          }

          modalContainer.appendChild(clonedContent);
          wrapper.appendChild(modalContainer);
          document.body.appendChild(wrapper);
        }

        // Fechar ao clicar no overlay
        overlay.addEventListener("click", function () {
          overlay.remove();
          wrapper.remove();
          rowToDelete = null;
        });
      }
    }

    // Cancelar delete
    if (e.target && e.target.id === "btn-cancelar-delete") {
      e.preventDefault();
      var overlay = document.getElementById("simplemodal-overlay-delete");
      var wrapper = document.getElementById("simplemodal-wrapper-delete");
      if (overlay) overlay.remove();
      if (wrapper) wrapper.remove();
      rowToDelete = null;
    }

    // Confirmar delete
    if (e.target && e.target.id === "btn-confirmar-delete") {
      e.preventDefault();

      if (rowToDelete) {
        var tbody = rowToDelete.parentElement;
        rowToDelete.remove();

        // Atualizar cores alternadas
        var rows = tbody.querySelectorAll("tr");
        rows.forEach(function (tr, index) {
          tr.style.backgroundColor = index % 2 === 0 ? "" : "rgb(248, 248, 248)";
        });

        // Atualizar contador
        var countSpan = document.getElementById("total-perguntas");
        if (countSpan) {
          countSpan.textContent = "(" + rows.length + ")";
        }
      }

      // Fechar modal
      var overlay = document.getElementById("simplemodal-overlay-delete");
      var wrapper = document.getElementById("simplemodal-wrapper-delete");
      if (overlay) overlay.remove();
      if (wrapper) wrapper.remove();
      rowToDelete = null;
    }
  });
});
