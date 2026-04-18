// Load header and footer components
async function loadComponents() {
    try {
        // Load header
        const headerResponse = await fetch('components/header.html');
        const headerHTML = await headerResponse.text();
        const headerElement = document.getElementById('header-component');
        if (headerElement) {
            headerElement.innerHTML = headerHTML;
            initializeMobileMenu();
        }

        // Load hero
        const heroElement = document.getElementById('hero-component');
        if (heroElement) {
            const heroResponse = await fetch('components/hero.html');
            const heroHTML = await heroResponse.text();
            heroElement.innerHTML = heroHTML;

            const title = heroElement.getAttribute('data-title');
            const subtitle = heroElement.getAttribute('data-subtitle');
            if (title) document.getElementById('hero-title').textContent = title;
            if (subtitle) document.getElementById('hero-subtitle').textContent = subtitle;
        }

        // Load footer
        const footerResponse = await fetch('components/footer.html');
        const footerHTML = await footerResponse.text();
        const footerElement = document.getElementById('footer-component');
        if (footerElement) {
            footerElement.innerHTML = footerHTML;
        }

        // Load testimonials
        const testimonialsElement = document.getElementById('testimonials-component');
        if (testimonialsElement) {
            const testimonialsResponse = await fetch('components/testimonials.html');
            const testimonialsHTML = await testimonialsResponse.text();
            testimonialsElement.innerHTML = testimonialsHTML;
            initializeReviewCarousel();
        }

        // Initialize page features after components are loaded
        if (typeof initializePageFeatures === 'function') {
            initializePageFeatures();
        }
    } catch (error) {
        console.error('Error loading components:', error);
    }
}

// Initialize review carousel
function initializeReviewCarousel() {
    var track = document.getElementById('review-track');
    var carousel = document.getElementById('review-carousel');
    var container = document.getElementById('review-container');
    if (!track || !carousel) return;

    var slides = track.children;
    var dots = document.querySelectorAll('#review-dots button');
    var prevBtn = document.getElementById('review-prev');
    var nextBtn = document.getElementById('review-next');
    var totalSlides = slides.length;
    var current = 0;
    var autoplayTimer;

    function isLargeScreen() {
        return window.innerWidth >= 1024;
    }

    function getMaxIndex() {
        return isLargeScreen() ? totalSlides - 2 : totalSlides - 1;
    }

    function getSlidePercent() {
        return isLargeScreen() ? 50 : 100;
    }

    function updateContainerWidth() {
        if (container) {
            container.style.maxWidth = isLargeScreen() ? '64rem' : '48rem';
        }
    }

    function updateHeight() {
        if (isLargeScreen()) {
            var h1 = slides[current] ? slides[current].scrollHeight : 0;
            var h2 = slides[current + 1] ? slides[current + 1].scrollHeight : 0;
            carousel.style.height = Math.max(h1, h2) + 'px';
        } else {
            var slide = slides[current];
            if (slide) {
                carousel.style.height = slide.scrollHeight + 'px';
            }
        }
    }

    function updateDots() {
        for (var i = 0; i < dots.length; i++) {
            var active = (isLargeScreen()) ? (i === current || i === current + 1) : (i === current);
            if (active) {
                dots[i].className = 'w-3 h-3 rounded-full bg-[#C0392B] transition';
            } else {
                dots[i].className = 'w-3 h-3 rounded-full bg-[#E6E6E6] transition';
            }
        }
    }

    function goTo(index) {
        var maxIdx = getMaxIndex();
        if (index > maxIdx) index = 0;
        if (index < 0) index = maxIdx;
        current = index;
        track.style.transform = 'translateX(-' + (current * getSlidePercent()) + '%)';
        updateDots();
        updateHeight();
    }

    function onResize() {
        updateContainerWidth();
        if (current > getMaxIndex()) current = getMaxIndex();
        goTo(current);
    }

    function startAutoplay() {
        autoplayTimer = setInterval(function() { goTo(current + 1); }, 6000);
    }

    function resetAutoplay() {
        clearInterval(autoplayTimer);
        startAutoplay();
    }

    prevBtn.addEventListener('click', function() { goTo(current - 1); resetAutoplay(); });
    nextBtn.addEventListener('click', function() { goTo(current + 1); resetAutoplay(); });
    for (var i = 0; i < dots.length; i++) {
        dots[i].addEventListener('click', function() { goTo(parseInt(this.dataset.index)); resetAutoplay(); });
    }

    updateContainerWidth();
    updateHeight();
    window.addEventListener('resize', onResize);
    startAutoplay();
}

// Initialize mobile menu functionality
function initializeMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    
    if (mobileMenuBtn && mobileMenu) {
        const mobileLinks = mobileMenu.querySelectorAll('a');

        // Toggle mobile menu
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
            const icon = mobileMenuBtn.querySelector('i');
            icon.classList.toggle('fa-bars');
            icon.classList.toggle('fa-times');
        });

        // Close mobile menu when a link is clicked
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
                const icon = mobileMenuBtn.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            });
        });
    }
}

// Smooth scrolling for anchor links
function initializeSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Contact Form Submission
function initializeContactForm() {
    const contactForm = document.querySelector('form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const nameInput = contactForm.querySelector('input[type="text"]');
            const emailInput = contactForm.querySelector('input[type="email"]');
            const messageInput = contactForm.querySelector('textarea');
            
            if (nameInput && emailInput && messageInput) {
                const name = nameInput.value;
                const email = emailInput.value;
                const message = messageInput.value;
                
                if (name && email && message) {
                    // Show success message
                    alert('Thank you for your message! We will get back to you soon.');
                    contactForm.reset();
                } else {
                    alert('Please fill in all fields.');
                }
            }
        });
    }
}

// Add animation on scroll for cards
function initializeCardAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.6s ease-out forwards';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all cards for animation
    document.querySelectorAll('.shadow').forEach(card => {
        observer.observe(card);
    });

    // Add CSS animation styles dynamically
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    document.head.appendChild(style);
}

// Initialize all functions when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    loadComponents();
    initializeSmoothScroll();
    initializeContactForm();
    initializeCardAnimations();
    
    // Initialize FAQ if on contact page
    if (typeof initializeFAQ === 'function') {
        initializeFAQ();
    }
});
