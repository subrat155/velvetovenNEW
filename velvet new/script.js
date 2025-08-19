document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    mobileMenuBtn.addEventListener('click', function() {
        mobileMenu.classList.toggle('active');
        mobileMenuBtn.querySelector('i').classList.toggle('fa-times');
        mobileMenuBtn.querySelector('i').classList.toggle('fa-bars');
    });
    
    // Close mobile menu when clicking on a link
    const mobileMenuLinks = document.querySelectorAll('.mobile-menu a');
    mobileMenuLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            mobileMenuBtn.querySelector('i').classList.remove('fa-times');
            mobileMenuBtn.querySelector('i').classList.add('fa-bars');
        });
    });
    
    // Cart functionality
    const cartIcon = document.querySelector('.cart-icon');
    const cartValue = document.querySelectorAll('.cart-value');
    const cartButton = document.getElementById('cartButton');
    const cartPage = document.getElementById('cartPage');
    const closeCart = document.getElementById('closeCart');
    const overlay = document.getElementById('overlay');
    const cartItems = document.getElementById('cartItems');
    const emptyCart = document.getElementById('emptyCart');
    const cartSummary = document.getElementById('cartSummary');
    const cartTotal = document.getElementById('cartTotal');
    
    let cartCount = 0;
    let cart = [];
    
    // Open cart
    cartButton.addEventListener('click', function(e) {
        e.preventDefault();
        cartPage.classList.add('active');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
    
    // Close cart
    closeCart.addEventListener('click', function() {
        cartPage.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = 'auto';
    });
    
    // Close cart when clicking on overlay
    overlay.addEventListener('click', function() {
        cartPage.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = 'auto';
    });
    
    // Category tab switching
    const categoryTabs = document.querySelectorAll('.category-tab');
    const categoryContents = document.querySelectorAll('.category-content');
    
    categoryTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const category = tab.getAttribute('data-category');
            
            // Update active tab
            categoryTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // Show selected category content
            categoryContents.forEach(content => content.classList.remove('active'));
            document.getElementById(`${category}-content`).classList.add('active');
        });
    });
    
    // Add to cart functionality
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('add-to-cart')) {
            const productId = parseInt(e.target.getAttribute('data-id'));
            const productName = e.target.getAttribute('data-name');
            const productPrice = parseInt(e.target.getAttribute('data-price'));
            const productImage = e.target.getAttribute('data-image');
            
            // Check if product is already in cart
            const existingItem = cart.find(item => item.id === productId);
            
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({
                    id: productId,
                    name: productName,
                    price: productPrice,
                    image: productImage,
                    quantity: 1
                });
            }
            
            cartCount++;
            updateCartCount();
            updateCartDisplay();
            
            // Animation for adding to cart
            const button = e.target;
            const originalText = button.innerHTML;
            button.innerHTML = 'Added! <i class="fas fa-check"></i>';
            button.style.backgroundColor = '#4CAF50';
            
            setTimeout(() => {
                button.innerHTML = originalText;
                button.style.backgroundColor = '';
            }, 1500);
        }
        
        // Handle quantity changes in cart
        if (e.target.classList.contains('quantity-btn')) {
            const itemId = parseInt(e.target.closest('.cart-item').getAttribute('data-id'));
            const isIncrease = e.target.classList.contains('increase');
            const item = cart.find(item => item.id === itemId);
            
            if (item) {
                if (isIncrease) {
                    item.quantity += 1;
                    cartCount++;
                } else {
                    item.quantity -= 1;
                    cartCount--;
                    
                    if (item.quantity === 0) {
                        cart = cart.filter(cartItem => cartItem.id !== itemId);
                    }
                }
                
                updateCartCount();
                updateCartDisplay();
            }
        }
        
        // Handle item removal from cart
        if (e.target.classList.contains('remove-item')) {
            const itemId = parseInt(e.target.closest('.cart-item').getAttribute('data-id'));
            const item = cart.find(item => item.id === itemId);
            
            if (item) {
                cartCount -= item.quantity;
                cart = cart.filter(cartItem => cartItem.id !== itemId);
                
                updateCartCount();
                updateCartDisplay();
            }
        }
    });
    
    function updateCartCount() {
        cartValue.forEach(el => {
            el.textContent = cartCount;
        });
    }
    
    function updateCartDisplay() {
        // Clear cart items
        cartItems.querySelectorAll('.cart-item').forEach(item => item.remove());
        
        if (cart.length === 0) {
            emptyCart.style.display = 'block';
            cartSummary.style.display = 'none';
        } else {
            emptyCart.style.display = 'none';
            cartSummary.style.display = 'block';
            
            let total = 0;
            
            // Add items to cart
            cart.forEach(item => {
                const cartItem = document.createElement('div');
                cartItem.className = 'cart-item';
                cartItem.setAttribute('data-id', item.id);
                
                cartItem.innerHTML = `
                    <div class="cart-item-img">
                        <img src="${item.image}" alt="${item.name}">
                    </div>
                    <div class="cart-item-details">
                        <h3>${item.name}</h3>
                        <p class="cart-item-price">₹ ${item.price}</p>
                        <div class="cart-item-quantity">
                            <button class="quantity-btn decrease">-</button>
                            <span>${item.quantity}</span>
                            <button class="quantity-btn increase">+</button>
                        </div>
                    </div>
                    <button class="remove-item">&times;</button>
                `;
                
                cartItems.appendChild(cartItem);
                total += item.price * item.quantity;
            });
            
            // Update total
            cartTotal.textContent = `₹ ${total}`;
        }
    }
    
    // Newsletter form submission
    const newsletterForm = document.querySelector('.newsletter-form');
    newsletterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const emailInput = this.querySelector('input[type="email"]');
        
        if (emailInput.value) {
            // Here you would typically send the email to your server
            alert('Thank you for subscribing to our newsletter!');
            emailInput.value = '';
        }
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            if (this.getAttribute('href') === '#') return;
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                
                window.scrollTo({
                    top: targetElement.offsetTop - 100,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Contact button functionality - scroll to footer
    document.querySelectorAll('a[href="#"]').forEach(link => {
        if (link.textContent.includes('Contact') || link.innerHTML.includes('Contact')) {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                document.querySelector('footer').scrollIntoView({ 
                    behavior: 'smooth' 
                });
            });
        }
    });
    
    // Mobile cart link functionality
    const mobileCartLink = document.querySelector('.mobile-cart a');
    if (mobileCartLink) {
        mobileCartLink.addEventListener('click', function(e) {
            e.preventDefault();
            cartPage.classList.add('active');
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
            
            // Close mobile menu after clicking cart
            mobileMenu.classList.remove('active');
            mobileMenuBtn.querySelector('i').classList.remove('fa-times');
            mobileMenuBtn.querySelector('i').classList.add('fa-bars');
        });
    }
    
    // Adjust cart value position for mobile
    function adjustCartForMobile() {
        if (window.innerWidth <= 880) {
            const cartValues = document.querySelectorAll('.cart-value');
            cartValues.forEach(value => {
                value.style.position = 'relative';
                value.style.top = '0';
                value.style.right = '0';
                value.style.marginLeft = '5px';
            });
        } else {
            const cartValues = document.querySelectorAll('.cart-value');
            cartValues.forEach(value => {
                value.style.position = 'absolute';
                value.style.top = '-10px';
                value.style.right = '-12px';
                value.style.marginLeft = '0';
            });
        }
    }
    
    // Run on load and resize
    adjustCartForMobile();
    window.addEventListener('resize', adjustCartForMobile);
    
    // Animate elements when they come into view
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.item-card, .offer-card, .testimonial-card');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementPosition < windowHeight - 100) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    };
    
    // Set initial styles for animated elements
    document.querySelectorAll('.item-card, .offer-card, .testimonial-card').forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });
    
    // Run once on page load
    animateOnScroll();
    
    // Then run on scroll
    window.addEventListener('scroll', animateOnScroll);
});

