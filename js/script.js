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
document.addEventListener("DOMContentLoaded", () => {
  const bottles = document.querySelectorAll(".recycle-game .bottle");
  const bin = document.querySelector(".recycle-game #bin");
  const grid = document.querySelector(".recycle-game__grid");
  const thankyou = document.querySelector(".recycle-game .thankyou");

  let count = 0;

  // Make bottles draggable
  bottles.forEach((bottle) => {
    bottle.addEventListener("dragstart", (e) => {
      e.dataTransfer.setData("id", bottle.id);
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
      bottle.remove();
      count++;

      if (count === bottles.length) {
        grid.style.display = "none";
        thankyou.classList.remove("hidden");

        // Smooth fade-in
        setTimeout(() => {
          thankyou.classList.add("show");
        }, 100);
      }
    }
  });
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
