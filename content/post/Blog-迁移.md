---
date: 2026-01-10T21:43:00
source:
share: true
tags:
  - Blog
categories: 六分经验
archive:
title: 从hexo到hugo博客的迁移
---

从hexo到hugo博客的迁移，保留原工作流——由Obsidian Enveloppe 插件上传到仓库，然后由 GitHub 工作流构建和部署。

有想换 hugo 的想法很久了，出怕麻烦的心理一直没有行动，总的来说还算成功， hugo 真的很快！

---

## 安装与启动
**Windows 安装步骤**
```
# 使用 Chocolatey,记得开管理员权限
choco install hugo-extended

# 或者直接下载：https://github.com/gohugoio/hugo/releases
```

**本地搭建 Hugo + Stack，熟悉结构**
```cmd
# 1. 创建新站点
hugo new site my-blog

# 2. 进入站点目录
cd my-blog

# 3. 初始化 Git 仓库
git init

# 4. 添加 Stack 主题作为子模块
git submodule add https://github.com/CaiJimmy/hugo-theme-stack/ themes/hugo-theme-stack

# 5. 复制示例配置
copy themes\hugo-theme-stack\exampleSite\hugo.yaml hugo.yaml
```

```PowerShell
# 创建文章目录，把测试文章放进去
mkdir -p content/post
```

```
# 启动本地服务器
hugo server -D
```

```
hugo server -D --baseURL http://localhost:1313/ --appendPort=false
```

