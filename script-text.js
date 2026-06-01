document.addEventListener('DOMContentLoaded', () => {
    const typedTextSpan = document.getElementById("typed-text");
    
    // Array of words/phrases to type
    const textArray = [
        "Desenvolvedor Full Stack",
        "Especialista em React & Next.js",
        "Especialista em Java & Spring Boot",
        "Criador de Soluções Escaláveis"
    ];
    
    // Speed variables
    const typingDelay = 60;
    const erasingDelay = 30;
    const newTextDelay = 2000; // Delay between current and next text
    
    let textArrayIndex = 0;
    let charIndex = 0;
    
    // Helper to start the typing effect
    function type() {
        if (!typedTextSpan) return;
        
        const currentPhrase = textArray[textArrayIndex];
        
        if (charIndex < currentPhrase.length) {
            // Append character
            typedTextSpan.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
            setTimeout(type, typingDelay);
        } else {
            // Finished typing word, wait and then start erasing
            setTimeout(erase, newTextDelay);
        }
    }
    
    // Helper to erase typed text
    function erase() {
        if (!typedTextSpan) return;
        
        const currentPhrase = textArray[textArrayIndex];
        
        if (charIndex > 0) {
            // Remove character
            typedTextSpan.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
            setTimeout(erase, erasingDelay);
        } else {
            // Word completely erased, move to the next phrase
            textArrayIndex++;
            if (textArrayIndex >= textArray.length) {
                textArrayIndex = 0; // Loop back
            }
            // Wait slightly and start typing next word
            setTimeout(type, typingDelay + 300);
        }
    }
    
    // Initialize the typing sequence
    if (typedTextSpan) {
        // Clear initial text (which serves as HTML fallback)
        typedTextSpan.textContent = "";
        // Start typing after a short initial delay
        setTimeout(type, 1000);
    }
});