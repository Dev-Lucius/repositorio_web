    (function () {
        'use strict';

        // ── referências ──────────────────────────────────────────────
        const card          = document.getElementById('card-canvas');
        const elCountEl     = document.getElementById('elCount');

        // fundo
        const bgColorEl     = document.getElementById('bgColor');
        const bgTypeEl      = document.getElementById('bgType');
        const bgColor2El    = document.getElementById('bgColor2');
        const gradDirEl     = document.getElementById('gradientDir');
        const gradOpts      = document.getElementById('gradientOptions');

        // texto
        const inputTexto    = document.getElementById('inputTexto');
        const charCount     = document.getElementById('charCount');
        const textColorEl   = document.getElementById('textColor');
        const fontSizeEl    = document.getElementById('fontSize');
        const fontSizeVal   = document.getElementById('fontSizeVal');
        const fontFamilyEl  = document.getElementById('fontFamily');
        const textAlignEl   = document.getElementById('textAlign');
        const boldCheck     = document.getElementById('boldCheck');
        const italicCheck   = document.getElementById('italicCheck');
        const addTextBtn    = document.getElementById('adicionarButton');

        // imagem
        const imgUrlEl      = document.getElementById('imgUrl');
        const imgWidthEl    = document.getElementById('imgWidth');
        const imgWidthVal   = document.getElementById('imgWidthVal');
        const addImageBtn   = document.getElementById('addImageBtn');

        // gerenciar
        const escolhidoEl   = document.getElementById('escolhido');
        const fsSelEl       = document.getElementById('fontSizeSelected');
        const fsSelVal      = document.getElementById('fontSizeSelectedVal');
        const tcSelEl       = document.getElementById('textColorSelected');
        const selectBtn     = document.getElementById('selectBtn');
        const removerBtn    = document.getElementById('removerButton');

        // borda
        const borderColorEl = document.getElementById('borderColor');
        const borderWidthEl = document.getElementById('borderWidth');
        const borderWidthVal= document.getElementById('borderWidthVal');
        const borderStyleEl = document.getElementById('borderStyle');

        const resetBtn      = document.getElementById('resetBtn');

        // ── estado ──────────────────────────────────────────────────
        let selectedEl = null;   // elemento atualmente selecionado no cartão

        // ── helpers ─────────────────────────────────────────────────
        function updateCount() {
            elCountEl.textContent = card.children.length;
            // limita o input "escolhido" ao máximo de elementos existentes
            escolhidoEl.max = Math.max(card.children.length, 1);
        }

        function deselectAll() {
            Array.from(card.children).forEach(el => el.classList.remove('selected'));
            selectedEl = null;
            fsSelEl.disabled = true;
            tcSelEl.disabled = true;
            fsSelVal.textContent = '—';
        }

        function applyBackground() {
            const type = bgTypeEl.value;
            if (type === 'solid') {
                card.style.background = bgColorEl.value;
            } else {
                card.style.background =
                    `linear-gradient(${gradDirEl.value}, ${bgColorEl.value}, ${bgColor2El.value})`;
            }
        }

        function applyBorder() {
            const w = borderWidthEl.value;
            card.style.border = w === '0'
                ? 'none'
                : `${w}px ${borderStyleEl.value} ${borderColorEl.value}`;
        }

        function validate(input, msg) {
            if (!input.value.trim()) {
                input.classList.add('invalid');
                input.focus();
                input.placeholder = msg;
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
        bgTypeEl.addEventListener('change', () => {
            gradOpts.classList.toggle('hidden', bgTypeEl.value !== 'gradient');
            applyBackground();
        });

        [bgColorEl, bgColor2El, gradDirEl].forEach(el =>
            el.addEventListener('input', applyBackground)
        );

        // ── range: tamanho da fonte (novo elemento) ──────────────────
        fontSizeEl.addEventListener('input', () => {
            fontSizeVal.textContent = fontSizeEl.value + 'px';
        });

        // ── range: largura da imagem ──────────────────────────────────
        imgWidthEl.addEventListener('input', () => {
            imgWidthVal.textContent = imgWidthEl.value + '%';
        });

        // ── range: borda ─────────────────────────────────────────────
        borderWidthEl.addEventListener('input', () => {
            borderWidthVal.textContent = borderWidthEl.value + 'px';
            applyBorder();
        });
        [borderColorEl, borderStyleEl].forEach(el =>
            el.addEventListener('change', applyBorder)
        );

        // ── contador de caracteres ────────────────────────────────────
        inputTexto.addEventListener('input', () => {
            charCount.textContent = inputTexto.value.length + '/80';
        });

        // ── ADICIONAR TEXTO ──────────────────────────────────────────
        addTextBtn.addEventListener('click', () => {
            if (!validate(inputTexto, '⚠ Digite um texto primeiro')) return;

            const div = document.createElement('div');
            div.className = 'card-element card-text';
            div.textContent = inputTexto.value;

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

            div.addEventListener('click', () => selectElement(div));
            card.appendChild(div);

            // reset campos
            inputTexto.value = '';
            charCount.textContent = '0/80';
            boldCheck.checked = false;
            italicCheck.checked = false;

            updateCount();
        });

        // ── ADICIONAR IMAGEM ─────────────────────────────────────────
        addImageBtn.addEventListener('click', () => {
            if (!validate(imgUrlEl, '⚠ Cole uma URL válida')) return;

            const wrap = document.createElement('div');
            wrap.className = 'card-element card-img-wrap';
            wrap.style.textAlign = 'center';

            const img = document.createElement('img');
            img.src = imgUrlEl.value.trim();
            img.alt = 'Imagem do cartão';
            img.style.width = imgWidthEl.value + '%';
            img.style.borderRadius = '6px';
            img.style.display = 'block';
            img.style.margin = '0 auto';

            img.onerror = () => {
                img.src = 'https://placehold.co/200x120/faf6f0/8a7f75?text=Imagem+inválida';
            };

            wrap.appendChild(img);
            wrap.addEventListener('click', () => selectElement(wrap));
            card.appendChild(wrap);

            imgUrlEl.value = '';
            updateCount();
        });

        // ── SELECIONAR elemento pelo número ─────────────────────────
        function selectElement(el) {
            deselectAll();
            selectedEl = el;
            el.classList.add('selected');

            // popula os controles de edição
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

            // sincroniza o input numérico
            const idx = Array.from(card.children).indexOf(el);
            escolhidoEl.value = idx + 1;
        }

        selectBtn.addEventListener('click', () => {
            const idx = parseInt(escolhidoEl.value) - 1;
            const els = Array.from(card.children);
            if (idx >= 0 && idx < els.length) {
                selectElement(els[idx]);
            } else {
                escolhidoEl.classList.add('invalid');
                setTimeout(() => escolhidoEl.classList.remove('invalid'), 1500);
            }
        });

        // ── edição ao vivo do elemento selecionado ───────────────────
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
                selectedEl.remove();
                selectedEl = null;
                fsSelEl.disabled = true;
                tcSelEl.disabled = true;
                fsSelVal.textContent = '—';
                updateCount();
            } else {
                // tenta pelo número digitado
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

        // ── RESET ────────────────────────────────────────────────────
        resetBtn.addEventListener('click', () => {
            if (!confirm('Reiniciar o cartão? Todos os elementos serão removidos.')) return;
            card.innerHTML = '';
            card.style.background   = '#ffffff';
            card.style.border       = 'none';
            bgColorEl.value         = '#ffffff';
            bgColor2El.value        = '#ffe4e1';
            bgTypeEl.value          = 'solid';
            gradOpts.classList.add('hidden');
            borderWidthEl.value     = '0';
            borderWidthVal.textContent = '0px';
            deselectAll();
            updateCount();
        });

        // ── utilitário: rgb(r,g,b) → #rrggbb ────────────────────────
        function rgbToHex(rgb) {
            const m = rgb.match(/\d+/g);
            if (!m || m.length < 3) return null;
            return '#' + m.slice(0, 3).map(n =>
                parseInt(n).toString(16).padStart(2, '0')
            ).join('');
        }

        // ── inicialização ────────────────────────────────────────────
        applyBackground();
        updateCount();

    })();