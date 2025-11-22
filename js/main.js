// INNLUXE - Main JavaScript File

// Supabase Configuration
const SUPABASE_URL = 'https://rqdhwrtkweeuiqjrvbrd.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJxZGh3cnRrd2VldWlxanJ2YnJkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE2NTgxNTYsImV4cCI6MjA3NzIzNDE1Nn0.R_84JD0cRrYjdTd6mU837bfwcBdw9s9a8EEYRHE70uE';

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
  initNavigation();
  initHeroCarousel();
  initPropertyCarousel();
  initBeforeAfterSlider();
  initForms();
  initFilters();
});

// Navigation
function initNavigation() {
  const nav = document.querySelector('nav');
  const mobileMenuButton = document.querySelector('.mobile-menu-button');
  const mobileMenu = document.querySelector('.mobile-menu');
  
  if (!nav) return;
  
  // Scroll effect
  window.addEventListener('scroll', function() {
    if (window.scrollY > 20) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  });
  
  // Mobile menu toggle
  if (mobileMenuButton && mobileMenu) {
    mobileMenuButton.addEventListener('click', function() {
      mobileMenu.classList.toggle('active');
      const isOpen = mobileMenu.classList.contains('active');
      mobileMenuButton.innerHTML = isOpen ? '×' : '☰';
    });
    
    // Close mobile menu on link click
    const mobileLinks = mobileMenu.querySelectorAll('a');
    mobileLinks.forEach(link => {
      link.addEventListener('click', function() {
        mobileMenu.classList.remove('active');
        mobileMenuButton.innerHTML = '☰';
      });
    });
  }
  
  // Set active link
  const currentPage = window.location.pathname.split('/').pop() || '';
  const navLinks = document.querySelectorAll('.nav-links a');
  navLinks.forEach(link => {
    const linkPage = link.getAttribute('href');
    // Handle root/home page
    if ((currentPage === '' || currentPage === 'index.html') && (linkPage === './' || linkPage === '/' || linkPage === 'index.html')) {
      link.classList.add('active');
    } else if (linkPage === currentPage) {
      link.classList.add('active');
    }
  });
}

// Hero Image Carousel (for homepage)
function initHeroCarousel() {
  const heroImages = document.querySelectorAll('.hero-image-slide');
  if (heroImages.length <= 1) return;
  
  let currentIndex = 0;
  
  function showNextImage() {
    heroImages[currentIndex].style.opacity = '0';
    currentIndex = (currentIndex + 1) % heroImages.length;
    heroImages[currentIndex].style.opacity = '1';
  }
  
  // Show first image
  if (heroImages.length > 0) {
    heroImages[0].style.opacity = '1';
  }
  
  // Rotate every 10 seconds
  setInterval(showNextImage, 10000);
}

// Property Carousel Animation
function initPropertyCarousel() {
  const carousel = document.querySelector('.property-carousel');
  if (!carousel) return;
  
  // Clone items for infinite scroll
  const items = carousel.querySelectorAll('.property-carousel-item');
  items.forEach(item => {
    const clone = item.cloneNode(true);
    carousel.appendChild(clone);
  });
}

// Before/After Slider (for Repairs page)
function initBeforeAfterSlider() {
  const slider = document.querySelector('.before-after-slider');
  if (!slider) return;
  
  const afterImage = slider.querySelector('.after-image');
  const handle = slider.querySelector('.slider-handle');
  let isDragging = false;
  
  function updateSlider(e) {
    if (!isDragging && e.type !== 'click') return;
    
    const rect = slider.getBoundingClientRect();
    const x = (e.clientX || e.touches[0].clientX) - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    
    if (afterImage) {
      afterImage.style.clipPath = `inset(0 ${100 - percentage}% 0 0)`;
    }
    if (handle) {
      handle.style.left = `${percentage}%`;
    }
  }
  
  slider.addEventListener('mousedown', function(e) {
    isDragging = true;
    updateSlider(e);
  });
  
  slider.addEventListener('touchstart', function(e) {
    isDragging = true;
    updateSlider(e);
  });
  
  document.addEventListener('mousemove', updateSlider);
  document.addEventListener('touchmove', updateSlider);
  
  document.addEventListener('mouseup', function() {
    isDragging = false;
  });
  
  document.addEventListener('touchend', function() {
    isDragging = false;
  });
  
  slider.addEventListener('click', updateSlider);
}

