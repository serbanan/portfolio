document.addEventListener('DOMContentLoaded', function () {
    const items = document.querySelectorAll('.item');
    const previewImg = document.getElementById('preview-img');
    const previewArea = document.getElementById('preview-area');
    const fullContentArea = document.getElementById('full-content-area');
    const fullImg = document.getElementById('full-img');
    const closeBtn = document.getElementById('close-full-content');
  
    // Hide preview image on init
    previewImg.style.display = 'none';
  
    items.forEach(item => {
      // Show preview image on hover
      item.addEventListener('mouseenter', function () {
        previewImg.src = item.dataset.img;
        previewImg.style.display = 'block';
      });
      // Hide preview image when not hovering
      item.addEventListener('mouseleave', function () {
        previewImg.style.display = 'none';
      });
      // Show full content on click
      item.addEventListener('click', function () {
        fullImg.src = item.dataset.full;
        fullContentArea.style.display = 'flex';
      });
    });
  
    // Close full content area
    closeBtn.addEventListener('click', function () {
      fullContentArea.style.display = 'none';
      fullImg.src = '';
    });
  });