FB.project = {
  currentProjectId: null,
  currentProjectName: "Untitled Project",
  apiUrl: "http://localhost:3001/api",

  // Save current project to backend
  async saveProject(name = null) {
    if (!name) {
      name = FB.project.currentProjectName;
      if (name === "Untitled Project") {
        name = prompt("Project name:", "My Project");
        if (!name || !name.trim()) return;
      }
    }

    FB.pages._save(); // Save current page state to FB.state

    const projectData = {
      name: name.trim(),
      content: {
        pages: FB.state.pages,
        currentPageId: FB.state.currentPageId,
      },
    };

    // Add ID if updating existing project
    if (FB.project.currentProjectId) {
      projectData.id = FB.project.currentProjectId;
    }

    try {
      const response = await fetch(`${FB.project.apiUrl}/projects`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(projectData),
      });

      if (!response.ok) {
        throw new Error("Save failed");
      }

      const result = await response.json();
      FB.project.currentProjectId = result.id;
      FB.project.currentProjectName = result.name;
      FB.project.updateTopBar();
      FB.util.showToast("✓ Project saved: " + result.name);
    } catch (err) {
      console.error("Error saving project:", err);
      FB.util.showToast("✗ Failed to save project");
    }
  },

  // Load project from backend
  async loadProject(projectId) {
    try {
      const response = await fetch(
        `${FB.project.apiUrl}/projects/${projectId}`
      );

      if (!response.ok) {
        throw new Error("Load failed");
      }

      const project = await response.json();

      // Restore state
      FB.state.pages = project.content.pages || [];
      FB.state.currentPageId = project.content.currentPageId;

      // Ensure metadata on pages
      FB.state.pages.forEach(function (page) {
        FB.pages._ensureMetadata(page);
      });

      var cur = FB.pages.current();
      if (cur) {
        FB.state.blocks = JSON.parse(JSON.stringify(cur.blocks));
      }

      // Update project tracking
      FB.project.currentProjectId = project.id;
      FB.project.currentProjectName = project.name;
      FB.project.updateTopBar();

      // Render UI
      FB.canvas.render();
      FB.pages.render();
      FB.panels.renderRightPanel();

      FB.util.showToast("✓ Project loaded: " + project.name);
    } catch (err) {
      console.error("Error loading project:", err);
      FB.util.showToast("✗ Failed to load project");
    }
  },

  // List all projects from backend
  async listProjects() {
    try {
      const response = await fetch(`${FB.project.apiUrl}/projects`);

      if (!response.ok) {
        throw new Error("List failed");
      }

      return await response.json();
    } catch (err) {
      console.error("Error listing projects:", err);
      FB.util.showToast("✗ Failed to fetch projects");
      return [];
    }
  },

  // Delete project from backend
  async deleteProject(projectId) {
    try {
      const response = await fetch(
        `${FB.project.apiUrl}/projects/${projectId}`,
        { method: "DELETE" }
      );

      if (!response.ok) {
        throw new Error("Delete failed");
      }

      FB.util.showToast("✓ Project deleted");
      return true;
    } catch (err) {
      console.error("Error deleting project:", err);
      FB.util.showToast("✗ Failed to delete project");
      return false;
    }
  },

  // Show save dialog
  showSaveDialog() {
    const currentName = FB.project.currentProjectName;
    const name = prompt(
      "Save project as:",
      currentName === "Untitled Project" ? "" : currentName
    );
    if (name && name.trim()) {
      FB.project.saveProject(name.trim());
    }
  },

  // Show load dialog modal
  async showLoadDialog() {
    const projects = await FB.project.listProjects();

    if (projects.length === 0) {
      FB.util.showToast("No saved projects yet");
      return;
    }

    // Create modal
    const modal = document.createElement("div");
    modal.className = "project-load-modal";
    modal.innerHTML = `
      <div class="project-load-dialog">
        <h2>Load Project</h2>
        <div class="project-list">
          ${projects
            .map(
              (p) => `
            <div class="project-item" data-project-id="${p.id}">
              <div class="project-info">
                <div class="project-name">${p.name}</div>
                <div class="project-date">${new Date(p.updated_at).toLocaleDateString()}</div>
              </div>
              <button class="project-delete-btn" onclick="event.stopPropagation();FB.project._confirmDelete(${p.id})">✕</button>
            </div>
          `
            )
            .join("")}
        </div>
        <button class="project-modal-close" onclick="FB.project._closeModal()">Cancel</button>
      </div>
    `;

    document.body.appendChild(modal);

    // Add click handlers for load
    modal.querySelectorAll(".project-item").forEach(function (el) {
      el.addEventListener("click", function () {
        const projectId = parseInt(this.dataset.projectId, 10);
        FB.project._closeModal();
        FB.project.loadProject(projectId);
      });
    });
  },

  // Confirm delete
  _confirmDelete(projectId) {
    if (
      confirm(
        "Delete this project? This cannot be undone."
      )
    ) {
      FB.project.deleteProject(projectId).then(function (success) {
        if (success) {
          FB.project.showLoadDialog();
        }
      });
    }
  },

  // Close modal
  _closeModal() {
    const modal = document.querySelector(".project-load-modal");
    if (modal) {
      modal.remove();
    }
  },

  // Update top bar with current project name
  updateTopBar() {
    const bar = document.getElementById("topbar");
    if (!bar) return;

    let projectLabel = bar.querySelector(".project-name-label");
    if (!projectLabel) {
      projectLabel = document.createElement("span");
      projectLabel.className = "project-name-label";
      bar.style.justifyContent = "space-between";
      const logo = bar.querySelector(".logo");
      if (logo) {
        logo.parentElement.insertBefore(projectLabel, logo.nextSibling);
      }
    }

    projectLabel.textContent = FB.project.currentProjectName;
  },
};
