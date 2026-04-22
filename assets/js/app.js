/**
 * Portfolio Website - Main JavaScript
 * Handles comments, form validation, and UI interactions
 */

// Configuration
const CONFIG = {
    API_BASE_URL: 'api/comments.php', // Path relatif dari index.html
    POLLING_INTERVAL: 5000, // 5 detik
    MAX_COMMENT_LENGTH: 500,
};

let latestCommentId = 0;
let pollingTimer = null;

// =======================
// Utility Functions
// =======================

/**
 * Show notification message
 */
function showMessage(message, type = 'success') {
    const messageDiv = document.getElementById('formMessage');
    messageDiv.className = `mt-4 p-4 rounded-lg ${
        type === 'success' 
            ? 'bg-green-500/20 border border-green-500 text-green-400' 
            : 'bg-red-500/20 border border-red-500 text-red-400'
    }`;
    messageDiv.innerHTML = `<i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'} mr-2"></i>${message}`;
    messageDiv.classList.remove('hidden');
    
    setTimeout(() => {
        messageDiv.classList.add('hidden');
    }, 5000);
}

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Format timestamp (already formatted from backend, just display)
 */
function formatTimestamp(timestamp) {
    return timestamp; // Backend sudah format ke "X menit lalu"
}

// =======================
// Comments Functions
// =======================

/**
 * Fetch comments from API
 */
async function fetchComments() {
    try {
        const url = `${CONFIG.API_BASE_URL}?after_id=${latestCommentId}&limit=20`;
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.success && data.data.comments.length > 0) {
            renderComments(data.data.comments);
            // Update latest ID untuk polling berikutnya
            latestCommentId = Math.max(...data.data.comments.map(c => c.id));
        } else if (latestCommentId === 0) {
            // Tidak ada komentar sama sekali
            showEmptyState();
        }
    } catch (error) {
        console.error('Error fetching comments:', error);
        // Jangan tampilkan error ke user untuk polling background
    }
}

/**
 * Render comments to DOM
 */
function renderComments(comments) {
    const commentsList = document.getElementById('commentsList');
    const emptyState = document.getElementById('emptyState');
    
    // Hide empty state
    emptyState.classList.add('hidden');
    
    // Remove loading state
    const loadingState = commentsList.querySelector('.text-center');
    if (loadingState) {
        loadingState.remove();
    }
    
    // Render comments (newest first)
    comments.reverse().forEach(comment => {
        // Check if comment already exists
        if (document.getElementById(`comment-${comment.id}`)) {
            return;
        }
        
        const commentEl = createCommentElement(comment);
        commentsList.insertBefore(commentEl, commentsList.firstChild);
    });
}

/**
 * Create comment element
 */
function createCommentElement(comment) {
    const div = document.createElement('div');
    div.id = `comment-${comment.id}`;
    div.className = 'comment-item bg-gray-800/50 rounded-xl p-6 border border-gray-700 hover:border-teal-500/50 transition';
    
    div.innerHTML = `
        <div class="flex items-start space-x-4">
            <div class="flex-shrink-0">
                <div class="w-12 h-12 rounded-full bg-gradient-to-br from-teal-400 to-blue-500 flex items-center justify-center text-white font-bold">
                    ${escapeHtml(comment.name.charAt(0).toUpperCase())}
                </div>
            </div>
            <div class="flex-1">
                <div class="flex items-center justify-between mb-2">
                    <h4 class="font-semibold text-lg">${escapeHtml(comment.name)}</h4>
                    <span class="text-sm text-gray-400">
                        <i class="far fa-clock mr-1"></i>${formatTimestamp(comment.created_at)}
                    </span>
                </div>
                <p class="text-gray-300 leading-relaxed">${escapeHtml(comment.message)}</p>
            </div>
        </div>
    `;
    
    return div;
}

/**
 * Show empty state
 */
function showEmptyState() {
    const commentsList = document.getElementById('commentsList');
    const emptyState = document.getElementById('emptyState');
    
    commentsList.innerHTML = '';
    emptyState.classList.remove('hidden');
}

/**
 * Submit new comment
 */
