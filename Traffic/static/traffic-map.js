function initMap() {
    var map = new google.maps.Map(document.getElementById("traffic-map"), {
        zoom: 12,
        center: { lat: 19.2183, lng: 72.9781 }, // Thane location
        mapTypeId: "roadmap",
    });

    var trafficLayer = new google.maps.TrafficLayer();
    trafficLayer.setMap(map);
}

// Load Google Maps with API Key
function loadGoogleMapsScript() {
    var script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyD-EXAMPLEKEY1234567890ABCDEFghijkl
&callback=initMap`;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
}

window.onload = loadGoogleMapsScript;
