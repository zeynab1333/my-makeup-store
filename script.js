// ==============================
// 🛒 Cart Logic with localStorage and Toast Notifications
// ==============================

let cart = JSON.parse(localStorage.getItem('cart')) || [];

const productPrices = {
    "Lipstick": 15.00,
    "Foundation": 25.00,
    "Mascara": 18.00,
    "Eyeshadow": 20.00,
    "Highlighter": 14.00,
    "Blush": 12.00
};

function scrollToCategories() {
    document.getElementById("categories").scrollIntoView({ behavior: "smooth" });
}

function showToast(message) {
    let toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.classList.add('show');
    }, 100);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => document.body.removeChild(toast), 300);
    }, 3000);
}

function addToCart(productName) {
    if (!cart.includes(productName)) {
        cart.push(productName);
        updateCartDisplay();
        localStorage.setItem('cart', JSON.stringify(cart));
        showToast(productName + " has been added to your cart.");
    } else {
        showToast(productName + " is already in your cart.");
    }
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartDisplay();
    localStorage.setItem('cart', JSON.stringify(cart));
    showToast("Item removed from cart.");
}

function updateCartDisplay() {
    const cartItemsContainer = document.getElementById("cart-items");
    if (!cartItemsContainer) return;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = "<p>Your cart is empty.</p>";
    } else {
        cartItemsContainer.innerHTML = "";
        const list = document.createElement("ul");
        let total = 0;

        cart.forEach((item, index) => {
            const li = document.createElement("li");
            const price = productPrices[item] || 0;
            total += price;

            li.textContent = `${item} - $${price.toFixed(2)} `;

            const removeBtn = document.createElement("button");
            removeBtn.textContent = "Remove";
            removeBtn.classList.add("remove-btn");
            removeBtn.onclick = () => removeFromCart(index);

            li.appendChild(removeBtn);
            list.appendChild(li);
        });

        const totalDisplay = document.createElement("p");
        totalDisplay.innerHTML = `<strong>Total: $${total.toFixed(2)}</strong>`;
        cartItemsContainer.appendChild(list);
        cartItemsContainer.appendChild(totalDisplay);
    }
}

function checkout() {
    if (cart.length === 0) {
        showToast("Your cart is empty.");
        return;
    }

    const checkoutSection = document.getElementById("checkout");
    if (checkoutSection) {
        checkoutSection.style.display = "block";
        document.getElementById("checkout-form").scrollIntoView({ behavior: "smooth" });
    }
}

// ==============================
// 📦 Modal Logic
// ==============================

function openProductModal(productName) {
    const modal = document.getElementById("product-details-modal");
    const content = document.getElementById("product-details-content");
    if (!modal || !content) return;

    // Mock product details - can be enhanced with real data
    const productDetails = {
        "Lipstick": "Huda Beauty Nude Lipstick - Dark red. Perfect for any occasion.",
        "Foundation": "MAC Studio Fix Foundation. Perfect coverage for a flawless look.",
        "Mascara": "Maybelline Lash Sensational Mascara. Define and lengthen your lashes with ease.",
        "Eyeshadow": "Maybelline Smoky Eyeshadow Palette. Create vibrant looks with our eyeshadow collection.",
        "Highlighter": "Fenty Beauty Killawatt Highlighter. Glow like never before with our shimmering highlighter.",
        "Blush": "Milani Baked Blush. Get a natural flush of color with our blushes."
    };

    content.innerHTML = `
        <h3>${productName}</h3>
        <p>${productDetails[productName] || "No details available."}</p>
        <p><strong>Price: $${productPrices[productName].toFixed(2)}</strong></p>
        <button onclick="addToCart('${productName}')">Add to Cart</button>
    `;
    modal.style.display = "block";
}

function closeModal() {
    const modal = document.getElementById("product-details-modal");
    if (modal) modal.style.display = "none";
}

// ==============================
// 📩 Form Handling with inline validation and toast notifications
// ==============================

