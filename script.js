const balanco = document.getElementById("balanco");
const dinheiro_mais = document.getElementById("dinheiro-mais");
const dinheiro_menos = document.getElementById("dinheiro-menos");
const lista = document.getElementById("lista");
const formulario = document.getElementById("formulario");
const texto = document.getElementById("texto");
const quantidade = document.getElementById("quantidade");

/*
let transacoes = [
    { id: 1, texto: "Almoço", quantidade: -20 },
    { id: 2, texto: "Salário", quantidade: 1000 },
    { id: 3, texto: "Conta de Luz", quantidade: -70 },
    { id: 4, texto: "Internet", quantidade: -60 },
];
*/

const transacoesArmazemLocal = JSON.parse(localStorage.getItem("transacoes"));

let transacoes =
    localStorage.getItem("transacoes") !== null ? transacoesArmazemLocal : [];

// Adiciona transação pelo formulário
function adicionarTransacao(e) {
    e.preventDefault();

    if (
        texto.value.trim() === "" ||
        quantidade.value.trim() === "" ||
        isNaN(quantidade.value.trim())
    ) {
        alert("Por favor adicione um texto e uma quantidade válidos.");
    } else {
        const transacao = {
            id: gerarID(),
            texto: texto.value,
            quantidade: +quantidade.value,
        };

        transacoes.push(transacao);
        adicionarTransacaoDOM(transacao);

        atualizarValores();
        atualizarArmazemLocal();

        texto.value = "";
        quantidade.value = "";
    }
}

// Gera um ID aleatório
function gerarID() {
    return Math.floor(Math.random() * 1000000000);
}

// Adiciona transações ao DOM da lista
function adicionarTransacaoDOM(transacao) {
    // Define sinal
    const sinal = transacao.quantidade < 0 ? "-" : "+";
    const item = document.createElement("li");

    // Adiciona uma classe baseado no valor
    item.classList.add(transacao.quantidade < 0 ? "menos" : "mais");

    // Cria elemento
    item.innerHTML = `
        ${transacao.texto} <span>${sinal}${Math.abs(
        transacao.quantidade
    )}</span> <button class="botao-apagar" onclick="removerTransacao(${
        transacao.id
    })">x</button>
    `;

    // Adiciona à lista
    lista.appendChild(item);
}

function atualizarValores() {
    const quantidades = transacoes.map((transacao) => transacao.quantidade);

    const total = quantidades
        .reduce((soma, item) => (soma += item), 0)
        .toFixed(2);

    const ganhos = quantidades
        .filter((item) => item > 0)
        .reduce((soma, item) => (soma += item), 0)
        .toFixed(2);

    const despesas = (
        quantidades
            .filter((item) => item < 0)
            .reduce((soma, item) => (soma += item), 0) * -1
    ).toFixed(2);

    balanco.innerText = `${total}`;
    dinheiro_mais.innerText = `${ganhos}`;
    dinheiro_menos.innerText = `${despesas}`;
}

function removerTransacao(id) {
    transacoes = transacoes.filter((transacao) => transacao.id !== id);

    atualizarArmazemLocal();

    inicializar();
}

// Atualiza transações no armazém local
function atualizarArmazemLocal() {
    localStorage.setItem("transacoes", JSON.stringify(transacoes));
}

function inicializar() {
    lista.innerHTML = "";

    transacoes.forEach(adicionarTransacaoDOM);
    atualizarValores();
}

inicializar();

formulario.addEventListener("submit", adicionarTransacao);
