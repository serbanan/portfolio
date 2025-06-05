document.addEventListener("DOMContentLoaded", function() {
  const projectRows = document.querySelectorAll(".project-row.item");
  const previewArea = document.getElementById("preview-area");
  const projectDescription = document.getElementById("project-description");
  const hoverPreview = document.getElementById("hover-preview");
  const hoverScrollable = document.getElementById("hover-scrollable");
  const fullPreview = document.getElementById("full-preview");
  const fullScrollable = document.getElementById("full-scrollable");

  projectRows.forEach(function(row) {
    row.addEventListener("mouseenter", function() {
      projectRows.forEach(r => r.classList.remove("hovering"));
      row.classList.add("hovering");
      const images = JSON.parse(row.getAttribute("data-images") || "[]");
      const description = row.getAttribute("data-description") || "";
      if (hoverScrollable) {
        hoverScrollable.innerHTML = "";
        images.forEach(function(src) {
          const img = document.createElement("img");
          img.src = src;
          hoverScrollable.appendChild(img);
        });
      }
      if (projectDescription) projectDescription.textContent = description;
      if (hoverPreview) hoverPreview.style.display = images.length ? "" : "none";
      if (fullPreview) fullPreview.style.display = "none";
    });
    row.addEventListener("mouseleave", function() {
      row.classList.remove("hovering");
      if (hoverPreview) hoverPreview.style.display = "none";
    });
    row.addEventListener("click", function() {
      projectRows.forEach(r => r.classList.remove("active"));
      row.classList.add("active");
      const images = JSON.parse(row.getAttribute("data-images") || "[]");
      const description = row.getAttribute("data-description") || "";
      if (projectDescription) projectDescription.textContent = description;
      if (fullScrollable) {
        fullScrollable.innerHTML = "";
        images.forEach(function(src) {
          const img = document.createElement("img");
          img.src = src;
          fullScrollable.appendChild(img);
        });
      }
      if (fullPreview) fullPreview.style.display = images.length ? "" : "none";
      if (hoverPreview) hoverPreview.style.display = "none";
    });
  });
});

// --- MOBILE-ONLY INLINE GALLERY ---
(function() {
  const isMobile = () => window.innerWidth <= 740;
  const sliderContainer = document.getElementById("mobile-slider-container");
  let currentProjectRow = null;
  let sliderState = { images: [], index: 0 };

  function renderSlider(images, index = 0) {
    if (!isMobile()) {
      sliderContainer.innerHTML = "";
      return;
    }
    if (!images || !images.length) {
      sliderContainer.innerHTML = "";
      return;
    }
    sliderContainer.innerHTML = `
      <div class="mobile-slider">
        <div class="mobile-slider-arrows">
          <button class="mobile-slider-arrow left" ${index === 0 ? 'disabled' : ''}>&#8249;</button>
          <button class="mobile-slider-arrow right" ${index === images.length - 1 ? 'disabled' : ''}>&#8250;</button>
        </div>
        <img class="mobile-slider-image" src="${images[index]}" alt="project image" />
      </div>
    `;
    // Arrow controls
    const left = sliderContainer.querySelector(".mobile-slider-arrow.left");
    const right = sliderContainer.querySelector(".mobile-slider-arrow.right");
    left && left.addEventListener("click", function(e) {
      e.stopPropagation();
      if (sliderState.index > 0) {
        sliderState.index--;
        renderSlider(sliderState.images, sliderState.index);
      }
    });
    right && right.addEventListener("click", function(e) {
      e.stopPropagation();
      if (sliderState.index < sliderState.images.length - 1) {
        sliderState.index++;
        renderSlider(sliderState.images, sliderState.index);
      }
    });
    // Touch swipe
    const img = sliderContainer.querySelector(".mobile-slider-image");
    let startX = null;
    img.addEventListener("touchstart", function(e) {
      startX = e.touches[0].clientX;
    });
    img.addEventListener("touchend", function(e) {
      if (startX === null) return;
      let dx = e.changedTouches[0].clientX - startX;
      if (dx > 40 && sliderState.index > 0) {
        sliderState.index--;
        renderSlider(sliderState.images, sliderState.index);
      } else if (dx < -40 && sliderState.index < sliderState.images.length - 1) {
        sliderState.index++;
        renderSlider(sliderState.images, sliderState.index);
      }
      startX = null;
    });
  }

  function handleMobileProjectClick(row) {
    if (currentProjectRow === row) {
      // Clicking the same project closes the slider
      sliderContainer.innerHTML = "";
      currentProjectRow = null;
      sliderState = { images: [], index: 0 };
      return;
    }
    currentProjectRow = row;
    sliderState.images = [];
    sliderState.index = 0;
    let images = [];
    try {
      images = JSON.parse(row.getAttribute("data-images") || "[]");
    } catch (e) {}
    sliderState.images = images;
    sliderState.index = 0;
    renderSlider(images, 0);
    // Scroll slider into view if needed
    setTimeout(() => {
      sliderContainer.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  }

  function setupMobileGalleryListeners() {
    const projectRows = document.querySelectorAll(".project-row.item");
    projectRows.forEach(row => {
      // Remove previous mobile click
      if (row._mobileGalleryHandler) {
        row.removeEventListener("click", row._mobileGalleryHandler);
      }
      if (isMobile()) {
        row._mobileGalleryHandler = function(e) {
          e.preventDefault();
          e.stopPropagation();
          handleMobileProjectClick(row);
        };
        row.addEventListener("click", row._mobileGalleryHandler);
      } else {
        row._mobileGalleryHandler = null;
      }
    });
    // Hide slider if resizing to desktop
    if (!isMobile()) {
      sliderContainer.innerHTML = "";
      currentProjectRow = null;
      sliderState = { images: [], index: 0 };
    }
  }

  setupMobileGalleryListeners();
  window.addEventListener("resize", setupMobileGalleryListeners);
  window.addEventListener("orientationchange", setupMobileGalleryListeners);
})();