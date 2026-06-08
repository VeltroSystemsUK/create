// Education Book Ingestion Widget
// Upload books → AI generates courses → populate canvas with education blocks

FB.education = FB.education || {};
FB.education._books = [];
FB.education._generating = false;
FB.education._recentCourse = null;

// ── API Helpers ──

FB.education._api = function (endpoint, options) {
  var base = '/api/education';
  return fetch(base + endpoint, options).then(function (r) {
    return r.json().then(function (data) {
      if (!r.ok) throw new Error(data.error || data.details || 'Request failed');
      return data;
    });
  });
};

FB.education.getApiKey = function () {
  return FB.ai ? FB.ai.getApiKey() : null;
};

// ── Upload Book ──

FB.education.uploadBook = function (file, onProgress, onDone, onError) {
  var formData = new FormData();
  formData.append('file', file);
  formData.append('bookName', file.name.replace(/\.[^.]+$/, ''));

  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/api/education/upload');

  xhr.upload.onprogress = function (e) {
    if (e.lengthComputable && onProgress) {
      onProgress(Math.round((e.loaded / e.total) * 100));
    }
  };

  xhr.onload = function () {
    try {
      var data = JSON.parse(xhr.responseText);
      if (xhr.status === 200 && data.success) {
        if (onDone) onDone(data.book);
      } else {
        if (onError) onError(data.error || 'Upload failed');
      }
    } catch (e) {
      if (onError) onError('Invalid server response');
    }
  };

  xhr.onerror = function () {
    if (onError) onError('Network error — is the server running?');
  };

  xhr.send(formData);
};

// ── Load Book List ──

FB.education.loadBooks = function (onDone) {
  FB.education._api('/books')
    .then(function (data) {
      FB.education._books = data.books || [];
      if (onDone) onDone(FB.education._books);
    })
    .catch(function (err) {
      console.error('Failed to load books:', err);
      FB.education._books = [];
      if (onDone) onDone([]);
    });
};

// ── Parse Book ──

FB.education.parseBook = function (bookId) {
  return FB.education._api('/parse/' + bookId, { method: 'POST' });
};

// ── Generate Course ──

FB.education.generateCourse = function (bookId, onProgress, onDone, onError) {
  var apiKey = FB.education.getApiKey();
  if (!apiKey) {
    if (onError) onError('No Anthropic API key configured. Add one in Settings.');
    return;
  }

  if (onProgress) onProgress('Parsing book content...');

  FB.education.parseBook(bookId)
    .then(function () {
      if (onProgress) onProgress('Generating course with AI...');
      return FB.education._api('/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookId: bookId, apiKey: apiKey })
      });
    })
    .then(function (data) {
      if (onDone) onDone(data.course, data);
    })
    .catch(function (err) {
      if (onError) onError(err.message);
    });
};

// ── Delete Book ──

FB.education.deleteBook = function (bookId, onDone) {
  FB.education._api('/books/' + bookId, { method: 'DELETE' })
    .then(function () { if (onDone) onDone(); })
    .catch(function (err) { console.error('Delete failed:', err); if (onDone) onDone(); });
};

// ── Populate Canvas with Course ──

