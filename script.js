// Global Variables
let products = [];
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));

// Initialize when DOM loads
document.addEventListener('DOMContentLoaded', function() {
    // Load products first
    loadProducts().then(() => {
        console.log("Products loaded successfully");
        initializeCartSystem();
        
        // Only render cart items if on account page
        if (document.getElementById('accountCartItems')) {
            renderCartItems();
        }
    });
    
    // Initialize animations
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true
    });

    // Hide loader
    window.addEventListener('load', function() {
        setTimeout(function() {
            const loader = document.getElementById('loader');
            if (loader) {
                loader.style.opacity = '0';
                setTimeout(function() {
                    loader.style.display = 'none';
                }, 500);
            }
        }, 1000);
    });

    // Show login modal if not logged in
    if (!loggedInUser) {
        setTimeout(function() {
            const loginModal = document.getElementById('loginModal');
            if (loginModal) {
                new bootstrap.Modal(loginModal).show();
            }
        }, 5000);
    }
});

// Product Loading Function
async function loadProducts() {
    try {
        const response = await fetch('backend/get_products.php');
        products = await response.json();
        
        // Ensure product IDs are numbers
        products = products.map(p => ({
            ...p,
            id: parseInt(p.id),
            price: parseFloat(p.price)
        }));
        
        renderProductGrid();
    } catch (err) {
        console.error('Failed to load products:', err);
        showToast('Failed to load products', 'error');
    }
}

function renderProductGrid() {
    const container = document.getElementById('flavorsGrid');
    if (!container) return;

    let html = '';
    products.forEach(product => {
        html += `
           <div class="col-md-4 mb-4" data-aos="fade-up">
                <div class="card h-100">
                    <div class="position-relative">
                        <img src="${product.image}" class="card-img-top" alt="${product.name}">
                    </div>
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title">${product.name}</h5>
                        <p class="card-text">${product.description}</p>
                        <p class="card-text fw-bold">₹${product.price.toFixed(2)}</p>
                        
                        <div class="d-flex justify-content-center mb-3">
                            <div class="quantity-selector">
                                <div class="input-group" style="width: 150px;">
                                    <button class="btn btn-outline-secondary decrement" type="button">
                                        <i class="fas fa-minus"></i>
                                    </button>
                                    <input type="number" class="form-control text-center quantity-input" 
                                        value="1" min="1" data-id="${product.id}"
                                        style="width: 50px;">
                                    <button class="btn btn-outline-secondary increment" type="button">
                                        <i class="fas fa-plus"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                        
                        <button class="btn btn-primary mt-auto add-to-cart" 
                                data-id="${product.id}">
                            <i class="fas fa-cart-plus"></i> Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        `;
    });
    container.innerHTML = html;
}
// Helper function for quantity adjustment
function adjustQuantity(button, change) {
    const input = button.closest('.input-group').querySelector('.quantity-input');
    let newValue = parseInt(input.value) + change;
    input.value = Math.max(10, newValue); // Ensure minimum of 10
}

// New function to add to cart with selected quantity
function addToCartWithQuantity(productId) {
    // Try to find the checkbox
    const checkbox = document.querySelector(`.custom-quantity-checkbox[data-id="${productId}"]`);
    
    // Default quantity is 10
    let quantity = 10;
    
    // If checkbox exists and is checked, try to get custom quantity
    if (checkbox && checkbox.checked) {
        const input = document.querySelector(`.quantity-input[data-id="${productId}"]`);
        if (input) {
            quantity = parseInt(input.value) || 10; // Fallback to 10 if invalid
        }
    }
    
    // Ensure minimum quantity of 10
    quantity = Math.max(10, quantity);
    
    // Add to cart
    addToCart(productId, quantity);
}

