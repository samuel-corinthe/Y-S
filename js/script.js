/**
 * ============================================================================
 * SITE WEB MODERNE - JAVASCRIPT PRINCIPAL
 * ============================================================================
 */

// Configuration et variables globales
const CONFIG = {
    FORMSPREE_URL: 'https://formspree.io/f/YOUR_FORM_ID', // À remplacer par votre ID Formspree
    SCROLL_OFFSET: 80,
    ANIMATION_DELAY: 100
};

// État global de l'application
const AppState = {
    currentTheme: 'light',
    isMenuOpen: false,
    isFormSubmitting: false,
    scrollY: 0
};

/**
 * ============================================================================
 * INITIALISATION ET ÉVÉNEMENTS DOM
 * ============================================================================
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Initialisation du site web moderne');
    
    // Initialisation des composants
    initializeTheme();
    initializeNavigation();
    initializeScrollEffects();
    initializeContactForm();
    initializeAnimations();
    
    // Événements de redimensionnement et scroll
    window.addEventListener('scroll', throttle(handleScroll, 16));
    window.addEventListener('resize', debounce(handleResize, 250));
    
    console.log('✅ Site initialisé avec succès');
});

/**
 * ============================================================================
 * GESTION DU THÈME JOUR/NUIT
 * ============================================================================
 */

function initializeTheme() {
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = themeToggle.querySelector('.theme-icon');
    
    // Vérifier le thème sauvegardé ou système
    const savedTheme = localStorage.getItem('theme');
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    
    AppState.currentTheme = savedTheme || systemTheme;
    applyTheme(AppState.currentTheme);
    
    // Événement de basculement du thème
    themeToggle.addEventListener('click', toggleTheme);
    
    // Écouter les changements de préférence système
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            AppState.currentTheme = e.matches ? 'dark' : 'light';
            applyTheme(AppState.currentTheme);
        }
    });
}

function toggleTheme() {
    AppState.currentTheme = AppState.currentTheme === 'light' ? 'dark' : 'light';
    applyTheme(AppState.currentTheme);
    localStorage.setItem('theme', AppState.currentTheme);
}

function applyTheme(theme) {
    const themeIcon = document.querySelector('.theme-icon');
    
    document.documentElement.setAttribute('data-theme', theme);
    themeIcon.textContent = theme === 'light' ? '🌙' : '☀️';
    
    // Animation fluide du changement de thème
    document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
    setTimeout(() => {
        document.body.style.transition = '';
    }, 300);
}

/**
 * ============================================================================
 * NAVIGATION ET MENU RESPONSIVE
 * ============================================================================
 */

function initializeNavigation() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Menu hamburger
    hamburger.addEventListener('click', toggleMobileMenu);
    
    // Navigation fluide
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            scrollToSection(targetId);
            closeMobileMenu();
        });
    });
    
    // Fermer le menu en cliquant à l'extérieur
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.navbar') && AppState.isMenuOpen) {
            closeMobileMenu();
        }
    });
}

function toggleMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    AppState.isMenuOpen = !AppState.isMenuOpen;
    
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
    
    // Bloquer le scroll quand le menu est ouvert
    document.body.style.overflow = AppState.isMenuOpen ? 'hidden' : '';
}

function closeMobileMenu() {
    if (!AppState.isMenuOpen) return;
    
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    AppState.isMenuOpen = false;
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
    document.body.style.overflow = '';
}

function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (!section) return;
    
    const headerHeight = document.querySelector('.header').offsetHeight;
    const targetPosition = section.offsetTop - headerHeight;
    
    window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
    });
}

/**
 * ============================================================================
 * EFFETS DE SCROLL
 * ============================================================================
 */

function initializeScrollEffects() {
    // Observer pour les animations au scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(handleIntersection, observerOptions);
    
    // Observer tous les éléments avec classe fade-in
    document.querySelectorAll('.service-card, .about-content, .contact-content').forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
}

function handleIntersection(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}

function handleScroll() {
    AppState.scrollY = window.scrollY;
    updateNavigationState();
    updateActiveNavLink();
}

function updateNavigationState() {
    const header = document.querySelector('.header');
    
    if (AppState.scrollY > 50) {
        header.style.background = AppState.currentTheme === 'light' 
            ? 'rgba(255, 255, 255, 0.98)' 
            : 'rgba(26, 26, 26, 0.98)';
        header.style.backdropFilter = 'blur(15px)';
        header.style.boxShadow = '0 2px 20px rgba(0,0,0,0.1)';
    } else {
        header.style.background = AppState.currentTheme === 'light' 
            ? 'rgba(255, 255, 255, 0.95)' 
            : 'rgba(26, 26, 26, 0.95)';
        header.style.backdropFilter = 'blur(10px)';
        header.style.boxShadow = 'none';
    }
}

