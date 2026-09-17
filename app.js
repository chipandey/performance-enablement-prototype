const state = {
  role: "hr",
  view: "overview",
  selectedEmployee: "priya",
  insightTab: "goals",
  peopleQuery: "",
  launched: false,
  approved: new Set(),
};

const employees = [
  { id: "priya", name: "Priya Nair", title: "Senior Product Manager", team: "Product", manager: "Jordan Lee", avatar: "priya", initials: "PN", status: "Manager review", statusTone: "amber", rating: 4.6, prior: 4.2, potential: "High", risk: true, recommendation: "Promotion", salary: "$126,000" },
  { id: "daniel", name: "Daniel Kim", title: "Engineering Manager", team: "Engineering", manager: "Taylor Chen", avatar: "daniel", initials: "DK", status: "Calibration", statusTone: "blue", rating: 4.3, prior: 4.4, potential: "High", risk: false, recommendation: "Succession", salary: "$148,000" },
  { id: "sofia", name: "Sofia Martinez", title: "Customer Success Lead", team: "Customer Success", manager: "Morgan Reed", avatar: "sofia", initials: "SM", status: "Employee input", statusTone: "amber", rating: 3.1, prior: 4.0, potential: "Core", risk: true, recommendation: "Develop", salary: "$102,500" },
  { id: "marcus", name: "Marcus Johnson", title: "Finance Business Partner", team: "Finance", manager: "Avery Shah", avatar: "marcus", initials: "MJ", status: "Complete", statusTone: "green", rating: 3.8, prior: 3.7, potential: "Core", risk: false, recommendation: "Merit", salary: "$118,000" },
  { id: "elena", name: "Elena Rossi", title: "Principal Designer", team: "Product", manager: "Jordan Lee", initials: "ER", status: "Not started", statusTone: "gray", rating: 3.9, prior: 4.1, potential: "High", risk: false, recommendation: "Retain", salary: "$134,000" },
  { id: "omar", name: "Omar Haddad", title: "Sales Director", team: "Sales", manager: "Casey Wood", initials: "OH", status: "Manager review", statusTone: "amber", rating: 2.8, prior: 3.6, potential: "Core", risk: true, recommendation: "Watch", salary: "$142,000" },
];

const navByRole = {
  hr: [
    ["overview", "layout-dashboard", "Overview"],
    ["cycles", "repeat-2", "Review cycles", "3"],
    ["people", "users-round", "People & calibration", "12"],
    ["actions", "badge-dollar-sign", "Actions & rewards"],
    ["approvals", "git-pull-request-arrow", "Approvals", "4"],
  ],
  manager: [
    ["overview", "layout-dashboard", "Team overview"],
    ["people", "users-round", "My team", "8"],
    ["actions", "list-checks", "Team recommendations"],
    ["approvals", "git-pull-request-arrow", "My approvals", "2"],
  ],
  employee: [
    ["overview", "layout-dashboard", "My performance"],
    ["people", "history", "Performance history"],
    ["actions", "sprout", "Goals & development"],
  ],
};

const app = document.querySelector("#app");
const nav = document.querySelector("#mainNav");
const roleSelect = document.querySelector("#roleSelect");

function icon(name, cls = "") {
  return `<i data-lucide="${name}"${cls ? ` class="${cls}"` : ""}></i>`;
}

function refreshIcons() {
  if (window.lucide) window.lucide.createIcons();
}

function renderNav() {
  nav.innerHTML = `<div class="nav-label">Workspace</div>` + navByRole[state.role].map(([id, glyph, label, count]) => `
    <button class="nav-item ${state.view === id || (state.view === "employee" && id === "people") ? "active" : ""}" data-nav="${id}">
      ${icon(glyph)}<span>${label}</span>${count ? `<span class="nav-count">${count}</span>` : ""}
    </button>`).join("");
}

function pageHeading(eyebrow, title, description, actions = "") {
  return `<header class="page-heading">
    <div><p class="eyebrow">${eyebrow}</p><h1>${title}</h1><p>${description}</p></div>
    ${actions ? `<div class="heading-actions">${actions}</div>` : ""}
  </header>`;
}

function statCard(label, value, note, glyph, tone) {
  return `<article class="card stat-card">
    <div class="stat-top"><span>${label}</span><span class="stat-icon ${tone}">${icon(glyph)}</span></div>
    <div class="stat-value">${value}</div><div class="stat-delta">${note}</div>
  </article>`;
}

function personCell(employee) {
  const avatar = employee.avatar
    ? `<span class="avatar avatar-photo ${employee.avatar}"></span>`
    : `<span class="avatar">${employee.initials}</span>`;
  return `<div class="person-cell">${avatar}<span><strong>${employee.name}</strong><small>${employee.title}</small></span></div>`;
}

