/**
 * Rocq Tutorial - Animation Effects
 * Visual effects for proof steps and celebrations
 */

/**
 * Create floating snowflakes in the background
 */
function createSnowflakes(container, count = 8) {
    const snowflakeChars = ['❄', '❅', '❆'];

    for (let i = 0; i < count; i++) {
        const snowflake = document.createElement('div');
        snowflake.className = 'snowflake';
        snowflake.textContent = snowflakeChars[i % snowflakeChars.length];
        snowflake.style.left = `${(i / count) * 100}%`;
        snowflake.style.animationDuration = `${10 + Math.random() * 10}s`;
        snowflake.style.animationDelay = `${Math.random() * 5}s`;
        snowflake.style.fontSize = `${1 + Math.random() * 0.8}rem`;
        container.appendChild(snowflake);
    }
}

/**
 * Animate the induction ladder visualization
 */
function animateInductionLadder(container) {
    const rungs = container.querySelectorAll('.ladder-rung');
    rungs.forEach((rung, index) => {
        setTimeout(() => {
            rung.classList.add('visible');
        }, index * 300);
    });
}

/**
 * Animate list boxes appearing one by one
 */
function animateListBoxes(container, values) {
    container.innerHTML = '';

    values.forEach((value, index) => {
        const box = document.createElement('div');
        box.className = 'list-box';
        box.textContent = value;
        container.appendChild(box);

        setTimeout(() => {
            box.classList.add('visible');
        }, index * 200);
    });

    // Add nil terminator
    const nilBox = document.createElement('div');
    nilBox.className = 'list-box nil';
    container.appendChild(nilBox);

    setTimeout(() => {
        nilBox.classList.add('visible');
    }, values.length * 200);
}

/**
 * Create a proof tree visualization
 */
function createProofTree(container, tree) {
    container.innerHTML = '';

    function renderNode(node, parentEl) {
        const nodeEl = document.createElement('div');
        nodeEl.className = 'proof-tree-node';
        nodeEl.innerHTML = `
            <div class="node-content">${node.label}</div>
            ${node.tactic ? `<div class="node-tactic">${node.tactic}</div>` : ''}
        `;
        parentEl.appendChild(nodeEl);

        if (node.children && node.children.length > 0) {
            const childrenContainer = document.createElement('div');
            childrenContainer.className = 'node-children';
            nodeEl.appendChild(childrenContainer);

            node.children.forEach(child => {
                renderNode(child, childrenContainer);
            });
        }
    }

    renderNode(tree, container);
}

/**
 * Highlight a tactic in the code with animation
 */
function highlightTactic(tacticElement) {
    tacticElement.classList.add('tactic-highlight');
    tacticElement.scrollIntoView({ behavior: 'smooth', block: 'center' });

    setTimeout(() => {
        tacticElement.classList.remove('tactic-highlight');
    }, 2000);
}

/**
 * Create particle burst effect for successful proofs
 */
