FB.widgets.register("dataTable", {
  label: "Data Table",
  icon: "\u25A6",
  iconBg: "#1a2a1a",
  iconColor: "#CDFE00",
  category: "content",
  defaultProps: {
    csvData:
      "Name,Role,Location\nAlice,Designer,London\nBob,Developer,Berlin\nCarol,Strategist,Paris",
    sortable: true,
    striped: true,
    headerBg: "#1a1a1a",
    headerTextColor: "#f7f6f2",
    bg: "#111111",
    textColor: "#f7f6f2",
    accentColor: "#CDFE00",
    borderColor: "rgba(255,255,255,0.1)",
    paddingV: 64,
    paddingH: 48,
  },
  render: function (p) {
    var esc = function (v) {
      return v !== undefined && v !== null
        ? String(v)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
        : "";
    };
    var csv = p.csvData || "";
    var bg = p.bg || "#111111";
    var color = p.textColor || "#f7f6f2";
    var accent = p.accentColor || "#CDFE00";
    var hdrBg = p.headerBg || "#1a1a1a";
    var hdrColor = p.headerTextColor || color;
    var evenBg = p.rowEvenBg || "rgba(255,255,255,0.03)";
    var oddBg = p.rowOddBg || "transparent";
    var borderColor = p.borderColor || "rgba(255,255,255,0.1)";
    var sortable = p.sortable !== false;
    var striped = p.striped !== false;

    var lines = csv
      .split("\n")
      .map(function (l) {
        return l.trim();
      })
      .filter(function (l) {
        return l.length > 0;
      });
    if (lines.length < 2) {
      return (
        '<div class="fw-data-table" style="background:' +
        bg +
        ";color:" +
        color +
        '">' +
        '<div class="fw-data-table-empty">Paste CSV data in the edit panel to build your table</div>' +
        "</div>"
      );
    }

    var headers = FB.widgets._parseCSVLine(lines[0]);
    var rows = [];
    for (var i = 1; i < lines.length; i++) {
      rows.push(FB.widgets._parseCSVLine(lines[i]));
    }

    var tableId = "fw-dt-" + Math.random().toString(36).substr(2, 6);
    var html =
      '<div class="fw-data-table" style="background:' +
      bg +
      ";color:" +
      color +
      ";border:1px solid " +
      borderColor +
      ';border-radius:8px;overflow:hidden">' +
      '<table id="' +
      tableId +
      '" style="border-collapse:collapse;width:100%">' +
      "<thead><tr>";

    for (var c = 0; c < headers.length; c++) {
      html +=
        '<th data-col="' +
        c +
        '" style="background:' +
        hdrBg +
        ";color:" +
        hdrColor +
        ";padding:12px 16px;text-align:left;font-weight:600;" +
        (sortable ? "cursor:pointer;user-select:none" : "") +
        '"' +
        (sortable
          ? " onclick=\"FB.widgets._sortTable('" + tableId + "'," + c + ')"'
          : "") +
        ">" +
        esc(headers[c]) +
        (sortable ? ' <span class="fw-sort-icon">\u2195</span>' : "") +
        "</th>";
    }
    html += "</tr></thead><tbody>";

    for (var r = 0; r < rows.length; r++) {
      var row = rows[r];
      var rowBg = striped && r % 2 === 1 ? evenBg : oddBg;
      html += '<tr style="background:' + rowBg + '">';
      for (var c = 0; c < headers.length; c++) {
        html +=
          "<td style='padding:10px 16px;border-bottom:1px solid " +
          borderColor +
          "'>" +
          esc(row[c] || "") +
          "</td>";
      }
      html += "</tr>";
    }

    html +=
      "</tbody></table>" +
      '<div class="fw-data-table-row-count" style="padding:8px 16px;color:' +
      color +
      '">Showing ' +
      rows.length +
      " rows</div>" +
      "</div>";

    return html;
  },
  editPanel: function (id, p) {
    var csv = p.csvData || "";
    var esc = function (v) {
      return v !== undefined && v !== null
        ? String(v)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
        : "";
    };
    return (
      '<div class="rp-row"><label>CSV Data</label>' +
      '<textarea rows="8" placeholder="Paste CSV here...\nHeader1,Header2,Header3\nVal1,Val2,Val3" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','csvData',this.value)\">" +
      esc(csv) +
      "</textarea>" +
      '<div style="font-size:0.8rem;opacity:0.5;margin-top:4px">First row = column headers. Paste from Excel/Sheets.</div>' +
      "</div>" +
      '<div class="rp-row"><label>' +
      '<input type="checkbox"' +
      (p.sortable !== false ? " checked" : "") +
      " onclick=\"FB.panels.updateWidgetProp('" +
      id +
      "','sortable',this.checked)\" /> Sortable columns</label></div>" +
      '<div class="rp-row"><label>' +
      '<input type="checkbox"' +
      (p.striped !== false ? " checked" : "") +
      " onclick=\"FB.panels.updateWidgetProp('" +
      id +
      "','striped',this.checked)\" /> Striped rows</label></div>" +
      '<div class="rp-row"><label>Header Background</label>' +
      '<input type="color" value="' +
      esc(p.headerBg || "#1a1a1a") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','headerBg',this.value)\" /></div>" +
      '<div class="rp-row"><label>Header Text Color</label>' +
      '<input type="color" value="' +
      esc(p.headerTextColor || p.textColor || "#f7f6f2") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','headerTextColor',this.value)\" /></div>"
    );
  },
});

FB.widgets._parseCSVLine = function (line) {
  var result = [];
  var current = "";
  var inQuotes = false;
  for (var i = 0; i < line.length; i++) {
    var ch = line[i];
    if (ch === '"') {
      inQuotes = !inQuotes;
    } else if (ch === "," && !inQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += ch;
    }
  }
  result.push(current.trim());
  return result;
};

FB.widgets._sortTable = function (tableId, colIndex) {
  var table = document.getElementById(tableId);
  if (!table) return;
  var tbody = table.querySelector("tbody");
  if (!tbody) return;
  var rows = Array.from(tbody.querySelectorAll("tr"));
  var header = table.querySelector("thead th[data-col='" + colIndex + "']");
  if (!header) return;

  var asc = header.classList.contains("fw-sort-asc");
  table.querySelectorAll("thead th").forEach(function (th) {
    th.classList.remove("fw-sort-asc", "fw-sort-desc");
  });
  header.classList.add(asc ? "fw-sort-desc" : "fw-sort-asc");

  table.querySelectorAll("thead th .fw-sort-icon").forEach(function (icon) {
    icon.textContent = "\u2195";
  });
  header.querySelector(".fw-sort-icon").textContent = asc ? "\u2193" : "\u2191";

  rows.sort(function (a, b) {
    var aVal = (a.cells[colIndex] ? a.cells[colIndex].textContent : "").trim();
    var bVal = (b.cells[colIndex] ? b.cells[colIndex].textContent : "").trim();
    var aNum = parseFloat(aVal);
    var bNum = parseFloat(bVal);
    if (!isNaN(aNum) && !isNaN(bNum)) {
      return asc ? bNum - aNum : aNum - bNum;
    }
    return asc ? bVal.localeCompare(aVal) : aVal.localeCompare(bVal);
  });

  rows.forEach(function (row) {
    tbody.appendChild(row);
  });
};
