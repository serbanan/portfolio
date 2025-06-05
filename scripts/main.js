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

// --- MOBILE-ONLY IMAGE MODAL ---
(function() {
  function isMobile() {
    return window.innerWidth <= 740;
  }

  const modal = document.getElementById("mobileImageModal");
  const modalImg = modal.querySelector("img");
  const modalLeft = modal.querySelector(".modal-arrow.left");
  const modalRight = modal.querySelector(".modal-arrow.right");

  let modalImages = [];
  let modalIndex = 0;

  function openModal(images, startIdx = 0) {
    if (!images.length) return;
    closeModal(); // Always close any previous modal first
    modalImages = images;
    modalIndex = startIdx;
    showModalImage();
    modal.classList.add("active");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }
  function closeModal() {
    modal.classList.remove("active");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    modalImages = [];
    modalIndex = 0;
    modalImg.src = "";
  }
  function showModalImage() {
    if (!modalImages.length) return;
    modalImg.src = modalImages[modalIndex];
    modalLeft.disabled = modalIndex === 0;
    modalRight.disabled = modalIndex === modalImages.length - 1;
  }
  modalLeft.onclick = function(e) {
    e.stopPropagation();
    if (modalIndex > 0) { modalIndex--; showModalImage(); }
  };
  modalRight.onclick = function(e) {
    e.stopPropagation();
    if (modalIndex < modalImages.length - 1) { modalIndex++; showModalImage(); }
  };
  modal.addEventListener("click", function(e) {
    if (e.target === modal) closeModal();
  });
  // Swipe support
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

  // Mobile project row click override
  function mobileClickHandler(row) {
    const imagesRaw = row.getAttribute("data-images");
    let images = [];
    try { images = JSON.parse(imagesRaw); } catch (e) { images = []; }
    if (images.length) openModal(images, 0);
  }

  function updateRowListeners() {
    const projectRows = document.querySelectorAll(".project-row.item");
    projectRows.forEach(function(row) {
      row.removeEventListener("_mobileClick", row._mobileListener || (()=>{}));
      if (isMobile()) {
        row._mobileListener = function(e) {
          e.preventDefault();
          e.stopPropagation();
          mobileClickHandler(row);
        };
        row.addEventListener("click", row._mobileListener);
      } else {
        if (row._mobileListener) {
          row.removeEventListener("click", row._mobileListener);
          row._mobileListener = null;
        }
      }
    });
  }

  // Initial and on resize/orientation change
  updateRowListeners();
  window.addEventListener("resize", updateRowListeners);
  window.addEventListener("orientationchange", updateRowListeners);
})();