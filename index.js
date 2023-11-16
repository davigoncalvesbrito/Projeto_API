// Função para renderizar um filme na lista
// function renderizar_filmes(filme, listaFilmes) {
//   const filmeItem = document.createElement("li");
//   filmeItem.innerHTML = `  
//     <h2>${filme.titulo}</h2>
//     <img src="${filme.imagem}" alt="${filme.titulo}" class="filme-image" />
//     <p><strong>Lançamento:</strong> ${filme.lancamento}</p>
//     <p><strong>Gênero:</strong> ${filme.genero}</p>
//     <p><strong>Descrição:</strong> ${filme.descricao}</p>
//     <a href="${filme.ondeAssistir}" target="_blank" class="assistir-link">
//       <img src="./img/100213_windows_media_player_icon.png" class="player-icon">
//     </a>
//   `;
//   listaFilmes.appendChild(filmeItem);
// }

// Função para filtrar e exibir os filmes com base nos critérios
function filtrar_exibir_filmes(body) {
  const listaFilmes = document.getElementById("lista-filmes");
  const categoriaSelect = document.getElementById("categoriasDropdown");
  const pesquisaInput = document.getElementById("pesquisa");
  const anoAtual = new Date().getFullYear();

  function renderizar_filmes(filme) {
    const filmeItem = document.createElement("li");
    filmeItem.innerHTML = `  
      <h2>${filme.titulo}</h2>
      <img src="${filme.imagem}" alt="${filme.titulo}" class="filme-image" />
      <p><strong>Lançamento:</strong> ${filme.lancamento}</p>
      <p><strong>Gênero:</strong> ${filme.genero}</p>
      <p><strong>Descrição:</strong> ${filme.descricao}</p>
      <a href="${filme.ondeAssistir}" target="_blank" class="assistir-link">
        <img src="./img/100213_windows_media_player_icon.png" class="player-icon">
      </a>
    `;
    listaFilmes.appendChild(filmeItem);
  }

  // Função para mostrar todos os filmes
  function mostrarTodosFilmes() {
    listaFilmes.innerHTML = ""; // Limpa a lista de filmes para atualização

    // Ordena os filmes por título em ordem alfabética
    const filmesOrdenados = body.sort((a, b) => a.titulo.localeCompare(b.titulo));

    filmesOrdenados.forEach((filme) => renderizar_filmes(filme));
  }

  // Event listener para mudança de categoria
  categoriaSelect.addEventListener("click", (event) => {
    const categoriaSelecionada = event.target.textContent;
    const termoPesquisa = pesquisaInput.value.toLowerCase();

    listaFilmes.innerHTML = ""; // Limpa a lista de filmes para atualização

    // Filtra os filmes por categoria e pesquisa
    const filmesFiltrados = body.filter((filme) => {
      return (
        categoriaSelecionada === "Todos" ||
        (categoriaSelecionada === "Lançamentos" && anoAtual - filme.lancamento <= 1) ||
        filme.genero === categoriaSelecionada
      );
    });

    // Filtra os filmes por pesquisa adicional
    const filmesPesquisados = filmesFiltrados.filter((filme) => {
      return filme.titulo.toLowerCase().includes(termoPesquisa);
    });

    // Ordena os filmes filtrados por título em ordem alfabética
    const filmesOrdenados = filmesPesquisados.sort((a, b) => a.titulo.localeCompare(b.titulo));

    // Renderiza os filmes ordenados
    filmesOrdenados.forEach((filme) => renderizar_filmes(filme));
  });

  // Event listener para pesquisa por título ao digitar no campo
  pesquisaInput.addEventListener("input", () => {
    categoriaSelect.dispatchEvent(new Event("click")); // Ativa o filtro de categoria com base na pesquisa
  });

  // Ao carregar a página, mostra todos os filmes ordenados por título
  mostrarTodosFilmes();
}







