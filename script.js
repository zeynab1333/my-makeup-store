// ========== GLOBAL STATE & CONFIG ==========
const CONFIG = {
  currency: 'USD',
  shippingFee: 0, // Free shipping
  taxRate: 0.1, // 10% tax
};

const STATE = {
  cart: JSON.parse(localStorage.getItem('zbeauty-cart')) || [],
  products: [
    {
      id: 1,
      name: "Matte Liquid Lipstick",
      price: 18.99,
      category: "lips",
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80",
      colors: ["#cc3366", "#990033", "#ff6699"],
      description: "Long-lasting matte finish with creamy application"
    },
    {
      id: 2,
      name: "Hydrating Foundation",
      price: 24.99,
      category: "face",
      rating: 4.6,
      image: "https://images.unsplash.com/photo-1625772452859-1c03d5bf1137?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80",
      shades: ["#f5d0b9", "#e3b18b", "#d19470"],
      description: "Lightweight formula with 12-hour hydration"
    },
    {
      id: 3,
      name: "Eyeshadow Palette",
      price: 32.99,
      category: "eyes",
      rating: 4.9,
      image: "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80",
      description: "16 highly pigmented shades with matte and shimmer finishes"
    },
    {
      id: 4,
      name: "Mascara Volume Boost",
      price: 14.99,
      category: "eyes",
      rating: 4.7,
      image: "https://images.unsplash.com/photo-1607602132700-06825813f31c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1887&q=80",
      description: "Lengthens and volumizes lashes without clumping"
    }
  ]
};

// ========== DOM ELEMENTS ==========
const DOM = {
  nav: document.querySelector('.sticky-nav'),
  cartCount: document.querySelector('.cart-count'),
  hamburger: document.querySelector('.hamburger'),
  navLinks: document.querySelector('.nav-links'),
  // Will be populated as needed
};

