/**
 * Script Unificado - Integração de APIs (Itens 2 e 3)
 */

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // LOGICA DO ITEM 2: FORMULÁRIO DE CONVERSÃO
  // ==========================================
  const formConversao = document.getElementById('form-conversao');
  
  // Usamos um 'if' de segurança caso o script seja carregado em páginas onde o form não exista
  if (formConversao) {
    formConversao.addEventListener('submit', async (e) => {
      e.preventDefault();

      const moedaSelecionada = document.getElementById('moeda').value;
      const resultadoBox = document.getElementById('resultado-api');
      const respostaTexto = document.getElementById('resposta-texto');

      // Validação simples do formulário
      if (!moedaSelecionada) {
        alert("Por favor, selecione uma moeda válida.");
        return;
      }

      // Feedback visual de carregamento para o usuário
      respostaTexto.innerHTML = "🔄 Buscando cotação atualizada na API...";
      resultadoBox.classList.remove('hidden');

      try {
        // Faz a requisição enviando o dado do formulário na URL
        const response = await fetch(`https://economia.awesomeapi.com.br/last/${moedaSelecionada}-BRL`);
        
        if (!response.ok) throw new Error('Falha na resposta do servidor.');

        const dados = await response.json();
        
        // A API responde dinamicamente usando a chave ex: "USDBRL"
        const chave = `${moedaSelecionada}BRL`;
        const cotacao = dados[chave];

        // Formata o valor retornado pela API para nossa moeda local
        const valorFormatado = parseFloat(cotacao.bid).toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        });

        // Mostra a resposta detalhada e explicada para o usuário final
        respostaTexto.innerHTML = `
          <strong>Moeda:</strong> ${cotacao.name}<br>
          <strong>Valor comercial atual:</strong> ${valorFormatado}<br>
          <strong>Última atualização:</strong> ${new Date(cotacao.create_date).toLocaleString('pt-BR')}
        `;

      } catch (error) {
        respostaTexto.innerHTML = `⚠️ Ocorreu um erro ao consultar a API. Tente novamente mais tarde.`;
        console.error("Erro na requisição individual:", error);
      }
    });
  }

  // ==========================================
  // LOGICA DO ITEM 3: PAINEL COM PROMISE.ALL
  // ==========================================
  const btnCarregarPainel = document.getElementById('btn-carregar-painel');

  if (btnCarregarPainel) {
    btnCarregarPainel.addEventListener('click', async () => {
      const painel = document.getElementById('painel-cards');
      painel.innerHTML = "<p class='loading'>Carregando as 3 APIs simultaneamente...</p>";

      // URLs das 3 APIs distintas
      const apiDolar = "https://economia.awesomeapi.com.br/last/USD-BRL";
      const apiEuro = "https://economia.awesomeapi.com.br/last/EUR-BRL";
      const apiBitcoin = "https://economia.awesomeapi.com.br/last/BTC-BRL";

      try {
        // Dispara as 3 requisições em paralelo
        const [resDolar, resEuro, resBitcoin] = await Promise.all([
          fetch(apiDolar),
          fetch(apiEuro),
          fetch(apiBitcoin)
        ]);

        // Valida se todas as respostas retornaram status OK
        if (!resDolar.ok || !resEuro.ok || !resBitcoin.ok) {
          throw new Error("Uma ou mais APIs falharam ao responder.");
        }

        // Converte os 3 corpos de resposta para JSON em paralelo
        const [dadoDolar, dadoEuro, dadoBitcoin] = await Promise.all([
          resDolar.json(),
          resEuro.json(),
          resBitcoin.json()
        ]);

        // Limpa a mensagem de carregamento
        painel.innerHTML = "";

        // Correção de sintaxe: camelCase sem espaços
        const moedasTratadas = [
          { info: dadoDolar.USDBRL, classe: "card-dolar" },
          { info: dadoEuro.EURBRL, classe: "card-euro" },
          { info: dadoBitcoin.BTCBRL, classe: "card-bitcoin" }
        ];

        // Cria e estiliza os elementos dinamicamente
        moedasTratadas.forEach(item => {
          const card = document.createElement("div");
          card.className = `api-card ${item.classe}`;
          
          const valor = parseFloat(item.info.bid).toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
          });

          card.innerHTML = `
            <h3>📊 ${item.info.name}</h3>
            <p class="valor-destaque">${valor}</p>
            <span class="variacao">Variação: ${item.info.pctChange}%</span>
          `;
          
          painel.appendChild(card);
        });

      } catch (error) {
        painel.innerHTML = `<p class="erro-mensagem">⚠️ Erro técnico: Não foi possível processar as 3 promessas em paralelo. Detalhes no console.</p>`;
        console.error("Erro no Promise.all:", error);
      }
    });
  }
});