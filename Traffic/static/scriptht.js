document.addEventListener("DOMContentLoaded", function () {
    const steps = document.querySelectorAll(".step");

    // 🚀 Add "visible" class when scrolled into view
    function checkVisibility() {
        steps.forEach((step) => {
            const position = step.getBoundingClientRect().top;
            if (position < window.innerHeight * 0.85) {
                step.style.opacity = "1";
                step.style.transform = "translateY(0)";
            }
        });
    }

    // Listen for scrolling
    window.addEventListener("scroll", checkVisibility);
    checkVisibility(); // Check on page load
});
