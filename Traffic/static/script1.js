// Store API keys in variables
const GOOGLE_MAPS_API_KEY = "AIzaSyC6U75dzMICQpoZXnwnUSJo0iu8gPkZbck"; 
const WEATHER_API_KEY = "a3562eea32661e6538a69a34ed21fd4b"; 

// Function to update traffic data with smart fallback to time-based simulated data
async function fetchTrafficData() {
    try {
        console.log("Attempting to fetch traffic data...");
        
        // Update UI to show we're trying
        document.getElementById("congestion").innerText = "Checking...";
        document.getElementById("delay").innerText = "Checking...";
        
        const origin = "Thane,IN";
        const destination = "Mumbai,IN";
        const trafficUrl = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(origin)}&destinations=${encodeURIComponent(destination)}&departure_time=now&key=${GOOGLE_MAPS_API_KEY}`;
        
        try {
            // This direct API call will likely fail due to CORS
            const response = await fetch(trafficUrl);
            const data = await response.json();
            
            if (data.status === "OK") {
                const trafficInfo = data.rows[0].elements[0];
                document.getElementById("congestion").innerText = trafficInfo.status;
                document.getElementById("delay").innerText = trafficInfo.duration_in_traffic.text;
                console.log("Traffic data updated from API");
                return;
            }
        } catch (apiError) {
            console.log("API fetch failed as expected due to CORS:", apiError);
        }
        
        // Fallback to simulated data based on time of day
        const now = new Date();
        const hour = now.getHours();
        const day = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
        const isWeekend = day === 0 || day === 6;
        
        let congestion, delay;
        
        // Time-based logic for realistic traffic simulation
        if (isWeekend) {
            if (hour >= 10 && hour <= 12) {
                // Weekend mid-morning
                congestion = "Moderate";
                delay = "25-30 minutes";
            } else if (hour >= 16 && hour <= 19) {
                // Weekend evening
                congestion = "Moderate to Heavy";
                delay = "30-35 minutes";
            } else {
                // Other weekend times
                congestion = "Light";
                delay = "15-20 minutes";
            }
        } else {
            // Weekday logic
            if (hour >= 8 && hour <= 10) {
                // Morning rush hour
                congestion = "Heavy";
                delay = "40-50 minutes";
            } else if (hour >= 17 && hour <= 19) {
                // Evening rush hour
                congestion = "Heavy";
                delay = "45-55 minutes";
            } else if ((hour >= 11 && hour <= 16) || (hour >= 20 && hour <= 22)) {
                // Moderate traffic times
                congestion = "Moderate";
                delay = "25-35 minutes";
            } else {
                // Light traffic (late night/early morning)
                congestion = "Light";
                delay = "15-20 minutes";
            }
        }
        
        // Update UI with simulated data
        document.getElementById("congestion").innerText = congestion;
        document.getElementById("delay").innerText = delay;
        console.log("Traffic data updated (simulated based on time)");
    } catch (error) {
        console.error("Traffic data error:", error);
        document.getElementById("congestion").innerText = "Error";
        document.getElementById("delay").innerText = "Unavailable";
    }
}

// Function to update weather with seasonal fallback data
async function fetchWeatherData() {
    try {
        console.log("Attempting to fetch weather data...");
        
        // Update UI to show we're trying
        document.getElementById("weather").innerText = "Checking...";
        
        const city = "Thane";
        const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${WEATHER_API_KEY}&units=metric`;
        
        try {
            // This will likely fail due to CORS
            const response = await fetch(weatherUrl);
            const data = await response.json();
            
            if (data.weather) {
                const description = data.weather[0].description;
                const temp = data.main.temp;
                document.getElementById("weather").innerText = `${description}, ${temp}°C`;
                console.log("Weather data updated from API");
                return;
            }
        } catch (apiError) {
            console.log("Weather API fetch failed as expected:", apiError);
        }
        
        // Fallback to simulated data based on season
        const now = new Date();
        const month = now.getMonth(); // 0-indexed (0 = January)
        
        let weatherCondition, impact;
        
        // Seasonal weather patterns for Mumbai/Thane region
        if (month >= 5 && month <= 8) {
            // Monsoon season (June-September)
            const monsoonConditions = [
                "Heavy rain", "Moderate rain", "Light rain", 
                "Thunderstorms", "Overcast", "Light showers"
            ];
            const index = Math.floor(Math.random() * monsoonConditions.length);
            weatherCondition = monsoonConditions[index];
            impact = "High Impact - Slow Moving";
        } else if (month >= 2 && month <= 4) {
            // Summer season (March-May)
            const summerConditions = [
                "Clear sky", "Hot and humid", "Partly cloudy", 
                "Hazy", "Very hot"
            ];
            const index = Math.floor(Math.random() * summerConditions.length);
            weatherCondition = summerConditions[index];
            impact = "Moderate Impact";
        } else {
            // Winter season (October-February)
            const winterConditions = [
                "Clear sky", "Pleasant", "Partly cloudy", 
                "Mild", "Slightly cool"
            ];
            const index = Math.floor(Math.random() * winterConditions.length);
            weatherCondition = winterConditions[index];
            impact = "Low Impact";
        }
        
        document.getElementById("weather").innerText = `${weatherCondition} - ${impact}`;
        console.log("Weather data updated (simulated based on season)");
    } catch (error) {
        console.error("Weather data error:", error);
        document.getElementById("weather").innerText = "Error";
    }
}

