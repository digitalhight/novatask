
export default (function() {
    const init = () => {
        const shareBtn = document.getElementById('share-button');
        const closeBtn = document.getElementById('close-share-modal');
        const modal = document.getElementById('share-modal');

        if (!shareBtn || !modal) return;

        shareBtn.addEventListener('click', () => {
            modal.classList.remove('hidden');
        });

        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                modal.classList.add('hidden');
            });
        }

        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.classList.add('hidden');
        });
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
