// Add these variables at the top
let startTime = Date.now();
let animationFrame = null;
let isVisible = false;
const duration = 60000; // 60 seconds in milliseconds

// Intersection Observer to start/stop animation
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        isVisible = true;
        startTime = Date.now(); // Reset start time when visible
        updateProgress();
      } else {
        isVisible = false;
        if (animationFrame) {
          cancelAnimationFrame(animationFrame);
        }
      }
    });
  },
  { threshold: 0.1 }
);

// Start observing the progress section
const progressSection = document.querySelector(".one-min__container"); // or whatever selector
if (progressSection) {
  observer.observe(progressSection);
}

function updateProgress() {
  if (!isVisible) return;

  const elapsed = Date.now() - startTime;
  const progress = ((elapsed % duration) / duration) * 100;

  const progressFill = document.getElementById("progressFill");
  if (progressFill) {
    progressFill.style.width = progress + "%";
  }

  // Loop forever
  animationFrame = requestAnimationFrame(updateProgress);
}
// Recycle game functionality
const bottles = document.querySelectorAll(".recycle-game .bottle");
const bin = document.querySelector(".recycle-game .bin");
const grid = document.querySelector(".recycle-game__grid");
const thankyou = document.querySelector(".recycle-game .thankyou");
let count = 0;

// Make bottles draggable
bottles.forEach((bottle) => {
  bottle.addEventListener("dragstart", (e) => {
    e.dataTransfer.setData("id", bottle.id);
    // Hide the original bottle during drag
    setTimeout(() => {
      e.target.style.opacity = "0";
    }, 0);
  });

  bottle.addEventListener("dragend", (e) => {
    // Restore visibility if drag was cancelled
    e.target.style.opacity = "1";
  });
});

// Allow drop
bin.addEventListener("dragover", (e) => e.preventDefault());

// Handle drop
bin.addEventListener("drop", (e) => {
  e.preventDefault();
  const id = e.dataTransfer.getData("id");
  const bottle = document.getElementById(id);

  if (bottle) {
    // Add wiggle animation to bin
    bin.classList.add("wiggle");
    setTimeout(() => bin.classList.remove("wiggle"), 500);

    bottle.remove();
    count++;

    if (count === bottles.length) {
      // Fade out bin first
      bin.style.transition = "opacity 0.5s ease";
      bin.style.opacity = "0";

      setTimeout(() => {
        grid.style.display = "none";
        thankyou.classList.remove("hidden");
        // Smooth fade-in
        setTimeout(() => {
          thankyou.classList.add("show");
        }, 100);
      }, 500);
    }
  }
});
document.getElementById("donationForm").addEventListener("submit", function (e) {
  e.preventDefault();

  // Clear input fields
  document.getElementById("name").value = "";
  document.getElementById("email").value = "";
  document.getElementById("phone").value = "";

  // Show confirmation
  alert("Thank you for your donation!💙");
});

document.getElementById("newsletterForm").addEventListener("submit", function (e) {
  e.preventDefault();

  // Get the input field
  const emailInput = document.getElementById("newsletter-email");

  // Show alert
  alert("Thank you! You are now signed up💙");

  // Clear the input field
  emailInput.value = "";
});