async function submitComment(formData) {
    try {
        const response = await fetch(CONFIG.API_BASE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });
        
        const data = await response.json();
        
        if (data.success) {
            showMessage(data.data.message, 'success');
            
            // Add comment to list immediately
            renderComments([data.data.comment]);
            latestCommentId = Math.max(latestCommentId, data.data.comment.id);
            
            // Reset form
            document.getElementById('commentForm').reset();
            updateCharCount();
            
            return true;
        } else {
            showMessage(data.error, 'error');
            return false;
        }
    } catch (error) {
        console.error('Error submitting comment:', error);
        showMessage('Gagal mengirim komentar. Cek koneksi internet kamu.', 'error');
        return false;
    }
}

/**
 * Update character count
 */
function updateCharCount() {
    const textarea = document.getElementById('commentMessage');
    const charCount = document.getElementById('charCount');
    charCount.textContent = textarea.value.length;
    
    // Change color if approaching limit
    if (textarea.value.length > 450) {
        charCount.parentElement.classList.add('text-red-400');
    } else {
        charCount.parentElement.classList.remove('text-red-400');
    }
}

/**
 * Start polling for new comments
 */
function startPolling() {
    // Clear existing timer
    if (pollingTimer) {
        clearInterval(pollingTimer);
    }
    
    // Poll immediately
    fetchComments();
    
    // Then poll at intervals
    pollingTimer = setInterval(() => {
        fetchComments();
    }, CONFIG.POLLING_INTERVAL);
}

/**
 * Stop polling
 */
function stopPolling() {
    if (pollingTimer) {
        clearInterval(pollingTimer);
        pollingTimer = null;
    }
}

// =======================
// Event Listeners
// =======================

document.addEventListener('DOMContentLoaded', () => {
    
    // Enhanced Mobile Navigation
    let isMobileMenuOpen = false;

    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileNavOverlay = document.getElementById('mobileNavOverlay');
    const mobileNavBackdrop = document.getElementById('mobileNavBackdrop');
    const hamburgerIcon = document.getElementById('hamburgerIcon');
    const mobileNavLinks = document.querySelectorAll('#mobileNavMenu a');

    function toggleMobileMenu() {
        isMobileMenuOpen = !isMobileMenuOpen;

        if (isMobileMenuOpen) {
            // Open menu
            mobileNavOverlay.classList.remove('hidden');
            document.body.style.overflow = 'hidden'; // Lock scroll

            // Animate hamburger to X
            hamburgerIcon.innerHTML = `
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
            `;

            // Staggered animation for menu items
            mobileNavLinks.forEach((link, index) => {
                setTimeout(() => {
                    link.style.opacity = '1';
                    link.style.transform = 'translateY(0) scale(1)';
                }, index * 100);
            });

            // Focus management
            mobileNavLinks[0].focus();
        } else {
            // Close menu
            document.body.style.overflow = 'auto'; // Unlock scroll

            // Animate X to hamburger
            hamburgerIcon.innerHTML = `
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
            `;

            // Reset menu items
            mobileNavLinks.forEach(link => {
                link.style.opacity = '0';
                link.style.transform = 'translateY(20px) scale(0.9)';
            });

            // Hide overlay after animation
            setTimeout(() => {
                mobileNavOverlay.classList.add('hidden');
            }, 300);
        }

        // Update ARIA attributes
        mobileMenuBtn.setAttribute('aria-expanded', isMobileMenuOpen);
    }

    if (mobileMenuBtn && mobileNavOverlay) {
        mobileMenuBtn.addEventListener('click', toggleMobileMenu);

        // Close on backdrop click
        mobileNavBackdrop.addEventListener('click', toggleMobileMenu);

        // Close on ESC key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && isMobileMenuOpen) {
                toggleMobileMenu();
            }
        });

        // Close menu when clicking menu items
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (isMobileMenuOpen) toggleMobileMenu();
            });
        });
    }
    
    // Character counter for comment textarea
    const commentMessage = document.getElementById('commentMessage');
    if (commentMessage) {
        commentMessage.addEventListener('input', updateCharCount);
    }
    
    // Comment form submission
    const commentForm = document.getElementById('commentForm');
    if (commentForm) {
        commentForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const submitBtn = document.getElementById('submitBtn');
            const originalText = submitBtn.innerHTML;
            
            // Disable button and show loading
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Mengirim...';
            
            // Get form data
            const formData = {
                name: document.getElementById('commentName').value.trim(),
                email: document.getElementById('commentEmail').value.trim(),
                message: document.getElementById('commentMessage').value.trim(),
            };
            
            // Validate
            if (!formData.name) {
                showMessage('Nama wajib diisi', 'error');
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
                return;
            }
            
            if (!formData.message) {
                showMessage('Pesan wajib diisi', 'error');
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
                return;
            }
            
            if (formData.message.length > CONFIG.MAX_COMMENT_LENGTH) {
                showMessage(`Pesan terlalu panjang (max ${CONFIG.MAX_COMMENT_LENGTH} karakter)`, 'error');
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
                return;
            }
            
            // Submit
            await submitComment(formData);
            
            // Re-enable button
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
        });
    }
    
    // Start polling for comments
    startPolling();
    
    // Stop polling when page is hidden (battery saving)
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            stopPolling();
        } else {
            startPolling();
        }
    });
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 80; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Animate skill progress bars on scroll
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressBars = entry.target.querySelectorAll('.progress-fill');
                progressBars.forEach(bar => {
                    const width = bar.style.width;
                    bar.style.width = '0%';
                    setTimeout(() => {
                        bar.style.width = width;
                    }, 100);
                });
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    const skillsSection = document.getElementById('skills');
    if (skillsSection) {
        observer.observe(skillsSection);
    }
    
    // Navbar background on scroll
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(11, 16, 32, 0.95)';
        } else {
            navbar.style.background = 'rgba(11, 16, 32, 0.8)';
        }
    });
});

