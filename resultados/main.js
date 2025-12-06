document.addEventListener("DOMContentLoaded", function () {
  // Dados da pesquisa (isso viria do backend/API)
  const surveyData = {
    date: "01/12/2025",
    sendTo: "Todos confirmados",
    responses: 120,
  };

  // Dados mockados das perguntas com respostas
  const questionsData = [
    {
      id: 1,
      question: "Como você avaliaria sua experiência geral no evento?",
      responses: [
        { label: "Excelente", value: 85, color: "#66BB33" },
        { label: "Bom", value: 10, color: "#C5C772" },
        { label: "Regular", value: 3, color: "#DFAD40" },
        { label: "Ruim", value: 1, color: "#E66699" },
        { label: "Péssimo", value: 1, color: "#FF2B34" },
      ],
    },
    {
      id: 2,
      question: "O conteúdo apresentado foi relevante para você?",
      responses: [
        { label: "Excelente", value: 45, color: "#66BB33" },
        { label: "Bom", value: 72, color: "#C5C772" },
        { label: "Regular", value: 15, color: "#DFAD40" },
        { label: "Ruim", value: 8, color: "#E66699" },
        { label: "Péssimo", value: 5, color: "#FF2B34" },
      ],
    },
    {
      id: 3,
      question: "A qualidade dos palestrantes foi satisfatória?",
      responses: [
        { label: "Excelente", value: 30, color: "#66BB33" },
        { label: "Bom", value: 25, color: "#C5C772" },
        { label: "Regular", value: 20, color: "#DFAD40" },
        { label: "Ruim", value: 45, color: "#E66699" },
        { label: "Péssimo", value: 15, color: "#FF2B34" },
      ],
    },
    {
      id: 4,
      question: "Como você avalia a organização do evento?",
      responses: [
        { label: "Excelente", value: 10, color: "#66BB33" },
        { label: "Bom", value: 15, color: "#C5C772" },
        { label: "Regular", value: 20, color: "#DFAD40" },
        { label: "Ruim", value: 30, color: "#E66699" },
        { label: "Péssimo", value: 25, color: "#FF2B34" },
      ],
    },
    {
      id: 5,
      question: "Você recomendaria este evento para outras pessoas?",
      responses: [
        { label: "Excelente", value: 1, color: "#66BB33" },
        { label: "Bom", value: 5, color: "#C5C772" },
        { label: "Regular", value: 3, color: "#DFAD40" },
        { label: "Ruim", value: 1, color: "#E66699" },
        { label: "Péssimo", value: 90, color: "#FF2B34" },
      ],
    },
  ];

  // Função para criar os itens do painel
  function createPanelItems(data) {
    const panelDetails = document.querySelector(".painel-info-details");
    if (!panelDetails) return;

    // Limpa o conteúdo existente
    panelDetails.innerHTML = "";

    // Cria item de Data
    const dateItem = document.createElement("div");
    dateItem.className = "info-item";
    dateItem.innerHTML = `
      <span class="label">Data:</span>
      <span class="value">${data.date}</span>
    `;
    panelDetails.appendChild(dateItem);

    // Cria item de Enviar para
    const sendToItem = document.createElement("div");
    sendToItem.className = "info-item";
    sendToItem.innerHTML = `
      <span class="label">Enviar pesquisa para:</span>
      <span class="value">${data.sendTo}</span>
    `;
    panelDetails.appendChild(sendToItem);

    // Cria item de Respostas
    const responsesItem = document.createElement("div");
    responsesItem.className = "info-item";
    responsesItem.innerHTML = `
      <span class="value" style="font-size: 14px">${data.responses} resposta${data.responses !== 1 ? "s" : ""}</span>
    `;
    panelDetails.appendChild(responsesItem);
  }

  // Função para determinar o nível baseado na porcentagem
  function getNivel(percentage) {
    if (percentage >= 80) return "excelente";
    if (percentage >= 60) return "bom";
    if (percentage >= 40) return "regular";
    if (percentage >= 20) return "ruim";
    return "pessimo";
  }

  // Função para obter o label do nível
  function getNivelLabel(nivel) {
    const labels = {
      excelente: "Excelente",
      bom: "Bom",
      regular: "Regular",
      ruim: "Ruim",
      pessimo: "Péssimo",
    };
    return labels[nivel];
  }

  // Função para renderizar os gráficos dinamicamente
  function renderGraphs() {
    const graficosContainer = document.getElementById("graficos_pesquisa");
    if (!graficosContainer) return;

    // Limpa o container
    graficosContainer.innerHTML = "";

    questionsData.forEach((questionData, index) => {
      // Calcula a resposta predominante
      const maxResponse = questionData.responses.reduce((max, resp) => (resp.value > max.value ? resp : max));
      const nivel = getNivel(maxResponse.value);
      const nivelLabel = getNivelLabel(nivel);

      // Calcula o total de respostas
      const totalResponses = questionData.responses.reduce((sum, resp) => sum + resp.value, 0);

      // Cria o painel
      const painelDiv = document.createElement("div");
      painelDiv.className = "painel-info-artigos graficos";

      painelDiv.innerHTML = `
        <div class="grafico-header">
          <div class="grafico-header-left">
            <span class="grafico-numero">${questionData.id}</span>
            <h2 class="grafico-titulo">${questionData.question}</h2>
          </div>
          <div class="grafico-header-right">
            <span class="grafico-porcentagem ${nivel}">${maxResponse.value}%</span>
            <span class="grafico-nivel ${nivel}">${nivelLabel}</span>
          </div>
        </div>
        <div class="grafico-content">
          <div class="grafico-barras">
            ${questionData.responses
              .map((resp) => {
                const count = Math.round((resp.value / 100) * totalResponses);
                const countStr = count < 10 ? String(count).padStart(2, "0") : String(count);
                return `
              <div class="barra-wrapper">
                <div class="barra-group">
                  <div class="barra-container">
                    <div class="barra" style="background-color: ${resp.color}; width: ${resp.value}%"></div>
                  </div>
                  <span class="barra-count">${resp.value}%</span>
                </div>
                <div class="legenda-item">
                  <span class="legenda-label">${resp.label}</span>
                  <span class="legenda-count">${countStr}</span>
                </div>
              </div>
            `;
              })
              .join("")}
          </div>
        </div>
      `;

      graficosContainer.appendChild(painelDiv);
    });
  }

  // Dados mockados dos comentários
  const commentsData = [
    { comment: "Evento muito bom, organização excelente!", participant: "João Silva" },
    { comment: "Gostei bastante do conteúdo apresentado.", participant: "Maria Santos" },
    { comment: "Poderia melhorar a organização do coffee break.", participant: "Pedro Oliveira" },
    { comment: "Os palestrantes foram muito didáticos e claros.", participant: "Ana Costa" },
    { comment: "Adorei a dinâmica das atividades práticas!", participant: "Carlos Mendes" },
    { comment: "Local do evento bem escolhido e acessível.", participant: "Fernanda Lima" },
    { comment: "Networking excelente, conheci vários profissionais da área.", participant: "Ricardo Alves" },
    { comment: "Material didático muito completo e bem estruturado.", participant: "Juliana Rocha" },
    { comment: "Horários foram bem organizados e respeitados.", participant: "Bruno Martins" },
    { comment: "Excelente custo-benefício do evento.", participant: "Paula Ferreira" },
  ];

  let currentPage = 1;
  const commentsPerPage = 4;

  function renderComments(page = 1) {
    const tbody = document.querySelector(".table-resp tbody");
    const totalComments = document.getElementById("total-comentarios");

    if (!tbody) return;

    totalComments.textContent = `(${commentsData.length})`;

    const startIndex = (page - 1) * commentsPerPage;
    const endIndex = startIndex + commentsPerPage;
    const pageComments = commentsData.slice(startIndex, endIndex);

    tbody.innerHTML = "";

    pageComments.forEach((item, index) => {
      const row = document.createElement("tr");
      if (index % 2 !== 0) {
        row.style.backgroundColor = "rgb(248, 248, 248)";
      }
      row.innerHTML = `
        <td data-th="Comentário">${item.comment}</td>
        <td data-th="Participante" style="text-align: left">${item.participant}</td>
      `;
      tbody.appendChild(row);
    });

    renderPagination(page);
  }

  function renderPagination(currentPage) {
    const paginationDiv = document.querySelector(".pagination");
    const pagingDiv = document.querySelector(".paging");

    if (!paginationDiv || !pagingDiv) return;

    const totalPages = Math.ceil(commentsData.length / commentsPerPage);

    if (commentsData.length <= commentsPerPage) {
      paginationDiv.style.display = "none";
      return;
    }

    paginationDiv.style.display = "flex";
    pagingDiv.innerHTML = "";

    if (currentPage > 1) {
      const prevLink = document.createElement("a");
      prevLink.href = "#";
      prevLink.className = "prev";
      prevLink.title = "Anterior";
      prevLink.addEventListener("click", (e) => {
        e.preventDefault();
        renderComments(currentPage - 1);
      });
      pagingDiv.appendChild(prevLink);
    }

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        if (i === currentPage) {
          const currentSpan = document.createElement("span");
          currentSpan.className = "current";
          currentSpan.textContent = i;
          pagingDiv.appendChild(currentSpan);
        } else {
          const pageLink = document.createElement("a");
          pageLink.href = "#";
          pageLink.textContent = i;
          pageLink.title = `Página ${i}`;
          pageLink.addEventListener("click", (e) => {
            e.preventDefault();
            renderComments(i);
          });
          pagingDiv.appendChild(pageLink);
        }
      }
    } else {
      if (currentPage <= 5) {
        for (let i = currentPage; i <= currentPage + 1; i++) {
          if (i === currentPage) {
            const currentSpan = document.createElement("span");
            currentSpan.className = "current";
            currentSpan.textContent = i;
            pagingDiv.appendChild(currentSpan);
          } else {
            const pageLink = document.createElement("a");
            pageLink.href = "#";
            pageLink.textContent = i;
            pageLink.title = `Página ${i}`;
            pageLink.addEventListener("click", (e) => {
              e.preventDefault();
              renderComments(i);
            });
            pagingDiv.appendChild(pageLink);
          }
        }

        const dots = document.createElement("span");
        dots.className = "pagination-dots";
        dots.textContent = "...";
        pagingDiv.appendChild(dots);

        for (let i = totalPages - 1; i <= totalPages; i++) {
          const pageLink = document.createElement("a");
          pageLink.href = "#";
          pageLink.textContent = i;
          pageLink.title = `Página ${i}`;
          pageLink.addEventListener("click", (e) => {
            e.preventDefault();
            renderComments(i);
          });
          pagingDiv.appendChild(pageLink);
        }
      } else {
        for (let i = 6; i <= totalPages; i++) {
          if (i === currentPage) {
            const currentSpan = document.createElement("span");
            currentSpan.className = "current";
            currentSpan.textContent = i;
            pagingDiv.appendChild(currentSpan);
          } else {
            const pageLink = document.createElement("a");
            pageLink.href = "#";
            pageLink.textContent = i;
            pageLink.title = `Página ${i}`;
            pageLink.addEventListener("click", (e) => {
              e.preventDefault();
              renderComments(i);
            });
            pagingDiv.appendChild(pageLink);
          }
        }
      }
    }
    if (currentPage < totalPages) {
      const nextLink = document.createElement("a");
      nextLink.href = "#";
      nextLink.className = "next";
      nextLink.title = "Próxima";
      nextLink.addEventListener("click", (e) => {
        e.preventDefault();
        renderComments(currentPage + 1);
      });
      pagingDiv.appendChild(nextLink);
    }
  }

  // Inicializa o painel
  createPanelItems(surveyData);

  // Renderiza os gráficos
  renderGraphs();

  // Renderiza comentários
  renderComments(1);
});
