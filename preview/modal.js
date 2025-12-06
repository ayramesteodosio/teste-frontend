function validarFormulario() {
  // Verificar se todas as perguntas foram respondidas
  const perguntas = [11638, 11639, 11640, 11641, 11650];
  let todasRespondidas = true;

  perguntas.forEach(function (pergunta, index) {
    const radios = document.getElementsByName("data[pergunta][" + pergunta + "][nota]");
    let respondida = false;

    for (let i = 0; i < radios.length; i++) {
      if (radios[i].checked) {
        respondida = true;
        break;
      }
    }

    const msgValidacao = document.getElementById("item-validacao-" + (index + 1));
    if (!respondida) {
      todasRespondidas = false;
      if (msgValidacao) {
        msgValidacao.style.display = "block";
      }
    } else {
      if (msgValidacao) {
        msgValidacao.style.display = "none";
      }
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
      if (comentarioValidacao) {
        comentarioValidacao.style.display = "none";
      }
    }
  }

  return todasRespondidas;
}

function mostrarToast(mensagem = "Pesquisa respondida!") {
  // Criar container se não existir
  let container = document.getElementById("toast-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "toast-container";
    container.className = "toast-container";
    document.body.appendChild(container);
  }

  // Criar toast
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerHTML = `
    <button class="toast-close-btn" onclick="this.parentElement.classList.add('hiding'); setTimeout(() => this.parentElement.remove(), 300)">
      <img src="assets/icons/messageClose.svg" alt="Fechar" />
    </button>
    <img src="assets/icons/FlashMes-success.svg" alt="Sucesso" class="toast-icon" />
    <div class="toast-content">
      <p class="toast-message">${mensagem}</p>
    </div>
  `;

  container.appendChild(toast);

  // Remover toast após 3 segundos
  setTimeout(() => {
    if (toast.parentElement) {
      toast.classList.add("hiding");
      setTimeout(() => {
        toast.remove();
      }, 300); // Tempo da animação
    }
  }, 3000);
}

function mostrarModal() {
  if (validarFormulario()) {
    // Mostrar toast
    mostrarToast("Pesquisa respondida!");

    // Ocultar seções do formulário
    const secaoFormulario = document.getElementById("secao-formulario");
    const secaoComentario = document.getElementById("secao-comentario");

    if (secaoFormulario) secaoFormulario.style.display = "none";
    if (secaoComentario) secaoComentario.style.display = "none";
  }
}

function fecharModal() {
  // Função mantida por compatibilidade
  const secaoFormulario = document.getElementById("secao-formulario");
  const secaoComentario = document.getElementById("secao-comentario");

  if (secaoFormulario) secaoFormulario.style.display = "none";
  if (secaoComentario) secaoComentario.style.display = "none";
}

// Adicionar listeners para ocultar mensagens de erro ao preencher
document.addEventListener("DOMContentLoaded", function () {
  // Listeners para as estrelas (perguntas)
  const perguntas = [11638, 11639, 11640, 11641, 11650];

  perguntas.forEach(function (pergunta, index) {
    const radios = document.getElementsByName("data[pergunta][" + pergunta + "][nota]");
    const msgValidacao = document.getElementById("item-validacao-" + (index + 1));

    for (let i = 0; i < radios.length; i++) {
      radios[i].addEventListener("change", function () {
        if (msgValidacao) {
          msgValidacao.style.display = "none";
        }
      });
    }
  });

  // Listener para o comentário
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