// =======================
// Alternative: WebSocket Implementation (commented out)
// =======================

/*
// Untuk migrasi ke WebSocket, uncomment dan sesuaikan:

let socket = null;

function initWebSocket() {
    socket = new WebSocket('ws://localhost:8080');
    
    socket.onopen = () => {
        console.log('WebSocket connected');
    };
    
    socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === 'new_comment') {
            renderComments([data.comment]);
            latestCommentId = Math.max(latestCommentId, data.comment.id);
        }
    };
    
    socket.onerror = (error) => {
        console.error('WebSocket error:', error);
    };
    
    socket.onclose = () => {
        console.log('WebSocket disconnected. Reconnecting...');
        setTimeout(initWebSocket, 3000);
    };
}

// Replace startPolling() with:
// initWebSocket();
*/

// =======================
// PWA Service Worker (Optional)
// =======================

/*
// Untuk membuat PWA, tambahkan file service-worker.js dan manifest.json
// Uncomment code berikut:

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
            .then(reg => console.log('Service Worker registered'))
            .catch(err => console.error('Service Worker registration failed:', err));
    });
}
*/

// =======================
// Enhanced Popup Interactions and Scroll Reveals
// =======================

/**
 * Enhanced skill popup modal functions with animations
 */
function openSkillPopup(element) {
    const modal = document.getElementById('skillModal');
    const skillName = document.getElementById('skillName');
    const skillDescription = document.getElementById('skillDescription');
    const skillLevel = document.getElementById('skillLevel');
    const skillIcon = document.getElementById('skillIcon');

    // Get data from clicked element
    const name = element.getAttribute('data-name');
    const description = element.getAttribute('data-description');
    const level = element.getAttribute('data-level');

    // Set modal content
    skillName.textContent = name;
    skillDescription.textContent = description;
    skillLevel.textContent = level;

    // Set icon based on skill
    const iconMap = {
        'Tailwind CSS': 'fa-palette',
        'CSS': 'fa-css3-alt',
        'UI/UX Design': 'fa-pencil-ruler',
        'Figma': 'fa-figma',
        'Laravel': 'fa-laravel',
        'MySQL': 'fa-database',
        'JavaScript': 'fa-js-square',
        'HTML5': 'fa-html5',
        'PHP': 'fa-php',
        'VS Code': 'fa-code',
        'Roblox Studio': 'fa-gamepad'
    };
    skillIcon.className = `fas ${iconMap[name] || 'fa-code'} text-3xl sm:text-4xl text-white`;

    // Show modal with enhanced animations
    modal.classList.remove('hidden');
    modal.classList.add('flex');

    // Add entrance animation
    setTimeout(() => {
        modal.querySelector('.modal-content').classList.add('animate__animated', 'animate__zoomIn');
    }, 10);

    document.body.style.overflow = 'hidden';
}