// Função para Realiza uma requisição e obter os dados dos filmes a partir da API
function requisicao_api() {
  fetch("http://localhost:3000/filmes")
      .then((response) => response.json())
      .then((data) => {
        console.log(data); // Adicione esta linha
          const categoriasDropdown = document.getElementById("categoriasDropdown");
          categoriasDropdown.innerHTML = ""; // Limpa o dropdown de categorias

          // Adiciona a opção "Todos"
          const todasOpcoes = document.createElement("a");
          todasOpcoes.classList.add("dropdown-item");
          todasOpcoes.href = "#";
          todasOpcoes.textContent = "Todos";
          categoriasDropdown.appendChild(todasOpcoes);

          // Adiciona a opção "Lançamentos"
          const lancamentosOption = document.createElement("a");
          lancamentosOption.classList.add("dropdown-item");
          lancamentosOption.href = "#";
          lancamentosOption.textContent = "Lançamentos";
          categoriasDropdown.appendChild(lancamentosOption);

          // Filtra e Adiciona as categorias dinamicamente
          const categorias = Array.from(new Set(data.map((filme) => filme.genero)));
          categorias.forEach((categoria) => {
              const option = document.createElement("a");
              option.classList.add("dropdown-item");
              option.href = "#";
              option.textContent = categoria;
              categoriasDropdown.appendChild(option);
          });


          filtrar_exibir_filmes([...data]); // Usando o spread operator para criar uma cópia do array

          
      })
      .catch((error) => console.error(error, "SERVIDOR DA API NÃO RESPONDEU"));
}




requisicao_api();





// Função para exibir o formulário de login
function mostrarLogin() {
  const loginContainer = document.querySelector(".login-container");
  loginContainer.style.display = "block";
}

// Função para fechar o formulário de login
function fecharLogin() {
  const loginContainer = document.querySelector(".login-container");
  loginContainer.style.display = "none";
}


 // Função para realizar o cadastro
 function realizarCadastro() {
  const nome = document.getElementById('nome').value;
  const email = document.getElementById('email').value;
  const senha = document.getElementById('senha-cadastro').value;

  if (!nome || !email || !senha) {
    alert('Preencha todos os campos.');
    return;
  }

  // Envia uma requisição POST para o endpoint de cadastro de usuários
  fetch('http://localhost:3000/usuario', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ nome, email, senha }),
  })
    .then((response) => response.json())
    .then((data) => {
      alert('Cadastro realizado com sucesso!');
      fecharCadastro();
    })
    .catch((error) => {
      console.error('Erro durante o cadastro:', error);
      alert('Ocorreu um erro durante o cadastro. Tente novamente.');
    });
}

function realizarLogin() {
  const emailLogin = document.getElementById('email-login').value;
  const senhaLogin = document.getElementById('senha-login').value;

  // Envia as credenciais para a API
  fetch('http://localhost:3000/usuarios/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email: emailLogin, senha: senhaLogin }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.autenticado) {
        // Salva o token no Local Storage
        localStorage.setItem('token', data.token);

        // Exibe a seção de logout e oculta a seção de login
        exibirNomeUsuario(data.nome);
        document.getElementById('login-form').style.display = 'none';
        document.getElementById('logout-section').style.display = 'block';
      } else {
        alert('Credenciais inválidas. Tente novamente.');
      }
    })
    .catch((error) => {
      console.error('Erro durante o login:', error);
      alert('Ocorreu um erro durante o login. Tente novamente.');
    });
}





 function mostrarCadastro() {
  const loginForm = document.querySelector(".login-form");
  const cadastroForm = document.querySelector(".cadastro-form");

  loginForm.style.display = "none";
  cadastroForm.style.display = "block";
}



// Função para fechar o formulário de cadastro e exibir o formulário de login
function fecharCadastro() {
  const loginContainer = document.querySelector(".cadastro-form");
  loginContainer.style.display = "none";
  
}


document.getElementById('login-button').addEventListener('click', realizarLogin);


// Função para realizar logout
function realizarLogout() {
  // Remove o token do Local Storage
  localStorage.removeItem('token');

  // Oculta a seção de logout e exibe a seção de login
  document.getElementById('login-form').style.display = 'block';
  document.getElementById('logout-section').style.display = 'none';
}

// Função para exibir o nome do usuário
function exibirNomeUsuario(nome) {
  document.getElementById('nome-usuario').textContent = nome;
}


