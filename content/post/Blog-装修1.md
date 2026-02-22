---
date: 2026-02-10T12:01:00
draft: false
source:
share: true
tags:
  - Blog
  - Method
categories: 六分经验
archive:
title: Blog装修其一
---
装修参考[第三夏尔的装修笔记](https://thirdshire.com/hugo-stack-renovation/)，并依靠 ai 的大力支持。

## 折叠功能
### callout 样式与折叠
主要靠 vibe，参考 obsidian 的色系，并支持嵌套列表之类的功能。折腾半天最后通过下面的代码块加 quickadd 的捕获功能来同时兼容 obsidian-callout 折叠和博客折叠。

```text
>[!note]- 
>{{</* details title = "{{value:请输入标题}}" */>}}
>{{value:输入内容}}
>{{</* /details */>}}
```

> [!note] 
> hugo 官方提供展示短代码的方式，在两层大括号里使用 `</* */>` 包裹代码，被包裹的部分不会执行。

> [!note]- 样式清单
> {{< details >}}
> - `[!NOTE]` / `[!INFO]` — 蓝色注释 / 信息 
> - `[!TIP]` / `[!ABSTRACT]` — 青色提示 / 摘要 
> - `[!SUCCESS]` / `[!DONE]` — 绿色成功 / 完成 
> - `[!WARNING]` / `[!CAUTION]` — 橙色警告 / 注意 
> - `[!QUESTION]` — 橙色问题 
> - `[!FAILURE]` / `[!DANGER]` / `[!BUG]` — 红色失败 / 危险 / 错误 
> - `[!IMPORTANT]` — 红色重要 
> - `[!EXAMPLE]` — 紫色示例
> - `[!QUOTE]` — 灰色引用
> {{< /details >}}

### 普通折叠块
来自 [Stackoverflow](https://stackoverflow.com/questions/71691219/add-collapsible-section-in-hugo)  ，效果为简单的黑色箭头。

创建 `\layouts\shortcodes\details.html`
> [!note]- 代码
> ```html
> <details {{ if .Get "open" }}open{{ end }}>
>     <summary>{{ .Get "title" | default "点击展开" }}</summary>
>     <div class="details-content">
>         {{ .Inner | markdownify }}
>     </div>
> </details>
> ```


样式设置 `assets/scss/custom.scss`
> [!note]- 代码
> ```scss
> /* 简单的 details 美化 */
> details {
>     margin: 1rem 0;
>     padding: 1rem;
>     border: 1px solid var(--card-border); /* 适配 Stack 主题的边框颜色 */
>     background-color: var(--card-background); /* 适配 Stack 主题的背景 */
>     border-radius: var(--card-border-radius);
>     
>     summary {
>         cursor: pointer;
>         font-weight: bold;
>         outline: none;
>     }
>     
>     .details-content {
>         margin-top: 1rem;
>     }
> }
> ```


> [!example] 使用方法如下
> ```
> <details>
> <summary>标题</summary>
> 内容
> </details>
> ```


## 页面
在 `content` 文件夹中修改关于、主页和搜索页，配置图标。
`content/home/_index.md`
> [!note]- yaml
> 
> ```yaml
> ---
> title: "主页"
> slug: "home"
> layout: "home-posts"
> menu:
>   main:
>     identifier: home
>     url: /home/
>     weight: 10
>     params:
>       icon: bubble  
> ---
> ```

`layouts/home/home-posts.html`
> [!note]- yaml
> ```yaml
> {{ define "main" }}
> {{ $pages := where .Site.RegularPages "Type" "in" .Site.Params.mainSections }}
> {{ $filtered := where $pages "Params.hidden" "!=" true }}
> {{ $pag := .Paginate ($filtered) }}
> 
> <section class="article-list">
>     {{ range $index, $element := $pag.Pages }}
>     {{ partial "article-list/default" . }}
>     {{ end }}
> </section>
> 
> {{- partial "pagination.html" . -}}
> {{- partial "footer/footer" . -}}
> {{ end }}
> 
> {{ define "right-sidebar" }}
> {{ partial "sidebar/right.html" (dict "Context" . "Scope" "homepage") }}
> {{ end }}
> ```

`content/search/index.md`
> [!note]- yaml
> ```yaml
> ---
> title: "搜索"
> slug: "search"
> layout: "search"
> type: "page"
> outputs:
>     - html
>     - json
> menu:
>   main:
>     identifier: search
>     url: /search/
>     weight: 40
>     params:
>       icon: search
> ---
> ```

图标可以在 [Tabler Icons](https://tabler-icons.io/) 中下，并放到主题文件夹的 `assets/icons` 下，就能在 `yaml` 中直接设置了。

## 页脚
### 建站计时&字数统计
样式和代码参考自[第三夏尔的装修博客][([https://rwtx.cc/04/2260/uncategorized/)](https://thirdshire.com/hugo-stack-renovation/#%E6%80%BB%E5%AD%97%E6%95%B0%E7%BB%9F%E8%AE%A1%E5%8F%91%E8%A1%A8%E4%BA%86x%E7%AF%87%E6%96%87%E7%AB%A0%E5%85%B1%E8%AE%A1x%E5%AD%97)]  。

计时逻辑修改 `layouts/partials/footer/custom.html`。
> [!note]- 
> {{< details title = "点击展开" >}}
> ``` 
> <!-- Add blog running time -->
> <script>
>  let s1 = '2023-3-18'; //website start date
>  s1 = new Date(s1.replace(/-/g, "/"));
>  let s2 = new Date();
> 
>  // Calculate the difference
>  let diffInMilliseconds = s2.getTime() - s1.getTime();
>  let totalDays = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24));
> 
>  // Create a new date object starting from the initial date
>  let years = s2.getFullYear() - s1.getFullYear();
>  let months = s2.getMonth() - s1.getMonth();
>  let days = s2.getDate() - s1.getDate();
> 
>  // Adjust months and years if necessary
>  if (days < 0) {
>    months -= 1;
>    let prevMonth = new Date(s2.getFullYear(), s2.getMonth(), 0); // Get the last day of the previous month
>    days += prevMonth.getDate();
>  }
>  if (months < 0) {
>    years -= 1;
>    months += 12;
>  }
> 
>  // Format the result
>  let result = `${years}年${months}月${days}天`;
>  document.getElementById('runningdays').innerHTML = result;
> </script>
> ```
> {{< /details >}}

页脚内容修改 `layouts/partials/footer/footer.html`。发现这个文件会覆盖主题默认的内容，手动加了版权和主题信息。
> [!note]- 
> {{< details title = "点击展开" >}}
> ```
> <div class="footer-layout">
>     <!-- Add blog running time -->
>     <section class="running-time">
>         本博客已稳定运行
>         <span id="runningdays" class="running-days"></span>
>     </section>
> 
> 
>     <!-- Add copyright notice -->
>     <section class="copyright-notice">
>         © 2024 - 2026 新喀鸦006 All rights reserved. 禁止转载。如需引用，请注明文章链接。
>     </section>
> 
>     <!-- Add total page and word count time -->
>     <section class="totalcount">
>         {{$scratch := newScratch}}
>         {{ range (where .Site.Pages "Kind" "page" )}}
>         {{$scratch.Add "total" .WordCount}}
>         {{ end }}
>         发表了{{ len (where .Site.RegularPages "Section" "post") }}篇文章 ·
>         总计{{ div ($scratch.Get "total") 1000.0 | lang.FormatNumber 2 }}k字
>     </section>
> 
>     <section class="footer-credits">
>         使用 Hugo 构建
>     </section>
>     <section class="footer-credits">
>         主题 Stack 由 Jimmy 设计
>     </section>
> </div>
> ```
> {{< /details >}}

样式修改 `assets/scss/partials/footer.scss`。
> [!note]- 
> {{< details title = "点击展开" >}}
> ```
> // 底部距离
> main.main {
>     padding-bottom: 4rem;
> }
> 
> .footer-layout {
>     display: flex;
>     flex-direction: column;
>     gap: 5px;
> }
> 
> .running-time {
>     color: var(--card-text-color-secondary);
>     font-weight: normal;
>     font-size: 14px;
> 
>     .running-days {
>         font-weight: bold;
>         color: var(--emphasize-text-color);
>     }
> }
> 
> .totalcount {
>     color: var(--card-text-color-secondary);
>     font-weight: normal;
>     font-size: 14px;
> }
> 
> .copyright-notice {
>     font-weight: bold;
>     color: #8fbc8f;
>     font-size: 14px;
> }
> 
> .footer-credits {
>     color: #a0a0a0;
>     font-size: 12px;
>     font-weight: normal;
> }
> ```
> {{< /details >}}

### 页脚分割符
在 `assets/scss/partials/footer.scss` 的 `.running-time` 类中添加了 `::before` 伪元素实现的视觉分隔符。
> [!note]- 
> ```
> .running-time {
>     color: var(--card-text-color-secondary);
>     font-weight: normal;
>     font-size: 14px;
> 
>     &::before {
>         content: "";
>         display: block;
>         width: 50px;
>         height: 3px;
>         background: #B0B0B0;
>         margin: 0 0 20px; // 左对齐，下边距 20px
>     }
> ```

## 链接
### 外部链接显示图标
创建 `layouts/_default/_markup/render-link.html` 。
> [!note]- 
> {{< details title = "点击展开" >}}
> ```
> <a class="link" href="{{ .Destination | safeURL }}" {{ with .Title}} title="{{ . }}"{{ end }}{{ if strings.HasPrefix .Destination "http" }} target="_blank" rel="noopener"{{ end }}>{{ .Text | safeHTML }}
>     {{- if strings.HasPrefix .Destination "http" }}
>     <span style="white-space: nowrap;"><svg width=".7em"
>         height=".7em" viewBox="0 0 21 21" xmlns="http://www.w3.org/2000/svg">
>         <path d="m13 3l3.293 3.293l-7 7l1.414 1.414l7-7L21 11V3z" fill="currentColor" />
>         <path d="M19 19H5V5h7l-2-2H5c-1.103 0-2 .897-2 2v14c0 1.103.897 2 2 2h14c1.103 0 2-.897 2-2v-5l-2-2v7z"
>             fill="currentColor" />
>     </svg></span>
>     {{- end -}}
> </a>
> ```
> {{< /details >}}
### 内部链接支持Obsidian 链接
 格式为： `[Link Text](Filename.md)`

`layouts/_default/_markup/render-link.html`
> [!note]- 
> {{< details title = "点击展开" >}}
> ```
> {{- $dest := .Destination -}}
> {{- $isRemote := or (strings.HasPrefix $dest "http") (strings.HasPrefix $dest "mailto") -}}
> {{- if not $isRemote -}}
> {{- $urlParts := split $dest "#" -}}
> {{- $path := index $urlParts 0 -}}
> {{- $anchor := "" -}}
> {{- if gt (len $urlParts) 1 -}}
> {{- $anchor = printf "#%s" (delimit (after 1 $urlParts) "#") -}}
> {{- end -}}
> 
> {{- $page := .Page.GetPage $path -}}
> {{- if $page -}}
> {{- $dest = printf "%s%s" $page.RelPermalink $anchor -}}
> {{- else -}}
> {{- /* Attempt to find by filename (Obsidian style) */ -}}
> {{- $filename := path.Base $path -}}
> {{- $name := $filename | strings.TrimSuffix (path.Ext $filename) -}}
> 
> {{- range site.RegularPages -}}
> {{- if or (eq .File.LogicalName $filename) (eq .File.ContentBaseName $name) -}}
> {{- $dest = printf "%s%s" .RelPermalink $anchor -}}
> {{- break -}}
> {{- end -}}
> {{- end -}}
> {{- end -}}
> {{- end -}}
> 
> <a class="link" href="{{ $dest | safeURL }}" {{ with .Title}} title="{{ . }}" {{ end }}{{ if strings.HasPrefix
>     .Destination "http" }} target="_blank" rel="noopener" {{ end }}>{{ .Text | safeHTML }}
>     {{- if strings.HasPrefix .Destination "http" }}
>     <span style="white-space: nowrap;"><svg width=".7em" height=".7em" viewBox="0 0 21 21"
>             xmlns="http://www.w3.org/2000/svg">
>             <path d="m13 3l3.293 3.293l-7 7l1.414 1.414l7-7L21 11V3z" fill="currentColor" />
>             <path d="M19 19H5V5h7l-2-2H5c-1.103 0-2 .897-2 2v14c0 1.103.897 2 2 2h14c1.103 0 2-.897 2-2v-5l-2-2v7z"
>                 fill="currentColor" />
>         </svg></span>
>     {{- end -}}
> </a>
> ```
> {{< /details >}}

## macOS 风代码块
修改主题文件夹下 `assets/scss/partials/layout/article.scss` 中的 `.highlight` 部分。
```scss
.highlight {
    background-color: var (--pre-background-color);
    padding: var (--card-padding);
    position: relative;
    border-radius: 10px;
    max-width: 100% !important;
    margin: 0 !important;
    box-shadow: var (--shadow-l1) !important;
    ...}
```

在根目录创建 `static/img/code-header.svg `。
```svg 
<svg xmlns="http://www.w3.org/2000/svg" version="1.1"  x="0px" y="0px" width="450px" height="130px">
    <ellipse cx="65" cy="65" rx="50" ry="52" stroke="rgb(220,60,54)" stroke-width="2" fill="rgb(237,108,96)"/>
    <ellipse cx="225" cy="65" rx="50" ry="52"  stroke="rgb(218,151,33)" stroke-width="2" fill="rgb(247,193,81)"/>
    <ellipse cx="385" cy="65" rx="50" ry="52"  stroke="rgb(27,161,37)" stroke-width="2" fill="rgb(100,200,86)"/>
</svg>
```

 在根目录下的 `assets/scss/custom.scss` 添加代码块的样式：
```scss
// 为代码块顶部添加 macos 样式
.article-content {
    .highlight:before {
      content: "";
      display: block;
      background: url(/img/code-header.svg);
      height: 25px;
      width: 100%;
      background-size: 52px;
      background-repeat: no-repeat;
      margin-top: -10px;
      margin-bottom: 0;
    }
  }
```


## 首页标签云显示数目
`layouts\partials\widget\categories.html`
```scss
{{- $context := .Context -}}
{{- $limit := default 10 .Params.limit -}}
<section class="widget tagCloud">
    <div class="widget-icon">
        {{ partial "helper/icon" "categories" }}
    </div>
    <h2 class="widget-title section-title">{{ T "widget.categoriesCloud.title" }}</h2>

    <div class="tagCloud-tags">
        {{ range first $limit $context.Site.Taxonomies.categories.ByCount }}
        <a href="{{ .Page.RelPermalink }}" class="font_size_{{ .Count }}">
            {{ .Page.Title }}
            <span class="count">{{ .Count }}</span>
        </a>
        {{ end }}
    </div>
</section>
```

`layouts/partials/widget/tag-cloud.html`
```html
{{- $context := .Context -}}
{{- $limit := default 10 .Params.limit -}}
<section class="widget tagCloud">
    <div class="widget-icon">
        {{ partial "helper/icon" "tag" }}
    </div>
    <h2 class="widget-title section-title">{{ T "widget.tagCloud.title" }}</h2>

    <div class="tagCloud-tags">
        {{ range first $limit $context.Site.Taxonomies.tags.ByCount }}
        <a href="{{ .Page.RelPermalink }}">
            {{ .Page.Title }}
            <span class="count">{{ .Count }}</span>
        </a>
        {{ end }}
    </div>
</section>
```

`assets\scss\custom.scss`
```scss
.tagCloud .tagCloud-tags a {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .count {
        color: var(--card-text-color-tertiary);
        margin-left: 0.5rem;
    }
}
```


## Neodb 短评卡片
hugo 版本为 `v0.154.3`, 参考[这里]([https://thirdshire.com/hugo-stack-renovation-part-three/#neodb-%E8%87%AA%E5%8A%A8%E5%8C%96%E7%9F%AD%E8%AF%84%E5%8D%A1%E7%89%87:~:text=%E7%94%9F%E6%88%90%E7%9A%84%20token%E3%80%82-,%E5%88%9B%E5%BB%BA%20Neodb%20%E5%8D%A1%E7%89%87,-%E6%96%B0%E5%BB%BA%E6%96%87%E4%BB%B6%20layouts](https://thirdshire.com/hugo-stack-renovation-part-three/#neodb-%E8%87%AA%E5%8A%A8%E5%8C%96%E7%9F%AD%E8%AF%84%E5%8D%A1%E7%89%87))中Hugo v0.123.0 及之后的版本。不知道为什么直接使用有一些问题，让 ai 修改了一下。

```
{{</* neodb-review "https://neodb.social/..." */>}}
```

注意获取的 token 只给可读权限。
> [!note]- `layouts/shortcodes/neodb-review.html`
> {{< details title = "点击展开" >}}
> ```
>{{ $dbUrl := .Get 0 }} {{ $apiUrl := "https://neodb.social/api/me/shelf/item/"
> }} {{ $itemUuid := "" }}
> {{ $authToken := site.Params.neodb_token }}
> 
> {{ if not $authToken }}
> <p style="text-align: center; color: red;"><small>NeoDB API Token not found. Please set 'neodb_token' in your site
>         configuration.</small></p>
> {{ else }}
> 
> <!-- Extract item_uuid from the URL -->
> {{ if (findRE `.*neodb\.social\/.*\/(.*)` $dbUrl) }}
> {{ $itemUuid = replaceRE `.*neodb\.social\/.*\/(.*)` "$1" $dbUrl }}
> 
> <!-- Construct the API URL -->
> {{ $dbApiUrl := print $apiUrl $itemUuid }}
> 
> <!-- Set up the Authorization header -->
> {{ $opts := dict "headers" (dict "Authorization" (print "Bearer " $authToken)) }}
> 
> <!-- Fetch JSON from the API using resources.GetRemote -->
> {{ $dbFetch := resources.GetRemote $dbApiUrl $opts | transform.Unmarshal }}
> 
> <!-- Determine shelf status -->
> {{ $shelfType := $dbFetch.shelf_type }} {{ $category := $dbFetch.item.category }}
> {{ $action := "" }} {{ $prefix := "" }} {{ $suffix := "" }} {{ $displayText := "" }}
> 
> <!-- Determine the action based on category -->
> {{ if eq $category "book" }} {{ $action = "读" }} {{ else if or (eq $category "tv") (eq $category "movie") }} {{ $action
> = "看" }} {{ else if or (eq $category "podcast") (eq $category "album") }} {{ $action = "听" }} {{ else if eq $category
> "game" }} {{ $action = "玩" }} {{ end }}
> 
> <!-- Determine the prefix and suffix based on shelf type -->
> {{ if eq $shelfType "wishlist" }} {{ $prefix = "想" }} {{ else if eq $shelfType "complete" }} {{ $suffix = "过" }} {{ else
> if eq $shelfType "progress" }} {{ $prefix = "在" }} {{ else if eq $shelfType "dropped" }} {{ $prefix = "不" }} {{ $suffix
> = "了" }} {{ end }}
> 
> <!-- Combine prefix, action, and suffix -->
> {{ $displayText = print $prefix $action $suffix }}
> 
> <!-- Prep for star rating -->
> {{ $fullStars := 0 }} {{ $starCount := 0 }} {{ $halfStar := 0 }} {{ $emptyStars := 5 }}
> <!-- Calc star rating -->
> {{ $rating := $dbFetch.rating_grade }}
> <!-- Get the rating -->
> {{ if $rating }} {{ $starCount = div (mul $rating 5) 10 }} {{ $fullStars = int $starCount }}
> <!-- Full stars count -->
> 
> <!-- Determine if there is a half star -->
> {{ if (mod $rating 2) }} {{ $halfStar = 1 }} {{ end }}
> 
> <!-- Calculate empty stars -->
> {{ $emptyStars = sub 5 (add $fullStars $halfStar) }}
> <!-- Empty stars count -->
> {{ end }}
> 
> <!-- Check if data is retrieved -->
> {{ if $dbFetch }}
> <div class="db-card">
>     <div class="db-card-subject">
>         <div class="db-card-post">
>             <img src="{{ $dbFetch.item.cover_image_url }}" alt="Cover Image" style="max-width: 100%; height: auto" />
>         </div>
>         <div class="db-card-content">
>             <div class="db-card-title">
>                 <a href="{{ $dbUrl }}" class="cute" target="_blank" rel="noreferrer">{{ $dbFetch.item.title }}</a>
>             </div>
>             <div class="db-card-rating">
>                 {{ $dbFetch.created_time | time.Format "2006-01-02T15:04:05Z" | time.Format "2006 年 01 月 02 日" }} {{
>                 $displayText }}
>                 <!-- Add the rating as stars -->
>                 <div class="db-card-rating-stars">
>                     <!-- Full stars -->
>                     {{ if $fullStars }} {{ range $i := (seq 1 $fullStars) }}
>                     <i class="fa-solid fa-star"></i>
>                     {{ end }} {{ end }}
> 
>                     <!-- Half star -->
>                     {{ if $halfStar }}
>                     <i class="fa-regular fa-star-half-stroke"></i>
>                     {{ end }}
> 
>                     <!-- Empty stars -->
>                     {{ if $emptyStars }} {{ range $i := (seq 1 $emptyStars) }}
>                     <i class="fa-regular fa-star"></i>
>                     {{ end }} {{ end }}
>                 </div>
>             </div>
>             <div class="db-card-comment">
>                 {{ $dbFetch.comment_text | markdownify }}
>             </div>
>         </div>
>         <div class="db-card-cate">{{ $dbFetch.item.category }}</div>
>     </div>
> </div>
> {{ else }}
> <p style="text-align: center">
>     <small>Failed to fetch content, please check the API validity.</small>
> </p>
> {{ end }}
> 
> {{ else }}
> <p style="text-align: center"><small>Invalid URL format.</small></p>
> {{ end }}
> 
> {{ end }}
> ```
> {{< /details >}}

修改 `hugo.toml` 添加 token。
```toml
[params]
neodb_token = "你的token"
```

上面的代码使用到 [Font Awesome](https://fontawesome.com/)。注册账号后 add a new kit - 填完信息后能看到如下格式的代码，粘贴在 `layouts/partials/head/custom.html` 内：
```
<!-- Font awesome -->
<script src="https://kit.fontawesome.com/xxxxx.js" crossorigin="anonymous"></script>
```


> [!note]- ` assets/scss/custom.scss` -自定义样式
> {{< details title = "点击展开" >}}
> ```
> // Neodb card style
> .db-card {
>     margin: 2.5rem 2.5rem;
>     background: var(--color-codebg);
>     border-radius: 7px;
>     box-shadow: 0 6px 10px 0 #00000053;
> }
> 
> .db-card-subject {
>     display: flex;
>     align-items: flex-start;
>     line-height: 1.6;
>     padding: 12px;
>     position: relative;
> }
> 
> .dark .db-card {
>     background: var(--color-codebg);
> }
> 
> .db-card-content {
>     flex: 1 1 auto;
>     overflow: auto;
>     margin-top: 8px;
> }
> 
> .db-card-post {
>     width: 100px;
>     margin-right: 15px;
>     margin-top: 20px;
>     display: flex;
>     flex: 0 0 auto;
> }
> 
> .db-card-title {
>     margin-bottom: 3px;
>     font-size: 1.6rem;
>     color: var(--card-text-color-main);
>     font-weight: bold;
> }
> 
> .db-card-title a {
>     text-decoration: none!important;
> }
> 
> .db-card-rating {
>     font-size: calc(var(--article-font-size) * 0.9);
> }
> 
> .db-card-comment {
>     font-size: calc(var(--article-font-size) * 0.9);
>     margin-top: 10px;
>     margin-bottom: 15px;
>     overflow: auto;
>     max-height: 150px!important;
>     color: var(--card-text-color-main);
> }
> 
> .db-card-cate {
>     position: absolute;
>     top: 0;
>     right: 0;
>     background: #8aa2d3;
>     padding: 1px 8px;
>     font-size: small;
>     font-style: italic;
>     border-radius: 0 8px 0 8px;
>     text-transform: capitalize;
> }
> 
>  .db-card-post img {
>     width: 100px!important;
>     height: 150px!important;
>     border-radius: 4px;
>     -o-object-fit: cover;
>     object-fit: cover;
> }
> 
> @media (max-width: 600px) {
>     .db-card {
>         margin: 0.8rem 0.5rem;
>     }
>     .db-card-title {
>         font-size: calc(var(--article-font-size) * 0.75);
>     }
>     .db-card-rating {
>       font-size: calc(var(--article-font-size) * 0.7);
>     }
>     .db-card-comment {
>       font-size: calc(var(--article-font-size) * 0.7);
>     }
> }
> ```
> {{< /details >}}




