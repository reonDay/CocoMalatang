// script.js (gallery + existing behaviors + hamburger + header improvements + menu image zoom)
document.addEventListener('DOMContentLoaded', function() {
    // Elements for hamburger
    const navToggle = document.querySelector('.nav-toggle');
    const nav = document.querySelector('nav');
    const focusableNavLinks = Array.from(document.querySelectorAll('nav a[href^="#"]'));

    // Helper: toggle nav open state on <html> to keep CSS selector simple
    function isNavOpen() {
        return document.documentElement.classList.contains('nav-open');
    }
    function openNav() {
        document.documentElement.classList.add('nav-open');
        navToggle.setAttribute('aria-expanded', 'true');
        // optional: move focus to first link for accessibility
        const firstLink = focusableNavLinks[0];
        if (firstLink) firstLink.focus();
    }
    function closeNav() {
        document.documentElement.classList.remove('nav-open');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.focus();
    }

    // Toggle handler
    navToggle.addEventListener('click', function(e) {
        e.stopPropagation();
        if (isNavOpen()) closeNav();
        else openNav();
    });

    // Close nav when clicking any nav link (mobile)
    focusableNavLinks.forEach(a => {
        a.addEventListener('click', () => {
            if (isNavOpen()) closeNav();
        });
    });

    // Close nav when clicking outside nav on mobile
    document.addEventListener('click', function(e) {
        if (!isNavOpen()) return;
        // if click target is inside nav or on toggle, ignore
        if (nav.contains(e.target) || navToggle.contains(e.target)) return;
        closeNav();
    });

    // Close on Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && isNavOpen()) {
            closeNav();
        }
    });

    // Animasi untuk menu items (IntersectionObserver)
    const menuItems = document.querySelectorAll('.menu-item');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('in-view'); });
    }, { threshold: 0.1 });
    menuItems.forEach(item => observer.observe(item));

    // Efek scroll header
    window.addEventListener('scroll', function() {
        const header = document.querySelector('header');
        if (window.scrollY > 100) {
            header.style.padding = '10px 0';
            header.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.padding = '20px 0';
            header.style.boxShadow = '0 2px 15px rgba(0, 0, 0, 0.1)';
        }
    });

    // Smooth scrolling untuk navigasi (works for desktop & mobile)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            // Allow normal behavior for external links (but we only have hashes here)
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) target.scrollIntoView({ behavior: 'smooth' });
            // close mobile nav after clicking
            if (isNavOpen()) closeNav();
        });
    });

    // ===== Gallery Lightbox =====
    // Kumpulkan semua gambar dari galeri dan gambar menu yang bisa di-zoom
    const galleryImages = Array.from(document.querySelectorAll('.gallery-item img, .menu-item-image .zoomable'));
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = lightbox.querySelector('img');
    const caption = lightbox.querySelector('.caption');
    const closeBtn = lightbox.querySelector('.close');
    const prevBtn = lightbox.querySelector('.prev');
    const nextBtn = lightbox.querySelector('.next');
    let currentIndex = 0;

    function openLightbox(index) {
        const img = galleryImages[index];
        const large = img.dataset.large || img.src;
        lightboxImg.src = large;
        caption.textContent = img.alt || '';
        lightbox.classList.remove('hidden');
        lightbox.setAttribute('aria-hidden', 'false');
        currentIndex = index;
        document.body.style.overflow = 'hidden';
    }
    function closeLightbox() {
        lightbox.classList.add('hidden');
        lightbox.setAttribute('aria-hidden', 'true');
        lightboxImg.src = '';
        document.body.style.overflow = '';
    }
    function showNext() { openLightbox((currentIndex + 1) % galleryImages.length); }
    function showPrev() { openLightbox((currentIndex - 1 + galleryImages.length) % galleryImages.length); }

    // Event listener untuk setiap gambar di galeri dan menu
    galleryImages.forEach((img, i) => {
        img.addEventListener('click', () => openLightbox(i));
    });
    closeBtn.addEventListener('click', closeLightbox);
    nextBtn.addEventListener('click', (e) => { e.stopPropagation(); showNext(); });
    prevBtn.addEventListener('click', (e) => { e.stopPropagation(); showPrev(); });

    // close ketika klik di luar gambar (klik overlay)
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox || e.target === lightboxImg) closeLightbox();
    });

    // keyboard controls for lightbox
    document.addEventListener('keydown', (e) => {
        if (lightbox.classList.contains('hidden')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') showNext();
        if (e.key === 'ArrowLeft') showPrev();
    });

    // Tambah class active saat scroll
    window.addEventListener('scroll', function() {
        const sections = document.querySelectorAll('section');
        const navLinks = document.querySelectorAll('nav ul li a');
        
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (window.pageYOffset >= (sectionTop - sectionHeight / 3)) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').substring(1) === current) {
                link.classList.add('active');
            }
        });
    });

    // Set active nav link on page load
    window.dispatchEvent(new Event('scroll'));
});