// Initialize Cart System
function initializeCartSystem() {
    // Add event listeners for cart buttons
    document.addEventListener('click', function(e) {
        // Add to cart button
        if (e.target.classList.contains('add-to-cart') || e.target.closest('.add-to-cart')) {
            const button = e.target.classList.contains('add-to-cart') ? e.target : e.target.closest('.add-to-cart');
            const productId = button.getAttribute('data-id');
            
            // Ensure productId exists and is valid
            if (productId) {
                addToCartWithQuantity(parseInt(productId));
            } else {
                console.error("No product ID found for add-to-cart button");
            }
        }
        
        // Quantity adjustment buttons
        if (e.target.classList.contains('adjust-qty-btn') || e.target.closest('.adjust-qty-btn')) {
            const button = e.target.classList.contains('adjust-qty-btn') ? e.target : e.target.closest('.adjust-qty-btn');
            const change = parseInt(button.getAttribute('data-change'));
            const productId = button.getAttribute('data-id');
            
            if (productId && !isNaN(change)) {
                adjustQuantity(productId, change);
            }
        }
    });

    // Initial render
    updateCartCount();
    
    // Listen for storage events for cross-tab sync
    window.addEventListener('storage', function(e) {
        if (e.key === 'cart') {
            cart = JSON.parse(e.newValue) || [];
            updateCartCount();
            if (window.location.pathname.includes('account.html')) {
                renderCartItems();
            }
        }
    });
}

// Quantity adjustment function
function adjustQuantity(productId, change) {
    const input = document.querySelector(`.quantity-input[data-id="${productId}"]`);
    if (!input) return;
    
    let currentValue = parseInt(input.value) || 10;
    let newValue = currentValue + change;
    input.value = Math.max(10, newValue); // Ensure minimum of 10
}

// Add to Cart Function (with quantity parameter)
function addToCart(productId, quantity = 10) {
    // Convert productId to number if it's a string
    productId = typeof productId === 'string' ? parseInt(productId) : productId;
    
    // Find the product
    const product = products.find(p => p.id === productId);
    if (!product) {
        console.error("Product not found:", productId);
        return;
    }

    // Load or initialize cart
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Check if item exists in cart
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += quantity; // Add specified quantity
    } else {
        // Add new item with specified quantity (minimum 10)
        cart.push({
            id: product.id,
            name: product.name,
            price: parseFloat(product.price),
            image: product.image,
            quantity: Math.max(quantity, 10) // Ensure minimum 10
        });
    }

    // Save to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Update UI
    updateCartCount();
    showToast(`${product.name} added to cart (${quantity} units)!`);
    
    // Trigger storage event for other tabs/pages
    window.dispatchEvent(new Event('storage'));
    
    console.log("Current cart:", JSON.parse(localStorage.getItem('cart')));
}

// Update Cart Count in UI
function updateCartCount() {
    cart = JSON.parse(localStorage.getItem('cart')) || [];
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    // Update all cart count elements
    document.querySelectorAll('.cart-count, #cartCount, #cartItemCount').forEach(el => {
        el.textContent = count;
    });
}

// Update your initQuantityControls function to:
function initQuantityControls() {
    document.querySelectorAll('.quantity-selector').forEach(selector => {
        const input = selector.querySelector('.quantity-input');
        const decrement = selector.querySelector('.decrement');
        const increment = selector.querySelector('.increment');
        
        input.min = 1;
        
        decrement.addEventListener('click', () => {
            input.value = Math.max(1, parseInt(input.value) - 1);
        });
        
        increment.addEventListener('click', () => {
            input.value = parseInt(input.value) + 1;
        });
        
        input.addEventListener('change', function() {
            this.value = Math.max(1, parseInt(this.value) || 1);
        });
    });
}

