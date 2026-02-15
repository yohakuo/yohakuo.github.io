---
date: 2026-01-26T10:52:00
draft: false
source:
share: true
tags:
  - Blog
  - Method
categories: 六分经验
archive:
title: Blog新增书影游页
---

数据同步选用方案B，单独数据仓库。

然后是前端界面。顶部tag：最近 / 文 / 影 / 听/ 游，Tab 内支持排序与筛选（最近、评分、完成时间），最近tag显示过去几个月的混合流。

本笔记是和 AI 交流得出的方案，可以先聊好需求，再最小化实践。

## 展示样式
Tabs
- **最近**：显示过去 N 天（默认 90）的混合流（book+movie+tv+podcast+game）
- **文**：book
- **影**：movie + tv（卡片角标区分）
- **听**：podcast
- **游**：game

排序
- 最近：`created_time desc`
- 评分：`rating desc`（null 放最后）

筛选（建议最小可用集）
- 时间范围（仅“最近”Tab）：30/90/180 天
- 子类型（仅“影”Tab）：电影/剧集
- 仅有短评：开关
- 标签：下拉多选（从 index 里聚合 tags）

Drawer（不跳页 + 支持可分享 URL）
实现“打开抽屉但不刷新页面”的同时，把状态写进 URL：
- `/media/?tab=ying&id=<uuid>&sort=recent&days=90`  
    用 `history.pushState`，关闭抽屉时移除 `id`。

抽屉展示：
- 你的评分 + 你的短评（来自 index）
- “在 NeoDB 打开”链接


## 数据仓库
新建一个**github repo `neodb-media-data`** 

**获取 [Neodb Token](https://neodb.social/developer/)**
点击头像-设置，下滑到底部，点击[查看已授权的应用程序](https://neodb.social/@whitejellyfish/settings/tokens/)，创建新的Personal Token 并记录。

在数据仓库的 Settings → Secrets and variables → Actions 的 `Repository secrets` 创建：
- `Name`：`NEODB_TOKEN`
- `Secret`：`你的 token`

在Settings → Pages → Build and deployment → Source：选择 `GitHub Actions`


下一步用最小 Workflow `podcast complete` 输出 `index.json`，看是否能成功读取数据。

**Workflow 逻辑**—— [参考AsyncX 博客](https://blog.asyncx.top/posts/2025-02-12?utm_source=chatgpt.com)
每天跑一次 + 支持手动触发：
1. 分别拉：`book / movie / tv / podcast / game` 的 complete 列表（分页拉完）
2. 生成/更新 `index.json`
3. 找出 index 里新出现的 uuid（或 detail 缺失的 uuid）
4. 对这些 uuid 调用条目详情接口，写入 `detail/{type}/{uuid}.json`
5. 若 `index.json` 或 detail 有变化才 commit

创建 `.github/workflows/neodb-sync-and-pages.yml`
> [!note]- 
> {{< details title = "点击展开" >}}
> ```
> name: Sync NeoDB Podcast (complete)
> 
> on:
>   workflow_dispatch:
>   schedule:
>     - cron: "23 2 * * *" # 每天 UTC 02:23 跑一次
> 
> permissions:
>   contents: write
> 
> jobs:
>   sync:
>     runs-on: ubuntu-latest
>     steps:
>       - name: Checkout
>         uses: actions/checkout@v4
> 
>       - name: Setup Python
>         uses: actions/setup-python@v5
>         with:
>           python-version: "3.11"
> 
>       - name: Install deps
>         run: |
>           python -m pip install --upgrade pip
>           pip install requests
> 
>       - name: Fetch NeoDB shelf (podcast complete) -> index.json
>         env:
>           NEODB_TOKEN: ${{ secrets.NEODBTOKEN }}
>           NEODB_BASE: https://neodb.social
>         run: |
>           python - <<'PY'
>           import os, json, time
>           import requests
>           from datetime import datetime, timezone
> 
>           base = os.getenv("NEODB_BASE", "https://neodb.social").rstrip("/")
>           token = os.environ["NEODB_TOKEN"]
> 
>           # 抓 podcast + complete
>           url_tpl = f"{base}/api/me/shelf/progress?category=podcast&page={{page}}"
> 
>           headers = {
>               "Authorization": f"Bearer {token}",
>               "Accept": "application/json",
>               "User-Agent": "neodb-sync-github-actions"
>           }
> 
>           items = []
>           page = 1
>           while True:
>               url = url_tpl.format(page=page)
>               r = requests.get(url, headers=headers, timeout=30)
>               if r.status_code != 200:
>                   raise SystemExit(f"Request failed: {r.status_code} {r.text[:2000]}")
>               data = r.json()
> 
>               # NeoDB 常见返回：{"data":[...], "count":..., ...}
>               page_items = data.get("data") or []
>               if not page_items:
>                   break
> 
>               items.extend(page_items)
>               page += 1
>               time.sleep(0.2)  # 轻微限速，避免打太快
> 
>           out = {
>               "generated_at": datetime.now(timezone.utc).isoformat(),
>               "source": {
>                   "base": base,
>                   "shelf": "complete",
>                   "category": "podcast",
>               },
>               "count": len(items),
>               "items": items,
>           }
> 
>           with open("index.json", "w", encoding="utf-8") as f:
>               json.dump(out, f, ensure_ascii=False, indent=2)
> 
>           print(f"Wrote index.json with {len(items)} items")
>           PY
> 
>       - name: Commit & push if changed
>         run: |
>           if git diff --quiet -- index.json; then
>             echo "No changes in index.json"
>             exit 0
>           fi
> 
>           git config user.name "github-actions[bot]"
>           git config user.email "github-actions[bot]@users.noreply.github.com"
> 
>           git add index.json
>           git commit -m "chore: sync neodb podcast complete"
>           git push
> ```
> {{< /details >}}

做完这一步，可以把 `index.json` 的公开地址发给 AI，让它给出之前讨论好方案的完整版。


## Hugo 仓库
### 本地测试
先在本地修改到满意, 最后的版本是 AI 写的也没细看，有些 bug 但暂时没管，推到线上和本地效果一致

新增页面  `content/media/index.md`
```
---
 title: "影音" 
 layout: "media"
---
```

新增 layout  `layouts/_default/media.html`
```
{{ define "main" }}
<h1>{{ .Title }}</h1>

<div id="media-app">
  <p>Loading media data…</p>
</div>

<script>
  window.NEODB_DATA_URL = "https://yohakuo.github.io/neodb-media-data/index.json";
</script>
<script src="/js/neodb-media.js"></script>
{{ end }}
```

新建 JS  `static/js/neodb-media.js`
```
(async function () {
  const root = document.getElementById("media-app");
  const url = window.NEODB_DATA_URL;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(res.status);
    const data = await res.json();

    root.innerHTML = `
      <p>Items: ${data.count}</p>
      <ul>
        ${data.items.slice(0, 10).map(it => `
          <li>
            ${it.item?.display_title || "Untitled"}
            (${it._category}, ${it._shelf})
          </li>
        `).join("")}
      </ul>
    `;
  } catch (e) {
    root.innerHTML = `<pre>Failed to load data: ${e}</pre>`;
  }
})();
```








