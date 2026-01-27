document.addEventListener('DOMContentLoaded', () => {
    const targets = document.querySelectorAll('.typing-target');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                startTyping(entry.target);
                obs.unobserve(entry.target);
            }
        });
    }, observerOptions);

    targets.forEach(target => {
        // Hide content initially but keep layout space if possible, 
        // or we just save the content and clear it.
        // To avoid layout shift, we might want a detailed clone.
        // For this simple implementation, we'll store content and clear.
        target._originalContent = target.innerHTML;
        target.innerHTML = '';
        target.classList.add('cursor'); // Add block cursor
        observer.observe(target);
    });

    async function startTyping(element) {
        if (!element._originalContent) return;

        // Create a temporary container to parse the string back to DOM nodes
        const parserDiv = document.createElement('div');
        parserDiv.innerHTML = element._originalContent;

        // Clear and start recursive typing
        element.innerHTML = '';

        // We await the typing of children
        await typeChildren(element, parserDiv);

        // Typing done, remove cursor
        element.classList.remove('cursor');
    }

    async function typeChildren(targetParent, sourceParent) {
        const nodes = Array.from(sourceParent.childNodes);

        for (const node of nodes) {
            if (node.nodeType === Node.TEXT_NODE) {
                await typeText(targetParent, node.textContent);
            } else if (node.nodeType === Node.ELEMENT_NODE) {
                // Create the element structure
                const validTags = ['P', 'DIV', 'SPAN', 'STRONG', 'H1', 'H2', 'H3', 'UL', 'LI', 'A', 'BR'];
                // We clone the node (without children first) to copy attributes like href, class
                const newEl = node.cloneNode(false);
                targetParent.appendChild(newEl);

                // If it's a BR, no typing needed
                if (node.tagName === 'BR') {
                    await wait(50); // small pause at line break
                    continue;
                }

                // Recursively type contents of this element
                await typeChildren(newEl, node);
            }
        }
    }

    async function typeText(element, text) {
        for (const char of text) {
            element.append(char);
            // Randomize typing speed slightly for realism
            const delay = Math.random() * 5 + 5;
            await wait(delay);
        }
    }

    function wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
});
