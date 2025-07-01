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
      const img1 = new window.Image();
      img1.src = images[0];
    }
    if(images[1]) {
      const img2 = new window.Image();
      img2.src = images[1];
    }
  });

  // About & Contact content (placeholder)
  const headerContent = {
    "about": {
      preview: "About me & about work",
      full: `<h2></h2>
        <p>Andrei Serban (b.1999, Bucharest)<br><br><em>Royal Academy of Arts The Hague - Photography 2028</em><br><em>Central Saint Martins - Fashion Image 2022</em>
        <br><br> 2/3 Galeria - CHIPS Exhibition & Book Launch - March 2024<br><br></p>`
    },
    "contact": {
      preview: "Inquiries & Contact Information",
      full: `<h2></h2>
        <p>Email: <a href="mailto:reiserban@gmail.com">reiserban@gmail.com</a><br>Instagram: <a href="https://instagram.com/andreiserbahn">@andreiserbahn</a><br></p>`
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

  // --------- MOBILE BUERO.PARIS-LIKE HORIZONTAL SLIDER PATCH ---------
  function renderMobileProjectList() {
    const mobileList = document.querySelector('.mobile-project-list');
    if (!mobileList) return;
    if (window.innerWidth > 740) {
      mobileList.innerHTML = "";
      mobileList.style.display = "none";
      return;
    }
    // Get all desktop project rows
    const projects = document.querySelectorAll('.project-row.item');
    mobileList.innerHTML = "";
    projects.forEach(row => {
      const title = row.querySelector('.project-title')?.textContent || "";
      const year = row.querySelector('.project-year')?.textContent || "";
      let images = [];
      try {
        images = JSON.parse(row.getAttribute("data-images") || "[]");
      } catch (e) {}
      const desc = row.getAttribute("data-description") || "";
      const block = document.createElement('div');
      block.className = "mobile-project-block";
      // Title row
      const titleRow = document.createElement('div');
      titleRow.className = "mobile-project-title-row";
      const titleSpan = document.createElement('span');
      titleSpan.className = "mobile-project-title";
      titleSpan.textContent = title;
      const yearSpan = document.createElement('span');
      yearSpan.className = "mobile-project-year";
      yearSpan.textContent = year;
      titleRow.appendChild(titleSpan);
      if(year) titleRow.appendChild(yearSpan);

      // Carousel
      const carousel = document.createElement('div');
      carousel.className = "mobile-project-carousel";
      images.forEach(src => {
        const img = document.createElement('img');
        img.className = "mobile-project-image";
        img.loading = "lazy";
        img.src = src;
        img.alt = title || "project image";
        carousel.appendChild(img);
      });

      block.appendChild(titleRow);
      block.appendChild(carousel);

      // Optional: add project description below images (uncomment if desired)
      if(desc) {
        const descDiv = document.createElement('div');
        descDiv.className = "mobile-project-desc";
        descDiv.textContent = desc;
        block.appendChild(descDiv);
      }

      mobileList.appendChild(block);
    });
    mobileList.style.display = "block";
  }

  // Initial render and on resize/orientationchange
  renderMobileProjectList();
  window.addEventListener("resize", renderMobileProjectList);
  window.addEventListener("orientationchange", renderMobileProjectList);

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