// Render Cart Items (for account.html)
function renderCartItems() {
    const cartContainer = document.getElementById('accountCartItems');
    const checkoutBtn = document.getElementById('accountCheckoutBtn');
    const cartCountElement = document.getElementById('cartItemCount');
    
    // Check if elements exist (for account.html)
    if (!cartContainer || !checkoutBtn || !cartCountElement) {
        console.log("Cart elements not found - not on account page");
        return;
    }

    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    if (cart.length === 0) {
        cartContainer.innerHTML = `
            <div class="text-center py-4">
                <i class="fas fa-shopping-cart fa-3x text-muted mb-3"></i>
                <p class="text-muted">Your cart is empty</p>
                <a href="index.html#flavors" class="btn btn-outline-primary">
                    <i class="fas fa-ice-cream me-2"></i> Browse Flavors
                </a>
            </div>
        `;
        checkoutBtn.disabled = true;
        cartCountElement.textContent = '0';
        return;
    }

    let html = '';
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.1;
    const serviceCharge = 15;
    const total = subtotal + tax + serviceCharge;

    cart.forEach(item => {
        html += `
            <div class="row mb-3 align-items-center fade-in">
                <div class="col-md-2 d-flex justify-content-center">
                    <img src="${item.image.startsWith('http') ? item.image : 'images/' + item.image}" 
                         class="cart-item-img" 
                         alt="${item.name}">
                </div>
                <div class="col-md-4">
                    <h6 class="mb-1">${item.name}</h6>
                    <p class="text-muted mb-0">₹${item.price.toFixed(2)}</p>
                </div>
                <div class="col-md-3">
                    <div class="quantity-controls">
                        <button class="btn btn-outline-secondary decrease-quantity" 
                                data-id="${item.id}" 
                                ${item.quantity <= 10 ? 'disabled' : ''}>
                            <i class="fas fa-minus"></i>
                        </button>
                        <input type="number" 
                               class="form-control text-center quantity-value" 
                               value="${item.quantity}" 
                               min="10"
                               data-id="${item.id}">
                        <button class="btn btn-outline-secondary increase-quantity" 
                                data-id="${item.id}">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                </div>
                <div class="col-md-3 text-end">
                    <p class="mb-1">₹${(item.price * item.quantity).toFixed(2)}</p>
                    <button class="btn btn-sm btn-outline-danger remove-item" 
                            data-id="${item.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            <hr class="my-2">
        `;
    });

    html += `
        <div class="row fade-in">
            <div class="col-md-6">
                <p>Subtotal:</p>
                <p>Tax (10%):</p>
                <p>Service Charge:</p>
                <p class="fw-bold">Total:</p>
            </div>
            <div class="col-md-6 text-end">
                <p>₹${subtotal.toFixed(2)}</p>
                <p>₹${tax.toFixed(2)}</p>
                <p>₹${serviceCharge.toFixed(2)}</p>
                <p class="fw-bold">₹${total.toFixed(2)}</p>
            </div>
        </div>
    `;

    cartContainer.innerHTML = html;
    checkoutBtn.disabled = false;
    cartCountElement.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);

    // Add event listeners
    addCartEventListeners();
}

// Initialize on account page load
document.addEventListener('DOMContentLoaded', function() {
    renderCartItems();
    updateCartCount();
});

// Add Cart Event Listeners
function addCartEventListeners() {
    // Quantity input changes
    document.querySelectorAll('.quantity-value').forEach(input => {
        input.addEventListener('change', function() {
            const productId = parseInt(this.dataset.id);
            let newQuantity = parseInt(this.value);
            
            // Ensure minimum quantity of 10
            if (isNaN(newQuantity)) newQuantity = 10;
            newQuantity = Math.max(10, newQuantity);
            
            updateCartItemQuantity(productId, newQuantity);
        });
    });

    // Increase quantity
    document.querySelectorAll('.increase-quantity').forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = parseInt(this.dataset.id);
            const input = this.parentNode.querySelector('.quantity-value');
            const newQuantity = parseInt(input.value) + 1;
            updateCartItemQuantity(productId, newQuantity);
        });
    });

    // Decrease quantity
    document.querySelectorAll('.decrease-quantity').forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = parseInt(this.dataset.id);
            const input = this.parentNode.querySelector('.quantity-value');
            let newQuantity = parseInt(input.value) - 1;
            
            // Ensure minimum quantity of 10
            newQuantity = Math.max(10, newQuantity);
            
            updateCartItemQuantity(productId, newQuantity);
        });
    });

    // Remove item
    document.querySelectorAll('.remove-item').forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = parseInt(this.dataset.id);
            removeFromCart(productId);
        });
    });
}

function updateCartItemQuantity(productId, newQuantity) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const item = cart.find(item => item.id === productId);
    
    if (!item) return;
    
    // Update quantity (minimum 10 enforced)
    item.quantity = Math.max(10, newQuantity);
    
    // Save to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Update UI
    updateCartCount();
    renderCartItems();
    window.dispatchEvent(new Event('storage'));
}

// Remove From Cart
function removeFromCart(productId) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    renderCartItems();
    showToast('Item removed from cart', 'success');
    window.dispatchEvent(new Event('storage'));
}

