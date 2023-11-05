// Função para renderizar um filme na lista
function renderizarFilme(filme, listaFilmes) {
  const filmeItem = document.createElement('li');
  filmeItem.innerHTML = `  
    <h2>${filme.titulo}</h2>
    <img src="${filme.imagem}" alt="${filme.titulo}" class="filme-image" />
    <p><strong>Ano de Lançamento:</strong> ${filme.lancamento}</p>
    <p><strong>Gênero:</strong> ${filme.genero}</p>
    <p><strong>Descrição:</strong> ${filme.descricao}</p>
    <a href="${filme.ondeAssistir}" target="_blank" class="assistir-link">
      <img src="./img/100213_windows_media_player_icon.png" class="netflix-icon">
    </a>
  `;
  listaFilmes.appendChild(filmeItem);
}

// Função para filtrar e exibir os filmes com base nos critérios
function filtrarEExibirFilmes(body) {
  const listaFilmes = document.getElementById('lista-filmes');
  const categoriaSelect = document.getElementById('categoria');
  const pesquisaInput = document.getElementById('pesquisa');
  const anoAtual = new Date().getFullYear();

  // Event listener para mudança de categoria
  categoriaSelect.addEventListener('change', () => {
    const categoriaSelecionada = categoriaSelect.value;
    const termoPesquisa = pesquisaInput.value.toLowerCase();
    listaFilmes.innerHTML = ''; // Limpa a lista de filmes para atualização

    // Função para classificar os filmes por título em ordem alfabética
    const ordenarPorTitulo = (a, b) => {
      return a.titulo.localeCompare(b.titulo);
    };

    // Ordenar os filmes por título antes de processá-los
    body.sort(ordenarPorTitulo);

    body.forEach(filme => {
      if ((categoriaSelecionada === 'Todos' || filme.genero === categoriaSelecionada) ||
          (categoriaSelecionada === 'Lancamentos' && anoAtual - filme.lancamento <= 1)) {
        if (filme.titulo.toLowerCase().includes(termoPesquisa)) { // Filtro por título
          renderizarFilme(filme, listaFilmes);
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
}

// Realiza uma requisição para obter os dados dos filmes a partir da API
fetch('http://localhost:3000/filmes')
  .then(response => response.json()) // Converte a resposta em JSON
  .then(body => {
    filtrarEExibirFilmes(body);
  })
  .catch(error => console.error(error, "SERVIDOR DA API NÃO RESPONDEU")); // Trata erros na requisição