FB.education.populateCanvas = function (course) {
  if (!course || !course.modules) return;

  FB.state.blocks = [];
  var blocks = [];

  // 1. Course Hero
  blocks.push({
    type: 'courseHero',
    props: {
      courseTitle: course.title || 'Course Title',
      courseDescription: course.description || '',
      instructorName: (course.instructor && course.instructor.name) || '',
      instructorTitle: (course.instructor && course.instructor.title) || '',
      instructorImage: (course.instructor && course.instructor.image) || '',
      duration: course.duration || '',
      lessons: String(course.modules.length) + ' modules',
      level: course.level || 'All Levels',
      price: 'Free',
      bg: '#0f172a',
      textColor: '#f1f5f9',
      accentColor: '#3b82f6'
    }
  });

  // 2. Learning Objectives
  if (course.learningObjectives && course.learningObjectives.length) {
    blocks.push({
      type: 'objectives',
      props: {
        title: 'What You\'ll Learn',
        objectives: course.learningObjectives,
        bg: '#0f172a',
        textColor: '#f1f5f9',
        accentColor: '#3b82f6'
      }
    });
  }

  // 3. Curriculum Outline
  var curriculumModules = (course.modules || []).map(function (m) {
    return { title: m.title, lessons: 4, duration: m.estimatedTime || '15 min' };
  });

  blocks.push({
    type: 'curriculum',
    props: {
      courseName: course.title || '',
      modules: curriculumModules,
      totalDuration: course.duration || '',
      totalLessons: course.modules.length * 4,
      bg: '#0f172a',
      textColor: '#f1f5f9',
      accentColor: '#3b82f6'
    }
  });

  // 4. Four-Tier Module Blocks — for each module, render all four tiers
  (course.modules || []).forEach(function (mod, idx) {
    var moduleNum = idx + 1;

    // Tier 1: HOOK — So What metric + premise
    if (mod.hook) {
      blocks.push({
        type: 'hookMetric',
        props: {
          soWhat: mod.hook.soWhat || '',
          premise: mod.hook.premise || '',
          moduleTitle: 'Module ' + moduleNum,
          bg: '#0f172a',
          textColor: '#f1f5f9',
          accentColor: '#3b82f6'
        }
      });
    }

    // Tier 2: ANCHOR — Core concepts
    if (mod.anchor && mod.anchor.concepts) {
      mod.anchor.concepts.forEach(function (concept) {
        blocks.push({
          type: 'conceptAnchor',
          props: {
            conceptName: concept.name || '',
            definition: concept.definition || '',
            keyInsight: concept.keyInsight || '',
            analogy: mod.anchor.analogy || '',
            doneRight: (mod.anchor.inPractice && mod.anchor.inPractice.doneRight) || '',
            doneWrong: (mod.anchor.inPractice && mod.anchor.inPractice.doneWrong) || '',
            bg: '#0f172a',
            textColor: '#f1f5f9',
            accentColor: '#3b82f6'
          }
        });
      });
    }

    // Tier 3: ARENA — Branching scenario
    if (mod.arena && mod.arena.scenario) {
      var sc = mod.arena.scenario;
      blocks.push({
        type: 'scenarioSandbox',
        props: {
          role: sc.role || '',
          situation: sc.situation || '',
          options: (sc.options || []).map(function (o) {
            return { label: o.label, text: o.text, isCorrect: o.isCorrect, impactTwist: o.impactTwist || '' };
          }),
          bg: '#0f172a',
          textColor: '#f1f5f9',
          accentColor: '#3b82f6'
        }
      });
    }

    // Tier 4: PROOF — Quiz + micro-credential
    if (mod.proof) {
      blocks.push({
        type: 'microCredential',
        props: {
          credentialName: mod.proof.microCredential || ('+X Module ' + moduleNum + ' Skill'),
          questions: (mod.proof.questions || []).map(function (q) {
            return {
              question: q.question,
              options: q.options || [],
              correctIndex: q.correctIndex || 0,
              explanation: q.explanation || ''
            };
          }),
          passingScore: 70,
          bg: '#0f172a',
          textColor: '#f1f5f9',
          accentColor: '#3b82f6'
        }
      });
    }
  });

  // 5. Instructor Bio
  if (course.instructor && (course.instructor.name || course.instructor.bio)) {
    blocks.push({
      type: 'instructorBio',
      props: {
        instructorName: course.instructor.name || 'Instructor',
        title: course.instructor.title || '',
        bio: course.instructor.bio || '',
        image: course.instructor.image || '',
        expertise: [],
        bg: '#0f172a',
        textColor: '#f1f5f9',
        accentColor: '#3b82f6'
      }
    });
  }

  // Set blocks and render
  FB.state.blocks = blocks;
  FB.canvas.render();
  FB.pages.render();

  if (FB.util && FB.util.showToast) {
    FB.util.showToast('Course loaded: ' + blocks.length + ' blocks on canvas');
  }
};

// ── Build Book Ingestion Panel ──

FB.education.buildIngestionPanel = function () {
  var container = document.getElementById('book-ingestion');
  if (!container) return;

  container.innerHTML = '';

  // Upload zone
  var dropZone = document.createElement('div');
  dropZone.className = 'book-drop-zone';
  dropZone.innerHTML =
    '<div class="book-drop-icon">+</div>' +
    '<div class="book-drop-text">Drop book files here</div>' +
    '<div class="book-drop-hint">PDF, Markdown, TXT, EPUB</div>';

  var fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = '.pdf,.md,.txt,.epub';
  fileInput.style.display = 'none';
  fileInput.id = 'book-file-input';

  dropZone.onclick = function () { fileInput.click(); };

  dropZone.ondragover = function (e) {
    e.preventDefault();
    dropZone.classList.add('dragover');
  };

  dropZone.ondragleave = function () {
    dropZone.classList.remove('dragover');
  };

  dropZone.ondrop = function (e) {
    e.preventDefault();
    dropZone.classList.remove('dragover');
    var files = e.dataTransfer.files;
    if (files.length) FB.education._handleFileUpload(files[0]);
  };

  fileInput.onchange = function () {
    if (this.files.length) FB.education._handleFileUpload(this.files[0]);
  };

  container.appendChild(dropZone);
  container.appendChild(fileInput);

  // Upload button
  var uploadBtn = document.createElement('button');
  uploadBtn.className = 'book-upload-btn';
  uploadBtn.textContent = 'Select Book File';
  uploadBtn.onclick = function (e) { e.stopPropagation(); fileInput.click(); };
  container.appendChild(uploadBtn);

  // Status / progress area
  var statusArea = document.createElement('div');
  statusArea.className = 'book-status';
  statusArea.id = 'book-upload-status';
  container.appendChild(statusArea);

  // Book list
  var bookList = document.createElement('div');
  bookList.className = 'book-list';
  bookList.id = 'book-list';
  container.appendChild(bookList);

  // Load existing books
  FB.education._renderBookList();
};