## 基本设置
> 详情参考 [hugo官方文档](https://gohugo.io/)

```
baseurl = "http://用户名.github.io/"
languageCode = "zh-cn"
theme = "hugo-theme-stack"
title = ""
description = ""
copyright = "新喀鸦006"
DefaultContentLanguage = "zh-cn"
# 中文需要打开
hasCJKLanguage = true

[author]
name = 
homepage = ""

# 分页设置
[pagination]
pagerSize = 10

[permalinks]
post = "/p/:slug/"
page = "/:slug/"
```

## 主题配置
> 在 `hugo.toml` 中修改，下面的笔记也都是toml
>  [stack主题配置说明](https://stack.jimmycai.com/config/)
### 全站设置
`[Params]` 下的字段
```toml
[params]
# 首页和存档页面显示的内容
mainSections = [ "post" ]
# 获取页面的特色图片的 Front Matter 字段 
featuredImageField = "image"
# 将页面完整内容输出为 RSS
rssFullContent = true
# 网站图标路径
favicon = "favicon.png"
```

> [!note] 
> Hugo 在生成网站时，会将 `static`目录下的所有内容直接复制到网站的**根目录**下。

### 自定义菜单
该主题包含两个菜单：主菜单（ `menu.main` ）和社交菜单（ `menu.social` ，仅显示图标）。它们的配置方式类似。

如果该菜单是一个独立页面，建议直接在新建的 `content/media/index.md` 中添加 `menu` 字段
```yaml
menu: 
    main:
        name: title (optional)
        weight: -90
        params:
            icon: icon-name
```

如果该菜单不是页面建议修改 `hugo.toml`
```toml
[menu]
main = [ ]
  [[menu.social]]
  identifier = "github"
  name = "GitHub"
  url = "https://github.com/whiths600"
    [menu.social.params]
    icon = "brand-github"
```

主题附带了一些来自 [Tabler Icons](https://tabler-icons.io/) 的 SVG 图标。可以在主题文件夹的 `assets/icons` 下找到它们。加入更多图标，只需下载并放入 `assets/icons` 文件夹里。

### 日期格式
```toml
[params.dateFormat]
published = "Jan 02, 2006"
lastUpdated = "Jan 02, 2006 15:04 MST"
```

### 侧边栏
> 与左侧侧边栏相关的设置。

```toml
[params.sidebar]
emoji = ""
subtitle = "" # 网站标题下方
compact = false #侧边栏的精简版
  [params.sidebar.avatar]
  enabled = true
  local = true
  src = "avatar.png"
```


### 文章页

```toml
[params.article]
math = false
toc = true
readingTime = true
headingAnchor = true
  [params.article.license]
  enabled = true
  default = "Licensed under CC BY-NC-SA 4.0"
```

> `headingAnchor` 开启用 `#` 显示标题等级

### 评论
```
[params.comments]
enabled = true
provider = "disqus"
  [params.comments.disqusjs]
  [params.comments.utterances]
  issueTerm = "pathname"
  [params.comments.beaudar]
  issueTerm = "pathname"
  [params.comments.remark42]
  [params.comments.vssue]
  autoCreateIssue = false
  [params.comments.waline]
  emoji = [ "https://unpkg.com/@waline/emojis@1.0.1/weibo" ]
  requiredMeta = [ "name", "email", "url" ]

    [params.comments.waline.locale]
    admin = "Admin"
  [params.comments.twikoo]
  [params.comments.cactus]
  defaultHomeserverUrl = "https://matrix.cactus.chat:8448"
  serverName = "cactus.chat"
  siteName = ""
  [params.comments.giscus]
  reactionsEnabled = 1
  emitMetadata = 0
  [params.comments.gitalk]
  [params.comments.cusdis]
```

### 小工具
> 放置在博客的右侧边栏。它们用于显示一些信息，如分类、标签等。

```
[[params.widgets.homepage]]
type = "search"
[[params.widgets.homepage]]
type = "archives"
  [params.widgets.homepage.params]
  limit = 5
[[params.widgets.homepage]]
type = "categories"
  [params.widgets.homepage.params]
  limit = 10
[[params.widgets.homepage]]
type = "tag-cloud"
  [params.widgets.homepage.params]
  limit = 10
[[params.widgets.page]]
type = "toc"
```

> archives/search 页使用前需要创建，并设置元数据为：`layout: archives/search`

### 图像处理
> 主题使用 Hugo 内置的图像处理功能来调整和优化本地图像大小（包含页面捆绑功能）。

默认是开启的，如果速度很慢可以考虑关闭。
## 工作流
> 这个和本地的版本有一些差距可能会各种报错... 改了几个工具的版本才成功

创建 `.github/workflows/hugo.yml`
```
name: Deploy Hugo Blog to Pages
on:
  push:
    branches:
      - main
  workflow_dispatch:

# 设置 GitHub Pages 部署权限
permissions:
  contents: read
  pages: write
  id-token: write

# 避免并发部署
concurrency:
  group: "pages"
  cancel-in-progress: false

defaults:
  run:
    shell: bash

jobs:
  build:
    runs-on: ubuntu-latest
    env:
      HUGO_VERSION: 0.139.3
    steps:
      - name: Install Hugo CLI 
        run: |
          wget -O ${{ runner.temp }}/hugo.deb https://github.com/gohugoio/hugo/releases/download/v${HUGO_VERSION}/hugo_extended_${HUGO_VERSION}_linux-amd64.deb \
          && sudo dpkg -i ${{ runner.temp }}/hugo.deb
      
      - name: Checkout 
        uses: actions/checkout@v4
        with:
          submodules: recursive  # 拉取主题 submodule
          fetch-depth: 0

      - name: Setup Pages
        id: pages
        uses: actions/configure-pages@v4
      
      - name: Build with Hugo 
        env:
          HUGO_ENVIRONMENT: production
          HUGO_ENV: production
        run: |
          hugo \
            --gc \
            --minify \
            --baseURL "${{ steps.pages.outputs.base_url }}/"
      
      - name: Upload artifact 
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./public

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages 
        id: deployment
        uses: actions/deploy-pages@v4
```

创建`.gitignore`
```
# 忽略生成的静态网站目录
public/
resources/_gen/

# 忽略系统和编辑器生成的临时文件
.hugo_build.lock
.DS_Store
Thumbs.db
```

## GitHub 配置
新建一个仓库命名为 `用户名.github.io` （可选）
```
# 添加远程仓库
git remote add origin https://github.com/用户名/用户名.github.io.git
```
如果电脑保存过其它账号
```
git remote set-url origin https://用户名@github.com/用户名/用户名.github.io.git
```

**推送到 GitHub**
```
git add .

# 提交
git commit -m "Migrate from Hexo to Hugo with Stack theme"

git push -u origin main
```

进入 GitHub 仓库，点 **Settings** → **Pages**，**Source** 选择 "**GitHub Actions**"。

### 配置 Obsidian Enveloppe 插件（可选）
> 插件的作用是将指定笔记推送到 github 仓库

点击 github 头像里面的 [Settings](https://github.com/settings) - [Developer Settings](https://github.com/settings/apps)
选择 Token (classic)，创建一个 Personal Access Token (classic)，勾选 `repo` 权限。


下面是 [Envelope配置]({{< relref "Obsidian/Obsidian-Envelope-配置.md" >}})的部分。

**GitHub config** 

API Type：`Free/Pro/Team (default)` 
GitHub username：`用户名`
Repository name ：`用户名.github.io`
GitHub token：`Token`
Main branch：`main`
Automatically merge pull requests：`True`   *设置为 False 需要到仓库手动 merge*
Commit message：Publish blog post


**File paths**
File tree in repository：`Fixed folder`
Default folder ：`content/post`
Property key：`dir`


**Attachment & embeds**
Default attachment folder：`static/images`


## 问题解决
### git 推送
删除 `.git` 文件夹
```
git init
# 进入博客目录
cd /path/to/your/blog
# 为这个仓库设置用户名和邮箱
git config user.name "whiths600"
git config user.email "whiths600@email.com"

git remote add origin https://whiths600@github.com/whiths600/whiths600.github.io.git
```

```
git add .
git commit -m "backup"
git branch -M main
# 强制推送（会覆盖远程历史）
git push origin main --force
```