function closeSkillPopup() {
    const modal = document.getElementById('skillModal');
    const modalContent = modal.querySelector('.modal-content');

    // Add exit animation
    modalContent.classList.remove('animate__zoomIn');
    modalContent.classList.add('animate__zoomOut');

    setTimeout(() => {
        modal.classList.remove('flex');
        modal.classList.add('hidden');
        modalContent.classList.remove('animate__zoomOut');
        document.body.style.overflow = 'auto';
    }, 300);
}

/**
 * Staggered scroll reveal animations
 */
function initScrollReveals() {
    const sections = document.querySelectorAll('section');
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Add staggered delay for child elements
                const children = entry.target.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right');
                children.forEach((child, childIndex) => {
                    setTimeout(() => {
                        child.classList.add('visible');
                    }, childIndex * 150); // 150ms stagger
                });

                // Unobserve after animation
                sectionObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        sectionObserver.observe(section);
    });
}

/**
 * Enhanced hover effects for interactive elements
 */
function initHoverEffects() {
    // Add lift effect to cards
    const cards = document.querySelectorAll('.card-hover');
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px) scale(1.02)';
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Add glow effect to glow-hover elements
    const glowElements = document.querySelectorAll('.glow-hover');
    glowElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            element.style.boxShadow = '0 0 30px rgba(45, 212, 191, 0.6), 0 0 60px rgba(45, 212, 191, 0.3)';
        });

        element.addEventListener('mouseleave', () => {
            element.style.boxShadow = '0 0 20px rgba(45, 212, 191, 0.3)';
        });
    });
}

/**
 * Smooth reveal for main heading
 */
function initHeadingReveal() {
    const heading = document.querySelector('#home h1');
    if (heading) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    heading.style.opacity = '1';
                    heading.style.transform = 'translateY(0)';
                    observer.unobserve(heading);
                }
            });
        }, { threshold: 0.5 });

        // Initial state
        heading.style.opacity = '0';
        heading.style.transform = 'translateY(30px)';
        heading.style.transition = 'opacity 1s ease, transform 1s ease';

        observer.observe(heading);
    }
}

// Initialize enhanced features when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Existing initialization code...

    // Initialize new enhanced features
    initScrollReveals();
    initHoverEffects();
    initHeadingReveal();

    // Enhanced skill popup event listeners
    const skillModal = document.getElementById('skillModal');
    if (skillModal) {
        skillModal.addEventListener('click', (e) => {
            if (e.target === e.currentTarget) closeSkillPopup();
        });
    }

    // Enhanced certificate modal functions
    window.openCertificate = function(imageSrc, title, description, validity) {
        document.getElementById("modalImage").src = imageSrc;
        document.getElementById("modalTitle").innerText = title;
        document.getElementById("modalDescription").innerText = description;
        document.getElementById("modalValidity").innerText = validity;
        document.getElementById("certificateModal").style.display = "flex";

        // Add entrance animation
        const modal = document.getElementById("certificateModal");
        setTimeout(() => {
            modal.classList.add('animate__animated', 'animate__fadeIn');
        }, 10);
    };

    window.closeCertificate = function() {
        const modal = document.getElementById("certificateModal");
        modal.classList.remove('animate__fadeIn');
        modal.classList.add('animate__fadeOut');

        setTimeout(() => {
            modal.style.display = "none";
            modal.classList.remove('animate__fadeOut');
        }, 300);
    };

    // Enhanced window click handler
    window.onclick = function(event) {
        const certModal = document.getElementById("certificateModal");
        if (event.target === certModal) closeCertificate();
    };
});

console.log('Portfolio app initialized ✨');