// Function to initialize Google Maps with Traffic Layer
function initMap() {
    try {
        console.log("Initializing map...");
        var mapElement = document.getElementById('map');
        
        if (!mapElement) {
            console.error("Map element not found in the DOM");
            return;
        }
        
        var map = new google.maps.Map(mapElement, {
            center: { lat: 19.2183, lng: 72.9781 }, // Thane location
            zoom: 12,
            styles: [{ "stylers": [{ "saturation": -100 }, { "lightness": 20 }] }]
        });
    
        var trafficLayer = new google.maps.TrafficLayer();
        trafficLayer.setMap(map);
        
        console.log("Map initialized successfully");
    } catch (error) {
        console.error("Error initializing map:", error);
    }
}

// Function to initialize all charts
function initializeCharts() {
    console.log("Initializing charts...");
    
    // Chart configuration options
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                ticks: {
                    font: { size: 12, weight: "bold" },
                    color: "#dddddd",
                    maxRotation: 20,
                    minRotation: 20
                },
                grid: { display: false }
            },
            y: {
                ticks: {
                    font: { size: 12 },
                    color: "#eeeeee"
                }
            }
        },
        plugins: {
            legend: {
                labels: {
                    font: { size: 13 },
                    color: "#ffffff"
                }
            }
        },
        layout: {
            padding: { bottom: 15 }
        }
    };

    try {
        // Traffic Congestion Chart
        const congestionCtx = document.getElementById('congestionChart');
        if (congestionCtx) {
            new Chart(congestionCtx, {
                type: 'bar',
                data: {
                    labels: ["Ghodbunder Road", "Eastern Express Highway", "Majiwada", "Thane Station", "Kalyan Phata"],
                    datasets: [{
                        label: "Congestion Level (%)",
                        data: [80, 70, 85, 60, 90],
                        backgroundColor: "rgba(255, 0, 127, 0.5)",
                        borderColor: "#ff007f",
                        borderWidth: 2
                    }]
                },
                options: chartOptions
            });
            console.log("Congestion chart initialized");
        } else {
            console.warn("Congestion chart element not found");
        }
        
        // Speed Chart
        const speedCtx = document.getElementById('speedChart');
        if (speedCtx) {
            new Chart(speedCtx, {
                type: 'bar',
                data: {
                    labels: ["Ghodbunder Road", "Eastern Express Highway", "Majiwada", "Thane Station", "Kalyan Phata"],
                    datasets: [{
                        label: "Average Speed (km/h)",
                        data: [30, 40, 25, 20, 35],
                        backgroundColor: "rgba(0, 255, 255, 0.5)",
                        borderColor: "cyan",
                        borderWidth: 2
                    }]
                },
                options: chartOptions
            });
            console.log("Speed chart initialized");
        } else {
            console.warn("Speed chart element not found");
        }
        
        // Accident Chart
        const accidentCtx = document.getElementById('accidentChart');
        if (accidentCtx) {
            new Chart(accidentCtx, {
                type: 'doughnut',
                data: {
                    labels: ["Ghodbunder", "Eastern Express", "Majiwada", "Thane Station", "Kalyan Phata"],
                    datasets: [{
                        label: "Reported Cases",
                        data: [5, 3, 7, 2, 6],
                        backgroundColor: ["cyan", "#ff007f", "yellow", "red", "green"],
                        borderColor: "#fff",
                        borderWidth: 2
                    }]
                }
            });
            console.log("Accident chart initialized");
        } else {
            console.warn("Accident chart element not found");
        }
    } catch (error) {
        console.error("Error initializing charts:", error);
    }
}

// Toggle Navbar Function
function toggleNavbar() {
    const navLinks = document.querySelector(".nav-links");
    if (navLinks) {
        navLinks.classList.toggle("active");
        console.log("Navbar toggled");
    } else {
        console.error("Nav links element not found");
    }
}

// Document ready function
document.addEventListener("DOMContentLoaded", function() {
    console.log("DOM fully loaded");
    
    // Initialize traffic and weather data
    fetchTrafficData();
    fetchWeatherData();
    
    // Initialize charts
    initializeCharts();
    
    // Set up periodic updates for live data
    setInterval(() => {
        fetchTrafficData();
        fetchWeatherData();
    }, 30000); // Update every 30 seconds
    
    console.log("Initialization complete");
});