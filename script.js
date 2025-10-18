// ========================================
// ShopHub - E-Commerce JavaScript
// ========================================

// Shopping Cart State
let cart = [];
let cartCount = 0;

// DOM Elements
const cartBtn = document.getElementById('cart-btn');
const cartSidebar = document.getElementById('cart-sidebar');
const closeCart = document.getElementById('close-cart');
const cartItems = document.getElementById('cart-items');
const cartCountEl = document.getElementById('cart-count');
const totalPriceEl = document.getElementById('total-price');
const searchBar = document.getElementById('search-bar');
const addToCartBtns = document.querySelectorAll('.btn-add-cart');
const filterBtns = document.querySelectorAll('.filter-btn');
const productCards = document.querySelectorAll('.product-card');
const navLinks = document.querySelectorAll('.nav-link');
const wishlistBtns = document.querySelectorAll('.wishlist-btn');
const categoryCards = document.querySelectorAll('.category-card');
const newsletterForm = document.getElementById('newsletter-form');

// ========================================
// Navigation Active Link
// ========================================
window.addEventListener('scroll', () => {
    let current = '';
    const sections = document.querySelectorAll('section[id]');
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').includes(current)) {
            link.classList.add('active');
        }
    });
});

// ========================================
// Shopping Cart Functions
// ========================================

// Open Cart Sidebar
if (cartBtn) {
    cartBtn.addEventListener('click', () => {
        cartSidebar.classList.add('active');
    });
}

// Close Cart Sidebar
if (closeCart) {
    closeCart.addEventListener('click', () => {
        cartSidebar.classList.remove('active');
    });
}

// Close cart when clicking outside
document.addEventListener('click', (e) => {
    if (cartSidebar && cartSidebar.classList.contains('active')) {
        if (!cartSidebar.contains(e.target) && !cartBtn.contains(e.target)) {
            cartSidebar.classList.remove('active');
        }
    }
});

// Add to Cart Function
function addToCart(id, name, price) {
    const existingItem = cart.find(item => item.id === id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: id,
            name: name,
            price: parseFloat(price),
            quantity: 1
        });
    }
    
    updateCart();
    showNotification(`${name} added to cart!`);
}

// Update Cart Display
function updateCart() {
    cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    cartCountEl.textContent = cartCount;
    
    // Update cart items display
    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <p>Your cart is empty</p>
            </div>
        `;
        totalPriceEl.textContent = '$0.00';
    } else {
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item">
                <div class="cart-item-image">
                    <i class="fas fa-box"></i>
                </div>
                <div class="cart-item-details">
                    <h3>${item.name}</h3>
                    <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                    <div class="cart-item-quantity">
                        <button class="qty-btn" onclick="updateQuantity(${item.id}, -1)">
                            <i class="fas fa-minus"></i>
                        </button>
                        <span>${item.quantity}</span>
                        <button class="qty-btn" onclick="updateQuantity(${item.id}, 1)">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                </div>
                <button class="remove-item" onclick="removeFromCart(${item.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `).join('');
        
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        totalPriceEl.textContent = `$${total.toFixed(2)}`;
    }
}

// Update Quantity
function updateQuantity(id, change) {
    const item = cart.find(item => item.id === id);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(id);
        } else {
            updateCart();
        }
    }
}

// Remove from Cart
function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    updateCart();
}

// Add to Cart Button Event Listeners
addToCartBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        const id = btn.getAttribute('data-id');
        const name = btn.getAttribute('data-name');
        const price = btn.getAttribute('data-price');
        addToCart(id, name, price);
    });
});

// ========================================
// Product Filtering
// ========================================
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class from all buttons
        filterBtns.forEach(b => b.classList.remove('active'));
        // Add active class to clicked button
        btn.classList.add('active');
        
        const filter = btn.getAttribute('data-filter');
        
        productCards.forEach(card => {
            if (filter === 'all' || card.getAttribute('data-category') === filter) {
                card.classList.remove('hidden');
            } else {
                card.classList.add('hidden');
            }
        });
    });
});

// ========================================
// Category Filtering
// ========================================
categoryCards.forEach(card => {
    card.addEventListener('click', () => {
        const category = card.getAttribute('data-category');
        
        // Scroll to products section
        document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
        
        // Filter products after scroll
        setTimeout(() => {
            // Update filter buttons
            filterBtns.forEach(btn => {
                if (btn.getAttribute('data-filter') === category) {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            });
            
            // Filter products
            productCards.forEach(card => {
                if (card.getAttribute('data-category') === category) {
                    card.classList.remove('hidden');
                } else {
                    card.classList.add('hidden');
                }
            });
        }, 500);
    });
});

// ========================================
// Search Functionality
// ========================================
if (searchBar) {
    searchBar.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase().trim();
        
        productCards.forEach(card => {
            const productName = card.querySelector('h3').textContent.toLowerCase();
            const productDesc = card.querySelector('.product-description').textContent.toLowerCase();
            
            if (productName.includes(searchTerm) || productDesc.includes(searchTerm)) {
                card.classList.remove('hidden');
            } else {
                card.classList.add('hidden');
            }
        });
        
        // Reset filter buttons if searching
        if (searchTerm) {
            filterBtns.forEach(btn => btn.classList.remove('active'));
        }
    });
}

// ========================================
// Wishlist Functionality
// ========================================
wishlistBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        btn.classList.toggle('active');
        
        if (btn.classList.contains('active')) {
            showNotification('Added to wishlist!');
        } else {
            showNotification('Removed from wishlist');
        }
    });
});

// ========================================
// Newsletter Subscription
// ========================================
if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = newsletterForm.querySelector('input[type="email"]').value;
        
        if (email) {
            showNotification('Thank you for subscribing!');
            newsletterForm.reset();
        }
    });
}

// ========================================
// Notification System
// ========================================
function showNotification(message) {
    // Remove existing notifications
    const existingNotif = document.querySelector('.notification');
    if (existingNotif) {
        existingNotif.remove();
    }
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>${message}</span>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: #10b981;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        display: flex;
        align-items: center;
        gap: 0.5rem;
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add notification animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ========================================
// Smooth Scroll for Navigation
// ========================================
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href.startsWith('#')) {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    });
});

// ========================================
// Mobile Menu Toggle (Optional Enhancement)
// ========================================
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.querySelector('.nav-menu');

if (navToggle) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });
}

// ========================================
// Initialize Cart on Page Load
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    updateCart();
    console.log('ShopHub E-Commerce loaded successfully!');
});

// ========================================
// Checkout Button
// ========================================
const checkoutBtn = document.querySelector('.btn-checkout');
if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
        if (cart.length === 0) {
            showNotification('Your cart is empty!');
        } else {
            const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            showNotification(`Checkout total: $${total.toFixed(2)}`);
            // Here you would typically redirect to a checkout page
            console.log('Cart items:', cart);
        }
    });
}
