// Screen Management System
function showScreen(screenId) {
    console.log('Switching to:', screenId); // For debugging
    
    // Hide all screens
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    
    // Show the target screen
    document.getElementById(screenId).classList.add('active');
}

// Test function - we'll remove this later
function testScreens() {
    console.log('Testing screen system...');
    showScreen('cafe-list-screen');
}

const mockCafes = [
    {
        id:101,
        name:"Moringa Cafe",
        address:"Abc complex, duston street, 24",
        rating:4.5,
        distance:2,
        image: "https://www.thespruceeats.com/thmb/w8H_at2_KzYmmumbJq4LndAgaD0=/3264x2005/filters:fill(auto,1)/coffee-croissant-twenty20_698e38b4-beeb-432b-81a2-cc65e08dc77c-58e5b0e65f9b58ef7e06165e.jpg",
        phone:"11223344"
    },
    {
        id:102,
        name:"Cafe Mallas",
        address:"def complex, Buston street, 25",
        rating:4.2,
        distance:4,
        image: "https://images.squarespace-cdn.com/content/v1/5e484ab628c78d6f7e602d73/c27a6a2a-2c3f-41c7-aa0e-ef627ca90561/famous-paris-cafes-min.jpeg",
        phone:"10229344"
    }

];


// Function to display cafes
function displayCafes() {
    const cafeListScreen = document.getElementById('cafe-list-screen');
    
    // Create the HTML for cafe list
    let cafeHTML = `
        <h2>☕ Nearby Cafes</h2>
        <button onclick="showScreen('Home-screen')" style="margin-bottom: 20px;">← Back to Home</button>
        <div class="cafe-container">
    `;
    
    // Loop through each cafe and create a card
    mockCafes.forEach(cafe => {
        cafeHTML += `
            <div class="cafe-card" onclick="showCafeDetails(${cafe.id})">
                <img src="${cafe.image}" alt="${cafe.name}" class="cafe-image">
                <div class="cafe-info">
                    <h3>${cafe.name}</h3>
                    <p class="address">📍 ${cafe.address}</p>
                    <div class="cafe-details">
                        <span class="rating">⭐ ${cafe.rating}</span>
                        <span class="distance">${cafe.distance} km away</span>
                    </div>
                    <p class="speciality">${cafe.speciality}</p>
                </div>
            </div>
        `;
    });
    
    cafeHTML += `</div>`;
    
    // Put the HTML into the screen
    cafeListScreen.innerHTML = cafeHTML;
}

// Function to show specific cafe details
function showCafeDetails(cafeId) {
    const cafe = mockCafes.find(c => c.id === cafeId);
    const cafeDetailScreen = document.getElementById('cafe-detail-screen');
    
    cafeDetailScreen.innerHTML = `
        <button onclick="showScreen('cafe-list-screen')">← Back to List</button>
        <div class="cafe-detail">
            <img src="${cafe.image}" alt="${cafe.name}" class="detail-image">
            <h2>${cafe.name}</h2>
            <p class="address">📍 ${cafe.address}</p>
            <p class="rating">⭐ Rating: ${cafe.rating}/5</p>
            <p class="distance">📏 Distance: ${cafe.distance} km away</p>
            <p class="phone">📞 Phone: ${cafe.phone}</p>
            <div class="action-buttons">
                <button onclick="showBookingModal(${cafe.id})">📅 Book Table</button>
                <button onclick="showDeliveryModal(${cafe.id})">🚚 Order Delivery</button>
            </div>
        </div>
    `;
    
    showScreen('cafe-detail-screen');
}

//lOCATION DETECTION

let userLocation = null;

function getCurrentLocation() {
    const locationBtn = document.querySelector('.location-btn');
    const statusDiv = document.querySelector('.location-status');
    
    // Create status div if it doesn't exist
    if (!statusDiv) {
        const status = document.createElement('div');
        status.className = 'location-status';
        locationBtn.parentNode.appendChild(status);
    }
    
    const status = document.querySelector('.location-status');
    status.style.display = 'block';
    status.innerHTML = '📍 Getting your location...';
    status.className = 'location-status loading';
    
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            // Success callback
            (position) => {
                userLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                
                status.className = 'location-status success';
                status.innerHTML = '✅ Location found! Finding nearby cafes...';
                
                // Update cafe distances based on real location
                updateCafeDistances();
                
                // Show cafes after a short delay
                setTimeout(() => {
                    displayCafes();
                    showScreen('cafe-list-screen');
                }, 1500);
            },
            // Error callback
            (error) => {
                status.className = 'location-status error';
                
                switch(error.code) {
                    case error.PERMISSION_DENIED:
                        status.innerHTML = '❌ Location access denied. Showing default cafes.';
                        break;
                    case error.POSITION_UNAVAILABLE:
                        status.innerHTML = '❌ Location unavailable. Showing default cafes.';
                        break;
                    case error.TIMEOUT:
                        status.innerHTML = '❌ Location timeout. Showing default cafes.';
                        break;
                }
                
                // Show default cafes anyway
                setTimeout(() => {
                    displayCafes();
                    showScreen('cafe-list-screen');
                }, 2000);
            },
            // Options
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 60000
            }
        );
    } else {
        status.className = 'location-status error';
        status.innerHTML = '❌ Geolocation not supported. Showing default cafes.';
        
        setTimeout(() => {
            displayCafes();
            showScreen('cafe-list-screen');
        }, 2000);
    }
}

