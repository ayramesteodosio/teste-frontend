function validarFormulario() {
  const rows = document.querySelectorAll(".formulario-dados .row");
  let todasRespondidas = true;

  rows.forEach(function (row, index) {
    const perguntaEl = row.querySelector("#pergunta-descricao");
    const texto = perguntaEl ? perguntaEl.textContent || "" : "";
    const obrigatoria = texto.indexOf("*") !== -1;

    const radios = row.querySelectorAll('input[type="radio"]');
    let respondida = false;
    for (let i = 0; i < radios.length; i++) {
      if (radios[i].checked) {
        respondida = true;
        break;
      }
    }

    const msgValidacao = document.getElementById("item-validacao-" + (index + 1));
    if (obrigatoria) {
      if (!respondida) {
        todasRespondidas = false;
        if (msgValidacao) msgValidacao.style.display = "block";
      } else {
        if (msgValidacao) msgValidacao.style.display = "none";
      }
    } else {
      if (msgValidacao) msgValidacao.style.display = "none";
    }
  });

  const comentario = document.getElementById("PesquisaAvaliacaoComentario");
  const comentarioValidacao = document.getElementById("comentario-validacao");

  if (comentario) {
    const comentarioTexto = comentario.value.trim();

    if (comentarioTexto === "") {
      if (comentarioValidacao) {
        comentarioValidacao.textContent = "Comentário não preenchido.";
        comentarioValidacao.style.display = "block";
      }
      comentario.focus();
      return false;
    } else if (comentarioTexto.length < 10) {
      if (comentarioValidacao) {
        comentarioValidacao.textContent = "Comentário deve ter no mínimo 10 caracteres.";
        comentarioValidacao.style.display = "block";
      }
      comentario.focus();
      return false;
    } else {
      if (comentarioValidacao) comentarioValidacao.style.display = "none";
    }
  }

  return todasRespondidas;
}

function mostrarToast(mensagem = "Pesquisa respondida!") {
  let container = document.getElementById("toast-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "toast-container";
    container.className = "toast-container";
    document.body.appendChild(container);
  }

  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerHTML = `
    <button class="toast-close-btn" onclick="this.parentElement.classList.add('hiding'); setTimeout(() => this.parentElement.remove(), 300)">
      <img src="/assets/icons/messageClose.svg" alt="Fechar" />
    </button>
    <img src="/assets/icons/FlashMes-success.svg" alt="Sucesso" class="toast-icon" />
    <div class="toast-content">
      <p class="toast-message">${mensagem}</p>
    </div>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    if (toast.parentElement) {
      toast.classList.add("hiding");
      setTimeout(() => {
        toast.remove();
      }, 300);
    }
  }, 3000);
}

function mostrarToastConfirm() {
  if (!validarFormulario()) return;

  mostrarToast("Pesquisa respondida!");

  const cards = Array.from(document.querySelectorAll(".container-avaliacao-apresentacao"));
  cards.forEach(function (el, idx) {
    if (idx !== 0) el.style.display = "none";
  });

  const btnOutside = document.querySelector(".button-outside-card");
  if (btnOutside) btnOutside.style.display = "none";

  if (cards.length) cards[0].scrollIntoView({ behavior: "smooth" });
}

function fecharToastConfirm() {
  const secaoFormulario = document.getElementById("secao-formulario");
  const secaoComentario = document.getElementById("secao-comentario");

  if (secaoFormulario) secaoFormulario.style.display = "none";
  if (secaoComentario) secaoComentario.style.display = "none";
}

document.addEventListener("DOMContentLoaded", function () {
  const rows = document.querySelectorAll(".formulario-dados .row");
  rows.forEach(function (row, index) {
    const radios = row.querySelectorAll('input[type="radio"]');
    const msgValidacao = document.getElementById("item-validacao-" + (index + 1));
    for (let i = 0; i < radios.length; i++) {
      radios[i].addEventListener("change", function () {
        const perguntaEl = row.querySelector("#pergunta-descricao");
        const texto = perguntaEl ? perguntaEl.textContent || "" : "";
        const obrigatoria = texto.indexOf("*") !== -1;
        if (obrigatoria && msgValidacao) msgValidacao.style.display = "none";
      });
    }
  });

  const comentario = document.getElementById("PesquisaAvaliacaoComentario");
  const comentarioValidacao = document.getElementById("comentario-validacao");

  if (comentario && comentarioValidacao) {
    comentario.addEventListener("input", function () {
      if (this.value.trim() !== "") {
        comentarioValidacao.style.display = "none";
      }
    });
  }
});
