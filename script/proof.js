// Estender HTMLElement transforma uma classe em um 'ser' dentro do navegador
class MyProva extends HTMLElement {

  constructor() {
    // Chamamos o Construtor do HTMLElement
    super();
    /**
     * SHADOW DOM
     * - Criamos uma uma árvore DOM encapsulada e isolada dentro do JS
     * - de tal modo a evitar que o CSS Externo entre aqui e que o CSS Interno
     * - não vaze para forma 
     */
    this._shadow = this.attachShadow({ mode: "open" }); // mode: "open" --> Aqui permitimos que o JS externo acesse o shadowRoot se necessário

    this.questoes = [];
  }

  // Executa automaticamente quando o <my-prova> entra no HTML
  async connectedCallback() {
    try {
      // Faz a requisição para o Arquivo JSON
      const resposta = await fetch("../script/questions.json");

      if (!resposta.ok) {
        throw new Error(`Erro ao Carregar Questões: ${resposta.status}`);
      }

      // Alimentando a Variável global do componente com os dados recebidos
      this.questoes = await resposta.json();

      // Com os dados em mãos...
      // basta renderizar a prova
      this._render();
    } catch (error) {
      console.error("Não foi Possível Iniciar a Prova:", error);
      this._shadow.innerHTML = `<div style="padding: 2rem; color: #b03a2e; font-family: sans-serif;">
        ⚠️ Erro ao carregar as questões da prova. Por favor, tente novamente mais tarde.
      </div>`;
    }
  }

