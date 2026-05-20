const defaults = {
  name: "FIRSTNAME LASTNAME",
  degree: "Degree Name",
  year: "2026/7",
  email: "f2022XXXX@pilani.bits-pilani.ac.in",
  mobile: "+91-XXXXXXXXXX",
  cgpa: "Y.XX",
  photoImage: "assets/image1.png",
  logoImage: "assets/image3.png",
  style: {
    bodySize: 8.9,
    bodyWeight: 400,
    bodyItalic: false,
    titleSize: 9.9,
    titleWeight: 800,
    titleItalic: false,
    itemSize: 8.9,
    itemWeight: 800,
    itemItalic: false,
    dateSize: 8.9,
    dateWeight: 800,
    dateItalic: false,
    bulletSize: 8.9,
    bulletWeight: 400,
    bulletItalic: false,
    lineSpacing: 1.28,
    sectionGap: 8,
    itemGap: 22
  },
  academics: [
    { course: "CLASS XII", specialization: "SCIENCE", institute: "Insti Name, City", board: "ISC", score: "XX.XX%", year: "202X/201X" },
    { course: "CLASS X", specialization: "GENERAL", institute: "Insti Name, City", board: "ICSE", score: "XX.00%/CGPA", year: "202X/201X" }
  ],
  experience: [
    {
      title: "Position Title",
      org: "Organisation Name",
      desc: "One Line Description of organisation",
      dates: "Start Month 202X - End Month 202X",
      bullets: "Single Line Point 1\nSingle Line Point 2\nSingle Line Point 3"
    }
  ],
  responsibility: [
    {
      title: "Position Title",
      org: "Organisation Name",
      dates: "Start Month 202X - End Month 202X/Present",
      bullets: "Single Line Point 1\nSingle Line Point 2\nSingle Line Point 3"
    }
  ],
  projects: [
    {
      title: "Title of Project/Publication/Achievement brief",
      dates: "Start Month 202X - End Month 202X/Present",
      bullets: "Single Line Point 1\nSingle Line Point 2"
    }
  ],
  activities: [
    { name: "Activity Name", desc: "Single Line Description" },
    { name: "Activity Name", desc: "Single Line Description" },
    { name: "Activity Name", desc: "Single Line Description" }
  ]
};

const samples = {
  ...defaults,
  name: "FIRSTNAME LASTNAME",
  degree: "Degree Name",
  year: "2027",
  email: "f2022XXXX@pilani.bits-pilani.ac.in",
  mobile: "+91-XXXXXXXXXX",
  cgpa: "8.10",
  experience: [
    {
      title: "Position Title",
      org: "Organisation Name",
      desc: "One Line Description of organisation",
      dates: "Jan 2026 - Present",
      bullets: "Single Line Point 1\nSingle Line Point 2\nSingle Line Point 3"
    }
  ],
  projects: [
    {
      title: "Title of Project/Publication/Achievement brief",
      dates: "Mar 2026 - Apr 2026",
      bullets: "Single Line Point 1\nSingle Line Point 2"
    }
  ]
};

const schemas = {
  academics: [
    ["course", "Course"],
    ["specialization", "Specialization"],
    ["institute", "Institute"],
    ["board", "Board"],
    ["score", "Score"],
    ["year", "Year"]
  ],
  experience: [
    ["title", "Position"],
    ["org", "Organisation"],
    ["desc", "One-line description"],
    ["dates", "Dates"],
    ["bullets", "Bullet points", "textarea"]
  ],
  responsibility: [
    ["title", "Position"],
    ["org", "Organisation"],
    ["dates", "Dates"],
    ["bullets", "Bullet points", "textarea"]
  ],
  projects: [
    ["title", "Title"],
    ["dates", "Dates"],
    ["bullets", "Bullet points", "textarea"]
  ],
  activities: [
    ["name", "Activity"],
    ["desc", "Description"]
  ]
};

const storageKey = "puResumeData";
const storageVersion = 12;

let state = loadState();

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey)) || {};
    if (saved._templateVersion !== storageVersion) {
      localStorage.removeItem(storageKey);
      return structuredClone(defaults);
    }
    delete saved._templateVersion;
    return mergeState(saved);
  } catch {
    return structuredClone(defaults);
  }
}

