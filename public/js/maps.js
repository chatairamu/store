// public/js/maps.js
// Client-side logic for Google Maps integration.

let map;
let marker;

function initMap() {
    const latInput = document.getElementById('latitude');
    const lngInput = document.getElementById('longitude');

    // Default location (e.g., center of a city)
    const defaultLocation = { lat: 17.9689, lng: 79.5941 }; // Warangal, India

    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 12,
        center: defaultLocation,
    });

    marker = new google.maps.Marker({
        position: defaultLocation,
        map: map,
        draggable: true,
        title: "Drag me to your location!"
    });

    // Set initial lat/lng values
    latInput.value = defaultLocation.lat;
    lngInput.value = defaultLocation.lng;

    // Add listener for when the marker is dragged
    google.maps.event.addListener(marker, 'dragend', function(event) {
        const lat = event.latLng.lat();
        const lng = event.latLng.lng();

        // Update the hidden form fields
        latInput.value = lat;
        lngInput.value = lng;

        console.log(`New position: ${lat}, ${lng}`);
    });
}

// Note: The `initMap` function is called by the Google Maps script tag's callback parameter.
// The address form submission logic would also go here, but is omitted for this step.
// For example, listening to the form's submit event, grabbing all values, and POSTing to an /api/addresses endpoint.
