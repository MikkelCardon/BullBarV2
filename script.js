// Google Maps redirect functionality
function openGoogleMaps() {
    // Copenhagen coordinates - you can update this with the exact address
    const latitude = 55.6760968;
    const longitude = 12.5683672;
    const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
    window.open(url, '_blank');
}

// Smooth scrolling for navigation links
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

// Add fun entrance animations and interactive elements
document.addEventListener('DOMContentLoaded', function() {
    // Header scroll hide/show functionality (especially for mobile)
    let lastScrollY = window.scrollY;
    let ticking = false;
    const header = document.querySelector('header');

    function updateHeader() {
        const currentScrollY = window.scrollY;
        const scrollThreshold = 50; // Start hiding after scrolling 50px
        
        if (header) {
            // Always show header at the top
            if (currentScrollY < scrollThreshold) {
                header.classList.remove('header-hidden');
                header.classList.remove('header-visible');
                lastScrollY = currentScrollY;
                ticking = false;
                return;
            }
            
            // Hide header when scrolling down, show when scrolling up
            if (currentScrollY > lastScrollY && currentScrollY > scrollThreshold) {
                // Scrolling down - hide header
                header.classList.add('header-hidden');
                header.classList.remove('header-visible');
            } else if (currentScrollY < lastScrollY) {
                // Scrolling up - show header
                header.classList.remove('header-hidden');
                header.classList.add('header-visible');
            }
        }
        
        lastScrollY = currentScrollY;
        ticking = false;
    }

    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateHeader);
            ticking = true;
        }
    }

    // Add scroll listener for header hide/show (works on all devices, optimized for mobile)
    if (header) {
        window.addEventListener('scroll', requestTick, { passive: true });
    }
    // Animate elements on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe pricing cards
    document.querySelectorAll('.pricing-card').forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = `all 0.6s ease ${index * 0.1}s`;
        observer.observe(card);
    });

    // Observe menu categories
    document.querySelectorAll('.menu-category').forEach((category, index) => {
        category.style.opacity = '0';
        category.style.transform = 'translateY(30px)';
        category.style.transition = `all 0.6s ease ${index * 0.1}s`;
        observer.observe(category);
    });

    // Add hover bounce to buttons
    document.querySelectorAll('.book-button').forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.05)';
        });
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Add fun cursor effect for cards
    document.querySelectorAll('.pricing-card, .menu-category, .game-card').forEach(card => {
        card.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            this.style.setProperty('--mouse-x', `${x}px`);
            this.style.setProperty('--mouse-y', `${y}px`);
        });
    });

    // Map container functionality
    const mapContainer = document.querySelector('.map-container');
    const mapOverlay = document.querySelector('.map-overlay');
    
    if (mapContainer) {
        // Make the overlay clickable
        if (mapOverlay) {
            mapOverlay.addEventListener('click', openGoogleMaps);
        }
        
        // Also make the container clickable (for mobile/touch devices)
        mapContainer.addEventListener('click', function(e) {
            // Don't trigger if clicking on a link
            if (e.target.tagName !== 'A') {
                openGoogleMaps();
            }
        });
    }

    // Games Carousel functionality
    initCarousel();
});

// Games Carousel
function initCarousel() {
    const slides = document.querySelectorAll('.carousel-slide');
    const indicators = document.querySelectorAll('.carousel-indicator');
    const prevBtn = document.querySelector('.carousel-btn-prev');
    const nextBtn = document.querySelector('.carousel-btn-next');
    
    if (!slides.length) return;

    let currentSlide = 0;
    const totalSlides = slides.length;
    let autoPlayInterval;

    // Function to show a specific slide with smooth transition
    function showSlide(index) {
        // Remove active class from all slides and indicators
        slides.forEach(slide => {
            slide.classList.remove('active');
            slide.style.opacity = '0';
        });
        indicators.forEach(indicator => indicator.classList.remove('active'));

        // Add active class to current slide and indicator with fade effect
        setTimeout(() => {
            slides[index].classList.add('active');
            slides[index].style.opacity = '1';
            if (indicators[index]) {
                indicators[index].classList.add('active');
                // Fun bounce effect
                indicators[index].style.transform = 'scale(1.4)';
                setTimeout(() => {
                    indicators[index].style.transform = 'scale(1.3)';
                }, 200);
            }
        }, 50);

        currentSlide = index;
    }

    // Function to go to next slide
    function nextSlide() {
        const next = (currentSlide + 1) % totalSlides;
        showSlide(next);
    }

    // Function to go to previous slide
    function prevSlide() {
        const prev = (currentSlide - 1 + totalSlides) % totalSlides;
        showSlide(prev);
    }

    // Event listeners for navigation buttons
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            nextSlide();
            resetAutoPlay();
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            prevSlide();
            resetAutoPlay();
        });
    }

    // Event listeners for indicators
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            showSlide(index);
            resetAutoPlay();
        });
    });

    // Auto-play functionality
    function startAutoPlay() {
        autoPlayInterval = setInterval(nextSlide, 4000); // Change slide every 4 seconds - faster pace
    }

    function stopAutoPlay() {
        if (autoPlayInterval) {
            clearInterval(autoPlayInterval);
        }
    }

    function resetAutoPlay() {
        stopAutoPlay();
        startAutoPlay();
    }

    // Pause auto-play on hover
    const carouselContainer = document.querySelector('.carousel-container');
    if (carouselContainer) {
        carouselContainer.addEventListener('mouseenter', stopAutoPlay);
        carouselContainer.addEventListener('mouseleave', startAutoPlay);
    }

    // Touch/swipe support for mobile
    let touchStartX = 0;
    let touchEndX = 0;

    const carouselWrapper = document.querySelector('.carousel-wrapper');
    if (carouselWrapper) {
        carouselWrapper.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });

        carouselWrapper.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        });
    }

    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
            resetAutoPlay();
        }
    }

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (document.querySelector('.carousel-container')) {
            if (e.key === 'ArrowLeft') {
                prevSlide();
                resetAutoPlay();
            } else if (e.key === 'ArrowRight') {
                nextSlide();
                resetAutoPlay();
            }
        }
    });

    // Start auto-play
    startAutoPlay();
}

