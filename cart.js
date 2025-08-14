// cart.js - Complete Cart Management Solution
document.addEventListener('DOMContentLoaded', function() {
    // Initialize cart from localStorage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // DOM Elements
    const cartContainer = document.getElementById('accountCartItems');
    const cartCountBadge = document.getElementById('cartItemCount');
    const checkoutBtn = document.getElementById('accountCheckoutBtn');
    
    // Initialize quantity controls for product cards
    function initQuantityControls() {
        document.querySelectorAll('.quantity-controls').forEach(control => {
            const decrementBtn = control.querySelector('.decrement');
            const incrementBtn = control.querySelector('.increment');
            const quantityInput = control.querySelector('.quantity-input');
            
            // Set minimum quantity to 1
            quantityInput.min = 1;
            
            // Decrement button
            decrementBtn.addEventListener('click', () => {
                let currentValue = parseInt(quantityInput.value);
                quantityInput.value = currentValue > 1 ? currentValue - 1 : 1;
            });
            
            // Increment button
            incrementBtn.addEventListener('click', () => {
                let currentValue = parseInt(quantityInput.value);
                quantityInput.value = currentValue + 1;
            });
            
            // Validate manual input
            quantityInput.addEventListener('change', function() {
                this.value = this.value < 1 ? 1 : this.value;
            });
        });
    }
    
    // Add to cart functionality
    function setupAddToCart() {
        document.querySelectorAll('.add-to-cart').forEach(button => {
            button.addEventListener('click', function() {
                const productCard = this.closest('.card');
                const productId = parseInt(this.dataset.id);
                const quantity = parseInt(productCard.querySelector('.quantity-input').value);
                const productName = productCard.querySelector('.card-title').textContent;
                const productPrice = parseFloat(productCard.querySelector('.card-text.fw-bold').textContent.replace('₹', ''));
                const productImage = productCard.querySelector('.card-img-top').src;
                
                // Check if product already exists in cart
                const existingItem = cart.find(item => item.id === productId);
                if (existingItem) {
                    existingItem.quantity += quantity;
                } else {
                    cart.push({
                        id: productId,
                        name: productName,
                        price: productPrice,
                        image: productImage,
                        quantity: quantity
                    });
                }
                
                // Update localStorage and UI
                localStorage.setItem('cart', JSON.stringify(cart));
                renderCart();
                showToast(`Added ${quantity} ${productName} to cart`);
            });
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

    // Render cart items
    function renderCart() {
        if (!cartContainer) return;
        
        if (cart.length === 0) {
            cartContainer.innerHTML = `
                <div class="text-center py-4">
                    <i class="fas fa-shopping-cart fa-3x text-muted mb-3"></i>
                    <p class="text-muted">Your cart is empty</p>
                    <a href="index.html#flavors" class="btn btn-outline-primary">
                        <i class="fas fa-ice-cream me-2"></i> Browse Flavors
                    </a>
                </div>`;
            checkoutBtn.disabled = true;
            updateCartCount();
            return;
        }
        
        let html = '';
        let subtotal = 0;
        
        // Generate cart items HTML
        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            subtotal += itemTotal;
            
            html += `
                <div class="cart-item d-flex justify-content-between align-items-center mb-3">
                    <div class="d-flex align-items-center">
                        <img src="${item.image}" class="cart-item-img rounded me-3" style="width: 80px; height: 80px; object-fit: cover;" alt="${item.name}">
                        <div>
                            <h6 class="mb-0">${item.name}</h6>
                            <div class="d-flex align-items-center mt-2">
                                <button class="btn btn-sm btn-outline-secondary quantity-adjust" data-id="${item.id}" data-change="-1">
                                    <i class="fas fa-minus"></i>
                                </button>
                                <input type="number" class="form-control mx-2 quantity-edit" 
                                       value="${item.quantity}" min="1" data-id="${item.id}" 
                                       style="width: 60px; text-align: center;">
                                <button class="btn btn-sm btn-outline-secondary quantity-adjust" data-id="${item.id}" data-change="1">
                                    <i class="fas fa-plus"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div class="d-flex align-items-center">
                        <span class="me-3">₹${itemTotal.toFixed(2)}</span>
                        <button class="btn btn-sm btn-outline-danger remove-from-cart" data-id="${item.id}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                <hr class="my-2">`;
        });
        
        // Calculate totals
        const tax = subtotal * 0.1;
        const serviceCharge = 15;
        const total = subtotal + tax + serviceCharge;
        
        // Add totals to HTML
        html += `
            <div class="d-flex justify-content-between mt-4 pt-3 border-top">
                <h5>Subtotal:</h5>
                <h5>₹${subtotal.toFixed(2)}</h5>
            </div>
            <div class="d-flex justify-content-between">
                <p>Tax (10%):</p>
                <p>₹${tax.toFixed(2)}</p>
            </div>
            <div class="d-flex justify-content-between">
                <p>Service Charge:</p>
                <p>₹${serviceCharge.toFixed(2)}</p>
            </div>
            <div class="d-flex justify-content-between fw-bold">
                <p>Total:</p>
                <p>₹${total.toFixed(2)}</p>
            </div>`;
        
        cartContainer.innerHTML = html;
        checkoutBtn.disabled = false;
        updateCartCount();
        
        // Setup event listeners for in-cart quantity editing
        document.querySelectorAll('.quantity-edit').forEach(input => {
            input.addEventListener('change', function() {
                const productId = parseInt(this.dataset.id);
                const newQuantity = parseInt(this.value) || 1;
                const item = cart.find(item => item.id === productId);
                
                if (item) {
                    item.quantity = newQuantity < 1 ? 1 : newQuantity;
                    localStorage.setItem('cart', JSON.stringify(cart));
                    renderCart();
                }
            });
        });
    }
    
    // Update cart count badge
    function updateCartCount() {
        if (cartCountBadge) {
            cartCountBadge.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
        }
    }
    
    // Event delegation for cart actions
    document.addEventListener('click', function(e) {
        // Remove item from cart
        if (e.target.closest('.remove-from-cart')) {
            const productId = parseInt(e.target.closest('.remove-from-cart').dataset.id);
            cart = cart.filter(item => item.id !== productId);
            localStorage.setItem('cart', JSON.stringify(cart));
            renderCart();
            showToast('Item removed from cart');
        }
        // Adjust quantity in cart
        else if (e.target.closest('.quantity-adjust')) {
            const button = e.target.closest('.quantity-adjust');
            const productId = parseInt(button.dataset.id);
            const change = parseInt(button.dataset.change);
            const item = cart.find(item => item.id === productId);
            
            if (item) {
                item.quantity += change;
                if (item.quantity < 1) item.quantity = 1;
                localStorage.setItem('cart', JSON.stringify(cart));
                renderCart();
            }
        }
    });
    
    // Checkout process
    checkoutBtn?.addEventListener('click', function() {
        if (cart.length === 0) return;
        
        const buttonContent = checkoutBtn.querySelector('.button-content');
        const paymentAnimation = checkoutBtn.querySelector('.payment-animation');
        
        buttonContent.style.display = 'none';
        paymentAnimation.style.display = 'inline-block';
        checkoutBtn.disabled = true;
        
        setTimeout(() => {
            paymentAnimation.style.display = 'none';
            const paymentSuccess = checkoutBtn.querySelector('.payment-success');
            paymentSuccess.style.display = 'inline-block';
            
            setTimeout(() => {
                cart = [];
                localStorage.setItem('cart', JSON.stringify(cart));
                renderCart();
                
                setTimeout(() => {
                    paymentSuccess.style.display = 'none';
                    buttonContent.style.display = 'inline-block';
                }, 2000);
            }, 1500);
        }, 3000);
    });
    
    // Show toast notification
    function showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'toast align-items-center text-white bg-primary';
        toast.innerHTML = `
            <div class="d-flex">
                <div class="toast-body">${message}</div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
            </div>`;
        document.body.appendChild(toast);
        new bootstrap.Toast(toast).show();
        setTimeout(() => toast.remove(), 3000);
    }
    
    // Initialize the cart system
    initQuantityControls();
    setupAddToCart();
    renderCart();
});
document.addEventListener('DOMContentLoaded', function() {
    // Check authentication first
    const user = JSON.parse(localStorage.getItem('currentUser')) || {};
    if (!user || !user.email) {
        const returnUrl = encodeURIComponent(window.location.pathname);
        window.location.href = `login.html?return=${returnUrl}`;
        return;
    }

    // Proceed with cart functionality if authenticated
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // DOM Elements
    const elements = {
        accountUserImg: document.getElementById('accountUserImg'),
        accountUserName: document.getElementById('accountUserName'),
        accountUserEmail: document.getElementById('accountUserEmail'),
        accountFullName: document.getElementById('accountFullName'),
        accountEmail: document.getElementById('accountEmail'),
        accountPhone: document.getElementById('accountPhone'),
        accountAddress: document.getElementById('accountAddress'),
        editProfileBtn: document.getElementById('editProfileBtn'),
        editDetailsBtn: document.getElementById('editDetailsBtn'),
        changePhotoBtn: document.getElementById('changePhotoBtn'),
        logoutBtn: document.getElementById('logoutBtn'),
        accountDetailsView: document.getElementById('accountDetailsView'),
        accountDetailsEdit: document.getElementById('accountDetailsEdit'),
        editFullName: document.getElementById('editFullName'),
        editEmail: document.getElementById('editEmail'),
        editPhone: document.getElementById('editPhone'),
        editAddress: document.getElementById('editAddress'),
        cancelEditBtn: document.getElementById('cancelEditBtn'),
        saveEditBtn: document.getElementById('saveEditBtn'),
        processPaymentBtn: document.getElementById('processPaymentBtn')
    };

    // Initialize profile image upload
    const profileImageUpload = document.createElement('input');
    profileImageUpload.type = 'file';
    profileImageUpload.accept = 'image/*';
    profileImageUpload.style.display = 'none';
    document.body.appendChild(profileImageUpload);

    // Update user info display
    function updateUserInfo() {
        const { accountUserName, accountUserEmail, accountFullName, accountEmail, accountPhone, accountAddress, accountUserImg } = elements;
        
        accountUserName.textContent = user.name || 'User';
        accountUserEmail.textContent = user.email || 'No email';
        accountFullName.textContent = user.name || '-';
        accountEmail.textContent = user.email || '-';
        accountPhone.textContent = user.phone || 'Not provided';
        accountAddress.textContent = user.address || 'Not provided';

        if (user.image) {
            accountUserImg.src = user.image;
        } else {
            const name = user.name ? encodeURIComponent(user.name) : 'User';
            accountUserImg.src = `https://ui-avatars.com/api/?name=${name}&background=random&size=150&rounded=true`;
        }
    }

    // Toggle edit mode
    function toggleEditMode(show) {
        const { accountDetailsView, accountDetailsEdit, editFullName, editEmail, editPhone, editAddress } = elements;
        
        if (show) {
            accountDetailsView.style.display = 'none';
            accountDetailsEdit.style.display = 'block';
            
            editFullName.value = user.name || '';
            editEmail.value = user.email || '';
            editPhone.value = user.phone || '';
            editAddress.value = user.address || '';
            
            document.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));
        } else {
            accountDetailsView.style.display = 'block';
            accountDetailsEdit.style.display = 'none';
        }
    }

    // Save profile changes
    function saveProfile() {
        const { editFullName, editEmail, editPhone, editAddress } = elements;
        let isValid = true;
        
        // Validate required fields
        if (!editFullName.value.trim()) {
            editFullName.classList.add('is-invalid');
            isValid = false;
        }
        
        if (!editEmail.value.trim() || !/^\S+@\S+\.\S+$/.test(editEmail.value)) {
            editEmail.classList.add('is-invalid');
            isValid = false;
        }

        if (isValid) {
            user.name = editFullName.value.trim();
            user.email = editEmail.value.trim();
            user.phone = editPhone.value.trim();
            user.address = editAddress.value.trim();
            
            localStorage.setItem('currentUser', JSON.stringify(user));
            updateUserInfo();
            toggleEditMode(false);
            showToast('Profile updated successfully!');
        }
    }

    // Handle image upload
    function handleImageUpload(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                user.image = e.target.result;
                localStorage.setItem('currentUser', JSON.stringify(user));
                elements.accountUserImg.src = user.image;
                showToast('Profile picture updated!');
            };
            reader.readAsDataURL(file);
        }
    }

    // Handle logout
    function handleLogout() {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('cart');
        window.location.href = 'index.html';
    }

   

    // Calculate order total
    function calculateOrderTotal() {
        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const tax = subtotal * 0.1;
        const serviceCharge = 15;
        return (subtotal + tax + serviceCharge).toFixed(2);
    }

    // Show toast notification
    function showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast show position-fixed bottom-0 end-0 m-3 text-white bg-${type}`;
        toast.style.zIndex = '9999';
        toast.innerHTML = `
            <div class="d-flex">
                <div class="toast-body">${message}</div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto"></button>
            </div>
        `;
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);

        toast.querySelector('.btn-close').addEventListener('click', () => toast.remove());
    }

    // Initialize event listeners
    function initEventListeners() {
        const { editProfileBtn, editDetailsBtn, cancelEditBtn, saveEditBtn, changePhotoBtn, logoutBtn, processPaymentBtn } = elements;
        
        editProfileBtn.addEventListener('click', () => toggleEditMode(true));
        editDetailsBtn.addEventListener('click', () => toggleEditMode(true));
        cancelEditBtn.addEventListener('click', () => toggleEditMode(false));
        saveEditBtn.addEventListener('click', saveProfile);
        changePhotoBtn.addEventListener('click', () => profileImageUpload.click());
        profileImageUpload.addEventListener('change', handleImageUpload);
        logoutBtn.addEventListener('click', handleLogout);
        
        if (processPaymentBtn) {
            processPaymentBtn.addEventListener('click', processPayment);
        }
    }

    // Initialize everything
    updateUserInfo();
    initEventListeners();
});
// Payment Processing Solution
function setupPaymentProcessing() {
    const checkoutBtn = document.getElementById('accountCheckoutBtn');
    if (!checkoutBtn) {
        console.error('Payment button not found!');
        return;
    }

    // Update button state based on conditions
    function updateButtonState() {
        checkoutBtn.disabled = cart.length === 0 || !user?.name || !user?.email;
    }

    // Initial button state
    updateButtonState();

    checkoutBtn.addEventListener('click', async function(e) {
        e.preventDefault();
        
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
        const buttonContent = checkoutBtn.querySelector('.button-content');
        const paymentAnimation = checkoutBtn.querySelector('.payment-animation');
        
        buttonContent.style.display = 'none';
        paymentAnimation.style.display = 'inline-block';
        checkoutBtn.disabled = true;

        try {
            // 4. Verify payment page exists
            const paymentPageCheck = await fetch('payment.html');
            if (!paymentPageCheck.ok) {
                throw new Error('Payment page not found (404)');
            }

            // 5. Prepare order data
            const order = {
                user: user,
                cart: cart,
                date: new Date().toISOString(),
                total: calculateOrderTotal(),
                status: 'pending',
                orderId: 'ORD-' + Date.now().toString().slice(-8)
            };

            // 6. Save order
            localStorage.setItem('currentOrder', JSON.stringify(order));
            console.log('Order prepared:', order);

            // 7. Show processing animation (2 seconds)
            await new Promise(resolve => setTimeout(resolve, 2000));

            // 8. Show success state
            const paymentSuccess = checkoutBtn.querySelector('.payment-success');
            paymentAnimation.style.display = 'none';
            paymentSuccess.style.display = 'inline-block';

            // 9. REDIRECT TO PAYMENT PAGE (with multiple fallbacks)
            setTimeout(() => {
                // Try standard redirect first
                window.location.href = 'payment.html';
                
                // Fallback if blocked
                setTimeout(() => {
                    const a = document.createElement('a');
                    a.href = 'payment.html';
                    a.style.display = 'none';
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                }, 100);
            }, 800);

        } catch (error) {
            console.error('Payment Error:', error);
            
            // Reset button state
            buttonContent.style.display = 'inline-block';
            paymentAnimation.style.display = 'none';
            updateButtonState();
            
            // Show error message
            if (error.message.includes('404')) {
                showToast('Payment system is down. Please try again later.', 'danger');
            } else {
                showToast('Payment failed. Please check your connection.', 'danger');
            }
        }
    });

    // Watch for cart changes
    window.addEventListener('storage', updateButtonState);
    window.addEventListener('cartUpdated', updateButtonState);
}

// Add to your DOMContentLoaded
document.addEventListener('DOMContentLoaded', function() {
    // ... other init code ...
    setupPaymentProcessing();
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
    // ... other initialization code ...
    initPaymentProcessing();
});