document.addEventListener("DOMContentLoaded", function() {
  const projectRows = document.querySelectorAll(".project-row.item");
  const previewArea = document.getElementById("preview-area");
  const projectDescription = document.getElementById("project-description");
  const hoverPreview = document.getElementById("hover-preview");
  const hoverScrollable = document.getElementById("hover-scrollable");
  const fullPreview = document.getElementById("full-preview");
  const fullScrollable = document.getElementById("full-scrollable");
  const brandLink = document.getElementById("brand-link");
  const aboutLink = document.getElementById("about-link");
  const contactLink = document.getElementById("contact-link");

  // --- PRELOAD FIRST IMAGE FOR INSTANT HOVER ---
  projectRows.forEach(row => {
    const images = JSON.parse(row.getAttribute("data-images") || "[]");
    if(images[0]) {
      const img = new window.Image();
      img.src = images[0];
    }
  });

  // About & Contact content (placeholder)
  const headerContent = {
    "about": {
      preview: "Short About preview: Visual artist and photographer.<br><em>(placeholder preview text)</em>",
      full: `<h2>About</h2>
        <p>This is the full about section. Here goes a longer bio, artist statement, or background.<br><em>(placeholder full about text)</em></p>`
    },
    "contact": {
      preview: "Contact for collaborations or commissions.<br><em>(placeholder preview text)</em>",
      full: `<h2>Contact</h2>
        <p>Email: <a href="mailto:artist@email.com">artist@email.com</a><br>Instagram: @artistusername<br><em>(placeholder full contact text)</em></p>`
    }
  };

  let currentActiveRow = null;
  let currentActiveHeader = null;
  let isHoveringRow = false;

  // --- Session token to prevent async image mixups ---
  let fullPreviewLoadSession = 0;

  // RESET EVERYTHING ON HOME CLICK
  brandLink.addEventListener("click", function(e) {
    e.preventDefault();
    projectRows.forEach(r => {
      r.classList.remove("active");
      r.classList.remove("hovering");
    });
    if (aboutLink) aboutLink.classList.remove("active", "hovering");
    if (contactLink) contactLink.classList.remove("active", "hovering");
    currentActiveRow = null;
    currentActiveHeader = null;
    isHoveringRow = false;
    if (hoverScrollable) hoverScrollable.innerHTML = "";
    if (hoverPreview) hoverPreview.style.display = "none";
    if (fullScrollable) fullScrollable.innerHTML = "";
    if (fullPreview) fullPreview.style.display = "none";
    if (projectDescription) projectDescription.textContent = "";
    // Cancel any ongoing image loading
    fullPreviewLoadSession++;
    // Remove hash from URL
    history.pushState(null, '', window.location.pathname + window.location.search);
  });

  function showFullPreviewForActiveRow() {
    if (currentActiveRow) {
      const images = JSON.parse(currentActiveRow.getAttribute("data-images") || "[]");
      if (fullScrollable) {
        fullScrollable.innerHTML = "";
        images.forEach(function(url) {
          const img = document.createElement("img");
          img.src = url;
          img.loading = "lazy";
          fullScrollable.appendChild(img);
        });
      }
      if (fullPreview) fullPreview.style.display = images.length ? "" : "none";
      if (projectDescription)
        projectDescription.textContent = currentActiveRow.getAttribute("data-description") || "";
    }
  }

  function showHeaderPreview(type) {
    if (!headerContent[type]) return;
    if (hoverScrollable) {
      hoverScrollable.innerHTML = `<div style="padding:2em 1em;color:#222;">${headerContent[type].preview}</div>`;
    }
    if (hoverPreview) hoverPreview.style.display = "";
    if (fullPreview) fullPreview.style.display = "none";
    if (projectDescription) projectDescription.textContent = "";
  }

  function showHeaderFull(type) {
    if (!headerContent[type]) return;
    if (fullScrollable) {
      fullPreviewLoadSession++; // cancel any previous project image loading
      fullScrollable.innerHTML = `<div style="padding:2em 1em;color:#222;">${headerContent[type].full}</div>`;
    }
    if (fullPreview) fullPreview.style.display = "";
    if (hoverPreview) hoverPreview.style.display = "none";
    if (projectDescription) projectDescription.textContent = (type === "about" ? "About" : "Contact");
  }

  // HEADER EVENTS
  if (aboutLink) {
    aboutLink.addEventListener("mouseenter", function() {
      aboutLink.classList.add("hovering");
      showHeaderPreview("about");
      if (projectDescription) projectDescription.textContent = ""; // Hide title on hover
    });
    aboutLink.addEventListener("mouseleave", function() {
      aboutLink.classList.remove("hovering");
      setTimeout(() => {
        if (currentActiveRow) {
          showFullPreviewForActiveRow();
          if (hoverPreview) hoverPreview.style.display = "none";
        } else if (currentActiveHeader) {
          showHeaderFull(currentActiveHeader);
          if (hoverPreview) hoverPreview.style.display = "none";
        } else {
          if (hoverScrollable) hoverScrollable.innerHTML = "";
          if (hoverPreview) hoverPreview.style.display = "none";
          if (fullScrollable) fullScrollable.innerHTML = "";
          if (fullPreview) fullPreview.style.display = "none";
          if (projectDescription) projectDescription.textContent = "";
        }
      }, 10);
    });
    aboutLink.addEventListener("click", function(e) {
      e.preventDefault();
      projectRows.forEach(r => r.classList.remove("active"));
      if (contactLink) contactLink.classList.remove("active");
      aboutLink.classList.add("active");
      currentActiveRow = null;
      currentActiveHeader = "about";
      showHeaderFull("about");
      fullPreviewLoadSession++; // cancel any previous project image loading
      history.pushState(null, '', '#about');
    });
  }

  if (contactLink) {
    contactLink.addEventListener("mouseenter", function() {
      contactLink.classList.add("hovering");
      showHeaderPreview("contact");
      if (projectDescription) projectDescription.textContent = ""; // Hide title on hover
    });
    contactLink.addEventListener("mouseleave", function() {
      contactLink.classList.remove("hovering");
      setTimeout(() => {
        if (currentActiveRow) {
          showFullPreviewForActiveRow();
          if (hoverPreview) hoverPreview.style.display = "none";
        } else if (currentActiveHeader) {
          showHeaderFull(currentActiveHeader);
          if (hoverPreview) hoverPreview.style.display = "none";
        } else {
          if (hoverScrollable) hoverScrollable.innerHTML = "";
          if (hoverPreview) hoverPreview.style.display = "none";
          if (fullScrollable) fullScrollable.innerHTML = "";
          if (fullPreview) fullPreview.style.display = "none";
          if (projectDescription) projectDescription.textContent = "";
        }
      }, 10);
    });
    contactLink.addEventListener("click", function(e) {
      e.preventDefault();
      projectRows.forEach(r => r.classList.remove("active"));
      if (aboutLink) aboutLink.classList.remove("active");
      contactLink.classList.add("active");
      currentActiveRow = null;
      currentActiveHeader = "contact";
      showHeaderFull("contact");
      fullPreviewLoadSession++; // cancel any previous project image loading
      history.pushState(null, '', '#contact');
    });
  }

  // PROJECT ROWS LOGIC
  projectRows.forEach(function(row) {
    row.addEventListener("mouseenter", function() {
      isHoveringRow = true;
      projectRows.forEach(r => r.classList.remove("hovering"));
      row.classList.add("hovering");
      if (aboutLink) aboutLink.classList.remove("hovering");
      if (contactLink) contactLink.classList.remove("hovering");
      // Show project hover preview, but don't clear header active state!
      const images = JSON.parse(row.getAttribute("data-images") || "[]");
      if (hoverScrollable) {
        hoverScrollable.innerHTML = "";
        if (images.length > 0) {
          const img = document.createElement("img");
          img.src = images[0];
          img.loading = "lazy";
          hoverScrollable.appendChild(img);
        }
      }
      if (hoverPreview) hoverPreview.style.display = images.length ? "" : "none";
      if (fullPreview) fullPreview.style.display = "none";
      if (projectDescription) projectDescription.textContent = ""; // Hide title on hover
    });

    row.addEventListener("mouseleave", function() {
      isHoveringRow = false;
      row.classList.remove("hovering");
      setTimeout(() => {
        if (!isHoveringRow) {
          if (currentActiveRow) {
            showFullPreviewForActiveRow();
            if (hoverPreview) hoverPreview.style.display = "none";
          } else if (currentActiveHeader) {
            showHeaderFull(currentActiveHeader);
            if (hoverPreview) hoverPreview.style.display = "none";
          } else {
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
      if (aboutLink) aboutLink.classList.remove("active");
      if (contactLink) contactLink.classList.remove("active");
      currentActiveRow = row;
      currentActiveHeader = null;
      showFullPreviewForActiveRow();
      if (hoverPreview) hoverPreview.style.display = "none";
      // --- SHAREABILITY PATCH: update hash ---
      let projectId = row.getAttribute('data-project-id');
      if (!projectId) {
        // fallback: create a project id from project title (less robust)
        const title = row.querySelector('.project-title')?.textContent || '';
        projectId = encodeURIComponent(title.replace(/\s+/g, ''));
      }
      if (projectId) {
        history.pushState(null, '', '#project-' + encodeURIComponent(projectId));
      }
    });
  });

  const columnContent = document.querySelector('.column-content');
  if (columnContent) {
    columnContent.addEventListener("mouseleave", function() {
      isHoveringRow = false;
      if (currentActiveRow) {
        showFullPreviewForActiveRow();
        if (hoverPreview) hoverPreview.style.display = "none";
      } else if (currentActiveHeader) {
        showHeaderFull(currentActiveHeader);
        if (hoverPreview) hoverPreview.style.display = "none";
      } else {
        if (hoverScrollable) hoverScrollable.innerHTML = "";
        if (hoverPreview) hoverPreview.style.display = "none";
        if (fullScrollable) fullScrollable.innerHTML = "";
        if (fullPreview) fullPreview.style.display = "none";
        if (projectDescription) projectDescription.textContent = "";
      }
    });
  }

  // --- MOBILE-ONLY INLINE GALLERY ---
  (function() {
    const isMobile = () => window.innerWidth <= 740;
    const sliderContainer = document.getElementById("mobile-slider-container");
    let currentProjectRow = null;
    let sliderState = { images: [], index: 0 };

    function renderSlider(images, index = 0) {
      if (!isMobile()) {
        if (sliderContainer.parentNode) sliderContainer.parentNode.removeChild(sliderContainer);
        return;
      }
      if (!images || !images.length) {
        if (sliderContainer.parentNode) sliderContainer.parentNode.removeChild(sliderContainer);
        return;
      }
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
        if (sliderContainer.parentNode) sliderContainer.parentNode.removeChild(sliderContainer);
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
      // Insert slider directly ABOVE the clicked project row
      if (sliderContainer.parentNode) sliderContainer.parentNode.removeChild(sliderContainer);
      row.parentNode.insertBefore(sliderContainer, row);
      renderSlider(images, 0);
      setTimeout(() => {
        sliderContainer.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 50);
    }

    function setupMobileGalleryListeners() {
      const projectRows = document.querySelectorAll(".project-row.item");
      projectRows.forEach(row => {
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
      if (!isMobile()) {
        if (sliderContainer.parentNode) sliderContainer.parentNode.removeChild(sliderContainer);
        currentProjectRow = null;
        sliderState = { images: [], index: 0 };
      }
    }

    setupMobileGalleryListeners();
    window.addEventListener("resize", setupMobileGalleryListeners);
    window.addEventListener("orientationchange", setupMobileGalleryListeners);
  })();

  // --------- HASH SHAREABILITY: activate project/about/contact from hash ---------
  function activateProjectFromHash() {
    if (window.location.hash.startsWith('#project-')) {
      const projectId = decodeURIComponent(window.location.hash.replace('#project-', ''));
      // Try to select by data-project-id if present, otherwise fallback to title
      let row = document.querySelector('.project-row.item[data-project-id="' + projectId + '"]');
      if (!row) {
        // fallback: try to match by sanitized project-title text
        document.querySelectorAll('.project-row.item').forEach(r => {
          const title = r.querySelector('.project-title')?.textContent || '';
          const id = title.replace(/\s+/g, '');
          if (id === projectId) row = r;
        });
      }
      if (row) {
        if (!row.classList.contains("active")) {
          row.click();
        }
        row.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    } else if (window.location.hash === "#about" && aboutLink) {
      aboutLink.click();
    } else if (window.location.hash === "#contact" && contactLink) {
      contactLink.click();
    }
  }
  window.addEventListener('hashchange', activateProjectFromHash);
  activateProjectFromHash(); // On initial load
});