function saveState() {
  localStorage.setItem(storageKey, JSON.stringify({ ...state, _templateVersion: storageVersion }));
}

function mergeState(saved) {
  const merged = structuredClone(defaults);
  Object.assign(merged, saved);
  merged.style = { ...defaults.style, ...(saved.style || {}) };
  if (saved.style?.fontSize) merged.style.bodySize = saved.style.fontSize;
  if (saved.style?.fontWeight) merged.style.bodyWeight = saved.style.fontWeight;
  if (saved.style?.bodyBold) merged.style.bodyWeight = 700;
  Object.keys(schemas).forEach((section) => {
    if (!Array.isArray(merged[section])) merged[section] = structuredClone(defaults[section]);
  });
  return merged;
}

function esc(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function lines(value = "") {
  return String(value)
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function bindBasics() {
  document.querySelectorAll("#resumeForm [name]").forEach((input) => {
    if (input.closest(".repeat-card")) return;
    input.value = state[input.name] ?? "";
    input.addEventListener("input", () => {
      state[input.name] = input.value;
      saveState();
      renderResume();
    });
  });
}

function bindImageControls() {
  const photoUpload = document.getElementById("photoUpload");
  const logoUpload = document.getElementById("logoUpload");
  const resetPhoto = document.getElementById("resetPhoto");
  const resetLogo = document.getElementById("resetLogo");

  bindImageUpload(photoUpload, "photoImage");
  bindImageUpload(logoUpload, "logoImage");

  resetPhoto.onclick = () => {
    state.photoImage = defaults.photoImage;
    saveState();
    renderResume();
  };
  resetLogo.onclick = () => {
    state.logoImage = defaults.logoImage;
    saveState();
    renderResume();
  };
}

function bindImageUpload(input, key) {
  input.onchange = () => {
    const file = input.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      state[key] = reader.result;
      saveState();
      renderResume();
      input.value = "";
    };
    reader.readAsDataURL(file);
  };
}

function bindStyleControls() {
  const host = document.getElementById("styleControls");
  const groups = [
    ["body", "Body"],
    ["title", "Section titles"],
    ["item", "Item titles"],
    ["date", "Dates"],
    ["bullet", "Bullets"]
  ];
  const options = [
    ["400", "Regular"],
    ["500", "Medium"],
    ["600", "Semi bold"],
    ["700", "Bold"],
    ["800", "Extra bold"]
  ];

  host.innerHTML = `
    <div class="style-row spacing-row">
      <label>Line spacing <input data-style-key="lineSpacing" type="range" min="1" max="1.8" step="0.05" /></label>
      <label>Title row height <input data-style-key="sectionGap" type="range" min="0" max="28" step="1" /></label>
      <label>Item gap <input data-style-key="itemGap" type="range" min="4" max="38" step="1" /></label>
    </div>
    ${groups.map(([key, label]) => `
      <div class="style-row">
        <strong>${label}</strong>
        <label>Size <input data-style-key="${key}Size" type="range" min="7.5" max="14" step="0.25" /></label>
        <label>Boldness
          <select data-style-key="${key}Weight">
            ${options.map(([value, text]) => `<option value="${value}">${text}</option>`).join("")}
          </select>
        </label>
        <label class="check-row"><input data-style-key="${key}Italic" type="checkbox" /> Italic</label>
      </div>
    `).join("")}
  `;

  host.querySelectorAll("[data-style-key]").forEach((input) => {
    const key = input.dataset.styleKey;
    if (input.type === "checkbox") input.checked = Boolean(state.style[key]);
    else input.value = state.style[key];
    input.oninput = () => {
      state.style[key] = input.type === "checkbox" ? input.checked : Number(input.value);
      saveState();
      applyResumeStyle();
    };
  });
}

function applyResumeStyle() {
  const resume = document.getElementById("resume");
  const style = state.style || defaults.style;
  resume.style.setProperty("--resume-font-size", `${style.bodySize}pt`);
  resume.style.setProperty("--resume-font-weight", style.bodyWeight);
  resume.style.setProperty("--resume-font-style", style.bodyItalic ? "italic" : "normal");
  resume.style.setProperty("--section-title-size", `${style.titleSize}pt`);
  resume.style.setProperty("--section-title-weight", style.titleWeight);
  resume.style.setProperty("--section-title-style", style.titleItalic ? "italic" : "normal");
  resume.style.setProperty("--item-title-size", `${style.itemSize}pt`);
  resume.style.setProperty("--item-title-weight", style.itemWeight);
  resume.style.setProperty("--item-title-style", style.itemItalic ? "italic" : "normal");
  resume.style.setProperty("--date-size", `${style.dateSize}pt`);
  resume.style.setProperty("--date-weight", style.dateWeight);
  resume.style.setProperty("--date-style", style.dateItalic ? "italic" : "normal");
  resume.style.setProperty("--bullet-size", `${style.bulletSize}pt`);
  resume.style.setProperty("--bullet-weight", style.bulletWeight);
  resume.style.setProperty("--bullet-style", style.bulletItalic ? "italic" : "normal");
  resume.style.setProperty("--resume-line-height", style.lineSpacing);
  resume.style.setProperty("--section-gap", `${style.sectionGap}px`);
  resume.style.setProperty("--item-gap", `${style.itemGap}px`);
}

function renderRepeat(section) {
  const host = document.getElementById(section);
  host.innerHTML = "";
  state[section].forEach((item, index) => {
    const card = document.createElement("div");
    card.className = "repeat-card";
    card.innerHTML = `
      <div class="repeat-head">
        <span class="repeat-title">${section} ${index + 1}</span>
        <button class="remove-btn" type="button" data-section="${section}" data-index="${index}">Remove</button>
      </div>
      <div class="grid two">
        ${schemas[section].map(([key, label, type]) => `
          <label>${label}
            ${type === "textarea"
              ? `<textarea data-section="${section}" data-index="${index}" data-key="${key}">${esc(item[key])}</textarea>`
              : `<input data-section="${section}" data-index="${index}" data-key="${key}" value="${esc(item[key])}" />`}
          </label>
        `).join("")}
      </div>
    `;
    host.appendChild(card);
  });
}

function bindRepeats() {
  Object.keys(schemas).forEach(renderRepeat);
  document.querySelectorAll("[data-section][data-key]").forEach((input) => {
    input.addEventListener("input", () => {
      const { section, index, key } = input.dataset;
      state[section][Number(index)][key] = input.value;
      saveState();
      renderResume();
    });
  });
  document.querySelectorAll(".remove-btn").forEach((button) => {
    button.addEventListener("click", () => {
      const { section, index } = button.dataset;
      state[section].splice(Number(index), 1);
      saveState();
      renderAll();
    });
  });
}

function addItem(section) {
  const blank = Object.fromEntries(schemas[section].map(([key]) => [key, ""]));
  state[section].push(blank);
  saveState();
  renderAll();
}

function renderResume() {
  const experience = state.experience.map((item) => entry(item, true)).join("");
  const responsibility = state.responsibility.map((item) => entry(item)).join("");
  const projects = state.projects.map((item) => projectEntry(item)).join("");
  const activities = state.activities.map((item) => `
    <div class="activity-item"><b>${esc(item.name)}</b><ul><li>${esc(item.desc)}</li></ul></div>
  `).join("");

  document.getElementById("resume").innerHTML = `
    <header class="resume-header">
      <img class="photo" src="${esc(state.photoImage || defaults.photoImage)}" alt="Profile placeholder" />
      <div class="header-details">
        <h2 class="resume-name">${esc(state.name)}</h2>
        <div class="resume-contact">
          <span><b>Course</b><em>:</em>${esc(state.degree)}, ${esc(state.year)}</span>
          <span><b>Email</b><em>:</em>${esc(state.email)}</span>
          <span><b>Mobile</b><em>:</em>${esc(state.mobile)}</span>
          <span><b>CGPA</b><em>:</em>${esc(state.cgpa)}</span>
        </div>
      </div>
      <img class="logo" src="${esc(state.logoImage || defaults.logoImage)}" alt="BITS Pilani logo" />
    </header>
    <section class="resume-section academic-section">
      <h3 class="section-title">Academic Details</h3>
      <table class="academic-table">
        <thead>
          <tr><th>Course</th><th>Specialization</th><th>Institute</th><th>Board</th><th>Score</th><th>Year</th></tr>
        </thead>
        <tbody>
          ${state.academics.map((row) => `
            <tr>
              <td>${esc(row.course)}</td>
              <td>${esc(row.specialization)}</td>
              <td>${esc(row.institute)}</td>
              <td>${esc(row.board)}</td>
              <td>${esc(row.score)}</td>
              <td>${esc(row.year)}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </section>
    ${section("Internships And Professional Experience", experience)}
    ${section("Position Of Responsibility", responsibility, "responsibility-section")}
    ${section("Scholastic Achievements/Projects/Publications", projects)}
    ${section("Extra Curricular Activities And Achievements", activities)}
  `;
  applyResumeStyle();
}

function section(title, content, className = "") {
  const extraClass = className ? ` ${className}` : "";
  return content.trim() ? `<section class="resume-section${extraClass}"><h3 class="section-title">${title}</h3><div class="section-body">${content}</div></section>` : "";
}

function entry(item, withDesc = false) {
  const bulletList = lines(item.bullets).map((line) => `<li>${esc(line)}</li>`).join("");
  return `
    <div class="item">
      <div class="item-top">
        <span>${esc(item.title)}, ${esc(item.org)}${withDesc && item.desc ? `- <span class="item-sub">${esc(item.desc)}</span>` : ""}</span>
        <span class="date">${esc(item.dates)}</span>
      </div>
      ${bulletList ? `<ul>${bulletList}</ul>` : ""}
    </div>
  `;
}

function projectEntry(item) {
  const bulletList = lines(item.bullets).map((line) => `<li>${esc(line)}</li>`).join("");
  return `
    <div class="item">
      <div class="item-top">
        <span>${esc(item.title)}</span>
        <span class="date">${esc(item.dates)}</span>
      </div>
      ${bulletList ? `<ul>${bulletList}</ul>` : ""}
    </div>
  `;
}

function renderAll() {
  bindBasics();
  bindImageControls();
  bindStyleControls();
  bindRepeats();
  renderResume();
}

function formatSelection(command) {
  document.getElementById("resume").focus();
  document.execCommand(command, false, null);
}

function clearSelectionStyle() {
  document.getElementById("resume").focus();
  document.execCommand("removeFormat", false, null);
}

function downloadDoc() {
  const style = Array.from(document.styleSheets)
    .map((sheet) => {
      try {
        return Array.from(sheet.cssRules).map((rule) => rule.cssText).join("\n");
      } catch {
        return "";
      }
    })
    .join("\n");
  const html = `
    <!doctype html>
    <html>
      <head><meta charset="utf-8"><style>${style}</style></head>
      <body>${document.getElementById("resume").outerHTML}</body>
    </html>
  `;
  const blob = new Blob(["\ufeff", html], { type: "application/msword" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `${(state.name || "PU_Resume").replace(/[^\w-]+/g, "_")}.doc`;
  link.click();
  URL.revokeObjectURL(link.href);
}

document.querySelectorAll("[data-add]").forEach((button) => {
  button.addEventListener("click", () => addItem(button.dataset.add));
});

document.getElementById("printResume").addEventListener("click", () => window.print());
document.getElementById("downloadDoc").addEventListener("click", downloadDoc);
document.getElementById("boldSelection").addEventListener("click", () => formatSelection("bold"));
document.getElementById("italicSelection").addEventListener("click", () => formatSelection("italic"));
document.getElementById("clearSelectionStyle").addEventListener("click", clearSelectionStyle);
document.getElementById("loadSample").addEventListener("click", () => {
  state = structuredClone(samples);
  saveState();
  renderAll();
});
document.getElementById("clearForm").addEventListener("click", () => {
  state = structuredClone(defaults);
  saveState();
  renderAll();
});

renderAll();
