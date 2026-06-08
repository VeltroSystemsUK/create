FB.media = (function() {
  let currentFilter = 'all';
  let mediaItems = [];

  function init() {
    loadMedia();
    setupCanvasDropZone();
  }

  function loadMedia() {
    // Load from server
    fetch('/api/media')
      .then(r => r.json())
      .then(files => {
        mediaItems = files.map(file => {
          // Get metadata from localStorage
          const stored = localStorage.getItem('veltro_media_' + file.name) || '{}';
          const meta = JSON.parse(stored);
          return {
            id: 'media-' + file.name,
            name: file.originalName || file.name,
            type: getTypeFromName(file.name),
            category: meta.category || categorizeFileName(file.name),
            url: '/api/media/' + file.name,
            size: file.size,
            tags: meta.tags || [],
            createdAt: file.addedAt
          };
        });
        renderGrid();
        console.log('📚 Loaded ' + mediaItems.length + ' media items');
      })
      .catch(err => {
        console.warn('Failed to load media:', err);
        loadMediaOffline();
      });
  }

  function loadMediaOffline() {
    const stored = localStorage.getItem('veltro_media_library');
    if (stored) {
      mediaItems = JSON.parse(stored);
      renderGrid();
    }
  }

  function saveMedia() {
    localStorage.setItem('veltro_media_library', JSON.stringify(mediaItems));
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
        oncontextmenu="FB.media.showTagMenu(event, '${item.id}')"
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
        title="${item.name}${item.tags ? '\nTags: ' + item.tags.join(', ') : ''}"
      >
        ${item.type.startsWith('image') ? `<img src="${item.url}" style="max-width: 100%; max-height: 60px; object-fit: contain;">` :
          item.type.startsWith('video') ? `<span style="font-size: 24px">🎬</span>` :
          `<span style="font-size: 24px">📁</span>`}
        <div style="position: absolute; bottom: 2px; right: 2px; font-size: 10px; color: #999">${item.category}</div>
        ${item.tags && item.tags.length > 0 ? `<div style="position: absolute; top: 2px; left: 2px; font-size: 8px; background: #444; padding: 2px 4px; border-radius: 2px; color: #ccc">${item.tags[0]}</div>` : ''}
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

  function setupCanvasDropZone() {
    const canvas = document.getElementById('ds-canvas');
    if (!canvas) return;

    const wrapper = document.getElementById('ds-canvas-wrap');
    if (!wrapper) return;

    wrapper.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'copy';
      wrapper.style.opacity = '0.7';
    });

    wrapper.addEventListener('dragleave', () => {
      wrapper.style.opacity = '1';
    });

    wrapper.addEventListener('drop', (e) => {
      e.preventDefault();
      wrapper.style.opacity = '1';

      try {
        const data = JSON.parse(e.dataTransfer.getData('application/json'));
        if (data.type === 'media') {
          insertMediaToCanvas(data.media, e);
        }
      } catch (err) {
        console.warn('Drop failed:', err);
      }
    });
  }

  function insertMediaToCanvas(media, dropEvent) {
    const fc = FB.design.canvas.get();
    if (!fc) return;

    const wrapper = document.getElementById('ds-canvas-wrap');
    const rect = wrapper.getBoundingClientRect();
    const canvasRect = document.getElementById('ds-canvas').getBoundingClientRect();

    // Calculate position relative to canvas
    const x = dropEvent.clientX - canvasRect.left;
    const y = dropEvent.clientY - canvasRect.top;

    if (media.type.startsWith('image')) {
      fabric.Image.fromURL(media.url, function(img) {
        img.set({
          left: x,
          top: y,
          scaleX: 0.5,
          scaleY: 0.5
        });
        fc.add(img);
        fc.setActiveObject(img);
        fc.renderAll();
        FB.design.history.push();
        console.log('📸 Inserted media: ' + media.name);
      });
    }
  }

  function handleUpload(event) {
    const files = Array.from(event.target.files);

    files.forEach(file => {
      const formData = new FormData();
      formData.append('file', file);

      fetch('/api/media', {
        method: 'POST',
        body: formData
      })
        .then(r => r.json())
        .then(result => {
          const item = {
            id: 'media-' + result.name,
            name: result.originalName || file.name,
            type: file.type,
            category: categorizeFile(file.type),
            url: '/api/media/' + result.name,
            size: file.size,
            tags: [],
            createdAt: new Date().toISOString()
          };

          // Save metadata to localStorage
          const meta = { category: item.category, tags: item.tags };
          localStorage.setItem('veltro_media_' + result.name, JSON.stringify(meta));

          mediaItems.push(item);
          renderGrid();
          console.log('✅ Media uploaded: ' + file.name);
        })
        .catch(err => {
          console.error('Upload failed:', err);
          alert('Failed to upload: ' + file.name);
        });
    });

    event.target.value = '';
  }

  function addTag(itemId, tag) {
    const item = mediaItems.find(m => m.id === itemId);
    if (item && tag && !item.tags.includes(tag)) {
      item.tags.push(tag);
      saveMeta(item);
      renderGrid();
    }
  }

  function removeTag(itemId, tag) {
    const item = mediaItems.find(m => m.id === itemId);
    if (item) {
      item.tags = item.tags.filter(t => t !== tag);
      saveMeta(item);
      renderGrid();
    }
  }

  function saveMeta(item) {
    const filename = item.id.replace('media-', '');
    const meta = { category: item.category, tags: item.tags };
    localStorage.setItem('veltro_media_' + filename, JSON.stringify(meta));
  }

  function showTagMenu(event, itemId) {
    event.preventDefault();
    const item = mediaItems.find(m => m.id === itemId);
    if (!item) return;

    const tag = prompt('Add tag (or leave empty to remove):', item.tags[0] || '');
    if (tag !== null) {
      if (tag === '') {
        item.tags = [];
      } else {
        item.tags = [tag];
      }
      saveMeta(item);
      renderGrid();
    }
  }

  function categorizeFile(mimeType) {
    if (mimeType.includes('image/svg')) return 'graphics';
    if (mimeType.includes('image')) return 'photos';
    if (mimeType.includes('video')) return 'videos';
    return 'other';
  }

  function getTypeFromName(filename) {
    const ext = filename.split('.').pop().toLowerCase();
    if (['svg', 'ai', 'eps'].includes(ext)) return 'image/svg+xml';
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) return 'image/' + ext;
    if (['mp4', 'webm', 'mov'].includes(ext)) return 'video/' + ext;
    return 'application/octet-stream';
  }

  function categorizeFileName(filename) {
    const type = getTypeFromName(filename);
    return categorizeFile(type);
  }

  return {
    init: init,
    filterCategory: filterCategory,
    dragStart: dragStart,
    handleUpload: handleUpload,
    addTag: addTag,
    removeTag: removeTag,
    showTagMenu: showTagMenu,
    loadMedia: loadMedia,
    setupCanvasDropZone: setupCanvasDropZone,
    insertMediaToCanvas: insertMediaToCanvas
  };
})();

// Initialize on load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', FB.media.init);
} else {
  FB.media.init();
}