function overviewScreen() {
  if (state.role === "employee") return employeeDashboard();
  const manager = state.role === "manager";
  return `
    ${pageHeading(
      manager ? "Your team" : "FY26 annual review",
      manager ? "Good morning, Alex" : "Performance at a glance",
      manager ? "Keep every conversation moving and turn review signals into meaningful action." : "Track cycle progress, intervene early, and move talent decisions forward with confidence.",
      `<button class="button" data-action="send-nudges">${icon("send")} Send nudges</button><button class="button primary" data-nav="people">${icon("users")} ${manager ? "Review my team" : "Open calibration"}</button>`
    )}
    <section class="stats-grid">
      ${statCard(manager ? "Team reviews" : "Employees scheduled", manager ? "8" : "248", `<strong>100%</strong> auto-enrolled`, "calendar-check", "green")}
      ${statCard("Completed", manager ? "3" : "159", `<strong>+18%</strong> since last week`, "circle-check-big", "blue")}
      ${statCard("Pending action", manager ? "5" : "67", manager ? "2 due this week" : "27 awaiting managers", "clock-3", "amber")}
      ${statCard("At-risk flags", manager ? "2" : "12", "Requires timely follow-up", "triangle-alert", "coral")}
    </section>
    <section class="dashboard-grid">
      <div class="stack">
        <article class="card">
          <div class="section-header"><div><h2>Cycle health</h2><p>FY26 Annual Review · 01 Sep – 15 Nov</p></div><button class="section-link" data-nav="cycles">View cycle</button></div>
          <div class="cycle-health">
            <div class="donut-wrap"><div class="donut"></div><div class="donut-label"><strong>64%</strong><span>159 of 248</span></div></div>
            <div>
              <div class="progress-list">
                <div><div class="progress-meta"><strong>Self assessment</strong><span>89%</span></div><div class="progress-track"><span style="width:89%"></span></div></div>
                <div><div class="progress-meta"><strong>Manager review</strong><span>67%</span></div><div class="progress-track"><span style="width:67%"></span></div></div>
                <div><div class="progress-meta"><strong>Calibration</strong><span>42%</span></div><div class="progress-track amber"><span style="width:42%"></span></div></div>
              </div>
              <div class="legend"><span><i style="background:var(--forest)"></i>On track 78%</span><span><i style="background:var(--amber)"></i>Needs attention 13%</span></div>
            </div>
          </div>
        </article>
        <article class="card">
          <div class="section-header"><div><h2>${manager ? "Team review continuum" : "Departments needing attention"}</h2><p>Ordered by action urgency</p></div><button class="section-link" data-nav="people">View all</button></div>
          <div class="table-wrap"><table><thead><tr><th>${manager ? "Employee" : "Team"}</th><th>Progress</th><th>Pending</th><th>Due</th></tr></thead><tbody>
            ${(manager ? employees.slice(0,4).map(e => `<tr data-employee="${e.id}"><td>${personCell(e)}</td><td><div class="progress-track"><span style="width:${Math.round(e.rating/5*100)}%"></span></div></td><td><span class="badge ${e.statusTone}">${e.status}</span></td><td>${e.risk ? "2 days" : "8 days"}</td></tr>`).join("") : `
            <tr><td><strong>Customer Success</strong></td><td><div class="progress-track amber"><span style="width:48%"></span></div></td><td><span class="badge coral">14 overdue</span></td><td>20 Sep</td></tr>
            <tr><td><strong>Sales</strong></td><td><div class="progress-track amber"><span style="width:56%"></span></div></td><td><span class="badge amber">11 pending</span></td><td>22 Sep</td></tr>
            <tr><td><strong>Product</strong></td><td><div class="progress-track"><span style="width:78%"></span></div></td><td><span class="badge green">On track</span></td><td>28 Sep</td></tr>`)}
          </tbody></table></div>
        </article>
      </div>
      <aside class="stack">
        <article class="card">
          <div class="section-header"><div><h2>Signals to act on</h2><p>AI-assisted, manager-reviewed</p></div><span class="badge coral">3 urgent</span></div>
          <div class="risk-row" data-employee="sofia"><span class="risk-symbol">${icon("trending-down")}</span><span><strong>Performance shift</strong><small>Sofia Martinez · rating trend down 0.9</small></span><span class="score">3.1</span></div>
          <div class="risk-row" data-employee="priya"><span class="risk-symbol amber">${icon("graduation-cap")}</span><span><strong>Skill gap blocks growth</strong><small>Priya Nair · strategic finance</small></span><span class="badge amber">Gap</span></div>
          <div class="risk-row" data-employee="omar"><span class="risk-symbol">${icon("message-square-warning")}</span><span><strong>Feedback pattern</strong><small>Omar Haddad · 3 similar comments</small></span><span class="badge coral">At risk</span></div>
        </article>
        <article class="card">
          <div class="section-header"><div><h2>Decision queue</h2><p>Post-appraisal recommendations</p></div><button class="section-link" data-nav="approvals">Open</button></div>
          <div class="risk-row"><span class="risk-symbol amber">${icon("award")}</span><span><strong>4 promotions</strong><small>2 awaiting HR · $31K impact</small></span>${icon("chevron-right")}</div>
          <div class="risk-row"><span class="risk-symbol amber">${icon("circle-dollar-sign")}</span><span><strong>18 salary changes</strong><small>Within allocated budget</small></span>${icon("chevron-right")}</div>
          <div class="risk-row"><span class="risk-symbol amber">${icon("route")}</span><span><strong>6 succession actions</strong><small>3 critical roles covered</small></span>${icon("chevron-right")}</div>
        </article>
      </aside>
    </section>`;
}

