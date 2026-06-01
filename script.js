document.addEventListener("DOMContentLoaded", () => {
  /* ==========================================================================
     1. SMART NAVBAR & SCROLL PROGRESS INDICATOR
     ========================================================================== */
  const header = document.getElementById("main-header");
  const scrollIndicator = document.getElementById("scroll-indicator");
  const sections = document.querySelectorAll("section");
  const navLinks = document.querySelectorAll(".nav-menu a");
  
  let lastScrollY = window.scrollY;
  
  window.addEventListener("scroll", () => {
    const currentScrollY = window.scrollY;
    
    // Update scroll progress indicator
    const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
    if (totalScroll > 0) {
      const scrollPercent = (currentScrollY / totalScroll) * 100;
      scrollIndicator.style.width = `${scrollPercent}%`;
    }
    
    // Smart Header behavior (hide on scroll down, show on scroll up)
    if (currentScrollY > 100) {
      header.classList.add("nav-scrolled");
      if (currentScrollY > lastScrollY) {
        header.classList.add("nav-hidden"); // Scroll down
      } else {
        header.classList.remove("nav-hidden"); // Scroll up
      }
    } else {
      header.classList.remove("nav-scrolled");
      header.classList.remove("nav-hidden");
    }
    
    lastScrollY = currentScrollY;
    
    // Highlight Active Link in Navbar on scroll
    let currentActiveSectionId = "";
    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (currentScrollY >= sectionTop && currentScrollY < sectionTop + sectionHeight) {
        currentActiveSectionId = section.getAttribute("id");
      }
    });
    
    if (currentActiveSectionId) {
      navLinks.forEach((link) => {
        link.classList.remove("active");
        if (link.getAttribute("href") === `#${currentActiveSectionId}`) {
          link.classList.add("active");
        }
      });
    }
    
    // Specific Timeline Scroll Animation
    animateTimelineProgress();
  });

  /* ==========================================================================
     2. MOBILE MENU LOGIC
     ========================================================================== */
  const mobileMenu = document.getElementById("mobile-menu");
  const navMenu = document.querySelector(".nav-menu");

  if (mobileMenu && navMenu) {
    mobileMenu.addEventListener("click", () => {
      navMenu.classList.toggle("active");
      mobileMenu.classList.toggle("open");
    });

    // Close mobile menu when a link is clicked
    navMenu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        navMenu.classList.remove("active");
        mobileMenu.classList.remove("open");
      });
    });
  }

  /* ==========================================================================
     3. INTERSECTION OBSERVER FOR FADE-IN & SLIDE-UP ANIMATIONS
     ========================================================================== */
  const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.15,
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("reveal-active");
        observer.unobserve(entry.target); // Stop observing after animation is fired
      }
    });
  }, observerOptions);

  const hiddenElements = document.querySelectorAll(
    ".reveal-slide-up, .reveal-slide-left, .reveal-slide-right, .reveal-fade"
  );
  hiddenElements.forEach((el) => observer.observe(el));

  /* ==========================================================================
     4. TIMELINE SCROLL PROGRESS ANIMATION
     ========================================================================== */
  const timelineProgress = document.getElementById("timeline-progress");
  const timelineItems = document.querySelectorAll(".timeline-item");
  const timelineContainer = document.querySelector(".timeline");

  function animateTimelineProgress() {
    if (!timelineProgress || !timelineContainer || timelineItems.length === 0) return;
    
    const triggerOffset = window.innerHeight * 0.7; // Animate when line passes 70% of screen height
    const containerRect = timelineContainer.getBoundingClientRect();
    const containerTop = containerRect.top + window.scrollY;
    const containerHeight = containerRect.height;
    
    // Scroll progress through timeline container
    const scrollFromContainerTop = (window.scrollY + triggerOffset) - containerTop;
    let progressPercent = (scrollFromContainerTop / containerHeight) * 100;
    
    // Clamp between 0% and 100%
    progressPercent = Math.max(0, Math.min(100, progressPercent));
    timelineProgress.style.height = `${progressPercent}%`;
    
    // Highlight timeline dots as scroll passes them
    timelineItems.forEach((item) => {
      const itemRect = item.getBoundingClientRect();
      const dotTop = itemRect.top + window.scrollY;
      
      if (window.scrollY + triggerOffset >= dotTop) {
        item.classList.add("active-dot");
      } else {
        item.classList.remove("active-dot");
      }
    });
  }

  /* ==========================================================================
     5. PROJECTS DYNAMIC FILTERS
     ========================================================================== */
  const filterButtons = document.querySelectorAll(".filter-btn");
  const projectCards = document.querySelectorAll(".project-card");

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      // Remove active class from other buttons and add to clicked
      filterButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");

      const filterValue = button.getAttribute("data-filter");

      projectCards.forEach((card) => {
        const cardCategories = card.getAttribute("data-category").split(" ");
        
        // Hide card with smooth scale & fade transition
        if (filterValue === "all" || cardCategories.includes(filterValue)) {
          card.style.display = "flex";
          setTimeout(() => {
            card.style.opacity = "1";
            card.style.transform = "scale(1)";
          }, 50);
        } else {
          card.style.opacity = "0";
          card.style.transform = "scale(0.92)";
          setTimeout(() => {
            card.style.display = "none";
          }, 300); // Wait for transition to complete
        }
      });
    });
  });

  /* ==========================================================================
     6. INTERACTIVE CANVAS PARTICLES (HERO BACKGROUND)
     ========================================================================== */
  const canvas = document.getElementById("hero-particles");
  if (canvas) {
    const ctx = canvas.getContext("2d");
    let particlesArray = [];
    let animationFrameId;

    // Mouse coordinates
    let mouse = {
      x: null,
      y: null,
      radius: 120 // Interaction radius
    };

    window.addEventListener("mousemove", (event) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = event.clientX - rect.left;
      mouse.y = event.clientY - rect.top;
    });

    window.addEventListener("mouseleave", () => {
      mouse.x = null;
      mouse.y = null;
    });

    // Resize handler
    function resizeCanvas() {
      canvas.width = canvas.parentElement.offsetWidth;
      canvas.height = canvas.parentElement.offsetHeight;
      initParticles();
    }
    window.addEventListener("resize", resizeCanvas);
    
    // Set initial size
    canvas.width = canvas.parentElement.offsetWidth;
    canvas.height = canvas.parentElement.offsetHeight;

    // Particle Class
    class Particle {
      constructor(x, y, directionX, directionY, size, color) {
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
        this.color = color;
      }

      // Draw single particle
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
      }

      // Update particle position & handle collision/repulsion
      update() {
        // Wrap around borders
        if (this.x > canvas.width || this.x < 0) {
          this.directionX = -this.directionX;
        }
        if (this.y > canvas.height || this.y < 0) {
          this.directionY = -this.directionY;
        }

        // Check mouse collision (repulsion effect)
        if (mouse.x !== null && mouse.y !== null) {
          let dx = mouse.x - this.x;
          let dy = mouse.y - this.y;
          let distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < mouse.radius + this.size) {
            if (mouse.x < this.x && this.x < canvas.width - this.size * 10) {
              this.x += 2;
            }
            if (mouse.x > this.x && this.x > this.size * 10) {
              this.x -= 2;
            }
            if (mouse.y < this.y && this.y < canvas.height - this.size * 10) {
              this.y += 2;
            }
            if (mouse.y > this.y && this.y > this.size * 10) {
              this.y -= 2;
            }
          }
        }

        // Move particle
        this.x += this.directionX;
        this.y += this.directionY;
        this.draw();
      }
    }

    // Initialize particles array
    function initParticles() {
      particlesArray = [];
      // Dynamic particle count based on canvas width
      const numberOfParticles = Math.min(70, Math.floor((canvas.width * canvas.height) / 12000));
      
      const particleColors = [
        "rgba(139, 92, 246, 0.25)", // Violet glow
        "rgba(6, 182, 212, 0.25)",  // Cyan glow
        "rgba(59, 130, 246, 0.2)"    // Blue glow
      ];

      for (let i = 0; i < numberOfParticles; i++) {
        let size = Math.random() * 2.5 + 1;
        let x = Math.random() * (canvas.width - size * 2) + size;
        let y = Math.random() * (canvas.height - size * 2) + size;
        let directionX = (Math.random() * 0.6) - 0.3;
        let directionY = (Math.random() * 0.6) - 0.3;
        let color = particleColors[Math.floor(Math.random() * particleColors.length)];

        particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
      }
    }

    // Draw connecting lines between close particles
    function connectParticles() {
      let maxDistance = 115;
      for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
          let dx = particlesArray[a].x - particlesArray[b].x;
          let dy = particlesArray[a].y - particlesArray[b].y;
          let distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < maxDistance) {
            // Faint opacity based on distance
            let opacity = (1 - (distance / maxDistance)) * 0.12;
            ctx.strokeStyle = `rgba(139, 92, 246, ${opacity})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
            ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
            ctx.stroke();
          }
        }
      }
    }

    // Animation Loop
    function animateParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
      }
      
      connectParticles();
      animationFrameId = requestAnimationFrame(animateParticles);
    }

    // Launch
    resizeCanvas();
    animateParticles();
  }
});
