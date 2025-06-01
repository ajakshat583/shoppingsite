// Featured product data
const products = [
    {
        id: 1,
        name: "Quantum X Pro Smartphone",
        price: 79999,
        image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500",
        category: "Electronics",
        description: "6.7\" AMOLED Display, 256GB Storage, 12GB RAM"
    },
    {
        id: 2,
        name: "Designer Watch Collection",
        price: 24999,
        image: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=500",
        category: "Fashion",
        description: "Premium Stainless Steel, Water Resistant"
    },
    {
        id: 3,
        name: "Smart Home Hub",
        price: 15999,
        image: "https://images.unsplash.com/photo-1558002038-1055907df827?w=500",
        category: "Home & Living",
        description: "Voice Control, Smart Device Integration"
    },
    {
        id: 4,
        name: "Best-Selling Novel Bundle",
        price: 1999,
        image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500",
        category: "Books",
        description: "5 Bestselling Novels, Hardcover Edition"
    },
    {
        id: 5,
        name: "Wireless Earbuds Pro",
        price: 14999,
        image: "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=500",
        category: "Electronics",
        description: "Active Noise Cancellation, 30hr Battery"
    },
    {
        id: 6,
        name: "Premium Leather Wallet",
        price: 4999,
        image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=500",
        category: "Fashion",
        description: "Genuine Leather, RFID Protection"
    }
];

// Cart functionality
let cart = [];

// DOM Elements
const productGrid = document.getElementById('product-grid');
const cartModal = document.getElementById('cart-modal');
const cartItems = document.getElementById('cart-items');
const cartTotalAmount = document.getElementById('cart-total-amount');
const cartCount = document.querySelector('.cart-count');
const closeModal = document.querySelector('.close');
const cartIcon = document.querySelector('.cart-icon');
const checkoutBtn = document.getElementById('checkout-btn');

// Format price to Indian Rupees
function formatPrice(price) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
    }).format(price);
}

// Display products
function displayProducts() {
    productGrid.innerHTML = '';
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <div class="product-image-container">
                <img src="${product.image}" alt="${product.name}" class="product-image">
                <div class="product-overlay">
                    <p class="product-description">${product.description}</p>
                </div>
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-price">${formatPrice(product.price)}</p>
                <button class="add-to-cart" onclick="addToCart(${product.id})">Add to Cart</button>
            </div>
        `;
        productGrid.appendChild(productCard);
    });
}

// Add to cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }

    updateCart();
    showNotification('Product added to cart!');
}

// Update cart
function updateCart() {
    // Update cart count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;

    // Update cart items
    cartItems.innerHTML = '';
    let total = 0;

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-info">
                <img src="${item.image}" alt="${item.name}" style="width: 50px; height: 50px; object-fit: cover;">
                <div>
                    <h4>${item.name}</h4>
                    <p>${formatPrice(item.price)} x ${item.quantity}</p>
                </div>
            </div>
            <div class="cart-item-actions">
                <button onclick="updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
                <span>${item.quantity}</span>
                <button onclick="updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
                <button onclick="removeFromCart(${item.id})" class="remove-btn">×</button>
            </div>
        `;
        cartItems.appendChild(cartItem);
    });

    cartTotalAmount.textContent = formatPrice(total);
}

// Update quantity
function updateQuantity(productId, newQuantity) {
    if (newQuantity < 1) {
        removeFromCart(productId);
        return;
    }

    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity = newQuantity;
        updateCart();
    }
}

// Remove from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCart();
    showNotification('Product removed from cart!');
}

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 2000);
}

// Modal functionality
cartIcon.addEventListener('click', () => {
    cartModal.style.display = 'block';
});

closeModal.addEventListener('click', () => {
    cartModal.style.display = 'none';
});

window.addEventListener('click', (e) => {
    if (e.target === cartModal) {
        cartModal.style.display = 'none';
    }
});

// Checkout functionality
checkoutBtn.addEventListener('click', () => {
    if (cart.length === 0) {
        showNotification('Your cart is empty!');
        return;
    }
    
    alert('Thank you for your purchase! Total: ' + cartTotalAmount.textContent);
    cart = [];
    updateCart();
    cartModal.style.display = 'none';
});

// Search functionality
const searchInput = document.querySelector('.search-bar input');
const searchButton = document.querySelector('.search-bar button');

function searchProducts() {
    const searchTerm = searchInput.value.toLowerCase();
    const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm)
    );

    productGrid.innerHTML = '';
    if (filteredProducts.length === 0) {
        productGrid.innerHTML = '<p class="no-results">No products found.</p>';
        return;
    }

    displayProducts(filteredProducts);
}

searchButton.addEventListener('click', searchProducts);
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        searchProducts();
    }
});

// Initialize the page
displayProducts(); 