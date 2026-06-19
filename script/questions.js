/**
 * Estrutura das questões da Prova --> Array de Objetos
 *  - Estrutura: 
 *      * 'export' --> Torna essa const disponível para ser acessada em outros arquivos (Modularização)
 *      * 'const' --> Garante que a referência da lista não se altere ao longo do código, mantendo a integridade dos ddaos
 *      * '[]' --> Um Array, ideal para criar listas ordenadas de itens similares, nesse caso, a lista de questões da prova
 *      * '{}' --> Objetos, usados para agrupar características de um único item, nesse caso, cada objeto é uma questão da prova
 */
export const questoes = [
    {   
        // Propriedade 'enunciado': Uma String que descreve a questão da prova
        enunciado: "Qual atributo HTML garante que um campo de formulário seja associado corretamente ao seu label, melhorando a acessibilidade?",
        
        // Propriedade 'alternativas': Um Array Aninhado - Nested Array - usado agrupar múltiplos valores
        // nesse caso, as possibilidades de respostas
        alternativas: [
            "name",
            "id",
            "placeholder"
        ],

        // Propriedade 'correta': Um Integer que se refere à alternativa correta baseada na posição - Indices - dos 
        // elementos contidos no Array 'alternativas'
        correta: 1
    },
    {
        enunciado: "O que é o Shadow DOM em Web Components?",
        alternativas: [
            "Um DOM paralelo que permite encapsular HTML, CSS e JS de um componente, isolando-os do restante da página",
            "Uma cópia oculta do DOM principal usada pelo navegador para melhorar a performance de renderização",
            "Um método JavaScript para esconder elementos da página sem remover do HTML"
        ],
        correta: 0
    },
    {
        enunciado: "Qual propriedade CSS moderna substitui 'margin-left: 12.5%' para centralizar um elemento de forma robusta e responsiva?",
        alternativas: [
            "margin: center auto",
            "align-self: center",
            "margin-inline: auto"
        ],
        correta: 2
    },
    {
        enunciado: "Em HTML semântico, qual é o problema de usar <h3> logo após um <h1>, sem um <h2> entre eles?",
        alternativas: [
            "O navegador ignora o <h3> e não o renderiza na página",
            "Quebra a hierarquia de headings, prejudicando acessibilidade e SEO",
            "Causa erro de validação no W3C que impede o carregamento da página"
        ],
        correta: 1
    },
    {
        enunciado: "Qual é a função do método customElements.define() no JavaScript?",
        alternativas:[
            "Definir variáveis CSS personalizadas no :root do documento",
            "Registrar uma nova tag HTML customizada vinculada a uma classe que estende HTMLElement",
            "Criar um novo seletor CSS exclusivo para um elemento específico da página",
        ],
        correta: 1
    }
]