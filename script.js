// Mobile Navigation Toggle
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Service Cards Expand/Collapse (Single-Open Accordion)
document.querySelectorAll('.expand-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const targetId = btn.getAttribute('data-target');
        const details = document.getElementById(targetId);
        const icon = btn.querySelector('i');
        const isCurrentlyActive = details.classList.contains('active');
        
        // Close all other accordion items
        document.querySelectorAll('.service-details').forEach(detail => {
            if (detail.id !== targetId) {
                detail.classList.remove('active');
                const otherIcon = detail.closest('.service-card').querySelector('.expand-btn i');
                otherIcon.style.transform = 'rotate(0deg)';
            }
        });
        
        // Toggle current item
        if (isCurrentlyActive) {
            details.classList.remove('active');
            icon.style.transform = 'rotate(0deg)';
        } else {
            details.classList.add('active');
            icon.style.transform = 'rotate(180deg)';
        }
    });
});

// Smooth Scrolling for Navigation Links
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

// Contact Form Handling
const contactForm = document.getElementById('contact-form');

contactForm.addEventListener('submit', async function(e) {
    e.preventDefault();

    const form = this;
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.textContent;

    // Collect data
    const formData = new FormData(form);
    const simpleData = Object.fromEntries(formData);

    // Basic validation
    if (!simpleData.name || !simpleData.email || !simpleData.company || !simpleData.stage || !simpleData.message) {
        alert('Please fill in all fields.');
        return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(simpleData.email)) {
        alert('Please enter a valid email address.');
        return;
    }

    // Ensure Netlify form name is present
    if (!formData.get('form-name')) {
        formData.append('form-name', form.getAttribute('name') || 'contact');
    }

    // UI feedback
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';

    try {
        const response = await fetch('/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams(formData).toString()
        });

        if (!response.ok) throw new Error('Network response was not ok');

        alert('Thank you for your message! We\'ll get back to you soon.');
        form.reset();
    } catch (err) {
        console.error('Form submission failed', err);
        alert('Sorry, there was an error sending your message. Please email info@flowocity.ai.');
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = originalBtnText;
    }
});

// Add scroll effect to navbar
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = 'none';
    }
});

// Add animation on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll('.service-card, .team-member, .stage');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});
