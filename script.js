// Loading Screen Animation
let loadingProgress = 0;
const loadingScreen = document.getElementById('loading-screen');
const loadingPercentage = document.querySelector('.loading-percentage');

const loadingInterval = setInterval(() => {
    loadingProgress += Math.random() * 15;
    if (loadingProgress >= 100) {
        loadingProgress = 100;
        clearInterval(loadingInterval);
        setTimeout(() => {
            loadingScreen.classList.add('hidden');
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }, 500);
    }
    loadingPercentage.textContent = Math.floor(loadingProgress) + '%';
}, 200);

// Three.js 3D Background
const canvas = document.getElementById('bg-canvas');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
camera.position.z = 5;

// Create particles
const particlesGeometry = new THREE.BufferGeometry();
const particlesCount = 1000;
const posArray = new Float32Array(particlesCount * 3);

for (let i = 0; i < particlesCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 50;
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

const particlesMaterial = new THREE.PointsMaterial({
    size: 0.05,
    color: 0xa855f7,
    transparent: true,
    opacity: 0.9,
    blending: THREE.AdditiveBlending
});

const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particlesMesh);

// Create geometric shapes
const geometry = new THREE.TorusGeometry(1, 0.3, 16, 100);
const material = new THREE.MeshStandardMaterial({
    color: 0xa855f7,
    wireframe: true,
    transparent: true,
    opacity: 0.4
});
const torus = new THREE.Mesh(geometry, material);
torus.position.z = -5;
torus.position.x = 3;
scene.add(torus);

// Create second torus
const geometry2 = new THREE.TorusGeometry(0.7, 0.2, 16, 100);
const material2 = new THREE.MeshStandardMaterial({
    color: 0xec4899,
    wireframe: true,
    transparent: true,
    opacity: 0.4
});
const torus2 = new THREE.Mesh(geometry2, material2);
torus2.position.z = -3;
torus2.position.x = -3;
scene.add(torus2);

// Create third shape - octahedron
const geometry3 = new THREE.OctahedronGeometry(0.8, 0);
const material3 = new THREE.MeshStandardMaterial({
    color: 0x6366f1,
    wireframe: true,
    transparent: true,
    opacity: 0.4
});
const octa = new THREE.Mesh(geometry3, material3);
octa.position.z = -4;
octa.position.y = 2;
scene.add(octa);

// Add lighting
const pointLight = new THREE.PointLight(0xa855f7, 1.5);
pointLight.position.set(5, 5, 5);
scene.add(pointLight);

const pointLight2 = new THREE.PointLight(0xec4899, 1.5);
pointLight2.position.set(-5, -5, -5);
scene.add(pointLight2);

const pointLight3 = new THREE.PointLight(0x6366f1, 1);
pointLight3.position.set(0, 5, 0);
scene.add(pointLight3);

const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
scene.add(ambientLight);

// Mouse movement effect
let mouseX = 0;
let mouseY = 0;

document.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
});

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    // Rotate shapes
    torus.rotation.x += 0.005;
    torus.rotation.y += 0.005;
    torus2.rotation.x -= 0.003;
    torus2.rotation.y -= 0.003;
    octa.rotation.x += 0.007;
    octa.rotation.y += 0.004;

    // Rotate particles
    particlesMesh.rotation.y += 0.0005;
    particlesMesh.rotation.x += 0.0002;

    // Camera follows mouse
    camera.position.x += (mouseX * 0.5 - camera.position.x) * 0.05;
    camera.position.y += (mouseY * 0.5 - camera.position.y) * 0.05;
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
}

animate();

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Navigation Scroll Effect
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    // Update active nav link based on scroll position
    let current = '';
    const sections = document.querySelectorAll('section');
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
});

// Mobile Navigation Toggle
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');

navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
});

// Close mobile menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
    });
});

// Smooth scroll for navigation links
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            const offsetTop = targetSection.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Initialize AOS (Animate On Scroll)
window.addEventListener('load', () => {
    AOS.init({
        duration: 1000,
        easing: 'ease-in-out',
        once: true,
        mirror: false
    });
});

// Button 3D Tilt Effect
const buttons = document.querySelectorAll('.btn-3d');

buttons.forEach(button => {
    button.addEventListener('mousemove', (e) => {
        const rect = button.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;
        
        button.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
    });
    
    button.addEventListener('mouseleave', () => {
        button.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
    });
});

// Service Cards Tilt Effect
const serviceCards = document.querySelectorAll('.service-item');

serviceCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
    });
});

// Pricing Cards Tilt Effect
const pricingCards = document.querySelectorAll('.pricing-card:not(.featured)');

pricingCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
    });
});

// Form Handling
const contactForm = document.querySelector('.form-3d');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form values
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const service = document.getElementById('service').value;
        const message = document.getElementById('message').value;
        
        // Show success message (you can replace this with actual form submission)
        alert(`Thank you, ${name}! Your message has been received. We'll get back to you at ${email} soon!`);
        
        // Reset form
        contactForm.reset();
    });
}

// Floating Cards Animation Enhancement
const floatingCards = document.querySelectorAll('.service-card');

floatingCards.forEach((card, index) => {
    card.addEventListener('mouseenter', () => {
        card.style.animationPlayState = 'paused';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.animationPlayState = 'running';
    });
});