document.addEventListener("DOMContentLoaded", function () {
    const contactForm = document.getElementById("contact-form");
    const checkoutForm = document.getElementById("checkout-form");

    if (contactForm) {
        contactForm.addEventListener("submit", function (event) {
            event.preventDefault();
            if (!validateContactForm()) return;
            showToast("Thanks for your message! We'll get back to you soon.");
            contactForm.reset();
        });
    }

    if (checkoutForm) {
        checkoutForm.addEventListener("submit", function (event) {
            event.preventDefault();
            if (!validateCheckoutForm()) return;
            const name = document.getElementById("name")?.value || "Customer";
            showToast("Thank you for your purchase, " + name + "!");
            cart = [];
            updateCartDisplay();
            localStorage.setItem('cart', JSON.stringify(cart));
            checkoutForm.reset();
            document.getElementById("checkout").style.display = "none";
        });
    }

    // Highlight active navbar link and set active based on current page
    const links = document.querySelectorAll('.navbar li a');
    function setActiveLink() {
        const currentPath = window.location.pathname.split("/").pop();
        links.forEach(link => {
            if (link.getAttribute('href') === currentPath) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            links.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            const href = link.getAttribute('href');
            document.body.style.transition = "opacity 0.5s ease-out";
            document.body.style.opacity = 0;
            setTimeout(() => {
                window.location.href = href;
            }, 500);
        });
    });
    setActiveLink();

    // Page transition animation
    document.body.style.opacity = 0;
    window.onload = () => {
        document.body.style.transition = "opacity 0.5s ease-in";
        document.body.style.opacity = 1;
    };
});

// Smooth scroll for nav links and hamburger menu toggle
document.addEventListener("DOMContentLoaded", function () {
    const hamburger = document.getElementById("hamburger");
    const navbarMenu = document.getElementById("navbarMenu");

    if (hamburger && navbarMenu) {
        hamburger.addEventListener("click", () => {
            const expanded = hamburger.getAttribute("aria-expanded") === "true" || false;
            hamburger.setAttribute("aria-expanded", !expanded);
            navbarMenu.classList.toggle("show");
        });
        hamburger.addEventListener("keypress", (e) => {
            if (e.key === "Enter") {
                hamburger.click();
            }
        });
    }

    const navLinks = document.querySelectorAll('.navbar li a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
            // Close mobile menu if open
            if (navbarMenu.classList.contains('show')) {
                navbarMenu.classList.remove('show');
                hamburger.setAttribute("aria-expanded", false);
            }
        });
    });
});

// ==============================
// Form Validation Functions
// ==============================

function validateContactForm() {
    const name = document.getElementById("user-name");
    const email = document.getElementById("user-email");
    const message = document.getElementById("message");
    let valid = true;

    clearErrors([name, email, message]);

    if (!name.value.trim()) {
        showError(name, "Name is required.");
        valid = false;
    }
    if (!email.value.trim() || !validateEmail(email.value)) {
        showError(email, "Valid email is required.");
        valid = false;
    }
    if (!message.value.trim()) {
        showError(message, "Message cannot be empty.");
        valid = false;
    }
    return valid;
}

function validateCheckoutForm() {
    const name = document.getElementById("name");
    const address = document.getElementById("address");
    const payment = document.getElementById("payment");
    let valid = true;

    clearErrors([name, address, payment]);

    if (!name.value.trim()) {
        showError(name, "Name is required.");
        valid = false;
    }
    if (!address.value.trim()) {
        showError(address, "Shipping address is required.");
        valid = false;
    }
    if (!payment.value) {
        showError(payment, "Please select a payment method.");
        valid = false;
    }
    return valid;
}

function showError(element, message) {
    let error = document.createElement("span");
    error.className = "error-message";
    error.textContent = message;
    element.parentNode.insertBefore(error, element.nextSibling);
    element.classList.add("input-error");
}

function clearErrors(elements) {
    elements.forEach(el => {
        el.classList.remove("input-error");
        const next = el.nextSibling;
        if (next && next.classList && next.classList.contains("error-message")) {
            next.remove();
        }
    });
}

function validateEmail(email) {
    const re = /^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$/;
    return re.test(email);
}