// Form Handling
function initForms() {
  // Sell Form (Multi-step)
  const sellForm = document.getElementById('sell-form');
  if (sellForm) {
    initSellForm();
  }
  
  // Contact Form (About page)
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', handleContactForm);
  }
  
  // Renovation Form
  const renovationForm = document.getElementById('renovation-form');
  if (renovationForm) {
    renovationForm.addEventListener('submit', handleRenovationForm);
  }
}

// Multi-step Sell Form
function initSellForm() {
  let currentStep = 1;
  const totalSteps = 3;
  
  const nextButtons = document.querySelectorAll('.btn-next');
  const prevButtons = document.querySelectorAll('.btn-prev');
  const submitButton = document.querySelector('.btn-submit');
  
  function updateProgress() {
    const progress = (currentStep / totalSteps) * 100;
    const progressFill = document.querySelector('.progress-fill');
    if (progressFill) {
      progressFill.style.width = `${progress}%`;
    }
    
    // Update step labels
    const stepLabels = document.querySelectorAll('.progress-steps span');
    stepLabels.forEach((label, index) => {
      if (index + 1 === currentStep) {
        label.classList.add('active');
      } else {
        label.classList.remove('active');
      }
    });
  }
  
  function showStep(step) {
    document.querySelectorAll('.form-step').forEach(s => s.classList.add('hidden'));
    const stepElement = document.querySelector(`.step-${step}`);
    if (stepElement) {
      stepElement.classList.remove('hidden');
      stepElement.classList.add('fade-in');
    }
    updateProgress();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  
  nextButtons.forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      if (currentStep < totalSteps) {
        currentStep++;
        showStep(currentStep);
      }
    });
  });
  
  prevButtons.forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      if (currentStep > 1) {
        currentStep--;
        showStep(currentStep);
      }
    });
  });
  
  if (submitButton) {
    submitButton.addEventListener('click', handleSellForm);
  }
  
  // Initialize first step
  showStep(1);
}

// Handle Sell Form Submission
async function handleSellForm(e) {
  e.preventDefault();
  
  const formData = {
    name: document.getElementById('name')?.value,
    email: document.getElementById('email')?.value,
    phone: document.getElementById('phone')?.value,
    address: document.getElementById('address')?.value,
    city: document.getElementById('city')?.value,
    contact_method: document.querySelector('input[name="contact_method"]:checked')?.value || 'phone',
    best_time: document.getElementById('best_time')?.value || '',
    property_type: document.getElementById('property_type')?.value,
    surface_area: document.getElementById('surface_area')?.value,
    bedrooms: document.getElementById('bedrooms')?.value || '',
    bathrooms: document.getElementById('bathrooms')?.value || '',
    year_built: document.getElementById('year_built')?.value || '',
    condition: document.getElementById('condition')?.value,
    features: document.getElementById('features')?.value || '',
    urgency: document.getElementById('urgency')?.value,
    desired_price: document.getElementById('desired_price')?.value,
    mortgage: document.querySelector('input[name="mortgage"]:checked')?.value || 'no',
    viewing_availability: document.getElementById('viewing_availability')?.value,
    additional_info: document.getElementById('additional_info')?.value || ''
  };
  
  try {
    showLoading(true);
    const success = await submitToSupabase('sell_form_submissions', formData);
    
    if (success) {
      showSuccessMessage('sell');
    } else {
      alert('Erreur lors de l\'envoi du formulaire. Veuillez réessayer.');
    }
  } catch (error) {
    console.error('Error submitting form:', error);
    alert('Une erreur inattendue s\'est produite. Veuillez réessayer.');
  } finally {
    showLoading(false);
  }
}