function cyclesScreen() {
  const cards = [
    { title: "FY26 Annual Review", label: "Active", tone: "lime", progress: 64, people: 248, dates: "01 Sep – 15 Nov", featured: true },
    { title: "FY26 New Leader Check-in", label: "Active", tone: "green", progress: 38, people: 18, dates: "Rolling 90 days" },
    { title: "Mid-year Growth Review", label: "Complete", tone: "blue", progress: 100, people: 241, dates: "Mar – May 2026" },
    { title: "Sales Quarterly Scorecard", label: "Scheduled", tone: "gray", progress: 0, people: 46, dates: "Starts 01 Oct" },
    { title: "Executive 360 Feedback", label: "Draft", tone: "amber", progress: 0, people: 14, dates: "Starts 15 Oct" },
  ];
  if (state.launched) cards.splice(1, 0, { title: "FY26 Emerging Leaders", label: "Scheduled", tone: "green", progress: 0, people: 186, dates: "Starts 01 Oct" });
  return `
    ${pageHeading("Review programs", "Performance review cycles", "Design consistent experiences, automate enrollment, and track every stage from one place.", `<button class="button">${icon("layout-template")} Goal templates</button><button class="button primary" data-action="launch-cycle">${icon("plus")} New cycle</button>`)}
    <div class="filterbar"><div class="search-field">${icon("search")}<input type="search" placeholder="Search review cycles" aria-label="Search review cycles"></div><select class="filter-select"><option>All statuses</option><option>Active</option><option>Scheduled</option><option>Complete</option></select><button class="button compact">${icon("sliders-horizontal")} More filters</button></div>
    <section class="cycle-grid">${cards.map(c => `
      <article class="card cycle-card ${c.featured ? "featured" : ""}">
        <div class="cycle-top"><span class="badge ${c.tone}">${c.label}</span><button class="icon-button" title="Cycle options">${icon("more-horizontal")}</button></div>
        <h2>${c.title}</h2><p class="muted">Automated multi-stage review with goals, feedback, calibration, and recommendations.</p>
        <div class="cycle-progress"><div class="progress-meta"><strong>${c.progress}% complete</strong><span>${c.people} employees</span></div><div class="progress-track"><span style="width:${c.progress}%"></span></div></div>
        <div class="cycle-meta"><span>${icon("calendar-days")} ${c.dates}</span><span>${icon("layers-3")} 5 stages</span></div>
        <div class="cycle-footer"><div class="avatar-group"><span class="avatar avatar-photo priya"></span><span class="avatar avatar-photo daniel"></span><span class="avatar avatar-photo sofia"></span><span class="avatar">+${Math.max(c.people-3, 0)}</span></div><button class="button compact ${c.featured ? "lime" : ""}" data-action="cycle-details">Manage ${icon("arrow-right")}</button></div>
      </article>`).join("")}
    </section>`;
}

