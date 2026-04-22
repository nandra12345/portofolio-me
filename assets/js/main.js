// Progress Bar Animation
const bars = document.querySelectorAll(".progress-fill");
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const progress = entry.target.dataset.progress;
            entry.target.style.width = progress + "%";
        }
    });
}, { threshold: 0.3 });

bars.forEach(bar => {
    bar.style.width = "0%";
    observer.observe(bar);
});

// Certificate Modal Functions
function openCertificate(imageSrc) {
    const modal = document.getElementById('certificateModal');
    const img = document.getElementById('certificateImage');
    img.src = imageSrc;
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    document.body.style.overflow = 'hidden'; // Prevent scroll
}

function closeCertificate() {
    const modal = document.getElementById('certificateModal');
    modal.classList.remove('flex');
    modal.classList.add('hidden');
    document.body.style.overflow = 'auto'; // Enable scroll
}

// Close modal when clicking outside
const modal = document.getElementById('certificateModal');
if (modal) {
    modal.addEventListener('click', (e) => {
        if (e.target === e.currentTarget) closeCertificate();
    });
}

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            // Close mobile menu if open
            if (mobileMenu) {
                mobileMenu.classList.add('hidden');
            }
        }
    });
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (mobileMenu && mobileMenuBtn) {
        if (!mobileMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
            mobileMenu.classList.add('hidden');
        }
    }
});

// Handle escape key to close modal
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeCertificate();
        closeSkillPopup();
    }
});

// Skill Popup Modal Functions
function openSkillPopup(element) {
    const modal = document.getElementById('skillModal');
    const skillName = document.getElementById('skillName');
    const skillDescription = document.getElementById('skillDescription');
    const skillLevel = document.getElementById('skillLevel');
    const skillIcon = document.getElementById('skillIcon');
    const skillLevelBar = document.getElementById('skillLevelBar');

    const name = element.getAttribute('data-name');
    const description = element.getAttribute('data-description');
    const level = element.getAttribute('data-level');

    const progressMap = { 'Beginner': 40, 'Intermediate': 70, 'Advanced': 85, 'Expert': 95 };
    const progressPercent = progressMap[level] || 50;

    skillName.textContent = name;
    skillDescription.textContent = description;
    skillLevel.textContent = level;

    setTimeout(() => { skillLevelBar.style.width = progressPercent + '%'; }, 100);

    const iconMap = {
        'JavaScript': 'fa-js-square', 'HTML5': 'fa-html5', 'PHP': 'fa-php',
        'VS Code': 'fa-code', 'Roblox Studio': 'fa-gamepad',
        'Tailwind CSS': 'fa-palette', 'CSS': 'fa-css3-alt',
        'UI/UX Design': 'fa-pencil-ruler', 'Figma': 'fa-figma',
        'Laravel': 'fa-laravel', 'MySQL': 'fa-database'
    };
    skillIcon.className = `fas ${iconMap[name] || 'fa-code'} text-3xl sm:text-4xl text-white skill-icon-element`;

    modal.classList.remove('hidden', 'closing');
    modal.classList.add('flex');
    document.body.style.overflow = 'hidden';
}

function closeSkillPopup() {
    const modal = document.getElementById('skillModal');
    const skillLevelBar = document.getElementById('skillLevelBar');

    modal.classList.add('closing');
    skillLevelBar.style.width = '0%';

    setTimeout(() => {
        modal.classList.remove('flex', 'closing');
        modal.classList.add('hidden');
        document.body.style.overflow = 'auto';
    }, 300);
}

// Close skill modal when clicking outside
const skillModal = document.getElementById('skillModal');
if (skillModal) {
    skillModal.addEventListener('click', (e) => {
        if (e.target === e.currentTarget) closeSkillPopup();
    });
}

// Lazy Loading Images
const lazyImages = document.querySelectorAll('.lazy-image');
const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.add('loaded');
            observer.unobserve(img);
        }
    });
}, { threshold: 0.1 });

lazyImages.forEach(img => {
    imageObserver.observe(img);
});

// Scroll Animations
const scrollElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right');
const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.1 });

scrollElements.forEach(el => {
    scrollObserver.observe(el);
});

// Typing Animation
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.textContent = '';
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    type();
}

// Initialize typing animation when page loads
document.addEventListener('DOMContentLoaded', () => {
    const typingElement = document.querySelector('.typing');
    if (typingElement) {
        const text = typingElement.textContent;
        typeWriter(typingElement, text, 150);
    }
});

// Enhanced Hover Effects
const hoverElements = document.querySelectorAll('.glow-hover');
hoverElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
        el.style.transform = 'scale(1.05)';
    });
    el.addEventListener('mouseleave', () => {
        el.style.transform = 'scale(1)';
    });
});

// --- Generate particle dots ---
const particleContainer = document.getElementById('particles');
for (let i = 0; i < 60; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.style.top = Math.random() * 100 + '%';
    p.style.left = Math.random() * 100 + '%';
    p.style.animationDuration = 8 + Math.random() * 6 + 's';
    p.style.background = Math.random() > 0.5 ? 'rgba(20,184,166,0.8)' : 'rgba(236,72,153,0.8)';
    p.style.boxShadow = `0 0 15px ${p.style.background}`;
    particleContainer.appendChild(p);
}

// --- Parallax effect for mouse movement ---
const grid = document.querySelector('.bg-grid');
const glow = document.getElementById('glow');
document.addEventListener('mousemove', e => {
    const x = (e.clientX / window.innerWidth - 0.5) * 20;
    const y = (e.clientY / window.innerHeight - 0.5) * 20;
    grid.style.transform = `translate(${x}px, ${y}px) scale(1.05)`;
    glow.style.transform = `translate(${x * -0.3}px, ${y * -0.3}px)`;
});

// --- Parallax scroll depth ---
window.addEventListener('scroll', () => {
    const scrollY = window.scrollY * 0.1;
    grid.style.transform = `translateY(${scrollY}px)`;
    glow.style.transform = `translateY(${scrollY * -0.5}px)`;
});

// Mobile Menu Functionality
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileNavOverlay = document.getElementById('mobileNavOverlay');
const mobileNavMenu = document.getElementById('mobileNavMenu');
const hamburgerIcon = document.getElementById('hamburgerIcon');

if (mobileMenuBtn && mobileNavOverlay && mobileNavMenu && hamburgerIcon) {
    mobileMenuBtn.addEventListener('click', () => {
        const isOpen = !mobileNavOverlay.classList.contains('hidden');
        if (isOpen) {
            mobileNavOverlay.classList.add('hidden');
            hamburgerIcon.innerHTML = '<line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line>';
        } else {
            mobileNavOverlay.classList.remove('hidden');
            hamburgerIcon.innerHTML = '<line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>';
        }
    });

    // Close mobile menu when clicking outside
    mobileNavOverlay.addEventListener('click', (e) => {
        if (e.target === mobileNavOverlay) {
            mobileNavOverlay.classList.add('hidden');
            hamburgerIcon.innerHTML = '<line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line>';
        }
    });
}
