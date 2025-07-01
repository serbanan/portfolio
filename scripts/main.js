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
  let fullPreviewLoadSession = 0;
  let isCurrentlyMobile = null;

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
    fullPreviewLoadSession++;
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
      fullPreviewLoadSession++;
      fullScrollable.innerHTML = `<div style="padding:2em 1em;color:#222;">${headerContent[type].full}</div>`;
    }
    if (fullPreview) fullPreview.style.display = "";
    if (hoverPreview) hoverPreview.style.display = "none";
    if (projectDescription) projectDescription.textContent = (type === "about" ? "About" : "Contact");
  }

  if (aboutLink) {
    aboutLink.addEventListener("mouseenter", function() {
      aboutLink.classList.add("hovering");
      showHeaderPreview("about");
      if (projectDescription) projectDescription.textContent = "";
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
      fullPreviewLoadSession++;
      history.pushState(null, '', '#about');
    });
  }

  if (contactLink) {
    contactLink.addEventListener("mouseenter", function() {
      contactLink.classList.add("hovering");
      showHeaderPreview("contact");
      if (projectDescription) projectDescription.textContent = "";
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
      fullPreviewLoadSession++;
      history.pushState(null, '', '#contact');
    });
  }

  projectRows.forEach(function(row) {
    row.addEventListener("mouseenter", function() {
      isHoveringRow = true;
      projectRows.forEach(r => r.classList.remove("hovering"));
      row.classList.add("hovering");
      if (aboutLink) aboutLink.classList.remove("hovering");
      if (contactLink) contactLink.classList.remove("hovering");
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
      if (projectDescription) projectDescription.textContent = "";
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
      let projectId = row.getAttribute('data-project-id');
      if (!projectId) {
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

  // --- MOBILE CAROUSEL PATCH ---
  function renderMobileProjectList() {
    const mobileList = document.querySelector('.mobile-project-list');
    if (!mobileList) return;
    const isMobile = window.innerWidth <= 740;
    if (!isMobile) {
      mobileList.innerHTML = "";
      mobileList.style.display = "none";
      return;
    }
    // Always re-render on mobile
    const projects = document.querySelectorAll('.project-row.item');
    mobileList.innerHTML = "";
    projects.forEach(row => {
      const title = row.querySelector('.project-title')?.textContent || "";
      const year = row.querySelector('.project-year')?.textContent || "";
      let images = [];
      try {
        images = JSON.parse(row.getAttribute("data-images") || "[]");
      } catch (e) {}
      const block = document.createElement('div');
      block.className = "mobile-project-block";
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

      // Minimalistic arrows (‹ and ›) if multiple images
      if (images.length > 1) {
        const arrowLeft = document.createElement('span');
        arrowLeft.className = "carousel-arrow-indicator left";
        arrowLeft.textContent = "‹";
        arrowLeft.style.opacity = "0.25";
        arrowLeft.style.pointerEvents = "none";
        block.appendChild(arrowLeft);

        const arrowRight = document.createElement('span');
        arrowRight.className = "carousel-arrow-indicator right";
        arrowRight.textContent = "›";
        block.appendChild(arrowRight);

        arrowLeft.addEventListener('click', function(e) {
          e.stopPropagation();
          const img = carousel.querySelector('img');
          if (!img) return;
          carousel.scrollBy({ left: -img.offsetWidth, behavior: 'smooth' });
        });
        arrowRight.addEventListener('click', function(e) {
          e.stopPropagation();
          const img = carousel.querySelector('img');
          if (!img) return;
          carousel.scrollBy({ left: img.offsetWidth, behavior: 'smooth' });
        });
        carousel.addEventListener('scroll', function() {
          const maxScroll = carousel.scrollWidth - carousel.clientWidth - 2;
          if (carousel.scrollLeft > 5) {
            arrowLeft.style.opacity = "0.7";
            arrowLeft.style.pointerEvents = "auto";
          } else {
            arrowLeft.style.opacity = "0.25";
            arrowLeft.style.pointerEvents = "none";
          }
          if (carousel.scrollLeft >= maxScroll - 5) {
            arrowRight.style.opacity = "0.25";
            arrowRight.style.pointerEvents = "none";
          } else {
            arrowRight.style.opacity = "0.7";
            arrowRight.style.pointerEvents = "auto";
          }
        });
      }

      block.appendChild(carousel);
      mobileList.appendChild(block);
    });
    mobileList.style.display = "block";
  }

  renderMobileProjectList();
  window.addEventListener("resize", renderMobileProjectList);
  window.addEventListener("orientationchange", renderMobileProjectList);

  function activateProjectFromHash() {
    if (window.location.hash.startsWith('#project-')) {
      const projectId = decodeURIComponent(window.location.hash.replace('#project-', ''));
      let row = document.querySelector('.project-row.item[data-project-id="' + projectId + '"]');
      if (!row) {
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
  activateProjectFromHash();
});