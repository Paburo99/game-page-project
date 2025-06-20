// -- COUNTDOWN TIMER --
function initCountdown() {
    const daysElement = document.getElementById("days");
    const hoursElement = document.getElementById("hours");
    const minutesElement = document.getElementById("minutes");
    const secondsElement = document.getElementById("seconds");

    const releaseDate = new Date("2025-07-16T20:00:00");

    function updateCountdown() {
        const now = new Date();
        const timeDifference = releaseDate.getTime() - now.getTime(); //milliseconds

        if (timeDifference > 0) {
            const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
            const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

            daysElement.textContent = String(days).padStart(2, "0");
            hoursElement.textContent = String(hours).padStart(2, "0");
            minutesElement.textContent = String(minutes).padStart(2, "0");
            secondsElement.textContent = String(seconds).padStart(2, "0");
        } else {
            clearInterval(timerInterval);
            document.querySelector(".countdown-timer").innerHTML = "<h3>The Game is Out Now!</h3>";
        }
    }

    const timerInterval = setInterval(updateCountdown, 1000);
}

// -- SMOOTH SCROLLING --
function initSmoothScrolling() {
    const nav = document.querySelector("header nav");

    nav.addEventListener("click", (event) => {
        if (event.target.tagName === "A") {
            event.preventDefault();

            const href = event.target.getAttribute("href");
            const targetSection = document.querySelector(href);

            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: "smooth"
                });
            }
        }
    });
}

// -- VIDEO MODAL --
function initVideoModal() {
    const playVideoBtn = document.getElementById("btnPlayVideo");
    const videoModal = document.getElementById("videoModal");
    const videoPlayer = document.getElementById("videoPlayer");
    const btnClose = document.getElementById("btnClose");

    function openModal() {
        videoModal.classList.add("active");
        document.body.classList.add("modal-open");
        videoPlayer.play();
    }

    function closeModal() {
        videoModal.classList.remove("active");
        document.body.classList.remove("modal-open");
        videoPlayer.pause();
    }

    // Event listeners
    playVideoBtn.addEventListener("click", openModal);
    btnClose.addEventListener("click", closeModal);

    videoModal.addEventListener("click", (e) => {
        if (e.target === videoModal) {
            closeModal();
        }
    });

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && videoModal.classList.contains("active")) {
            closeModal();
        }
    });

    document.querySelector(".video-container").addEventListener("click", (e) => {
        e.stopPropagation();
    });
}

// -- GALLERY FUNCTIOANLITY --
class Gallery {
    constructor() {
        this.currentIndex = 0;
        this.images = document.querySelectorAll(".thumbnail");
        this.totalImages = this.images.length;
        this.background = document.getElementById("galleryBackground");
        this.currentImageSpan = document.getElementById("currentImage");
        this.totalImagesSpan = document.getElementById("totalImages");

        this.init();
    }

    init() {
        // Set initial background
        this.updateBackground();
        this.updateCounter();

        // Event listeners
        document.getElementById("btnPrev").addEventListener("click", () => this.previousImage());
        document.getElementById("btnNext").addEventListener("click", () => this.nextImage());
        document.getElementById("btnDownload").addEventListener("click", () => this.downloadImage());

        // Thumbnail click events
        this.images.forEach((thumbnail, index) => {
            thumbnail.addEventListener("click", () => this.selectImage(index));
        });

        // Keyboard navigation
        document.addEventListener("keydown", (e) => {
            if (e.key === "ArrowLeft") this.previousImage();
            if (e.key === "ArrowRight") this.nextImage();
        });

        // Image hover effects for navigation buttons
        this.setupImageHoverEffects();
    }

    updateBackground() {
        const currentImage = this.images[this.currentIndex];
        const imageUrl = currentImage.dataset.image;
        this.background.style.backgroundImage = `url('${imageUrl}')`;

        this.images.forEach(img => img.classList.remove("active"));
        currentImage.classList.add("active");
    }

    updateCounter() {
        this.currentImageSpan.textContent = this.currentIndex + 1;
        this.totalImagesSpan.textContent = this.totalImages;
    }

    selectImage(index) {
        this.currentIndex = index;
        this.updateBackground();
        this.updateCounter();
    }

    nextImage() {
        this.currentIndex = (this.currentIndex + 1) % this.totalImages;
        this.updateBackground();
        this.updateCounter();
    }

    previousImage() {
        this.currentIndex = (this.currentIndex - 1 + this.totalImages) % this.totalImages;
        this.updateBackground();
        this.updateCounter();
    }

