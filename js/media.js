FB.media = (function() {
  const config = {
    apiKey: "AIzaSyDOcnMAW8Et8cDHWsV-U9RxFsWqXpL5TAo",
    authDomain: "veltro-create.firebaseapp.com",
    projectId: "veltro-create",
    storageBucket: "veltro-create.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abcd1234"
  };

  let firebase = null;
  let currentFilter = 'all';
  let mediaItems = [];

  function init() {
    if (typeof window.firebase !== 'undefined') {
      firebase = window.firebase;
      loadMedia();
    }
  }

  function loadMedia() {
    // TODO: Load from Firebase
    renderGrid();
  }

  function filterCategory(category) {
    currentFilter = category;
    document.querySelectorAll('#lp-body-media .rp-btn').forEach(btn => {
      btn.style.opacity = btn.textContent.toLowerCase().includes(category.toLowerCase()) || category === 'all' ? '1' : '0.5';
    });
    renderGrid();
  }

  function renderGrid() {
    const grid = document.getElementById('media-library-grid');
    if (!grid) return;

    const filtered = currentFilter === 'all' ? mediaItems : mediaItems.filter(item => item.category === currentFilter);

    grid.innerHTML = filtered.map(item => `
      <div
        class="media-item"
        draggable="true"
        ondragstart="FB.media.dragStart(event, '${item.id}')"
        style="
          position: relative;
          padding: 6px;
          border: 1px solid #333;
          border-radius: 4px;
          cursor: move;
          background: #1a1a1a;
          min-height: 60px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        "
        title="${item.name}"
      >
        ${item.type.startsWith('image') ? `<img src="${item.url}" style="max-width: 100%; max-height: 60px; object-fit: contain;">` :
          item.type.startsWith('video') ? `<span style="font-size: 24px">🎬</span>` :
          `<span style="font-size: 24px">📁</span>`}
        <div style="position: absolute; bottom: 2px; right: 2px; font-size: 10px; color: #999">${item.category}</div>
      </div>
    `).join('');
  }

  function dragStart(event, itemId) {
    const item = mediaItems.find(m => m.id === itemId);
    event.dataTransfer.effectAllowed = 'copy';
    event.dataTransfer.setData('application/json', JSON.stringify({
      type: 'media',
      media: item
    }));
  }

  function handleUpload(event) {
    const files = Array.from(event.target.files);

    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const item = {
          id: 'media-' + Date.now() + Math.random(),
          name: file.name,
          type: file.type,
          category: categorizeFile(file.type),
          url: e.target.result,
          size: file.size,
          createdAt: new Date().toISOString()
        };

        mediaItems.push(item);
        // TODO: Upload to Firebase
        renderGrid();
      };
      reader.readAsDataURL(file);
    });

    // Reset input
    event.target.value = '';
  }

  function categorizeFile(mimeType) {
    if (mimeType.includes('image/svg')) return 'graphics';
    if (mimeType.includes('image')) return 'photos';
    if (mimeType.includes('video')) return 'videos';
    return 'other';
  }

  return {
    init: init,
    filterCategory: filterCategory,
    dragStart: dragStart,
    handleUpload: handleUpload,
    loadMedia: loadMedia
  };
})();

// Initialize on load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', FB.media.init);
} else {
  FB.media.init();
}
