document.addEventListener("DOMContentLoaded", function() {
    gsap.to(".landing-container", { opacity: 1, duration: 1.5, ease: "power2.inOut", scale: 1.1 });
    gsap.to(".logo", { opacity: 1, scale: 1.2, duration: 1.5, delay: 0.5, ease: "elastic.out" });
    gsap.to(".landing-title", { opacity: 1, y: -10, duration: 1.5, delay: 1, ease: "bounce.out" });
    gsap.to(".landing-subtitle", { opacity: 1, y: -10, duration: 1.5, delay: 1.5, ease: "bounce.out" });

    // Redirect after animation
    setTimeout(() => {
        window.location.href = "home.html";  // Redirect to the main website
    }, 5000);
});
document.addEventListener("DOMContentLoaded", function() {
    gsap.from("h1", { duration: 1, y: -50, opacity: 0, ease: "bounce" });
});

function predictTraffic() {
    document.getElementById("prediction-result").innerText = "Fetching prediction...";
    setTimeout(() => {
        document.getElementById("prediction-result").innerText = "Predicted Traffic Density: 78%";
    }, 2000);
}
document.addEventListener("DOMContentLoaded", function () {
    console.log("🚦 AI Traffic Prediction System Loaded");

    const apiUrl = "http://127.0.0.1:5000/predict"; // Flask API
    const predictionContainer = document.getElementById("ai-predictions");

    if (predictionContainer) {
        fetch(apiUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ hour: new Date().getHours(), day_of_week: new Date().getDay(), weather: 1, road_speed: 50, vehicle_count: 200, accidents: 0, is_weekend: 0, special_event: 0, time_of_day_Afternoon: 1, time_of_day_Night: 0 })
        })
        .then(response => response.json())
        .then(data => { predictionContainer.innerHTML = `<p>🚦 Traffic Congestion Prediction: ${data.prediction}%</p>`; })
        .catch(error => { console.error("Error:", error); predictionContainer.innerHTML = `<p>❌ Failed to fetch predictions.</p>`; });
    }
});
function toggleNavbar() {
    let navLinks = document.querySelector(".nav-links");
    navLinks.classList.toggle("active");
}
// ✅ Fix Dark Mode Functionality




// ✅ Smooth Animations on Scroll
document.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => {
        document.querySelectorAll(".hero, .features, .testimonials, .feedback, .newsletter, .social-media")
            .forEach(el => el.classList.add("active"));
    }, 200);
});


