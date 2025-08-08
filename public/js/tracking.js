// public/js/tracking.js
// Client-side logic for the live order tracking map using Leaflet.js

document.addEventListener('DOMContentLoaded', () => {
    const mapContainer = document.getElementById('map-container');
    if (!mapContainer) return;

    const orderId = mapContainer.dataset.orderId;
    const token = localStorage.getItem('token');
    let map = null;
    let deliveryPartnerMarker = null;

    const initializeMap = (lat, lng) => {
        if (!map) {
            map = L.map('map').setView([lat, lng], 15);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);
            deliveryPartnerMarker = L.marker([lat, lng]).addTo(map)
                .bindPopup('Delivery Partner Location')
                .openPopup();
        }
    };

    const updateMarkerPosition = (lat, lng) => {
        if (map && deliveryPartnerMarker) {
            const newLatLng = new L.LatLng(lat, lng);
            deliveryPartnerMarker.setLatLng(newLatLng);
            map.panTo(newLatLng);
        } else {
            initializeMap(lat, lng);
        }
    };

    const fetchLocation = async () => {
        if (!token) {
            console.error('No auth token found.');
            return;
        }
        try {
            const res = await fetch(`/api/orders/${orderId}/location`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (res.ok) {
                const data = await res.json();
                if (data.current_latitude && data.current_longitude) {
                    updateMarkerPosition(data.current_latitude, data.current_longitude);
                }
            } else {
                console.error('Failed to fetch location:', res.statusText);
            }
        } catch (error) {
            console.error('Error fetching location:', error);
        }
    };

    // Fetch location immediately on page load, then poll every 10 seconds
    fetchLocation();
    setInterval(fetchLocation, 10000);
});
