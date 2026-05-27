FB.mediaGallery = {};

FB.mediaGallery._files = [];
FB.mediaGallery._folders = [];
FB.mediaGallery._activeFolder = null;
FB.mediaGallery._query = "";
FB.mediaGallery._pickMode = null;

FB.mediaGallery.init = function () {
  FB.mediaGallery._fetch();
};

FB.mediaGallery.refresh = function () {
  FB.mediaGallery._fetch();
};

FB.mediaGallery.pickFor = function (blockId, propKey) {
  FB.mediaGallery._pickMode = { blockId: blockId, propKey: propKey };
  FB.mediaGallery._render();
  var header = document.querySelector('[data-acc="media"]');
  if (header && !header.classList.contains("open")) {
    FB.panels.toggleLeftAccordion(header);
  }
};

FB.mediaGallery.pickWithCallback = function (fn) {
  FB.mediaGallery._pickMode = { callback: fn };
  FB.mediaGallery._render();
};

FB.mediaGallery._fetch = function () {
  fetch("/api/cms/media")
    .then(function (r) {
      return r.json();
    })
    .then(function (data) {
      FB.mediaGallery._files = data.media || [];
      FB.mediaGallery._folders = data.folders || [];
      FB.mediaGallery._render();
    })
    .catch(function () {
      FB.mediaGallery._render();
    });
};

FB.mediaGallery._filtered = function () {
  var files = FB.mediaGallery._files;
  if (FB.mediaGallery._activeFolder) {
    files = files.filter(function (f) {
      return f.folder === FB.mediaGallery._activeFolder;
    });
  }
  if (FB.mediaGallery._query) {
    var q = FB.mediaGallery._query.toLowerCase();
    files = files.filter(function (f) {
      return (
        (f.originalName || f.filename || "").toLowerCase().indexOf(q) !== -1
      );
    });
  }
  return files;
};