// Handle Contact Form Submission
async function handleContactForm(e) {
  e.preventDefault();
  
  const formData = {
    name: document.getElementById('contact-name')?.value,
    email: document.getElementById('contact-email')?.value,
    phone: document.getElementById('contact-phone')?.value || '',
    message: document.getElementById('contact-message')?.value
  };
  
  try {
    showLoading(true);
    const success = await submitToSupabase('contact_form_submissions', formData);
    
    if (success) {
      alert('Message envoyé avec succès ! Nous vous contacterons bientôt.');
      e.target.reset();
    } else {
      alert('Erreur lors de l\'envoi du message. Veuillez réessayer.');
    }
  } catch (error) {
    console.error('Error submitting form:', error);
    alert('Une erreur inattendue s\'est produite. Veuillez réessayer.');
  } finally {
    showLoading(false);
  }
}

// Handle Renovation Form Submission
async function handleRenovationForm(e) {
  e.preventDefault();
  
  const formData = {
    name: document.getElementById('renovation-name')?.value,
    email: document.getElementById('renovation-email')?.value,
    phone: document.getElementById('renovation-phone')?.value,
    address: document.getElementById('renovation-address')?.value,
    city: document.getElementById('renovation-city')?.value,
    repair_type: document.getElementById('renovation-type')?.value,
    urgency: document.getElementById('renovation-urgency')?.value,
    description: document.getElementById('description')?.value
  };
  
  try {
    showLoading(true);
    const success = await submitToSupabase('renovation_form_submissions', formData);
    
    if (success) {
      showSuccessMessage('renovation');
    } else {
      alert('Erreur lors de l\'envoi du formulaire. Veuillez réessayer.');
    }
  } catch (error) {
    console.error('Error submitting form:', error);
    alert('Une erreur inattendue s\'est produite. Veuillez réessayer.');
  } finally {
    showLoading(false);
  }
}

// Submit to Supabase using REST API
async function submitToSupabase(table, data) {
  try {
    // Add timestamp to data
    const dataWithTimestamp = {
      ...data,
      created_at: new Date().toISOString()
    };
    
    const response = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify(dataWithTimestamp)
    });
    
    if (response.ok || response.status === 201) {
      console.log(`Form submitted successfully to ${table}`);
      return true;
    } else {
      const errorText = await response.text();
      console.error(`Supabase error (${response.status}):`, errorText);
      
      // Try to parse error for better user feedback
      try {
        const errorJson = JSON.parse(errorText);
        if (errorJson.message) {
          console.error('Error message:', errorJson.message);
        }
      } catch (e) {
        // Error is not JSON, use text as is
      }
      
      return false;
    }
  } catch (error) {
    console.error('Network error submitting to Supabase:', error);
    return false;
  }
}

// Show/Hide Loading Indicator
function showLoading(show) {
  const buttons = document.querySelectorAll('button[type="submit"]');
  buttons.forEach(button => {
    button.disabled = show;
    button.textContent = show ? 'Envoi en cours...' : button.dataset.originalText || 'Envoyer';
    if (!button.dataset.originalText) {
      button.dataset.originalText = button.textContent;
    }
  });
}

// Show Success Message
function showSuccessMessage(type) {
  if (type === 'sell') {
    const form = document.getElementById('sell-form');
    const successDiv = document.getElementById('success-message');
    if (form && successDiv) {
      form.classList.add('hidden');
      successDiv.classList.remove('hidden');
    }
  } else if (type === 'renovation') {
    const form = document.getElementById('renovation-form');
    const successDiv = document.getElementById('renovation-success');
    if (form && successDiv) {
      form.classList.add('hidden');
      successDiv.classList.remove('hidden');
    }
  }
}