// Show Toast Notification
function showToast(message, type = 'success') {
    const toastContainer = document.querySelector('.toast-container') || 
        document.body.appendChild(document.createElement('div'));
    toastContainer.className = 'toast-container';
    
    const toast = document.createElement('div');
    toast.className = `toast show ${type === 'success' ? 'toast-success' : 'toast-error'}`;
    toast.innerHTML = `
        <div class="toast-body d-flex align-items-center">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'} me-2"></i>
            ${message}
            <button type="button" class="btn-close btn-close-white ms-auto" data-bs-dismiss="toast"></button>
        </div>
    `;
    
    toastContainer.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

function initializeCart() {
    // Load cart from localStorage
    cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Update UI
    updateCartCount();
    
    // Listen for storage events (for cross-page/tab sync)
    window.addEventListener('storage', function(e) {
        if (e.key === 'cart') {
            cart = JSON.parse(e.newValue) || [];
            updateCartCount();
            if (window.location.pathname.includes('account.html')) {
                renderCartItems();
            }
        }
    });
}

// Call this when DOM loads
document.addEventListener('DOMContentLoaded', function() {
    loadProducts();
    initializeCart();
});

// Enhanced Payment Processing with Reliable Redirect
function initPaymentProcessing() {
    const checkoutBtn = document.getElementById('accountCheckoutBtn');
    if (!checkoutBtn) {
        console.error('Payment button not found');
        return;
    }

    // Update button state based on cart and user
    function updateButtonState() {
        checkoutBtn.disabled = cart.length === 0 || !user?.name || !user?.email;
    }

    // Initial state
    updateButtonState();

    checkoutBtn.addEventListener('click', async function(e) {
        e.preventDefault();
        
        // Get button elements
        const buttonContent = checkoutBtn.querySelector('.button-content');
        const paymentAnimation = checkoutBtn.querySelector('.payment-animation');
        const paymentSuccess = checkoutBtn.querySelector('.payment-success');
        
        // 1. Validate cart
        if (cart.length === 0) {
            showToast('Your cart is empty!', 'danger');
            return;
        }

        // 2. Validate user info
        if (!user?.name || !user?.email) {
            showToast('Please complete your profile first', 'warning');
            toggleEditMode(true);
            return;
        }

        // 3. Start processing UI
        buttonContent.style.display = 'none';
        paymentAnimation.style.display = 'inline-block';
        checkoutBtn.disabled = true;

        try {
            // 4. Prepare order data
            const order = {
                user: user,
                cart: cart,
                date: new Date().toISOString(),
                total: calculateOrderTotal(),
                status: 'pending',
                orderId: 'ORD-' + Date.now().toString().slice(-8)
            };

            // 5. Save to localStorage
            localStorage.setItem('currentOrder', JSON.stringify(order));

            // 6. Verify payment page exists
            try {
                const test = await fetch('payment.html');
                if (!test.ok) throw new Error('Payment page not found');
            } catch (err) {
                console.error('Payment page check failed:', err);
                throw new Error('Payment system unavailable');
            }

            // 7. Show processing for 1.5 seconds
            await new Promise(resolve => setTimeout(resolve, 1500));

            // 8. Show success state
            paymentAnimation.style.display = 'none';
            paymentSuccess.style.display = 'inline-block';

            // 9. REDIRECT TO PAYMENT.HTML (with multiple fallbacks)
            setTimeout(() => {
                // Primary method
                window.location.href = 'payment.html';
                
                // Fallback after 100ms if primary fails
                setTimeout(() => {
                    if (window.location.pathname.indexOf('payment.html') === -1) {
                        const link = document.createElement('a');
                        link.href = 'payment.html';
                        link.click();
                    }
                }, 100);
                
                // Final fallback after 1 second
                setTimeout(() => {
                    if (window.location.pathname.indexOf('payment.html') === -1) {
                        window.open('payment.html', '_self');
                    }
                }, 1000);
            }, 800);

        } catch (error) {
            console.error('Payment processing failed:', error);
            
            // Reset button state
            buttonContent.style.display = 'inline-block';
            paymentAnimation.style.display = 'none';
            paymentSuccess.style.display = 'none';
            updateButtonState();
            
            // Show error message
            showToast(error.message.includes('unavailable') 
                ? 'Payment system is down' 
                : 'Payment failed. Please try again', 
                'danger'
            );
        }
    });

    // Update button when cart changes
    window.addEventListener('storage', updateButtonState);
    window.addEventListener('cartUpdated', updateButtonState);
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    initPaymentProcessing();
});