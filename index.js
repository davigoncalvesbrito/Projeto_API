// Realiza uma requisição para obter os dados dos filmes a partir da API
fetch('http://localhost:3000/filmes')
  .then(response => response.json()) // Converte a resposta em JSON
  .then(body => {
    const listaFilmes = document.getElementById('lista-filmes'); // Obtém a lista de filmes na página
    const categoriaSelect = document.getElementById('categoria'); // Obtém o seletor de categoria
    const pesquisaInput = document.getElementById('pesquisa'); // Obtém o campo de pesquisa

    // Event listener para mudança de categoria
    categoriaSelect.addEventListener('change', () => {
      const categoriaSelecionada = categoriaSelect.value; // Obtém a categoria selecionada
      const termoPesquisa = pesquisaInput.value.toLowerCase();
      listaFilmes.innerHTML = ''; // Limpa a lista de filmes para atualização
      const anoAtual = new Date().getFullYear(); // Obtém o ano atual

      // Função para classificar os filmes por título em ordem alfabetica
      const ordenarPorTitulo = (a, b) => {
        return a.titulo.localeCompare(b.titulo);
      };

      // Ordenar os filmes por título antes de processá-los
      body.sort(ordenarPorTitulo);

      body.forEach(filme => {
        // Verifica se o filme se encaixa nos critérios da categoria ou lançamento
        if ((categoriaSelecionada === 'Todos' || filme.genero === categoriaSelecionada) ||
          (categoriaSelecionada === 'Lancamentos' && anoAtual - filme.lancamento <= 1)) {
          if (filme.titulo.toLowerCase().includes(termoPesquisa)) { // Filtro por título
            // Cria um elemento de lista para exibir informações do filme
            const filmeItem = document.createElement('li');
            filmeItem.innerHTML = `  
              <h2>${filme.titulo}</h2>
              <img src="${filme.imagem}" alt="${filme.titulo}" class="filme-image" />
              <p><strong>Ano de Lançamento:</strong> ${filme.lancamento}</p>
              <p><strong>Gênero:</strong> ${filme.genero}</p>
              <p><strong>Descrição:</strong>${filme.descricao}</p>
              <a href="${filme.ondeAssistir}" target="_blank" class="assistir-link">
                <img src="./img/100213_windows_media_player_icon.png" class="netflix-icon">
              </a>
            `;
            // Adiciona o elemento de lista à lista de filmes na página
            listaFilmes.appendChild(filmeItem);
          }
        }
      });
    });

    // Event listener para pesquisa por título ao digitar no campo
    pesquisaInput.addEventListener('input', () => {
      categoriaSelect.dispatchEvent(new Event('change')); // Ativa o filtro de categoria com base na pesquisa
    });

    // Dispara o evento de mudança de categoria para preencher a lista inicialmente
    categoriaSelect.dispatchEvent(new Event('change'));

  })
  .catch(error => console.error(error, "SERVIDOR DA API NÃO RESPONDEU")); // Trata erros na requisição
  
  