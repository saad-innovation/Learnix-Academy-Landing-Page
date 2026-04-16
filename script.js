// 1. Mobile Menu Toggle
const menuMenu = document.querySelector('#mobile-menu');
const navMenu = document.querySelector('nav ul');

// Jab hamburger icon par click ho
menuMenu.addEventListener('click', function() {
    // Menu ko dikhayein ya chupayein
    navMenu.classList.toggle('active');
    
    // Icon ko change karein (Bars se Cross aur Cross se Bars)
    const icon = menuMenu.querySelector('i');
    if(navMenu.classList.contains('active')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
    } else {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    }
});

// 2. Smooth Scrolling for all Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        // Agar mobile par link click ho toh menu khud band ho jaye
        if(navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            menuMenu.querySelector('i').classList.replace('fa-times', 'fa-bars');
        }

        const targetId = this.getAttribute('href');
        const targetSection = document.querySelector(targetId);

        if(targetSection) {
            targetSection.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});