function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let currentSectionId = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - CONFIG.SCROLL_OFFSET;
        const sectionHeight = section.offsetHeight;
        
        if (AppState.scrollY >= sectionTop && AppState.scrollY < sectionTop + sectionHeight) {
            currentSectionId = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSectionId}`) {
            link.classList.add('active');
        }
    });
}

/**
 * ============================================================================
 * FORMULAIRE DE CONTACT AJAX
 * ============================================================================
 */

function initializeContactForm() {
    const form = document.getElementById('contactForm');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');
    
    if (!form) {
        console.warn('⚠️ Formulaire de contact non trouvé');
        return;
    }
    
    // Validation en temps réel
    emailInput.addEventListener('blur', () => validateField(emailInput, 'email'));
    messageInput.addEventListener('blur', () => validateField(messageInput, 'message'));
    
    // Soumission du formulaire
    form.addEventListener('submit', handleFormSubmit);
    
    console.log('📋 Formulaire de contact initialisé');
}

function validateField(field, type) {
    const value = field.value.trim();
    const errorElement = document.getElementById(`${field.id}-error`);
    
    let isValid = true;
    let errorMessage = '';
    
    if (!value) {
        isValid = false;
        errorMessage = 'Ce champ est requis';
    } else if (type === 'email' && !isValidEmail(value)) {
        isValid = false;
        errorMessage = 'Veuillez saisir une adresse email valide';
    } else if (type === 'message' && value.length < 10) {
        isValid = false;
        errorMessage = 'Le message doit contenir au moins 10 caractères';
    }
    
    // Mise à jour de l'affichage
    field.classList.toggle('error', !isValid);
    errorElement.textContent = errorMessage;
    errorElement.style.display = errorMessage ? 'block' : 'none';
    
    return isValid;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

async function handleFormSubmit(e) {
    e.preventDefault();
    
    if (AppState.isFormSubmitting) return;
    
    const form = e.target;
    const formData = new FormData(form);
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');
    
    // Validation des champs
    const isEmailValid = validateField(emailInput, 'email');
    const isMessageValid = validateField(messageInput, 'message');
    
    if (!isEmailValid || !isMessageValid) {
        showFormMessage('error', 'Veuillez corriger les erreurs dans le formulaire');
        return;
    }
    
    // Mise à jour de l'état de soumission
    AppState.isFormSubmitting = true;
    updateSubmitButton(true);
    hideFormMessages();
    
    try {
        // Récupérer l'URL Formspree depuis l'attribut action du formulaire
        const formspreeUrl = form.getAttribute('action');
        
        const response = await fetch(formspreeUrl, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        });
        
        if (response.ok) {
            showFormMessage('success', 'Merci ! Votre message a été envoyé avec succès.');
            form.reset();
            
            // Animation de succès
            const successElement = document.getElementById('form-success');
            successElement.style.transform = 'scale(0.95)';
            setTimeout(() => {
                successElement.style.transform = 'scale(1)';
            }, 150);
            
        } else {
            const data = await response.json();
            throw new Error(data.error || 'Erreur lors de l\'envoi');
        }
        
    } catch (error) {
        console.error('❌ Erreur formulaire:', error);
        showFormMessage('error', 'Une erreur s\'est produite. Veuillez réessayer.');
    } finally {
        AppState.isFormSubmitting = false;
        updateSubmitButton(false);
    }
}

function updateSubmitButton(isSubmitting) {
    const btnText = document.querySelector('.btn-text');
    const btnLoading = document.querySelector('.btn-loading');
    const submitBtn = document.querySelector('.btn-submit');
    
    if (isSubmitting) {
        btnText.style.display = 'none';
        btnLoading.style.display = 'inline';
        submitBtn.disabled = true;
        submitBtn.style.opacity = '0.7';
    } else {
        btnText.style.display = 'inline';
        btnLoading.style.display = 'none';
        submitBtn.disabled = false;
        submitBtn.style.opacity = '1';
    }
}

function showFormMessage(type, message) {
    hideFormMessages();
    
    const messageElement = document.getElementById(type === 'success' ? 'form-success' : 'form-error');
    const messageText = messageElement.querySelector('span');
    
    messageText.textContent = message;
    messageElement.style.display = 'flex';
    
    // Animation d'apparition
    setTimeout(() => {
        messageElement.style.opacity = '1';
        messageElement.style.transform = 'translateY(0)';
    }, 10);
    
    // Masquer automatiquement après 5 secondes pour les messages de succès
    if (type === 'success') {
        setTimeout(() => {
            hideFormMessages();
        }, 5000);
    }
}

function hideFormMessages() {
    const successElement = document.getElementById('form-success');
    const errorElement = document.getElementById('form-error');
    
    [successElement, errorElement].forEach(element => {
        element.style.display = 'none';
        element.style.opacity = '0';
        element.style.transform = 'translateY(-10px)';
    });
}

/**
 * ============================================================================
 * ANIMATIONS ET INTERACTIONS
 * ============================================================================
 */

function initializeAnimations() {
    // Animation des cartes de service au survol
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(-5px) scale(1)';
        });
    });
    
    // Animation des boutons
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(btn => {
        btn.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        
        btn.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Parallax léger pour les formes décoratives
    const decorativeShapes = document.querySelectorAll('.hero-shape, .about-shape-1, .about-shape-2');
    window.addEventListener('scroll', throttle(() => {
        const scrolled = window.pageYOffset;
        decorativeShapes.forEach((shape, index) => {
            const rate = scrolled * -0.5 * (index + 1);
            shape.style.transform = `translateY(${rate}px)`;
        });
    }, 16));
}

function handleResize() {
    // Fermer le menu mobile lors du redimensionnement
    if (window.innerWidth > 768 && AppState.isMenuOpen) {
        closeMobileMenu();
    }
    
    // Recalculer les positions pour la navigation
    updateActiveNavLink();
}

/**
 * ============================================================================
 * UTILITAIRES
 * ============================================================================
 */

// Fonction de throttling pour optimiser les performances
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Fonction de debouncing pour optimiser les performances
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}