FB.education._handleFileUpload = function (file) {
  var statusEl = document.getElementById('book-upload-status');
  if (!statusEl) return;

  statusEl.innerHTML = '<div class="book-progress">Uploading ' + escapeHTML(file.name) + '... <span class="book-progress-bar"><span id="upload-progress-fill"></span></span></div>';

  var fillEl = document.getElementById('upload-progress-fill');

  FB.education.uploadBook(file,
    function (pct) {
      if (fillEl) fillEl.style.width = pct + '%';
    },
    function (book) {
      statusEl.innerHTML = '<div class="book-success">' + escapeHTML(file.name) + ' uploaded.</div>';
      setTimeout(function () { FB.education._renderBookList(); }, 500);
    },
    function (err) {
      statusEl.innerHTML = '<div class="book-error">Error: ' + escapeHTML(err) + '</div>';
    }
  );
};

FB.education._renderBookList = function () {
  FB.education.loadBooks(function (books) {
    var listEl = document.getElementById('book-list');
    if (!listEl) return;

    if (!books.length) {
      listEl.innerHTML = '<div class="book-list-empty">No books uploaded yet</div>';
      return;
    }

    listEl.innerHTML = '';
    books.forEach(function (book) {
      var hasCourse = book.course_generated;
      var statusClass = hasCourse ? 'book-item-done' : 'book-item-pending';
      var statusLabel = hasCourse ? 'Course Ready' : 'Awaiting Generation';

      var item = document.createElement('div');
      item.className = 'book-item ' + statusClass;
      item.dataset.bookId = String(book.id);

      var icon = document.createElement('div');
      icon.className = 'book-item-icon';
      icon.textContent = hasCourse ? '\u2713' : '\uD83D\uDCDA';

      var info = document.createElement('div');
      info.className = 'book-item-info';

      var name = document.createElement('div');
      name.className = 'book-item-name';
      name.textContent = book.book_name || book.original_name || 'Untitled book';

      var meta = document.createElement('div');
      meta.className = 'book-item-meta';
      meta.textContent = formatSize(book.file_size) + ' · ' + statusLabel;

      info.appendChild(name);
      info.appendChild(meta);

      var actions = document.createElement('div');
      actions.className = 'book-item-actions';

      var primaryBtn = document.createElement('button');
      if (!hasCourse) {
        primaryBtn.className = 'book-generate-btn';
        primaryBtn.textContent = 'Generate Course';
        primaryBtn.onclick = function () { FB.education._onGenerateClick(book.id); };
      } else {
        primaryBtn.className = 'book-populate-btn';
        primaryBtn.textContent = 'Load to Canvas';
        primaryBtn.onclick = function () { FB.education._onPopulateClick(book.id); };
      }

      var deleteBtn = document.createElement('button');
      deleteBtn.className = 'book-delete-btn';
      deleteBtn.textContent = '×';
      deleteBtn.onclick = function () { FB.education._onDeleteClick(book.id); };

      actions.appendChild(primaryBtn);
      actions.appendChild(deleteBtn);
      item.appendChild(icon);
      item.appendChild(info);
      item.appendChild(actions);
      listEl.appendChild(item);
    });
  });
};

FB.education._saveApiKeyAndGenerate = function (bookId) {
  var input = document.getElementById('edu-api-key-input');
  if (input && input.value.trim()) {
    FB.ai.setApiKey(input.value.trim());
    FB.education._onGenerateClick(bookId);
  } else {
    alert('Please enter your Anthropic API key');
  }
};

