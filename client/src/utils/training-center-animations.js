// Training Center Animations and Interactions
class TrainingCenterAnimations {
  constructor() {
    this.init();
  }

  init() {
    this.setupIntersectionObserver();
    this.setupScrollAnimations();
    this.setupHoverEffects();
    this.setupParallaxEffect();
    this.setupSmoothScrolling();
  }

  // Intersection Observer for fade-in animations
  setupIntersectionObserver() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Observe elements with animation classes
    const animatedElements = document.querySelectorAll('.fade-in, .slide-up, .slide-left, .slide-right');
    animatedElements.forEach(el => {
      observer.observe(el);
    });
  }

  // Scroll-based animations
  setupScrollAnimations() {
    let ticking = false;

    const updateAnimations = () => {
      const scrolled = window.pageYOffset;
      const parallaxElements = document.querySelectorAll('.parallax');
      
      parallaxElements.forEach(element => {
        const speed = element.dataset.speed || 0.5;
        const yPos = -(scrolled * speed);
        element.style.transform = `translate3d(0, ${yPos}px, 0)`;
      });

      ticking = false;
    };

    const requestTick = () => {
      if (!ticking) {
        requestAnimationFrame(updateAnimations);
        ticking = true;
      }
    };

    window.addEventListener('scroll', requestTick);
  }

  // Enhanced hover effects
  setupHoverEffects() {
    // Card hover effects
    const cards = document.querySelectorAll('.training-center-card');
    cards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        this.animateCard(card, 'enter');
      });
      
      card.addEventListener('mouseleave', () => {
        this.animateCard(card, 'leave');
      });
    });

    // Button hover effects
    const buttons = document.querySelectorAll('.training-center-btn');
    buttons.forEach(button => {
      button.addEventListener('mouseenter', (e) => {
        this.createRippleEffect(button, e);
      });
    });
  }

  // Card animation helper
  animateCard(card, direction) {
    if (direction === 'enter') {
      card.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
      card.style.transform = 'translateY(-8px) scale(1.02)';
      card.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
    } else {
      card.style.transform = 'translateY(0) scale(1)';
      card.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.12)';
    }
  }

  // Ripple effect for buttons
  createRippleEffect(button, event) {
    const ripple = document.createElement('span');
    ripple.classList.add('ripple');
    button.style.position = 'relative'; // Ensure relative positioning

    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);

    ripple.style.width = ripple.style.height = size + 'px';

    // Use mouse position relative to button for centering
    const x = event ? event.clientX - rect.left : rect.width / 2;
    const y = event ? event.clientY - rect.top : rect.height / 2;

    ripple.style.left = (x - size / 2) + 'px';
    ripple.style.top = (y - size / 2) + 'px';

    button.appendChild(ripple);

    setTimeout(() => {
      if (ripple.parentNode) {
        ripple.parentNode.removeChild(ripple);
      }
    }, 600);
  }



  // Parallax scrolling effect
  setupParallaxEffect() {
    const parallaxElements = document.querySelectorAll('.parallax-bg');
    
    window.addEventListener('scroll', () => {
      const scrollTop = window.pageYOffset;
      
      parallaxElements.forEach(element => {
        const speed = element.dataset.speed || 0.5;
        const yPos = -(scrollTop * speed);
        element.style.transform = `translateY(${yPos}px)`;
      });
    });
  }

  // Smooth scrolling for anchor links
  setupSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        
        const targetId = link.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
          const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - 80;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
  }

  // Number counting animation
  animateNumbers() {
    const numbers = document.querySelectorAll('.animate-number');
    
    numbers.forEach(numberElement => {
      const finalNumber = parseInt(numberElement.textContent);
      const duration = 2000; // 2 seconds
      const increment = finalNumber / (duration / 16); // 60 FPS
      
      let currentNumber = 0;
      numberElement.textContent = '0';
      
      const timer = setInterval(() => {
        currentNumber += increment;
        if (currentNumber >= finalNumber) {
          numberElement.textContent = finalNumber;
          clearInterval(timer);
        } else {
          numberElement.textContent = Math.floor(currentNumber);
        }
      }, 16);
    });
  }
}

// Initialize animations when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Initialize Training Center animations
  new TrainingCenterAnimations();
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = TrainingCenterAnimations;
}