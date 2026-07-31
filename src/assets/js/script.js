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

    // Mobile Training Dropdown Toggle
    const mobileTrainingToggle = document.getElementById('mobileTrainingToggle');
    const mobileTrainingMenu = document.getElementById('mobileTrainingMenu');
    if (mobileTrainingToggle && mobileTrainingMenu) {
        mobileTrainingToggle.addEventListener('click', () => {
            mobileTrainingMenu.classList.toggle('hidden');
            const icon = mobileTrainingToggle.querySelector('i');
            icon.classList.toggle('rotate-180');
        });
    }

    // Mobile Boarding Dropdown Toggle
    const mobileBoardingToggle = document.getElementById('mobileBoardingToggle');
    const mobileBoardingMenu = document.getElementById('mobileBoardingMenu');
    if (mobileBoardingToggle && mobileBoardingMenu) {
        mobileBoardingToggle.addEventListener('click', () => {
            mobileBoardingMenu.classList.toggle('hidden');
            const icon = mobileBoardingToggle.querySelector('i');
            icon.classList.toggle('rotate-180');
        });
    }
}

function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    // Scope success/error lookups to the component container (supports both
    // the contact page inline use and the training page modal use).
    const formContainer = form.parentElement;

    function findInContainer(selector) {
        return formContainer
            ? formContainer.querySelector(selector)
            : document.querySelector(selector);
    }

    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        const submitBtn = form.querySelector('[type="submit"]');
        const globalErrorEl = findInContainer('[data-fs-error=""]');

        // Reset global error
        if (globalErrorEl) {
            globalErrorEl.style.display = 'none';
            globalErrorEl.textContent = '';
        }

        // Disable button while sending
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending...';
        }

        try {
            const formData = new FormData(form);
            const firstName = form.querySelector('[name="first_name"]');
            const lastName = form.querySelector('[name="last_name"]');
            const nameField = form.querySelector('[name="name"]');
            let subject = 'New Contact Form Submission';
            if (firstName && lastName) {
                subject = `New Contact Form Submission from ${firstName.value.trim()} ${lastName.value.trim()}`;
            } else if (nameField) {
                subject = `New Contact Form Submission from ${nameField.value.trim()}`;
            }
            formData.append('_subject', subject);

            const response = await fetch('https://formspree.io/f/xlgkeppa', {
                method: 'POST',
                body: formData,
                headers: { 'Accept': 'application/json' }
            });

            if (response.ok) {
                form.style.display = 'none';
                const successEl = findInContainer('[data-fs-success]');
                if (successEl) successEl.style.display = '';
            } else {
                const json = await response.json().catch(() => ({}));
                const msg = (json.errors || []).map(err => err.message).join(' ') ||
                    'Something went wrong. Please try again.';
                if (globalErrorEl) {
                    globalErrorEl.textContent = msg;
                    globalErrorEl.style.display = '';
                }
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Send Message';
                }
            }
        } catch {
            if (globalErrorEl) {
                globalErrorEl.textContent = 'Network error. Please check your connection and try again.';
                globalErrorEl.style.display = '';
            }
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Send Message';
            }
        }
    });

    // Show/hide phone deposit notice when a boarding-related service is selected
    const boardingNotice = findInContainer('#boarding-phone-notice');
    const serviceSelect = form.querySelector('[name="service"]');
    const boardingServices = ['Pet Boarding', 'Board and Train (Non E-Collar)', 'Board and Train (E-Collar)'];
    if (boardingNotice && serviceSelect) {
        serviceSelect.addEventListener('change', function () {
            boardingNotice.style.display = boardingServices.indexOf(this.value) !== -1 ? 'flex' : 'none';
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

function initImageCarousels() {
    const hosts = document.querySelectorAll('[data-component="image-carousel"]');
    if (!hosts.length) return;

    hosts.forEach((host) => {
        if (host.dataset.carouselInitialized === 'true') return;

        const root = host.querySelector('[data-carousel-root]');
        const slidesContainer = host.querySelector('[data-carousel-slides]');
        const dotsContainer = host.querySelector('[data-carousel-dots]');

        if (!root || !slidesContainer || !dotsContainer) return;

        const images = (host.getAttribute('data-carousel-images') || '')
            .split(',')
            .map((path) => path.trim())
            .filter(Boolean);

        if (!images.length) {
            host.dataset.carouselInitialized = 'true';
            return;
        }

        const interval = parseInt(host.getAttribute('data-carousel-interval') || '4000', 10);
        const autoplayDelay = Number.isNaN(interval) ? 4000 : interval;
        const altPrefix = host.getAttribute('data-carousel-alt-prefix') || 'Carousel photo';
        const ariaLabel = host.getAttribute('data-carousel-label') || 'Image carousel';
        const heightClass = host.getAttribute('data-carousel-height') || 'h-64';

        root.setAttribute('aria-label', ariaLabel);
        root.classList.add(...heightClass.split(' ').filter(Boolean));

        images.forEach((src, index) => {
            const slide = document.createElement('img');
            slide.src = src;
            slide.alt = altPrefix + ' ' + (index + 1);
            slide.loading = 'eager';
            slide.decoding = 'async';
            slide.fetchPriority = index === 0 ? 'high' : 'low';
            slide.className = 'absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ' + (index === 0 ? 'opacity-100' : 'opacity-0');
            slidesContainer.appendChild(slide);
        });

        const slides = Array.from(slidesContainer.querySelectorAll('img'));
        if (!slides.length) {
            host.dataset.carouselInitialized = 'true';
            return;
        }

        let currentIndex = 0;
        let autoplayTimer;
        let touchStartX = 0;
        let touchStartY = 0;

        function renderDots() {
            dotsContainer.innerHTML = '';
            slides.forEach((_, index) => {
                const dot = document.createElement('button');
                dot.type = 'button';
                dot.className = 'w-2.5 h-2.5 rounded-full transition';
                dot.setAttribute('aria-label', 'Go to slide ' + (index + 1));
                dot.addEventListener('click', () => {
                    setSlide(index);
                    restartAutoplay();
                });
                dotsContainer.appendChild(dot);
            });
        }

        function updateUI() {
            slides.forEach((slide, index) => {
                slide.classList.toggle('opacity-100', index === currentIndex);
                slide.classList.toggle('opacity-0', index !== currentIndex);
            });

            const dots = dotsContainer.querySelectorAll('button');
            dots.forEach((dot, index) => {
                dot.classList.toggle('bg-white', index === currentIndex);
                dot.classList.toggle('bg-white/50', index !== currentIndex);
            });
        }

        function setSlide(index) {
            currentIndex = (index + slides.length) % slides.length;
            updateUI();
        }

        function nextSlide() {
            setSlide(currentIndex + 1);
        }

        function prevSlide() {
            setSlide(currentIndex - 1);
        }

        function startAutoplay() {
            if (slides.length <= 1) return;
            autoplayTimer = setInterval(nextSlide, autoplayDelay);
        }

        function restartAutoplay() {
            clearInterval(autoplayTimer);
            startAutoplay();
        }

        root.addEventListener('mouseenter', () => clearInterval(autoplayTimer));
        root.addEventListener('mouseleave', startAutoplay);

        root.addEventListener('touchstart', (event) => {
            if (!event.touches || !event.touches.length) return;
            touchStartX = event.touches[0].clientX;
            touchStartY = event.touches[0].clientY;
        }, { passive: true });

        root.addEventListener('touchend', (event) => {
            if (!event.changedTouches || !event.changedTouches.length) return;

            const touchEndX = event.changedTouches[0].clientX;
            const touchEndY = event.changedTouches[0].clientY;
            const deltaX = touchEndX - touchStartX;
            const deltaY = touchEndY - touchStartY;

            if (Math.abs(deltaX) < 40 || Math.abs(deltaX) <= Math.abs(deltaY)) return;

            if (deltaX < 0) {
                nextSlide();
            } else {
                prevSlide();
            }

            restartAutoplay();
        }, { passive: true });

        if (slides.length <= 1) {
            dotsContainer.classList.add('hidden');
        } else {
            renderDots();
            startAutoplay();
        }

        updateUI();
        host.dataset.carouselInitialized = 'true';
    });
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

    var playBtn = document.getElementById('hero-play-btn');

    function showPlayButton() {
        if (playBtn) {
            playBtn.classList.remove('hidden');
            playBtn.classList.add('flex');
        }
    }

    function hidePlayButton() {
        if (playBtn) {
            playBtn.classList.add('hidden');
            playBtn.classList.remove('flex');
        }
    }

    // Attempt to play; show tap-to-play button if autoplay is blocked (e.g. Low Power Mode)
    function tryPlay() {
        var playPromise = video.play();
        if (playPromise !== undefined) {
            playPromise.catch(function() {
                showPlayButton();
            });
        }
    }

    // Tap-to-play: user gesture bypasses Low Power Mode autoplay restriction
    if (playBtn) {
        playBtn.addEventListener('click', function() {
            video.muted = true;
            video.play().then(function() {
                hidePlayButton();
            }).catch(function() {
                // Video still can't play — keep button visible
            });
        });
    }

    // Hide play button once video is actually running
    video.addEventListener('playing', hidePlayButton);

    // If something pauses the video unexpectedly (e.g. iOS visibility change), restart it
    // This also prevents users from pausing once playing
    video.addEventListener('pause', function() {
        // Only force-resume if the document is visible (don't fight the OS on background tabs)
        if (!document.hidden) {
            video.play().catch(function() {
                // If force-resume fails (e.g. Low Power Mode re-engaged), show play button again
                showPlayButton();
            });
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

// Handle opening training accordion sections based on URL hash
function initTrainingAccordion() {
    // All sub-section IDs within training accordion sections
    const trainingIds = [
        'puppy-obedience',
        'basic-obedience',
        'board-train-non-ecollar',
        'behavior-modification',
        'ecollar-class',
        'board-train-ecollar',
        'man-tracking',
        'blood-tracking'
    ];

    function openSectionFromHash() {
        const hash = window.location.hash.substring(1);

        if (hash && trainingIds.includes(hash)) {
            const element = document.getElementById(hash);
            if (element) {
                // Open the parent details accordion if the element is inside one
                const detailsParent = element.closest('details');
                if (detailsParent) {
                    detailsParent.open = true;
                }

                // Scroll to the specific sub-section after a short delay
                setTimeout(() => {
                    element.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }, 100);
            }
        }
    }

    openSectionFromHash();
    window.addEventListener('hashchange', openSectionFromHash);
}

// Handle opening accordion sections based on URL hash
function initBoardingAccordion() {
    // List of boarding section IDs that can be opened via hash
    const boardingIds = [
        'check-in-out',
        'vaccinations',
        'medications',
        'food-requirements',
        'pricing',
        'accommodations'
    ];

    function openSectionFromHash() {
        const hash = window.location.hash.substring(1); // Remove the # character
        
        if (hash && boardingIds.includes(hash)) {
            const element = document.getElementById(hash);
            if (element) {
                // Check if it's a details element
                if (element.tagName === 'DETAILS') {
                    element.open = true;
                    
                    // Scroll to the element after a short delay to ensure it's fully expanded
                    setTimeout(() => {
                        element.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }, 50);
                }
            }
        }
    }

    // Open section on initial page load
    openSectionFromHash();

    // Listen for hash changes (e.g., if user clicks a link with a hash on the same page)
    window.addEventListener('hashchange', openSectionFromHash);
}

function initContactModal() {
    const modal = document.getElementById('contact-modal');
    if (!modal) return;

    const closeBtn = document.getElementById('contact-modal-close');

    function openModal(service) {
        // Reset form state so reopening always shows a fresh form
        const form = modal.querySelector('#contact-form');
        if (form) {
            const container = form.parentElement;
            const successEl = container ? container.querySelector('[data-fs-success]') : null;
            const globalErrorEl = container ? container.querySelector('[data-fs-error=""]') : null;

            form.style.display = '';
            form.reset();

            if (successEl) successEl.style.display = 'none';
            if (globalErrorEl) {
                globalErrorEl.style.display = 'none';
                globalErrorEl.textContent = '';
            }

            const submitBtn = form.querySelector('[data-fs-submit-btn]');
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Send Message';
            }

            if (service) {
                const serviceSelect = form.querySelector('[name="service"]');
                if (serviceSelect) {
                    serviceSelect.value = service;
                    serviceSelect.dispatchEvent(new Event('change'));
                }
            } else {
                const serviceSelect = form.querySelector('[name="service"]');
                if (serviceSelect) serviceSelect.dispatchEvent(new Event('change'));
            }
        }
        modal.showModal();
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', () => modal.close());
    }

    // Close when clicking the backdrop (outside the dialog panel)
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.close();
    });

    // Wire up all Contact buttons that carry the data attribute
    document.querySelectorAll('[data-open-contact-modal]').forEach((btn) => {
        btn.addEventListener('click', () => openModal(btn.dataset.service || ''));
    });
}

// Initialize all interactive features after components load
function initializePageFeatures() {
    initMobileMenu();
    initSmoothScroll();
    initContactForm();
    initContactModal();
    initCardAnimations();
    initHeroVideo();
    initFAQ();
    initImageCarousels();
    initBoardingAccordion();
    initTrainingAccordion();
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
