document.addEventListener('DOMContentLoaded', () => {
    const elementsToType = document.querySelectorAll('.typing-effect');

    // Função que simula a digitação
    function typeWriter(element, text, callback) {
        let i = 0;
        element.innerHTML = ''; // Limpa o texto original
        element.style.visibility = 'visible'; // Torna o elemento visível para a animação

        function type() {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
                setTimeout(type, 50); // Velocidade da digitação em milissegundos
            } else if (callback) {
                callback(); // Chama a próxima animação
            }
        }
        type();
    }

    // Inicia a animação em sequência
    function startTypingSequence(elements, index = 0) {
        if (index < elements.length) {
            const element = elements[index];
            const text = element.getAttribute('data-text'); // Pega o texto original
            typeWriter(element, text, () => startTypingSequence(elements, index + 1));
        }
    }

    // Prepara os elementos e inicia a sequência
    elementsToType.forEach(el => el.setAttribute('data-text', el.innerHTML));
    startTypingSequence(Array.from(elementsToType));
});