// Parallax Scroll Effect
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.hero-visual, .features-visual');
    
    parallaxElements.forEach(element => {
        const speed = 0.5;
        element.style.transform = `translateY(${scrolled * speed}px)`;
    });
});

// Number Counter Animation for Stats
const statNumbers = document.querySelectorAll('.stat-number');
const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px'
};

const animateCounter = (element) => {
    const target = element.textContent;
    const isPercentage = target.includes('%');
    const isPlus = target.includes('+');
    const hasSlash = target.includes('/');
    
    if (hasSlash) return; // Skip 24/7 type stats
    
    let numericValue = parseInt(target.replace(/[^0-9]/g, ''));
    if (isNaN(numericValue)) return;
    
    const duration = 2000;
    const increment = numericValue / (duration / 16);
    let current = 0;
    
    const updateCounter = () => {
        current += increment;
        if (current < numericValue) {
            let displayValue = Math.floor(current);
            if (isPercentage) displayValue += '%';
            if (isPlus && !isPercentage) displayValue = displayValue + 'K+';
            element.textContent = displayValue;
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target;
        }
    };
    
    updateCounter();
};

const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounter(entry.target);
            statsObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

statNumbers.forEach(stat => {
    statsObserver.observe(stat);
});

// Interactive Particle Effect on Mouse Move
const loadingParticles = document.querySelector('.loading-particles');

if (loadingParticles) {
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'absolute';
        particle.style.width = Math.random() * 3 + 1 + 'px';
        particle.style.height = particle.style.width;
        particle.style.background = 'rgba(0, 212, 255, 0.8)';
        particle.style.borderRadius = '50%';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animation = `particleFloat ${Math.random() * 3 + 2}s infinite ease-in-out`;
        particle.style.animationDelay = Math.random() * 2 + 's';
        loadingParticles.appendChild(particle);
    }
}

// Add particle float animation dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes particleFloat {
        0%, 100% {
            transform: translateY(0px) translateX(0px);
            opacity: 0;
        }
        50% {
            opacity: 1;
        }
        100% {
            transform: translateY(-100px) translateX(${Math.random() * 100 - 50}px);
        }
    }
`;
document.head.appendChild(style);

// Scroll to top button (optional enhancement)
const createScrollTopButton = () => {
    const button = document.createElement('button');
    button.innerHTML = '<i class="fas fa-arrow-up"></i>';
    button.className = 'scroll-top-btn';
    button.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        background: linear-gradient(135deg, #00d4ff 0%, #4ecdc4 100%);
        border: none;
        border-radius: 50%;
        color: #0a0a0a;
        font-size: 1.2rem;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 999;
        box-shadow: 0 5px 15px rgba(0, 212, 255, 0.4);
    `;
    
    document.body.appendChild(button);
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 500) {
            button.style.opacity = '1';
            button.style.visibility = 'visible';
        } else {
            button.style.opacity = '0';
            button.style.visibility = 'hidden';
        }
    });
    
    button.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    button.addEventListener('mouseenter', () => {
        button.style.transform = 'translateY(-5px)';
        button.style.boxShadow = '0 10px 25px rgba(0, 212, 255, 0.6)';
    });
    
    button.addEventListener('mouseleave', () => {
        button.style.transform = 'translateY(0)';
        button.style.boxShadow = '0 5px 15px rgba(0, 212, 255, 0.4)';
    });
};

createScrollTopButton();

// Cursor trail effect (optional enhancement)
const createCursorTrail = () => {
    const coords = { x: 0, y: 0 };
    const circles = document.querySelectorAll('.cursor-circle');
    
    // Create cursor circles
    for (let i = 0; i < 20; i++) {
        const circle = document.createElement('div');
        circle.className = 'cursor-circle';
        circle.style.cssText = `
            position: fixed;
            width: 10px;
            height: 10px;
            border-radius: 50%;
            background: rgba(0, 212, 255, 0.3);
            pointer-events: none;
            z-index: 9999;
            transition: transform 0.1s ease;
        `;
        document.body.appendChild(circle);
    }
    
    const circlesArray = Array.from(document.querySelectorAll('.cursor-circle'));
    
    circlesArray.forEach((circle, index) => {
        circle.x = 0;
        circle.y = 0;
    });
    
    window.addEventListener('mousemove', (e) => {
        coords.x = e.clientX;
        coords.y = e.clientY;
    });
    
    function animateCircles() {
        let x = coords.x;
        let y = coords.y;
        
        circlesArray.forEach((circle, index) => {
            circle.style.left = x - 5 + 'px';
            circle.style.top = y - 5 + 'px';
            circle.style.transform = `scale(${(circlesArray.length - index) / circlesArray.length})`;
            
            circle.x = x;
            circle.y = y;
            
            const nextCircle = circlesArray[index + 1] || circlesArray[0];
            x += (nextCircle.x - x) * 0.3;
            y += (nextCircle.y - y) * 0.3;
        });
        
        requestAnimationFrame(animateCircles);
    }
    
    animateCircles();
};

// Uncomment to enable cursor trail effect
// createCursorTrail();

console.log('🎮 RobloxPro Services - Website Loaded Successfully!');
console.log('💎 3D Effects Active');
console.log('⚡ All animations initialized');