function peopleScreen() {
  const filtered = employees.filter(e => `${e.name} ${e.title} ${e.team}`.toLowerCase().includes(state.peopleQuery.toLowerCase()));
  return `
    ${pageHeading("Calibration workspace", "Review employees as a continuum", "Compare performance, potential, risk signals, and recommendations without losing the full appraisal context.", `<button class="button">${icon("sliders-horizontal")} Calibration view</button><button class="button primary" data-action="send-nudges">${icon("send")} Nudge pending</button>`)}
    <div class="filterbar"><div class="search-field">${icon("search")}<input id="peopleSearch" value="${state.peopleQuery}" type="search" placeholder="Search people, role, or team" aria-label="Search people"></div><select class="filter-select"><option>All teams</option><option>Product</option><option>Engineering</option><option>Sales</option></select><select class="filter-select"><option>All stages</option><option>Manager review</option><option>Calibration</option><option>Complete</option></select><button class="button compact">${icon("arrow-up-down")} Sort</button></div>
    <article class="card people-table-card"><div class="table-wrap"><table><thead><tr><th>Employee</th><th>Team</th><th>Review stage</th><th>Rating</th><th>Potential</th><th>Signal</th><th>Recommendation</th><th></th></tr></thead><tbody>
      ${filtered.length ? filtered.map(e => `<tr data-employee="${e.id}"><td>${personCell(e)}</td><td>${e.team}</td><td><span class="badge ${e.statusTone}">${e.status}</span></td><td><div class="rating"><strong>${e.rating.toFixed(1)}</strong><div class="rating-track"><span style="width:${e.rating/5*100}%"></span></div></div></td><td><span class="badge ${e.potential === "High" ? "lime" : "gray"}">${e.potential}</span></td><td>${e.risk ? `<span class="badge coral"><span class="anomaly-dot"></span>Anomaly</span>` : `<span class="badge green">Stable</span>`}</td><td><strong>${e.recommendation}</strong></td><td><button class="row-action" title="Open appraisal">${icon("chevron-right")}</button></td></tr>`).join("") : `<tr><td colspan="8"><div class="empty-state">No employees match your search.</div></td></tr>`}
    </tbody></table></div></article>`;
}

