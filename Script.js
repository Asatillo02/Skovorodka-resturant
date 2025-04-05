// Initialize the current image index
let currentIndex = 0;
const images = document.querySelectorAll('.slide img'); // Get all images inside the slide container

// Function to show the image based on index
function showImage(index) {
    if (images.length === 0) {
        console.warn("No images found in the .slide container");
        return;
    }
    // Hide all images first
    images.forEach(image => {
        image.style.display = 'none'; // Hide all images
    });

    // Show the current image
    images[index].style.display = 'block'; // Display the image at the current index
}

// Function to move images based on direction
function move(direction) {
    // Calculate the new index
    currentIndex = (currentIndex + direction + images.length) % images.length;
    showImage(currentIndex);
}

// Show the first image when the page loads
showImage(currentIndex);


function Menu() {
    const nav = document.querySelector('nav');
    nav.classList.toggle('active');
}

// Initialize cart count from localStorage or set to 0
let cart = parseInt(localStorage.getItem('cartCount')) || 0;

// Initialize cart items from localStorage or set to an empty array
let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

// Function to update cart count displayed in the header
function updateCartDisplay() {
    const cartValueElement = document.querySelector('.cart-value');
    if (cartValueElement) { // Ensure the element exists (specific to menu page)
        cartValueElement.textContent = cart;
    } else {
        console.warn("Element .cart-value not found");
    }
}

// Function to update cart items in localStorage
function updateCartItems() {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
}

// Function to show "Added to Cart" message
function showAddedToCartMessage() {
    const message = document.createElement('div');
    message.textContent = "Added to Cart";
    message.className = 'added-to-cart-message'; // Apply the CSS class
    document.body.appendChild(message);

    // Remove the message after 2 seconds
    setTimeout(() => {
        document.body.removeChild(message);
    }, 2000);
}

// Function to add an item to the cart
function addToCart(event) {
    const target = event.target; // Get the clicked element (button or image)

    // Prefer reading data from attributes
    const name = target.dataset.name;
    const price = `${target.dataset.price}`;
    const image = target.dataset.image;

    if (!name || !price || !image) {
        console.warn("Missing product data in button attributes");
        return;
    }

    // Check if the item already exists in the cart
    const existingItem = cartItems.find(item => item.name === name);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cartItems.push({ image, name, price, quantity: 1 });
    }

    updateCartItems();
    cart += 1;
    localStorage.setItem('cartCount', cart);
    updateCartDisplay();
    showAddedToCartMessage();
}

// Function to render cart items in cart.html
function renderCartItems() {
    const cartTableBody = document.querySelector('#cart-table tbody');
    const cartTotalElement = document.querySelector('.total h4');
    const cartTaxElement = document.querySelector('.tax h4');
    const cartSubtotalElement = document.querySelector('.subtotal h4');

    if (!cartTableBody || !cartTotalElement) return;

    cartTableBody.innerHTML = ''; // Clear table
    let subtotal = 0;
    const taxRate = 0.08875;

    cartItems.forEach((item, index) => {
        const row = document.createElement('tr');

        // Create row content
        row.innerHTML = `
            <td>
                <img src="${item.image}" alt="${item.name}" class="cart-image"><br>
            </td>
            <td>${item.name}</td>
            <td>${item.price}</td>
            <td>
                <div class="quantity-container">
                    ${item.quantity}
                    <br>
                    <button class="remove">Remove</button>
                </div>
            </td>
        `;

        // Add event listener for *this specific button*
        const removeButton = row.querySelector('.remove');
        removeButton.addEventListener('click', () => {
            if (item.quantity > 1) {
                item.quantity -= 1;
            } else {
                cartItems.splice(index, 1); // Remove the item from array
            }

            cart -= 1;
            localStorage.setItem('cartCount', cart);
            updateCartItems();
            updateCartDisplay();
            renderCartItems(); 
        });

        cartTableBody.appendChild(row);

        const priceValue = parseFloat(item.price.replace('$', '')) || 0;
        subtotal += priceValue * item.quantity;
    });

    const tax = subtotal * taxRate;
    const total = subtotal + tax;
    cartSubtotalElement.textContent = `Subtotal: $${subtotal.toFixed(2)}`;
    cartTaxElement.textContent = `Tax: $${tax.toFixed(2)}`;
    cartTotalElement.textContent = `Total: $${total.toFixed(2)}`;

}

// Function to clear the cart
function clearCart() {
    cart = 0;
    cartItems = [];
    localStorage.setItem('cartCount', cart); // Reset the cart count in localStorage
    localStorage.setItem('cartItems', JSON.stringify(cartItems)); // Reset cart items in localStorage
    updateCartDisplay(); // Update the cart display
    renderCartItems(); // Clear cart table
}

// Function to initialize cart display on any page
function initializeCartDisplay() {
    const cartValueElement = document.querySelector('.cart-value');
    if (cartValueElement) {
        cartValueElement.textContent = cart; // Display the current cart value
    }
}

// Attach event listeners after the DOM has loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize the cart count on all pages
    initializeCartDisplay();

    // Check if we are on the menu page by looking for menu-specific elements
    const menuElement = document.querySelector('.menu');
    if (menuElement) {
        // Initialize the cart count on page load
        updateCartDisplay();

        // Add event listeners to all "Add to Cart" buttons
        document.querySelectorAll('.add-to-cart').forEach(button => {
                        button.addEventListener('click', addToCart);
        });

        // Add event listeners to all menu images
        document.querySelectorAll('.menu img').forEach(image => {
            image.addEventListener('click', addToCart);
        });
    } else {
        console.warn("Menu page elements not found. Skipping menu-specific logic.");
    }

    // Add event listener to the "Clear Cart" button if it exists
    const clearCartButton = document.querySelector('.clear-cart');
    if (clearCartButton) {
        clearCartButton.addEventListener('click', clearCart);
    }

    // Render cart items if on cart.html
    if (document.querySelector('#cart-table')) {
        renderCartItems();
    }
});