document.addEventListener('DOMContentLoaded', function() {
            // Get elements
            const signinButtons = document.querySelectorAll('.btn, .mobile-menu a.btn');
            const signinPage = document.getElementById('signinPage');
            const closeSignin = document.getElementById('closeSignin');
            const overlay = document.getElementById('overlay');
            const signinForm = document.getElementById('signinForm');
            const signupLink = document.getElementById('signupLink');
            
            // Open signin modal
            signinButtons.forEach(button => {
                if (button.textContent.includes('Sign In')) {
                    button.addEventListener('click', function(e) {
                        e.preventDefault();
                        signinPage.classList.add('active');
                        overlay.classList.add('active');
                        document.body.style.overflow = 'hidden';
                    });
                }
            });
            
            // Close signin modal
            closeSignin.addEventListener('click', function() {
                signinPage.classList.remove('active');
                overlay.classList.remove('active');
                document.body.style.overflow = 'auto';
            });
            
            // Close when clicking on overlay
            overlay.addEventListener('click', function() {
                signinPage.classList.remove('active');
                overlay.classList.remove('active');
                document.body.style.overflow = 'auto';
            });
            
            // Form submission
            signinForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const email = document.getElementById('email').value;
                const password = document.getElementById('password').value;
                
                // Simple validation
                if (!email || !password) {
                    alert('Please fill in all fields');
                    return;
                }
                
                // Email validation
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(email)) {
                    alert('Please enter a valid email address');
                    return;
                }
                
                // In a real application, you would send this data to your server
                console.log('Sign in attempt:', { email, password });
                
                // Simulate successful login
                alert('Successfully signed in!');
                signinPage.classList.remove('active');
                overlay.classList.remove('active');
                document.body.style.overflow = 'auto';
                
                // Clear form
                signinForm.reset();
            });
            
            // Sign up link
            signupLink.addEventListener('click', function(e) {
                e.preventDefault();
                alert('Sign up functionality would go here');
                // You would typically switch to a sign up form or redirect
            });
            
            // Social sign in buttons
            document.querySelectorAll('.social-btn').forEach(button => {
                button.addEventListener('click', function(e) {
                    e.preventDefault();
                    const platform = this.classList.contains('fb-btn') ? 'Facebook' : 'Google';
                    alert(`Sign in with ${platform} would be implemented here`);
                });
            });
        });

// for my grab offer button 
// Add event listeners to all "Grab Offer" buttons
document.querySelectorAll('.offer-btn').forEach(button => {
    button.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Scroll to the categories section
        document.getElementById('categories').scrollIntoView({ 
            behavior: 'smooth' 
        });
        
        // Optional: Trigger a category tab if needed
        // For example, to show the cakes tab:
        const cakesTab = document.querySelector('[data-category="cakes"]');
        if (cakesTab) {
            cakesTab.click();
        }
    });
});