  /* ── Monta a prova Através do Web Components── */
  _render() {
    const s = this._shadow; // Inicializamos o Shadow DOM
    s.innerHTML = ""; // "Reset" do Componente --> Evitar Duplicatas ao Reiniciar

    /* Estilos */
    // Injetamos o CSS como uma String dentro de uma TAG <style> criada através do DOM
    const style = document.createElement("style");
    style.textContent = `
      :host { display: block; font-family: 'Poppins', sans-serif; }
      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

      .card {
        background: #fff;
        border: 1px solid #0a0a0a;
        border-top: none;
        border-bottom-left-radius: 12px;
        border-bottom-right-radius: 12px;
        padding: 2rem;
      }

      /* Questão */
      .questao {
        margin-bottom: 2rem;
        padding-bottom: 2rem;
        border-bottom: 1px dashed #e2e8f0;
      }
      .questao:last-of-type { border-bottom: none; }

      fieldset { border: none; padding: 0; }

      legend {
        font-weight: 600;
        font-size: .97rem;
        color: #1a1a2e;
        line-height: 1.55;
        margin-bottom: .85rem;
      }

      /* Alternativas */
      .alternativas { display: flex; flex-direction: column; gap: .5rem; }

      .alt-label {
        display: flex;
        align-items: center;
        gap: .75rem;
        padding: .75rem 1rem;
        border: 2px solid #e2e8f0;
        border-radius: 9px;
        cursor: pointer;
        font-size: .92rem;
        transition: border-color .18s, background .18s;
        user-select: none;
      }
      .alt-label:hover { border-color: #0867d4; background: #eff6ff; }
      .alt-label:has(input:checked) { border-color: #0867d4; background: #eff6ff; font-weight: 500; }

      input[type="radio"] {
        appearance: none;
        -webkit-appearance: none;
        width: 1.1rem;
        height: 1.1rem;
        min-width: 1.1rem;
        border: 2px solid #aaa;
        border-radius: 50%;
        position: relative;
        transition: border-color .18s;
      }
      input[type="radio"]::after {
        content: '';
        position: absolute;
        top: 50%; left: 50%;
        transform: translate(-50%, -50%) scale(0);
        width: .5rem; height: .5rem;
        background: #0867d4;
        border-radius: 50%;
        transition: transform .18s;
      }
      input[type="radio"]:checked { border-color: #0867d4; }
      input[type="radio"]:checked::after { transform: translate(-50%, -50%) scale(1); }

      /* Pós-correção */
      .alt-label.disabled { pointer-events: none; cursor: default; }
      .alt-label.correta { border-color: #22c55e !important; background: #f0fdf4 !important; }
      .alt-label.errada  { border-color: #b03a2e !important; background: #fef2f2 !important; }
      .alt-label.correta input[type="radio"] { border-color: #22c55e; }
      .alt-label.errada  input[type="radio"] { border-color: #b03a2e; }
      .alt-label.correta input[type="radio"]::after { background: #22c55e; transform: translate(-50%,-50%) scale(1); }
      .alt-label.errada  input[type="radio"]::after { background: #b03a2e; transform: translate(-50%,-50%) scale(1); }

      .badge {
        margin-left: auto;
        font-size: .78rem;
        font-weight: 700;
        padding: .2rem .6rem;
        border-radius: 99px;
        flex-shrink: 0;
      }
      .badge-correta { background: #dcfce7; color: #166534; }
      .badge-errada  { background: #fee2e2; color: #991b1b; }

      /* Aviso */
      .aviso {
        display: none;
        background: #fffbeb;
        border: 1.5px solid #f59e0b;
        border-radius: 8px;
        padding: .75rem 1rem;
        font-size: .85rem;
        color: #92400e;
        margin-bottom: 1rem;
      }
      .aviso.visivel { display: block; }

      /* Resultado */
      .resultado {
        display: none;
        text-align: center;
        padding: 1.2rem;
        border-radius: 10px;
        font-size: 1rem;
        font-weight: 600;
        margin-bottom: 1.5rem;
        animation: fade .3s ease;
      }
      .resultado.visivel  { display: block; }
      .resultado.aprovado  { background: #f0fdf4; border: 2px solid #22c55e; color: #166534; }
      .resultado.reprovado { background: #fef2f2; border: 2px solid #b03a2e; color: #991b1b; }

      @keyframes fade {
        from { opacity: 0; transform: translateY(-6px); }
        to   { opacity: 1; transform: translateY(0); }
      }

      /* Botões */
      .btn-wrap {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: .75rem;
        margin-top: 2rem;
      }

      button {
        padding: .8rem 2rem;
        border: none;
        border-radius: 50px;
        font-family: 'Poppins', sans-serif;
        font-size: .95rem;
        font-weight: 600;
        cursor: pointer;
        transition: transform .15s, box-shadow .15s;
      }
      button:hover  { transform: translateY(-2px); }
      button:active { transform: translateY(0); }

      .btn-corrigir {
        background: #0867d4;
        color: #fff;
        box-shadow: 0 4px 14px rgba(8,103,212,.30);
      }
      .btn-reiniciar {
        background: transparent;
        color: #0867d4;
        border: 2px solid #0867d4;
      }
      .btn-novamente {
        background: #1a1a2e;
        color: #fff;
        box-shadow: 0 4px 14px rgba(26,26,46,.25);
      }

      @media (max-width: 540px) {
        .card { padding: 1.25rem; }
        button { padding: .75rem 1.4rem; font-size: .88rem; }
      }
    `;
    s.appendChild(style); // Adicionando <style> ao nosso HTML

    /* Card */
    // Card para armazenar as Questões da Prova
    const card = document.createElement("div");
    card.className = "card";

    /* Formulário */
    // Aqui é onde fica o Container Principal da Prova
    const form = document.createElement("form");
    form.setAttribute("novalidate", ""); // Atributo "novalidate" impede validação padrão do navegador
    form.setAttribute("aria-label", "Formulário da prova");

    /* Questões */
    /**
     * LOOP DE QUESTÕES
     * - Mudança: Agora usamos 'this.questoes' (dados vindos do fetch)
     * - q = objeto da questão
     * - qi = índice da questão
     */

    // Validação de Segurança: Se o fetch falhar ou ainda não tiver terminado,
    // impede que o loop rode sobre um array vazio ou indefinido.
    if (!this.questoes || this.questoes.length === 0) {
      const semQuestoes = document.createElement("p");
      semQuestoes.textContent = "Carregando questões ou nenhuma questão encontrada...";
      semQuestoes.style.textAlign = "center";
      form.appendChild(semQuestoes);
      return; // Early return para parar a renderização aqui
    }

    this.questoes.forEach((q, qi) => {
      // 1. Cria uma 'section' da questão para estilização e separação
      const section = document.createElement("section");
      section.className = "questao";

      // 2. Cria um legend que atua como o "titulo" do conjunto de campos (fieldset)
      const fieldset = document.createElement("fieldset");
      const legend = document.createElement("legend");
      legend.textContent = (qi + 1) + ". " + q.enunciado; // qi + 1 ajusta o índice 0 --> Acessibilidade
      fieldset.appendChild(legend);

      // 3. Container das Alternativas --> Ideal para o uso do Flexbox/Grid do CSS 
      const alts = document.createElement("div");
      alts.className = "alternativas";

      /**
       * LOOP DE ALTERNATIVAS
       * - alt = array de alternativa
       * - ai = índice da alternativa
       */
      q.alternativas.forEach((alt, ai) => {
        const label = document.createElement("label");
        label.className = "alt-label";
        // Vinculamos o clique do label do input correspondente
        label.htmlFor = "q" + qi + "_a" + ai;

        // Define o 'grupo' do radio (um grupo por questão)
        const input = document.createElement("input");
        input.type = "radio";
        input.name = "questao_" + qi;
        input.id = "q" + qi + "_a" + ai;
        // Retorna o valor que será resgatado na correção como uma String
        input.value = String(ai);

        const span = document.createElement("span");
        span.textContent = alt;

        // Montagem da Opção
        // radio --> texto
        label.appendChild(input);
        label.appendChild(span);
        // adiciona o label dentro da div alts
        alts.appendChild(label);
      });

      // 6. Fechamento 
      // Coloca as alternativas no fieldset, o fieldset na section e a section no form.
      fieldset.appendChild(alts);
      section.appendChild(fieldset);
      form.appendChild(section);
    });

    /* Aviso */
    // Contaneir que exibirá um aviso
    // caso o usuário não tenha respondido todas as questões
    const aviso = document.createElement("div");
    aviso.id = "aviso";
    aviso.className = "aviso";
    /**
     * ACESSIBILIDADE
     *  - 'role="alert" ': Define que este elemento contém uma mensagem importante e necessária
     *  (normalmente indicando um erro)
     *  - 'aria-live="assertive" ': Garante que o usuário olhe imediatamente para o aviso, mesmo que prejudique a leitura
     */
    aviso.setAttribute("role", "alert");
    aviso.setAttribute("aria-live", "assertive");
    form.appendChild(aviso);

    /* Resultado */
    // O container que exibirá a nota final
    const resultado = document.createElement("div");
    resultado.id = "resultado";
    resultado.className = "resultado";
    /**
     * ACESSIBILIDADE
     *  - ' role="status" ': Avisa que esta div contém informações de estado
     *  - ' aria-live="polite" ': Garante mais acessibilidade na hora da leitura do usuário  
     */
    resultado.setAttribute("role", "status");
    resultado.setAttribute("aria-live", "polite");
    form.appendChild(resultado);

    /* Botões */
    // Container dos botões --> Facilitar o layout via flexbox/grid
    const btnWrap = document.createElement("div");
    btnWrap.className = "btn-wrap";

    /**
     * BOTÃO CORRIGIR
     * - type="submit": Ao ser clicado, ele envia o formulário
     * - disparando o evento 'submit' do pai (<form>).
     */
    const btnCorrigir = document.createElement("button");
    btnCorrigir.type = "submit";
    btnCorrigir.className = "btn-corrigir";
    btnCorrigir.textContent = "✔ Corrigir Prova";

    /**
     * BOTÃO REINICIAR
     * - type="button": Ele não envia um formulário, mas está vinculado a 
     * - função de reiniciar
     */
    const btnReiniciar = document.createElement("button");
    btnReiniciar.type = "button";
    btnReiniciar.className = "btn-reiniciar";
    btnReiniciar.textContent = "↺ Limpar Respostas";
    // ao ser clicado, ele chama a função de reiniciar o formulário
    btnReiniciar.addEventListener("click", () => this._reiniciar());

    btnWrap.appendChild(btnCorrigir);
    btnWrap.appendChild(btnReiniciar);
    form.appendChild(btnWrap);

    /**
     * O EVENTO 'SUBMIT': 
     * - Por padrão, quando você clica num botão 'submit', o navegador tenta recarregar 
     * - a página ou enviar os dados para uma URL.
    */
    form.addEventListener("submit", (e) => {
      // Aqui assumiremos o controle via JavaScript Puro.
      e.preventDefault();
      // Depois de parado, chamamos nossa lógica de correção
      this._corrigir();
    });

    // O 'card' recebe o 'form' (que já contém as questões, o resultado e os botões).
    card.appendChild(form);
    // 's' --> Shadow Root
    // Ao darmos appendChild(card), tudo o que foi feito via JS aparecerá
    // instantaneamente dentro do Web Component
    s.appendChild(card);
  }

