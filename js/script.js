// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Safely queries a single DOM element
 * @param {string} selector - CSS selector
 * @returns {Element|null} - Found element or null
 */
const getElement = (selector) => document.querySelector(selector);

/**
 * Safely queries multiple DOM elements
 * @param {string} selector - CSS selector
 * @returns {NodeList} - NodeList of found elements
 */
const getElements = (selector) => document.querySelectorAll(selector);

// ============================================
// SCROLLING BEHAVIOR SECTIONS
// ============================================

// const sections = document.querySelectorAll(".scroll-section");
// let isScrolling = false;

// function getNextSection(current, direction) {
//   const currentIndex = [...sections].indexOf(current);
//   const nextIndex = direction === "down" ? currentIndex + 1 : currentIndex - 1;
//   if (nextIndex < 0 || nextIndex >= sections.length) return null;
//   return sections[nextIndex];
// }

// function handleScroll(direction) {
//   if (isScrolling) return;

//   const scrollPos = window.scrollY + window.innerHeight / 2;
//   let current = sections[0];
//   for (const sec of sections) {
//     if (scrollPos >= sec.offsetTop) current = sec;
//   }

//   const next = getNextSection(current, direction);
//   if (!next) return;

//   isScrolling = true;
//   next.scrollIntoView({ behavior: "smooth" });

//   // tillad ny scroll efter lidt tid
//   setTimeout(() => {
//     isScrolling = false;
//   }, 900);
// }

// let lastTouchY = 0;

// window.addEventListener("wheel", (e) => {
//   if (Math.abs(e.deltaY) < 20) return;
//   handleScroll(e.deltaY > 0 ? "down" : "up");
// });

// window.addEventListener("touchstart", (e) => (lastTouchY = e.touches[0].clientY));
// window.addEventListener("touchend", (e) => {
//   const deltaY = lastTouchY - e.changedTouches[0].clientY;
//   if (Math.abs(deltaY) < 50) return;
//   handleScroll(deltaY > 0 ? "down" : "up");
// });

// ============================================
// PROGRESS BAR ANIMATION (1-minute timer)
// ============================================

const ProgressBar = (() => {
  let startTime = Date.now();
  let animationFrame = null;
  let isVisible = false;

  const DURATION = 60000;
  const progressFill = getElement("#progressFill");
  const progressSection = getElement(".one-min__container");

  // Updates the progress bar width based on elapsed time
  // Uses requestAnimationFrame for smooth 60fps animation
  const updateProgress = () => {
    if (!isVisible || !progressFill) return;

    const elapsed = Date.now() - startTime;
    const progress = ((elapsed % DURATION) / DURATION) * 100;

    progressFill.style.width = `${progress}%`;

    animationFrame = requestAnimationFrame(updateProgress);
  };

  // Starts progress animation when section is visible
  const start = () => {
    isVisible = true;
    startTime = Date.now(); // Reset timer
    updateProgress();
  };

  // Stops the progress animation to save resources
  const stop = () => {
    isVisible = false;
    if (animationFrame) {
      cancelAnimationFrame(animationFrame);
      animationFrame = null;
    }
  };

  // Initialize progress bar observer
  const init = () => {
    if (!progressSection) {
      console.warn("Progress section not found");
      return;
    }

    // Observe when section is visible
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          entry.isIntersecting ? start() : stop();
        });
      },
      { threshold: 0.1 } // Trigger when 10% visible
    );

    observer.observe(progressSection);
  };

  // Auto-initialize
  init();

  return { start, stop, init };
})();

// ============================================
// RECYCLE GAME - Drag & Drop
// ============================================

const RecycleGame = (() => {
  const bottles = getElements(".recycle-game .bottle");
  const bin = getElement(".recycle-game .bin");
  const arrow = getElement(".recycle-game__grid .arrow");
  const grid = getElement(".recycle-game__grid");
  const thankyou = getElement(".recycle-game .thankyou");
  let bottlesRecycled = 0;
  const totalBottles = bottles.length;

  // Shows thank you message with fade animations
  const showThankYou = () => {
    const fadeOutElements = [bin, arrow];

    fadeOutElements.forEach((element) => {
      if (element) {
        element.style.transition = "opacity 0.5s ease";
        element.style.opacity = "0";
      }
    });

    // Show thank you message after fade
    setTimeout(() => {
      grid.style.display = "none";
      thankyou.classList.remove("hidden");

      setTimeout(() => {
        thankyou.classList.add("show");
      }, 100);
    }, 500);
  };

  /**
   * Handles bottle drop into bin
   * @param {HTMLElement} bottle - The bottle being dropped
   */
  const handleBottleDrop = (bottle) => {
    bin.classList.add("wiggle");
    setTimeout(() => bin.classList.remove("wiggle"), 500);

    bottle.remove();
    bottlesRecycled++;

    if (bottlesRecycled === totalBottles) {
      showThankYou();
    }
  };

  // Initialize drag and drop functionality
  const init = () => {
    if (!bin || bottles.length === 0) {
      console.warn("Recycle game elements not found");
      return;
    }

    // Set up drag and drop event listeners
    bottles.forEach((bottle) => {
      bottle.addEventListener("dragstart", (e) => {
        e.dataTransfer.setData("id", bottle.id);

        setTimeout(() => {
          e.target.style.opacity = "0";
        }, 0);
      });

      bottle.addEventListener("dragend", (e) => {
        e.target.style.opacity = "1";
      });
    });

    // Allow bottle drop on bin
    bin.addEventListener("dragover", (e) => {
      e.preventDefault();
    });

    // Handle drop event
    bin.addEventListener("drop", (e) => {
      e.preventDefault();
      const bottleId = e.dataTransfer.getData("id");
      const bottle = document.getElementById(bottleId);

      if (bottle) {
        handleBottleDrop(bottle);
      }
    });
  };

  // Auto-initialize
  init();

  return { init };
})();

