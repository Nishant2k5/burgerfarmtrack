// Burger Farm Delivery Tracking System
// Uber-style real-time delivery tracking with animated map

// Configuration
const CONFIG = {
    // Default center (Bangalore, India)
    defaultCenter: [12.9716, 77.5946],
    defaultZoom: 14,
    updateInterval: 3000, // Update every 3 seconds
    animationDuration: 3000, // 3 seconds for smooth animation
};

// Sample locations
const LOCATIONS = {
    restaurant: [12.9716, 77.5946], // Restaurant location (MG Road, Bangalore)
    customer: [12.9816, 77.6046], // Customer location (Brigade Road, Bangalore)
    // Initial delivery person location (between restaurant and customer)
    deliveryPerson: [12.9750, 77.5980]
};

// Global variables
let map;
let deliveryMarker;
let restaurantMarker;
let customerMarker;
let routeLine;
let currentPosition = [...LOCATIONS.deliveryPerson];
let targetPosition = [...LOCATIONS.customer];
let animationFrame;
let progressPercentage = 45; // Starting at 45% completion

// Initialize map when page loads
document.addEventListener('DOMContentLoaded', function() {
    initMap();
    setupEventListeners();
    startTracking();
});

// Initialize Leaflet map
function initMap() {
    try {
        // Create map centered on delivery area
        map = L.map('map').setView(CONFIG.defaultCenter, CONFIG.defaultZoom);

        // Add OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 19,
        }).addTo(map);

        // Create custom icons
        const restaurantIcon = L.divIcon({
            html: '<div class="restaurant-icon">🏪</div>',
            className: 'delivery-marker',
            iconSize: [40, 40],
            iconAnchor: [20, 20]
        });

        const customerIcon = L.divIcon({
            html: '<div class="customer-icon">📍</div>',
            className: 'delivery-marker',
            iconSize: [40, 40],
            iconAnchor: [20, 20]
        });

        const deliveryIcon = L.divIcon({
            html: '<div class="delivery-icon">🏍️</div>',
            className: 'delivery-marker',
            iconSize: [40, 40],
            iconAnchor: [20, 20]
        });

        // Add restaurant marker
        restaurantMarker = L.marker(LOCATIONS.restaurant, { icon: restaurantIcon })
            .addTo(map)
            .bindPopup('<div class="font-semibold">🏪 Burger Farm</div><div class="text-sm">Your order is on the way!</div>');

        // Add customer marker
        customerMarker = L.marker(LOCATIONS.customer, { icon: customerIcon })
            .addTo(map)
            .bindPopup('<div class="font-semibold">📍 Delivery Address</div><div class="text-sm">123, MG Road, Brigade Road</div>');

        // Add delivery person marker
        deliveryMarker = L.marker(currentPosition, { icon: deliveryIcon })
            .addTo(map)
            .bindPopup('<div class="font-semibold">🏍️ Raj Kumar</div><div class="text-sm">Your delivery partner</div>');

        // Draw route line
        drawRoute();

        // Fit map to show all markers
        const bounds = L.latLngBounds([
            LOCATIONS.restaurant,
            LOCATIONS.customer,
            currentPosition
        ]);
        map.fitBounds(bounds, { padding: [50, 50] });

        console.log('Map initialized successfully');
    } catch (error) {
        console.error('Error initializing map:', error);
        showNotification('Error loading map. Please refresh the page.', 'error');
    }
}

// Draw route line between points
function drawRoute() {
    if (routeLine) {
        map.removeLayer(routeLine);
    }

    // Create polyline showing the route
    const routePoints = [
        LOCATIONS.restaurant,
        currentPosition,
        LOCATIONS.customer
    ];

    routeLine = L.polyline(routePoints, {
        color: '#3b82f6',
        weight: 4,
        opacity: 0.7,
        dashArray: '10, 10',
        lineJoin: 'round'
    }).addTo(map);
}

// Animate delivery person movement
function animateDeliveryPerson(targetLat, targetLng) {
    const startLat = currentPosition[0];
    const startLng = currentPosition[1];
    const startTime = Date.now();

    function animate() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / CONFIG.animationDuration, 1);

        // Easing function for smooth animation
        const easeProgress = 1 - Math.pow(1 - progress, 3);

        // Calculate new position
        const newLat = startLat + (targetLat - startLat) * easeProgress;
        const newLng = startLng + (targetLng - startLng) * easeProgress;

        currentPosition = [newLat, newLng];

        // Update marker position
        if (deliveryMarker) {
            deliveryMarker.setLatLng(currentPosition);
            drawRoute();
        }

        // Continue animation if not complete
        if (progress < 1) {
            animationFrame = requestAnimationFrame(animate);
        } else {
            // Update progress and check if delivered
            updateDeliveryProgress();
        }
    }

    animate();
}

