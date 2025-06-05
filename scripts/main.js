document.addEventListener('DOMContentLoaded', function () {
  const items = document.querySelectorAll('.item');
  const hoverPreview = document.getElementById('hover-preview');
  const hoverScrollable = document.getElementById('hover-scrollable');
  const fullPreview = document.getElementById('full-preview');
  const fullScrollable = document.getElementById('full-scrollable');
  const projectDescription = document.getElementById('project-description');
  const brandLink = document.getElementById('brand-link');
  let activeIndex = null;

  function clearHoverAndActive(exceptIdx = null) {
    items.forEach((el, idx) => {
      if (exceptIdx === null || idx !== exceptIdx) {
        el.classList.remove('hovering');
        el.classList.remove('active');
      }
    });
  }

  function showFullPreviewForIndex(idx) {
    if (typeof idx !== "number" || idx < 0 || idx >= items.length) return;
    const item = items[idx];
    projectDescription.textContent = item.dataset.description || 'A short project description goes here.';
    fullScrollable.innerHTML = '';
    const images = JSON.parse(item.dataset.images || '[]');
    images.forEach(src => {
      const img = document.createElement('img');
      img.src = src;
      img.alt = '';
      fullScrollable.appendChild(img);
    });
    fullPreview.style.display = images.length > 0 ? 'flex' : 'none';
    hoverPreview.style.display = 'none';
  }

  items.forEach((item, idx) => {
    item.addEventListener('mouseenter', function () {
      if (activeIndex !== idx) {
        clearHoverAndActive(activeIndex);
        item.classList.add('hovering');
        const images = JSON.parse(item.dataset.images || '[]');
        hoverScrollable.innerHTML = '';
        if (images.length > 0) {
          const img = document.createElement('img');
          img.src = images[0];
          img.alt = '';
          hoverScrollable.appendChild(img);
          hoverPreview.style.display = 'flex';
        } else {
          hoverPreview.style.display = 'none';
        }
        fullPreview.style.display = 'none';
        projectDescription.textContent = '';
      }
    });

    item.addEventListener('mouseleave', function () {
      if (activeIndex !== idx) {
        item.classList.remove('hovering');
        hoverPreview.style.display = 'none';
        // Show back the previously active full preview and description
        if (activeIndex !== null) {
          showFullPreviewForIndex(activeIndex);
        } else {
          fullPreview.style.display = 'none';
          projectDescription.textContent = '';
        }
      }
    });

    item.addEventListener('click', function () {
      clearHoverAndActive(idx);
      item.classList.add('active');
      activeIndex = idx;
      showFullPreviewForIndex(idx);
      hoverPreview.style.display = 'none';
    });
  });

  // Brand link resets everything
  brandLink.addEventListener('click', function (e) {
    e.preventDefault();
    clearHoverAndActive();
    activeIndex = null;
    hoverPreview.style.display = 'none';
    fullPreview.style.display = 'none';
    projectDescription.textContent = '';
    fullScrollable.innerHTML = '';
    hoverScrollable.innerHTML = '';
  });

  // On load: nothing is shown
  hoverPreview.style.display = 'none';
  fullPreview.style.display = 'none';
  projectDescription.textContent = '';
});