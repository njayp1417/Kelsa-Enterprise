document.addEventListener('DOMContentLoaded', function() {
    // WhatsApp number to send orders to
    const whatsappNumber = '2348025071778'; // Kelsa Enterprise WhatsApp number
    
    // Cart functionality
    let cart = [];
    const cartItems = document.getElementById('cart-items');
    const emptyCartMessage = document.getElementById('empty-cart-message');
    const subtotalAmount = document.getElementById('subtotal-amount');
    const checkoutBtn = document.getElementById('checkout-btn');
    
    // Add event listeners to "Add to Cart" buttons
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productCard = this.closest('.product-card');
            const productId = productCard.dataset.id;
            const productName = productCard.querySelector('h3').textContent;
            const productPrice = parseFloat(productCard.querySelector('.price').textContent.replace('₦', '').replace(',', ''));
            const productImage = productCard.querySelector('img').src;
            
            // Check if product is already in cart
            const existingProduct = cart.find(item => item.id === productId);
            
            if (existingProduct) {
                existingProduct.quantity += 1;
            } else {
                cart.push({
                    id: productId,
                    name: productName,
                    price: productPrice,
                    image: productImage,
                    quantity: 1
                });
            }
            
            // Update cart display
            updateCartDisplay();
            
            // Show confirmation
            alert(`${productName} added to cart!`);
        });
    });
    
    // Update cart display
    function updateCartDisplay() {
        if (cart.length === 0) {
            emptyCartMessage.style.display = 'block';
            cartItems.innerHTML = '';
            cartItems.appendChild(emptyCartMessage);
        } else {
            emptyCartMessage.style.display = 'none';
            
            // Clear current cart items
            cartItems.innerHTML = '';
            
            // Add each item to the cart display
            cart.forEach(item => {
                const cartItem = document.createElement('div');
                cartItem.className = 'cart-item';
                cartItem.innerHTML = `
                    <div class="cart-item-info">
                        <img src="${item.image}" alt="${item.name}">
                        <div>
                            <h4>${item.name}</h4>
                            <p>₦${item.price.toFixed(2)}</p>
                        </div>
                    </div>
                    <div class="cart-item-quantity">
                        <button class="decrease-quantity" data-id="${item.id}">-</button>
                        <span>${item.quantity}</span>
                        <button class="increase-quantity" data-id="${item.id}">+</button>
                        <button class="remove-item" data-id="${item.id}">×</button>
                    </div>
                `;
                cartItems.appendChild(cartItem);
            });
            
            // Add event listeners to quantity buttons
            addQuantityButtonListeners();
        }
        
        // Update subtotal
        updateSubtotal();
    }
    
    // Add event listeners to quantity buttons
    function addQuantityButtonListeners() {
        // Increase quantity
        document.querySelectorAll('.increase-quantity').forEach(button => {
            button.addEventListener('click', function() {
                const productId = this.dataset.id;
                const item = cart.find(item => item.id === productId);
                if (item) {
                    item.quantity += 1;
                    updateCartDisplay();
                }
            });
        });
        
        // Decrease quantity
        document.querySelectorAll('.decrease-quantity').forEach(button => {
            button.addEventListener('click', function() {
                const productId = this.dataset.id;
                const item = cart.find(item => item.id === productId);
                if (item) {
                    item.quantity -= 1;
                    if (item.quantity <= 0) {
                        cart = cart.filter(cartItem => cartItem.id !== productId);
                    }
                    updateCartDisplay();
                }
            });
        });
        
        // Remove item
        document.querySelectorAll('.remove-item').forEach(button => {
            button.addEventListener('click', function() {
                const productId = this.dataset.id;
                cart = cart.filter(item => item.id !== productId);
                updateCartDisplay();
            });
        });
    }
    
    // Update subtotal
    function updateSubtotal() {
        const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        subtotalAmount.textContent = `₦${subtotal.toFixed(2)}`;
    }
    
    // Handle checkout via WhatsApp
    checkoutBtn.addEventListener('click', function() {
        if (cart.length === 0) {
            alert('Your cart is empty!');
            return;
        }
        
        // Create order message
        let message = 'Hello! I would like to place an order for:%0A%0A';
        
        cart.forEach(item => {
            message += `${item.quantity}x ${item.name} - ₦${(item.price * item.quantity).toFixed(2)}%0A`;
        });
        
        const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        message += `%0ASubtotal: ₦${subtotal.toFixed(2)}%0A%0A`;
        
        // Add booking information if available
        const departureInput = document.getElementById('departure');
        const destinationInput = document.getElementById('destination');
        const departureDateInput = document.getElementById('departure-date');
        
        if (departureInput && departureInput.value && 
            destinationInput && destinationInput.value && 
            departureDateInput && departureDateInput.value) {
            
            message += `%0ABooking Details:%0A`;
            message += `From: ${departureInput.value}%0A`;
            message += `To: ${destinationInput.value}%0A`;
            message += `Date: ${departureDateInput.value}%0A`;
            
            const adultsInput = document.getElementById('adults');
            const childrenInput = document.getElementById('children');
            
            if (adultsInput && adultsInput.value) {
                message += `Adults: ${adultsInput.value}%0A`;
            }
            
            if (childrenInput && childrenInput.value && childrenInput.value > 0) {
                message += `Children: ${childrenInput.value}%0A`;
            }
        }
        
        // Add delivery preference if selected
        const deliveryOptions = document.querySelectorAll('input[name="delivery-option"]');
        let selectedDelivery = '';
        
        deliveryOptions.forEach(option => {
            if (option && option.checked) {
                selectedDelivery = option.value;
            }
        });
        
        if (selectedDelivery) {
            message += `%0ADelivery Preference: ${selectedDelivery}%0A`;
        }
        
        message += '%0APlease provide delivery details to complete my order.';
        
        // Open WhatsApp with the message
        window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
    });
    
    // Handle flight search form submission
    const bookingForm = document.getElementById('booking-form');
    if (bookingForm) {
        bookingForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // In a real application, you would search for flights here
            // For this example, we'll just show a message
            alert('Flight search functionality would be implemented here. For now, you can proceed to shop for accessories.');
            
            // Scroll to accessories section
            document.getElementById('accessories').scrollIntoView({ behavior: 'smooth' });
        });
    }
});