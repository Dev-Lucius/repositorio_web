    // Assim, como em carrousel.js, aqui a lógica dos card está dentro de uma função anônima
    // O que assegura duas coisas: Execução imediata e escopo isolado
    (function () {
        'use strict'; // Ativa o modo Estrito do JS ──> Proíbe variáveis não declaradas

        // Aqui o código mapeia os elementos HTML relevantes para as variáveis JS;
        // getElementById() ──> Busca um elemento pela sua propriedade id="..."
        // Isso é feito uma única vez no início do código para evitar buscas repetidas no DOM ──> Mais eficiência e organização

        // ── referências ──────────────────────────────────────────────
        const card          = document.getElementById('card-canvas');           // O cartão em si (área de preview)
        const elCountEl     = document.getElementById('elCount');               // Exibe a contagem de elementos

        // ── fundo ────────────────────────────────────────────────────
        const bgColorEl     = document.getElementById('bgColor');               // Input de cor primária do fundo
        const bgTypeEl      = document.getElementById('bgType');                // Seletor ──> sólido ou gradiente
        const bgColor2El    = document.getElementById('bgColor2');              // Cor secundária (para gradiente)
        const gradDirEl     = document.getElementById('gradientDir');           // Direção do gradiente - Ex. 90deg
        const gradOpts      = document.getElementById('gradientOptions');       // Painel extra de opções do gradiente

        // ── texto ────────────────────────────────────────────────────────
        const inputTexto    = document.getElementById('inputTexto');            // Campo onde o usuário digita o texto
        const charCount     = document.getElementById('charCount');             // Exibe "X/80" caracteres usados
        const textColorEl   = document.getElementById('textColor');             // Cor do texto a ser adicionado
        const fontSizeEl    = document.getElementById('fontSize');              // Range ──> tamanho da fonte (novo elem.)
        const fontSizeVal   = document.getElementById('fontSizeVal');           // Rótulo que exibe o valor do range
        const fontFamilyEl  = document.getElementById('fontFamily');            // Seletor de família tipográfica
        const textAlignEl   = document.getElementById('textAlign');             // Alinhamento: left/center/right
        const boldCheck     = document.getElementById('boldCheck');             // Checkbox negrito
        const italicCheck   = document.getElementById('italicCheck');           // Checkbox itálico
        const addTextBtn    = document.getElementById('adicionarButton');       // Botão "Adicionar Texto"

        // imagem
        const imgUrlEl      = document.getElementById('imgUrl');                // Campo para colar a URL da imagem
        const imgWidthEl    = document.getElementById('imgWidth');              // Range: largura da imagem em %
        const imgWidthVal   = document.getElementById('imgWidthVal');           // Rótulo que exibe o valor do range
        const addImageBtn   = document.getElementById('addImageBtn');           // Botão "Adicionar Imagem"

        // gerenciar
        const escolhidoEl   = document.getElementById('escolhido');             // Input numérico: nº do elemento
        const fsSelEl       = document.getElementById('fontSizeSelected');      // Range ──> edita fonte do selecionado
        const fsSelVal      = document.getElementById('fontSizeSelectedVal');   // Rótulo do range acima    
        const tcSelEl       = document.getElementById('textColorSelected');     // Color picker do elem. selecionado
        const selectBtn     = document.getElementById('selectBtn');             // Botão de "Selecionar"
        const removerBtn    = document.getElementById('removerButton');         // Botão de "Remover"

        // borda
        const borderColorEl = document.getElementById('borderColor');           // Cor da borda do cartão
        const borderWidthEl = document.getElementById('borderWidth');           // Espessura da borda (range)
        const borderWidthVal= document.getElementById('borderWidthVal');        // Rótulo do range
        const borderStyleEl = document.getElementById('borderStyle');           // Estilo: solid, dashed, dotted...

        // Botão de Reset
        const resetBtn      = document.getElementById('resetBtn');              // Botão de "Reiniciar Tudo"

        // ── estado ──────────────────────────────────────────────────
        // Variável que guarda qual elemento do cartão será selecionado no momento
        // Incizalizado com null ──> nenhum selecionado
        // Em suma, é o estado central da aplicação
        let selectedEl = null;   // elemento atualmente selecionado no cartão

        // ── helpers (Funções de Apoio Reutilizáveis) ─────────────────
        
        // declaração das funções helpers
        // Atualiza o contador de elementos visíveis na interface
        function updateCount() {
            elCountEl.textContent = card.children.length;
            // limita o input "escolhido" ao máximo de elementos existentes
            // Evita que o usuário escolha um elemento que não existe 
            escolhidoEl.max = Math.max(card.children.length, 1);
        }

        // Remove a Seleção visual de todos os elementos do cartão
        // e reseta os controles de edição para o estado de "Desabilitado"
        function deselectAll() {
            Array.from(card.children).forEach(el => el.classList.remove('selected'));
            selectedEl = null;
            fsSelEl.disabled = true;
            tcSelEl.disabled = true;
            fsSelVal.textContent = '—';
        }

        // Aplica o fundo ao cartão com base nos controles de cor / tipo
        // Lê bgTypeEl para decidir entre cor sólida ou gradiente linear.
        function applyBackground() {
            const type = bgTypeEl.value;
            if (type === 'solid') {
                card.style.background = bgColorEl.value;
            } else {
                // template literal monta a string CSS do gradiente dinamicamente
                // ex: "linear-gradient(135deg, #ff6600, #ffe4e1)"
                card.style.background =
                    `linear-gradient(${gradDirEl.value}, ${bgColorEl.value}, ${bgColor2El.value})`;
            }
        }

        // Aplica a borda ao cartão com base nos controles de borda.
        // Se a espessura for 0, remove a borda completamente com 'none'.
        function applyBorder() {
            const w = borderWidthEl.value;
            card.style.border = w === '0'
                ? 'none'
                : `${w}px ${borderStyleEl.value} ${borderColorEl.value}`;
                // ex: "3px dashed #ff0000"
        }

        // Função de validação genérica para inputs de texto/URL.
        // Retorna false e exibe feedback visual se o campo estiver vazio.
        // O setTimeout restaura o placeholder original após 2 segundos.
        function validate(input, msg) {
            if (!input.value.trim()) {
                input.classList.add('invalid');
                input.focus();
                input.placeholder = msg; // Mensagem de Erro no Placeholder
                setTimeout(() => {
                    input.classList.remove('invalid');
                    input.placeholder = input === imgUrlEl
                        ? 'https://exemplo.com/foto.jpg'
                        : 'Ex.: Feliz Aniversário!';
                }, 2000);
                return false;
            }
            return true;
        }

        // ── fundo ────────────────────────────────────────────────────

        // Quando o tipo de fundo muda (sólido ↔ gradiente):
        // mostra/oculta o painel extra de opções e atualiza o fundo.
        // classList.toggle(classe, condição): adiciona a classe se condição=true, remove se false.
        bgTypeEl.addEventListener('change', () => {
            gradOpts.classList.toggle('hidden', bgTypeEl.value !== 'gradient');
            applyBackground();
        });

        // Qualquer alteração nas cores ou direção do gradiente atualiza o fundo em tempo real.
        // O forEach aplica o mesmo listener nos três elementos de uma vez.
        [bgColorEl, bgColor2El, gradDirEl].forEach(el =>
            el.addEventListener('input', applyBackground)
        );

        // ── range: tamanho da fonte (novo elemento) ──────────────────
        // Atualiza o rótulo ao lado do range de tamanho de fonte.
        // O evento 'input' dispara enquanto o usuário ainda está arrastando.
        fontSizeEl.addEventListener('input', () => {
            fontSizeVal.textContent = fontSizeEl.value + 'px';
        });

        // ── range: largura da imagem ──────────────────────────────────
        // Mesmo padrão para o range de largura da imagem.
        imgWidthEl.addEventListener('input', () => {
            imgWidthVal.textContent = imgWidthEl.value + '%';
        });

        // ── range: borda ─────────────────────────────────────────────
        // O range da borda atualiza o rótulo E redesenha a borda ao mesmo tempo.
        borderWidthEl.addEventListener('input', () => {
            borderWidthVal.textContent = borderWidthEl.value + 'px';
            applyBorder();
        });
        // Cor e estilo da borda também disparam o redesenho.
        [borderColorEl, borderStyleEl].forEach(el =>
            el.addEventListener('change', applyBorder)
        );

        // ── contador de caracteres ────────────────────────────────────
        // A cada tecla digitada, exibe "X/80" para informar o usuário do limite.
        inputTexto.addEventListener('input', () => {
            charCount.textContent = inputTexto.value.length + '/80';
        });

        // ── ADICIONAR TEXTO ──────────────────────────────────────────
        addTextBtn.addEventListener('click', () => {
            // "Se" O texto digitado for inválido, lança-se um erro
            if (!validate(inputTexto, '⚠ Digite um texto primeiro')) return; // aborta se inválido

             // Cria um <div> que será o elemento de texto dentro do cartão.
            const div = document.createElement('div');  // classes CSS para estilo e identificação
            div.className = 'card-element card-text';   // conteúdo = o que o usuário digitou
            div.textContent = inputTexto.value;

            // Object.assign aplica múltiplas propriedades CSS de uma vez no elemento,
            // lendo os valores diretamente dos controles da interface.
            Object.assign(div.style, {
                color:      textColorEl.value,
                fontSize:   fontSizeEl.value + 'px',
                fontFamily: fontFamilyEl.value,
                textAlign:  textAlignEl.value,
                fontWeight: boldCheck.checked   ? 'bold'   : 'normal',
                fontStyle:  italicCheck.checked ? 'italic' : 'normal',
                padding:    '6px 4px',
                wordBreak:  'break-word',
            });

            // Ao clicar no elemento dentro do cartão, ele é selecionado para edição.
            div.addEventListener('click', () => selectElement(div));
            card.appendChild(div); // insere no cartão

            // reset campos para o próximo uso
            inputTexto.value = '';
            charCount.textContent = '0/80';
            boldCheck.checked = false;
            italicCheck.checked = false;

            updateCount(); // atualiza o contador de elementos
        });

        // ── ADICIONAR IMAGEM ─────────────────────────────────────────
        addImageBtn.addEventListener('click', () => {
            if (!validate(imgUrlEl, '⚠ Cole uma URL válida')) return; // Retorna um Erro se a Imagem for Inválida
            
            // A imagem é envolta em um <div> (wrap) para facilitar centralização e seleção.
            const wrap = document.createElement('div');
            wrap.className = 'card-element card-img-wrap';
            wrap.style.textAlign = 'center';

            const img = document.createElement('img');
            img.src = imgUrlEl.value.trim();  // .trim() remove espaços acidentais da URL
            img.alt = 'Imagem do cartão';
            img.style.width = imgWidthEl.value + '%'; // largura relativa ao cartão em %
            img.style.borderRadius = '6px';
            img.style.display = 'block';
            img.style.margin = '0 auto'; // centraliza horizontalment

            // Tratamento de erro: se a URL for inválida ou a imagem não carregar,
            // exibe uma imagem placeholder informando o problema.
            img.onerror = () => {
                img.src = 'https://placehold.co/200x120/faf6f0/8a7f75?text=Imagem+inválida';
            };

            wrap.appendChild(img);                                      // imagem dentro do wrapper
            wrap.addEventListener('click', () => selectElement(wrap));  // clique = selecionar
            card.appendChild(wrap);                                     // wrapper dentro do cartão

            imgUrlEl.value = '';
            updateCount();
        });

        // ── SELECIONAR elemento pelo número ─────────────────────────
        // Centraliza toda a lógica de "focar" em um elemento do cartão.
        function selectElement(el) {
            deselectAll();                  // remove seleção anterior
            selectedEl = el;                // atualiza o estado central
            el.classList.add('selected');   // adiciona borda/destaque visual via CSS

            // popula os controles de edição APENAS se for um elemento de texto
            // Como as imagens não possuem uma fonte ou cor de texto, os controles ficam desabilitados
            if (el.classList.contains('card-text')) {
                const fs = parseInt(el.style.fontSize) || 20;
                fsSelEl.value = fs;
                fsSelEl.disabled = false;
                fsSelVal.textContent = fs + 'px';

                tcSelEl.value = rgbToHex(el.style.color) || '#1e1c1a';
                tcSelEl.disabled = false;
            } else {
                fsSelEl.disabled = true;
                tcSelEl.disabled = true;
                fsSelVal.textContent = 'n/a';
            }

            // Descobre a posição (índice) do elemento dentro do cartão e
            // sincroniza com o input numérico "escolhido" para consistência visual.
            const idx = Array.from(card.children).indexOf(el);
            escolhidoEl.value = idx + 1;
        }

        // Seleciona pelo número digitado no input "escolhido" ao clicar no botão.
        selectBtn.addEventListener('click', () => {
            const idx = parseInt(escolhidoEl.value) - 1; // converte de volta para índice base-0
            const els = Array.from(card.children);
            if (idx >= 0 && idx < els.length) {
                selectElement(els[idx]);
            } else {
                // Número fora do intervalo válido: feedback visual de erro
                escolhidoEl.classList.add('invalid');
                setTimeout(() => escolhidoEl.classList.remove('invalid'), 1500);
            }
        });

        // ── edição ao vivo do elemento selecionado ───────────────────
        // Enquanto o usuário arrasta o range, aplica imediatamente no elemento selecionado.
        // O "if (selectedEl)" evita erro caso nenhum elemento esteja selecionado.
        fsSelEl.addEventListener('input', () => {
            fsSelVal.textContent = fsSelEl.value + 'px';
            if (selectedEl) selectedEl.style.fontSize = fsSelEl.value + 'px';
        });

        tcSelEl.addEventListener('input', () => {
            if (selectedEl) selectedEl.style.color = tcSelEl.value;
        });

        // ── REMOVER ──────────────────────────────────────────────────
        removerBtn.addEventListener('click', () => {
            if (selectedEl) {
                // Caminho 1: há um elemento selecionado via clique → remove diretamente.
                selectedEl.remove();
                selectedEl = null;
                fsSelEl.disabled = true;
                tcSelEl.disabled = true;
                fsSelVal.textContent = '—';
                updateCount();
            } else {
                // Caminho 2: nenhum elemento clicado → tenta usar o número digitado.
                const idx = parseInt(escolhidoEl.value) - 1;
                const els = Array.from(card.children);
                if (idx >= 0 && idx < els.length) {
                    els[idx].remove();
                    updateCount();
                } else {
                    escolhidoEl.classList.add('invalid');
                    setTimeout(() => escolhidoEl.classList.remove('invalid'), 1500);
                }
            }
        });

        // ── RESET ABSOLUTO ────────────────────────────────────────────────────
        resetBtn.addEventListener('click', () => {
            // confirm() exibe uma caixa de diálogo nativa do navegador.
            // Se o usuário clicar em "Cancelar", retorna false e o código para.
            if (!confirm('Reiniciar o cartão? Todos os elementos serão removidos.')) return;
            card.innerHTML = ''; // Remove-se todos os filhos do cartão de uma vez
            card.style.background   = '#ffffff';
            card.style.border       = 'none';

            // Reseta os controles da interface para os valores padrão.
            bgColorEl.value         = '#ffffff';
            bgColor2El.value        = '#ffe4e1';
            bgTypeEl.value          = 'solid';
            gradOpts.classList.add('hidden'); // oculta opções de gradiente
            borderWidthEl.value     = '0';
            borderWidthVal.textContent = '0px';

            deselectAll(); // reseta o estado de seleção
            updateCount(); // atualiza o contador (agora zero)
        });

        // ── utilitário: rgb(r,g,b) → #rrggbb ────────────────────────
        // O navegador armazena cores internamente no formato "rgb(255, 100, 0)".
        // Inputs do tipo color esperam o formato "#ff6400".
        // Esta função faz essa conversão para que o color picker mostre a cor correta.
        function rgbToHex(rgb) {
            const m = rgb.match(/\d+/g);            // extrai todos os números da string com regex
            if (!m || m.length < 3) return null;    // String Inválida

            // pega apenas R, G, B (ignora alpha se houver)
            // converte string "255" → número 255
            // converte base 10 → hexadecimal "ff"
            // garante dois dígitos: "f" → "0f"
            // junta: ["ff", "64", "00"] → "ff6400"
            return '#' + m.slice(0, 3).map(n =>
                parseInt(n).toString(16).padStart(2, '0')
            ).join('');
        }

        // ── inicialização ────────────────────────────────────────────
        // Executa as funções base uma vez ao carregar, para que o cartão já apareça
        // com o fundo e o contador corretos, sem precisar de interação do usuário.
        applyBackground();
        updateCount();

    })();
/*
    ---

    🗺️ Visão Geral da Arquitetura

    ┌─────────────────────────────────────────────────────┐
    │                    IIFE (escopo isolado)            │
    │                                                     │
    │  ESTADO          selectedEl ──────────────────────┐ │
    │                                                   │ │
    │  HELPERS         updateCount()                    │ │
    │                  deselectAll()  ◄──────────────── │ │
    │                  applyBackground()                │ │
    │                  applyBorder()                    │ │
    │                  validate()                       │ │
    │                  rgbToHex()                       │ │
    │                                                   │ │
    │  EVENTOS         bgType/Color/gradDir → fundo     │ │
    │                  ranges → rótulos                 │ │
    │                  addTextBtn  → createElement() ───┘ │
    │                  addImageBtn → createElement()      │
    │                  selectBtn   → selectElement()      │
    │                  removerBtn  → .remove()            │
    │                  resetBtn    → innerHTML = ''       │
    └─────────────────────────────────────────────────────┘

    --
*/
