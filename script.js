// =======================
// LANGUAGE SWITCHER
// =======================
const translations = {
    fr: {
        typewriter: ["Développement Web", "Applications Mobiles", "E-commerce", "Consulting IT"]
    },
    en: {
        typewriter: ["Web Development", "Mobile Applications", "E-commerce", "IT Consulting"]
    }
};

let currentLang = 'fr';

function switchLanguage(lang) {
    currentLang = lang;
    document.documentElement.lang = lang;
    
    // Update all elements with data-fr and data-en attributes
    document.querySelectorAll('[data-fr][data-en]').forEach(element => {
        const text = element.getAttribute(`data-${lang}`);
        if (text) {
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.placeholder = text;
            } else if (element.tagName === 'BUTTON') {
                element.textContent = text;
            } else {
                element.textContent = text;
            }
        }
    });
    
    // Update active language button
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.lang === lang) {
            btn.classList.add('active');
        }
    });
    
    // Restart typewriter effect with new language
    i = 0;
    j = 0;
    isDeleting = false;
    type();
}

// Language button event listeners
document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        switchLanguage(btn.dataset.lang);
    });
});

// =======================
// TYPEWRITER EFFECT
// =======================
let words = translations[currentLang].typewriter;
let i = 0;
let j = 0;
let current = "";
let isDeleting = false;

function type() {
    words = translations[currentLang].typewriter;
    current = words[i];
    
    if (isDeleting) {
        document.getElementById("typewriter").textContent = current.substring(0, j--);
        if (j < 0) {
            isDeleting = false;
            i = (i + 1) % words.length;
        }
    } else {
        document.getElementById("typewriter").textContent = current.substring(0, j++);
        if (j > current.length) {
            isDeleting = true;
            setTimeout(type, 1800);
            return;
        }
    }
    
    setTimeout(type, isDeleting ? 40 : 100);
}

type();

// =======================
// SCROLL ANIMATIONS
// =======================
function reveal() {
    document.querySelectorAll('.reveal').forEach(el => {
        const elementTop = el.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (elementTop < windowHeight - 100) {
            el.classList.add('active');
        }
    });
    
    // Scroll to top button visibility
    const sUp = document.getElementById("scrollUp");
    sUp.style.display = window.scrollY > 400 ? "flex" : "none";
}

window.addEventListener('scroll', reveal);
window.addEventListener('load', reveal);

// Scroll to top functionality
document.getElementById("scrollUp").addEventListener('click', () => {
    window.scrollTo({top: 0, behavior: 'smooth'});
});

// =======================
// CONTACT FORM HANDLER
// =======================
const contactForm = document.getElementById('contactForm');
const formMessage = document.getElementById('formMessage');

contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(contactForm);
    const data = {
        name: formData.get('name'),
        phone: formData.get('phone'),
        email: formData.get('email'),
        subject: formData.get('subject'),
        message: formData.get('message')
    };
    
    // Disable submit button
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = currentLang === 'fr' ? 'Envoi en cours...' : 'Sending...';
    
    try {
        // Option 1: Using FormSubmit.co (No backend required)
        const response = await fetch('https://formsubmit.co/ajax/contact@dksoft.tn', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(data)
        });
        
        if (response.ok) {
            showMessage('success', currentLang === 'fr' 
                ? '✓ Message envoyé avec succès! Nous vous contacterons bientôt.' 
                : '✓ Message sent successfully! We will contact you soon.');
            contactForm.reset();
        } else {
            throw new Error('Form submission failed');
        }
    } catch (error) {
        console.error('Error:', error);
        showMessage('danger', currentLang === 'fr'
            ? '✗ Erreur lors de l\'envoi. Veuillez réessayer ou nous contacter directement par email.'
            : '✗ Error sending message. Please try again or contact us directly via email.');
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
    }
});

function showMessage(type, message) {
    formMessage.className = `alert alert-${type}`;
    formMessage.textContent = message;
    formMessage.classList.remove('d-none');
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        formMessage.classList.add('d-none');
    }, 5000);
}

// =======================
// SMOOTH SCROLL FOR ANCHOR LINKS
// =======================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && href !== '') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                const navHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = target.offsetTop - navHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                const navCollapse = document.getElementById('dkNav');
                if (navCollapse.classList.contains('show')) {
                    bootstrap.Collapse.getInstance(navCollapse).hide();
                }
            }
        }
    });
});

// =======================
// FORM VALIDATION ENHANCEMENT
// =======================
const formInputs = contactForm.querySelectorAll('input, textarea');
formInputs.forEach(input => {
    input.addEventListener('blur', function() {
        if (this.hasAttribute('required') && !this.value.trim()) {
            this.classList.add('is-invalid');
        } else {
            this.classList.remove('is-invalid');
        }
    });
    
    input.addEventListener('input', function() {
        if (this.classList.contains('is-invalid') && this.value.trim()) {
            this.classList.remove('is-invalid');
        }
    });
});

// Email validation
const emailInput = contactForm.querySelector('input[type="email"]');
if (emailInput) {
    emailInput.addEventListener('blur', function() {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (this.value && !emailRegex.test(this.value)) {
            this.classList.add('is-invalid');
        }
    });
}

// =======================
// PERFORMANCE OPTIMIZATION
// =======================
// Lazy load images
if ('loading' in HTMLImageElement.prototype) {
    const images = document.querySelectorAll('img[loading="lazy"]');
    images.forEach(img => {
        img.src = img.dataset.src;
    });
} else {
    // Fallback for browsers that don't support lazy loading
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
    document.body.appendChild(script);
}

// Trigger initial reveal
window.dispatchEvent(new Event('scroll'));