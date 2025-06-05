document.addEventListener("DOMContentLoaded", function() {
  const projectRows = document.querySelectorAll(".project-row.item");
  const previewArea = document.getElementById("preview-area");
  const projectDescription = document.getElementById("project-description");
  const hoverPreview = document.getElementById("hover-preview");
  const hoverScrollable = document.getElementById("hover-scrollable");
  const fullPreview = document.getElementById("full-preview");
  const fullScrollable = document.getElementById("full-scrollable");
  const brandLink = document.getElementById("brand-link");

  // --- PRELOAD FIRST IMAGE FOR INSTANT HOVER ---
  projectRows.forEach(row => {
    const images = JSON.parse(row.getAttribute("data-images") || "[]");
    if(images[0]) {
      const img = new window.Image();
      img.src = images[0];
    }
  });

  // Keep track of the currently active (clicked) row
  let currentActiveRow = null;
  let isHoveringRow = false;

  // RESET EVERYTHING ON HOME CLICK
  brandLink.addEventListener("click", function(e) {
    e.preventDefault();

    // Remove active/hovering classes from all project rows
    projectRows.forEach(r => {
      r.classList.remove("active");
      r.classList.remove("hovering");
    });

    // Reset tracking variables
    currentActiveRow = null;
    isHoveringRow = false;

    // Clear previews and description
    if (hoverScrollable) hoverScrollable.innerHTML = "";
    if (hoverPreview) hoverPreview.style.display = "none";
    if (fullScrollable) fullScrollable.innerHTML = "";
    if (fullPreview) fullPreview.style.display = "none";
    if (projectDescription) projectDescription.textContent = "";
  });

  function showFullPreviewForActiveRow() {
    if (currentActiveRow) {
      const images = JSON.parse(currentActiveRow.getAttribute("data-images") || "[]");
      if (fullScrollable) {
        fullScrollable.innerHTML = "";
        images.forEach(function(src) {
          const img = document.createElement("img");
          img.src = src;
          img.loading = "lazy";
          fullScrollable.appendChild(img);
        });
      }
      if (fullPreview) fullPreview.style.display = images.length ? "" : "none";
      if (projectDescription)
        projectDescription.textContent = currentActiveRow.getAttribute("data-description") || "";
    }
  }

  // Desktop/web logic
  projectRows.forEach(function(row) {
    row.addEventListener("mouseenter", function() {
      isHoveringRow = true;
      projectRows.forEach(r => r.classList.remove("hovering"));
      row.classList.add("hovering");

      // If another row is hovered, clear the project description at the top right
      if (currentActiveRow && currentActiveRow !== row) {
        if (projectDescription) projectDescription.textContent = "";
      }

      const images = JSON.parse(row.getAttribute("data-images") || "[]");
      if (hoverScrollable) {
        hoverScrollable.innerHTML = "";
        // Only show the first image on hover!
        if (images.length > 0) {
          const img = document.createElement("img");
          img.src = images[0];
          img.loading = "lazy";
          hoverScrollable.appendChild(img);
        }
      }
      if (hoverPreview) hoverPreview.style.display = images.length ? "" : "none";
      if (fullPreview) fullPreview.style.display = "none";
    });

    row.addEventListener("mouseleave", function() {
      isHoveringRow = false;
      row.classList.remove("hovering");
      // Small delay to allow mouse to enter another row before restoring
      setTimeout(() => {
        if (!isHoveringRow) {
          if (currentActiveRow) {
            // Restore description and full preview for active row
            showFullPreviewForActiveRow();
            if (hoverPreview) hoverPreview.style.display = "none";
          } else {
            // No active row: hide all previews (right side empty)
            if (hoverScrollable) hoverScrollable.innerHTML = "";
            if (hoverPreview) hoverPreview.style.display = "none";
            if (fullScrollable) fullScrollable.innerHTML = "";
            if (fullPreview) fullPreview.style.display = "none";
            if (projectDescription) projectDescription.textContent = "";
          }
        }
      }, 10);
    });

    row.addEventListener("click", function() {
      projectRows.forEach(r => r.classList.remove("active"));
      row.classList.add("active");
      currentActiveRow = row;
      showFullPreviewForActiveRow();
      if (hoverPreview) hoverPreview.style.display = "none";
    });
  });

  // Also handle mouseleave from the entire list area, so if user hovers out to "blank", show full preview of clicked project,
  // else show nothing
  const columnContent = document.querySelector('.column-content');
  if (columnContent) {
    columnContent.addEventListener("mouseleave", function() {
      isHoveringRow = false;
      if (currentActiveRow) {
        showFullPreviewForActiveRow();
        if (hoverPreview) hoverPreview.style.display = "none";
      } else {
        if (hoverScrollable) hoverScrollable.innerHTML = "";
        if (hoverPreview) hoverPreview.style.display = "none";
        if (fullScrollable) fullScrollable.innerHTML = "";
        if (fullPreview) fullPreview.style.display = "none";
        if (projectDescription) projectDescription.textContent = "";
      }
    });
    columnContent.addEventListener("mouseenter", function() {
      // No-op, just to ensure state is correct
    });
  }

  // --- MOBILE-ONLY INLINE GALLERY ---
  (function() {
    // (mobile code unchanged)
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
      // Get title & description from currentProjectRow
      let title = "";
      let desc = "";
      if (currentProjectRow) {
        title = currentProjectRow.querySelector('.project-title')?.textContent || "";
        desc = currentProjectRow.getAttribute("data-description") || "";
      }
      sliderContainer.innerHTML = `
        <div class="mobile-slider" style="position:relative;">
          <button class="mobile-slider-arrow left" ${index === 0 ? 'disabled' : ''}>&#8249;</button>
          <img class="mobile-slider-image" src="${images[index]}" alt="project image" loading="lazy" />
          <button class="mobile-slider-arrow right" ${index === images.length - 1 ? 'disabled' : ''}>&#8250;</button>
          <div class="mobile-slider-caption">
            <strong>${title}</strong><br>
            ${desc}
          </div>
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
});