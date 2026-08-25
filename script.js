/**
 * ========================================================
 * LEARNIX ACADEMY - FUTURISTIC INTERACTION SCRIPT
 * Developed by: Saad Ali
 * Features: DOM Manipulation, Intersection Observer, 
 * LocalStorage, Mouse Parallax, Dynamic Number Counters
 * ========================================================
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // 1. DYNAMIC CSS INJECTION (For Animations)
    // ==========================================
    // JS ke zariye custom animation classes inject kar rahe hain
    const style = document.createElement('style');
    style.innerHTML = `
        .reveal-on-scroll { opacity: 0; transform: translateY(40px); transition: all 0.8s cubic-bezier(0.5, 0, 0, 1); }
        .reveal-on-scroll.visible { opacity: 1; transform: translateY(0); }
        .hero-content { transition: transform 0.1s ease-out; }
    `;
    document.head.appendChild(style);

    // ==========================================
    // 2. MOBILE MENU WITH ACCESSIBILITY
    // ==========================================
    const menuToggle = document.querySelector('#mobile-menu');
    const navMenu = document.querySelector('nav ul');
    const header = document.querySelector('header');

    menuToggle.addEventListener('click', () => {
        const isActive = navMenu.classList.toggle('active');
        const icon = menuToggle.querySelector('i');
        
        // Icon change logic
        icon.classList.toggle('fa-bars', !isActive);
        icon.classList.toggle('fa-times', isActive);
        
        // Accessibility update
        menuToggle.setAttribute('aria-expanded', isActive);
    });

    // ==========================================
    // 3. SMART STICKY HEADER & SMOOTH SCROLL
    // ==========================================
    window.addEventListener('scroll', () => {
        // Scroll karne par header aur zyada glassy aur compact ho jayega
        if (window.scrollY > 50) {
            header.style.background = 'rgba(3, 7, 18, 0.85)';
            header.style.padding = '10px 0';
            header.style.boxShadow = '0 10px 30px rgba(0, 240, 255, 0.1)';
        } else {
            header.style.background = 'rgba(3, 7, 18, 0.6)';
            header.style.padding = '15px 0';
            header.style.boxShadow = 'none';
        }
    });

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            // Close mobile menu on link click
            if(navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                menuToggle.querySelector('i').classList.replace('fa-times', 'fa-bars');
                menuToggle.setAttribute('aria-expanded', 'false');
            }

            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if(targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // ==========================================
    // 4. MOUSE PARALLAX EFFECT (Hero Section)
    // ==========================================
    // Futuristic feel ke liye hero section par mouse move karne se elements slightly move hongy
    const heroSection = document.querySelector('.hero');
    const heroContent = document.querySelector('.hero-content');

    if (heroSection && heroContent) {
        heroSection.addEventListener('mousemove', (e) => {
            const x = (window.innerWidth / 2 - e.pageX) / 30;
            const y = (window.innerHeight / 2 - e.pageY) / 30;
            heroContent.style.transform = `translate(${x}px, ${y}px)`;
        });

        // Mouse leave par wapas center mein lana
        heroSection.addEventListener('mouseleave', () => {
            heroContent.style.transform = `translate(0px, 0px)`;
        });
    }

    // ==========================================
    // 5. SCROLL REVEAL & DYNAMIC COUNTER API
    // ==========================================
    // Elements ko select kar ke un par initial hide class lagana
    const animateElements = document.querySelectorAll('.program-card, .feature-box, .stat-item, .contact-container');
    animateElements.forEach(el => el.classList.add('reveal-on-scroll'));

    // Number counting logic
    const animateValue = (obj, start, end, duration) => {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            // Math.floor + formatting
            obj.innerHTML = Math.floor(progress * (end - start) + start) + (obj.dataset.suffix || '');
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    };

    // Intersection Observer to trigger animations when elements enter viewport
    const observerOptions = { threshold: 0.1, rootMargin: "0px 0px -50px 0px" };
    
    const scrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Agar yeh stat item hai, to number count animate karo
                if (entry.target.classList.contains('stat-item')) {
                    const numElement = entry.target.querySelector('h3');
                    const targetNum = parseInt(numElement.innerText);
                    
                    // Suffix save karna (jaise '+', '%')
                    if (numElement.innerText.includes('+')) numElement.dataset.suffix = '+';
                    if (numElement.innerText.includes('%')) numElement.dataset.suffix = '%';
                    
                    animateValue(numElement, 0, targetNum, 2000);
                }
                
                // Ek baar animate hone ke baad observe karna band kar dein (performance optimization)
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animateElements.forEach(el => scrollObserver.observe(el));

    // ==========================================
    // 6. SMART CONTACT FORM WITH LOCAL STORAGE
    // ==========================================
    // Recruiter ko impress karne k liye real-world form functionality
    const contactForm = document.querySelector('.contact-form');
    
    if (contactForm) {
        const nameInput = document.getElementById('name');
        const phoneInput = document.getElementById('phone');
        const gradeSelect = document.getElementById('grade');
        const submitBtn = contactForm.querySelector('button[type="submit"]');

        // Load saved data from LocalStorage if user previously typed but didn't submit
        if (localStorage.getItem('learnix_name')) nameInput.value = localStorage.getItem('learnix_name');
        if (localStorage.getItem('learnix_phone')) phoneInput.value = localStorage.getItem('learnix_phone');
        if (localStorage.getItem('learnix_grade')) gradeSelect.value = localStorage.getItem('learnix_grade');

        // Save data to LocalStorage on input
        contactForm.addEventListener('input', (e) => {
            if (e.target.id === 'name') localStorage.setItem('learnix_name', e.target.value);
            if (e.target.id === 'phone') localStorage.setItem('learnix_phone', e.target.value);
            if (e.target.id === 'grade') localStorage.setItem('learnix_grade', e.target.value);
        });

        // Handle Form Submission professionally
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Page reload hone se rokna
            
            // Button loading state
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = `<i class="fas fa-circle-notch fa-spin"></i> Submitting...`;
            submitBtn.style.opacity = '0.7';
            submitBtn.style.cursor = 'not-allowed';

            // Simulate API Request via Timeout (2 seconds)
            setTimeout(() => {
                // Success UI State
                submitBtn.innerHTML = `<i class="fas fa-check-circle"></i> Request Sent!`;
                submitBtn.style.background = '#10b981'; // Green color for success
                submitBtn.style.color = '#fff';
                submitBtn.style.boxShadow = '0 0 20px rgba(16, 185, 129, 0.4)';
                
                // Clear Form and LocalStorage
                contactForm.reset();
                localStorage.removeItem('learnix_name');
                localStorage.removeItem('learnix_phone');
                localStorage.removeItem('learnix_grade');

                // Revert button back after 3 seconds
                setTimeout(() => {
                    submitBtn.innerHTML = originalText;
                    submitBtn.style = ''; // Remove inline styles
                }, 3000);
            }, 1500);
        });
    }
});