  /* ── Corrige e exibe resultado ── */
  _corrigir() {
    const s = this._shadow;

    /* Valida questões sem resposta */
    // Validação através da Técnica de "Early Return" (Retorno Precoce)
    // A fim de evitar o uso de múltiplos IFs aninhados
    const naoRespondidas = [];

    // Mudança: alterado de 'questoes.forEach' para 'this.questoes.forEach'
    this.questoes.forEach((_, qi) => {
      // Buscamos se existe algum input checado para o nome daquela questão
      // :checked -> seletor CSS que o JS utiliza para filtrar apenas o que foi marcado
      if (!s.querySelector('input[name="questao_' + qi + '"]:checked')) {
        naoRespondidas.push(qi + 1); // Guardamos o número da questão para o usuário
      }
    });

    const aviso = s.getElementById("aviso");
    if (naoRespondidas.length > 0) {
      // Se houver pendências, paramos a execução aqui com 'return'
      aviso.textContent = "⚠️ Responda as questões: " + naoRespondidas.join(", ") + ".";
      aviso.classList.add("visivel"); // Torna o Aviso Visível
      s.querySelector('input[name="questao_' + (naoRespondidas[0] - 1) + '"]').focus(); // Corrije o índice das alternativas
      return;
    }
    aviso.classList.remove("visivel");

    /* Marca cada alternativa como correta ou errada */
    let acertos = 0;

    // Mudança: alterado de 'questoes.forEach' para 'this.questoes.forEach'
    this.questoes.forEach((q, qi) => {
      // 1. Pegamos o valor do radio marcado e convertemos para Número (Base 10)
      const resposta = parseInt(
        s.querySelector('input[name="questao_' + qi + '"]:checked').value, 10
      );

      // Se a respota marcada for igual ao valor do atributo acerto
      // acertos é incrementado 
      if (resposta === q.correta) acertos++;

      // 2. Desabilitação: Uma vez corrigido, o usuário não pode trocar a resposta.
      s.querySelectorAll('input[name="questao_' + qi + '"]').forEach(inp => {
        const ai = parseInt(inp.value, 10);
        const lbl = inp.closest(".alt-label");
        inp.disabled = true;
        lbl.classList.add("disabled");

        // 3. Lógica das Cores
        // - Verde -> Correta
        // - Vermelha -> Errada
        if (ai === q.correta && ai === resposta) {
          lbl.classList.add("correta");
          this._badge(lbl, "✔ Correta", "badge-correta");
        } else if (ai === resposta) {
          lbl.classList.add("errada");
          this._badge(lbl, "✖ Errada", "badge-errada");
        } else if (ai === q.correta) {
          lbl.classList.add("correta");
          this._badge(lbl, "✔ Correta", "badge-correta");
        }
      });
    });

    /* Exibe nota */
    // Mudança: calculando a nota dinamicamente com 'this.questoes.length'
    const nota = Math.round((acertos / this.questoes.length) * 100);
    const aprovado = nota >= 60;
    const resultado = s.getElementById("resultado");

    if (aprovado) {
      resultado.textContent =
        `🎉 Aprovado! Você acertou ${acertos} de ${this.questoes.length} — Nota: ${nota} pts`;

      resultado.className = "resultado visivel aprovado";
    } else {
      resultado.textContent =
        `📚 Você acertou ${acertos} de ${this.questoes.length} — Nota: ${nota} pts. Continue estudando!`;

      resultado.className = "resultado visivel reprovado";
    }

    /* Troca os botões pelo "Responder Novamente" */
    s.querySelector(".btn-wrap").remove();

    const btnWrap = document.createElement("div");
    btnWrap.className = "btn-wrap";

    const btnNovamente = document.createElement("button");
    btnNovamente.type = "button";
    btnNovamente.className = "btn-novamente";
    btnNovamente.textContent = "↺ Responder Novamente";
    btnNovamente.addEventListener("click", () => this._reiniciar());

    btnWrap.appendChild(btnNovamente);
    s.querySelector("form").appendChild(btnWrap);

    setTimeout(() => resultado.scrollIntoView({ behavior: "smooth", block: "center" }), 100);
  }

  /* Cria um badge (Correta / Errada) na alternativa */
  _badge(label, texto, classe) {
    const badge = document.createElement("span");
    // aria-hidden="true": O leitor de tela já anunciou se está correto 
    // pelas classes do label, então o badge é apenas "enfeite" visual.
    badge.className = "badge " + classe;
    badge.setAttribute("aria-hidden", "true");
    badge.textContent = texto;
    label.appendChild(badge);
  }

  /* ── Reinicia a prova do zero ── */
  _reiniciar() {
    this._render();
    this._shadow.querySelector(".card").scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

customElements.define("my-prova", MyProva);