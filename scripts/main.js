// main.js for interactive portfolio

// -- Portfolio preview and hover logic --
document.addEventListener('DOMContentLoaded', function () {
  const items = document.querySelectorAll('.project-row.item');
  const previewArea = document.getElementById('preview-area');
  const hoverPreview = document.getElementById('hover-preview');
  const hoverScrollable = document.getElementById('hover-scrollable');
  const fullPreview = document.getElementById('full-preview');
  const fullScrollable = document.getElementById('full-scrollable');
  const descHeader = document.getElementById('project-description');

  let activeIndex = -1;
  let hoverTimeout = null;

  function showHover(item) {
    const images = JSON.parse(item.getAttribute('data-images'));
    hoverScrollable.innerHTML = images.map(src => `<img src="${src}" alt="preview" />`).join('');
    hoverPreview.style.display = 'block';
    fullPreview.style.display = 'none';
    descHeader.textContent = item.getAttribute('data-description') || '';
  }

  function showFull(item) {
    const images = JSON.parse(item.getAttribute('data-images'));
    fullScrollable.innerHTML = images.map(src => `<img src="${src}" alt="full preview" />`).join('');
    fullPreview.style.display = 'block';
    hoverPreview.style.display = 'none';
    descHeader.textContent = item.getAttribute('data-description') || '';
  }

  items.forEach((item, i) => {
    item.addEventListener('mouseenter', () => {
      if (activeIndex === i) return;
      item.classList.add('hovering');
      showHover(item);
      activeIndex = -1;
    });
    item.addEventListener('mouseleave', () => {
      item.classList.remove('hovering');
      hoverPreview.style.display = 'none';
      descHeader.textContent = '';
    });
    item.addEventListener('click', () => {
      items.forEach(it => it.classList.remove('active'));
      item.classList.add('active');
      showFull(item);
      activeIndex = i;
    });
  });

  // Hide preview when mouse leaves preview area
  previewArea.addEventListener('mouseleave', () => {
    hoverPreview.style.display = 'none';
    if (activeIndex === -1) descHeader.textContent = '';
  });
});