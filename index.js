// Função para renderizar um filme na lista
function renderizar_filmes(filme, listaFilmes) {
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

// Função para filtrar e exibir os filmes com base nos critérios
function filtrar_exibir_filmes(body) {
  const listaFilmes = document.getElementById("lista-filmes");
  const categoriaSelect = document.getElementById("categoria");
  const pesquisaInput = document.getElementById("pesquisa");
  const anoAtual = new Date().getFullYear();

  // Event listener para mudança de categoria
  categoriaSelect.addEventListener("change", () => {
    const categoriaSelecionada = categoriaSelect.value;
    const termoPesquisa = pesquisaInput.value.toLowerCase();
    listaFilmes.innerHTML = ""; // Limpa a lista de filmes para atualização

    // Função para classificar os filmes por título em ordem alfabética
    const ordenarPorTitulo = (a, b) => {
      return a.titulo.localeCompare(b.titulo);
    };

    // Ordenar os filmes por título antes de processá-los
    body.sort(ordenarPorTitulo);

    body.forEach((filme) => {
      if (
        categoriaSelecionada === "Todos" ||
        filme.genero === categoriaSelecionada ||
        (categoriaSelecionada === "Lancamentos" &&
          anoAtual - filme.lancamento <= 1)
      ) {
        if (filme.titulo.toLowerCase().includes(termoPesquisa)) {
          // Filtro por título
          renderizar_filmes(filme, listaFilmes);
        }
      }
    });
  });

  // Event listener para pesquisa por título ao digitar no campo
  pesquisaInput.addEventListener("input", () => {
    categoriaSelect.dispatchEvent(new Event("change")); // Ativa o filtro de categoria com base na pesquisa
  });

  // Dispara o evento de mudança de categoria para preencher a lista inicialmente
  categoriaSelect.dispatchEvent(new Event("change"));
}

// Função para Realiza uma requisição e obter os dados dos filmes a partir da API
function requisicao_api() {
  fetch("http://localhost:3000/filmes")
    .then((response) => response.json()) // Converte a resposta em JSON
    .then((data) => {
      const body = data; // Os dados dos filmes

      // Extrair categorias únicas dos filmes
      const categorias = Array.from(new Set(data.map((filme) => filme.genero)));

      // Atualizar o seletor de categoria no HTML
      const categoriaSelect = document.getElementById("categoria");
      categoriaSelect.innerHTML = ""; // Limpa o seletor de categoria

      const todasOpcoes = document.createElement("option");
      todasOpcoes.value = "Todos";
      todasOpcoes.text = "Todos";
      categoriaSelect.appendChild(todasOpcoes);

      categorias.forEach((categoria) => {
        const option = document.createElement("option");
        option.value = categoria;
        option.text = categoria;
        categoriaSelect.appendChild(option);
      });

      filtrar_exibir_filmes(body);
    })
    .catch((error) => console.error(error, "SERVIDOR DA API NÃO RESPONDEU")); // Trata erros na requisição
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