// Property Filters (Buy page)
function initFilters() {
  const searchInput = document.getElementById('search');
  const priceFilter = document.getElementById('price-range');
  const typeFilter = document.getElementById('property-type');
  const bedroomsFilter = document.getElementById('bedrooms');
  const sortFilter = document.getElementById('sort');
  const clearButton = document.getElementById('clear-filters');
  
  if (!searchInput) return;
  
  function applyFilters() {
    const searchTerm = searchInput.value.toLowerCase();
    const priceRange = priceFilter?.value || '';
    const propertyType = typeFilter?.value || '';
    const minBedrooms = bedroomsFilter?.value || '';
    const sortBy = sortFilter?.value || '';
    
    const properties = document.querySelectorAll('.property-item');
    let visibleCount = 0;
    
    // Filter properties
    properties.forEach(property => {
      let visible = true;
      
      // Search filter
      if (searchTerm) {
        const title = property.querySelector('h3')?.textContent.toLowerCase() || '';
        const location = property.dataset.location?.toLowerCase() || '';
        visible = visible && (title.includes(searchTerm) || location.includes(searchTerm));
      }
      
      // Price filter
      if (priceRange) {
        const price = parseInt(property.dataset.price);
        switch(priceRange) {
          case '0-1m':
            visible = visible && price < 1000000;
            break;
          case '1m-2m':
            visible = visible && price >= 1000000 && price < 2000000;
            break;
          case '2m-3m':
            visible = visible && price >= 2000000 && price < 3000000;
            break;
          case '3m+':
            visible = visible && price >= 3000000;
            break;
        }
      }
      
      // Type filter
      if (propertyType) {
        visible = visible && property.dataset.type === propertyType;
      }
      
      // Bedrooms filter
      if (minBedrooms) {
        const bedrooms = parseInt(property.dataset.bedrooms);
        visible = visible && bedrooms >= parseInt(minBedrooms);
      }
      
      if (visible) {
        property.style.display = '';
        visibleCount++;
      } else {
        property.style.display = 'none';
      }
    });
    
    // Update count
    const countElement = document.getElementById('property-count');
    if (countElement) {
      countElement.textContent = `${visibleCount} bien${visibleCount !== 1 ? 's' : ''}`;
    }
    
    // Sort visible properties
    if (sortBy) {
      sortProperties(sortBy);
    }
  }
  
  function sortProperties(sortBy) {
    const container = document.querySelector('.property-grid');
    if (!container) return;
    
    const properties = Array.from(container.querySelectorAll('.property-item'));
    
    properties.sort((a, b) => {
      const priceA = parseInt(a.dataset.price);
      const priceB = parseInt(b.dataset.price);
      const bedroomsA = parseInt(a.dataset.bedrooms);
      const bedroomsB = parseInt(b.dataset.bedrooms);
      const surfaceA = parseInt(a.dataset.surface);
      const surfaceB = parseInt(b.dataset.surface);
      
      switch(sortBy) {
        case 'price-asc':
          return priceA - priceB;
        case 'price-desc':
          return priceB - priceA;
        case 'surface-asc':
          return surfaceA - surfaceB;
        case 'surface-desc':
          return surfaceB - surfaceA;
        case 'bedrooms-asc':
          return bedroomsA - bedroomsB;
        case 'bedrooms-desc':
          return bedroomsB - bedroomsA;
        default:
          return 0;
      }
    });
    
    properties.forEach(property => container.appendChild(property));
  }
  
  // Attach event listeners
  searchInput?.addEventListener('input', applyFilters);
  priceFilter?.addEventListener('change', applyFilters);
  typeFilter?.addEventListener('change', applyFilters);
  bedroomsFilter?.addEventListener('change', applyFilters);
  sortFilter?.addEventListener('change', applyFilters);
  
  clearButton?.addEventListener('click', function() {
    searchInput.value = '';
    if (priceFilter) priceFilter.value = '';
    if (typeFilter) typeFilter.value = '';
    if (bedroomsFilter) bedroomsFilter.value = '';
    if (sortFilter) sortFilter.value = '';
    applyFilters();
  });
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href !== '#' && href.length > 1) {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    }
  });
});

