# Rocq Tutorial - Project Documentation

An interactive web-based tutorial for learning Rocq (formerly Coq), featuring Jeju the Polar Bear as a friendly mascot guide.

## Tutorial Structure

The tutorial is organized into 6 progressive chapters:

| Chapter | File | Topic | Key Concepts |
|---------|------|-------|--------------|
| 1 | `01-welcome.html` | Welcome to Rocq | Introduction to formal verification, first proofs, proof state |
| 2 | `02-propositions.html` | Propositions & Tactics | Curry-Howard correspondence, intro/apply/exact/assumption/auto |
| 3 | `03-induction.html` | Natural Numbers & Induction | Inductive types, pattern matching, mathematical induction |
| 4 | `04-lists.html` | Lists & Recursion | List type, Fixpoint, recursive proofs, map/fold |
| 5 | `05-logic.html` | Logic Puzzles | Conjunction, disjunction, negation, classical vs intuitionistic logic |
| 6 | `06-challenge.html` | Challenge Arena | Advanced exercises combining all concepts |

## File Organization

```
rocq-tuto/
├── index.html              # Landing page with chapter overview
├── CLAUDE.md               # This documentation file
├── chapters/               # Tutorial content
│   ├── 01-welcome.html
│   ├── 02-propositions.html
│   ├── 03-induction.html
│   ├── 04-lists.html
│   ├── 05-logic.html
│   └── 06-challenge.html
├── css/
│   ├── style.css           # Main styling (arctic/polar theme)
│   └── animations.css      # CSS animations for visual elements
├── js/
│   ├── tutorial.js         # Core functionality + syntax highlighter
│   └── animations.js       # JavaScript animations
├── assets/
│   ├── favicon.svg         # Site favicon
│   └── jeju-bear.svg       # Mascot illustration
└── coq/                    # Rocq source files (reference implementations)
    ├── basics.v
    ├── induction.v
    ├── lists.v
    ├── logic.v
    └── challenge.v
```

## Syntax Highlighting

The tutorial uses a custom `RocqHighlighter` object (defined in `js/tutorial.js`) for Rocq syntax highlighting. It supports:

### Token Categories
- **Keywords**: `Theorem`, `Lemma`, `Definition`, `Fixpoint`, `Inductive`, `Proof`, `Qed`, etc.
- **Tactics**: `intro`, `intros`, `apply`, `exact`, `simpl`, `rewrite`, `induction`, `destruct`, etc.
- **Types**: `Prop`, `Type`, `nat`, `bool`, `list`, `True`, `False`, etc.
- **Builtins**: `length`, `app`, `rev`, `map`, `filter`, `fold_right`, etc.

### CSS Classes
Highlighted code uses these CSS classes (styled in `css/style.css`):
- `.rocq-keyword` - Keywords (purple/blue)
- `.rocq-tactic` - Tactics (green)
- `.rocq-type` - Types (orange)
- `.rocq-builtin` - Built-in functions (teal)
- `.rocq-comment` - Comments (gray)
- `.rocq-string` - String literals
- `.rocq-number` - Numbers
- `.rocq-operator` - Operators (->. =>, etc.)
- `.rocq-variable` - Variables and identifiers

### Usage
Highlighting is automatically applied to all `.code-editor code` elements on page load:
```javascript
document.addEventListener('DOMContentLoaded', () => {
    RocqHighlighter.highlightAll();
});
```

## Build/Serve Instructions

This is a static HTML/CSS/JS site with no build step required.

### Local Development
Simply open `index.html` in a browser, or use any static file server:

```bash
# Python 3
python -m http.server 8000

# Node.js (npx)
npx serve .

# PHP
php -S localhost:8000
```

Then visit `http://localhost:8000`

### Deployment
Deploy the entire directory to any static hosting service:
- GitHub Pages
- Netlify
- Vercel
- Any web server (Apache, nginx)

## Pedagogical Progression

The tutorial follows a carefully designed learning path:

### Chapter 1: Foundations
- Why formal verification matters (real-world examples)
- Basic structure: `Theorem`, `Proof`, `Qed`
- The proof state: hypotheses vs goals
- First tactics: `intro`, `exact`

### Chapter 2: Core Tactics
- Curry-Howard correspondence (propositions as types)
- `intros` for multiple introductions
- `apply` for backward reasoning
- `assumption` and `auto` for automation
- `assert` for intermediate lemmas
- Proof organization: bullets (`-`) and braces (`{ }`)

### Chapter 3: Induction
- Inductive type definitions (`nat`)
- Pattern matching with `match`
- Recursive functions with `Fixpoint`
- Mathematical induction with `induction n as [| n' IHn']`
- Equation tactics: `simpl`, `reflexivity`, `rewrite`

### Chapter 4: Data Structures
- The `list` type and its constructors
- Standard library: `Require Import List`
- Implicit arguments with `{A : Type}`
- List operations: `length`, `app`, `rev`, `map`
- Induction on lists

### Chapter 5: Logic
- Conjunction (`/\`): `split`, `destruct [H1 H2]`
- Disjunction (`\/`): `left`, `right`, `destruct [HA | HB]`
- Negation (`~`): defined as `A -> False`
- Classical vs intuitionistic logic
- `exfalso` and contradiction handling

### Chapter 6: Synthesis
- Challenging proofs combining all techniques
- Introduction to dependent types (vectors)
- Advanced recursion patterns
- Pointers to further learning

## Key Teaching Elements

### Jeju Tips
Interactive tips from the mascot are displayed in `.jeju-tip` boxes:
```html
<div class="jeju-tip">
    <img src="../assets/jeju-bear.svg" alt="Jeju" class="mini-mascot">
    <div class="tip-content">
        <h4>Jeju says:</h4>
        <p>Helpful advice here!</p>
    </div>
</div>
```

### Proof State Visualizations
The tutorial shows proof states to help learners understand tactic effects:
```html
<div class="proof-state">
    <div class="hypotheses">
        <div class="hypothesis">H : A</div>
    </div>
    <hr class="goal-separator">
    <div class="current-goal">
        <div class="goal-text">B</div>
    </div>
</div>
```

### Exercises
Each chapter includes exercises with optional hints:
```html
<section class="exercise">
    <h4>Exercise X.Y: Title</h4>
    <div class="code-container">...</div>
    <button onclick="toggleHint('hint-x-y')">Show Hint</button>
    <div id="hint-x-y" class="hint" style="display: none;">...</div>
</section>
```

## Keyboard Navigation

- `Alt + →` - Next chapter
- `Alt + ←` - Previous chapter

## Progress Tracking

The `Progress` object in `tutorial.js` provides localStorage-based progress tracking:
```javascript
Progress.save('chapter1', 'exercise1', true);
Progress.load('chapter1');
Progress.isComplete('chapter1');
Progress.reset();
```

## Extending the Tutorial

### Adding a New Chapter
1. Create `chapters/0X-topic.html` following existing structure
2. Add chapter to `chapters` array in `tutorial.js`:navigateChapter()
3. Update navigation links in adjacent chapters
4. Add entry to `index.html`

### Adding New Tactics to Highlighter
Edit `RocqHighlighter.tactics` array in `js/tutorial.js`:
```javascript
tactics: [
    'intro', 'intros', /* ... */ 'your_new_tactic'
]
```

## Related Files

The `hdr-jourdan/` subdirectory contains unrelated LaTeX files for an HDR thesis and should be ignored when working on the tutorial.