// ========== CORE FUNCTIONS ==========
const CartManager = {
  addItem: (productId, quantity = 1) => {
    const product = STATE.products.find(p => p.id === productId);
    if (!product) return false;

    const existingItem = STATE.cart.find(item => item.id === productId);
    
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      STATE.cart.push({ 
        ...product, 
        quantity,
        selectedColor: product.colors?.[0] || null,
        selectedShade: product.shades?.[0] || null
      });
    }
    
    CartManager.saveCart();
    return true;
  },

  removeItem: (productId) => {
    STATE.cart = STATE.cart.filter(item => item.id !== productId);
    CartManager.saveCart();
  },

  updateQuantity: (productId, newQuantity) => {
    const item = STATE.cart.find(item => item.id === productId);
    if (item) {
      item.quantity = Math.max(1, newQuantity);
      CartManager.saveCart();
    }
  },

  saveCart: () => {
    localStorage.setItem('zbeauty-cart', JSON.stringify(STATE.cart));
    CartManager.updateCartUI();
  },

  getCartTotal: () => {
    return STATE.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  },

  getOrderSummary: () => {
    const subtotal = CartManager.getCartTotal();
    const tax = subtotal * CONFIG.taxRate;
    const total = subtotal + tax + CONFIG.shippingFee;
    
    return {
      subtotal,
      tax,
      shipping: CONFIG.shippingFee,
      total
    };
  },

  updateCartUI: () => {
    // Update cart count in nav
    if (DOM.cartCount) {
      const count = STATE.cart.reduce((sum, item) => sum + item.quantity, 0);
      DOM.cartCount.textContent = count;
      DOM.cartCount.style.display = count > 0 ? 'inline-block' : 'none';
    }

    // Update cart page if exists
    if (document.getElementById('cart-items')) {
      CartManager.renderCartItems();
    }
  },

  renderCartItems: () => {
    const cartItemsEl = document.getElementById('cart-items');
    const cartSummaryEl = document.getElementById('cart-summary');
    const checkoutBtn = document.getElementById('checkout-btn');
    
    if (!cartItemsEl) return;
    
    if (STATE.cart.length === 0) {
      cartItemsEl.innerHTML = `
        <div class="empty-cart">
          <i class="fas fa-shopping-bag"></i>
          <p>Your cart is empty</p>
          <a href="categories.html" class="btn">Continue Shopping</a>
        </div>
      `;
      return;
    }
    
    cartItemsEl.innerHTML = STATE.cart.map(item => `
      <div class="cart-item" data-id="${item.id}">
        <img src="${item.image}" alt="${item.name}" class="cart-item-img">
        <div class="cart-item-details">
          <h3>${item.name}</h3>
          ${item.selectedColor ? `<div class="color-preview" style="background-color: ${item.selectedColor}"></div>` : ''}
          <div class="price">${formatCurrency(item.price)}</div>
          <div class="quantity-controls">
            <button class="quantity-btn minus"><i class="fas fa-minus"></i></button>
            <span>${item.quantity}</span>
            <button class="quantity-btn plus"><i class="fas fa-plus"></i></button>
          </div>
        </div>
        <button class="remove-item"><i class="fas fa-trash-alt"></i></button>
      </div>
    `).join('');
    
    if (cartSummaryEl) {
      const { subtotal, tax, shipping, total } = CartManager.getOrderSummary();
      cartSummaryEl.innerHTML = `
        <div class="summary-row">
          <span>Subtotal</span>
          <span>${formatCurrency(subtotal)}</span>
        </div>
        <div class="summary-row">
          <span>Tax (${CONFIG.taxRate * 100}%)</span>
          <span>${formatCurrency(tax)}</span>
        </div>
        <div class="summary-row">
          <span>Shipping</span>
          <span>${shipping === 0 ? 'FREE' : formatCurrency(shipping)}</span>
        </div>
        <div class="summary-row total">
          <span>Total</span>
          <span>${formatCurrency(total)}</span>
        </div>
      `;
    }
    
    if (checkoutBtn) {
      checkoutBtn.disabled = STATE.cart.length === 0;
    }
  },

  showAddNotification: (productName) => {
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.innerHTML = `
      <i class="fas fa-check-circle"></i>
      <span>${productName} added to cart</span>
      <a href="cart.html">View Cart</a>
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => notification.classList.add('show'), 10);
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }
};

const ProductRenderer = {
  renderFeatured: () => {
    const container = document.getElementById('featured-products');
    if (!container) return;
    
    const featured = STATE.products.slice(0, 4);
    container.innerHTML = featured.map(product => `
      <div class="product-card" data-id="${product.id}">
        <img src="${product.image}" alt="${product.name}" loading="lazy">
        <div class="product-badge">${product.category}</div>
        <h3>${product.name}</h3>
        <div class="price-rating">
          <span class="price">${formatCurrency(product.price)}</span>
          <span class="rating"><i class="fas fa-star"></i> ${product.rating}</span>
        </div>
        <button class="add-to-cart">Add to Cart</button>
      </div>
    `).join('');
  },

  renderAll: () => {
    const container = document.getElementById('all-products');
    if (!container) return;
    
    container.innerHTML = STATE.products.map(product => `
      <div class="product-card" data-id="${product.id}">
        <img src="${product.image}" alt="${product.name}" loading="lazy">
        <div class="product-badge">${product.category}</div>
        <h3>${product.name}</h3>
        <div class="price-rating">
          <span class="price">${formatCurrency(product.price)}</span>
          <span class="rating"><i class="fas fa-star"></i> ${product.rating}</span>
        </div>
        <button class="add-to-cart">Add to Cart</button>
      </div>
    `).join('');
  },

  setupFilters: () => {
    const categoryLinks = document.querySelectorAll('[data-category]');
    const sortSelect = document.getElementById('sort-select');
    
    categoryLinks?.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const category = link.dataset.category;
        ProductRenderer.filterProducts(category);
        
        categoryLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
      });
    });
    
    sortSelect?.addEventListener('change', (e) => {
      ProductRenderer.sortProducts(e.target.value);
    });
  },

  filterProducts: (category) => {
    const container = document.getElementById('all-products');
    if (!container) return;
    
    const filtered = category === 'all' 
      ? STATE.products 
      : STATE.products.filter(p => p.category === category);
    
    container.innerHTML = filtered.map(product => `
      <div class="product-card" data-id="${product.id}">
        <img src="${product.image}" alt="${product.name}">
        <h3>${product.name}</h3>
        <div class="price">${formatCurrency(product.price)}</div>
        <button class="add-to-cart">Add to Cart</button>
      </div>
    `).join('');
  },

  sortProducts: (sortType) => {
    let sorted = [...STATE.products];
    
    switch(sortType) {
      case 'price-asc': sorted.sort((a, b) => a.price - b.price); break;
      case 'price-desc': sorted.sort((a, b) => b.price - a.price); break;
      case 'rating': sorted.sort((a, b) => b.rating - a.rating); break;
      case 'newest': sorted.sort((a, b) => b.id - a.id); break;
    }
    
    const container = document.getElementById('all-products');
    if (container) {
      container.innerHTML = sorted.map(product => `
        <div class="product-card" data-id="${product.id}">
          <img src="${product.image}" alt="${product.name}">
          <h3>${product.name}</h3>
          <div class="price">${formatCurrency(product.price)}</div>
          <button class="add-to-cart">Add to Cart</button>
        </div>
      `).join('');
    }
  }
};

// ========== PAGE CONTROLLERS ==========
const PageController = {
  initHome: () => {
    ProductRenderer.renderFeatured();
    
    // Newsletter form
    document.getElementById('newsletter-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const form = e.target;
      form.innerHTML = `
        <div class="success-message">
          <i class="fas fa-check-circle"></i>
          <p>Thanks for subscribing! Check your email for a 15% discount code.</p>
        </div>
      `;
    });
  },

  initShop: () => {
    ProductRenderer.renderAll();
    ProductRenderer.setupFilters();
  },

  initCart: () => {
    CartManager.renderCartItems();
    
    // Cart item controls
    document.getElementById('cart-items')?.addEventListener('click', (e) => {
      const itemEl = e.target.closest('.cart-item');
      if (!itemEl) return;
      
      const productId = parseInt(itemEl.dataset.id);
      
      if (e.target.closest('.minus')) {
        const item = STATE.cart.find(item => item.id === productId);
        if (item) CartManager.updateQuantity(productId, item.quantity - 1);
      } 
      else if (e.target.closest('.plus')) {
        const item = STATE.cart.find(item => item.id === productId);
        if (item) CartManager.updateQuantity(productId, item.quantity + 1);
      } 
      else if (e.target.closest('.remove-item')) {
        CartManager.removeItem(productId);
      }
    });
    
    // Checkout button
    document.getElementById('checkout-btn')?.addEventListener('click', () => {
      window.location.href = 'checkout.html'; // Would be implemented
    });
  },

  initAbout: () => {
    // Testimonial slider
    const testimonials = document.querySelectorAll('.testimonial');
    if (testimonials.length > 1) {
      let current = 0;
      setInterval(() => {
        testimonials[current].classList.remove('active');
        current = (current + 1) % testimonials.length;
        testimonials[current].classList.add('active');
      }, 5000);
    }
  },

  initContact: () => {
    // FAQ accordion
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
    document.getElementById('contact-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const formStatus = document.getElementById('form-status');
      formStatus.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <p>Message sent successfully! We'll contact you soon.</p>
      `;
      e.target.reset();
    });
  }
};

