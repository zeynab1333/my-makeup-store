// ========== GLOBAL STATE & ELEMENTS ==========
const state = {
  cart: JSON.parse(localStorage.getItem('zbeauty-cart')) || [],
  products: [
    {
      id: 1,
      name: "Matte Liquid Lipstick",
      price: 18.99,
      category: "lips",
      rating: 4.8,
      image: "assets/images/lipstick.jpg",
      colors: ["#cc3366", "#990033", "#ff6699"],
      description: "Long-lasting matte finish with creamy application"
    },
    {
      id: 2,
      name: "Hydrating Foundation",
      price: 24.99,
      category: "face",
      rating: 4.6,
      image: "assets/images/foundation.jpg",
      shades: ["#f5d0b9", "#e3b18b", "#d19470"],
      description: "Lightweight formula with 12-hour hydration"
    },
    // Add more products as needed
  ]
};

// DOM Elements
const elements = {
  nav: document.querySelector('.sticky-nav'),
  cartCount: document.querySelector('.cart-count'),
  hamburger: document.querySelector('.hamburger'),
  navLinks: document.querySelector('.nav-links'),
  // Page-specific elements will be added as needed
};

// ========== CART FUNCTIONALITY ==========
const cartFunctions = {
  addToCart: (productId, quantity = 1) => {
    const product = state.products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = state.cart.find(item => item.id === productId);
    
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      state.cart.push({ ...product, quantity });
    }
    
    cartFunctions.updateCart();
    cartFunctions.showCartNotification(product.name);
  },

  removeFromCart: (productId) => {
    state.cart = state.cart.filter(item => item.id !== productId);
    cartFunctions.updateCart();
  },

  updateQuantity: (productId, newQuantity) => {
    const item = state.cart.find(item => item.id === productId);
    if (item) {
      item.quantity = Math.max(1, newQuantity);
      cartFunctions.updateCart();
    }
  },

  updateCart: () => {
    localStorage.setItem('zbeauty-cart', JSON.stringify(state.cart));
    cartFunctions.updateCartCount();
    
    // Update cart page if we're on it
    if (document.querySelector('.cart-page')) {
      cartFunctions.renderCartItems();
    }
  },

  updateCartCount: () => {
    if (elements.cartCount) {
      const count = state.cart.reduce((sum, item) => sum + item.quantity, 0);
      elements.cartCount.textContent = count;
      elements.cartCount.style.display = count > 0 ? 'inline-block' : 'none';
    }
  },

  showCartNotification: (productName) => {
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.innerHTML = `
      <span>${productName} added to cart!</span>
      <a href="cart.html">View Cart</a>
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.classList.add('show');
    }, 10);
    
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  },

  renderCartItems: () => {
    const cartItemsEl = document.getElementById('cart-items');
    const subtotalEl = document.getElementById('subtotal');
    const totalEl = document.getElementById('total');
    const checkoutBtn = document.getElementById('checkout-btn');
    
    if (!cartItemsEl) return;
    
    if (state.cart.length === 0) {
      cartItemsEl.innerHTML = `
        <div class="empty-cart">
          <i class="fas fa-shopping-bag"></i>
          <p>Your cart is empty</p>
          <a href="categories.html" class="btn">Continue Shopping</a>
        </div>
      `;
      subtotalEl.textContent = '$0.00';
      totalEl.textContent = '$0.00';
      checkoutBtn.disabled = true;
      return;
    }
    
    cartItemsEl.innerHTML = state.cart.map(item => `
      <div class="cart-item" data-id="${item.id}">
        <img src="${item.image}" alt="${item.name}" class="cart-item-img">
        <div class="cart-item-details">
          <h3 class="cart-item-title">${item.name}</h3>
          <p class="cart-item-price">$${item.price.toFixed(2)}</p>
          <div class="cart-item-quantity">
            <button class="quantity-btn minus"><i class="fas fa-minus"></i></button>
            <span>${item.quantity}</span>
            <button class="quantity-btn plus"><i class="fas fa-plus"></i></button>
          </div>
        </div>
        <button class="remove-item"><i class="fas fa-trash-alt"></i></button>
      </div>
    `).join('');
    
    const subtotal = state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    totalEl.textContent = `$${subtotal.toFixed(2)}`;
    checkoutBtn.disabled = false;
  }
};

// ========== PRODUCT FUNCTIONALITY ==========
const productFunctions = {
  renderFeaturedProducts: () => {
    const featuredContainer = document.getElementById('featured-products');
    if (!featuredContainer) return;
    
    const featured = state.products.slice(0, 4);
    featuredContainer.innerHTML = featured.map(product => `
      <div class="product-card" data-id="${product.id}">
        <img src="${product.image}" alt="${product.name}" loading="lazy">
        <h3>${product.name}</h3>
        <div class="price">$${product.price.toFixed(2)}</div>
        <button class="add-to-cart">Add to Cart</button>
      </div>
    `).join('');
  },

  renderAllProducts: () => {
    const productsContainer = document.getElementById('all-products');
    if (!productsContainer) return;
    
    productsContainer.innerHTML = state.products.map(product => `
      <div class="product-card" data-id="${product.id}">
        <img src="${product.image}" alt="${product.name}" loading="lazy">
        <div class="product-badge">${product.category}</div>
        <h3>${product.name}</h3>
        <div class="price-rating">
          <span class="price">$${product.price.toFixed(2)}</span>
          <span class="rating"><i class="fas fa-star"></i> ${product.rating}</span>
        </div>
        <button class="add-to-cart">Add to Cart</button>
      </div>
    `).join('');
  },

  setupFilters: () => {
    const categoryLinks = document.querySelectorAll('.category-list a');
    const sortSelect = document.getElementById('sort-select');
    
    categoryLinks?.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const category = link.dataset.category;
        productFunctions.filterProducts(category);
        
        // Update active state
        categoryLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
      });
    });
    
    sortSelect?.addEventListener('change', (e) => {
      productFunctions.sortProducts(e.target.value);
    });
  },

  filterProducts: (category) => {
    const productsContainer = document.getElementById('all-products');
    if (!productsContainer) return;
    
    const filtered = category === 'all' 
      ? state.products 
      : state.products.filter(p => p.category === category);
    
    productsContainer.innerHTML = filtered.map(product => `
      <div class="product-card" data-id="${product.id}">
        <img src="${product.image}" alt="${product.name}">
        <h3>${product.name}</h3>
        <div class="price">$${product.price.toFixed(2)}</div>
        <button class="add-to-cart">Add to Cart</button>
      </div>
    `).join('');
  },

  sortProducts: (sortType) => {
    let sortedProducts = [...state.products];
    
    switch(sortType) {
      case 'price-asc':
        sortedProducts.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        sortedProducts.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        sortedProducts.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        // Assuming newer products have higher IDs
        sortedProducts.sort((a, b) => b.id - a.id);
        break;
    }
    
    const productsContainer = document.getElementById('all-products');
    if (productsContainer) {
      productsContainer.innerHTML = sortedProducts.map(product => `
        <div class="product-card" data-id="${product.id}">
          <img src="${product.image}" alt="${product.name}">
          <h3>${product.name}</h3>
          <div class="price">$${product.price.toFixed(2)}</div>
          <button class="add-to-cart">Add to Cart</button>
        </div>
      `).join('');
    }
  }
};

// ========== PAGE-SPECIFIC FUNCTIONALITY ==========
const pageFunctions = {
  initHomePage: () => {
    productFunctions.renderFeaturedProducts();
    
    // Newsletter form
    const newsletterForm = document.getElementById('newsletter-form');
    newsletterForm?.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = e.target.querySelector('input').value;
      e.target.innerHTML = `
        <p class="success-message">Thanks for subscribing! Check your email for a 15% discount code.</p>
      `;
    });
  },

  initCategoriesPage: () => {
    productFunctions.renderAllProducts();
    productFunctions.setupFilters();
  },

  initCartPage: () => {
    cartFunctions.renderCartItems();
    
    // Event delegation for cart item actions
    document.getElementById('cart-items')?.addEventListener('click', (e) => {
      const cartItem = e.target.closest('.cart-item');
      if (!cartItem) return;
      
      const productId = parseInt(cartItem.dataset.id);
      
      if (e.target.closest('.minus')) {
        const item = state.cart.find(item => item.id === productId);
        if (item && item.quantity > 1) {
          cartFunctions.updateQuantity(productId, item.quantity - 1);
        }
      } else if (e.target.closest('.plus')) {
        const item = state.cart.find(item => item.id === productId);
        if (item) {
          cartFunctions.updateQuantity(productId, item.quantity + 1);
        }
      } else if (e.target.closest('.remove-item')) {
        cartFunctions.removeFromCart(productId);
      }
    });
    
    // Checkout button
    document.getElementById('checkout-btn')?.addEventListener('click', () => {
      alert('Checkout functionality would be implemented here!');
      // In a real app, this would redirect to a checkout page
    });
  },

  initContactPage: () => {
    // FAQ Accordion
    document.querySelectorAll('.faq-question').forEach(question => {
      question.addEventListener('click', () => {
        const answer = question.nextElementSibling;
        const icon = question.querySelector('i');
        
        answer.classList.toggle('active');
        icon.classList.toggle('fa-chevron-down');
        icon.classList.toggle('fa-chevron-up');
      });
    });
    
    // Contact form
    const contactForm = document.getElementById('contact-form');
    contactForm?.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(contactForm);
      const formStatus = document.getElementById('form-status');
      
      // Simulate form submission
      formStatus.textContent = "Message sent successfully! We'll contact you soon.";
      formStatus.style.color = "#4CAF50";
      contactForm.reset();
      
      setTimeout(() => {
        formStatus.textContent = "";
      }, 5000);
    });
  },

  initAboutPage: () => {
    // Testimonial slider
    let currentTestimonial = 0;
    const testimonials = document.querySelectorAll('.testimonial');
    
    function showTestimonial(index) {
      testimonials.forEach((testimonial, i) => {
        testimonial.style.display = i === index ? 'block' : 'none';
      });
    }
    
    // Auto-rotate testimonials
    if (testimonials.length > 1) {
      setInterval(() => {
        currentTestimonial = (currentTestimonial + 1) % testimonials.length;
        showTestimonial(currentTestimonial);
      }, 5000);
    }
  }
};

// ========== GENERAL UTILITIES ==========
const utils = {
  setupMobileMenu: () => {
    elements.hamburger?.addEventListener('click', () => {
      elements.navLinks.classList.toggle('active');
      elements.hamburger.innerHTML = elements.navLinks.classList.contains('active') 
        ? '✕' 
        : '☰';
    });
  },

  setupStickyNav: () => {
    window.addEventListener('scroll', () => {
      elements.nav?.classList.toggle('scrolled', window.scrollY > 50);
    });
  },

  handleAddToCart: () => {
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('add-to-cart')) {
        const productId = parseInt(e.target.closest('.product-card').dataset.id);
        cartFunctions.addToCart(productId);
        
        // Visual feedback
        const btn = e.target;
        btn.innerHTML = '<i class="fas fa-check"></i> Added';
        setTimeout(() => {
          btn.textContent = 'Add to Cart';
        }, 2000);
      }
    });
  }
};

// ========== INITIALIZATION ==========
document.addEventListener('DOMContentLoaded', () => {
  // General setup
  utils.setupMobileMenu();
  utils.setupStickyNav();
  utils.handleAddToCart();
  cartFunctions.updateCartCount();
  
  // Page-specific initialization
  if (document.querySelector('.home-page')) pageFunctions.initHomePage();
  if (document.querySelector('.category-page')) pageFunctions.initCategoriesPage();
  if (document.querySelector('.cart-page')) pageFunctions.initCartPage();
  if (document.querySelector('.contact-page')) pageFunctions.initContactPage();
  if (document.querySelector('.about-page')) pageFunctions.initAboutPage();
});