    downloadImage() {
        const currentImage = this.images[this.currentIndex];
        const imageUrl = currentImage.dataset.image;
        const link = document.createElement("a");
        link.href = imageUrl;
        link.download = `gallery-image-${this.currentIndex + 1}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    setupImageHoverEffects() {
        const prevBtn = document.getElementById("btnPrev");
        const nextBtn = document.getElementById("btnNext");
        const prevImg = prevBtn.querySelector("img");
        const nextImg = nextBtn.querySelector("img");

        // prevBtn
        prevBtn.addEventListener("mouseenter", () => {
            prevImg.src = "assets/img/btn-prev-2.png";
        });
        prevBtn.addEventListener("mouseleave", () => {
            prevImg.src = "assets/img/btn-prev-1.png";
        });

        // nextBtn
        nextBtn.addEventListener("mouseenter", () => {
            nextImg.src = "assets/img/btn-next-2.png";
        });
        nextBtn.addEventListener("mouseleave", () => {
            nextImg.src = "assets/img/btn-next-1.png";
        });
    }
}

// -- FORM VALIDATION --
const form = document.getElementById("preorderForm");
const btnSubmit = document.getElementById("btnSubmit");
const submitText = document.getElementById("submitText");
const loading = document.getElementById("loading");
const successMessage = document.getElementById("successMessage");

const patterns = {
    name: /^[a-zA-Z]{2,30}$/,
    email: /^[a-zA-Z0-9.-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,10}$/
}

// Real-time validation
function validateField(field, pattern, customMessage) {
    const value = field.value.trim();
    const errorElement = document.getElementById(`${field.id}Error`);

    if (field.hasAttribute('required') && !value) {
        showError(field, errorElement, 'This field is required')
        return false;
    }

    if (value && pattern && !pattern.test(value)) {
        showError(field, errorElement, customMessage || 'Invalid format');
        return false;
    }

    showSuccess(field, errorElement);
    return true;
}

function showError(field, errorElement, message) {
    field.classList.remove('success');
    field.classList.add('error');
    errorElement.textContent = message;
    errorElement.classList.add('show');
}

function showSuccess(field, errorElement) {
    field.classList.remove('error');
    field.classList.add('success');
    errorElement.classList.remove('show');
}

// Event listeners (Validation)
document.getElementById('name').addEventListener('blur', function () {
    validateField(this, patterns.name, 'Name should be 2-30 characters long, letters only');
});

document.getElementById('email').addEventListener('blur', function () {
    validateField(this, patterns.email, 'Please enter a valid email address');
});

document.getElementById('platform').addEventListener('change', function () {
    validateField(this);
});

document.getElementById('btnReset').addEventListener('click', function (e) {
    e.preventDefault();
    form.reset();
    document.querySelectorAll('input, select, textarea').forEach(field => {
        field.classList.remove('error', 'success');
        errorElement.classList.remove('show');
    });
});

// Form submission
form.addEventListener('submit', async function (e) {
    e.preventDefault();

    // Disable submit button and show loading
    btnSubmit.disabled = true;
    submitText.style.opacity = 0;
    loading.style.display = 'block';
    document.getElementById('information-fieldset').style.opacity = 0;
    document.getElementById('interest-fieldset').style.opacity = 0;
    document.getElementById('comments-fieldset').style.opacity = 0;

    setTimeout(() => {
        btnSubmit.disabled = false;
        submitText.style.opacity = 1;
        loading.style.display = 'none';
        document.getElementById('information-fieldset').style.opacity = 1;
        document.getElementById('interest-fieldset').style.opacity = 1;
        document.getElementById('comments-fieldset').style.opacity = 1;

        successMessage.classList.add('show');
        form.reset();

        document.querySelectorAll('input, select, textarea').forEach(field => {
            field.classList.remove('error', 'success');
        });

        setTimeout(() => {
            successMessage.classList.remove('show');
        }, 5000);
    }, 2000);
});

// -- MOBILE NAVIGATION --
function initMobileMenu() {
    const mobileToggle = document.getElementById("mobileMenuToggle");
    const mainNav = document.getElementById("mainNav");
    const mobileOverlay = document.getElementById("mobileOverlay");
    const navLinks = document.querySelectorAll(".main-nav a");

    // Toggle mobile menu
    function toggleMobileMenu() {
        const isActive = mobileToggle.classList.contains("active");

        if (isActive) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    }

    function openMobileMenu() {
        mobileToggle.classList.add("active");
        mainNav.classList.add("mobile-active");
        mobileOverlay.classList.add("active");
        document.body.style.overflow = "hidden";
    }

    function closeMobileMenu() {
        mobileToggle.classList.remove("active");
        mainNav.classList.remove("mobile-active");
        mobileOverlay.classList.remove("active");
        document.body.style.overflow = "";
    }

    // Event listeners
    mobileToggle.addEventListener("click", toggleMobileMenu);
    mobileOverlay.addEventListener("click", closeMobileMenu);

    navLinks.forEach(link => {
        link.addEventListener("click", closeMobileMenu);
    });

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && mobileToggle.classList.contains("active")) {
            closeMobileMenu();
        }
    });

    window.addEventListener("resize", () => {
        if (window.innerWidth > 767 && mobileToggle.classList.contains("active")) {
            closeMobileMenu();
        }
    });
}

// -- ANIMATION --
function initAnimations() {

    const heroTitle = document.querySelector('.hero-content h1');
    const splitHeroTitle = new SplitText(heroTitle, { type: "chars" });
    const heroText = document.querySelector('.hero-content p');
    const splitHeroText = new SplitText(heroText, { type: "chars" });

    /* Header and Hero Animation Timeline */
    const timeline = gsap.timeline({ defaults: { opacity: 0, ease: 'power2.out', duration: 0.8 } });

    timeline
        .from('.header-container .logo', {
            y: '-2rem',
        }, '<0.2')
        .from('.header-container .mobile-menu-toggle', {
            y: '-2rem',
        }, '<0.2')
        .from('.header-container .main-nav ul li', {
            y: '-2rem',
            stagger: 0.15,
        }, '<')
        .from(splitHeroTitle.chars, {
            duration: 1,
            opacity: 0,
            y: 'random(-20rem, 20rem)',
            rotation: 'random(-30deg, 30deg)',
            ease: "power2.out",
            stagger: 0.15,
            /* onComplete: () => {
                splitHeroTitle.chars.forEach(char => {
                    gsap.to(char, {
                        y: 'random(-1.5rem, 1.5rem)',
                        rotation: 'random(-5, 5)',
                        duration: 'random(3, 4)',
                        ease: 'sine.inOut',
                        repeat: -1,
                        yoyo: true
                    });
                });
            } */
        }, '<')
        .from(splitHeroText.chars, {
            duration: 0.5,
            opacity: 0,
            y: 'random(-20rem, 20rem)',
            rotation: 'random(-30deg, 30deg)',
            ease: "power2.out",
            stagger: 0.05,
        }, '<')
        .from('#hero .hero-content .btn-play-video', {
            y: '-2rem',
        }, '<0.2')
        .from('#hero .hero-content .countdown-timer', {
            scale: 0.5,
        }, '<0.2')
        .from('#hero .hero-content .countdown-timer .timer-segment', {
            stagger: 0.15,
            y: 20,
        }, '<0.2')
        .from('#hero .hero-content .btn-primary', {
            y: '-2rem',
        }, '<0.2');

    /* Section Scroll Trigger */
    const sections = document.querySelectorAll('section:not(#hero, #features)');

    sections.forEach(section => {
        gsap.from(section, {
            scrollTrigger: {
                trigger: section,
                start: 'top 80%',
                end: 'bottom 90%',
            },
            opacity: 0,
            y: '10rem',
            duration: 1,
            ease: 'power3.out'
        });
    });

    /* Special Scroll Trigger for Features Section */
    /* Scrubbed animation for smooth scroll-based movement */
    gsap.from('.feature-card', {
        scrollTrigger: {
            trigger: '.features-grid',
            start: 'top 80%',
            end: 'bottom 90%',
            scrub: true
        },
        y: '5rem',
        stagger: {
            each: 0.2,
            from: 'start'
        }
    });

    /* Toggle-based animation for opacity effects */
    gsap.from('.feature-card', {
        scrollTrigger: {
            trigger: '.features-grid',
            start: 'top 90%',
            end: 'bottom 10%',
            toggleActions: 'play reverse play reverse',
        },
        opacity: 0,
        duration: 0.8,
        stagger: {
            each: 0.15,
            from: 'start'
        },
    });

    /* Features Card Animation */
    const featuresCard = document.querySelectorAll('.feature-card');
    const featuresGrid = document.querySelector('.features-grid');

    gsap.set(featuresGrid, { perspective: '100rem' });
    gsap.set(featuresCard, { transformStyle: 'preserve-3d' });

    featuresCard.forEach(card => {
        card.addEventListener("mousemove", e => {
            const rect = e.currentTarget.getBoundingClientRect();

            // Position relative to the center of the card (-0.5 to 0.5)
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            const z = (x * y);

            // Map mouse position to rotation angle
            const maxTilt = 10;
            const tiltX = y * -maxTilt;
            const tiltY = x * maxTilt;
            const tiltZ = z * maxTilt;

            gsap.to(card, {
                rotateX: tiltX,
                rotateY: tiltY,
                rotateZ: tiltZ,
                duration: 0.4,
                ease: "power2.out",
                overwrite: "auto"
            });
        });

        card.addEventListener("mouseleave", () => {
            gsap.to(card, {
                rotateX: 0,
                rotateY: 0,
                rotateZ: 0,
                duration: 0.8,
                ease: 'elastic.out(1, 0.5)',
                overwrite: 'auto'
            });
        });
    });

}

// -- DOM INITIALIZATION --
document.addEventListener('DOMContentLoaded', () => {
    gsap.registerPlugin(Flip, ScrollTrigger, TextPlugin, SplitText, CustomEase, CustomWiggle);
    initCountdown();
    initSmoothScrolling();
    initVideoModal();
    new Gallery();
    initMobileMenu();
    initAnimations();
});