// ========== UTILITY FUNCTIONS ==========
function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: CONFIG.currency
  }).format(amount);
}

function setupMobileMenu() {
  DOM.hamburger?.addEventListener('click', () => {
    DOM.navLinks.classList.toggle('active');
    DOM.hamburger.innerHTML = DOM.navLinks.classList.contains('active') 
      ? '✕' 
      : '☰';
  });
}

function setupStickyNav() {
  window.addEventListener('scroll', () => {
    DOM.nav?.classList.toggle('scrolled', window.scrollY > 50);
  });
}

function handleAddToCart() {
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('add-to-cart')) {
      const productId = parseInt(e.target.closest('.product-card').dataset.id);
      if (CartManager.addItem(productId)) {
        const productName = STATE.products.find(p => p.id === productId).name;
        CartManager.showAddNotification(productName);
        
        // Button feedback
        const btn = e.target;
        btn.innerHTML = '<i class="fas fa-check"></i> Added';
        setTimeout(() => {
          btn.innerHTML = 'Add to Cart';
        }, 2000);
      }
    }
  });
}

// ========== INITIALIZATION ==========
document.addEventListener('DOMContentLoaded', () => {
  // Setup core functionality
  setupMobileMenu();
  setupStickyNav();
  handleAddToCart();
  CartManager.updateCartUI();

  // Initialize page-specific functionality
  if (document.querySelector('.home-page')) PageController.initHome();
  if (document.querySelector('.category-page')) PageController.initShop();
  if (document.querySelector('.cart-page')) PageController.initCart();
  if (document.querySelector('.about-page')) PageController.initAbout();
  if (document.querySelector('.contact-page')) PageController.initContact();
});