function employeeDetailScreen() {
  const e = employees.find(person => person.id === state.selectedEmployee) || employees[0];
  const isPriya = e.id === "priya";
  const insightContent = {
    goals: `<div class="goal-row"><div><strong>Grow enterprise adoption to 45%</strong><p>OKR · Customer & growth</p></div><div class="progress-track"><span style="width:92%"></span></div><strong>92%</strong></div><div class="goal-row"><div><strong>Launch guided onboarding v2</strong><p>Goal · Product delivery</p></div><div class="progress-track"><span style="width:100%"></span></div><strong>100%</strong></div><div class="goal-row"><div><strong>Build strategic finance fluency</strong><p>Development goal · Skill gap</p></div><div class="progress-track amber"><span style="width:38%"></span></div><strong>38%</strong></div>`,
    skills: `<div class="scorecard-grid"><div class="scorecard-item"><span>Customer insight</span><strong>4.8 / 5</strong></div><div class="scorecard-item"><span>Product strategy</span><strong>4.5 / 5</strong></div><div class="scorecard-item"><span>People leadership</span><strong>4.2 / 5</strong></div><div class="scorecard-item"><span>Strategic finance</span><strong style="color:var(--coral)">2.9 / 5</strong></div></div>`,
    feedback: `<blockquote class="quote">“Creates remarkable clarity in ambiguous product decisions and brings the team with her.”<cite>Peer feedback · 360 review</cite></blockquote><blockquote class="quote">“Ready for broader scope; financial modeling is the one capability to strengthen.”<cite>Manager feedback · FY26 review</cite></blockquote>`,
    scorecard: `<div class="scorecard-grid"><div class="scorecard-item"><span>Financial</span><strong>104%</strong></div><div class="scorecard-item"><span>Customer</span><strong>118%</strong></div><div class="scorecard-item"><span>Internal process</span><strong>96%</strong></div><div class="scorecard-item"><span>Learning & growth</span><strong>88%</strong></div></div>`,
  }[state.insightTab];
  return `
    <section class="card detail-top">
      <div class="profile-summary">${e.avatar ? `<span class="avatar avatar-photo ${e.avatar} lg"></span>` : `<span class="avatar lg">${e.initials}</span>`}<div><p class="eyebrow">FY26 Annual Review</p><h1>${e.name}</h1><p>${e.title} · ${e.team} · Manager: ${e.manager}</p></div></div>
      <div class="detail-actions"><button class="button" data-nav="people">${icon("arrow-left")} Back</button><button class="button" data-action="print">${icon("printer")} Print</button></div>
    </section>
    <section class="detail-layout">
      <div class="detail-main">
        ${e.risk || isPriya ? `<div class="alert-panel">${icon(isPriya ? "graduation-cap" : "triangle-alert")}<div><strong>${isPriya ? "Growth readiness signal" : "Performance anomaly requires attention"}</strong><p>${isPriya ? "Strong performance and peer feedback meet the promotion threshold. Strategic finance remains a development gap to include in the plan." : `Current rating is ${(e.prior-e.rating).toFixed(1)} below last year, with repeated feedback themes. Discuss context before finalizing.`}</p></div></div>` : ""}
        <article class="card"><div class="section-header"><div><h2>Performance evidence</h2><p>Current signals across the review journey</p></div><span class="badge blue">360° complete</span></div><div class="metric-grid"><div class="metric"><span>Proposed rating</span><strong>${e.rating.toFixed(1)}</strong><small>Top ${Math.round((5-e.rating)*20)+5}% of cohort</small></div><div class="metric"><span>Goal achievement</span><strong>${isPriya ? "94%" : "82%"}</strong><small>Weighted OKRs</small></div><div class="metric"><span>360 feedback</span><strong>${isPriya ? "4.7" : "3.6"}</strong><small>12 contributors</small></div><div class="metric"><span>Potential</span><strong>${e.potential}</strong><small>9-box assessment</small></div></div></article>
        <article class="card"><div class="section-header"><div><h2>Three-year performance history</h2><p>Visible during calibration and retained for the employee</p></div>${icon("history")}</div><div class="history"><div class="history-row"><strong>FY26</strong><div class="history-bar"><span style="width:${e.rating/5*100}%"></span></div><strong>${e.rating.toFixed(1)}</strong></div><div class="history-row"><strong>FY25</strong><div class="history-bar"><span style="width:${e.prior/5*100}%"></span></div><strong>${e.prior.toFixed(1)}</strong></div><div class="history-row"><strong>FY24</strong><div class="history-bar"><span style="width:${Math.min(e.prior+.1,5)/5*100}%"></span></div><strong>${Math.min(e.prior+.1,5).toFixed(1)}</strong></div></div></article>
        <article class="card"><div class="section-header"><div><h2>Connected performance insights</h2><p>One view across goals, skills, feedback, and scorecard</p></div></div><div class="insight-tabs">${[["goals","target","Goals & OKRs"],["skills","brain-circuit","Skills"],["feedback","messages-square","Feedback"],["scorecard","chart-no-axes-combined","Scorecard"]].map(([id,glyph,label]) => `<button class="tab ${state.insightTab === id ? "active" : ""}" data-tab="${id}">${icon(glyph)} ${label}</button>`).join("")}</div><div class="tab-panel">${insightContent}</div></article>
      </div>
      <aside class="detail-side">
        <article class="card"><div class="section-header"><div><h2>Manager recommendation</h2><p>Complete all post-appraisal actions in one go</p></div><span class="badge amber">Draft</span></div><div class="action-form">
          <div class="form-row"><div class="field"><label>Final rating <small>Suggested 4.6</small></label><select id="rating"><option>4.6 · Exceptional</option><option>4.0 · Exceeds</option><option>3.0 · Meets</option><option>2.0 · Developing</option></select></div><div class="field"><label>Cohort rank</label><input value="#3 of 42" aria-label="Cohort rank"></div></div>
          <div class="field"><label>Bell curve placement <small>Above target</small></label><input type="range" min="1" max="5" value="5" aria-label="Bell curve placement"><div class="range-labels"><span>Needs support</span><span>Exceptional</span></div></div>
          <div class="form-row"><div class="field"><label>Salary adjustment</label><select id="salaryAdjustment"><option>+ 8.0%</option><option>+ 6.0%</option><option>+ 4.0%</option><option>No change</option><option>- 2.0%</option></select></div><div class="field"><label>Position action</label><select id="positionAction"><option>Promote</option><option>No change</option><option>Transfer</option><option>Demote</option></select></div></div>
          <div class="recommendation">${icon("sparkles")}<span>Promotion policy met: rating ≥ 4.2 for two cycles, high potential, and no active conduct flags.</span></div>
          <div class="form-row"><div class="field"><label>Succession readiness</label><select><option>Ready in 1–2 years</option><option>Ready now</option><option>Ready in 3+ years</option></select></div><div class="field"><label>Development plan</label><select><option>Finance fluency accelerator</option><option>Executive presence</option><option>People leadership</option></select></div></div>
          <div class="field"><label>Employee communication</label><textarea>Priya, your impact this year has been exceptional. We are recommending promotion to Group Product Manager, alongside a focused development plan in strategic finance.</textarea></div>
          <div class="impact-summary"><div><span>New grade</span><strong>P6</strong></div><div><span>New salary</span><strong>$136,080</strong></div><div><span>Effective</span><strong>01 Jan</strong></div></div>
          <div class="form-footer"><button class="button" data-action="save-draft">Save draft</button><button class="button primary" data-action="submit-recommendation">Submit for approval ${icon("arrow-right")}</button></div>
        </div></article>
      </aside>
    </section>`;
}

