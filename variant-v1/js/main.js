// Wait for the DOM to fully load
document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Navbar Scroll Effect ---
    const navbar = document.getElementById('navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // --- 2. Mobile Menu Toggle ---
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navLinks = document.getElementById('nav-links');

    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', () => {
            const isExpanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
            mobileMenuBtn.setAttribute('aria-expanded', !isExpanded);
            navLinks.classList.toggle('active');
        });

        // Close mobile menu when clicking a link
        const links = navLinks.querySelectorAll('a');
        links.forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 768) {
                    navLinks.classList.remove('active');
                    mobileMenuBtn.setAttribute('aria-expanded', 'false');
                }
            });
        });
    }

    // --- 3. Intersection Observer for Fade Animations ---
    const animationOptions = {
        root: null, // viewport
        rootMargin: '0px',
        threshold: 0.15 // trigger when 15% of element is visible
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            // Add 'visible' class when element comes into view
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: Stop observing once animated
                observer.unobserve(entry.target);
            }
        });
    }, animationOptions);

    // Select all elements that need to animate
    const animatedElements = document.querySelectorAll('.fade-up, .fade-in');
    
    // Observe them
    animatedElements.forEach(el => observer.observe(el));

    // --- 4. Terminal Typing Effect for Hero Section ---
    const terminalOutput = document.getElementById('terminal-output');
    if (terminalOutput) {
        // Array of "logs" to cycle through
        const terminalLogs = [
            "> UPLINK CONNECTION ESTABLISHED",
            "> SECURING P2P CHANNELS... OK",
            "> SYNCING COMMS NETWORK... OK",
            " ",
            "> STATUS: DEFCON 4",
            "> LATEST OP: OPERATION FIRESTORM",
            "> OUTCOME: SUCCESS [100% TICKETS]",
            " ",
            "> AWAITING DEPLOYMENT ORDERS...",
            "> NEW RECRUIT LOGGED: [SPARK]",
            "> CLEARANCE: TRIAL PHASE",
            " ",
            "> MONITORING GRID ACTIVITY",
            "> SIGNAL LOST...",
            "> RECONNECTING...",
            "> SYSTEM ONLINE."
        ];

        let logIndex = 0;
        let charIndex = 0;
        let currentLine = "";
        
        // Settings
        const typingSpeedMs = 30; // Speed of each character typing
        const lineDelayMs = 800; // Delay before starting next line
        const clearDelayMs = 4000; // Time to hold before clearing terminal and looping
        
        function typeTerminalLine() {
            if (logIndex >= terminalLogs.length) {
                // We've typed everything. Wait, clear, and restart.
                setTimeout(() => {
                    terminalOutput.innerHTML = "";
                    logIndex = 0;
                    typeTerminalLine();
                }, clearDelayMs);
                return;
            }

            const targetLine = terminalLogs[logIndex];
            
            if (charIndex < targetLine.length) {
                currentLine += targetLine.charAt(charIndex);
                charIndex++;
                
                // Keep history of previous lines, append the current typing line
                const previousLinesHtml = terminalLogs.slice(0, logIndex).map(line => `<div>${line}</div>`).join('');
                terminalOutput.innerHTML = previousLinesHtml + `<div>${currentLine}</div>`;
                
                setTimeout(typeTerminalLine, targetLine === " " ? 0 : typingSpeedMs); // Skip typing delay for empty spacer lines
            } else {
                // Line is complete
                logIndex++;
                charIndex = 0;
                currentLine = "";
                
                // Ensure full history is rendered perfectly
                terminalOutput.innerHTML = terminalLogs.slice(0, logIndex).map(line => `<div>${line}</div>`).join('');
                
                setTimeout(typeTerminalLine, lineDelayMs);
            }
        }

        // Start effect after a short delay (matches CSS fade-in)
        setTimeout(typeTerminalLine, 1500);
    }
});
