// Wait for the DOM to be fully loaded before running scripts
document.addEventListener('DOMContentLoaded', () => {
    
    /* ==========================================================================
       Mobile Navigation Toggle
       ========================================================================== */
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    const links = document.querySelectorAll('.nav-links li a');
    links.forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
            }
        });
    });

    /* ==========================================================================
       Sticky Navbar Scroll Effect (Shrink Nav padding)
       ========================================================================== */
    const navbar = document.getElementById('navbar');
    
    const handleNavScroll = () => {
        if (window.scrollY > 60) {
            navbar.classList.add('nav-scrolled');
        } else {
            navbar.classList.remove('nav-scrolled');
        }
    };

    handleNavScroll(); // Init
    window.addEventListener('scroll', handleNavScroll);


    /* ==========================================================================
       Active Navigation Link Observer
       ========================================================================== */
    const sections = document.querySelectorAll('section');
    const navItems = document.querySelectorAll('.nav-link');

    const navObserverOptions = {
        root: null,
        rootMargin: '-50% 0px -50% 0px', 
        threshold: 0
    };

    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navItems.forEach(link => link.classList.remove('active'));
                const activeLink = document.querySelector(`.nav-links a[href="#${id}"]`);
                if (activeLink) activeLink.classList.add('active');
            }
        });
    }, navObserverOptions);

    sections.forEach(section => navObserver.observe(section));


    /* ==========================================================================
       Scroll Animations (Intersection Observer)
       ========================================================================== */
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!prefersReducedMotion) {
        const animationObserverOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.15 
        };

        const animationObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    
                    el.classList.add('visible');

                    const staggerItems = el.querySelectorAll('.stagger-item');
                    staggerItems.forEach((item, index) => {
                        let delay = index * 100;
                        if (el.id === 'publications') delay = index * 80;
                        if (el.id === 'certifications') delay = index * 60;
                        item.style.transitionDelay = `${delay}ms`;
                    });

                    const cards = el.querySelectorAll('.card');
                    cards.forEach(card => {
                        const cardItems = card.querySelectorAll('.card-stagger-item');
                        cardItems.forEach((cItem, cIndex) => {
                            cItem.style.transitionDelay = `${400 + (cIndex * 100)}ms`;
                        });
                    });

                    if (el.id === 'achievements') {
                        startCounterAnimation();
                    }

                    observer.unobserve(el);
                }
            });
        }, animationObserverOptions);

        const elementsToObserve = document.querySelectorAll('.observe-section');
        elementsToObserve.forEach(el => animationObserver.observe(el));
    }


    /* ==========================================================================
       Counter Animation (150+ camps)
       ========================================================================== */
    function startCounterAnimation() {
        const counterEl = document.getElementById('camp-counter');
        if (!counterEl) return;

        const target = 150;
        const duration = 1500; 
        const startTime = performance.now();

        function updateCounter(currentTime) {
            const elapsedTime = currentTime - startTime;
            const progress = Math.min(elapsedTime / duration, 1);
            const easeOutProgress = progress * (2 - progress);
            const currentCount = Math.floor(easeOutProgress * target);
            counterEl.innerText = currentCount;

            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                counterEl.innerText = target;
            }
        }

        requestAnimationFrame(updateCounter);
    }


    /* ==========================================================================
       Apple-style Ripple Effect for Service Cards
       ========================================================================== */
    const cards = document.querySelectorAll('.card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function(e) {
            if (prefersReducedMotion) return;

            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const ripple = document.createElement('span');
            ripple.classList.add('ripple');
            
            const size = Math.max(rect.width, rect.height) * 2.5; 
            
            ripple.style.width = `${size}px`;
            ripple.style.height = `${size}px`;
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;

            card.appendChild(ripple);

            ripple.addEventListener('animationend', () => {
                ripple.remove();
            });
        });
    });

    /* ==========================================================================
       Hero Animations Orchestration & Parallax
       ========================================================================== */
    const hero = document.getElementById('hero');
    const taglineEl = document.getElementById('hero-tagline');
    const subtitleEl = document.getElementById('hero-subtitle');
    const buttonsEl = document.getElementById('hero-buttons');
    const logoWrapper = document.querySelector('.hero-logo-wrapper');
    const chevron = document.getElementById('scroll-chevron');
    
    const taglineToType = "Bridging Clinical Research and Data Science for Better Health Outcomes";

    if (!prefersReducedMotion && hero) {
        // Trigger CSS animations for logo and sonar ring
        setTimeout(() => {
            hero.classList.add('animate');
        }, 50); // Small delay to ensure CSS transitions apply from clean state

        // Start Typewriter effect at T=1000ms
        setTimeout(() => {
            taglineEl.classList.add('typing');
            let charIndex = 0;
            
            const typeInterval = setInterval(() => {
                if (charIndex < taglineToType.length) {
                    taglineEl.textContent += taglineToType.charAt(charIndex);
                    charIndex++;
                } else {
                    clearInterval(typeInterval);
                    
                    // Typewriter finished
                    // Remove blinking cursor
                    setTimeout(() => taglineEl.classList.remove('typing'), 500);
                    
                    // Trigger Subtitle slide up
                    subtitleEl.classList.add('animate-in');
                    
                    // Trigger Buttons slide up 400ms later
                    setTimeout(() => {
                        buttonsEl.classList.add('animate-in');
                    }, 400);
                }
            }, 50); // 50ms per character
        }, 1000);

        // Parallax Effect & Chevron fading
        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            
            // Logo parallax: move down at 0.3x scroll rate, max 40px
            if (scrollY < window.innerHeight && logoWrapper) {
                const moveY = Math.min(scrollY * 0.3, 40);
                logoWrapper.style.transform = `translateY(${moveY}px)`;
            }

            // Fade out chevron when scrolling down past 100px
            if (chevron) {
                const chevronOpacity = Math.max(1 - (scrollY / 100), 0);
                chevron.style.opacity = chevronOpacity;
            }
        });

    } else if (hero) {
        // If reduced motion is on, just show the text immediately
        taglineEl.textContent = taglineToType;
    }

});
