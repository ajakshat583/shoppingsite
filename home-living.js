// Home & Living product data
const products = [
    {
        id: 1,
        name: "Modern Sofa Set",
        price: 49999,
        image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500",
        category: "furniture",
        description: "Premium Fabric, Comfortable Design"
    },
    {
        id: 2,
        name: "Smart Home Hub",
        price: 15999,
        image: "https://images.unsplash.com/photo-1558002038-1055907df827?w=500",
        category: "decor",
        description: "Voice Control, Smart Device Integration"
    },
    {
        id: 3,
        name: "Designer Coffee Table",
        price: 12999,
        image: "https://i5.walmartimages.com/asr/01538776-ccbe-4b31-abd8-fedda3046cf2_6.5851cd4e62d7740828767de33c14f1ce.jpeg",
        category: "furniture",
        description: "Glass Top, Modern Design"
    },
    {
        id: 4,
        name: "Smart LED Bulbs",
        price: 2999,
        image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500",
        category: "lighting",
        description: "Color Changing, App Control"
    },
    {
        id: 5,
        name: "Kitchen Appliances Set",
        price: 24999,
        image: "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=500",
        category: "kitchen",
        description: "Stainless Steel, Modern Design"
    },
    {
        id: 6,
        name: "Wall Art Collection",
        price: 7999,
        image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=500",
        category: "decor",
        description: "Canvas Prints, Modern Art"
    },
    {
        id: 7,
        name: "Smart Coffee Maker",
        price: 8999,
        image: "https://th.bing.com/th/id/OIP.ILe0puzNjVCQgIo6l46pDgHaHa?w=196&h=196&c=7&r=0&o=5&dpr=1.3&pid=1.7",
        category: "kitchen",
        description: "App Control, Programmable"
    },
    {
        id: 8,
        name: "Floor Lamp",
        price: 5999,
        image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500",
        category: "lighting",
        description: "Adjustable Height, Modern Design"
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
const filterButtons = document.querySelectorAll('.filter-btn');

// Format price to Indian Rupees
function formatPrice(price) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
    }).format(price);
}

// Display products
function displayProducts(filteredProducts = products) {
    productGrid.innerHTML = '';
    filteredProducts.forEach(product => {
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

// Filter products
function filterProducts(category) {
    const filteredProducts = category === 'all' 
        ? products 
        : products.filter(product => product.category === category);
    displayProducts(filteredProducts);
}

// Add filter button event listeners
filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all buttons
        filterButtons.forEach(btn => btn.classList.remove('active'));
        // Add active class to clicked button
        button.classList.add('active');
        // Filter products
        filterProducts(button.dataset.filter);
    });
});

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
        product.description.toLowerCase().includes(searchTerm)
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