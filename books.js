// Books product data
const products = [
    {
        id: 1,
        name: "Best-Selling Novel Bundle",
        price: 1999,
        image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500",
        category: "fiction",
        description: "5 Bestselling Novels, Hardcover Edition"
    },
    {
        id: 2,
        name: "Business Strategy Guide",
        price: 1499,
        image: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=500",
        category: "non-fiction",
        description: "Expert Business Insights"
    },
    {
        id: 3,
        name: "Personal Development",
        price: 899,
        image: "https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=500",
        category: "self-help",
        description: "Transform Your Life"
    },
    {
        id: 4,
        name: "Computer Science Textbook",
        price: 2499,
        image: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=500",
        category: "academic",
        description: "Latest Edition, Comprehensive"
    },
    {
        id: 5,
        name: "Mystery Thriller Collection",
        price: 1799,
        image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500",
        category: "fiction",
        description: "3 Bestselling Mystery Novels"
    },
    {
        id: 6,
        name: "History of India",
        price: 1299,
        image: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=500",
        category: "non-fiction",
        description: "Rich Cultural Heritage"
    },
    {
        id: 7,
        name: "Mindfulness Guide",
        price: 699,
        image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500",
        category: "self-help",
        description: "Find Inner Peace"
    },
    {
        id: 8,
        name: "Mathematics Textbook",
        price: 1899,
        image: "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=500",
        category: "academic",
        description: "Advanced Concepts"
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