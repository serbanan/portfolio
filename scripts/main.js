// scripts/main.js

function isMobile() {
  return window.matchMedia("(max-width: 740px)").matches;
}

document.addEventListener("DOMContentLoaded", function() {
  const projectRows = document.querySelectorAll(".project-row.item");
  const previewArea = document.getElementById("preview-area");
  const projectDescription = document.getElementById("project-description");
  const hoverPreview = document.getElementById("hover-preview");
  const hoverScrollable = document.getElementById("hover-scrollable");
  const fullPreview = document.getElementById("full-preview");
  const fullScrollable = document.getElementById("full-scrollable");

  // Mobile modal
  let mobileImageModal = document.getElementById("mobileImageModal");
  if (!mobileImageModal) {
    mobileImageModal = document.createElement("div");
    mobileImageModal.id = "mobileImageModal";
    mobileImageModal.innerHTML = `
      <div class="modal-content">
        <button class="modal-close" title="Close">&times;</button>
        <button class="modal-arrow left" title="Previous">&#8249;</button>
        <img src="" alt="Project image" />
        <button class="modal-arrow right" title="Next">&#8250;</button>
      </div>
    `;
    document.body.appendChild(mobileImageModal);
  }
  const modalImg = mobileImageModal.querySelector("img");
  const modalClose = mobileImageModal.querySelector(".modal-close");
  const modalLeft = mobileImageModal.querySelector(".modal-arrow.left");
  const modalRight = mobileImageModal.querySelector(".modal-arrow.right");

  let modalImages = [];
  let modalIndex = 0;
  
  function openMobileModal(images, startIndex = 0) {
    modalImages = images;
    modalIndex = startIndex;
    showModalImage();
    mobileImageModal.classList.add("active");
    document.body.style.overflow = "hidden";
  }
  function closeMobileModal() {
    mobileImageModal.classList.remove("active");
    document.body.style.overflow = "";
  }
  function showModalImage() {
    if (!modalImages.length) return;
    modalImg.src = modalImages[modalIndex];
    modalLeft.disabled = modalIndex === 0;
    modalRight.disabled = modalIndex === modalImages.length - 1;
  }
  modalClose.onclick = closeMobileModal;
  modalLeft.onclick = function() {
    if (modalIndex > 0) {
      modalIndex--;
      showModalImage();
    }
  };
  modalRight.onclick = function() {
    if (modalIndex < modalImages.length - 1) {
      modalIndex++;
      showModalImage();
    }
  };
  mobileImageModal.addEventListener("click", function(e) {
    if (e.target === mobileImageModal) closeMobileModal();
  });
  // Swipe support for modal
  let touchStartX = null;
  modalImg.addEventListener("touchstart", function(e) {
    touchStartX = e.touches[0].clientX;
  });
  modalImg.addEventListener("touchend", function(e) {
    if (touchStartX === null) return;
    let dx = e.changedTouches[0].clientX - touchStartX;
    if (dx > 45 && modalIndex > 0) { modalIndex--; showModalImage(); }
    else if (dx < -45 && modalIndex < modalImages.length - 1) { modalIndex++; showModalImage(); }
    touchStartX = null;
  });

  // Main logic for projects
  projectRows.forEach(function(row, i) {
    row.addEventListener("click", function(e) {
      const images = JSON.parse(row.getAttribute("data-images") || "[]");
      const description = row.getAttribute("data-description") || "";
      // Mobile: modal
      if (isMobile()) {
        if (images.length) openMobileModal(images);
      } else {
        // Desktop: show in preview area
        projectRows.forEach(r => r.classList.remove("active"));
        row.classList.add("active");
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
      }
    });
    // Hover desktop: show in hover preview
    row.addEventListener("mouseenter", function() {
      if (isMobile()) return;
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
      if (isMobile()) return;
      if (hoverPreview) hoverPreview.style.display = "none";
    });
  });

  // Hide preview area on mobile
  function updatePreviewVisibility() {
    if (isMobile() && previewArea) previewArea.style.display = "none";
    else if (previewArea) previewArea.style.display = "";
  }
  window.addEventListener("resize", updatePreviewVisibility);
  updatePreviewVisibility();
});