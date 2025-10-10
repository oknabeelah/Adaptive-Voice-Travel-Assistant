// ===== Smooth Scroll Reveal Animations =====
const revealElements = () => {
    const reveals = document.querySelectorAll('.scroll-reveal');

    reveals.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementBottom = element.getBoundingClientRect().bottom;
        const windowHeight = window.innerHeight;

        // Reveal when element is 15% into the viewport
        if (elementTop < windowHeight * 0.85 && elementBottom > 0) {
            element.classList.add('revealed');
        }
    });
};

// ===== Navbar Scroll Effect =====
const handleNavbarScroll = () => {
    const navbar = document.querySelector('.navbar');

    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = '0 4px 6px -1px rgb(0 0 0 / 0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.8)';
        navbar.style.boxShadow = 'none';
    }
};

// ===== Smooth Scroll for Navigation Links =====
const setupSmoothScroll = () => {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));

            if (target) {
                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = target.offsetTop - navbarHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
};

// ===== Parallax Effect for Hero Section =====
const handleParallax = () => {
    const heroVisual = document.querySelector('.hero-visual');
    const scrolled = window.pageYOffset;

    if (heroVisual && scrolled < window.innerHeight) {
        heroVisual.style.transform = `translateY(${scrolled * 0.5}px)`;
        heroVisual.style.opacity = `${1 - scrolled / 800}`;
    }
};

// ===== Feature Cards Stagger Animation =====
const setupFeatureCards = () => {
    const featureCards = document.querySelectorAll('.feature-card');

    featureCards.forEach((card, index) => {
        card.style.transitionDelay = `${index * 0.1}s`;
    });
};

// ===== Email Form Handling =====
const setupEmailForm = () => {
    const emailInput = document.querySelector('.email-input');
    const ctaButton = document.querySelector('.cta-form .btn-primary');

    if (ctaButton && emailInput) {
        ctaButton.addEventListener('click', (e) => {
            e.preventDefault();
            const email = emailInput.value;

            if (email && validateEmail(email)) {
                // Simulate form submission
                ctaButton.textContent = 'Added to waitlist!';
                ctaButton.style.background = '#10b981';
                emailInput.value = '';

                setTimeout(() => {
                    ctaButton.textContent = 'Get early access';
                    ctaButton.style.background = '';
                }, 3000);
            } else {
                emailInput.style.borderColor = '#ef4444';
                setTimeout(() => {
                    emailInput.style.borderColor = '';
                }, 2000);
            }
        });
    }
};

// ===== Email Validation =====
const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
};

// ===== Demo Button Interaction =====
const setupDemoButton = () => {
    const playButton = document.querySelector('.play-button');

    if (playButton) {
        playButton.addEventListener('click', () => {
            alert('Demo video coming soon! Stay tuned for our launch.');
        });
    }
};

// ===== CTA Buttons in Hero =====
const setupHeroCTA = () => {
    const heroButtons = document.querySelectorAll('.hero-cta button');

    heroButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            if (button.classList.contains('btn-primary')) {
                // Scroll to email signup
                const ctaSection = document.querySelector('#get-started');
                if (ctaSection) {
                    const navbarHeight = document.querySelector('.navbar').offsetHeight;
                    const targetPosition = ctaSection.offsetTop - navbarHeight;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            } else if (button.classList.contains('btn-secondary')) {
                // Scroll to demo
                const demoSection = document.querySelector('#demo');
                if (demoSection) {
                    const navbarHeight = document.querySelector('.navbar').offsetHeight;
                    const targetPosition = demoSection.offsetTop - navbarHeight;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
};

// ===== Enhanced Scroll Animations =====
const setupScrollAnimations = () => {
    let ticking = false;

    const handleScroll = () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                revealElements();
                handleNavbarScroll();
                handleParallax();
                ticking = false;
            });

            ticking = true;
        }
    };

    window.addEventListener('scroll', handleScroll);

    // Trigger initial reveal for elements in viewport
    revealElements();
};

// ===== Intersection Observer for Advanced Animations =====
const setupIntersectionObserver = () => {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            }
        });
    }, observerOptions);

    // Observe all scroll-reveal elements
    document.querySelectorAll('.scroll-reveal').forEach(element => {
        observer.observe(element);
    });
};

// ===== Add Hover Effects to Feature Cards =====
const enhanceFeatureCards = () => {
    const cards = document.querySelectorAll('.feature-card');

    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
        });
    });
};

// ===== Initialize Everything =====
const init = () => {
    // Setup all interactions
    setupSmoothScroll();
    setupScrollAnimations();
    setupIntersectionObserver();
    setupFeatureCards();
    setupEmailForm();
    setupDemoButton();
    setupHeroCTA();
    enhanceFeatureCards();

    // Initial reveal
    revealElements();

    console.log('🚀 VoyceTrip landing page loaded successfully!');
};

// ===== Run when DOM is ready =====
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// ===== Add keyboard navigation support =====
document.addEventListener('keydown', (e) => {
    // Press 'h' to go to top
    if (e.key === 'h' || e.key === 'H') {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
});

// ===== Performance optimization: Reduce animations on slow devices =====
if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) {
    document.body.classList.add('reduced-motion');
}

// ===== Add resize handler for responsive adjustments =====
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        revealElements();
    }, 250);
});
