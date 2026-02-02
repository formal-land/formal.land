/**
 * Rocq Tutorial - Interactive Features
 * Handles navigation, hints, UI interactions, and syntax highlighting
 */

/**
 * Rocq/Coq Syntax Highlighter
 */
const RocqHighlighter = {
    keywords: [
        'Theorem', 'Lemma', 'Definition', 'Fixpoint', 'Inductive', 'Record',
        'Structure', 'CoFixpoint', 'CoInductive', 'Let', 'Example', 'Fact',
        'Remark', 'Corollary', 'Proposition', 'Property', 'Goal',
        'Proof', 'Qed', 'Defined', 'Admitted', 'Abort',
        'Require', 'Import', 'Export', 'Open', 'Scope', 'Module', 'Section', 'End',
        'forall', 'exists', 'fun', 'match', 'with', 'end', 'if', 'then', 'else',
        'let', 'in', 'return', 'as', 'where', 'fix', 'cofix',
        'Notation', 'Infix', 'Arguments', 'Set', 'Unset', 'Print', 'Check', 'Compute',
        'Eval', 'Search', 'About'
    ],
    tactics: [
        'intro', 'intros', 'apply', 'exact', 'assumption', 'trivial', 'auto',
        'simpl', 'unfold', 'fold', 'compute', 'cbv', 'lazy', 'vm_compute',
        'reflexivity', 'symmetry', 'transitivity',
        'rewrite', 'replace', 'subst',
        'induction', 'destruct', 'case', 'elim', 'inversion', 'injection',
        'split', 'left', 'right', 'exists', 'constructor', 'econstructor',
        'assert', 'cut', 'pose', 'set', 'remember', 'generalize',
        'clear', 'rename', 'move', 'revert',
        'repeat', 'try', 'now', 'first', 'solve', 'idtac', 'fail',
        'discriminate', 'contradiction', 'exfalso', 'absurd',
        'ring', 'field', 'omega', 'lia', 'nia', 'tauto', 'intuition',
        'eauto', 'eapply', 'eexists', 'especialize',
        'f_equal', 'congruence', 'decide', 'equality'
    ],
    types: [
        'Prop', 'Type', 'SProp', 'nat', 'bool', 'unit', 'list', 'option',
        'True', 'False', 'None', 'Some', 'nil', 'cons',
        'O', 'S', 'true', 'false', 'tt', 'I',
        'eq', 'and', 'or', 'not', 'iff', 'ex'
    ],
    builtins: [
        'plus', 'mult', 'minus', 'Nat.add', 'Nat.mul', 'Nat.sub', 'Nat.eqb',
        'length', 'app', 'rev', 'map', 'filter', 'fold_left', 'fold_right',
        'andb', 'orb', 'negb', 'eqb', 'leb', 'ltb'
    ],

    escapeHtml(text) {
        return text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
    },

    highlight(code) {
        // First escape HTML
        let result = this.escapeHtml(code);

        // Tokenize and highlight
        const tokens = [];
        let i = 0;

        while (i < result.length) {
            // Comments: (* ... *)
            if (result.slice(i, i + 2) === '(*') {
                let end = result.indexOf('*)', i + 2);
                if (end === -1) end = result.length;
                else end += 2;
                tokens.push({ type: 'comment', text: result.slice(i, end) });
                i = end;
                continue;
            }

            // Strings: "..."
            if (result[i] === '"') {
                let end = i + 1;
                while (end < result.length && result[end] !== '"') {
                    if (result[end] === '\\') end++;
                    end++;
                }
                end++;
                tokens.push({ type: 'string', text: result.slice(i, end) });
                i = end;
                continue;
            }

            // Numbers
            if (/\d/.test(result[i]) && (i === 0 || /[\s\(\)\[\],;:]/.test(result[i-1]))) {
                let end = i;
                while (end < result.length && /\d/.test(result[end])) end++;
                tokens.push({ type: 'number', text: result.slice(i, end) });
                i = end;
                continue;
            }

            // Operators: -> => <-> /\ \/ :: _ | :
            // Check for multi-char operators (after HTML escaping: -> becomes -&gt;)
            if (result.slice(i, i + 9) === '&lt;-&gt;') {
                tokens.push({ type: 'operator', text: '&lt;-&gt;' });
                i += 9;
                continue;
            }
            if (result.slice(i, i + 5) === '-&gt;') {
                tokens.push({ type: 'operator', text: '-&gt;' });
                i += 5;
                continue;
            }
            if (result.slice(i, i + 5) === '=&gt;') {
                tokens.push({ type: 'operator', text: '=&gt;' });
                i += 5;
                continue;
            }
            if (result.slice(i, i + 5) === '&lt;=') {
                tokens.push({ type: 'operator', text: '&lt;=' });
                i += 5;
                continue;
            }
            if (result.slice(i, i + 5) === '&gt;=') {
                tokens.push({ type: 'operator', text: '&gt;=' });
                i += 5;
                continue;
            }
            if (result.slice(i, i + 4) === '&lt;') {
                tokens.push({ type: 'operator', text: '&lt;' });
                i += 4;
                continue;
            }
            if (result.slice(i, i + 4) === '&gt;') {
                tokens.push({ type: 'operator', text: '&gt;' });
                i += 4;
                continue;
            }
            if (result.slice(i, i + 2) === '::') {
                tokens.push({ type: 'operator', text: '::' });
                i += 2;
                continue;
            }
            if ('-=<>/\\|:_+*'.includes(result[i])) {
                tokens.push({ type: 'operator', text: result[i] });
                i++;
                continue;
            }

            // Identifiers and keywords
            if (/[a-zA-Z_']/.test(result[i])) {
                let end = i;
                while (end < result.length && /[a-zA-Z0-9_'.]/.test(result[end])) end++;
                const word = result.slice(i, end);

                if (this.keywords.includes(word)) {
                    tokens.push({ type: 'keyword', text: word });
                } else if (this.tactics.includes(word)) {
                    tokens.push({ type: 'tactic', text: word });
                } else if (this.types.includes(word)) {
                    tokens.push({ type: 'type', text: word });
                } else if (this.builtins.includes(word)) {
                    tokens.push({ type: 'builtin', text: word });
                } else {
                    tokens.push({ type: 'variable', text: word });
                }
                i = end;
                continue;
            }

            // Whitespace and other characters
            tokens.push({ type: 'plain', text: result[i] });
            i++;
        }

        // Convert tokens to HTML
        return tokens.map(t => {
            if (t.type === 'plain') return t.text;
            return `<span class="rocq-${t.type}">${t.text}</span>`;
        }).join('');
    },

    highlightAll() {
        document.querySelectorAll('.code-editor code').forEach(block => {
            // Skip if already highlighted
            if (block.classList.contains('highlighted')) return;

            const originalCode = block.textContent;
            block.innerHTML = this.highlight(originalCode);
            block.classList.add('highlighted');
        });
    },

    // Re-highlight a specific code block (useful after dynamic updates)
    highlightElement(element) {
        const originalCode = element.textContent;
        element.innerHTML = this.highlight(originalCode);
        element.classList.add('highlighted');
    }
};


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
    // Apply syntax highlighting to all code blocks
    RocqHighlighter.highlightAll();

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
    Progress,
    RocqHighlighter
};