// Simulate delivery person movement towards customer
function updateDeliveryLocation() {
    // Calculate direction towards customer
    const latDiff = targetPosition[0] - currentPosition[0];
    const lngDiff = targetPosition[1] - currentPosition[1];

    // Calculate distance remaining
    const distance = Math.sqrt(latDiff * latDiff + lngDiff * lngDiff);

    // If very close to destination, mark as delivered
    if (distance < 0.001) {
        completeDelivery();
        return;
    }

    // Move 15% of the remaining distance each update
    const moveRatio = 0.15;
    const newLat = currentPosition[0] + (latDiff * moveRatio);
    const newLng = currentPosition[1] + (lngDiff * moveRatio);

    // Animate to new position
    animateDeliveryPerson(newLat, newLng);

    // Update distance and ETA display
    updateDistanceAndETA(distance);
}

// Calculate and update distance and ETA
function updateDistanceAndETA(distance) {
    // Approximate distance in km (rough conversion for lat/lng)
    const distanceKm = (distance * 111).toFixed(1); // 1 degree ≈ 111 km

    // Calculate ETA (assuming 20 km/h average speed)
    const etaMinutes = Math.max(1, Math.round((distanceKm / 20) * 60));

    // Update UI
    document.getElementById('distance').textContent = `${distanceKm} km`;
    document.getElementById('eta').textContent = `${etaMinutes} min`;

    // Update progress percentage
    const totalDistance = Math.sqrt(
        Math.pow(LOCATIONS.customer[0] - LOCATIONS.restaurant[0], 2) +
        Math.pow(LOCATIONS.customer[1] - LOCATIONS.restaurant[1], 2)
    );
    const traveledDistance = totalDistance - distance;
    progressPercentage = Math.min(99, Math.round((traveledDistance / totalDistance) * 100));
}

// Update delivery progress status
function updateDeliveryProgress() {
    const statusElement = document.getElementById('orderStatus');

    if (progressPercentage >= 95) {
        statusElement.textContent = 'Arriving Soon';
        statusElement.className = 'bg-orange-100 text-orange-800 px-4 py-2 rounded-full text-sm font-semibold';
    } else if (progressPercentage >= 70) {
        statusElement.textContent = 'Nearby';
        statusElement.className = 'bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full text-sm font-semibold';
    } else {
        statusElement.textContent = 'In Transit';
        statusElement.className = 'bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-semibold';
    }
}

// Complete delivery
function completeDelivery() {
    const statusElement = document.getElementById('orderStatus');
    statusElement.textContent = 'Delivered';
    statusElement.className = 'bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-semibold';

    document.getElementById('distance').textContent = '0 km';
    document.getElementById('eta').textContent = '0 min';

    // Update progress UI to show delivery complete
    updateProgressSteps(true);

    // Show notification
    showNotification('Your order has been delivered! Enjoy your meal! 🍔', 'success');

    // Stop tracking
    stopTracking();
}

// Update progress steps visual
function updateProgressSteps(delivered = false) {
    // This function can be enhanced to update the progress steps UI
    // For now, it's a placeholder for future enhancements
    if (delivered) {
        console.log('Delivery completed!');
    }
}

// Show notification
function showNotification(message, type = 'info') {
    // Create toast notification
    const toast = document.createElement('div');
    toast.className = 'toast';

    const icon = type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️';
    toast.innerHTML = `
        <span class="text-2xl">${icon}</span>
        <span class="font-semibold">${message}</span>
    `;

    document.body.appendChild(toast);

    // Remove after 5 seconds
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 5000);
}

// Start tracking updates
let trackingInterval;
function startTracking() {
    // Update location every few seconds
    trackingInterval = setInterval(() => {
        updateDeliveryLocation();
    }, CONFIG.updateInterval);

    console.log('Tracking started');
}

// Stop tracking updates
function stopTracking() {
    if (trackingInterval) {
        clearInterval(trackingInterval);
        console.log('Tracking stopped');
    }
    if (animationFrame) {
        cancelAnimationFrame(animationFrame);
    }
}

// Setup event listeners
function setupEventListeners() {
    // Refresh button
    const refreshBtn = document.getElementById('refreshBtn');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', function() {
            // Re-center map on delivery person
            map.setView(currentPosition, CONFIG.defaultZoom);
            showNotification('Location refreshed', 'info');
        });
    }

    // Call driver button
    const callButtons = document.querySelectorAll('button');
    callButtons.forEach(button => {
        if (button.textContent.includes('Call Driver')) {
            button.addEventListener('click', function() {
                showNotification('Calling Raj Kumar... 📞', 'info');
                // In a real app, this would initiate a phone call
            });
        }
        if (button.textContent.includes('Message')) {
            button.addEventListener('click', function() {
                showNotification('Opening chat with Raj Kumar... 💬', 'info');
                // In a real app, this would open a chat interface
            });
        }
    });

    // Handle page visibility change (pause tracking when tab is hidden)
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            console.log('Page hidden, tracking continues in background');
        } else {
            console.log('Page visible, tracking active');
            // Refresh location when page becomes visible
            map.invalidateSize();
        }
    });
}

// Handle window resize
window.addEventListener('resize', function() {
    if (map) {
        map.invalidateSize();
    }
});

// Cleanup on page unload
window.addEventListener('beforeunload', function() {
    stopTracking();
});

// Add CSS animation for toast slide out
const style = document.createElement('style');
style.textContent = `
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

// Export functions for testing (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initMap,
        updateDeliveryLocation,
        startTracking,
        stopTracking
    };
}

console.log('🍔 Burger Farm Delivery Tracking initialized!');
