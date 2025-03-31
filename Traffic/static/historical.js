// === Global Variables ===
let map;
let directionsService;
let directionsRenderer;
let polylines = [];
let markers = [];

// === Define Thane District Bounds ===
const thaneBounds = new google.maps.LatLngBounds(
    new google.maps.LatLng(18.9, 72.7), // SW corner (Vasai/Virar region)
    new google.maps.LatLng(19.5, 73.5)  // NE corner (Murbad/Kalyan region)
);

// === Route Colors for Different Routes ===
const routeColors = ['#FF0000', '#00FF00', '#0000FF', '#FFA500']; // Red, Green, Blue, Orange

// === Initialize Map and Directions API ===
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 19.2183, lng: 72.9781 }, // Centered at Thane
        zoom: 12,
        restriction: {
            latLngBounds: thaneBounds,
            strictBounds: false,
        },
    });

    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer({ map: map });

    // Initialize Autocomplete for Input Fields
    initAutocomplete();
}

// === Initialize Autocomplete with Thane Boundaries ===
function initAutocomplete() {
    const options = {
        bounds: thaneBounds,
        componentRestrictions: { country: 'IN' },
        types: ['geocode'],
    };

    const startInput = document.getElementById('startLocation');
    const endInput = document.getElementById('endLocation');

    new google.maps.places.Autocomplete(startInput, options);
    new google.maps.places.Autocomplete(endInput, options);
}

// === Find Best Route Button Click ===
document.getElementById('findRoute').addEventListener('click', function () {
    const start = document.getElementById('startLocation').value;
    const end = document.getElementById('endLocation').value;

    if (start === '' || end === '') {
        alert('Please enter both start and destination locations.');
        return;
    }

    calculateRoute(start, end);
});

// === Use My Location Button Click ===
document.getElementById('getLocation').addEventListener('click', function () {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            const latLng = new google.maps.LatLng(lat, lng);

            if (thaneBounds.contains(latLng)) {
                const geocoder = new google.maps.Geocoder();
                geocoder.geocode(
                    { location: latLng, region: 'IN', bounds: thaneBounds },
                    function (results, status) {
                        if (status === 'OK' && results[0]) {
                            document.getElementById('startLocation').value = results[0].formatted_address;
                        } else {
                            alert('Unable to determine your location within Thane.');
                        }
                    }
                );
            } else {
                alert('Your location is outside Thane. Please select a valid starting point within Thane.');
            }
        });
    } else {
        alert('Geolocation is not supported by your browser.');
    }
});

// === Calculate and Display Routes ===
function calculateRoute(start, end) {
    document.getElementById('loading').style.display = 'block';

    const request = {
        origin: start,
        destination: end,
        travelMode: 'DRIVING',
        provideRouteAlternatives: true,
        region: 'IN',
    };

    directionsService.route(request, function (result, status) {
        document.getElementById('loading').style.display = 'none';

        if (status === 'OK') {
            clearPreviousRoutes();
            const routes = result.routes;

            // Render primary route
            directionsRenderer.setDirections(result);
            directionsRenderer.setRouteIndex(0);

            // Draw all alternative routes manually
            drawAlternativeRoutes(routes);
            displayRouteInfo(routes);
            populateRouteTable(routes);

            // Mark Start and End Locations with A & B
            addMarkers(routes[0].legs[0].start_location, routes[0].legs[0].end_location);
        } else {
            alert('Unable to find routes. Please enter valid locations within Thane.');
        }
    });
}

// === Draw Alternative Routes Using Polylines ===
function drawAlternativeRoutes(routes) {
    routes.forEach((route, index) => {
        const path = route.overview_path;
        const polyline = new google.maps.Polyline({
            path: path,
            strokeColor: routeColors[index % routeColors.length],
            strokeOpacity: 0.8,
            strokeWeight: index === 0 ? 6 : 4, // Make the primary route thicker
            map: map,
        });

        polyline.setMap(map);
        polylines.push(polyline);

        // Add route label to show Route Number
        addRouteLabel(path[Math.floor(path.length / 2)], `Route ${index + 1}`);

        // Add route click event for highlight
        google.maps.event.addListener(polyline, 'click', function () {
            directionsRenderer.setRouteIndex(index);
        });
    });
}

// === Clear Previous Routes and Markers ===
function clearPreviousRoutes() {
    directionsRenderer.setMap(null);
    polylines.forEach(polyline => polyline.setMap(null));
    polylines = [];

    markers.forEach(marker => marker.setMap(null));
    markers = [];
}

// === Add Markers for Start (A) and End (B) Locations ===
function addMarkers(startLocation, endLocation) {
    const markerA = new google.maps.Marker({
        position: startLocation,
        map: map,
        label: 'A',
        title: 'Start Location',
    });

    const markerB = new google.maps.Marker({
        position: endLocation,
        map: map,
        label: 'B',
        title: 'Destination',
    });

    markers.push(markerA, markerB);
}

// === Add Route Label on Map ===
function addRouteLabel(position, label) {
    const markerLabel = new google.maps.Marker({
        position: position,
        map: map,
        icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 0, // Hide the marker itself
        },
        label: {
            text: label,
            color: '#000000',
            fontWeight: 'bold',
            fontSize: '12px',
        },
    });

    markers.push(markerLabel);
}

// === Display Best Route Info with Lowest Congestion ===
function displayRouteInfo(routes) {
    let bestRoute = routes[0];
    let minCongestion = getCongestionLevel(bestRoute);

    routes.forEach((route) => {
        const congestionLevel = getCongestionLevel(route);
        if (congestionLevel < minCongestion) {
            bestRoute = route;
            minCongestion = congestionLevel;
        }
    });

    const legs = bestRoute.legs[0];

    document.getElementById('bestRoute').textContent = bestRoute.summary || 'Unknown';
    document.getElementById('startPoint').textContent = legs.start_address;
    document.getElementById('endPoint').textContent = legs.end_address;
    document.getElementById('distance').textContent = legs.distance.text;
    document.getElementById('duration').textContent = legs.duration.text;
    document.getElementById('congestion').textContent = getTrafficLevel(minCongestion);
}

// === Populate Route Comparison Table ===
function populateRouteTable(routes) {
    const tableBody = document.getElementById('routeTableBody');
    tableBody.innerHTML = ''; // Clear previous results

    routes.forEach((route, index) => {
        const row = document.createElement('tr');
        const legs = route.legs[0];

        row.innerHTML = `
            <td>Route ${index + 1} (${route.summary})</td>
            <td>${legs.distance.text}</td>
            <td>${getTrafficLevel(getCongestionLevel(route))}</td>
            <td>${legs.duration.text}</td>
        `;

        tableBody.appendChild(row);
    });
}

// === Simulate Traffic Level for Routes ===
function getTrafficLevel(level) {
    const trafficLevels = ['Low', 'Moderate', 'Heavy'];
    return trafficLevels[level];
}

// === Simulate Congestion Level (Random for Demo) ===
function getCongestionLevel(route) {
    return Math.floor(Math.random() * 3); // Random 0, 1, or 2 for Low, Moderate, High
}

// === Initialize Map after Loading ===
window.onload = initMap;
