document.addEventListener('DOMContentLoaded', function () {
    // Initialize the map with default coordinates and zoom level
    const map = L.map('map').setView([20.5937, 78.9629], 5); // Default to India view

    // Add a tile layer to the map
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Function to handle geocoding and updating the map
    function showLocation(location) {
        const geocoder = L.Control.Geocoder.nominatim();
        console.log('Geocoding location:', location); // Debug location

        geocoder.geocode(location, function(results) {
            if (results.length > 0) {
                const result = results[0];
                const latLng = result.center;
                console.log('Location found:', latLng); // Debug the found location

                // Update the map view
                map.setView(latLng, 13);
                L.marker(latLng).addTo(map)
                    .bindPopup(`<b>${result.name}</b><br>${location}`)
                    .openPopup();
            } else {
                console.error('Location not found:', location);
            }
        });
    }

    // Ensure `window.locationFromServer` is available globally and is used only once
    const locationFromServer = window.locationFromServer;
    console.log('Trimmed Location from server:', locationFromServer); // Debug the location

    if (locationFromServer) {
        showLocation(locationFromServer);
    } else {
        console.error('No location provided.');
    }
});