// Calculate distance between two points (simplified)
function calculateDistance(lat1, lng1, lat2, lng2) {
    // Simple distance calculation (not perfectly accurate but good for demo)
    const dx = lat1 - lat2;
    const dy = lng1 - lng2;
    return Math.sqrt(dx * dx + dy * dy) * 111; // Rough km conversion
}

// Update cafe distances based on user location
function updateCafeDistances() {
    if (!userLocation) return;
    
    mockCafes.forEach(cafe => {
        // Mock cafe coordinates (you'd normally get these from your data)
        const cafeCoords = {
            lat: 19.0330 + (Math.random() - 0.5) * 0.05,  // Navi Mumbai latitude ± ~2.5km
            lng: 73.0297 + (Math.random() - 0.5) * 0.05   // Navi Mumbai longitude ± ~2.5km
        };
        
        const distance = calculateDistance(
            userLocation.lat, userLocation.lng,
            cafeCoords.lat, cafeCoords.lng
        );
        
        cafe.distance = Math.round(distance * 10) / 10; // Round to 1 decimal
    });
    
    // Sort cafes by distance
    mockCafes.sort((a, b) => a.distance - b.distance);
}

// Modal Management
let currentCafe = null;

// Show Booking Modal
function showBookingModal(cafeId) {
    currentCafe = mockCafes.find(cafe => cafe.id === cafeId);
    
    const modal = document.getElementById('booking-modal');
    const modalContent = `
        <div class="modal-content">
            <span class="close" onclick="closeModal()">&times;</span>
            <h2>📅 Book a Table at ${currentCafe.name}</h2>
            <div class="cafe-info-small">
                <p>📍 ${currentCafe.address}</p>
                <p>📞 ${currentCafe.phone}</p>
            </div>
            <form id="bookingForm">
                <div class="form-group">
                    <label for="customerName">Your Name:</label>
                    <input type="text" id="customerName" required>
                </div>
                <div class="form-group">
                    <label for="customerPhone">Phone Number:</label>
                    <input type="tel" id="customerPhone" required placeholder="+91 98765 43210">
                </div>
                <div class="form-group">
                    <label for="bookingDate">Date:</label>
                    <input type="date" id="bookingDate" required>
                </div>
                <div class="form-group">
                    <label for="bookingTime">Time:</label>
                    <input type="time" id="bookingTime" required>
                </div>
                <div class="form-group">
                    <label for="partySize">Party Size:</label>
                    <select id="partySize" required>
                        <option value="">Select number of people</option>
                        <option value="1">1 person</option>
                        <option value="2">2 people</option>
                        <option value="3">3 people</option>
                        <option value="4">4 people</option>
                        <option value="5">5 people</option>
                        <option value="6+">6+ people</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="specialRequests">Special Requests (Optional):</label>
                    <textarea id="specialRequests" rows="3" placeholder="Birthday celebration, wheelchair access, etc."></textarea>
                </div>
                <button type="submit" class="submit-btn">Confirm Booking</button>
            </form>
        </div>
    `;
    
    modal.innerHTML = modalContent;
    modal.style.display = 'block';
    
    // Set minimum date to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('bookingDate').min = today;
    
    // Handle form submission
    document.getElementById('bookingForm').addEventListener('submit', handleBookingSubmission);
}