FB.mediaGallery._render = function () {
  var container = document.getElementById("media-library");
  if (!container) return;
  var html = "";

  if (FB.mediaGallery._pickMode) {
    var modeLabel = FB.mediaGallery._pickMode.propKey || "image";
    html +=
      '<div style="background:#6366f1;color:#fff;padding:5px 10px;font-size:10px;display:flex;justify-content:space-between;align-items:center">' +
      "<span>Click image to insert · " +
      modeLabel +
      "</span>" +
      '<button onclick="FB.mediaGallery._cancelPick()" style="background:none;border:none;color:#fff;cursor:pointer;font-size:12px;padding:0 4px">✕</button>' +
      "</div>";
  }

  html +=
    '<div style="padding:6px 8px 3px;display:flex;gap:4px">' +
    '<input id="mg-search" type="text" placeholder="Search images…" value="' +
    (FB.mediaGallery._query || "") +
    '" oninput="FB.mediaGallery._search(this.value)" ' +
    'style="flex:1;background:#111;border:1px solid #333;border-radius:4px;color:#ccc;font-size:10px;padding:3px 7px;height:24px">' +
    '<button onclick="document.getElementById(\'mg-file-input\').click()" title="Upload image" ' +
    'style="background:#222;border:1px solid #333;border-radius:4px;width:24px;height:24px;cursor:pointer;font-size:11px;color:#aaa">↑</button>' +
    '<input id="mg-file-input" type="file" accept="image/*" style="display:none" onchange="FB.mediaGallery._upload(this.files[0])">' +
    "</div>";

  var folders = FB.mediaGallery._folders;
  html +=
    '<div style="padding:3px 8px 5px;display:flex;gap:3px;flex-wrap:wrap">';
  html +=
    '<span onclick="FB.mediaGallery._setFolder(null)" style="cursor:pointer;padding:2px 8px;border-radius:10px;font-size:9px;' +
    (FB.mediaGallery._activeFolder === null
      ? "background:#6366f1;color:#fff;font-weight:600"
      : "background:#222;color:#666") +
    '">All</span>';
  folders.forEach(function (f) {
    html +=
      "<span onclick=\"FB.mediaGallery._setFolder('" +
      f.replace(/'/g, "\\'") +
      '\')" style="cursor:pointer;padding:2px 8px;border-radius:10px;font-size:9px;' +
      (FB.mediaGallery._activeFolder === f
        ? "background:#6366f1;color:#fff;font-weight:600"
        : "background:#222;color:#666") +
      '">' +
      f +
      "</span>";
  });
  html +=
    '<span onclick="FB.mediaGallery._promptFolder()" ' +
    'style="cursor:pointer;padding:2px 7px;border-radius:10px;font-size:9px;background:#1a1a1a;border:1px dashed #333;color:#444">+ folder</span>';
  html += "</div>";

  var filtered = FB.mediaGallery._filtered();
  if (filtered.length === 0) {
    html +=
      '<div style="padding:12px 8px;font-size:10px;color:#444;text-align:center">No images yet — upload or import from URL below.</div>';
  } else {
    html +=
      '<div style="padding:0 8px;display:grid;grid-template-columns:repeat(4,1fr);gap:3px">';
    filtered.forEach(function (file) {
      var isPick = !!FB.mediaGallery._pickMode;
      html +=
        '<div style="position:relative;aspect-ratio:1;border-radius:3px;overflow:hidden;cursor:pointer;background:#222" ' +
        "onclick=\"FB.mediaGallery._clickImage('" +
        file.id +
        "','" +
        file.url.replace(/'/g, "\\'") +
        '\')" title="' +
        (file.originalName || file.filename) +
        '">' +
        '<img src="' +
        file.url +
        '" style="width:100%;height:100%;object-fit:cover" loading="lazy">' +
        '<div style="position:absolute;inset:0;background:rgba(0,0,0,0.6);opacity:0;transition:opacity 0.15s;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px" ' +
        'onmouseenter="this.style.opacity=1" onmouseleave="this.style.opacity=0">' +
        (isPick
          ? '<span style="font-size:18px;color:#fff">✓</span>'
          : '<span style="font-size:10px;color:#fff">📋</span>') +
        "<button onclick=\"event.stopPropagation();FB.mediaGallery._assignFolder('" +
        file.id +
        '\')" style="font-size:8px;background:#333;border:none;color:#ccc;padding:1px 4px;border-radius:2px;cursor:pointer">folder</button>' +
        "<button onclick=\"event.stopPropagation();FB.mediaGallery._delete('" +
        file.id +
        '\')" style="font-size:8px;background:#6b2020;border:none;color:#fca5a5;padding:1px 4px;border-radius:2px;cursor:pointer">✕</button>' +
        "</div>" +
        "</div>";
    });
    html += "</div>";
    html +=
      '<div style="padding:3px 8px 4px;font-size:9px;color:#444;text-align:right">' +
      filtered.length +
      " image" +
      (filtered.length !== 1 ? "s" : "") +
      " · click = copy URL</div>";
  }

  html += '<div style="padding:5px 8px;border-top:1px solid #222">';
  html +=
    '<div style="font-size:8px;color:#555;font-weight:600;letter-spacing:0.4px;text-transform:uppercase;margin-bottom:4px">Import from URL</div>';
  html += '<div style="display:flex;gap:3px">';
  html +=
    '<input id="mg-url-input" type="text" placeholder="https://…" ' +
    'style="flex:1;background:#111;border:1px solid #333;border-radius:3px;color:#ccc;font-size:9px;padding:2px 6px;height:20px">';
  html +=
    '<button onclick="FB.mediaGallery._importFromInput()" title="Download to library" ' +
    'style="background:#6366f1;border:none;border-radius:3px;width:28px;height:20px;cursor:pointer;font-size:10px;color:#fff">↓</button>';
  html += "</div></div>";

  var sources = [
    {
      label: "Unsplash",
      url: "https://unsplash.com",
      color: "#60a5fa",
      bg: "#1e3a5f",
    },
    {
      label: "Pexels",
      url: "https://www.pexels.com",
      color: "#c084fc",
      bg: "#2d1b4e",
    },
    {
      label: "Pixabay",
      url: "https://pixabay.com",
      color: "#86efac",
      bg: "#1a2e1a",
    },
    {
      label: "Freepik",
      url: "https://www.freepik.com/free-photos-vectors/stock-image",
      color: "#fb923c",
      bg: "#2a1e1a",
    },
    {
      label: "StockSnap",
      url: "https://stocksnap.io",
      color: "#2dd4bf",
      bg: "#1a2a2a",
    },
  ];
  html += '<div style="padding:5px 8px 8px;border-top:1px solid #222">';
  html +=
    '<div style="font-size:8px;color:#555;font-weight:600;letter-spacing:0.4px;text-transform:uppercase;margin-bottom:4px">Free Image Sources</div>';
  sources.forEach(function (s) {
    html +=
      '<a href="' +
      s.url +
      '" target="_blank" rel="noopener" style="display:flex;justify-content:space-between;align-items:center;padding:4px 8px;border-radius:3px;margin-bottom:3px;background:' +
      s.bg +
      ";color:" +
      s.color +
      ';font-size:9px;text-decoration:none"><span>' +
      s.label +
      '</span><span style="opacity:0.5">↗</span></a>';
  });
  html += "</div>";

  container.innerHTML = html;
};

FB.mediaGallery._clickImage = function (id, url) {
  if (FB.mediaGallery._pickMode) {
    var mode = FB.mediaGallery._pickMode;
    FB.mediaGallery._pickMode = null;
    if (mode.callback) {
      mode.callback(url);
    } else {
      FB.panels.updateProp(mode.blockId, mode.propKey, url);
      if (FB.panels.renderRightPanel) FB.panels.renderRightPanel();
    }
    FB.mediaGallery._render();
    FB.util.showToast("Image inserted");
  } else {
    FB.mediaGallery._copyUrl(url);
  }
};

FB.mediaGallery._cancelPick = function () {
  FB.mediaGallery._pickMode = null;
  FB.mediaGallery._render();
};

FB.mediaGallery._copyUrl = function (url) {
  navigator.clipboard.writeText(url).then(function () {
    FB.util.showToast("📋 URL copied");
  });
};

FB.mediaGallery._setFolder = function (name) {
  FB.mediaGallery._activeFolder = name;
  FB.mediaGallery._render();
};

FB.mediaGallery._search = function (query) {
  FB.mediaGallery._query = query;
  FB.mediaGallery._render();
};

FB.mediaGallery._upload = function (file) {
  if (!file) return;
  var formData = new FormData();
  formData.append("file", file);
  FB.util.showToast("⏳ Uploading…");
  fetch("/api/cms/media/upload", { method: "POST", body: formData })
    .then(function (r) {
      return r.json();
    })
    .then(function (data) {
      if (data.success) {
        FB.util.showToast("🖼 Uploaded: " + (data.media.filename || file.name));
        FB.mediaGallery.refresh();
      } else {
        FB.util.showToast("❌ Upload failed");
      }
    })
    .catch(function () {
      FB.util.showToast("❌ Upload failed");
    });
};

FB.mediaGallery._importFromInput = function () {
  var inp = document.getElementById("mg-url-input");
  if (!inp) return;
  var url = inp.value.trim();
  if (!url) return;
  FB.mediaGallery._importUrl(url);
  inp.value = "";
};

FB.mediaGallery._importUrl = function (url) {
  FB.util.showToast("⏳ Downloading…");
  fetch("/api/cms/media/download", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url: url }),
  })
    .then(function (r) {
      return r.json();
    })
    .then(function (data) {
      if (data.success) {
        FB.util.showToast(
          "🖼 Imported: " + (data.media.originalName || "image"),
        );
        FB.mediaGallery.refresh();
      } else {
        FB.util.showToast(
          "❌ Import failed: " + (data.error || "unknown error"),
        );
      }
    })
    .catch(function () {
      FB.util.showToast("❌ Import failed");
    });
};

