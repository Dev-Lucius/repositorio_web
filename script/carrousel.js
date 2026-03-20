(function () {
    const track = document.getElementById('carousel-track');
        if (!track) return;
            const origCards = Array.from(track.children);
            origCards.forEach(card => {
            const clone = card.cloneNode(true);
            clone.setAttribute('aria-hidden', 'true'); 
            track.appendChild(clone);
    });
})();