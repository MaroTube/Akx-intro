// Intro Overlay
const introOverlay = document.getElementById('intro-overlay');
const container = document.querySelector('.container');
introOverlay.addEventListener('click', () => {
    introOverlay.classList.add('hidden');
    container.classList.add('visible');
    document.body.style.overflow = 'auto';
    const bgMusic = document.getElementById('bg-music');
    bgMusic.play().catch(err => console.error('Audio play failed:', err));
});

// Dynamic 3D Card Tilt
const card = document.querySelector('.card');
card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;
    const rotateX = -(mouseY / rect.height) * 15;
    const rotateY = (mouseX / rect.width) * 15;
    card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.03)`;
});
card.addEventListener('mouseleave', () => {
    card.style.transform = 'rotateX(0deg) rotateY(0deg) scale(1)';
});

// Black Dot Particles
const particleCanvas = document.createElement('canvas');
particleCanvas.id = 'particles';
document.body.appendChild(particleCanvas);
particleCanvas.style.position = 'fixed';
particleCanvas.style.top = '0';
particleCanvas.style.left = '0';
particleCanvas.style.zIndex = '-1';
particleCanvas.width = window.innerWidth;
particleCanvas.height = window.innerHeight;
const pCtx = particleCanvas.getContext('2d');
const particles = [];
class Particle {
    constructor() {
        this.x = Math.random() * particleCanvas.width;
        this.y = Math.random() * particleCanvas.height;
        this.size = Math.random() * 3 + 1;
        this.speedX = (Math.random() * 0.4 - 0.2);
        this.speedY = (Math.random() * 0.4 - 0.2);
        this.opacity = Math.random() * 0.5 + 0.3;
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x < 0 || this.x > particleCanvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > particleCanvas.height) this.speedY *= -1;
    }
    draw() {
        pCtx.fillStyle = `rgba(0, 0, 0, ${this.opacity})`;
        pCtx.beginPath();
        pCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        pCtx.fill();
    }
}
function initParticles() {
    particles.length = 0;
    for (let i = 0; i < 60; i++) {
        particles.push(new Particle());
    }
}
function animateParticles() {
    pCtx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);
    particles.forEach(p => {
        p.update();
        p.draw();
    });
    requestAnimationFrame(animateParticles);
}
initParticles();
animateParticles();
window.addEventListener('resize', () => {
    particleCanvas.width = window.innerWidth;
    particleCanvas.height = window.innerHeight;
    initParticles();
});

// Audio Waveform Visualizer
const bgMusic = document.getElementById('bg-music');
bgMusic.volume = 0.3;
let analyser, dataArray;
function initAudio() {
    try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const source = audioCtx.createMediaElementSource(bgMusic);
        analyser = audioCtx.createAnalyser();
        analyser.fftSize = 512;
        source.connect(analyser);
        analyser.connect(audioCtx.destination);
        const bufferLength = analyser.frequencyBinCount;
        dataArray = new Uint8Array(bufferLength);
        const canvas = document.getElementById('audio-visualizer');
        canvas.width = window.innerWidth;
        canvas.height = 60;
        const ctx = canvas.getContext('2d');
        function updateVisualizer() {
            analyser.getByteFrequencyData(dataArray);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.strokeStyle = document.body.classList.contains('light-mode') ? '#000000' : '#FFFFFF';
            ctx.lineWidth = 2;
            ctx.beginPath();
            const sliceWidth = canvas.width / bufferLength;
            let x = 0;
            for (let i = 0; i < bufferLength; i++) {
                const v = dataArray[i] / 255;
                const y = v * canvas.height;
                if (i === 0) {
                    ctx.moveTo(x, canvas.height - y);
                } else {
                    ctx.lineTo(x, canvas.height - y);
                }
                x += sliceWidth;
            }
            ctx.stroke();
            requestAnimationFrame(updateVisualizer);
        }
        updateVisualizer();
    } catch (e) {
        console.error('AudioContext failed:', e);
        document.getElementById('audio-visualizer').style.display = 'none';
    }
}
introOverlay.addEventListener('click', () => initAudio(), { once: true });

// Theme Toggle
const modeToggle = document.getElementById('mode-toggle');
modeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light-mode');
    modeToggle.textContent = document.body.classList.contains('light-mode') ? '☀️' : '🌙';
});

// Section Animations
const sections = document.querySelectorAll('.intro, .bio, .about');
const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.4 });
sections.forEach(el => observer.observe(el));

// Typewriter Effect
const introText = document.getElementById('bio-text');
const introContent = introText.textContent;
introText.textContent = '';
let i = 0;
function typeWriter() {
    if (i < introContent.length) {
        introText.textContent += introContent.charAt(i);
        i++;
        setTimeout(typeWriter, 50);
    }
}
introOverlay.addEventListener('click', () => setTimeout(typeWriter, 400), { once: true });

// PFP Glow Animation
const pfp = document.querySelector('.pfp');
pfp.addEventListener('mouseenter', () => {
    pfp.style.animation = 'glowPulse 1.5s infinite';
});
pfp.addEventListener('mouseleave', () => {
    pfp.style.animation = 'none';
});

// Button Ripple
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', e => {
        const ripple = document.createElement('span');
        ripple.style.position = 'absolute';
        ripple.style.background = 'radial-gradient(circle, var(--accent-color) 10%, transparent 70%)';
        ripple.style.width = '80px';
        ripple.style.height = '80px';
        ripple.style.left = `${e.offsetX - 40}px`;
        ripple.style.top = `${e.offsetY - 40}px`;
        ripple.style.borderRadius = '50%';
        ripple.style.pointerEvents = 'none';
        ripple.style.animation = 'ripple 0.5s ease-out';
        btn.appendChild(ripple);
        setTimeout(() => ripple.remove(), 500);
    });
});