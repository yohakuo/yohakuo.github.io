---
title: 自动化工作流聚合信息初尝试（n8n,telegram）
date: 2025-08-15T19:51:00
updated: 2025-08-18
share: "true"
tags:
  - Method
categories: 六分经验
archive:
---
 [参考](https://reorx.com/blog/sharing-my-footprints-automation/)

本文在 `简单工作流的搭建` 搭建了最简单的工作流（存在缺陷）。如果想要动手尝试，先到[快速启动](<#快速启动>) 下载必要引擎，然后可以直接跳到 `使用已有的工作流`。

n8n 版本： `1.106.3`

## 快速启动
下载 [Docker Desktop](https://www.docker.com/products/docker-desktop/)

测试模式，不要关闭终端
```PowerShell
docker run -it --rm --name n8n -p 5678:5678 -e "HTTP_PROXY=http://127.0.0.1:7890" -e "HTTPS_PROXY=http://127.0.0.1:7890" -v ~/.n8n:/home/node/.n8n n8nio/n8n
```

稳定版
```PowerShell
docker run -d --name n8n -p 5678:5678 -e "HTTP_PROXY=http://127.0.0.1:7890" -e "HTTPS_PROXY=http://127.0.0.1:7890" -v ~/.n8n:/home/node/.n8n -v ~/.n8n_database:/database n8nio/n8n
```

如果想稳定代理的话应该考虑[在本地存储代理信息](<#本地代理设置>)，这样删容器代理不受影响。

**然后初始化 n8n** 。访问 `http://localhost:5678` 进行注册，需要邮箱验证。

## 简单工作流的搭建
### 创建 Telegram Bot 并连接到 n8n
*这个部分的群组可以不创建，我目前把这个群组作为 log。*

**创建一个 Telegram Bot**
- 打开 Telegram 客户端，在搜索框里搜索 `@BotFather` (注意核对官方认证的蓝色√图标)，然后点进去开始聊天。
- 发送 `/newbot` 给 BotFather。
- 给机器人起名字以及用户名 (username，后面查找机器人用)，这个必须以 `bot` 结尾。
- 创建成功后，BotFather 会给你一长串**API Token**。**请立即复制并保存好这个 Token**。

**创建一个用于接收信息的频道 (Channel)**
- 在 Telegram 里，创建一个新的**频道**。给它起个名字。
- 重要：将频道类型设置为**私有**。
- 然后把刚刚创建的机器人**添加到这个频道作为管理员，设置权限**。

完成到这里可以跳到[ 使用已有的工作流](<#使用已有的工作流>)

**创建并获取群组的 Chat ID**（选做）
- 将你刚刚创建的机器人临时添加到一个普通的群组里，并且打开权限，然后在这个群组里随便发一条消息。
- 打开浏览器，访问以下网址 :
    `https://api.telegram.org/bot{YOUR_BOT_TOKEN}/getUpdates`
- 你会看到一些 JSON 格式的文字。找到 `chat` 部分，里面有一个 `id`，它通常是一个以 `-100` 开头的数字，请复制并保存好它。

**在 n8n 中配置 Telegram**（选做）
- 打开 n8n 界面 (`http://localhost:5678`)。
- 点击 "Add workflow" 创建一个新工作流。
- 点击屏幕中央的 `+` 号，在搜索框里输入 `Telegram`，然后选择在 `action` 里面找到 `send message`。
- 在右侧的配置栏中：
    - **Credential for Telegram API**: 点击 "Create New"。
        - **Credential Name**: 随便起个名字。
        - **Access Token**: 粘贴你从 BotFather 那里得到的 **API Token**。
        - 点击 "Save"。
    - **Chat ID**: 粘贴你刚刚获取的以 `-100` 开头的**频道 Chat ID**。
    - **Text**: 输入 `Hello from n8n!`。
- 点击节点下方的 **"Execute node"** 按钮。

### 添加第一个信息源 - RSS（选做）
从最简单的 RSS 开始，订阅一个你喜欢的博客。
**1. 找到 RSS 链接**
**2. 在 n8n 中配置 RSS 工作流**
- 点击 `+` 号，添加一个 `Schedule` 节点。在弹出的配置中，可以设置每小时 (Every Hour)、每天 (Every Day) 等。
- 点击 `Schedule` 节点右侧的 `+` 号上，在弹出的搜索框里输入 `RSS`，选择 `RSS Read ` 节点，配置 URL 即可。
  
> [!note]
> 这里可能会遇到网站有安全设置，可以试试这个 [RSS 转换](https://rss.app/)，登录之后把博客主页地址输入，生成 RSS

-  `RSS Read` 连接到我们之前创建的 `Telegram` 节点。
- 然后需要修改 `Telegram` 节点的 `Text` 内容，让它发送 RSS 的标题和链接。
    - 在 `Text` 输入框右边，点击 **"Add Expression"**。
    - 在表达式输入框里输入：
```
标题：{{ $json.title }}

链接：{{ $json.link }}
```
- 返回主界面点击右下角的 **"Execute workflow"** 按钮来测试整个流程。运行成功你会在 telegram 群聊看到推送的 10 条新消息（默认情况）。


这个基础简单的工作流如下图。功能是每 5 分钟自动检查指定网站是否有新文章发布，并将所有新文章的标题和链接，逐条发送到指定 Telegram 频道。如果重复执行会发现每次都会发送 10 条信息，如果在推送前进行比对可以在 RSS 后加一个 function 模块。
![image.png|520](https://cdn.jsdelivr.net/gh/yohakuo/CDN/img/202508141104258.png)

可以重复这个流程来订阅其它 RSS ，但不要忘记以上步骤是在一个测试群聊里进行的，如果想要把信息送到频道，需要把上面配置的 `Chat ID` 修改为频道 id，这里使用一个简单的方法获得 id：
- 在 Telegram 里，搜索并关注一个叫做 **`@userinfobot`** 的机器人，或点击[链接](https://t.me/userinfobot)。
- 进入接收消息的那个频道，并**转发**任意一条消息，发送给刚刚那个 `@userinfobot`。
- `@userinfobot` 会立刻回复你一条信息，找到 **Id** 后面跟着的那个以 `-100` 开头的数字，即你频道的**唯一 ID**。

> [!note]
> 有好奇心的朋友可能会用这个机器人来试一试之前那个群聊的 id，你会发现这个得到的 id 并不是-100 开头的那个 id 了。
> 
> 这是因为 Telegram 建群时默认的类型是普通群组（功能有限），而-100 开头的是拥有更强大的功能的超级群组。为了让 n8n 就能稳定地发送消息， Chat ID 需要用 `-100` 开头的。私人频道可以满足个人信息聚合的要求。如果想把信息发到一个群里和朋友分享，可以自行搜索手动将那个群升级。

## 使用已有的工作流
当然，如果也可以直接使用别人的成果-- [reorx的工作流合集](https://github.com/reorx/n8n-workflows/tree/master/workflows)，博主有简单说明逻辑。

以 RSS 的工作流为例，先进入[仓库](https://github.com/reorx/n8n-workflows/blob/master/workflows/blog%20rss%20to%20tg.json)，复制 json 文件。回到 n8n 后台新建工作流，直接粘贴。然后修改 RSS 的链接，以及 telegram 的 chatid 。最后点击执行工作流测试一下是否连通。如果没问题的话，会在频道收到一条最新的推文。

**chatid 的获取**
- 在 Telegram 里，搜索并关注一个叫做 **`@userinfobot`** 的机器人，或点击[链接](https://t.me/userinfobot)。
- 进入接收消息的那个频道，并**转发**任意一条消息，发送给刚刚那个 `@userinfobot`。
- `@userinfobot` 会立刻回复你一条信息，找到 **Id** 后面跟着的那个以 `-100` 开头的数字，即你频道的**唯一 ID**。


## 进阶玩法-订阅多个 RSS
*从头搭建一个工作流来处理多个 RSS 源。*

####  `Code` 节点（订阅管理）
```
const myRssFeeds = [
  { name: "douchi", url: "https://rss.app/feeds/hZVUbnIx3yBAbKMU.xml" },
  { name: "yukieyun", url: "https://yukieyun.net/index.xml" },
  { name: "thirdshire", url: "https://thirdshire.com/index.xml" },
  { name: "yitaoli", url: "https://yitaoli2023.github.io/yitaoli/index.xml" },
  { name: "bamboobone9", url: "https://bamboobone9.com/index.xml" },
  { name: "pursuitus", url: "https://blog.pursuitus.com/feed" },
  { name: "wraith615", url: "https://blog.wraith615.xyz/rss.xml" },
  { name: "gigigatgat", url: "https://www.gigigatgat.ca/index.xml" },
  { name: "ignativssss", url: "https://ignativssss.github.io//index.xml" },
  { name: "asyncx", url: "https://blog.asyncx.top/zh.xml" },
  { name: "birds", url: "https://moresci.sale/@birds.rss" },
  { name: "shyrz", url: "https://shyrz.me/rss/" },
  { name: "douchiBook", url: "https://bamboobone9.com/index.xml" },
  { name: "ruanyifeng", url: "https://feeds.feedburner.com/ruanyifeng" },
  { name: "decohack", url: "https://decohack.com/feed/" }
 
];

return myRssFeeds.map(feed => ({
  json: {
    feedName: feed.name,
    feedUrl: feed.url
  }
}));
```
#### `RSS Read` 节点
`Feed URL` ： `{{ $json.feedUrl }}`
#### `Code` 节点（剪切）
只保留最新 `3（n）` 条，不确定是否能提高效率。
```
const items = $input.all();

items.sort((a, b) => {
  const dateA = new Date(a.json.pubDate || 0).getTime();
  const dateB = new Date(b.json.pubDate || 0).getTime();
  return dateB - dateA;
});

return items.slice(0, 3);
```
####  `Edit Fields (Set)` 节点
- 点击 `Add Value` (添加值)。
- **`Name` (名称)**: 输入 `feedName`
- **`Value` (值)**: 输入下面的表达式。
```
{{ $('list').item.json.feedName }}
```
并打开最下面的一个开关-- `Include Other Input Fields。`

在 `RSS Read` 抓取完文章后，`Set` 节点会把 `feedName` 附加到每一篇文章数据上。


#### `Code` 节点（精选最新）
在所有新文章里，每个来源只挑出最新的一篇。

```
{% raw %}
const items = $input.all();
const latestByFeed = {}; // 用对象保存每个源的最新文章

for (const item of items) {
  const feed = item.json.feedName || 'unknown';
  const pubDate = item.json.pubDate ? new Date(item.json.pubDate).getTime() : 0;

  if (!latestByFeed[feed]) {
    latestByFeed[feed] = item;
  } else {
    const existingDate = latestByFeed[feed].json.pubDate ? new Date(latestByFeed[feed].json.pubDate).getTime() : 0;
    if (pubDate > existingDate) {
      latestByFeed[feed] = item;
    }
  }
}

// 把对象里的结果转成数组返回
return Object.values(latestByFeed);
{% endraw %}
```

#### `Remove Duplicates` 节点
防止文章重复。
`operation`：`Remove Items Processed in Previous Executions`
`value` ： `{{ $json.guid || $json.link }} `
#### `Send a text message`（Telegram）
```
📝{{$json["title"]}} #blog 

{{$json["link"]}}
```

解析模式为 **`HTML`**。

## 工作流问题
> 第三方服务不能成功
### 本地代理设置
报错 `The service refused the connection - perhaps it is offline`

检查容器代理情况
```PowerShell
docker inspect n8n | Select-String -Pattern "PROXY"
```

输出是走代理的，核心问题是 **`127.0.0.1:7890` 在容器里访问不到宿主机代理**，最后修改了一下启动命令可以成功。
```PowerShell
docker run -d --name n8n -p 5678:5678 -e "HTTP_PROXY=http://host.docker.internal:7890" -e "HTTPS_PROXY=http://host.docker.internal:7890" -v ~/.n8n:/home/node/.n8n -v ~/.n8n_database:/database n8nio/n8n
```

为了不再出这个问题，删了容器重新在本地直接存下配置，`"C:\n8n-data\docker-compose.yml"`
```
version: "3.8" 
services:
  n8n:
    image: n8nio/n8n
    container_name: n8n
    ports:
      - "5678:5678"
    environment:
      # 代理配置（写死）
      HTTP_PROXY: http://host.docker.internal:7890
      HTTPS_PROXY: http://host.docker.internal:7890
      NO_PROXY: localhost,127.0.0.1
    volumes:
      # 数据卷（写死路径，防止丢配置）
      - ./n8n_data:/home/node/.n8n
      - ./n8n_database:/database
    restart: unless-stopped
```

然后进入文件夹创建数据卷
```
docker compose up -d
```

- **启动**
    `docker compose up -d`
- **停止**
    `docker compose down`
- **查看日志**
    `docker compose logs -f`
- **更新**
	`docker-compose pull`
	`docker-compose down`
	`docker-compose up -d`


