// Mobile Menu Toggle - called after components load
function initMobileMenu() {
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

function initSmoothScroll() {
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

function initContactForm() {
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

// Force autoplay on all devices — handles iOS Safari, Android Chrome, Data Saver, Low Power Mode
function initHeroVideo() {
    const video = document.getElementById('hero-video');
    if (!video) return;

    // Programmatically enforce attributes (some mobile browsers ignore HTML attributes)
    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    video.setAttribute('playsinline', '');
    video.setAttribute('webkit-playsinline', '');
    video.loop = true;
    video.controls = false;
    video.removeAttribute('controls');

    // Attempt to play
    function tryPlay() {
        var playPromise = video.play();
        if (playPromise !== undefined) {
            playPromise.catch(function() {});
        }
    }

    // If something pauses the video unexpectedly (e.g. iOS visibility change), restart it
    video.addEventListener('pause', function() {
        // Only force-resume if the document is visible (don't fight the OS on background tabs)
        if (!document.hidden) {
            video.play().catch(function() {});
        }
    });

    // Resume playback when the tab becomes visible again
    document.addEventListener('visibilitychange', function() {
        if (!document.hidden && video.paused) {
            video.play().catch(function() {});
        }
    });

    // Resume playback when the video scrolls back into view (iOS pauses off-screen autoplay videos)
    if ('IntersectionObserver' in window) {
        var observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting && video.paused) {
                    video.play().catch(function() {});
                }
            });
        }, { threshold: 0.1 });
        observer.observe(video);
    }

    // Try playing immediately, after metadata loads, and after the window fully loads
    tryPlay();
    video.addEventListener('loadedmetadata', tryPlay, { once: true });
    video.addEventListener('canplay', tryPlay, { once: true });
    window.addEventListener('load', tryPlay, { once: true });
}

// FAQ Accordion functionality
function initFAQ() {
    const faqButtons = document.querySelectorAll('.faq-button');
    if (faqButtons.length === 0) return; // Exit if no FAQ buttons found
    
    faqButtons.forEach(button => {
        button.addEventListener('click', () => {
            const content = button.nextElementSibling;
            const icon = button.querySelector('i');
            
            // Close all other FAQ items
            faqButtons.forEach(otherButton => {
                if (otherButton !== button) {
                    const otherContent = otherButton.nextElementSibling;
                    const otherIcon = otherButton.querySelector('i');
                    otherContent.classList.add('hidden');
                    otherIcon.classList.remove('fa-chevron-up');
                    otherIcon.classList.add('fa-chevron-down');
                    otherButton.classList.remove('faq-button-active');
                }
            });
            
            // Toggle current FAQ item
            content.classList.toggle('hidden');
            icon.classList.toggle('fa-chevron-down');
            icon.classList.toggle('fa-chevron-up');
            button.classList.toggle('faq-button-active');
        });
    });
}

// Initialize all interactive features after components load
function initializePageFeatures() {
    initMobileMenu();
    initSmoothScroll();
    initContactForm();
    initCardAnimations();
    initHeroVideo();
    initFAQ();
}

// Add animation on scroll for cards
function initCardAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                entry.target.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all cards for animation
    document.querySelectorAll('.shadow').forEach(card => {
        observer.observe(card);
    });
}
