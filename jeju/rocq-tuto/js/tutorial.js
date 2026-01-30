/**
 * Rocq Tutorial - Interactive Features
 * Handles navigation, hints, and UI interactions
 */

/**
 * Navigate to next/previous chapter
 */
function navigateChapter(direction) {
    const chapters = [
        '01-welcome',
        '02-propositions',
        '03-induction',
        '04-lists',
        '05-logic',
        '06-challenge'
    ];

    const currentIndex = chapters.findIndex(c => window.location.pathname.includes(c));
    const newIndex = currentIndex + direction;

    if (newIndex >= 0 && newIndex < chapters.length) {
        window.location.href = `${chapters[newIndex]}.html`;
    }
}

/**
 * Toggle code hint visibility
 */
function toggleHint(hintId) {
    const hint = document.getElementById(hintId);
    if (hint) {
        hint.classList.toggle('visible');
        hint.style.display = hint.classList.contains('visible') ? 'block' : 'none';
    }
}

/**
 * Initialize tutorial features on page load
 */
document.addEventListener('DOMContentLoaded', () => {
    // Set up keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.altKey && e.key === 'ArrowRight') {
            navigateChapter(1);
        } else if (e.altKey && e.key === 'ArrowLeft') {
            navigateChapter(-1);
        }
    });

    // Initialize Jeju tips with random messages
    initializeJejuTips();
});

/**
 * Initialize Jeju's helpful tips
 */
function initializeJejuTips() {
    const tips = [
        "Remember, every proof starts with understanding what you want to prove!",
        "The 'intro' tactic is your best friend for implications!",
        "When in doubt, try 'simpl' to simplify your goal!",
        "Induction is like climbing stairs - one step at a time!",
        "Don't forget: hypotheses are tools you can use!",
        "A good proof is like a good story - it has a clear beginning, middle, and end!",
        "Take breaks! Even polar bears need rest between proofs!",
    ];

    document.querySelectorAll('.jeju-tip.random').forEach(tipEl => {
        const content = tipEl.querySelector('.tip-text');
        if (content && !content.textContent.trim()) {
            content.textContent = tips[Math.floor(Math.random() * tips.length)];
        }
    });
}

/**
 * Track progress in localStorage
 */
const Progress = {
    save(chapter, exercise, completed) {
        const progress = JSON.parse(localStorage.getItem('rocq-progress') || '{}');
        if (!progress[chapter]) progress[chapter] = {};
        progress[chapter][exercise] = completed;
        localStorage.setItem('rocq-progress', JSON.stringify(progress));
    },

    load(chapter) {
        const progress = JSON.parse(localStorage.getItem('rocq-progress') || '{}');
        return progress[chapter] || {};
    },

    isComplete(chapter) {
        const progress = this.load(chapter);
        const exercises = Object.keys(progress);
        return exercises.length > 0 && exercises.every(ex => progress[ex]);
    },

    reset() {
        localStorage.removeItem('rocq-progress');
    }
};

// Export for use in other scripts
window.RocqTutorial = {
    navigateChapter,
    toggleHint,
    Progress
};
