"use strict";

let items                   = [];
const form                  = document.querySelector("#form");
const transactionsUl        = document.querySelector(".lista-transacoes");
const saldoAtualDisplay     = document.querySelector(".saldo-atual");
const receitasDisplay       = document.querySelector(".value-receita");
const despesasDisplay       = document.querySelector(".value-despesa");
const inputTransactionName  = document.querySelector("input[name='nome']");
const inputTransactionValue = document.querySelector("input[name='valorDigitado']");
const receitaCheck          = document.querySelector("input#receita");
const despesaCheck          = document.querySelector("input#despesa");

inputTransactionName.value  = "";
inputTransactionValue.value = "";

function removeTransaction(id) {
    items = items.filter(transaction => transaction.id !== id);
    init();
}

function addTransactionIntoDOM(transaction) {

    // VERIFICAÇÃO DO VALOR PARA O OPERADOR NA LI
    const operator    = transaction.amount < 0 ? "-" : "+";

    // VERIFICAÇÃO DO VALOR PARA ADICIONAR A CLASSE
    const verifyClass = transaction.amount < 0 ? "despesa" : "receita";

    // Math.abs() - EXCLUI O SINAL DE NÚMERO NEGATIVO, MAS MANTÉM O VALOR (NEGATIVO)
    const amountWithoutOperator = Math.abs(transaction.amount);

    const li = document.createElement("li");
    li.classList.add(verifyClass);
    li.innerHTML = `
        <p class="nome">${transaction.name}</p>
        <span class="valor">${operator} R$${amountWithoutOperator}</span>
        <button class="delete-btn" onClick="removeTransaction(${transaction.id})">X</button>
    `;

    // append() - Último filho do elemento / Decrescente
    // prepend() - Primeiro filho do elemento / Crescente
    transactionsUl.append(li);

}

function updateValues() {

    // MAP    - ITERA O ARRAY E RETORNA OUTRO COM A MESMA QUANTIDADE DE ITENS, SÓ QUE MODIFICADO
    // REDUCE - REDUZ O ARRAY A ALGUM TIPO DE DADO (Objeto, string, número ou outro array)
    // FILTER - FILTRA ITENS DO ARRAY E RETORNA-OS
    
    // OBTENDO OS VALORES DO AMOUNT
    const amounts   = items
        .map(transactionA => transactionA.amount);
    // OBTENDO A SOMA DOS VALORES NO AMOUNT
    // toFixed() / Insere ou limita os valores decimais de acordo com o parâmetro
    const total     = amounts
        .reduce((accumulator, number) => accumulator + number, 0).toFixed(2);

    const receitas  = amounts
        .filter(value => value > 0)
        .reduce((accumulator, number) => accumulator + number, 0)
        .toFixed(2);
    const despesas  = Math.abs(amounts
        .filter(value => value < 0)
        .reduce((accumulator, number) => accumulator + number, 0)
        .toFixed(2));

    // innerHTML / Para adicionar conteúdo com html
    // textContent / Para adicionar apenas textos
    saldoAtualDisplay.textContent = total;
    receitasDisplay.textContent   = receitas;
    despesasDisplay.textContent   = despesas;

}

function init() {

    transactionsUl.innerHTML = "";
    // for in - ITERA SOBRE AS PROPRIEDADES
    // for of - ITERA SOBRE OS VALORES
    // ITERA E APLICA A FUNÇÃO PARA CADA OBJETO
    items.forEach(addTransactionIntoDOM);
    // TAMBÉM FUNCIONA
    // for(let item of items) {
    //     addTransactionIntoDOM(item);
    // }
    updateValues();
    generateID();

}

const generateID = () => Math.round(Math.random() * 1000);

form.addEventListener("submit", (event) => {
    event.preventDefault();

    const transactionName  = inputTransactionName
        .value
        .trim();
    const transactionAmount = Number(inputTransactionValue
        .value
        .trim());

    // trim() / RETORNA O CÓDIGO SEM ESPAÇOS EM BRANCO
    if(transactionName === '' || transactionAmount === '') {
        alert("Por favor, preencha os campos.");
        return;
    }
    
    const itemsTransactions = {
        id: generateID(),
        name: transactionName,
        amount: transactionAmount
    };

    items.push(itemsTransactions);
    init();

    inputTransactionValue.value = "";
    inputTransactionName.value  = "";
    inputTransactionName.focus();
});

function clearInputValue() {
    inputTransactionValue.value = "";
};


inputTransactionValue.addEventListener("keydown", function() {
    if(despesaCheck.checked) {
        if(inputTransactionValue.value.length == 0) {
            inputTransactionValue.value += "-";
        }
    }
});
receitaCheck.addEventListener("click", clearInputValue);
despesaCheck.addEventListener("click", clearInputValue);