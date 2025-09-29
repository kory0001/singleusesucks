const cursor = document.querySelector(".custom-cursor");

document.addEventListener("mousemove", (e) => {
  cursor.style.left = e.clientX + "px";
  cursor.style.top = e.clientY + "px";
});

let startTime = null;
let animationFrame = null;
let isVisible = false;
const duration = 60000;

function updateProgress() {
  if (!isVisible) return;

  const elapsed = Date.now() - startTime;
  const progress = ((elapsed % duration) / duration) * 100;

  document.getElementById("progressFill").style.width = progress + "%";

  // Loop forever
  animationFrame = requestAnimationFrame(updateProgress);
}

// Intersection Observer to detect when element is visible
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !isVisible) {
        isVisible = true;
        startTime = Date.now();
        updateProgress();
      } else if (!entry.isIntersecting && isVisible) {
        isVisible = false;
        if (animationFrame) {
          cancelAnimationFrame(animationFrame);
        }
      }
    });
  },
  { threshold: 0.1 }
);

// Observe the container
observer.observe(document.querySelector(".one-min__container"));
