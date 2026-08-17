/**
 * Guardian Dashboard — Ultra Premium SPA
 * Full dashboard with 7 sections, charts, data visualization
 */

(function () {
  'use strict';

  /* ============================================================
     DUMMY DATA
     ============================================================ */
  var stored = JSON.parse(localStorage.getItem('stackly_user'));
  if (!stored || stored.role !== 'guardian') {
    window.location.href = '../auth/login.html';
    return;
  }
  const userData = stored;

  const donations = [
    { id: 1, date: '2026-08-10', amount: 250, project: 'Amazon Reforestation', status: 'completed', category: 'Forest' },
    { id: 2, date: '2026-07-28', amount: 150, project: 'Coral Triangle Restoration', status: 'completed', category: 'Ocean' },
    { id: 3, date: '2026-07-15', amount: 500, project: 'Savanna Wildlife Corridors', status: 'completed', category: 'Wildlife' },
    { id: 4, date: '2026-06-30', amount: 100, project: 'Urban Canopy Equity', status: 'completed', category: 'Forest' },
    { id: 5, date: '2026-06-12', amount: 300, project: 'Mangrove Blue Carbon', status: 'pending', category: 'Ocean' },
    { id: 6, date: '2026-05-20', amount: 75, project: 'Leuser Ecosystem', status: 'completed', category: 'Wildlife' },
    { id: 7, date: '2026-05-05', amount: 200, project: 'Amazon Reforestation', status: 'completed', category: 'Forest' },
    { id: 8, date: '2026-04-18', amount: 400, project: 'Carbon Offset Initiative', status: 'completed', category: 'Climate' },
    { id: 9, date: '2026-04-02', amount: 125, project: 'Sub-Antarctic Reforestation', status: 'completed', category: 'Forest' },
    { id: 10, date: '2026-03-15', amount: 175, project: 'Coral Triangle Restoration', status: 'completed', category: 'Ocean' },
  ];

  const campaigns = [
    { id: 1, title: 'Amazon Reforestation Corridor', desc: 'Restoring 12,000 hectares of fragmented rainforest in Brazil.', progress: 72, raised: 487000, goal: 750000, status: 'active', img: '../assets/images/project-1.webp' },
    { id: 2, title: 'Coral Triangle Restoration', desc: 'Protecting marine biodiversity across Southeast Asia.', progress: 58, raised: 290000, goal: 500000, status: 'active', img: '../assets/images/project-2.webp' },
    { id: 3, title: 'Savanna Wildlife Corridors', desc: 'Creating safe passage for elephants in Kenya.', progress: 85, raised: 425000, goal: 500000, status: 'active', img: '../assets/images/project-3.webp' },
    { id: 4, title: 'Leuser Ecosystem Guardians', desc: 'Protecting one of Earth\'s most biodiverse rainforests.', progress: 100, raised: 350000, goal: 350000, status: 'completed', img: '../assets/images/project-4.webp' },
    { id: 5, title: 'Urban Canopy Equity', desc: 'Bringing shade and green jobs to cities worldwide.', progress: 45, raised: 135000, goal: 300000, status: 'active', img: '../assets/images/project-5.webp' },
    { id: 6, title: 'Mangrove Blue Carbon', desc: 'Coastal protection through mangrove restoration.', progress: 62, raised: 186000, goal: 300000, status: 'active', img: '../assets/images/project-6.webp' },
  ];

  const messages = [
    { id: 1, name: 'Elena Morales', initials: 'EM', msg: 'Thank you for your generous donation to the Amazon project!', time: '2h ago', unread: true },
    { id: 2, name: 'James Chen', initials: 'JC', msg: 'Your impact report for Q2 2026 is ready.', time: '1d ago', unread: true },
    { id: 3, name: 'Aisha Patel', initials: 'AP', msg: 'New volunteer opportunity in your area.', time: '3d ago', unread: false },
    { id: 4, name: 'Support Team', initials: 'ST', msg: 'Your account settings have been updated.', time: '5d ago', unread: false },
  ];

  const activities = [
    { type: 'donation', text: 'Donated <strong>$250</strong> to Amazon Reforestation', time: '2 hours ago', icon: 'green' },
    { type: 'impact', text: 'Your donations planted <strong>45 trees</strong> this month', time: '1 day ago', icon: 'gold' },
    { type: 'campaign', text: 'New campaign <strong>Coral Triangle</strong> reached 58% funding', time: '3 days ago', icon: 'blue' },
    { type: 'donation', text: 'Donated <strong>$150</strong> to Coral Triangle Restoration', time: '1 week ago', icon: 'green' },
    { type: 'impact', text: 'Carbon capture: <strong>2.4 tons CO₂</strong> reduced', time: '2 weeks ago', icon: 'gold' },
  ];

  const impactData = {
    treesPlanted: 1247,
    co2Reduced: 8.4,
    speciesProtected: 34,
    waterSaved: 15600,
    volunteersEngaged: 12,
    communitiesServed: 8
  };

  const monthlyDonations = [180, 320, 250, 400, 300, 500, 275, 450, 350, 600, 420, 550];
  const categoryData = { Forest: 45, Ocean: 25, Wildlife: 20, Climate: 10 };

  /* ============================================================
     SPA ROUTING
     ============================================================ */
  const content = document.getElementById('content');
  const pageTitle = document.getElementById('page-title');
  const menuLinks = document.querySelectorAll('.dash__menu-link');
  const sidebar = document.getElementById('sidebar');
  const sidebarClose = document.getElementById('sidebar-close');
  const menuToggle = document.getElementById('menu-toggle');
  const sidebarOverlay = document.getElementById('sidebar-overlay');
  const logoutBtn = document.getElementById('logout-btn');

  const pageTitles = {
    overview: 'Dashboard',
    donations: 'My Donations',
    impact: 'Impact Tracking',
    campaigns: 'Campaigns',
    reports: 'Reports & Analytics',
    messages: 'Messages',
    settings: 'Settings'
  };

  function navigateTo(page) {
    menuLinks.forEach(link => {
      link.classList.toggle('dash__menu-link--active', link.dataset.page === page);
    });
    pageTitle.textContent = pageTitles[page] || 'Dashboard';
    renderPage(page);
    closeSidebar();
  }

  menuLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      navigateTo(link.dataset.page);
    });
  });

  /* Sidebar Toggle */
  function openSidebar() {
    sidebar.classList.add('dash__sidebar--open');
    sidebarOverlay.classList.add('dash__overlay--active');
    document.body.style.overflow = 'hidden';
  }

  function closeSidebar() {
    sidebar.classList.remove('dash__sidebar--open');
    sidebarOverlay.classList.remove('dash__overlay--active');
    document.body.style.overflow = '';
  }

  menuToggle.addEventListener('click', openSidebar);
  sidebarClose.addEventListener('click', closeSidebar);
  sidebarOverlay.addEventListener('click', closeSidebar);

  /* Logout */
  logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('stackly_user');
    window.location.href = '../auth/login.html';
  });

  /* ============================================================
     USER DATA
     ============================================================ */
  function initUserData() {
    const userName = document.getElementById('user-name');
    const userAvatar = document.getElementById('user-avatar');
    if (userName) userName.textContent = userData.name || 'Guardian';
    if (userAvatar) userAvatar.textContent = (userData.name || 'G').charAt(0).toUpperCase();
  }

  /* ============================================================
     CHART DRAWING (Custom Canvas)
     ============================================================ */
  function drawLineChart(canvas, data, color = '#c8a46f') {
    const ctx = canvas.getContext('2d');
    const w = canvas.width = canvas.offsetWidth * 2;
    const h = canvas.height = canvas.offsetHeight * 2;
    ctx.scale(2, 2);
    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;
    const padding = { top: 20, right: 20, bottom: 30, left: 40 };
    const chartW = width - padding.left - padding.right;
    const chartH = height - padding.top - padding.bottom;
    const max = Math.max(...data) * 1.1;
    const min = 0;

    ctx.clearRect(0, 0, width, height);

    /* Grid lines */
    ctx.strokeStyle = 'rgba(255,255,255,0.06)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = padding.top + (chartH / 4) * i;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(width - padding.right, y);
      ctx.stroke();
    }

    /* Area fill */
    const gradient = ctx.createLinearGradient(0, padding.top, 0, height - padding.bottom);
    gradient.addColorStop(0, color + '40');
    gradient.addColorStop(1, color + '05');

    ctx.beginPath();
    ctx.moveTo(padding.left, height - padding.bottom);
    data.forEach((val, i) => {
      const x = padding.left + (chartW / (data.length - 1)) * i;
      const y = padding.top + chartH - (val / max) * chartH;
      if (i === 0) ctx.lineTo(x, y);
      else {
        const prevX = padding.left + (chartW / (data.length - 1)) * (i - 1);
        const prevY = padding.top + chartH - (data[i - 1] / max) * chartH;
        const cpX = (prevX + x) / 2;
        ctx.bezierCurveTo(cpX, prevY, cpX, y, x, y);
      }
    });
    ctx.lineTo(width - padding.right, height - padding.bottom);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();

    /* Line */
    ctx.beginPath();
    data.forEach((val, i) => {
      const x = padding.left + (chartW / (data.length - 1)) * i;
      const y = padding.top + chartH - (val / max) * chartH;
      if (i === 0) ctx.moveTo(x, y);
      else {
        const prevX = padding.left + (chartW / (data.length - 1)) * (i - 1);
        const prevY = padding.top + chartH - (data[i - 1] / max) * chartH;
        const cpX = (prevX + x) / 2;
        ctx.bezierCurveTo(cpX, prevY, cpX, y, x, y);
      }
    });
    ctx.strokeStyle = color;
    ctx.lineWidth = 2.5;
    ctx.stroke();

    /* Dots */
    data.forEach((val, i) => {
      const x = padding.left + (chartW / (data.length - 1)) * i;
      const y = padding.top + chartH - (val / max) * chartH;
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
      ctx.beginPath();
      ctx.arc(x, y, 2, 0, Math.PI * 2);
      ctx.fillStyle = '#0a1628';
      ctx.fill();
    });

    /* Labels */
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.font = '10px Inter';
    ctx.textAlign = 'center';
    data.forEach((_, i) => {
      const x = padding.left + (chartW / (data.length - 1)) * i;
      ctx.fillText(months[i], x, height - 8);
    });
  }

  function drawBarChart(canvas, data, colors) {
    const ctx = canvas.getContext('2d');
    const w = canvas.width = canvas.offsetWidth * 2;
    const h = canvas.height = canvas.offsetHeight * 2;
    ctx.scale(2, 2);
    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;
    const padding = { top: 20, right: 20, bottom: 30, left: 40 };
    const chartW = width - padding.left - padding.right;
    const chartH = height - padding.top - padding.bottom;
    const max = Math.max(...Object.values(data)) * 1.1;
    const keys = Object.keys(data);
    const barWidth = (chartW / keys.length) * 0.6;
    const gap = (chartW / keys.length) * 0.4;

    ctx.clearRect(0, 0, width, height);

    /* Grid */
    ctx.strokeStyle = 'rgba(255,255,255,0.06)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = padding.top + (chartH / 4) * i;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(width - padding.right, y);
      ctx.stroke();
    }

    /* Bars */
    keys.forEach((key, i) => {
      const val = data[key];
      const barH = (val / max) * chartH;
      const x = padding.left + (chartW / keys.length) * i + gap / 2;
      const y = padding.top + chartH - barH;

      const gradient = ctx.createLinearGradient(x, y, x, padding.top + chartH);
      gradient.addColorStop(0, colors[i % colors.length]);
      gradient.addColorStop(1, colors[i % colors.length] + '40');

      ctx.beginPath();
      ctx.roundRect(x, y, barWidth, barH, [6, 6, 0, 0]);
      ctx.fillStyle = gradient;
      ctx.fill();

      /* Label */
      ctx.fillStyle = 'rgba(255,255,255,0.5)';
      ctx.font = '10px Inter';
      ctx.textAlign = 'center';
      ctx.fillText(key, x + barWidth / 2, height - 8);

      /* Value */
      ctx.fillStyle = 'rgba(255,255,255,0.7)';
      ctx.fillText(val + '%', x + barWidth / 2, y - 6);
    });
  }

  function drawPieChart(canvas, data, colors) {
    const ctx = canvas.getContext('2d');
    const w = canvas.width = canvas.offsetWidth * 2;
    const h = canvas.height = canvas.offsetHeight * 2;
    ctx.scale(2, 2);
    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 2 - 20;
    const total = Object.values(data).reduce((a, b) => a + b, 0);
    let startAngle = -Math.PI / 2;

    ctx.clearRect(0, 0, width, height);

    Object.entries(data).forEach(([key, val], i) => {
      const sliceAngle = (val / total) * Math.PI * 2;
      const endAngle = startAngle + sliceAngle;

      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = colors[i % colors.length];
      ctx.fill();

      /* Label */
      const midAngle = startAngle + sliceAngle / 2;
      const labelX = centerX + Math.cos(midAngle) * (radius * 0.65);
      const labelY = centerY + Math.sin(midAngle) * (radius * 0.65);
      ctx.fillStyle = 'white';
      ctx.font = 'bold 11px Inter';
      ctx.textAlign = 'center';
      ctx.fillText(key, labelX, labelY - 6);
      ctx.font = '10px Inter';
      ctx.fillText(Math.round(val / total * 100) + '%', labelX, labelY + 8);

      startAngle = endAngle;
    });

    /* Center hole */
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * 0.5, 0, Math.PI * 2);
    ctx.fillStyle = '#0f1f35';
    ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.7)';
    ctx.font = 'bold 14px Inter';
    ctx.textAlign = 'center';
    ctx.fillText('100%', centerX, centerY + 5);
  }

  function drawProgressCircle(svg, percent, color = '#c8a46f') {
    const circle = svg.querySelector('.dash__circle-fill');
    if (!circle) return;
    const circumference = 2 * Math.PI * 42;
    circle.style.strokeDasharray = circumference;
    circle.style.stroke = color;
    setTimeout(() => {
      circle.style.strokeDashoffset = circumference - (circumference * percent / 100);
    }, 100);
  }

  /* ============================================================
     PAGE RENDERERS
     ============================================================ */
  function renderPage(page) {
    content.innerHTML = '';
    content.className = 'dash__content';

    switch (page) {
      case 'overview': renderOverview(); break;
      case 'donations': renderDonations(); break;
      case 'impact': renderImpact(); break;
      case 'campaigns': renderCampaigns(); break;
      case 'reports': renderReports(); break;
      case 'messages': renderMessages(); break;
      case 'settings': renderSettings(); break;
    }
  }

  /* --- 1. OVERVIEW --- */
  function renderOverview() {
    const totalDonations = donations.reduce((sum, d) => sum + d.amount, 0);
    const projectsSupported = new Set(donations.map(d => d.project)).size;

    content.innerHTML = `
      <div class="dash__animate">
        <div class="dash__section-header">
          <div>
            <h2 class="dash__section-title">Welcome back, ${userData.name || 'Guardian'}</h2>
            <p class="dash__section-subtitle">Here's your environmental impact overview</p>
          </div>
          <button class="dash__btn dash__btn--primary" onclick="window.location.href='../index.html#donate'">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            New Donation
          </button>
        </div>

        <div class="dash__kpi-grid">
          <div class="dash__kpi">
            <div class="dash__kpi-icon dash__kpi-icon--gold">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            </div>
            <div class="dash__kpi-info">
              <div class="dash__kpi-label">Total Donations</div>
              <div class="dash__kpi-value">$${totalDonations.toLocaleString()}</div>
              <div class="dash__kpi-change dash__kpi-change--up">↑ 12% this month</div>
            </div>
          </div>
          <div class="dash__kpi">
            <div class="dash__kpi-icon dash__kpi-icon--green">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 22V8M12 8C12 8 8 4 4 8c4 0 8 4 8 4z"/></svg>
            </div>
            <div class="dash__kpi-info">
              <div class="dash__kpi-label">Trees Planted</div>
              <div class="dash__kpi-value">${impactData.treesPlanted.toLocaleString()}</div>
              <div class="dash__kpi-change dash__kpi-change--up">↑ 8% this month</div>
            </div>
          </div>
          <div class="dash__kpi">
            <div class="dash__kpi-icon dash__kpi-icon--blue">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
            </div>
            <div class="dash__kpi-info">
              <div class="dash__kpi-label">Projects Supported</div>
              <div class="dash__kpi-value">${projectsSupported}</div>
              <div class="dash__kpi-change dash__kpi-change--up">↑ 2 new</div>
            </div>
          </div>
          <div class="dash__kpi">
            <div class="dash__kpi-icon dash__kpi-icon--red">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><path d="M8 12l2-6M16 12l-2-6M8 12h8"/></svg>
            </div>
            <div class="dash__kpi-info">
              <div class="dash__kpi-label">CO₂ Reduced</div>
              <div class="dash__kpi-value">${impactData.co2Reduced}T</div>
              <div class="dash__kpi-change dash__kpi-change--up">↑ 15% this month</div>
            </div>
          </div>
        </div>

        <div class="dash__charts-grid">
          <div class="dash__chart">
            <div class="dash__chart-header">
              <h3 class="dash__chart-title">Donation Trend</h3>
              <div class="dash__chart-tabs">
                <button class="dash__chart-tab dash__chart-tab--active">12M</button>
                <button class="dash__chart-tab">6M</button>
                <button class="dash__chart-tab">30D</button>
              </div>
            </div>
            <div class="dash__chart-canvas">
              <canvas id="overview-line-chart"></canvas>
            </div>
          </div>
          <div class="dash__chart">
            <div class="dash__chart-header">
              <h3 class="dash__chart-title">By Category</h3>
            </div>
            <div class="dash__chart-canvas">
              <canvas id="overview-pie-chart"></canvas>
            </div>
          </div>
        </div>

        <div class="dash__card">
          <div class="dash__card-header">
            <h3 class="dash__card-title">Recent Activity</h3>
          </div>
          <div class="dash__activity">
            ${activities.map(a => `
              <div class="dash__activity-item">
                <div class="dash__activity-icon dash__activity-icon--${a.icon}">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    ${a.type === 'donation' ? '<path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>' :
                    a.type === 'impact' ? '<path d="M12 22V8M12 8C12 8 8 4 4 8c4 0 8 4 8 4z"/>' :
                    '<path d="M22 12h-4l-3 9L9 3l-3 9H2"/>'}
                  </svg>
                </div>
                <div class="dash__activity-text">${a.text}</div>
                <div class="dash__activity-time">${a.time}</div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;

    setTimeout(() => {
      const lineCanvas = document.getElementById('overview-line-chart');
      const pieCanvas = document.getElementById('overview-pie-chart');
      if (lineCanvas) drawLineChart(lineCanvas, monthlyDonations);
      if (pieCanvas) drawPieChart(pieCanvas, categoryData, ['#1b4d3e', '#c8a46f', '#2d6a56', '#3498db']);
    }, 100);
  }

  /* --- 2. DONATIONS --- */
  function renderDonations() {
    const totalDonations = donations.reduce((sum, d) => sum + d.amount, 0);
    const completedDonations = donations.filter(d => d.status === 'completed').reduce((sum, d) => sum + d.amount, 0);

    content.innerHTML = `
      <div class="dash__animate">
        <div class="dash__section-header">
          <div>
            <h2 class="dash__section-title">My Donations</h2>
            <p class="dash__section-subtitle">Track all your contributions and their impact</p>
          </div>
          <button class="dash__btn dash__btn--primary" onclick="window.location.href='../index.html#donate'">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            New Donation
          </button>
        </div>

        <div class="dash__kpi-grid" style="grid-template-columns: repeat(3, 1fr);">
          <div class="dash__kpi">
            <div class="dash__kpi-icon dash__kpi-icon--gold">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            </div>
            <div class="dash__kpi-info">
              <div class="dash__kpi-label">Total Donated</div>
              <div class="dash__kpi-value">$${totalDonations.toLocaleString()}</div>
            </div>
          </div>
          <div class="dash__kpi">
            <div class="dash__kpi-icon dash__kpi-icon--green">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            </div>
            <div class="dash__kpi-info">
              <div class="dash__kpi-label">Completed</div>
              <div class="dash__kpi-value">$${completedDonations.toLocaleString()}</div>
            </div>
          </div>
          <div class="dash__kpi">
            <div class="dash__kpi-icon dash__kpi-icon--blue">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            </div>
            <div class="dash__kpi-info">
              <div class="dash__kpi-label">Total Transactions</div>
              <div class="dash__kpi-value">${donations.length}</div>
            </div>
          </div>
        </div>

        <div class="dash__chart" style="margin-bottom: 1.5rem;">
          <div class="dash__chart-header">
            <h3 class="dash__chart-title">Monthly Donations</h3>
          </div>
          <div class="dash__chart-canvas">
            <canvas id="donations-bar-chart"></canvas>
          </div>
        </div>

        <div class="dash__card">
          <div class="dash__card-header">
            <h3 class="dash__card-title">Donation History</h3>
          </div>
          <div class="dash__filters">
            <button class="dash__filter dash__filter--active">All</button>
            <button class="dash__filter">Forest</button>
            <button class="filter">Ocean</button>
            <button class="dash__filter">Wildlife</button>
            <button class="dash__filter">Climate</button>
          </div>
          <div class="dash__table-wrap">
            <table class="dash__table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Project</th>
                  <th>Category</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                ${donations.map(d => `
                  <tr>
                    <td>${new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                    <td><strong>$${d.amount}</strong></td>
                    <td>${d.project}</td>
                    <td>${d.category}</td>
                    <td><span class="dash__status dash__status--${d.status}"><span class="dash__status-dot"></span>${d.status}</span></td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;

    setTimeout(() => {
      const barCanvas = document.getElementById('donations-bar-chart');
      if (barCanvas) drawBarChart(barCanvas, monthlyDonations, ['#1b4d3e', '#c8a46f', '#2d6a56', '#3498db']);
    }, 100);
  }

  /* --- 3. IMPACT --- */
  function renderImpact() {
    content.innerHTML = `
      <div class="dash__animate">
        <div class="dash__section-header">
          <div>
            <h2 class="dash__section-title">Impact Tracking</h2>
            <p class="dash__section-subtitle">See the real-world difference your donations make</p>
          </div>
        </div>

        <div class="dash__kpi-grid" style="grid-template-columns: repeat(3, 1fr);">
          <div class="dash__kpi">
            <div class="dash__kpi-icon dash__kpi-icon--green">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 22V8M12 8C12 8 8 4 4 8c4 0 8 4 8 4z"/></svg>
            </div>
            <div class="dash__kpi-info">
              <div class="dash__kpi-label">Trees Planted</div>
              <div class="dash__kpi-value">${impactData.treesPlanted.toLocaleString()}</div>
            </div>
          </div>
          <div class="dash__kpi">
            <div class="dash__kpi-icon dash__kpi-icon--blue">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><path d="M8 12l2-6M16 12l-2-6M8 12h8"/></svg>
            </div>
            <div class="dash__kpi-info">
              <div class="dash__kpi-label">CO₂ Reduced</div>
              <div class="dash__kpi-value">${impactData.co2Reduced}T</div>
            </div>
          </div>
          <div class="dash__kpi">
            <div class="dash__kpi-icon dash__kpi-icon--gold">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
            </div>
            <div class="dash__kpi-info">
              <div class="dash__kpi-label">Species Protected</div>
              <div class="dash__kpi-value">${impactData.speciesProtected}</div>
            </div>
          </div>
        </div>

        <div class="dash__card" style="margin-bottom: 1.5rem;">
          <div class="dash__card-header">
            <h3 class="dash__card-title">Impact Progress</h3>
          </div>
          <div class="dash__circle-grid">
            <div class="dash__circle">
              <svg class="dash__circle-svg" viewBox="0 0 100 100">
                <circle class="dash__circle-bg" cx="50" cy="50" r="42"/>
                <circle class="dash__circle-fill" cx="50" cy="50" r="42" data-percent="85"/>
              </svg>
              <div class="dash__circle-text">85%</div>
              <div class="dash__circle-label">Forest Restoration</div>
            </div>
            <div class="dash__circle">
              <svg class="dash__circle-svg" viewBox="0 0 100 100">
                <circle class="dash__circle-bg" cx="50" cy="50" r="42"/>
                <circle class="dash__circle-fill" cx="50" cy="50" r="42" data-percent="72"/>
              </svg>
              <div class="dash__circle-text">72%</div>
              <div class="dash__circle-label">Ocean Conservation</div>
            </div>
            <div class="dash__circle">
              <svg class="dash__circle-svg" viewBox="0 0 100 100">
                <circle class="dash__circle-bg" cx="50" cy="50" r="42"/>
                <circle class="dash__circle-fill" cx="50" cy="50" r="42" data-percent="68"/>
              </svg>
              <div class="dash__circle-text">68%</div>
              <div class="dash__circle-label">Wildlife Protection</div>
            </div>
            <div class="dash__circle">
              <svg class="dash__circle-svg" viewBox="0 0 100 100">
                <circle class="dash__circle-bg" cx="50" cy="50" r="42"/>
                <circle class="dash__circle-fill" cx="50" cy="50" r="42" data-percent="92"/>
              </svg>
              <div class="dash__circle-text">92%</div>
              <div class="dash__circle-label">Climate Action</div>
            </div>
          </div>
        </div>

        <div class="dash__card">
          <div class="dash__card-header">
            <h3 class="dash__card-title">Impact Timeline</h3>
          </div>
          <div class="dash__timeline">
            <div class="dash__timeline-item">
              <div class="dash__timeline-dot"></div>
              <div class="dash__timeline-content">
                <div class="dash__timeline-date">August 2026</div>
                <div class="dash__timeline-text">Your donations helped plant <strong>245 trees</strong> in the Amazon corridor</div>
              </div>
            </div>
            <div class="dash__timeline-item">
              <div class="dash__timeline-dot"></div>
              <div class="dash__timeline-content">
                <div class="dash__timeline-date">July 2026</div>
                <div class="dash__timeline-text"><strong>1.2 tons CO₂</strong> captured through your supported projects</div>
              </div>
            </div>
            <div class="dash__timeline-item">
              <div class="dash__timeline-dot"></div>
              <div class="dash__timeline-content">
                <div class="dash__timeline-date">June 2026</div>
                <div class="dash__timeline-text">Wildlife corridor in Kenya reached <strong>85% completion</strong></div>
              </div>
            </div>
            <div class="dash__timeline-item">
              <div class="dash__timeline-dot"></div>
              <div class="dash__timeline-content">
                <div class="dash__timeline-date">May 2026</div>
                <div class="dash__timeline-text">Coral restoration project protected <strong>50sq meters</strong> of marine habitat</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    setTimeout(() => {
      document.querySelectorAll('.dash__circle-fill').forEach(circle => {
        const percent = parseInt(circle.dataset.percent);
        drawProgressCircle(circle.closest('svg'), percent);
      });
    }, 200);
  }

  /* --- 4. CAMPAIGNS --- */
  function renderCampaigns() {
    content.innerHTML = `
      <div class="dash__animate">
        <div class="dash__section-header">
          <div>
            <h2 class="dash__section-title">Campaigns Supported</h2>
            <p class="dash__section-subtitle">Track the campaigns you've contributed to</p>
          </div>
        </div>

        <div class="dash__filters" style="margin-bottom: 1.5rem;">
          <button class="dash__filter dash__filter--active">All</button>
          <button class="dash__filter">Active</button>
          <button class="dash__filter">Completed</button>
        </div>

        <div class="dash__campaign-grid">
          ${campaigns.map(c => `
            <div class="dash__campaign-card">
              <div class="dash__campaign-img" style="background-image: url('${c.img}')">
                <span class="dash__campaign-badge dash__campaign-badge--${c.status}">${c.status}</span>
              </div>
              <div class="dash__campaign-body">
                <h3 class="dash__campaign-title">${c.title}</h3>
                <p class="dash__campaign-desc">${c.desc}</p>
                <div class="dash__campaign-progress">
                  <div class="dash__progress">
                    <div class="dash__progress-header">
                      <span class="dash__progress-label">Progress</span>
                      <span class="dash__progress-value">${c.progress}%</span>
                    </div>
                    <div class="dash__progress-track">
                      <div class="dash__progress-fill" style="width: ${c.progress}%"></div>
                    </div>
                  </div>
                </div>
                <div class="dash__campaign-stats">
                  <span><strong>$${(c.raised / 1000).toFixed(0)}K</strong> raised</span>
                  <span>of $${(c.goal / 1000).toFixed(0)}K goal</span>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  /* --- 5. REPORTS --- */
  function renderReports() {
    content.innerHTML = `
      <div class="dash__animate">
        <div class="dash__section-header">
          <div>
            <h2 class="dash__section-title">Reports & Analytics</h2>
            <p class="dash__section-subtitle">Detailed insights into your environmental impact</p>
          </div>
          <button class="dash__btn dash__btn--outline">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Export Report
          </button>
        </div>

        <div class="dash__kpi-grid" style="grid-template-columns: repeat(4, 1fr);">
          <div class="dash__kpi">
            <div class="dash__kpi-icon dash__kpi-icon--gold">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            </div>
            <div class="dash__kpi-info">
              <div class="dash__kpi-label">Avg Monthly</div>
              <div class="dash__kpi-value">$345</div>
            </div>
          </div>
          <div class="dash__kpi">
            <div class="dash__kpi-icon dash__kpi-icon--green">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 22V8M12 8C12 8 8 4 4 8c4 0 8 4 8 4z"/></svg>
            </div>
            <div class="dash__kpi-info">
              <div class="dash__kpi-label">Trees per $</div>
              <div class="dash__kpi-value">4.2</div>
            </div>
          </div>
          <div class="dash__kpi">
            <div class="dash__kpi-icon dash__kpi-icon--blue">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><path d="M8 12l2-6M16 12l-2-6M8 12h8"/></svg>
            </div>
            <div class="dash__kpi-info">
              <div class="dash__kpi-label">CO₂ per $</div>
              <div class="dash__kpi-value">28g</div>
            </div>
          </div>
          <div class="dash__kpi">
            <div class="dash__kpi-icon dash__kpi-icon--red">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            </div>
            <div class="dash__kpi-info">
              <div class="dash__kpi-label">Impact Score</div>
              <div class="dash__kpi-value">94</div>
            </div>
          </div>
        </div>

        <div class="dash__charts-grid">
          <div class="dash__chart">
            <div class="dash__chart-header">
              <h3 class="dash__chart-title">Donation vs Impact</h3>
            </div>
            <div class="dash__chart-canvas">
              <canvas id="reports-line-chart"></canvas>
            </div>
          </div>
          <div class="dash__chart">
            <div class="dash__chart-header">
              <h3 class="dash__chart-title">Category Breakdown</h3>
            </div>
            <div class="dash__chart-canvas">
              <canvas id="reports-pie-chart"></canvas>
            </div>
          </div>
        </div>

        <div class="dash__card">
          <div class="dash__card-header">
            <h3 class="dash__card-title">Data Insights</h3>
          </div>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
            <div class="dash__activity-item">
              <div class="dash__activity-icon dash__activity-icon--green">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/></svg>
              </div>
              <div class="dash__activity-text"><strong>Most active month:</strong> June 2026</div>
            </div>
            <div class="dash__activity-item">
              <div class="dash__activity-icon dash__activity-icon--gold">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2L2 7l10 5 10-5-10-5z"/></svg>
              </div>
              <div class="dash__activity-text"><strong>Top category:</strong> Forest Restoration</div>
            </div>
            <div class="dash__activity-item">
              <div class="dash__activity-icon dash__activity-icon--blue">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 22V8M12 8C12 8 8 4 4 8c4 0 8 4 8 4z"/></svg>
              </div>
              <div class="dash__activity-text"><strong>Trees per donation:</strong> 4.2 avg</div>
            </div>
          </div>
        </div>
      </div>
    `;

    setTimeout(() => {
      const lineCanvas = document.getElementById('reports-line-chart');
      const pieCanvas = document.getElementById('reports-pie-chart');
      if (lineCanvas) drawLineChart(lineCanvas, monthlyDonations, '#2ecc71');
      if (pieCanvas) drawPieChart(pieCanvas, categoryData, ['#1b4d3e', '#c8a46f', '#2d6a56', '#3498db']);
    }, 100);
  }

  /* --- 6. MESSAGES --- */
  function renderMessages() {
    content.innerHTML = `
      <div class="dash__animate">
        <div class="dash__section-header">
          <div>
            <h2 class="dash__section-title">Messages</h2>
            <p class="dash__section-subtitle">Communicate with our team and get support</p>
          </div>
        </div>

        <div class="dash__messages-layout">
          <div class="dash__message-list">
            ${messages.map((m, i) => `
              <div class="dash__message-item ${i === 0 ? 'dash__message-item--active' : ''}" data-id="${m.id}">
                <div class="dash__message-avatar">${m.initials}</div>
                <div class="dash__message-preview">
                  <div class="dash__message-name">${m.name}</div>
                  <div class="dash__message-snippet">${m.msg}</div>
                </div>
                <div class="dash__message-time">${m.time}</div>
              </div>
            `).join('')}
          </div>
          <div class="dash__chat">
            <div class="dash__chat-header">
              <div class="dash__message-avatar">EM</div>
              <div>
                <div class="dash__message-name">Elena Morales</div>
                <div style="font-size: 0.75rem; color: var(--dash-text-muted);">Online</div>
              </div>
            </div>
            <div class="dash__chat-messages" id="chat-messages">
              <div class="dash__chat-msg dash__chat-msg--received">
                <div>Hi! Thank you for your generous donation to the Amazon project.</div>
                <div class="dash__chat-msg-time">2 hours ago</div>
              </div>
              <div class="dash__chat-msg dash__chat-msg--sent">
                <div>Thank you! I'd love to see some updates on the progress.</div>
                <div class="dash__chat-msg-time">1 hour ago</div>
              </div>
              <div class="dash__chat-msg dash__chat-msg--received">
                <div>Of course! We've planted 2,400 trees in your supported area this month. I'll send you the GPS coordinates soon.</div>
                <div class="dash__chat-msg-time">45 min ago</div>
              </div>
            </div>
            <div class="dash__chat-input">
              <input type="text" placeholder="Type a message..." id="chat-input" />
              <button class="dash__chat-send" id="chat-send">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    /* Chat send */
    const chatInput = document.getElementById('chat-input');
    const chatSend = document.getElementById('chat-send');
    const chatMessages = document.getElementById('chat-messages');

    function sendMessage() {
      const text = chatInput.value.trim();
      if (!text) return;
      chatMessages.innerHTML += `
        <div class="dash__chat-msg dash__chat-msg--sent">
          <div>${text}</div>
          <div class="dash__chat-msg-time">Just now</div>
        </div>
      `;
      chatInput.value = '';
      chatMessages.scrollTop = chatMessages.scrollHeight;

      /* Simulate reply */
      setTimeout(() => {
        chatMessages.innerHTML += `
          <div class="dash__chat-msg dash__chat-msg--received">
            <div>Thanks for your message! Our team will get back to you shortly.</div>
            <div class="dash__chat-msg-time">Just now</div>
          </div>
        `;
        chatMessages.scrollTop = chatMessages.scrollHeight;
      }, 1500);
    }

    if (chatSend) chatSend.addEventListener('click', sendMessage);
    if (chatInput) chatInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') sendMessage();
    });
  }

  /* --- 7. SETTINGS --- */
  function renderSettings() {
    content.innerHTML = `
      <div class="dash__animate">
        <div class="dash__section-header">
          <div>
            <h2 class="dash__section-title">Settings</h2>
            <p class="dash__section-subtitle">Manage your account preferences</p>
          </div>
        </div>

        <div class="dash__settings-grid">
          <div class="dash__card">
            <div class="dash__card-header">
              <h3 class="dash__card-title">Profile Information</h3>
            </div>
            <div class="dash__form-group">
              <label class="dash__form-label">Full Name</label>
              <input type="text" class="dash__form-input" value="${userData.name || ''}" placeholder="Enter your name" />
            </div>
            <div class="dash__form-group">
              <label class="dash__form-label">Email Address</label>
              <input type="email" class="dash__form-input" value="${userData.email || ''}" placeholder="Enter your email" />
            </div>
            <div class="dash__form-group">
              <label class="dash__form-label">Phone Number</label>
              <input type="tel" class="dash__form-input" value="+1 (555) 123-4567" placeholder="Enter your phone" />
            </div>
            <button class="dash__btn dash__btn--primary">Save Changes</button>
          </div>

          <div class="dash__card">
            <div class="dash__card-header">
              <h3 class="dash__card-title">Security</h3>
            </div>
            <div class="dash__form-group">
              <label class="dash__form-label">Current Password</label>
              <input type="password" class="dash__form-input" placeholder="Enter current password" />
            </div>
            <div class="dash__form-group">
              <label class="dash__form-label">New Password</label>
              <input type="password" class="dash__form-input" placeholder="Enter new password" />
            </div>
            <div class="dash__form-group">
              <label class="dash__form-label">Confirm Password</label>
              <input type="password" class="dash__form-input" placeholder="Confirm new password" />
            </div>
            <button class="dash__btn dash__btn--primary">Update Password</button>
          </div>
        </div>

        <div class="dash__card" style="margin-top: 1.5rem;">
          <div class="dash__card-header">
            <h3 class="dash__card-title">Preferences</h3>
          </div>
          <div class="dash__toggle">
            <div class="dash__toggle-info">
              <div class="dash__toggle-title">Email Notifications</div>
              <div class="dash__toggle-desc">Receive email updates about your donations and impact</div>
            </div>
            <div class="dash__toggle-switch dash__toggle-switch--active" data-toggle="email"></div>
          </div>
          <div class="dash__toggle">
            <div class="dash__toggle-info">
              <div class="dash__toggle-title">Monthly Reports</div>
              <div class="dash__toggle-desc">Get detailed monthly impact reports via email</div>
            </div>
            <div class="dash__toggle-switch dash__toggle-switch--active" data-toggle="reports"></div>
          </div>
          <div class="dash__toggle">
            <div class="dash__toggle-info">
              <div class="dash__toggle-title">Campaign Updates</div>
              <div class="dash__toggle-desc">Notifications when campaigns you support reach milestones</div>
            </div>
            <div class="dash__toggle-switch" data-toggle="campaigns"></div>
          </div>
          <div class="dash__toggle">
            <div class="dash__toggle-info">
              <div class="dash__toggle-title">Two-Factor Authentication</div>
              <div class="dash__toggle-desc">Add an extra layer of security to your account</div>
            </div>
            <div class="dash__toggle-switch" data-toggle="2fa"></div>
          </div>
        </div>
      </div>
    `;

    /* Toggle switches */
    document.querySelectorAll('.dash__toggle-switch').forEach(toggle => {
      toggle.addEventListener('click', () => {
        toggle.classList.toggle('dash__toggle-switch--active');
      });
    });
  }

  /* ============================================================
     INIT
     ============================================================ */
  function init() {
    initUserData();
    navigateTo('overview');
  }

  init();
})();
