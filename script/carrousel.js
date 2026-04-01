// IIFE --> Immediately Invoked Function Expression
// Trata-se de uma Função anônima que se executa automaticamente assim que é definida.
// Os parênteses externos "(function() { ... })()" são justamente o que disparam tal execução

// Essa técnica é útil para isolar o código em um escopo próprio a fim de evitar que as variáveis internas "Vazem" ou pulem o escopo global da página
// Aqui ela está sendo usada na lógica do carrousel presente do index.html

(function () {
    // Busca no DOM, um elemento HTML que tem por ID 'carousel-track'
    // trata-se da trilha do carrosel, isto é, o contêiner pai que agrupa os cards filhos
    const track = document.getElementById('carousel-track');
        // "Se" o elemento não existir na página, isto é, track == null, a função é parada automaticamente
        // Trata-se de um verificação de segurança que visa tratar as manipulações de elementos inexistentes
        if (!track) return;
            // Caso os elementos da track de carrossel não forem nulos 
            // Iremos convertelos o track filho em um Array 
            // "track.children" retorna seus filhos diretos - os card - do elemnento trilha
            // Chamaremos de "orig" para distingui-los dos clones que serão criados
            const origCards = Array.from(track.children);
            // Itera sobre cada card original do carrosel
            origCards.forEach(card => {
            // Aqui, cria-se uma cópia do card atual.
            // o parâmetro true assegura que todos os elementos serão filhos e atributos internos ao card
            // serão copiados de maneira fiel aos originais
            const clone = card.cloneNode(true);
            // Em seguida, adicionamos o atributos aria-hidden=true ao clone
            // Isso instrui os leitores de tela (tecnologias assistivas) a ignorarem
            // esses elementos duplicados, pois eles são puramente decorativos/visuais.
            clone.setAttribute('aria-hidden', 'true'); 
            // Aqui, Inserimos o clone ao final da trilha do carrossel - após todos os card originais
            // O resultado final é
            /* 
                ANTES:  [ Card 1 | Card 2 | Card 3 ]
                      ↓
                DEPOIS: [ Card 1 | Card 2 | Card 3 | Clone 1 | Clone 2 | Clone 3 ]
            */
           // Essa duplicação é a técnica que cria o efeito de "loop infinito" no carrossel.
           // Assim, quando o CSS termina de rolar os clones, a função JS reinicia do início sem que o usuário perceba a quebra
            track.appendChild(clone);
    });
})();
