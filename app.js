const state = {
  role: "hr",
  view: "overview",
  selectedEmployee: "priya",
  insightTab: "goals",
  talentTab: "bell",
  thirdAxis: "readiness",
  thirdLayer: 2,
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
    ["talent", "chart-scatter", "Talent insights"],
    ["actions", "badge-dollar-sign", "Actions & rewards"],
    ["approvals", "git-pull-request-arrow", "Approvals", "4"],
  ],
  manager: [
    ["overview", "layout-dashboard", "Team overview"],
    ["people", "users-round", "My team", "8"],
    ["talent", "chart-scatter", "Team talent insights"],
    ["actions", "list-checks", "Team recommendations"],
    ["approvals", "git-pull-request-arrow", "My approvals", "2"],
  ],
  employee: [
    ["overview", "layout-dashboard", "My performance"],
    ["history", "history", "Performance history"],
    ["development", "sprout", "Goals & development"],
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

function statCard(label, value, note, glyph, tone, visualization = "") {
  const drilldown = visualization ? ` data-action="open-visualization" data-viz="${visualization}" role="button" tabindex="0"` : "";
  return `<article class="card stat-card${visualization ? " drilldown-card" : ""}"${drilldown}>
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
      manager ? "Good morning, Jordan" : "Performance at a glance",
      manager ? "Keep every conversation moving and turn review signals into meaningful action." : "Track cycle progress, intervene early, and move talent decisions forward with confidence.",
      `<button class="button" data-action="send-nudges">${icon("send")} Send nudges</button><button class="button primary" data-nav="people">${icon("users")} ${manager ? "Review my team" : "Open calibration"}</button>`
    )}
    <section class="stats-grid">
      ${statCard(manager ? "Team reviews" : "Employees scheduled", manager ? "8" : "248", `<strong>100%</strong> auto-enrolled`, "calendar-check", "green", "scheduled")}
      ${statCard("Completed", manager ? "3" : "159", `<strong>+18%</strong> since last week`, "circle-check-big", "blue", "completed")}
      ${statCard("Pending action", manager ? "5" : "67", manager ? "2 due this week" : "27 awaiting managers", "clock-3", "amber", "pending")}
      ${statCard("At-risk flags", manager ? "2" : "12", "Requires timely follow-up", "triangle-alert", "coral", "risk")}
    </section>
    <section class="dashboard-grid">
      <div class="stack">
        <article class="card drilldown-card" data-action="open-visualization" data-viz="cycle" role="button" tabindex="0">
          <div class="section-header"><div><h2>Cycle health</h2><p>FY26 Annual Review · 01 Sep – 15 Nov</p></div><button class="section-link" data-action="open-visualization" data-viz="cycle">Explore data</button></div>
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
        <article class="card drilldown-card" data-action="open-visualization" data-viz="departments" role="button" tabindex="0">
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
        <article class="card drilldown-card" data-action="open-visualization" data-viz="signals" role="button" tabindex="0">
          <div class="section-header"><div><h2>Signals to act on</h2><p>AI-assisted, manager-reviewed</p></div><span class="badge coral">3 urgent</span></div>
          <div class="risk-row" data-employee="sofia"><span class="risk-symbol">${icon("trending-down")}</span><span><strong>Performance shift</strong><small>Sofia Martinez · rating trend down 0.9</small></span><span class="score">3.1</span></div>
          <div class="risk-row" data-employee="priya"><span class="risk-symbol amber">${icon("graduation-cap")}</span><span><strong>Skill gap blocks growth</strong><small>Priya Nair · strategic finance</small></span><span class="badge amber">Gap</span></div>
          <div class="risk-row" data-employee="omar"><span class="risk-symbol">${icon("message-square-warning")}</span><span><strong>Feedback pattern</strong><small>Omar Haddad · 3 similar comments</small></span><span class="badge coral">At risk</span></div>
        </article>
        <article class="card drilldown-card" data-action="open-visualization" data-viz="decisions" role="button" tabindex="0">
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

function insightMetric(label, value, note, tone = "") {
  return `<div class="insight-metric ${tone}"><span>${label}</span><strong>${value}</strong><small>${note}</small></div>`;
}

function insightSection(title, subtitle, content) {
  return `<section class="insight-section"><div class="insight-section-heading"><div><h3>${title}</h3><p>${subtitle}</p></div></div>${content}</section>`;
}

const thirdAxisModels = {
  readiness: {
    label: "Readiness / aptitude",
    axisLabel: "Readiness",
    levels: ["Building", "Near-ready", "Ready now"],
    colors: [0x8fa79b, 0x80ad91, 0xd7ef74],
    org: [
      [10, 5, 2, 18, 20, 8, 8, 10, 5],
      [12, 10, 5, 15, 38, 16, 1, 10, 6],
      [6, 4, 5, 3, 12, 8, 0, 4, 7],
    ],
    team: [
      [0, 0, 0, 1, 1, 0, 1, 0, 0],
      [1, 0, 0, 0, 1, 1, 0, 0, 0],
      [0, 0, 1, 0, 0, 1, 0, 0, 0],
    ],
  },
  culture: {
    label: "Values / culture fit",
    axisLabel: "Culture fit",
    levels: ["Concern", "Aligned", "Role model"],
    colors: [0xe28b7d, 0x78a58d, 0xd7ef74],
    org: [
      [4, 1, 0, 4, 5, 1, 5, 4, 3],
      [21, 14, 4, 25, 62, 18, 3, 12, 7],
      [3, 4, 8, 7, 12, 12, 1, 4, 4],
    ],
    team: [
      [0, 0, 0, 0, 1, 0, 1, 0, 0],
      [1, 0, 0, 1, 1, 1, 0, 0, 0],
      [0, 1, 1, 0, 0, 0, 0, 0, 0],
    ],
  },
  risk: {
    label: "Risk of loss / retention risk",
    axisLabel: "Risk of loss",
    levels: ["Low risk", "Moderate risk", "High risk"],
    colors: [0x76a88b, 0xe0b75c, 0xe16f61],
    org: [
      [20, 15, 10, 25, 48, 20, 1, 7, 5],
      [6, 3, 2, 8, 28, 8, 3, 8, 4],
      [2, 1, 0, 3, 8, 2, 5, 5, 1],
    ],
    team: [
      [1, 1, 1, 1, 1, 0, 0, 0, 0],
      [0, 0, 0, 0, 1, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 1, 1, 0, 0],
    ],
  },
};

const nineBoxCells = [
  ["Growth talent", "accent", "Elena", "Develop performance"],
  ["High potential", "strong", "Daniel", "Broaden scope"],
  ["Future leader", "standout", "Priya", "Accelerate & retain"],
  ["Emerging", "", "Sofia", "Targeted development"],
  ["Core contributor", "", "Marcus", "Engage & deepen"],
  ["High impact", "strong", "Daniel", "Recognize expertise"],
  ["Reassess fit", "watch", "Omar", "Immediate support"],
  ["Steady", "", "Sofia", "Clarify expectations"],
  ["Trusted expert", "accent", "Marcus", "Specialist pathway"],
];

function renderNineBoxSlice(model, layers, population) {
  const counts = layers[state.thirdLayer];
  const layerName = model.levels[state.thirdLayer];
  const slicePopulation = counts.reduce((total, count) => total + count, 0);
  const cells = nineBoxCells.map(([label, tone, person, action], index) => {
    const count = counts[index];
    const share = population ? (count / population * 100).toFixed(1) : "0.0";
    return `<div class="matrix-cell ${tone}"><strong>${label}</strong><span class="cell-share">${count} · ${share}% total</span>${count ? `<span class="people-chip">${person}</span>` : ""}<small>${action}</small></div>`;
  }).join("");
  return {
    slicePopulation,
    markup: insightSection(`${layerName} slice · ${model.axisLabel}`, `${slicePopulation} of ${population} people · selected layer in the 3D model`, `<div class="matrix-wrap"><div class="matrix-axis y-axis">Potential ${icon("arrow-up")}</div><div class="nine-box">${cells}</div><div class="matrix-axis x-axis">Performance ${icon("arrow-right")}</div></div>`),
  };
}

function renderTalentCube(model, layers, population, slicePopulation) {
  const axisOptions = Object.entries(thirdAxisModels).map(([value, option]) => `<option value="${value}" ${state.thirdAxis === value ? "selected" : ""}>${option.label}</option>`).join("");
  const layerButtons = model.levels.map((level, index) => `<button class="cube-layer ${state.thirdLayer === index ? "active" : ""}" data-third-layer="${index}" aria-pressed="${state.thirdLayer === index}"><i style="background:#${model.colors[index].toString(16).padStart(6, "0")}"></i><span>${level}</span><strong>${layers[index].reduce((total, count) => total + count, 0)}</strong></button>`).join("");
  const sliceShare = population ? (slicePopulation / population * 100).toFixed(1) : "0.0";
  return `<section class="cube-experience" aria-labelledby="cubeTitle"><header class="cube-toolbar"><div><span class="badge green">3 × 3 × 3</span><h3 id="cubeTitle">3D talent cube</h3></div><div class="cube-axis-picker"><label for="thirdAxisSelect">Third axis</label><select id="thirdAxisSelect">${axisOptions}</select><button class="icon-button" data-action="reset-cube" title="Reset cube view" aria-label="Reset cube view">${icon("rotate-ccw")}</button></div></header><div class="cube-layout"><div class="cube-stage"><div id="talentCube" role="img" aria-label="Performance by potential by ${model.axisLabel} 3D talent cube"><div class="cube-fallback">3D view unavailable</div></div><span class="cube-axis-label cube-axis-x">Performance</span><span class="cube-axis-label cube-axis-y">Potential</span><span class="cube-axis-label cube-axis-z">${model.axisLabel}</span></div><aside class="cube-side" aria-live="polite"><span class="eyebrow">Selected layer</span><strong>${model.levels[state.thirdLayer]}</strong><small>${slicePopulation} people · ${sliceShare}% of cohort</small><div class="cube-layers" role="group" aria-label="${model.axisLabel} layer">${layerButtons}</div><div class="cube-dimensions"><span><i class="axis-dot x"></i>Performance</span><span><i class="axis-dot y"></i>Potential</span><span><i class="axis-dot z"></i>${model.axisLabel}</span></div></aside></div></section>`;
}

function talentInsightsScreen() {
  const manager = state.role === "manager";
  const tabs = [["bell", "bar-chart-3", "Bell curve"], ["ninebox", "grid-3x3", "9-box matrix"], ["succession", "route", "Succession"]];
  const bellPopulation = manager ? 8 : 248;
  const bellCurve = `<div class="insight-filterbar"><div><strong>Rating distribution</strong><small>Calibrated results · updated 17 Sep</small></div><div class="insight-filters"><select aria-label="Review cycle"><option>FY26 Annual Review</option><option>FY25 Annual Review</option></select>${manager ? "" : `<select aria-label="Organization"><option>All organizations</option><option>Product</option><option>Engineering</option><option>Sales</option></select>`}<select aria-label="Employee grade"><option>All grades</option><option>P1–P3</option><option>P4–P6</option><option>Leadership</option></select></div></div>
    <div class="talent-summary expanded">${insightMetric("Population", bellPopulation, manager ? "Direct reports" : "98% coverage")}${insightMetric("Mean rating", "3.7", "+0.2 vs FY25", "positive")}${insightMetric("Median", "3.6", "Middle of cohort")}${insightMetric("Std. deviation", "0.82", "Healthy spread")}${insightMetric("Outside guideline", manager ? "2" : "21", `${manager ? "25%" : "8.5%"} of population`, "warning")}${insightMetric("Distribution fit", "86%", "Against target curve", "positive")}</div>
    ${insightSection("Calibrated distribution", "Count, cohort percentage, and target range by rating", `<div class="histogram" aria-label="Rating distribution"><div class="histogram-column"><span style="height:18%"></span><strong>${manager ? 1 : 12} <em>${manager ? "12.5%" : "4.8%"}</em></strong><small>1 · Needs support<br>Target 3–5%</small></div><div class="histogram-column"><span style="height:35%"></span><strong>${manager ? 1 : 31} <em>${manager ? "12.5%" : "12.5%"}</em></strong><small>2 · Developing<br>Target 8–12%</small></div><div class="histogram-column target"><span style="height:88%"></span><strong>${manager ? 3 : 112} <em>${manager ? "37.5%" : "45.2%"}</em></strong><small>3 · Meets<br>Target 60–70%</small></div><div class="histogram-column"><span style="height:68%"></span><strong>${manager ? 2 : 72} <em>${manager ? "25%" : "29.0%"}</em></strong><small>4 · Exceeds<br>Target 15–22%</small></div><div class="histogram-column"><span style="height:32%"></span><strong>${manager ? 1 : 21} <em>${manager ? "12.5%" : "8.5%"}</em></strong><small>5 · Exceptional<br>Target 3–6%</small></div></div><div class="chart-note">${icon("info")} “Meets” is 14.8 points below guideline; upper ratings are 10.5 points above guideline.</div>`)}
    <div class="insight-split">${insightSection("Calibration movement", "Change from manager proposal to final rating", `<div class="insight-metric-grid compact">${insightMetric("Ratings changed", manager ? "2" : "47", manager ? "25% of team" : "19.0% of cohort", "warning")}${insightMetric("Upward", manager ? "1" : "18", "+1 level average")}${insightMetric("Downward", manager ? "1" : "29", "−1.2 levels average")}${insightMetric("Net shift", "−0.08", "Final vs proposed")}${insightMetric("Largest shift", "−2", manager ? "1 employee affected" : "3 employees affected", "warning")}${insightMetric("Appeals open", manager ? "0" : "4", manager ? "No team appeals" : "1.6% of cohort")}</div>`)}${insightSection("Rating quality", "Consistency and evidence health", `<div class="insight-metric-grid compact">${insightMetric("Evidence coverage", "94%", "Goals + feedback attached", "positive")}${insightMetric(manager ? "Team rating spread" : "Manager variance", "0.34", manager ? "Compared with org 0.41" : "Across 24 managers")}${insightMetric("Leniency index", "+0.18", "Above org average", "warning")}${insightMetric(manager ? "Evidence gaps" : "Outlier managers", manager ? "1" : "3", manager ? "Review before sign-off" : "> 1 SD from norm", "warning")}${insightMetric("Goal correlation", "0.71", "Rating vs achievement")}${insightMetric("360 correlation", "0.64", "Rating vs feedback")}</div>`)}</div>
    ${insightSection(manager ? "Department fairness benchmark" : "Fairness & representation checks", manager ? "Aggregated department indicators; team-level demographic results are suppressed for privacy" : "Directional indicators for HR review; not automated decision criteria", `<div class="fairness-grid"><div><span>Women · mean rating</span><strong>3.68</strong><small>−0.04 vs men</small><i class="fairness-bar"><b style="width:96%"></b></i></div><div><span>Underrepresented groups</span><strong>3.61</strong><small>−0.10 vs cohort</small><i class="fairness-bar warning"><b style="width:89%"></b></i></div><div><span>Remote employees</span><strong>3.55</strong><small>−0.17 vs office</small><i class="fairness-bar warning"><b style="width:84%"></b></i></div><div><span>New hires</span><strong>3.42</strong><small>−0.28 vs tenured</small><i class="fairness-bar"><b style="width:78%"></b></i></div><div><span>Adverse impact ratio</span><strong>0.91</strong><small>Threshold ≥ 0.80</small><i class="fairness-bar"><b style="width:91%"></b></i></div><div><span>Unexplained gap</span><strong>2.1%</strong><small>After role/grade controls</small><i class="fairness-bar"><b style="width:98%"></b></i></div></div>`)}
    ${insightSection("Rating-linked outcomes", "Downstream decisions and prior-cycle outcome signals", `<div class="insight-metric-grid outcome-grid">${insightMetric("Top ratings", manager ? "37.5%" : "37.5%", "Ratings 4–5")}${insightMetric("Promotion rate", manager ? "12.5%" : "7.3%", "Recommended this cycle", "positive")}${insightMetric("Mean merit increase", "5.8%", "Top-rated cohort")}${insightMetric("Development actions", manager ? "37.5%" : "29.0%", "Plans or stretch roles")}${insightMetric("Support plans", manager ? "1" : "9", "For ratings 1–2", "warning")}${insightMetric("Prior-year attrition", "8.2%", "By equivalent rating mix")}</div>`)}
    ${insightSection("Three-cycle trend", "Distribution stability and rating inflation", `<div class="trend-table"><div class="trend-row heading"><span>Cycle</span><span>Mean</span><span>Top ratings</span><span>Low ratings</span><span>Changed in calibration</span></div><div class="trend-row"><strong>FY26</strong><span>3.70</span><span>37.5%</span><span>17.3%</span><span>19.0%</span></div><div class="trend-row"><strong>FY25</strong><span>3.50</span><span>31.2%</span><span>18.1%</span><span>15.4%</span></div><div class="trend-row"><strong>FY24</strong><span>3.44</span><span>28.6%</span><span>19.7%</span><span>14.8%</span></div></div>`)}`;
  const thirdAxisModel = thirdAxisModels[state.thirdAxis];
  const thirdAxisLayers = thirdAxisModel[manager ? "team" : "org"];
  const nineBoxPopulation = manager ? 8 : 248;
  const nineBoxSlice = renderNineBoxSlice(thirdAxisModel, thirdAxisLayers, nineBoxPopulation);
  const nineBox = `<div class="insight-filterbar"><div><strong>Performance × potential × ${thirdAxisModel.axisLabel}</strong><small>Calibrated placement · ${manager ? "8 direct reports" : "248 employees"}</small></div><div class="insight-filters"><select aria-label="9-box cycle"><option>FY26 Annual Review</option><option>FY25 Annual Review</option></select>${manager ? "" : `<select aria-label="9-box organization"><option>All organizations</option><option>Product</option><option>Engineering</option><option>Sales</option></select>`}<select aria-label="Critical talent"><option>All talent</option><option>Critical roles</option><option>High flight risk</option><option>Promotion ready</option></select></div></div>
    <div class="talent-summary expanded">${insightMetric("Population plotted", manager ? "8" : "248", "100% assessed")}${insightMetric("High potential", manager ? "3" : "59", manager ? "37.5% of team" : "23.8% of cohort", "positive")}${insightMetric("High performers", manager ? "2" : "52", manager ? "25% of team" : "21.0% of cohort")}${insightMetric("Future leaders", manager ? "1" : "12", "High performance + potential", "positive")}${insightMetric("High flight risk", manager ? "1" : "17", "Action recommended", "warning")}${insightMetric("Critical role coverage", "73%", "+11% vs FY25")}</div>
    ${renderTalentCube(thirdAxisModel, thirdAxisLayers, nineBoxPopulation, nineBoxSlice.slicePopulation)}
    ${nineBoxSlice.markup}
    <div class="insight-split">${insightSection("Movement since FY25", "How employee placement changed", `<div class="insight-metric-grid compact">${insightMetric("Moved up/right", manager ? "2" : "51", "Positive movement", "positive")}${insightMetric("Moved down/left", manager ? "1" : "23", "Needs review", "warning")}${insightMetric("Unchanged", manager ? "4" : "153", "Stable placement")}${insightMetric("Newly assessed", manager ? "1" : "21", "No prior placement")}${insightMetric("Potential upgraded", manager ? "1" : "29", manager ? "12.5% of team" : "11.7% of cohort")}${insightMetric("Performance upgraded", manager ? "1" : "34", manager ? "12.5% of team" : "13.7% of cohort")}</div>`)}${insightSection("Talent actions", "Actions generated from calibrated placement", `<div class="insight-metric-grid compact">${insightMetric("Promotion ready", manager ? "1" : "18", "Meets policy threshold", "positive")}${insightMetric("Succession slate", manager ? "2" : "37", "Named to critical roles")}${insightMetric("Retention priority", manager ? "1" : "17", "High talent + flight risk", "warning")}${insightMetric("Stretch assignment", manager ? "2" : "43", "Ready for broader scope")}${insightMetric("Development plan", manager ? "3" : "72", "Skill intervention")}${insightMetric("Performance support", manager ? "1" : "9", "Immediate action", "warning")}</div>`)}</div>
    ${insightSection("Readiness, risk & mobility", "Forward-looking talent health", `<div class="fairness-grid"><div><span>Ready now</span><strong>${manager ? "1" : "18"}</strong><small>For next role</small><i class="fairness-bar"><b style="width:73%"></b></i></div><div><span>Ready in 1–2 years</span><strong>${manager ? "2" : "42"}</strong><small>Active development</small><i class="fairness-bar"><b style="width:62%"></b></i></div><div><span>Mobility willing</span><strong>64%</strong><small>Location or function</small><i class="fairness-bar"><b style="width:64%"></b></i></div><div><span>Critical skills match</span><strong>78%</strong><small>Against future roles</small><i class="fairness-bar"><b style="width:78%"></b></i></div><div><span>High flight risk</span><strong>${manager ? "1" : "17"}</strong><small>${manager ? "12.5%" : "6.9%"} of cohort</small><i class="fairness-bar warning"><b style="width:31%"></b></i></div><div><span>Retention actions open</span><strong>${manager ? "1" : "12"}</strong><small>${manager ? "1 awaiting owner" : "5 awaiting owner"}</small><i class="fairness-bar warning"><b style="width:48%"></b></i></div></div>`)}
    <div class="insight-split">${insightSection("Placement stability", "Tenure, confidence, and calibration quality", `<div class="insight-metric-grid compact">${insightMetric("Average time in box", "1.4 cycles", "Across assessed talent")}${insightMetric("Same box 2+ cycles", manager ? "2" : "64", "Stagnation watch", "warning")}${insightMetric("Placement overrides", manager ? "1" : "16", "Final vs proposed")}${insightMetric("Assessor disagreement", manager ? "2" : "38", "Manager vs panel", "warning")}${insightMetric("Low confidence", manager ? "0" : "11", "Evidence below threshold")}${insightMetric("Missing evidence", manager ? "1" : "14", "Potential rationale due", "warning")}</div>`)}${insightSection("Development & mobility outcomes", "Coverage and realized movement", `<div class="insight-metric-grid compact">${insightMetric("Plan coverage", "88%", "High-potential cohort", "positive")}${insightMetric("Mentors assigned", manager ? "2" : "41", "Active pairings")}${insightMetric("Stretch placements", manager ? "2" : "34", "Started this cycle")}${insightMetric("Internal moves", manager ? "1" : "23", "Last 12 months", "positive")}${insightMetric("Promotions realized", manager ? "1" : "15", "From prior matrix")}${insightMetric("Regrettable exits", manager ? "0" : "6", "High-value talent", manager ? "" : "warning")}</div>`)}</div>
    ${insightSection(manager ? "Department representation benchmark" : "Representation & assessment quality", manager ? "Aggregated department composition; team-level demographic results are suppressed for privacy" : "Composition of high-potential and future-leader cohorts", `<div class="trend-table"><div class="trend-row heading"><span>Cohort check</span><span>Overall</span><span>High potential</span><span>Future leaders</span><span>Gap</span></div><div class="trend-row"><strong>Women</strong><span>46%</span><span>44%</span><span>42%</span><span class="metric-gap">−4 pts</span></div><div class="trend-row"><strong>Underrepresented groups</strong><span>29%</span><span>26%</span><span>25%</span><span class="metric-gap">−4 pts</span></div><div class="trend-row"><strong>Remote employees</strong><span>38%</span><span>31%</span><span>25%</span><span class="metric-gap warning">−13 pts</span></div><div class="trend-row"><strong>Assessment confidence</strong><span>—</span><span>91%</span><span>96%</span><span>Healthy</span></div></div>`)}`;
  const succession = `<div class="talent-summary"><div><span>Critical roles</span><strong>${manager ? "3" : "26"}</strong><small>In current scope</small></div><div><span>Coverage</span><strong>73%</strong><small>+11% vs last cycle</small></div><div><span>Ready now</span><strong>${manager ? "2" : "18"}</strong><small>Named successors</small></div></div><div class="succession-list"><div class="succession-row"><div><strong>VP, Product</strong><small>Critical role · Incumbent: Jordan Lee</small></div><div class="successor-pipeline"><span class="avatar avatar-photo priya"></span><span><strong>Priya Nair</strong><small>Ready 1–2 years</small></span></div><span class="badge amber">1 successor</span></div><div class="succession-row"><div><strong>Engineering Director</strong><small>Critical role · Incumbent: Taylor Chen</small></div><div class="successor-pipeline"><span class="avatar avatar-photo daniel"></span><span><strong>Daniel Kim</strong><small>Ready now</small></span></div><span class="badge green">2 successors</span></div><div class="succession-row"><div><strong>Customer Success Director</strong><small>Critical role · Vacancy risk: medium</small></div><div class="successor-pipeline"><span class="avatar avatar-photo sofia"></span><span><strong>Sofia Martinez</strong><small>Ready 3+ years</small></span></div><span class="badge coral">Coverage risk</span></div></div>`;
  const content = { bell: bellCurve, ninebox: nineBox, succession }[state.talentTab];
  return `${pageHeading(manager ? "Team talent planning" : "Organization talent planning", "Talent insights", "Explore calibrated performance distribution, potential, and succession coverage in one decision workspace.", `<button class="button">${icon("download")} Export view</button><button class="button primary" data-nav="people">${icon("users")} Open calibration</button>`)}<article class="card talent-workspace"><div class="insight-tabs">${tabs.map(([id, glyph, label]) => `<button class="tab ${state.talentTab === id ? "active" : ""}" data-talent-tab="${id}">${icon(glyph)} ${label}</button>`).join("")}</div><div class="talent-panel">${content}</div></article>`;
}

let talentCubeCleanup = null;

function initTalentCube() {
  const container = document.querySelector("#talentCube");
  if (!container || !window.THREE) return null;
  const model = thirdAxisModels[state.thirdAxis] || thirdAxisModels.readiness;
  const layers = model[state.role === "manager" ? "team" : "org"];
  const width = Math.max(container.clientWidth, 280);
  const height = Math.max(container.clientHeight, 320);
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(width, height, false);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.domElement.setAttribute("aria-hidden", "true");
  container.prepend(renderer.domElement);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xf3f7f4);
  const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
  camera.position.set(4.6, 3.5, 5.5);
  camera.lookAt(0, 0.08, 0);
  const group = new THREE.Group();
  group.rotation.set(-0.32, -0.62, 0.04);
  scene.add(group);

  const cubeGeometry = new THREE.BoxGeometry(0.78, 0.78, 0.78);
  const edgeGeometry = new THREE.EdgesGeometry(cubeGeometry);
  const materials = [];
  const meshes = [];
  const maxCount = Math.max(...layers.flat(), 1);
  layers.forEach((counts, layerIndex) => counts.forEach((count, cellIndex) => {
    const selected = layerIndex === state.thirdLayer;
    const color = new THREE.Color(model.colors[layerIndex]);
    color.offsetHSL(0, 0, count ? -(count / maxCount) * 0.08 : 0.08);
    const material = new THREE.MeshStandardMaterial({
      color,
      transparent: true,
      opacity: selected ? (count ? 0.92 : 0.2) : (count ? 0.27 : 0.07),
      roughness: 0.62,
      metalness: 0.02,
      depthWrite: selected,
    });
    materials.push(material);
    const cube = new THREE.Mesh(cubeGeometry, material);
    cube.position.set((cellIndex % 3 - 1) * 1.02, (1 - Math.floor(cellIndex / 3)) * 1.02, (layerIndex - 1) * 1.02);
    const scale = 0.88 + count / maxCount * 0.12;
    cube.scale.setScalar(selected ? scale : scale * 0.94);
    cube.userData.layer = layerIndex;
    group.add(cube);
    meshes.push(cube);
    const edgeMaterial = new THREE.LineBasicMaterial({ color: selected ? 0x294a3c : 0x91a49a, transparent: true, opacity: selected ? 0.58 : 0.22 });
    materials.push(edgeMaterial);
    const edges = new THREE.LineSegments(edgeGeometry, edgeMaterial);
    cube.add(edges);
  }));

  scene.add(new THREE.HemisphereLight(0xffffff, 0x8aa497, 2.1));
  const keyLight = new THREE.DirectionalLight(0xffffff, 2.2);
  keyLight.position.set(4, 7, 5);
  scene.add(keyLight);
  const fillLight = new THREE.DirectionalLight(0xd7ef74, 1.1);
  fillLight.position.set(-5, -2, 3);
  scene.add(fillLight);

  let animationFrame;
  let dragging = false;
  let moved = false;
  let previousX = 0;
  let previousY = 0;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();

  const renderFrame = () => {
    if (!reducedMotion && !dragging) group.rotation.y += 0.0012;
    renderer.render(scene, camera);
    animationFrame = requestAnimationFrame(renderFrame);
  };
  const resize = () => {
    const nextWidth = Math.max(container.clientWidth, 280);
    const nextHeight = Math.max(container.clientHeight, 320);
    camera.aspect = nextWidth / nextHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(nextWidth, nextHeight, false);
  };
  const pointerDown = event => {
    dragging = true;
    moved = false;
    previousX = event.clientX;
    previousY = event.clientY;
    renderer.domElement.setPointerCapture(event.pointerId);
  };
  const pointerMove = event => {
    if (!dragging) return;
    const deltaX = event.clientX - previousX;
    const deltaY = event.clientY - previousY;
    if (Math.abs(deltaX) + Math.abs(deltaY) > 2) moved = true;
    group.rotation.y += deltaX * 0.008;
    group.rotation.x = Math.max(-1.1, Math.min(0.65, group.rotation.x + deltaY * 0.008));
    previousX = event.clientX;
    previousY = event.clientY;
  };
  const pointerUp = event => {
    dragging = false;
    if (moved) return;
    const bounds = renderer.domElement.getBoundingClientRect();
    pointer.set((event.clientX - bounds.left) / bounds.width * 2 - 1, -(event.clientY - bounds.top) / bounds.height * 2 + 1);
    raycaster.setFromCamera(pointer, camera);
    const selectedCube = raycaster.intersectObjects(meshes, false)[0]?.object;
    if (selectedCube && selectedCube.userData.layer !== state.thirdLayer) {
      state.thirdLayer = selectedCube.userData.layer;
      render();
    }
  };
  const pointerCancel = () => {
    dragging = false;
  };
  const wheel = event => {
    event.preventDefault();
    camera.fov = Math.max(32, Math.min(58, camera.fov + Math.sign(event.deltaY) * 2));
    camera.updateProjectionMatrix();
  };
  renderer.domElement.addEventListener("pointerdown", pointerDown);
  renderer.domElement.addEventListener("pointermove", pointerMove);
  renderer.domElement.addEventListener("pointerup", pointerUp);
  renderer.domElement.addEventListener("pointercancel", pointerCancel);
  renderer.domElement.addEventListener("wheel", wheel, { passive: false });
  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(container);
  renderFrame();

  return () => {
    cancelAnimationFrame(animationFrame);
    resizeObserver.disconnect();
    renderer.domElement.removeEventListener("pointerdown", pointerDown);
    renderer.domElement.removeEventListener("pointermove", pointerMove);
    renderer.domElement.removeEventListener("pointerup", pointerUp);
    renderer.domElement.removeEventListener("pointercancel", pointerCancel);
    renderer.domElement.removeEventListener("wheel", wheel, { passive: false });
    cubeGeometry.dispose();
    edgeGeometry.dispose();
    materials.forEach(material => material.dispose());
    renderer.dispose();
  };
}

function employeeHistoryScreen() {
  return `${pageHeading("My record", "Performance history", "Review your finalized outcomes and growth themes. Manager-only calibration and reward data stays private.")}<section class="dashboard-grid"><article class="card"><div class="section-header"><div><h2>Three-year performance record</h2><p>Finalized performance outcomes</p></div><span class="badge green">Employee visible</span></div><div class="history"><div class="history-row"><strong>FY25</strong><div class="history-bar"><span style="width:84%"></span></div><strong>4.2</strong></div><div class="history-row"><strong>FY24</strong><div class="history-bar"><span style="width:86%"></span></div><strong>4.3</strong></div><div class="history-row"><strong>FY23</strong><div class="history-bar"><span style="width:78%"></span></div><strong>3.9</strong></div></div></article><aside class="card"><div class="section-header"><div><h2>Growth themes</h2><p>Across manager and peer feedback</p></div></div><div class="tab-panel"><blockquote class="quote">Consistent strength in product strategy and customer insight.<cite>FY25 finalized review</cite></blockquote><blockquote class="quote">Next growth edge: strategic finance and broader organizational leadership.<cite>Three-year trend</cite></blockquote></div></aside></section>`;
}

function employeeDashboard() {
  return `
    <section class="card employee-hero drilldown-card" data-action="open-visualization" data-viz="employee-progress" role="button" tabindex="0"><div><p class="eyebrow" style="color:var(--lime)">My FY26 review</p><h1>Your year, your growth, one clear story.</h1><p>Bring your achievements, feedback, and goals together before your manager conversation on 28 September.</p><button class="button lime" data-action="self-review">Continue self assessment ${icon("arrow-right")}</button></div><div class="employee-progress"><div class="progress-meta"><strong>Review progress</strong><span>3 of 5 steps complete</span></div><div class="progress-track"><span style="width:60%"></span></div></div></section>
    <section class="employee-grid"><div class="stack"><article class="card drilldown-card" data-action="open-visualization" data-viz="employee-evidence" role="button" tabindex="0"><div class="section-header"><div><h2>Your performance story</h2><p>Evidence collected across this review</p></div><button class="section-link" data-action="open-visualization" data-viz="employee-evidence">Explore</button></div><div class="metric-grid"><div class="metric"><span>Goals achieved</span><strong>94%</strong><small>4 of 5 complete</small></div><div class="metric"><span>Feedback</span><strong>12</strong><small>Peers & partners</small></div><div class="metric"><span>Skills grown</span><strong>4</strong><small>2 validated</small></div><div class="metric"><span>Recognition</span><strong>8</strong><small>Moments this year</small></div></div></article><article class="card drilldown-card" data-nav="history" role="button" tabindex="0"><div class="section-header"><div><h2>Three-year performance record</h2><p>Your historical record stays visible to you</p></div><button class="section-link" data-nav="history">Full details</button></div><div class="history"><div class="history-row"><strong>FY25</strong><div class="history-bar"><span style="width:84%"></span></div><strong>4.2</strong></div><div class="history-row"><strong>FY24</strong><div class="history-bar"><span style="width:86%"></span></div><strong>4.3</strong></div><div class="history-row"><strong>FY23</strong><div class="history-bar"><span style="width:78%"></span></div><strong>3.9</strong></div></div></article></div>
    <aside class="stack"><article class="card drilldown-card" data-action="open-visualization" data-viz="employee-timeline" role="button" tabindex="0"><div class="section-header"><div><h2>What happens next</h2><p>Your review timeline</p></div><button class="section-link" data-action="open-visualization" data-viz="employee-timeline">View dates</button></div><div class="timeline"><div class="timeline-item"><span class="timeline-dot">${icon("check")}</span><strong>Goals & evidence</strong><p>Completed 12 Sep</p></div><div class="timeline-item"><span class="timeline-dot">${icon("check")}</span><strong>Peer feedback</strong><p>12 responses received</p></div><div class="timeline-item"><span class="timeline-dot">${icon("pencil")}</span><strong>Self assessment</strong><p>Due 20 Sep · 80% complete</p></div><div class="timeline-item upcoming"><span class="timeline-dot">${icon("circle")}</span><strong>Manager conversation</strong><p>Scheduled 28 Sep, 10:00 AM</p></div><div class="timeline-item upcoming"><span class="timeline-dot">${icon("circle")}</span><strong>Outcome shared</strong><p>Expected 18 Nov</p></div></div></article></aside></section>`;
}

function developmentScreen() {
  return `${pageHeading("Growth plan", "Goals & development", "Turn review insights into practical actions you can revisit with your manager.", `<button class="button primary" data-action="add-goal">${icon("plus")} Add goal</button>`)}<section class="dashboard-grid"><article class="card"><div class="section-header"><div><h2>FY26 development goals</h2><p>3 active · 1 suggested from your review</p></div></div><div class="tab-panel"><div class="goal-row"><div><strong>Build strategic finance fluency</strong><p>Suggested from skill gap · Finance accelerator</p></div><div class="progress-track amber"><span style="width:38%"></span></div><strong>38%</strong></div><div class="goal-row"><div><strong>Lead a multi-product strategy</strong><p>Career growth · Sponsor: Jordan Lee</p></div><div class="progress-track"><span style="width:62%"></span></div><strong>62%</strong></div><div class="goal-row"><div><strong>Mentor two emerging PMs</strong><p>Leadership · 2 active mentees</p></div><div class="progress-track"><span style="width:76%"></span></div><strong>76%</strong></div></div></article><aside class="card"><div class="section-header"><div><h2>Recommended next step</h2><p>Based on your review signals</p></div></div><div class="action-form"><div class="recommendation">${icon("sparkles")}<span>Your promotion readiness is strong. Completing the finance accelerator closes the only recurring skill gap in manager and 360 feedback.</span></div><button class="button full" data-action="enroll">${icon("graduation-cap")} Enroll in accelerator</button></div></aside></section>`;
}

function render() {
  talentCubeCleanup?.();
  talentCubeCleanup = null;
  const roleViews = new Set(navByRole[state.role].map(([id]) => id));
  if (!roleViews.has(state.view) && !(state.view === "employee" && state.role !== "employee")) state.view = "overview";
  renderNav();
  document.querySelector("#globalLaunchButton").hidden = state.role !== "hr";
  document.querySelector(".cycle-chip").lastChild.textContent = state.role === "employee" ? "My FY26 Review" : "FY26 Annual Review";
  const views = { overview: overviewScreen, cycles: cyclesScreen, people: peopleScreen, employee: employeeDetailScreen, talent: talentInsightsScreen, actions: actionsScreen, approvals: approvalsScreen, history: employeeHistoryScreen, development: developmentScreen };
  app.innerHTML = `<div class="page-enter">${(views[state.view] || overviewScreen)()}</div>`;
  const labels = { overview: state.role === "employee" ? "My performance" : "Overview", cycles: "Review cycles", people: state.role === "manager" ? "My team" : "People & calibration", employee: "Appraisal details", talent: "Talent insights", actions: "Actions & rewards", approvals: "Approvals", history: "Performance history", development: "Goals & development" };
  document.querySelector("#pageCrumb").textContent = labels[state.view];
  document.querySelector(".sidebar").classList.remove("open");
  refreshIcons();
  if (document.querySelector("#talentCube")) talentCubeCleanup = initTalentCube();
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

function visualizationBars(items) {
  const max = Math.max(...items.map(item => item.value));
  return `<div class="viz-bars">${items.map(item => `<div class="viz-row"><span>${item.label}</span><div class="viz-track"><i style="width:${Math.max(item.value / max * 100, 4)}%"></i></div><strong>${item.display || item.value}</strong></div>`).join("")}</div>`;
}

function openVisualizationModal(key) {
  const manager = state.role === "manager";
  const visualizations = {
    scheduled: [manager ? "Team enrollment" : "Enrollment by function", "Every eligible employee is enrolled", visualizationBars(manager ? [{ label: "Product", value: 3 }, { label: "Engineering", value: 2 }, { label: "Design", value: 2 }, { label: "Operations", value: 1 }] : [{ label: "Engineering", value: 76 }, { label: "Sales", value: 58 }, { label: "Product", value: 52 }, { label: "Customer Success", value: 38 }, { label: "Finance", value: 24 }])],
    completed: ["Completion velocity", "Weekly completed reviews", `<div class="mini-column-chart">${[["W1",24],["W2",39],["W3",57],["W4",83],["W5",112],["W6",159]].map(([label, value]) => `<div class="mini-column"><strong>${manager ? Math.max(1, Math.round(value / 35)) : value}</strong><i style="height:${value / 159 * 100}%"></i><span>${label}</span></div>`).join("")}</div>`],
    pending: ["Pending actions", "Where work is waiting today", visualizationBars(manager ? [{ label: "Self assessment", value: 1 }, { label: "Manager review", value: 2 }, { label: "Calibration", value: 2 }] : [{ label: "Self assessment", value: 13 }, { label: "Manager review", value: 27 }, { label: "Calibration", value: 19 }, { label: "Acknowledgement", value: 8 }])],
    risk: ["At-risk signals", "Explainable flags requiring human review", visualizationBars(manager ? [{ label: "Rating shift", value: 1 }, { label: "Feedback pattern", value: 1 }, { label: "Goal slippage", value: 0 }] : [{ label: "Rating shift", value: 5 }, { label: "Feedback pattern", value: 4 }, { label: "Goal slippage", value: 2 }, { label: "Skill gap", value: 1 }])],
    cycle: ["Cycle stage funnel", "FY26 Annual Review progress", visualizationBars([{ label: "Enrolled", value: manager ? 8 : 248 }, { label: "Self assessment", value: manager ? 7 : 221 }, { label: "Manager review", value: manager ? 5 : 166 }, { label: "Calibration", value: manager ? 3 : 104 }, { label: "Complete", value: manager ? 3 : 159 }])],
    departments: [manager ? "Team review progress" : "Completion by department", "Ordered by completion risk", visualizationBars(manager ? [{ label: "Complete", value: 3, display: "3" }, { label: "In review", value: 3, display: "3" }, { label: "Not started", value: 2, display: "2" }] : [{ label: "Product", value: 78, display: "78%" }, { label: "Engineering", value: 71, display: "71%" }, { label: "Finance", value: 69, display: "69%" }, { label: "Sales", value: 56, display: "56%" }, { label: "Customer Success", value: 48, display: "48%" }])],
    signals: ["Signal distribution", "Patterns surfaced for manager review", visualizationBars(manager ? [{ label: "Performance shift", value: 1 }, { label: "Skill gap", value: 1 }] : [{ label: "Performance shift", value: 5 }, { label: "Feedback pattern", value: 4 }, { label: "Skill gap", value: 3 }])],
    decisions: ["Decision pipeline", "Post-appraisal recommendations", visualizationBars(manager ? [{ label: "Promotion", value: 1 }, { label: "Salary change", value: 5 }, { label: "Succession", value: 2 }, { label: "Development", value: 3 }] : [{ label: "Promotion", value: 14 }, { label: "Salary change", value: 18 }, { label: "Succession", value: 6 }, { label: "Development", value: 31 }])],
    "employee-progress": ["Review progress", "Your five-stage review journey", visualizationBars([{ label: "Goals & evidence", value: 100, display: "Done" }, { label: "Peer feedback", value: 100, display: "Done" }, { label: "Self assessment", value: 80, display: "80%" }, { label: "Manager conversation", value: 20, display: "28 Sep" }, { label: "Outcome", value: 5, display: "18 Nov" }])],
    "employee-evidence": ["Performance evidence", "Your contribution mix this year", visualizationBars([{ label: "Goals achieved", value: 94, display: "94%" }, { label: "Peer feedback", value: 80, display: "12" }, { label: "Skills validated", value: 55, display: "4" }, { label: "Recognition", value: 68, display: "8" }])],
    "employee-timeline": ["Review timeline", "Dates and remaining milestones", `<div class="timeline"><div class="timeline-item"><span class="timeline-dot">${icon("check")}</span><strong>Self assessment due</strong><p>20 September · 80% complete</p></div><div class="timeline-item upcoming"><span class="timeline-dot">${icon("calendar")}</span><strong>Manager conversation</strong><p>28 September · 10:00 AM</p></div><div class="timeline-item upcoming"><span class="timeline-dot">${icon("flag")}</span><strong>Outcome shared</strong><p>18 November</p></div></div>`],
  };
  const [title, subtitle, content] = visualizations[key] || visualizations.cycle;
  const destination = key === "decisions" ? "approvals" : ["signals", "risk"].includes(key) ? "people" : ["scheduled", "completed", "pending", "cycle", "departments"].includes(key) ? (state.role === "hr" ? "cycles" : "people") : "talent";
  document.querySelector("#modalRoot").innerHTML = `<div class="modal-backdrop" data-action="close-modal"><section class="modal visualization-modal" role="dialog" aria-modal="true" aria-labelledby="vizTitle"><div class="modal-header"><div><p class="eyebrow">Interactive detail</p><h2 id="vizTitle">${title}</h2><p>${subtitle}</p></div><button class="icon-button" data-action="close-modal" title="Close">${icon("x")}</button></div><div class="modal-body">${content}</div><div class="modal-footer"><button class="button" data-action="close-modal">Close</button>${state.role !== "employee" ? `<button class="button primary" data-nav="${destination}">Explore workspace ${icon("arrow-right")}</button>` : ""}</div></section></div>`;
  refreshIcons();
}

function closeModal() {
  document.querySelector("#modalRoot").innerHTML = "";
}

document.addEventListener("click", event => {
  const navTarget = event.target.closest("[data-nav]");
  if (navTarget) {
    event.preventDefault();
    closeModal();
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
  const talentTab = event.target.closest("[data-talent-tab]");
  if (talentTab) {
    state.talentTab = talentTab.dataset.talentTab;
    render();
    return;
  }
  const thirdLayer = event.target.closest("[data-third-layer]");
  if (thirdLayer) {
    state.thirdLayer = Number(thirdLayer.dataset.thirdLayer);
    render();
    return;
  }
  const actionTarget = event.target.closest("[data-action]");
  if (!actionTarget) return;
  const action = actionTarget.dataset.action;
  if (action === "launch-cycle") openCycleModal();
  if (action === "open-visualization") openVisualizationModal(actionTarget.dataset.viz);
  if (action === "close-modal") {
    if (actionTarget.classList.contains("modal-backdrop") && event.target !== actionTarget) return;
    closeModal();
  }
  if (action === "confirm-launch") { state.launched = true; closeModal(); state.view = "cycles"; render(); showToast("Cycle scheduled and 186 employees auto-enrolled"); }
  if (action === "send-nudges") showToast("Personalized nudges sent to pending reviewers");
  if (action === "print") window.print();
  if (action === "save-draft") showToast("Recommendation draft saved");
  if (action === "submit-recommendation") { state.view = "approvals"; render(); showToast("Promotion, grade, and salary changes routed for approval"); }
  if (action === "submit-batch") showToast("Recommendation batch submitted for approval");
  if (action === "approve") { state.approved.add(actionTarget.dataset.id); render(); showToast("Decision approved and routed to the next level"); }
  if (action === "reject") showToast("Decision returned to the manager with comments");
  if (action === "cycle-details") showToast("Cycle workspace opened");
  if (action === "reset-cube") {
    talentCubeCleanup?.();
    talentCubeCleanup = initTalentCube();
  }
  if (["self-review","add-goal","enroll","open-guide"].includes(action)) showToast(action === "enroll" ? "Enrollment request sent to your manager" : "Prototype action completed");
});

document.addEventListener("change", event => {
  if (event.target.id !== "thirdAxisSelect") return;
  state.thirdAxis = event.target.value;
  state.thirdLayer = 2;
  render();
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

document.addEventListener("keydown", event => {
  if ((event.key === "Enter" || event.key === " ") && event.target.matches('[role="button"][tabindex="0"]')) {
    event.preventDefault();
    event.target.click();
  }
});

roleSelect.addEventListener("change", event => {
  closeModal();
  state.role = event.target.value;
  state.view = "overview";
  const identities = {
    hr: { name: "Alex Morgan", title: "HR Business Partner", className: "avatar avatar-photo alex", initials: "" },
    manager: { name: "Jordan Lee", title: "People Manager", className: "avatar", initials: "JL" },
    employee: { name: "Priya Nair", title: "Employee", className: "avatar avatar-photo priya", initials: "" },
  };
  const identity = identities[state.role];
  const signedInAvatar = document.querySelector(".signed-in .avatar");
  signedInAvatar.className = identity.className;
  signedInAvatar.textContent = identity.initials;
  document.querySelector(".signed-in strong").textContent = identity.name;
  const signedIn = document.querySelector(".signed-in small");
  signedIn.textContent = identity.title;
  render();
  showToast(`Switched to ${event.target.options[event.target.selectedIndex].text}`);
});

document.querySelector("#mobileMenu").addEventListener("click", () => document.querySelector(".sidebar").classList.toggle("open"));

render();