// Show Delivery Modal  
function showDeliveryModal(cafeId) {
    currentCafe = mockCafes.find(cafe => cafe.id === cafeId);
    
    const modal = document.getElementById('delivery-modal');
    const modalContent = `
        <div class="modal-content">
            <span class="close" onclick="closeModal()">&times;</span>
            <h2>🚚 Order from ${currentCafe.name}</h2>
            <div class="cafe-info-small">
                <p>📍 ${currentCafe.address}</p>
                <p>🕒 Delivery time: 30-45 mins</p>
            </div>
            <form id="deliveryForm">
                <div class="form-group">
                    <label for="deliveryName">Your Name:</label>
                    <input type="text" id="deliveryName" required>
                </div>
                <div class="form-group">
                    <label for="deliveryPhone">Phone Number:</label>
                    <input type="tel" id="deliveryPhone" required placeholder="+91 98765 43210">
                </div>
                <div class="form-group">
                    <label for="deliveryAddress">Delivery Address:</label>
                    <textarea id="deliveryAddress" rows="3" required placeholder="Full address with landmark"></textarea>
                </div>
                <div class="form-group">
                    <label for="orderItems">Select Items:</label>
                    <div class="menu-items">
                        <label class="menu-item">
                            <input type="checkbox" name="items" value="Cappuccino - ₹120"> 
                            Cappuccino - ₹120
                        </label>
                        <label class="menu-item">
                            <input type="checkbox" name="items" value="Sandwich - ₹180">
                            Club Sandwich - ₹180
                        </label>
                        <label class="menu-item">
                            <input type="checkbox" name="items" value="Pasta - ₹250">
                            Pasta - ₹250
                        </label>
                        <label class="menu-item">
                            <input type="checkbox" name="items" value="Cake Slice - ₹150">
                            Cake Slice - ₹150
                        </label>
                    </div>
                </div>
                <div class="form-group">
                    <label for="paymentMethod">Payment Method:</label>
                    <select id="paymentMethod" required>
                        <option value="">Select payment method</option>
                        <option value="cash">Cash on Delivery</option>
                        <option value="upi">UPI</option>
                        <option value="card">Credit/Debit Card</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="orderNotes">Special Instructions (Optional):</label>
                    <textarea id="orderNotes" rows="2" placeholder="Extra spicy, no onions, etc."></textarea>
                </div>
                <button type="submit" class="submit-btn">Place Order</button>
            </form>
        </div>
    `;
    
    modal.innerHTML = modalContent;
    modal.style.display = 'block';
    
    // Handle form submission
    document.getElementById('deliveryForm').addEventListener('submit', handleDeliverySubmission);
}

// Close Modal
function closeModal() {
    document.getElementById('booking-modal').style.display = 'none';
    document.getElementById('delivery-modal').style.display = 'none';
    currentCafe = null;
}

// Handle Booking Form Submission
function handleBookingSubmission(e) {
    e.preventDefault();
    
    const bookingData = {
        cafe: currentCafe.name,
        name: document.getElementById('customerName').value,
        phone: document.getElementById('customerPhone').value,
        date: document.getElementById('bookingDate').value,
        time: document.getElementById('bookingTime').value,
        partySize: document.getElementById('partySize').value,
        requests: document.getElementById('specialRequests').value
    };
    
    // Show success message
    alert(`🎉 Booking Confirmed!
    
Cafe: ${bookingData.cafe}
Name: ${bookingData.name}
Date: ${bookingData.date}
Time: ${bookingData.time}
Party Size: ${bookingData.partySize}

You'll receive a confirmation call at ${bookingData.phone} shortly!`);
    
    closeModal();
}

// Handle Delivery Form Submission
function handleDeliverySubmission(e) {
    e.preventDefault();
    
    // Get selected items
    const selectedItems = [];
    const checkboxes = document.querySelectorAll('input[name="items"]:checked');
    checkboxes.forEach(checkbox => {
        selectedItems.push(checkbox.value);
    });
    
    if (selectedItems.length === 0) {
        alert('Please select at least one item to order!');
        return;
    }
    
    const orderData = {
        cafe: currentCafe.name,
        name: document.getElementById('deliveryName').value,
        phone: document.getElementById('deliveryPhone').value,
        address: document.getElementById('deliveryAddress').value,
        items: selectedItems,
        payment: document.getElementById('paymentMethod').value,
        notes: document.getElementById('orderNotes').value
    };
    
    // Calculate total (simple calculation)
    let total = 0;
    selectedItems.forEach(item => {
        const price = parseInt(item.match(/₹(\d+)/)[1]);
        total += price;
    });
    
    // Show success message
    alert(`🛵 Order Placed Successfully!
    
Cafe: ${orderData.cafe}
Items: ${selectedItems.join(', ')}
Total: ₹${total}
Delivery Address: ${orderData.address}
Payment: ${orderData.payment}

Estimated delivery: 30-45 minutes
You'll receive updates at ${orderData.phone}!`);
    
    closeModal();
}

// Close modal when clicking outside
window.addEventListener('click', function(event) {
    const bookingModal = document.getElementById('booking-modal');
    const deliveryModal = document.getElementById('delivery-modal');
    
    if (event.target === bookingModal) {
        closeModal();
    }
    if (event.target === deliveryModal) {
        closeModal();
    }
});