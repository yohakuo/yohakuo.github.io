---
layout: 
title: 
date: 
updated: 
share: true
comments: 
tags: 
categories: 
permalink: 
excerpt: 
published: 
---

##  pose配置

| 参数              | 描述                                         | 默认值                                                       |
| --------------- | ------------------------------------------ | --------------------------------------------------------- |
| layout          | 布局                                         | config.default_layout                                     |
| title           | 标题                                         | 文章的文件名                                                    |
| date            | 建立日期                                       | 文件建立日期                                                    |
| updated         | 更新日期                                       | 文件更新日期                                                    |
| comments        | 开启文章的评论功能                                  | true                                                      |
| tags            | 标签（不适用于分页）                                 |                                                           |
| categories      | 分类（不适用于分页）                                 |                                                           |
| hide            | 不在首页和其他归档分类页里展示                            |                                                           |
| archive         | 让文章在首页隐藏，但仍**需要在归档分类页里展示**                 |                                                           |
| excerpt         | 纯文本的页面摘要。使用该插件来格式化文本                       |                                                           |
| lang            | 设置语言以覆盖自动检测                                | 继承自 _config.yml                                           |
| published       | 文章是否发布                                     | 对于 _posts 下的文章为 true，对于 _draft 下的文章为 false                |
| sticky          | 置顶                                         | true                                                      |
| share           | ob 内设置文章是否发布                               |                                                           |
| permalink       | 覆盖文章的永久链接，永久链接应该以 / 或 .html 结尾             | null                                                      |
| disableNunjucks | 启用时禁用 Nunjucks 标签 {{ }}/ /{% %} 和标签插件的渲染功能 | false                                                     |
| index_img       | 文章在首页的封面图                                  | /img/example. jpg \|对应的是存放在 /source/img/example.jpg目录下的图片 |
| post.banner_img | 文章页顶部大图                                    |                                                           |


