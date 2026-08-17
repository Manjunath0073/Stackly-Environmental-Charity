/**
 * Champion Dashboard — Ultra Premium SPA
 * Volunteer-focused dashboard with activities, events, leaderboard
 */

(function () {
  'use strict';

  /* ============================================================
     DUMMY DATA
     ============================================================ */
  const userData = JSON.parse(localStorage.getItem('stackly_user')) || {
    name: 'Champion',
    email: 'champion@stacklyearth.org',
    role: 'champion'
  };

  const activities = [
    { id: 1, title: 'Tree Planting Drive', date: '2026-08-10', duration: 6, location: 'Costa Rica', type: 'planting', status: 'completed', treesPlanted: 120 },
    { id: 2, title: 'Beach Cleanup', date: '2026-08-05', duration: 4, location: 'Philippines', type: 'cleanup', status: 'completed', wasteCollected: 85 },
    { id: 3, title: 'Wildlife Monitoring', date: '2026-07-28', duration: 8, location: 'Kenya', type: 'monitoring', status: 'completed', speciesTracked: 12 },
    { id: 4, title: 'Community Training', date: '2026-07-20', duration: 5, location: 'Brazil', type: 'training', status: 'completed', peopleTrained: 45 },
    { id: 5, title: 'Mangrove Restoration', date: '2026-07-12', duration: 7, location: 'Indonesia', type: 'planting', status: 'completed', treesPlanted: 200 },
    { id: 6, title: 'Coral Reef Survey', date: '2026-07-05', duration: 6, location: 'Maldives', type: 'monitoring', status: 'completed', speciesTracked: 28 },
    { id: 7, title: 'Urban Garden Setup', date: '2026-06-28', duration: 4, location: 'New York', type: 'training', status: 'completed', peopleTrained: 30 },
    { id: 8, title: 'River Cleanup', date: '2026-06-15', duration: 5, location: 'India', type: 'cleanup', status: 'completed', wasteCollected: 120 },
  ];

  const events = [
    { id: 1, title: 'Amazon Reforestation Weekend', desc: 'Join us for a weekend of tree planting in the Amazon basin.', date: '2026-09-15', location: 'Brazil', status: 'upcoming', spots: 50, joined: 38, img: '../assets/images/project-1.webp' },
    { id: 2, title: 'Coastal Cleanup Marathon', desc: 'Run along the coast and collect plastic waste.', date: '2026-09-22', location: 'Philippines', status: 'upcoming', spots: 100, joined: 72, img: '../assets/images/project-2.webp' },
    { id: 3, title: 'Wildlife Photography Walk', desc: 'Document endangered species in their natural habitat.', date: '2026-10-05', location: 'Kenya', status: 'upcoming', spots: 30, joined: 25, img: '../assets/images/project-3.webp' },
    { id: 4, title: 'Coral Restoration Workshop', desc: 'Learn to plant coral fragments and restore reefs.', date: '2026-08-20', location: 'Maldives', status: 'completed', spots: 25, joined: 25, img: '../assets/images/project-4.webp' },
    { id: 5, title: 'Urban Farming Bootcamp', desc: 'Build raised beds and grow food in the city.', date: '2026-08-10', location: 'New York', status: 'completed', spots: 40, joined: 35, img: '../assets/images/project-5.webp' },
    { id: 6, title: 'Mangrove Planting Day', desc: 'Plant mangrove seedlings to protect coastlines.', date: '2026-07-25', location: 'Indonesia', status: 'completed', spots: 60, joined: 58, img: '../assets/images/project-6.webp' },
  ];

  const leaderboard = [
    { rank: 1, name: 'Maria Santos', hours: 342, points: 4850, badge: 'gold', avatar: 'MS' },
    { rank: 2, name: 'James Chen', hours: 298, points: 4200, badge: 'gold', avatar: 'JC' },
    { rank: 3, name: 'Aisha Patel', hours: 276, points: 3900, badge: 'silver', avatar: 'AP' },
    { rank: 4, name: 'David Kim', hours: 245, points: 3500, badge: 'silver', avatar: 'DK' },
    { rank: 5, name: 'Sofia Nguyen', hours: 220, points: 3100, badge: 'bronze', avatar: 'SN' },
    { rank: 6, name: 'Lars Kohler', hours: 198, points: 2800, badge: 'bronze', avatar: 'LK' },
    { rank: 7, name: 'Elena Morales', hours: 185, points: 2600, badge: 'bronze', avatar: 'EM' },
    { rank: 8, name: 'You', hours: 156, points: 2200, badge: 'none', avatar: 'Y', isCurrentUser: true },
  ];

  const communityMessages = [
    { id: 1, name: 'Maria Santos', initials: 'MS', msg: 'Great job on the beach cleanup last weekend!', time: '1h ago', unread: true },
    { id: 2, name: 'Team Kenya', initials: 'TK', msg: 'Wildlife monitoring report is ready for review.', time: '3h ago', unread: true },
    { id: 3, name: 'David Kim', initials: 'DK', msg: 'Who\'s joining the Amazon event next month?', time: '1d ago', unread: false },
    { id: 4, name: 'Support Team', initials: 'ST', msg: 'Your volunteer certificate has been issued.', time: '2d ago', unread: false },
  ];

  const recentActivity = [
    { type: 'activity', text: 'Completed <strong>Beach Cleanup</strong> in Philippines', time: '3 days ago', icon: 'green' },
    { type: 'event', text: 'Registered for <strong>Amazon Reforestation</strong>', time: '1 week ago', icon: 'blue' },
    { type: 'impact', text: 'Planted <strong>120 trees</strong> in Costa Rica', time: '2 weeks ago', icon: 'gold' },
    { type: 'badge', text: 'Earned <strong>Eco Warrior</strong> badge', time: '3 weeks ago', icon: 'gold' },
    { type: 'community', text: 'Joined <strong>Team Kenya</strong> group', time: '1 month ago', icon: 'blue' },
  ];

  const monthlyHours = [18, 24, 32, 28, 35, 42, 38, 45, 40, 50, 48, 55];
  const contributionData = { Planting: 35, Cleanup: 25, Monitoring: 20, Training: 20 };

  const impactData = {
    treesPlanted: 520,
    wasteCollected: 340,
    speciesTracked: 42,
    peopleTrained: 120,
    hoursContributed: 156,
    eventsJoined: 12
  };

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
    activities: 'My Activities',
    events: 'Events & Campaigns',
    impact: 'Impact Contribution',
    leaderboard: 'Leaderboard',
    community: 'Community',
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
    if (userName) userName.textContent = userData.name || 'Champion';
    if (userAvatar) userAvatar.textContent = (userData.name || 'C').charAt(0).toUpperCase();
  }

  /* ============================================================
     CHART DRAWING
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

    ctx.clearRect(0, 0, width, height);

    ctx.strokeStyle = 'rgba(255,255,255,0.06)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = padding.top + (chartH / 4) * i;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(width - padding.right, y);
      ctx.stroke();
    }

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
    const max = Math.max(...data) * 1.1;
    const barWidth = (chartW / data.length) * 0.6;
    const gap = (chartW / data.length) * 0.4;

    ctx.clearRect(0, 0, width, height);

    ctx.strokeStyle = 'rgba(255,255,255,0.06)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = padding.top + (chartH / 4) * i;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(width - padding.right, y);
      ctx.stroke();
    }

    data.forEach((val, i) => {
      const barH = (val / max) * chartH;
      const x = padding.left + (chartW / data.length) * i + gap / 2;
      const y = padding.top + chartH - barH;

      const gradient = ctx.createLinearGradient(x, y, x, padding.top + chartH);
      gradient.addColorStop(0, colors[i % colors.length]);
      gradient.addColorStop(1, colors[i % colors.length] + '40');

      ctx.beginPath();
      ctx.roundRect(x, y, barWidth, barH, [6, 6, 0, 0]);
      ctx.fillStyle = gradient;
      ctx.fill();

      ctx.fillStyle = 'rgba(255,255,255,0.5)';
      ctx.font = '10px Inter';
      ctx.textAlign = 'center';
      ctx.fillText(val + 'h', x + barWidth / 2, y - 6);
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
      case 'activities': renderActivities(); break;
      case 'events': renderEvents(); break;
      case 'impact': renderImpact(); break;
      case 'leaderboard': renderLeaderboard(); break;
      case 'community': renderCommunity(); break;
      case 'settings': renderSettings(); break;
    }
  }

  /* --- 1. OVERVIEW --- */
  function renderOverview() {
    content.innerHTML = `
      <div class="dash__animate">
        <div class="dash__section-header">
          <div>
            <h2 class="dash__section-title">Welcome back, ${userData.name || 'Champion'}</h2>
            <p class="dash__section-subtitle">Your volunteer journey continues — here's your impact</p>
          </div>
          <button class="dash__btn dash__btn--primary" onclick="window.location.href='../get-involved.html'">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Join Event
          </button>
        </div>

        <div class="dash__kpi-grid">
          <div class="dash__kpi">
            <div class="dash__kpi-icon dash__kpi-icon--green">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            </div>
            <div class="dash__kpi-info">
              <div class="dash__kpi-label">Hours Contributed</div>
              <div class="dash__kpi-value">${impactData.hoursContributed}</div>
              <div class="dash__kpi-change dash__kpi-change--up">↑ 18% this month</div>
            </div>
          </div>
          <div class="dash__kpi">
            <div class="dash__kpi-icon dash__kpi-icon--gold">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/></svg>
            </div>
            <div class="dash__kpi-info">
              <div class="dash__kpi-label">Events Joined</div>
              <div class="dash__kpi-value">${impactData.eventsJoined}</div>
              <div class="dash__kpi-change dash__kpi-change--up">↑ 3 new</div>
            </div>
          </div>
          <div class="dash__kpi">
            <div class="dash__kpi-icon dash__kpi-icon--blue">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
            </div>
            <div class="dash__kpi-info">
              <div class="dash__kpi-label">Impact Score</div>
              <div class="dash__kpi-value">2,200</div>
              <div class="dash__kpi-change dash__kpi-change--up">↑ 15% this month</div>
            </div>
          </div>
          <div class="dash__kpi">
            <div class="dash__kpi-icon dash__kpi-icon--red">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 22V8M12 8C12 8 8 4 4 8c4 0 8 4 8 4z"/></svg>
            </div>
            <div class="dash__kpi-info">
              <div class="dash__kpi-label">Trees Planted</div>
              <div class="dash__kpi-value">${impactData.treesPlanted}</div>
              <div class="dash__kpi-change dash__kpi-change--up">↑ 120 this month</div>
            </div>
          </div>
        </div>

        <div class="dash__charts-grid">
          <div class="dash__chart">
            <div class="dash__chart-header">
              <h3 class="dash__chart-title">Activity Trend</h3>
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
              <h3 class="dash__chart-title">Contribution Split</h3>
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
            ${recentActivity.map(a => `
              <div class="dash__activity-item">
                <div class="dash__activity-icon dash__activity-icon--${a.icon}">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    ${a.type === 'activity' ? '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>' :
                    a.type === 'event' ? '<rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>' :
                    a.type === 'impact' ? '<path d="M12 22V8M12 8C12 8 8 4 4 8c4 0 8 4 8 4z"/>' :
                    '<path d="M12 2L2 7l10 5 10-5-10-5z"/>'}
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
      if (lineCanvas) drawLineChart(lineCanvas, monthlyHours, '#2ecc71');
      if (pieCanvas) drawPieChart(pieCanvas, contributionData, ['#1b4d3e', '#c8a46f', '#2d6a56', '#3498db']);
    }, 100);
  }

  /* --- 2. ACTIVITIES --- */
  function renderActivities() {
    content.innerHTML = `
      <div class="dash__animate">
        <div class="dash__section-header">
          <div>
            <h2 class="dash__section-title">My Activities</h2>
            <p class="dash__section-subtitle">Track all your volunteer contributions</p>
          </div>
        </div>

        <div class="dash__kpi-grid" style="grid-template-columns: repeat(3, 1fr);">
          <div class="dash__kpi">
            <div class="dash__kpi-icon dash__kpi-icon--green">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            </div>
            <div class="dash__kpi-info">
              <div class="dash__kpi-label">Total Hours</div>
              <div class="dash__kpi-value">${activities.reduce((s, a) => s + a.duration, 0)}</div>
            </div>
          </div>
          <div class="dash__kpi">
            <div class="dash__kpi-icon dash__kpi-icon--gold">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 22V8M12 8C12 8 8 4 4 8c4 0 8 4 8 4z"/></svg>
            </div>
            <div class="dash__kpi-info">
              <div class="dash__kpi-label">Trees Planted</div>
              <div class="dash__kpi-value">${activities.filter(a => a.treesPlanted).reduce((s, a) => s + a.treesPlanted, 0)}</div>
            </div>
          </div>
          <div class="dash__kpi">
            <div class="dash__kpi-icon dash__kpi-icon--blue">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
            </div>
            <div class="dash__kpi-info">
              <div class="dash__kpi-label">People Trained</div>
              <div class="dash__kpi-value">${activities.filter(a => a.peopleTrained).reduce((s, a) => s + a.peopleTrained, 0)}</div>
            </div>
          </div>
        </div>

        <div class="dash__chart" style="margin-bottom: 1.5rem;">
          <div class="dash__chart-header">
            <h3 class="dash__chart-title">Hours Contributed Monthly</h3>
          </div>
          <div class="dash__chart-canvas">
            <canvas id="activities-bar-chart"></canvas>
          </div>
        </div>

        <div class="dash__card">
          <div class="dash__card-header">
            <h3 class="dash__card-title">Activity History</h3>
          </div>
          <div class="dash__filters">
            <button class="dash__filter dash__filter--active">All</button>
            <button class="dash__filter">Planting</button>
            <button class="dash__filter">Cleanup</button>
            <button class="dash__filter">Monitoring</button>
            <button class="dash__filter">Training</button>
          </div>
          <div class="dash__table-wrap">
            <table class="dash__table">
              <thead>
                <tr>
                  <th>Activity</th>
                  <th>Date</th>
                  <th>Duration</th>
                  <th>Location</th>
                  <th>Type</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                ${activities.map(a => `
                  <tr>
                    <td><strong>${a.title}</strong></td>
                    <td>${new Date(a.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                    <td>${a.duration}h</td>
                    <td>${a.location}</td>
                    <td style="text-transform: capitalize;">${a.type}</td>
                    <td><span class="dash__status dash__status--${a.status}"><span class="dash__status-dot"></span>${a.status}</span></td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;

    setTimeout(() => {
      const barCanvas = document.getElementById('activities-bar-chart');
      if (barCanvas) drawBarChart(barCanvas, monthlyHours, ['#2ecc71', '#c8a46f', '#1b4d3e', '#3498db']);
    }, 100);
  }

  /* --- 3. EVENTS --- */
  function renderEvents() {
    content.innerHTML = `
      <div class="dash__animate">
        <div class="dash__section-header">
          <div>
            <h2 class="dash__section-title">Events & Campaigns</h2>
            <p class="dash__section-subtitle">Discover and join upcoming volunteer events</p>
          </div>
          <button class="dash__btn dash__btn--primary" onclick="window.location.href='../get-involved.html'">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
            Browse All Events
          </button>
        </div>

        <div class="dash__filters" style="margin-bottom: 1.5rem;">
          <button class="dash__filter dash__filter--active">All</button>
          <button class="dash__filter">Upcoming</button>
          <button class="dash__filter">Completed</button>
        </div>

        <div class="dash__campaign-grid">
          ${events.map(e => `
            <div class="dash__campaign-card">
              <div class="dash__campaign-img" style="background-image: url('${e.img}')">
                <span class="dash__campaign-badge dash__campaign-badge--${e.status === 'upcoming' ? 'active' : 'completed'}">${e.status}</span>
              </div>
              <div class="dash__campaign-body">
                <h3 class="dash__campaign-title">${e.title}</h3>
                <p class="dash__campaign-desc">${e.desc}</p>
                <div style="display: flex; gap: 1rem; font-size: 0.82rem; color: var(--dash-text-muted); margin-bottom: 1rem;">
                  <span>📍 ${e.location}</span>
                  <span>📅 ${new Date(e.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                </div>
                <div class="dash__campaign-progress">
                  <div class="dash__progress">
                    <div class="dash__progress-header">
                      <span class="dash__progress-label">${e.joined}/${e.spots} spots filled</span>
                      <span class="dash__progress-value">${Math.round(e.joined/e.spots*100)}%</span>
                    </div>
                    <div class="dash__progress-track">
                      <div class="dash__progress-fill" style="width: ${Math.round(e.joined/e.spots*100)}%"></div>
                    </div>
                  </div>
                </div>
                ${e.status === 'upcoming' ? `<button class="dash__btn dash__btn--primary" style="width: 100%; justify-content: center;">Join Event</button>` : `<button class="dash__btn dash__btn--outline" style="width: 100%; justify-content: center;">View Details</button>`}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  /* --- 4. IMPACT --- */
  function renderImpact() {
    content.innerHTML = `
      <div class="dash__animate">
        <div class="dash__section-header">
          <div>
            <h2 class="dash__section-title">Impact Contribution</h2>
            <p class="dash__section-subtitle">See the real difference you're making</p>
          </div>
        </div>

        <div class="dash__kpi-grid" style="grid-template-columns: repeat(3, 1fr);">
          <div class="dash__kpi">
            <div class="dash__kpi-icon dash__kpi-icon--green">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 22V8M12 8C12 8 8 4 4 8c4 0 8 4 8 4z"/></svg>
            </div>
            <div class="dash__kpi-info">
              <div class="dash__kpi-label">Trees Planted</div>
              <div class="dash__kpi-value">${impactData.treesPlanted}</div>
            </div>
          </div>
          <div class="dash__kpi">
            <div class="dash__kpi-icon dash__kpi-icon--gold">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            </div>
            <div class="dash__kpi-info">
              <div class="dash__kpi-label">Waste Collected</div>
              <div class="dash__kpi-value">${impactData.wasteCollected}kg</div>
            </div>
          </div>
          <div class="dash__kpi">
            <div class="dash__kpi-icon dash__kpi-icon--blue">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
            </div>
            <div class="dash__kpi-info">
              <div class="dash__kpi-label">People Trained</div>
              <div class="dash__kpi-value">${impactData.peopleTrained}</div>
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
                <circle class="dash__circle-fill" cx="50" cy="50" r="42" data-percent="78"/>
              </svg>
              <div class="dash__circle-text">78%</div>
              <div class="dash__circle-label">Tree Planting Goal</div>
            </div>
            <div class="dash__circle">
              <svg class="dash__circle-svg" viewBox="0 0 100 100">
                <circle class="dash__circle-bg" cx="50" cy="50" r="42"/>
                <circle class="dash__circle-fill" cx="50" cy="50" r="42" data-percent="65"/>
              </svg>
              <div class="dash__circle-text">65%</div>
              <div class="dash__circle-label">Cleanup Target</div>
            </div>
            <div class="dash__circle">
              <svg class="dash__circle-svg" viewBox="0 0 100 100">
                <circle class="dash__circle-bg" cx="50" cy="50" r="42"/>
                <circle class="dash__circle-fill" cx="50" cy="50" r="42" data-percent="90"/>
              </svg>
              <div class="dash__circle-text">90%</div>
              <div class="dash__circle-label">Training Goal</div>
            </div>
            <div class="dash__circle">
              <svg class="dash__circle-svg" viewBox="0 0 100 100">
                <circle class="dash__circle-bg" cx="50" cy="50" r="42"/>
                <circle class="dash__circle-fill" cx="50" cy="50" r="42" data-percent="55"/>
              </svg>
              <div class="dash__circle-text">55%</div>
              <div class="dash__circle-label">Species Monitoring</div>
            </div>
          </div>
        </div>

        <div class="dash__card">
          <div class="dash__card-header">
            <h3 class="dash__card-title">Personal Milestones</h3>
          </div>
          <div class="dash__timeline">
            <div class="dash__timeline-item">
              <div class="dash__timeline-dot"></div>
              <div class="dash__timeline-content">
                <div class="dash__timeline-date">August 2026</div>
                <div class="dash__timeline-text">Planted <strong>520 trees</strong> across 3 countries</div>
              </div>
            </div>
            <div class="dash__timeline-item">
              <div class="dash__timeline-dot"></div>
              <div class="dash__timeline-content">
                <div class="dash__timeline-date">July 2026</div>
                <div class="dash__timeline-text">Collected <strong>340kg of waste</strong> from beaches and rivers</div>
              </div>
            </div>
            <div class="dash__timeline-item">
              <div class="dash__timeline-dot"></div>
              <div class="dash__timeline-content">
                <div class="dash__timeline-date">June 2026</div>
                <div class="dash__timeline-text">Trained <strong>120 community members</strong> in sustainable practices</div>
              </div>
            </div>
            <div class="dash__timeline-item">
              <div class="dash__timeline-dot"></div>
              <div class="dash__timeline-content">
                <div class="dash__timeline-date">May 2026</div>
                <div class="dash__timeline-text">Tracked <strong>42 species</strong> across monitoring sites</div>
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

  /* --- 5. LEADERBOARD --- */
  function renderLeaderboard() {
    content.innerHTML = `
      <div class="dash__animate">
        <div class="dash__section-header">
          <div>
            <h2 class="dash__section-title">Leaderboard</h2>
            <p class="dash__section-subtitle">Top volunteers making the biggest impact</p>
          </div>
        </div>

        <div class="dash__kpi-grid" style="grid-template-columns: repeat(3, 1fr); margin-bottom: 1.5rem;">
          <div class="dash__kpi">
            <div class="dash__kpi-icon dash__kpi-icon--gold">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5C7 4 6 9 6 9zm12 0h1.5a2.5 2.5 0 0 0 0-5C17 4 18 9 18 9z"/><path d="M6 9a6 6 0 0 0 12 0"/></svg>
            </div>
            <div class="dash__kpi-info">
              <div class="dash__kpi-label">Your Rank</div>
              <div class="dash__kpi-value">#8</div>
            </div>
          </div>
          <div class="dash__kpi">
            <div class="dash__kpi-icon dash__kpi-icon--green">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2L2 7l10 5 10-5-10-5z"/></svg>
            </div>
            <div class="dash__kpi-info">
              <div class="dash__kpi-label">Your Points</div>
              <div class="dash__kpi-value">2,200</div>
            </div>
          </div>
          <div class="dash__kpi">
            <div class="dash__kpi-icon dash__kpi-icon--blue">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            </div>
            <div class="dash__kpi-info">
              <div class="dash__kpi-label">Your Hours</div>
              <div class="dash__kpi-value">156</div>
            </div>
          </div>
        </div>

        <div class="dash__card">
          <div class="dash__card-header">
            <h3 class="dash__card-title">Top Volunteers</h3>
          </div>
          <div class="dash__table-wrap">
            <table class="dash__table">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Volunteer</th>
                  <th>Hours</th>
                  <th>Points</th>
                  <th>Badge</th>
                </tr>
              </thead>
              <tbody>
                ${leaderboard.map(v => `
                  <tr style="${v.isCurrentUser ? 'background: rgba(200, 164, 111, 0.08);' : ''}">
                    <td><strong>#${v.rank}</strong></td>
                    <td>
                      <div style="display: flex; align-items: center; gap: 0.75rem;">
                        <div style="width: 36px; height: 36px; border-radius: 10px; background: linear-gradient(135deg, var(--dash-primary), var(--dash-accent)); display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.8rem; color: white;">${v.avatar}</div>
                        <div>
                          <strong>${v.name}</strong>
                          ${v.isCurrentUser ? '<span style="font-size: 0.72rem; color: var(--dash-accent); display: block;">You</span>' : ''}
                        </div>
                      </div>
                    </td>
                    <td>${v.hours}h</td>
                    <td><strong>${v.points.toLocaleString()}</strong></td>
                    <td>
                      ${v.badge === 'gold' ? '<span style="color: #f1c40f; font-size: 1.2rem;">🥇</span>' :
                      v.badge === 'silver' ? '<span style="color: #bdc3c7; font-size: 1.2rem;">🥈</span>' :
                      v.badge === 'bronze' ? '<span style="color: #cd7f32; font-size: 1.2rem;">🥉</span>' :
                      '<span style="color: var(--dash-text-muted);">—</span>'}
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  }

  /* --- 6. COMMUNITY --- */
  function renderCommunity() {
    content.innerHTML = `
      <div class="dash__animate">
        <div class="dash__section-header">
          <div>
            <h2 class="dash__section-title">Community</h2>
            <p class="dash__section-subtitle">Connect with fellow volunteers and share experiences</p>
          </div>
        </div>

        <div class="dash__messages-layout">
          <div class="dash__message-list">
            ${communityMessages.map((m, i) => `
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
              <div class="dash__message-avatar">MS</div>
              <div>
                <div class="dash__message-name">Maria Santos</div>
                <div style="font-size: 0.75rem; color: var(--dash-text-muted);">Online</div>
              </div>
            </div>
            <div class="dash__chat-messages" id="chat-messages">
              <div class="dash__chat-msg dash__chat-msg--received">
                <div>Great job on the beach cleanup last weekend!</div>
                <div class="dash__chat-msg-time">1 hour ago</div>
              </div>
              <div class="dash__chat-msg dash__chat-msg--sent">
                <div>Thank you! It was amazing to see the community come together.</div>
                <div class="dash__chat-msg-time">45 min ago</div>
              </div>
              <div class="dash__chat-msg dash__chat-msg--received">
                <div>Are you joining the Amazon reforestation event next month? I'll be there!</div>
                <div class="dash__chat-msg-time">30 min ago</div>
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

      setTimeout(() => {
        chatMessages.innerHTML += `
          <div class="dash__chat-msg dash__chat-msg--received">
            <div>Thanks for your message! See you at the next event.</div>
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
            <p class="dash__section-subtitle">Manage your volunteer profile</p>
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
              <input type="tel" class="dash__form-input" value="+1 (555) 987-6543" placeholder="Enter your phone" />
            </div>
            <div class="dash__form-group">
              <label class="dash__form-label">Skills</label>
              <input type="text" class="dash__form-input" value="Tree Planting, Beach Cleanup, Wildlife Monitoring" placeholder="Enter your skills" />
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
              <div class="dash__toggle-title">Event Notifications</div>
              <div class="dash__toggle-desc">Get notified about new volunteer events near you</div>
            </div>
            <div class="dash__toggle-switch dash__toggle-switch--active" data-toggle="events"></div>
          </div>
          <div class="dash__toggle">
            <div class="dash__toggle-info">
              <div class="dash__toggle-title">Community Messages</div>
              <div class="dash__toggle-desc">Receive messages from fellow volunteers</div>
            </div>
            <div class="dash__toggle-switch dash__toggle-switch--active" data-toggle="messages"></div>
          </div>
          <div class="dash__toggle">
            <div class="dash__toggle-info">
              <div class="dash__toggle-title">Weekly Impact Report</div>
              <div class="dash__toggle-desc">Get a summary of your weekly volunteer contributions</div>
            </div>
            <div class="dash__toggle-switch" data-toggle="reports"></div>
          </div>
          <div class="dash__toggle">
            <div class="dash__toggle-info">
              <div class="dash__toggle-title">Leaderboard Updates</div>
              <div class="dash__toggle-desc">Notify when your rank changes on the leaderboard</div>
            </div>
            <div class="dash__toggle-switch dash__toggle-switch--active" data-toggle="leaderboard"></div>
          </div>
        </div>
      </div>
    `;

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