FB.education._onGenerateClick = function (bookId) {
  var statusEl = document.getElementById('book-upload-status');
  if (!statusEl) return;
  var book = FB.education._books.find(function (b) { return b.id === bookId; });
  var bookName = (book && (book.book_name || book.original_name)) || 'book';

  var apiKey = FB.education.getApiKey();
  if (!apiKey) {
    // Show API key input dialog
    statusEl.innerHTML =
      '<div class="book-api-key-dialog" style="background:#1a1a1a;padding:20px;border-radius:8px;border:1px solid #333">' +
      '<div style="font-weight:600;margin-bottom:12px;color:#fff">🔑 Anthropic API Key Required</div>' +
      '<p style="font-size:12px;color:#888;margin:0 0 12px">Get your free key at <a href="https://console.anthropic.com/account/keys" target="_blank" style="color:#3b82f6">console.anthropic.com/account/keys</a></p>' +
      '<label for="edu-api-key-input" style="font-size:11px;color:#aaa;display:block;margin-bottom:6px">Paste your API key:</label>' +
      '<div style="display:flex;gap:8px">' +
      '<input id="edu-api-key-input" type="password" placeholder="sk-ant-..." style="flex:1;padding:10px;background:#0f0f0f;border:1px solid #444;border-radius:6px;color:#fff;font-size:12px">' +
      '<button onclick="FB.education._saveApiKeyAndGenerate(' + bookId + ')" style="padding:10px 16px;background:#3b82f6;color:#fff;border:none;border-radius:6px;cursor:pointer;font-size:12px;font-weight:500">Generate</button>' +
      '</div>' +
      '</div>';
    return;
  }

  statusEl.innerHTML = '<div class="book-progress">Parsing &amp; analyzing <strong>' + escapeHTML(bookName) + '</strong>... <span class="book-spinner"></span></div>';

  FB.education.generateCourse(bookId,
    function (status) {
      statusEl.innerHTML = '<div class="book-progress">' + escapeHTML(status) + ' <span class="book-spinner"></span></div>';
    },
    function (course, info) {
      FB.education._recentCourse = course;
      statusEl.innerHTML = '';

      var success = document.createElement('div');
      success.className = 'book-success';
      success.textContent = 'Course generated: ';

      var title = document.createElement('strong');
      title.textContent = course.title || 'Untitled course';
      success.appendChild(title);
      success.appendChild(document.createElement('br'));

      var stats = document.createElement('small');
      stats.textContent = ((info.stats && info.stats.modulesCount) || 0) + ' modules, ' + ((info.stats && info.stats.proofQuestions) || 0) + ' proof questions';
      success.appendChild(stats);

      var actions = document.createElement('div');
      actions.className = 'book-actions-row';

      var loadBtn = document.createElement('button');
      loadBtn.className = 'book-populate-btn';
      loadBtn.textContent = 'Load to Canvas';
      loadBtn.onclick = FB.education._onPopulateRecent;
      actions.appendChild(loadBtn);

      statusEl.appendChild(success);
      statusEl.appendChild(actions);
      FB.education._renderBookList();
    },
    function (err) {
      statusEl.innerHTML = '<div class="book-error">Generation failed: ' + escapeHTML(err) + '</div>';
    }
  );
};

FB.education._onPopulateClick = function (bookId) {
  var book = FB.education._books.find(function (b) { return b.id === bookId; });
  if (book && book.course_json) {
    try {
      var course = JSON.parse(book.course_json);
      FB.education.populateCanvas(course);
    } catch (e) {
      alert('Failed to load course data: ' + e.message);
    }
  }
};

FB.education._onPopulateRecent = function () {
  try {
    var course = FB.education._recentCourse;
    if (!course) throw new Error('No recent course is available');
    FB.education.populateCanvas(course);
  } catch (e) {
    alert('Failed to load course: ' + e.message);
  }
};

FB.education._onDeleteClick = function (bookId) {
  if (!confirm('Delete this book? This cannot be undone.')) return;
  FB.education.deleteBook(bookId, function () {
    FB.education._renderBookList();
  });
};

// ── Helpers ──

function formatSize(bytes) {
  if (!bytes) return '0 B';
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

function escapeHTML(value) {
  return String(value == null ? '' : value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// ── Widget Registration ──

FB.widgets.register('educationIngestion', {
  label: 'Book Ingestion',
  icon: '\uD83D\uDCDA',
  iconBg: '#1e40af',
  iconColor: '#93c5fd',
  category: 'education',
  defaultProps: {},
  render: function () {
    return '<div class="ingestion-widget-placeholder">' +
      '<div style="text-align:center;padding:2rem;color:#93c5fd;">' +
      '<div style="font-size:2rem;margin-bottom:0.5rem;">\uD83D\uDCDA</div>' +
      '<div style="font-weight:600;">Book Ingestion Active</div>' +
      '<div style="font-size:0.85rem;margin-top:0.5rem;opacity:0.7;">Upload books via the left panel to generate courses</div>' +
      '</div></div>';
  }
});