function actionsScreen() {
  if (state.role === "employee") return developmentScreen();
  return `
    ${pageHeading("Integrated decisions", "Actions & rewards", "Review ratings, talent moves, pay impact, succession, and development recommendations together before submitting.", `<button class="button">${icon("download")} Export</button><button class="button primary" data-action="submit-batch">${icon("send")} Submit batch</button>`)}
    <section class="stats-grid">${statCard("Recommended promotions", "14", "9 meet policy threshold", "award", "green")}${statCard("Salary impact", "$214K", "72% of allocated budget", "circle-dollar-sign", "blue")}${statCard("Succession moves", "6", "3 critical roles covered", "route", "amber")}${statCard("Development plans", "31", "8 need assignment", "sprout", "coral")}</section>
    <article class="card people-table-card"><div class="section-header"><div><h2>Decision continuum</h2><p>FY26 Annual Review · 42 recommendations</p></div><span class="badge green">Within budget</span></div><div class="table-wrap"><table><thead><tr><th>Employee</th><th>Rating</th><th>Position action</th><th>Salary</th><th>Succession</th><th>Development</th><th>Policy</th></tr></thead><tbody>${employees.slice(0,5).map(e => `<tr data-employee="${e.id}"><td>${personCell(e)}</td><td><strong>${e.rating.toFixed(1)}</strong></td><td><span class="badge ${e.recommendation === "Promotion" ? "lime" : "gray"}">${e.recommendation === "Promotion" ? "Promote" : "No change"}</span></td><td>${e.recommendation === "Promotion" ? "+8.0%" : "+4.0%"}</td><td>${e.potential === "High" ? "Ready 1–2 yrs" : "Not identified"}</td><td>${e.risk ? "Required" : "Assigned"}</td><td><span class="badge ${e.rating >= 4.2 ? "green" : "gray"}">${e.rating >= 4.2 ? "Eligible" : "Standard"}</span></td></tr>`).join("")}</tbody></table></div></article>`;
}

function approvalsScreen() {
  const approvals = [
    { id: "priya", employee: employees[0], move: "Promotion to Group Product Manager", impact: "+8.0% · P5 → P6", current: 1 },
    { id: "daniel", employee: employees[1], move: "Critical role succession nomination", impact: "Ready in 1–2 years", current: 2 },
    { id: "sofia", employee: employees[2], move: "Development plan & salary hold", impact: "Review after 90 days", current: 1 },
    { id: "marcus", employee: employees[3], move: "Merit adjustment", impact: "+4.0% · Within range", current: 2 },
  ];
  return `
    ${pageHeading("Decision governance", "Approvals", "Move promotion, grade, salary, and development decisions through a transparent multi-level approval flow.", `<button class="button">${icon("list-filter")} Filter queue</button>`)}
    <section class="approval-list">${approvals.map(a => {
      const approved = state.approved.has(a.id);
      return `<article class="card approval-card"><div class="approval-person">${a.employee.avatar ? `<span class="avatar avatar-photo ${a.employee.avatar} lg"></span>` : `<span class="avatar lg">${a.employee.initials}</span>`}<div><span class="badge ${approved ? "green" : "amber"}">${approved ? "Approved" : "Action required"}</span><h3 style="margin-top:8px">${a.employee.name}</h3><p>${a.move}<br><strong>${a.impact}</strong></p></div></div><div class="approval-flow">${["Manager","HR partner","Business leader","People Ops"].map((step, index) => `<div class="approval-step ${approved || index < a.current ? "done" : index === a.current ? "current" : ""}"><span class="step-dot">${icon(approved || index < a.current ? "check" : index === a.current ? "clock-3" : "circle")}</span>${step}</div>`).join("")}</div><div class="approval-actions">${approved ? `<button class="button compact" data-employee="${a.id}">${icon("eye")} View</button>` : `<button class="button compact danger" data-action="reject" data-id="${a.id}">${icon("x")} Decline</button><button class="button compact primary" data-action="approve" data-id="${a.id}">${icon("check")} Approve</button>`}</div></article>`;
    }).join("")}</section>`;
}

