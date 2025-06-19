document.addEventListener("DOMContentLoaded", () => {
    new Gallery();
    initMobileMenu();
});

// -- COUNTDOWN TIMER --
const daysElement = document.getElementById("days");
const hoursElement = document.getElementById("hours");
const minutesElement = document.getElementById("minutes");
const secondsElement = document.getElementById("seconds");

const releaseDate = new Date("2025-06-16T20:00:00");

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

// -- SMOOTH SCROLLING --
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
})

// -- VIDEO MODAL --
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
btnPlayVideo.addEventListener("click", openModal);
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
document.getElementById('name').addEventListener('blur', function() {
    validateField(this, patterns.name, 'Name should be 2-30 characters long, letters only');
});

document.getElementById('email').addEventListener('blur', function() {
    validateField(this, patterns.email, 'Please enter a valid email address');
});

document.getElementById('platform').addEventListener('change', function() {
    validateField(this);
});

document.getElementById('btnReset').addEventListener('click', function(e) {
    e.preventDefault();
    form.reset();
    document.querySelectorAll('input, select, textarea').forEach(field => {
        field.classList.remove('error', 'success');
        errorElement.classList.remove('show');
    });
});

// Form submission
form.addEventListener('submit', async function(e) {
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
anime({
    targets: '.logo',
    translateY: -20,
    opacity: [0, 1],
    duration: 1500,
    easing: 'easeInOutQuad'
});

anime({
    targets: '.feature-card',
    translateY: [50, 0],
    opacity: [0, 1],
    delay: anime.stagger(200),
});