FB.mediaGallery._delete = function (id) {
  if (!confirm("Delete this image? This cannot be undone.")) return;
  fetch("/api/cms/media/" + encodeURIComponent(id), { method: "DELETE" })
    .then(function () {
      FB.mediaGallery.refresh();
    })
    .catch(function () {
      FB.util.showToast("❌ Delete failed");
    });
};

FB.mediaGallery._setMeta = function (id, patch) {
  fetch("/api/cms/media/" + encodeURIComponent(id), {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(patch),
  })
    .then(function () {
      FB.mediaGallery.refresh();
    })
    .catch(function () {
      FB.util.showToast("❌ Metadata update failed");
    });
};

FB.mediaGallery._assignFolder = function (id) {
  var folders = FB.mediaGallery._folders;
  if (!folders.length) {
    FB.util.showToast('Create a folder first using "+ folder"');
    return;
  }
  var folderName = prompt(
    "Move to folder:\n" + folders.join(", ") + "\n(leave blank to unfile)",
  );
  if (folderName === null) return;
  var target = folderName.trim() || null;
  if (target && folders.indexOf(target) === -1) {
    FB.util.showToast('Folder "' + target + '" does not exist');
    return;
  }
  FB.mediaGallery._setMeta(id, { folder: target });
};

FB.mediaGallery._createFolder = function (name) {
  fetch("/api/cms/media/folders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: name }),
  })
    .then(function (r) {
      return r.json();
    })
    .then(function (data) {
      if (data.success) {
        FB.mediaGallery.refresh();
      } else {
        FB.util.showToast("❌ " + (data.error || "Could not create folder"));
      }
    })
    .catch(function () {
      FB.util.showToast("❌ Folder creation failed");
    });
};

FB.mediaGallery._promptFolder = function () {
  var name = prompt("New folder name:");
  if (!name || !name.trim()) return;
  FB.mediaGallery._createFolder(name.trim());
};
