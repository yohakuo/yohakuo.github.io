(async function () {
  // --- 1. 注入样式 (包含Tabs, Filter, Grid, Drawer) ---
  const css = `
    .media-page-container { max-width: 1200px; margin: 0 auto; }
    
    /* 顶部 Tabs */
    .media-controls { margin-bottom: 2rem; }
    .media-tabs { display: flex; gap: 1rem; border-bottom: 1px solid #eee; padding-bottom: 10px; margin-bottom: 15px; overflow-x: auto; }
    .media-tab { 
        cursor: pointer; padding: 6px 16px; font-weight: bold; color: #888; border-radius: 4px; transition: all 0.2s; white-space: nowrap;
    }
    .media-tab:hover { background: #f5f5f5; color: #555; }
    .media-tab.active { background: #222; color: #fff; }
    
    /* 筛选工具栏 */
    .filter-bar { display: flex; gap: 15px; flex-wrap: wrap; align-items: center; font-size: 14px; color: #666; margin-bottom: 20px; }
    .filter-group { display: flex; align-items: center; gap: 6px; }
    select { padding: 4px 8px; border: 1px solid #ddd; border-radius: 4px; background: #fff; }

    /* 网格布局 */
    .media-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 15px; }
    .media-card { cursor: pointer; position: relative; transition: transform 0.2s; border: 1px solid #eee; border-radius: 8px; overflow: hidden; }
    .media-card:hover { transform: translateY(-4px); box-shadow: 0 4px 12px rgba(0,0,0,0.08); }
    
    .cover-wrapper { aspect-ratio: 2/3; background: #f4f4f4; position: relative; }
    .media-cover { width: 100%; height: 100%; object-fit: cover; display: block; }
    .media-info { padding: 8px; }
    .media-title { font-size: 14px; font-weight: bold; line-height: 1.3; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
    .badge { position: absolute; top: 4px; right: 4px; background: rgba(0,0,0,0.6); color: #fff; font-size: 10px; padding: 2px 6px; border-radius: 4px; }
    .rating-star { position: absolute; bottom: 4px; left: 4px; background: #ffc107; color: #000; font-size: 11px; padding: 1px 5px; border-radius: 3px; font-weight: bold; }

    /* 抽屉样式 (Drawer) */
    .media-drawer-backdrop { position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 99998; backdrop-filter: blur(2px); }
    .media-drawer-panel { 
        position: fixed; top: 0; right: 0; bottom: 0; width: 420px; max-width: 90vw; 
        background: #fff; z-index: 99999; padding: 25px; overflow-y: auto; 
        box-shadow: -5px 0 20px rgba(0,0,0,0.15); transform: translateX(100%); transition: transform 0.3s ease;
    }
    .media-drawer-panel.open { transform: translateX(0); }
    .drawer-close { position: absolute; top: 15px; right: 15px; cursor: pointer; background: none; border: none; font-size: 24px; color: #999; }
    
    .drawer-header { display: flex; gap: 15px; margin-bottom: 20px; }
    .drawer-cover { width: 100px; height: 150px; object-fit: cover; border-radius: 6px; flex-shrink: 0; background: #eee; }
    .drawer-meta h2 { margin: 0 0 8px 0; font-size: 20px; line-height: 1.2; }
    .drawer-meta p { margin: 4px 0; font-size: 13px; color: #666; }
    .drawer-comment { background: #f9f9f9; padding: 15px; border-radius: 8px; font-size: 14px; line-height: 1.6; position: relative; color: #444; }
    .neodb-link { display: inline-block; margin-top: 20px; padding: 8px 16px; background: #222; color: #fff; text-decoration: none; border-radius: 4px; font-size: 13px; }
    .neodb-link:hover { opacity: 0.9; }
    `;
  const style = document.createElement('style');
  style.innerHTML = css;
  document.head.appendChild(style);

  // --- 2. 状态管理 ---
  const state = {
    data: [],
    filters: {
      tab: 'recent',  // recent, book, movie, podcast, game
      days: 90,
      subtype: 'all',
      sort: 'date',
      tag: ''
    },
    detailItem: null
  };

  // --- 3. 初始化 ---
  const root = document.getElementById("media-app");
  // 如果没有 controls 容器，创建一个
  if (!document.getElementById("media-controls")) {
    const controlsDiv = document.createElement("div");
    controlsDiv.id = "media-controls";
    controlsDiv.className = "media-controls";
    root.insertBefore(controlsDiv, root.firstChild);
  }
  // 创建 Grid 容器
  let gridDiv = document.querySelector(".media-grid");
  if (!gridDiv) {
    gridDiv = document.createElement("div");
    gridDiv.className = "media-grid";
    root.appendChild(gridDiv);
  }

  // --- 4. 抽屉逻辑 (Drawer) ---
  // 动态创建抽屉结构，避免 HTML 依赖
  if (!document.getElementById("media-drawer-panel")) {
    const backdrop = document.createElement("div");
    backdrop.id = "media-drawer-backdrop";
    backdrop.className = "media-drawer-backdrop hidden";
    backdrop.hidden = true;

    const panel = document.createElement("div");
    panel.id = "media-drawer-panel";
    panel.className = "media-drawer-panel";
    panel.innerHTML = `<button class="drawer-close">&times;</button><div id="drawer-content"></div>`;

    document.body.appendChild(backdrop);
    document.body.appendChild(panel);

    // 关闭事件
    const closeDrawer = () => {
      panel.classList.remove("open");
      backdrop.hidden = true;
      document.body.style.overflow = "";
    };
    backdrop.onclick = closeDrawer;
    panel.querySelector(".drawer-close").onclick = closeDrawer;
    window.openDrawer = (item) => {
      const content = document.getElementById("drawer-content");
      const title = item.item?.display_title || item.item?.title || "Untitled";
      const cover = item.item?.cover_image_url || "";
      const link = item.item?.url ? `https://neodb.social${item.item.url}` : "";
      const comment = item.comment_text || "";

      content.innerHTML = `
                <div class="drawer-header">
                    <img src="${cover}" class="drawer-cover">
                    <div class="drawer-meta">
                        <h2>${title}</h2>
                        <p>${item._category} · ${item._shelf}</p>
                        <p>${item.created_time.split('T')[0]}</p>
                        ${item.rating ? `<p style="color:#f39c12;font-weight:bold">★ ${item.rating}</p>` : ''}
                    </div>
                </div>
                ${comment ? `<div class="drawer-comment">${comment}</div>` : ''}
                ${link ? `<a href="${link}" target="_blank" class="neodb-link">在 NeoDB 查看 ↗</a>` : ''}
            `;
      backdrop.hidden = false;
      setTimeout(() => panel.classList.add("open"), 10);
      document.body.style.overflow = "hidden";
    };
  }

  // --- 5. 渲染控制栏 (Tabs & Filters) ---
  function renderControls() {
    const c = document.getElementById("media-controls");
    const f = state.filters;

    c.innerHTML = `
            <div class="media-tabs">
                ${['recent', 'book', 'movie', 'podcast', 'game'].map(k => `
                    <div class="media-tab ${f.tab === k ? 'active' : ''}" data-tab="${k}">
                        ${{ 'recent': '最近', 'book': '文', 'movie': '影', 'podcast': '听', 'game': '游' }[k]}
                    </div>
                `).join('')}
            </div>
            
            <div class="filter-bar">
                ${f.tab === 'recent' ? `
                <div class="filter-group">
                    <label>范围:</label>
                    <select id="sel-days">
                        <option value="30" ${f.days === 30 ? 'selected' : ''}>30天</option>
                        <option value="90" ${f.days === 90 ? 'selected' : ''}>90天</option>
                        <option value="180" ${f.days === 180 ? 'selected' : ''}>180天</option>
                    </select>
                </div>` : ''}

                ${f.tab === 'movie' ? `
                <div class="filter-group">
                    <label>类型:</label>
                    <select id="sel-subtype">
                        <option value="all" ${f.subtype === 'all' ? 'selected' : ''}>全部</option>
                        <option value="movie" ${f.subtype === 'movie' ? 'selected' : ''}>电影</option>
                        <option value="tv" ${f.subtype === 'tv' ? 'selected' : ''}>剧集</option>
                    </select>
                </div>` : ''}

                <div class="filter-group">
                    <label>排序:</label>
                    <select id="sel-sort">
                        <option value="date" ${f.sort === 'date' ? 'selected' : ''}>时间</option>
                        <option value="rating" ${f.sort === 'rating' ? 'selected' : ''}>评分</option>
                    </select>
                </div>
            </div>
        `;

    // 绑定 Tab 点击
    c.querySelectorAll('.media-tab').forEach(el => {
      el.onclick = () => {
        state.filters.tab = el.dataset.tab;
        renderApp();
      };
    });

    // 绑定 Select 变化
    const bind = (id, key, needsInt) => {
      const el = document.getElementById(id);
      if (el) el.onchange = (e) => {
        state.filters[key] = needsInt ? parseInt(e.target.value) : e.target.value;
        renderGrid();
      };
    };
    bind('sel-days', 'days', true);
    bind('sel-subtype', 'subtype', false);
    bind('sel-sort', 'sort', false);
  }

  // --- 6. 数据处理与网格渲染 ---
  function processData() {
    let list = state.data.filter(d => {
      const cat = d._category;
      const f = state.filters;

      // Tab 过滤
      if (f.tab === 'book' && cat !== 'book') return false;
      if (f.tab === 'podcast' && cat !== 'podcast') return false;
      if (f.tab === 'game' && cat !== 'game') return false;
      if (f.tab === 'movie') {
        if (cat !== 'movie' && cat !== 'tv') return false;
        if (f.subtype === 'movie' && cat !== 'movie') return false;
        if (f.subtype === 'tv' && cat !== 'tv') return false;
      }
      if (f.tab === 'recent') {
        const diff = (Date.now() - new Date(d.created_time).getTime()) / (86400000);
        if (diff > f.days) return false;
      }
      return true;
    });

    // 排序
    list.sort((a, b) => {
      if (state.filters.sort === 'rating') return (b.rating || 0) - (a.rating || 0);
      return new Date(b.created_time) - new Date(a.created_time);
    });
    return list;
  }

  function renderGrid() {
    const list = processData();
    const grid = document.querySelector(".media-grid");

    if (!list.length) {
      grid.innerHTML = `<div style="padding:20px;color:#999">没有找到相关记录</div>`;
      return;
    }

    grid.innerHTML = list.map((item, idx) => {
      const title = item.item?.display_title || "Untitled";
      const cover = item.item?.cover_image_url || "";
      const rating = item.rating ? `<div class="rating-star">★${item.rating}</div>` : '';
      const badge = (state.filters.tab === 'recent' || state.filters.tab === 'movie')
        ? `<span class="badge">${item._category === 'movie' ? '电影' : item._category === 'tv' ? '剧集' : item._category}</span>`
        : '';

      return `
            <div class="media-card" data-uuid="${item.item?.uuid}">
                <div class="cover-wrapper">
                    <img src="${cover}" class="media-cover" loading="lazy">
                    ${badge}
                    ${rating}
                </div>
                <div class="media-info">
                    <div class="media-title">${title}</div>
                </div>
            </div>`;
    }).join('');

    // 绑定点击
    grid.querySelectorAll('.media-card').forEach(card => {
      card.onclick = () => {
        const uuid = card.dataset.uuid;
        const item = state.data.find(d => d.item?.uuid === uuid);
        if (item) window.openDrawer(item);
      };
    });
  }

  function renderApp() {
    renderControls();
    renderGrid();
  }

  // --- 7. 开始加载 ---
  try {
    const res = await fetch(window.NEODB_DATA_URL);
    const json = await res.json();
    state.data = json.items || [];
    renderApp();
  } catch (e) {
    document.querySelector(".media-grid").innerHTML = `<p style="color:red">数据加载失败: ${e.message}</p>`;
  }

})();