function employeeDashboard() {
  return `
    <section class="card employee-hero"><div><p class="eyebrow" style="color:var(--lime)">My FY26 review</p><h1>Your year, your growth, one clear story.</h1><p>Bring your achievements, feedback, and goals together before your manager conversation on 28 September.</p><button class="button lime" data-action="self-review">Continue self assessment ${icon("arrow-right")}</button></div><div class="employee-progress"><div class="progress-meta"><strong>Review progress</strong><span>3 of 5 steps complete</span></div><div class="progress-track"><span style="width:60%"></span></div></div></section>
    <section class="employee-grid"><div class="stack"><article class="card"><div class="section-header"><div><h2>Your performance story</h2><p>Evidence collected across this review</p></div><button class="section-link" data-action="self-review">Edit evidence</button></div><div class="metric-grid"><div class="metric"><span>Goals achieved</span><strong>94%</strong><small>4 of 5 complete</small></div><div class="metric"><span>Feedback</span><strong>12</strong><small>Peers & partners</small></div><div class="metric"><span>Skills grown</span><strong>4</strong><small>2 validated</small></div><div class="metric"><span>Recognition</span><strong>8</strong><small>Moments this year</small></div></div></article><article class="card"><div class="section-header"><div><h2>Three-year performance record</h2><p>Your historical record stays visible to you</p></div><button class="section-link" data-employee="priya">Full details</button></div><div class="history"><div class="history-row"><strong>FY25</strong><div class="history-bar"><span style="width:84%"></span></div><strong>4.2</strong></div><div class="history-row"><strong>FY24</strong><div class="history-bar"><span style="width:86%"></span></div><strong>4.3</strong></div><div class="history-row"><strong>FY23</strong><div class="history-bar"><span style="width:78%"></span></div><strong>3.9</strong></div></div></article></div>
    <aside class="stack"><article class="card"><div class="section-header"><div><h2>What happens next</h2><p>Your review timeline</p></div></div><div class="timeline"><div class="timeline-item"><span class="timeline-dot">${icon("check")}</span><strong>Goals & evidence</strong><p>Completed 12 Sep</p></div><div class="timeline-item"><span class="timeline-dot">${icon("check")}</span><strong>Peer feedback</strong><p>12 responses received</p></div><div class="timeline-item"><span class="timeline-dot">${icon("pencil")}</span><strong>Self assessment</strong><p>Due 20 Sep · 80% complete</p></div><div class="timeline-item upcoming"><span class="timeline-dot">${icon("circle")}</span><strong>Manager conversation</strong><p>Scheduled 28 Sep, 10:00 AM</p></div><div class="timeline-item upcoming"><span class="timeline-dot">${icon("circle")}</span><strong>Outcome shared</strong><p>Expected 18 Nov</p></div></div></article></aside></section>`;
}

function developmentScreen() {
  return `${pageHeading("Growth plan", "Goals & development", "Turn review insights into practical actions you can revisit with your manager.", `<button class="button primary" data-action="add-goal">${icon("plus")} Add goal</button>`)}<section class="dashboard-grid"><article class="card"><div class="section-header"><div><h2>FY26 development goals</h2><p>3 active · 1 suggested from your review</p></div></div><div class="tab-panel"><div class="goal-row"><div><strong>Build strategic finance fluency</strong><p>Suggested from skill gap · Finance accelerator</p></div><div class="progress-track amber"><span style="width:38%"></span></div><strong>38%</strong></div><div class="goal-row"><div><strong>Lead a multi-product strategy</strong><p>Career growth · Sponsor: Jordan Lee</p></div><div class="progress-track"><span style="width:62%"></span></div><strong>62%</strong></div><div class="goal-row"><div><strong>Mentor two emerging PMs</strong><p>Leadership · 2 active mentees</p></div><div class="progress-track"><span style="width:76%"></span></div><strong>76%</strong></div></div></article><aside class="card"><div class="section-header"><div><h2>Recommended next step</h2><p>Based on your review signals</p></div></div><div class="action-form"><div class="recommendation">${icon("sparkles")}<span>Your promotion readiness is strong. Completing the finance accelerator closes the only recurring skill gap in manager and 360 feedback.</span></div><button class="button full" data-action="enroll">${icon("graduation-cap")} Enroll in accelerator</button></div></aside></section>`;
}

function render() {
  if (state.role === "employee" && state.view === "cycles") state.view = "overview";
  renderNav();
  document.querySelector("#globalLaunchButton").hidden = state.role === "employee";
  const views = { overview: overviewScreen, cycles: cyclesScreen, people: peopleScreen, employee: employeeDetailScreen, actions: actionsScreen, approvals: approvalsScreen };
  app.innerHTML = `<div class="page-enter">${(views[state.view] || overviewScreen)()}</div>`;
  const labels = { overview: state.role === "employee" ? "My performance" : "Overview", cycles: "Review cycles", people: "People & calibration", employee: "Appraisal details", actions: "Actions & rewards", approvals: "Approvals" };
  document.querySelector("#pageCrumb").textContent = labels[state.view];
  document.querySelector(".sidebar").classList.remove("open");
  refreshIcons();
}

function showToast(message) {
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerHTML = `${icon("circle-check-big")}<strong>${message}</strong>`;
  document.querySelector("#toastRoot").appendChild(toast);
  refreshIcons();
  setTimeout(() => toast.remove(), 3400);
}

