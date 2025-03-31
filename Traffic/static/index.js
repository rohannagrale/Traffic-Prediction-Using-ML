document.addEventListener("DOMContentLoaded", function() {
    gsap.to(".landing-container", { opacity: 1, duration: 1.5, ease: "power2.inOut", scale: 1.1 });
    gsap.to(".logo", { opacity: 1, scale: 1.2, duration: 1.5, delay: 0.5, ease: "elastic.out" });
    gsap.to(".landing-title", { opacity: 1, y: -10, duration: 1.5, delay: 1, ease: "bounce.out" });
    gsap.to(".landing-subtitle", { opacity: 1, y: -10, duration: 1.5, delay: 1.5, ease: "bounce.out" });

    // Redirect after animation
  
});