// ============================================
// FORM HANDLERS
// ============================================

/**
 * Generic form submission handler
 * @param {string} formId - ID of the form element
 * @param {string} message - Success message to display
 * @param {Array<string>} fieldIds - IDs of input fields to clear
 */
const handleFormSubmit = (formId, message, fieldIds = []) => {
  const form = getElement(`#${formId}`);

  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    fieldIds.forEach((fieldId) => {
      const field = getElement(`#${fieldId}`);
      if (field) field.value = "";
    });

    // Show success message
    alert(message);
  });
};

// Initialize donation form
handleFormSubmit("donationForm", "Thank you for your donation! 💙", ["name", "email", "phone"]);

// Initialize newsletter form
handleFormSubmit("newsletterForm", "Thank you! You are now signed up 💙", ["newsletter-email"]);

// ===============================================
// DOODLE ANIMATIONS (switching frame animations)
// ===============================================

const DoodleAnimator = (() => {
  const FRAME_DELAY = 200;

  /**
   * Starts animating a doodle element
   * @param {HTMLElement} doodle - Doodle element with data-images attribute
   */
  const startAnimation = (doodle) => {
    // Prevent duplicate animations
    if (doodle.dataset.animating === "true") return;

    doodle.dataset.animating = "true";

    // Parse image paths
    const images = doodle.dataset.images.split(",");
    let currentIndex = Math.floor(Math.random() * images.length);

    // Set initial random frame
    doodle.style.backgroundImage = `url(${images[currentIndex]})`;

    // Cycle through frames
    const intervalId = setInterval(() => {
      currentIndex = (currentIndex + 1) % images.length;
      doodle.style.backgroundImage = `url(${images[currentIndex]})`;
    }, FRAME_DELAY);

    // Store interval ID for cleanup
    doodle.dataset.intervalId = intervalId;
  };

  /**
   * Stops animating a doodle element
   * @param {HTMLElement} doodle - Doodle element to stop
   */
  const stopAnimation = (doodle) => {
    if (doodle.dataset.intervalId) {
      clearInterval(doodle.dataset.intervalId);
      doodle.dataset.intervalId = "";
      doodle.dataset.animating = "";
    }
  };

  /**
   * Preloads all doodle images for smoother animation
   */
  const preloadImages = () => {
    const allImages = new Set();

    getElements(".doodle-animation").forEach((doodle) => {
      if (doodle.dataset.images) {
        doodle.dataset.images.split(",").forEach((src) => {
          allImages.add(src.trim());
        });
      }
    });

    allImages.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  };

  // Initialize doodle animations
  const init = () => {
    const doodles = getElements(".doodle-animation");

    if (doodles.length === 0) {
      console.warn("No doodle elements found");
      return;
    }

    // Set up Intersection Observer for performance
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const doodle = entry.target;

          if (entry.isIntersecting) {
            startAnimation(doodle);
          } else {
            stopAnimation(doodle);
          }
        });
      },
      {
        threshold: 0.1, // Start when 10% visible
        rootMargin: "50px", // Start slightly before entering viewport
      }
    );

    // Observe all doodle elements
    doodles.forEach((doodle) => {
      observer.observe(doodle);
    });

    // Preload images
    preloadImages();
  };

  // Auto-initialize
  init();

  return { init, preloadImages };
})();

// ============================================
// INITIALIZATION COMPLETE
// ============================================
console.log("🌊 Plastic Ocean scripts loaded successfully!");

let lastScrollY = window.scrollY;
const headerWrapper = document.querySelector(".header__wrapper");

// Start visible
headerWrapper.classList.add("visible");

window.addEventListener("scroll", () => {
  const currentScroll = window.scrollY;

  // Scroll up → show header
  if (currentScroll < lastScrollY - 5) {
    headerWrapper.classList.add("visible");
  }
  // Scroll down → hide header
  else if (currentScroll > lastScrollY + 5) {
    headerWrapper.classList.remove("visible");
  }

  lastScrollY = currentScroll;
});