function openCycleModal() {
  document.querySelector("#modalRoot").innerHTML = `<div class="modal-backdrop" data-action="close-modal"><section class="modal" role="dialog" aria-modal="true" aria-labelledby="modalTitle"><div class="modal-header"><div><p class="eyebrow">Automated enrollment</p><h2 id="modalTitle">Launch a review cycle</h2><p>Choose eligibility rules. Employees will be enrolled automatically.</p></div><button class="icon-button" data-action="close-modal" title="Close">${icon("x")}</button></div><div class="modal-body"><div class="field" style="margin-bottom:16px"><label>Cycle template</label><select><option>FY26 Emerging Leaders Review</option><option>Annual Performance Review</option><option>New Leader 90-day Check-in</option></select></div><label class="enrollment-rule"><input type="checkbox" checked><span><strong>Active employees with 90+ days tenure</strong><small>Excludes contractors and employees on extended leave</small></span><span class="badge green">232</span></label><label class="enrollment-rule"><input type="checkbox" checked><span><strong>Grade P4 and above</strong><small>Career framework eligibility rule</small></span><span class="badge green">186</span></label><label class="enrollment-rule"><input type="checkbox"><span><strong>People managers only</strong><small>Employees with one or more direct reports</small></span><span class="badge gray">42</span></label><div class="match-summary"><span><strong>186</strong><br><small>employees matched</small></span><div class="avatar-group"><span class="avatar avatar-photo priya"></span><span class="avatar avatar-photo daniel"></span><span class="avatar avatar-photo sofia"></span><span class="avatar">+183</span></div></div></div><div class="modal-footer"><button class="button" data-action="close-modal">Cancel</button><button class="button primary" data-action="confirm-launch">${icon("rocket")} Schedule & enroll</button></div></section></div>`;
  refreshIcons();
}

function closeModal() {
  document.querySelector("#modalRoot").innerHTML = "";
}

document.addEventListener("click", event => {
  const navTarget = event.target.closest("[data-nav]");
  if (navTarget) {
    event.preventDefault();
    state.view = navTarget.dataset.nav;
    render();
    app.focus();
    return;
  }
  const employeeTarget = event.target.closest("[data-employee]");
  if (employeeTarget && !employeeTarget.dataset.action) {
    state.selectedEmployee = employeeTarget.dataset.employee;
    state.view = "employee";
    render();
    return;
  }
  const tab = event.target.closest("[data-tab]");
  if (tab) {
    state.insightTab = tab.dataset.tab;
    render();
    return;
  }
  const actionTarget = event.target.closest("[data-action]");
  if (!actionTarget) return;
  const action = actionTarget.dataset.action;
  if (action === "launch-cycle") openCycleModal();
  if (action === "close-modal") closeModal();
  if (action === "confirm-launch") { state.launched = true; closeModal(); state.view = "cycles"; render(); showToast("Cycle scheduled and 186 employees auto-enrolled"); }
  if (action === "send-nudges") showToast("Personalized nudges sent to pending reviewers");
  if (action === "print") window.print();
  if (action === "save-draft") showToast("Recommendation draft saved");
  if (action === "submit-recommendation") { state.view = "approvals"; render(); showToast("Promotion, grade, and salary changes routed for approval"); }
  if (action === "submit-batch") showToast("Recommendation batch submitted for approval");
  if (action === "approve") { state.approved.add(actionTarget.dataset.id); render(); showToast("Decision approved and routed to the next level"); }
  if (action === "reject") showToast("Decision returned to the manager with comments");
  if (action === "cycle-details") showToast("Cycle workspace opened");
  if (["self-review","add-goal","enroll","open-guide"].includes(action)) showToast(action === "enroll" ? "Enrollment request sent to your manager" : "Prototype action completed");
});

document.addEventListener("input", event => {
  if (event.target.id === "peopleSearch") {
    state.peopleQuery = event.target.value;
    const cursor = event.target.selectionStart;
    render();
    const replacement = document.querySelector("#peopleSearch");
    replacement.focus();
    replacement.setSelectionRange(cursor, cursor);
  }
});

roleSelect.addEventListener("change", event => {
  state.role = event.target.value;
  state.view = "overview";
  const signedIn = document.querySelector(".signed-in small");
  signedIn.textContent = state.role === "hr" ? "HR Business Partner" : state.role === "manager" ? "People Manager" : "Employee";
  render();
  showToast(`Switched to ${event.target.options[event.target.selectedIndex].text}`);
});

document.querySelector("#mobileMenu").addEventListener("click", () => document.querySelector(".sidebar").classList.toggle("open"));

render();
