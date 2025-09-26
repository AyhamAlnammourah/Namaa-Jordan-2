// Enhanced Food Security in Jordan - Complete JavaScript
(function() {
  'use strict';

  // Global application state
  const App = {
    currentLanguage: 'en',
    currentQuizQuestion: 0,
    quizAnswers: [],
    quizData: [],
    charts: {},
    isLoading: false,
    initialized: false
  };

  // Utility functions
  const utils = {
    debounce(func, wait) {
      let timeout;
      return function executedFunction(...args) {
        const later = () => {
          clearTimeout(timeout);
          func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
      };
    },

    throttle(func, limit) {
      let inThrottle;
      return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
          func.apply(context, args);
          inThrottle = true;
          setTimeout(() => inThrottle = false, limit);
        }
      };
    },

    formatNumber(num) {
      if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
      } else if (num >= 1000) {
        return (num / 1000).toFixed(0) + 'K';
      }
      return num.toString();
    },

    animateCounter(element, target, duration = 2000) {
      const start = 0;
      const increment = target / (duration / 16);
      let current = start;
      
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        element.textContent = Math.floor(current).toLocaleString();
      }, 16);
    }
  };

  // Smooth scrolling for internal links
  function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href.length > 1) {
          e.preventDefault();
          const target = document.querySelector(href);
          if (target) {
            const headerOffset = 100;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
            
            window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth'
            });
            
            // Update active nav link
            updateActiveNavLink(href);
          }
        }
      });
    });
  }

  // Update active navigation link
  function updateActiveNavLink(activeHref) {
    document.querySelectorAll('.nav-menu a').forEach(link => {
      link.classList.remove('active');
    });
    const activeLink = document.querySelector(`.nav-menu a[href="${activeHref}"]`);
    if (activeLink) {
      activeLink.classList.add('active');
    }
  }

  // Mobile navigation toggle
  function initMobileNavigation() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (navToggle && navMenu) {
      navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
      });
      
      // Close menu when clicking outside
      document.addEventListener('click', (e) => {
        if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
          navToggle.classList.remove('active');
          navMenu.classList.remove('active');
        }
      });
    }
  }

  // Enhanced particles background
  function initParticles() {
    const canvas = document.getElementById('particles');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let w, h, particles = [], rafId;
    const count = window.innerWidth < 768 ? 40 : 80;
    const colors = ['#2ecc71', '#27ae60', '#a3ffcb', '#6ef7a9', '#1abc9c'];

    function resize() {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    }

    function rand(min, max) {
      return Math.random() * (max - min) + min;
    }

    function init() {
      particles = new Array(count).fill(0).map(() => ({
        x: rand(0, w),
        y: rand(0, h),
        r: rand(1, 3.2),
        s: rand(0.4, 1.2),
        a: rand(0, Math.PI * 2),
        c: colors[Math.floor(Math.random() * colors.length)],
        opacity: rand(0.3, 0.8)
      }));
    }

    function draw() {
      ctx.clearRect(0, 0, w, h);
      
      for (const p of particles) {
        p.a += 0.002;
        p.x += Math.cos(p.a) * p.s;
        p.y += Math.sin(p.a) * p.s * 0.6;
        
        // Wrap around screen
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;
        if (p.y < -10) p.y = h + 10;
        if (p.y > h + 10) p.y = -10;
        
        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.c;
        ctx.globalAlpha = p.opacity;
        ctx.fill();
        ctx.globalAlpha = 1;
      }
      
      rafId = requestAnimationFrame(draw);
    }

    const debouncedResize = utils.debounce(() => {
      resize();
      init();
    }, 250);

    window.addEventListener('resize', debouncedResize);
    resize();
    init();
    draw();
  }

  // Intersection Observer for reveal animations
  function initScrollAnimations() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          
          // Animate counters when they come into view
          if (entry.target.classList.contains('stat-card')) {
            const numberElement = entry.target.querySelector('.stat-number[data-count]');
            if (numberElement && !numberElement.classList.contains('animated')) {
              numberElement.classList.add('animated');
              const target = parseInt(numberElement.dataset.count);
              utils.animateCounter(numberElement, target);
            }
          }
        }
      });
    }, observerOptions);

    // Observe all fade-up elements
    document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));
  }

  // Initialize charts using ChartManager
  async function initCharts() {
    if (!window.Chart) {
      console.warn('Chart.js not loaded');
      return;
    }

    // Use ChartManager if available, otherwise fallback to basic charts
    if (window.chartManager) {
      try {
        // Create charts using ChartManager
        await window.chartManager.createLandUseChart('chartLandUse');
        await window.chartManager.createCropProductionChart('chartCropProduction');
        await window.chartManager.createTimelineChart('chartTimeline');
        console.log('Charts initialized using ChartManager');
      } catch (error) {
        console.error('Error initializing charts with ChartManager:', error);
        initFallbackCharts();
      }
    } else {
      console.warn('ChartManager not available, using fallback charts');
      initFallbackCharts();
    }
  }

  // Fallback chart initialization
  function initFallbackCharts() {
    // Chart.js global configuration
    Chart.defaults.font.family = "'Poppins', 'Cairo', system-ui";
    Chart.defaults.font.size = 12;
    Chart.defaults.color = '#eafff2';

    // Land Use Distribution Chart
    const landUseCtx = document.getElementById('chartLandUse');
    if (landUseCtx) {
      App.charts.landUse = new Chart(landUseCtx, {
        type: 'doughnut',
        data: {
          labels: ['Desert', 'Arable Land', 'Forest', 'Urban', 'Water Bodies'],
          datasets: [{
            data: [70, 3, 1, 4, 22],
            backgroundColor: ['#e67e22', '#2ecc71', '#27ae60', '#95a5a6', '#3498db'],
            borderWidth: 0,
            hoverOffset: 10
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: { color: '#eafff2', padding: 15 }
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  return context.label + ': ' + context.parsed + '%';
                }
              }
            }
          }
        }
      });
    }

    // Crop Production Chart
    const cropProdCtx = document.getElementById('chartCropProduction');
    if (cropProdCtx) {
      App.charts.cropProd = new Chart(cropProdCtx, {
        type: 'bar',
        data: {
          labels: ['Olives', 'Tomatoes', 'Citrus', 'Wheat', 'Barley', 'Vegetables'],
          datasets: [{
            label: 'Production (1000 tons)',
            data: [240, 180, 180, 25, 15, 350],
            backgroundColor: [
              '#2ecc71', '#e74c3c', '#f39c12', 
              '#f1c40f', '#9b59b6', '#1abc9c'
            ],
            borderRadius: 8,
            borderSkipped: false
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false }
          },
          scales: {
            x: { 
              ticks: { color: '#eafff2' },
              grid: { color: 'rgba(255,255,255,0.08)' }
            },
            y: { 
              ticks: { color: '#eafff2' },
              grid: { color: 'rgba(255,255,255,0.08)' },
              beginAtZero: true
            }
          }
        }
      });
    }
  }

  // Tab system for crops, plants, and diseases
  function initTabSystem() {
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const category = btn.dataset.category;
        const parent = btn.closest('section');
        
        // Update active tab
        parent.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Update active content
        parent.querySelectorAll('.crop-content, .plant-content, .disease-content').forEach(content => {
          content.classList.remove('active');
        });
        
        const activeContent = parent.querySelector(`#${category}`);
        if (activeContent) {
          activeContent.classList.add('active');
        }
      });
    });
  }

  // Search functionality
  function initSearch() {
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    
    if (!searchInput) return;
    
    const performSearch = utils.debounce((query) => {
      if (!query.trim()) return;
      
      const sections = document.querySelectorAll('section[id]');
      let found = false;
      
      sections.forEach(section => {
        const text = section.textContent.toLowerCase();
        if (text.includes(query.toLowerCase())) {
          section.scrollIntoView({ behavior: 'smooth' });
          found = true;
          return;
        }
      });
      
      if (!found) {
        alert('No results found for: ' + query);
      }
    }, 300);
    
    searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        performSearch(searchInput.value);
      }
    });
    
    if (searchBtn) {
      searchBtn.addEventListener('click', () => {
        performSearch(searchInput.value);
      });
    }
  }

  // Lightbox functionality
  function initLightbox() {
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const lightboxClose = document.getElementById('lightboxClose');
    
    if (!lightbox) return;
    
    // Add click listeners to all images
    document.querySelectorAll('img[src*="unsplash"], .crop-image img, .plant-image img').forEach(img => {
      img.style.cursor = 'pointer';
      img.addEventListener('click', () => {
        lightboxImage.src = img.src;
        lightboxCaption.textContent = img.alt || img.closest('figure')?.querySelector('figcaption')?.textContent || '';
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
      });
    });
    
    // Close lightbox
    const closeLightbox = () => {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
    };
    
    lightboxClose?.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
    
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightbox.classList.contains('active')) {
        closeLightbox();
      }
    });
  }

  // Quiz functionality
  function initQuiz() {
    // Quiz questions data
    App.quizData = [
      {
        question: "What percentage of Jordan is desert?",
        options: ["50%", "60%", "70%", "80%"],
        correct: 2,
        explanation: "Jordan is approximately 70% desert, making water conservation crucial for agriculture."
      },
      {
        question: "What is the most efficient irrigation method used in Jordan?",
        options: ["Surface irrigation", "Sprinkler irrigation", "Drip irrigation", "Flood irrigation"],
        correct: 2,
        explanation: "Drip irrigation is 90-95% efficient and is widely used in Jordan Valley."
      },
      {
        question: "Which crop occupies the largest cultivated area in Jordan?",
        options: ["Wheat", "Tomatoes", "Olives", "Barley"],
        correct: 2,
        explanation: "Olives occupy about 60% of Jordan's cultivated area and are the most important crop."
      },
      {
        question: "What is Jordan's national flower?",
        options: ["Rose", "Black Iris", "Jasmine", "Sunflower"],
        correct: 1,
        explanation: "The Black Iris (Iris nigricans) is Jordan's national flower, blooming in spring."
      },
      {
        question: "How much water can vertical farming save compared to traditional farming?",
        options: ["50%", "70%", "85%", "95%"],
        correct: 3,
        explanation: "Vertical farming can save up to 95% of water through recirculating hydroponic systems."
      },
      {
        question: "What percentage of Jordan's water needs does the country face stress in?",
        options: ["85%", "90%", "95%", "97%"],
        correct: 3,
        explanation: "Jordan is 97% water-stressed, making it one of the most water-scarce countries globally."
      },
      {
        question: "Which disease is a major threat to Jordan's olive industry?",
        options: ["Wheat rust", "Olive fruit fly", "Tomato blight", "Bacterial wilt"],
        correct: 1,
        explanation: "Olive fruit fly can cause 30-80% yield losses in untreated olive orchards."
      },
      {
        question: "What percentage does agriculture contribute to Jordan's GDP?",
        options: ["1%", "3%", "5%", "7%"],
        correct: 1,
        explanation: "Agriculture contributes approximately 3% to Jordan's GDP."
      },
      {
        question: "How many farmers are there approximately in Jordan?",
        options: ["120,000", "180,000", "240,000", "300,000"],
        correct: 2,
        explanation: "Jordan has approximately 240,000 farmers working in the agricultural sector."
      },
      {
        question: "What is the main advantage of greenhouse farming in Jordan?",
        options: ["Higher costs", "More labor", "Water efficiency", "Larger space"],
        correct: 2,
        explanation: "Greenhouse farming provides 85% water savings compared to open field cultivation."
      }
    ];

    const quizContainer = document.getElementById('quizContent');
    const questionText = document.getElementById('questionText');
    const answersContainer = document.getElementById('answersContainer');
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    const quizScore = document.getElementById('quizScore');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const quizResults = document.getElementById('quizResults');
    const finalScore = document.getElementById('finalScore');
    const scoreMessage = document.getElementById('scoreMessage');
    const restartQuiz = document.getElementById('restartQuiz');

    if (!quizContainer) return;

    function updateQuizDisplay() {
      const currentQ = App.quizData[App.currentQuizQuestion];
      questionText.textContent = currentQ.question;
      
      answersContainer.innerHTML = '';
      currentQ.options.forEach((option, index) => {
        const answerDiv = document.createElement('div');
        answerDiv.className = 'answer-option';
        answerDiv.textContent = option;
        answerDiv.addEventListener('click', () => selectAnswer(index));
        answersContainer.appendChild(answerDiv);
      });

      // Update progress
      const progress = ((App.currentQuizQuestion + 1) / App.quizData.length) * 100;
      progressFill.style.width = progress + '%';
      progressText.textContent = `Question ${App.currentQuizQuestion + 1} of ${App.quizData.length}`;
      
      // Update score
      const correctAnswers = App.quizAnswers.filter(a => a.correct).length;
      quizScore.textContent = `Score: ${correctAnswers}/${App.quizAnswers.length}`;
      
      // Update buttons
      prevBtn.disabled = App.currentQuizQuestion === 0;
      nextBtn.textContent = App.currentQuizQuestion === App.quizData.length - 1 ? 'Finish' : 'Next';
    }

    function selectAnswer(selectedIndex) {
      const options = answersContainer.querySelectorAll('.answer-option');
      options.forEach(opt => opt.classList.remove('selected'));
      options[selectedIndex].classList.add('selected');
      
      App.quizAnswers[App.currentQuizQuestion] = {
        selected: selectedIndex,
        correct: selectedIndex === App.quizData[App.currentQuizQuestion].correct
      };
    }

    function showResults() {
      const correctAnswers = App.quizAnswers.filter(a => a.correct).length;
      const percentage = Math.round((correctAnswers / App.quizData.length) * 100);
      
      quizContainer.style.display = 'none';
      quizResults.classList.remove('hidden');
      
      finalScore.textContent = `${correctAnswers}/${App.quizData.length}`;
      
      let message = '';
      if (percentage >= 90) message = 'Excellent! You\'re a food security expert!';
      else if (percentage >= 70) message = 'Great job! You have solid knowledge.';
      else if (percentage >= 50) message = 'Good effort! Keep learning.';
      else message = 'Keep studying to improve your knowledge.';
      
      scoreMessage.textContent = message;
    }

    function resetQuiz() {
      App.currentQuizQuestion = 0;
      App.quizAnswers = [];
      quizContainer.style.display = 'block';
      quizResults.classList.add('hidden');
      updateQuizDisplay();
    }

    // Event listeners
    prevBtn?.addEventListener('click', () => {
      if (App.currentQuizQuestion > 0) {
        App.currentQuizQuestion--;
        updateQuizDisplay();
      }
    });

    nextBtn?.addEventListener('click', () => {
      if (App.currentQuizQuestion < App.quizData.length - 1) {
        App.currentQuizQuestion++;
        updateQuizDisplay();
      } else {
        showResults();
      }
    });

    restartQuiz?.addEventListener('click', resetQuiz);

    // Initialize quiz
    resetQuiz();
  }

  // Contact form functionality
  function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const formData = new FormData(contactForm);
      const data = Object.fromEntries(formData);
      
      // Simulate form submission
      showLoading(true);
      
      setTimeout(() => {
        showLoading(false);
        alert('Thank you for your message! We will get back to you soon.');
        contactForm.reset();
      }, 2000);
    });
  }

  // Social sharing functionality
  function initSocialSharing() {
    const socialButtons = document.querySelectorAll('.social-btn');
    
    socialButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        
        const url = encodeURIComponent(window.location.href);
        const title = encodeURIComponent(document.title);
        const text = encodeURIComponent('Check out this comprehensive guide to Food Security in Jordan!');
        
        let shareUrl = '';
        
        if (btn.classList.contains('facebook')) {
          shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        } else if (btn.classList.contains('twitter')) {
          shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${text}`;
        } else if (btn.classList.contains('linkedin')) {
          shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
        } else if (btn.classList.contains('whatsapp')) {
          shareUrl = `https://wa.me/?text=${text}%20${url}`;
        }
        
        if (shareUrl) {
          window.open(shareUrl, '_blank', 'width=600,height=400');
        }
      });
    });
  }

  // Loading overlay
  function showLoading(show) {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
      if (show) {
        overlay.classList.add('active');
        App.isLoading = true;
      } else {
        overlay.classList.remove('active');
        App.isLoading = false;
      }
    }
  }

  // Language system integration with LanguageManager
  function initLanguageSystem() {
    // Use the global languageManager instance from language-manager.js
    if (window.languageManager) {
      console.log('LanguageManager found and ready');
      
      // إجبار تحديث النصوص بعد تأخير قصير
      setTimeout(() => {
        if (window.languageManager.isLoaded) {
          window.languageManager.updateAllTexts();
          console.log('Forced text update from app.js');
        }
      }, 1000);
    } else {
      console.warn('LanguageManager not found, language switching may not work');
    }
  }

  // Scroll-based navigation highlighting
  function initScrollNavigation() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
    
    const observerOptions = {
      threshold: 0.3,
      rootMargin: '-100px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          updateActiveNavLink(`#${id}`);
        }
      });
    }, observerOptions);
    
    sections.forEach(section => observer.observe(section));
  }

  // Initialize all functionality
  async function init() {
    if (App.initialized) {
      console.warn('App already initialized');
      return;
    }

    try {
      console.log('Initializing Food Security in Jordan application...');
      
      // Core functionality
      initSmoothScrolling();
      initMobileNavigation();
      initParticles();
      initScrollAnimations();
      initScrollNavigation();
      
      // Language system (initialize early)
      initLanguageSystem();
      
      // Charts and data (async)
      await initCharts();
      
      // Interactive features
      initTabSystem();
      initSearch();
      initLightbox();
      initQuiz();
      initContactForm();
      initSocialSharing();
      
      App.initialized = true;
      console.log('Food Security in Jordan website initialized successfully!');
      
    } catch (error) {
      console.error('Error during initialization:', error);
      App.initialized = false;
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
