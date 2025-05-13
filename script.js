// ==============================
// 🛒 Cart Logic
// ==============================

// Array to store cart items
let cart = [];

// Mock product prices (can be updated with real data)
const productPrices = {
    "Lipstick": 15.00,
    "Foundation": 25.00,
    "Mascara": 18.00,
    "Eyeshadow": 20.00,
    "Highlighter": 14.00,
    "Blush": 12.00
};

// Scroll to Categories Section
function scrollToCategories() {
    document.getElementById("categories").scrollIntoView({ behavior: "smooth" });
}

// Add product to cart (no duplicates)
function addToCart(productName) {
    if (!cart.includes(productName)) {
        cart.push(productName);
        updateCartDisplay();
        alert(productName + " has been added to your cart."); // ✅ Show message immediately
    } else {
        alert(productName + " is already in your cart.");
    }
}


// Remove product from cart
function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartDisplay();
}

// Update cart display with items and total price
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
            removeBtn.classList.add("remove-btn"); // CSS class for styling
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

// Show checkout section
function checkout() {
    if (cart.length === 0) {
        alert("Your cart is empty.");
        return;
    }

    const checkoutSection = document.getElementById("checkout");
    if (checkoutSection) {
        checkoutSection.style.display = "block";
        document.getElementById("checkout-form").scrollIntoView({ behavior: "smooth" });
    }
}

// ==============================
// 📦 Modal Logic (future use)
// ==============================

function closeModal() {
    const modal = document.getElementById("product-details-modal");
    if (modal) modal.style.display = "none";
}

// ==============================
// 📩 Form Handling
// ==============================

document.addEventListener("DOMContentLoaded", function () {
    const contactForm = document.getElementById("contact-form");
    const checkoutForm = document.getElementById("checkout-form");

    if (contactForm) {
        contactForm.addEventListener("submit", function (event) {
            event.preventDefault();
            alert("Thanks for your message! We'll get back to you soon.");
            contactForm.reset();
        });
    }

    if (checkoutForm) {
        checkoutForm.addEventListener("submit", function (event) {
            event.preventDefault();
            const name = document.getElementById("name")?.value || "Customer";
            alert("Thank you for your purchase, " + name + "!");
            cart = [];
            updateCartDisplay();
            checkoutForm.reset();
            document.getElementById("checkout").style.display = "none";
        });
    }

    // Highlight active navbar link
    const links = document.querySelectorAll('.navbar li a');
    links.forEach(link => {
        link.addEventListener('click', () => {
            links.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });
});