// Team CV Page Interactive Elements

document.addEventListener('DOMContentLoaded', function() {
    // FAQ Accordion
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            const answer = this.nextElementSibling;
            
            // Close all other FAQs
            faqQuestions.forEach(q => {
                if (q !== this) {
                    q.setAttribute('aria-expanded', 'false');
                    q.nextElementSibling.classList.remove('active');
                }
            });
            
            // Toggle current FAQ
            this.setAttribute('aria-expanded', !isExpanded);
            answer.classList.toggle('active');
        });
    });
    
    // Audience Tabs
    const audienceTabs = document.querySelectorAll('.audience-tab');
    const audienceContents = document.querySelectorAll('.audience-content');
    
    audienceTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const targetAudience = this.getAttribute('data-audience');
            
            // Remove active class from all tabs and contents
            audienceTabs.forEach(t => t.classList.remove('active'));
            audienceContents.forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding content
            this.classList.add('active');
            document.getElementById(targetAudience + '-content').classList.add('active');
        });
    });
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href !== '#top') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    const offsetTop = target.offsetTop - 80;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
    
    // Timeline item animations on scroll
    const timelineItems = document.querySelectorAll('.timeline-item');
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const timelineObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    timelineItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        timelineObserver.observe(item);
    });
});