function createParticleBurst(x, y, options = {}) {
    const {
        count = 20,
        colors = ['#4A90A4', '#FF6B35', '#27AE60', '#B8D4E3'],
        duration = 1000
    } = options;

    const container = document.createElement('div');
    container.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 9999;
    `;
    document.body.appendChild(container);

    for (let i = 0; i < count; i++) {
        const particle = document.createElement('div');
        const color = colors[Math.floor(Math.random() * colors.length)];
        const angle = (i / count) * Math.PI * 2;
        const velocity = 100 + Math.random() * 100;
        const size = 4 + Math.random() * 8;

        particle.style.cssText = `
            position: absolute;
            left: ${x}px;
            top: ${y}px;
            width: ${size}px;
            height: ${size}px;
            background: ${color};
            border-radius: 50%;
            transform: translate(-50%, -50%);
        `;

        container.appendChild(particle);

        // Animate the particle
        const animation = particle.animate([
            {
                transform: 'translate(-50%, -50%) scale(1)',
                opacity: 1
            },
            {
                transform: `translate(
                    calc(-50% + ${Math.cos(angle) * velocity}px),
                    calc(-50% + ${Math.sin(angle) * velocity}px)
                ) scale(0)`,
                opacity: 0
            }
        ], {
            duration: duration,
            easing: 'cubic-bezier(0, 0.5, 0.5, 1)'
        });

        animation.onfinish = () => particle.remove();
    }

    setTimeout(() => container.remove(), duration + 100);
}

/**
 * Typewriter effect for text
 */
function typewriter(element, text, speed = 50) {
    return new Promise(resolve => {
        element.textContent = '';
        let i = 0;

        function type() {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(type, speed);
            } else {
                resolve();
            }
        }

        type();
    });
}

/**
 * Smooth scroll to element with offset
 */
function smoothScrollTo(element, offset = 100) {
    const targetPosition = element.getBoundingClientRect().top + window.pageYOffset - offset;
    window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
    });
}

/**
 * Create a pulsing highlight effect
 */
function pulseHighlight(element, duration = 2000) {
    element.classList.add('animate-pulse');
    setTimeout(() => {
        element.classList.remove('animate-pulse');
    }, duration);
}

/**
 * Animate goal transformation
 */
function animateGoalChange(goalElement, oldGoal, newGoal) {
    // Fade out old goal
    goalElement.style.opacity = '0';
    goalElement.style.transform = 'scale(0.9)';

    setTimeout(() => {
        goalElement.textContent = newGoal;
        goalElement.style.opacity = '1';
        goalElement.style.transform = 'scale(1)';
    }, 200);
}

/**
 * Create connection line between elements
 */
function drawConnection(from, to, container) {
    const fromRect = from.getBoundingClientRect();
    const toRect = to.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();

    const line = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    line.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        overflow: visible;
    `;

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    const startX = fromRect.left + fromRect.width / 2 - containerRect.left;
    const startY = fromRect.bottom - containerRect.top;
    const endX = toRect.left + toRect.width / 2 - containerRect.left;
    const endY = toRect.top - containerRect.top;

    path.setAttribute('d', `M ${startX} ${startY} C ${startX} ${(startY + endY) / 2}, ${endX} ${(startY + endY) / 2}, ${endX} ${endY}`);
    path.setAttribute('stroke', '#4A90A4');
    path.setAttribute('stroke-width', '2');
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke-dasharray', '5,5');

    line.appendChild(path);
    container.appendChild(line);

    // Animate the line
    const length = path.getTotalLength();
    path.style.strokeDasharray = length;
    path.style.strokeDashoffset = length;
    path.style.transition = 'stroke-dashoffset 0.5s ease';

    requestAnimationFrame(() => {
        path.style.strokeDashoffset = '0';
    });

    return line;
}

/**
 * Initialize animations on page load
 */
document.addEventListener('DOMContentLoaded', () => {
    // Initialize snowflakes if container exists
    const snowflakesContainer = document.querySelector('.snowflakes');
    if (snowflakesContainer && !snowflakesContainer.children.length) {
        createSnowflakes(snowflakesContainer);
    }

    // Initialize ladder animations
    document.querySelectorAll('.induction-ladder').forEach(ladder => {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateInductionLadder(ladder);
                    observer.unobserve(ladder);
                }
            });
        }, { threshold: 0.5 });

        observer.observe(ladder);
    });

    // Initialize list animations
    document.querySelectorAll('.list-visualization[data-values]').forEach(listViz => {
        const values = JSON.parse(listViz.dataset.values || '[]');
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateListBoxes(listViz, values);
                    observer.unobserve(listViz);
                }
            });
        }, { threshold: 0.5 });

        observer.observe(listViz);
    });

    // Add hover effects to cards
    document.querySelectorAll('.chapter-card, .feature').forEach(card => {
        card.classList.add('hover-lift');
    });
});

// Export animation functions
window.RocqAnimations = {
    createSnowflakes,
    animateInductionLadder,
    animateListBoxes,
    createProofTree,
    highlightTactic,
    createParticleBurst,
    typewriter,
    smoothScrollTo,
    pulseHighlight,
    animateGoalChange,
    drawConnection
};
