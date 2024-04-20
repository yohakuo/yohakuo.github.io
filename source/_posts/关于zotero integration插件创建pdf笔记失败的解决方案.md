---
title: 关于zotero integration插件创建pdf笔记失败的解决方案
date: 2024-04-20
share: true
tags:
  - key_Obsidian
categories: 教程
archive: 
---
## 报错如图
![1.png|420](https://cdn.jsdelivr.net/gh/yohakuo/CDN/img/202404201738259.png)

 [参考的解决方案](https://github.com/mgmeyers/obsidian-zotero-integration/issues/58)
 
## 确认 pdf 在 zotero 文库中可以显示
这里是为了确认 zotero 是否识别到该文件，排查是否存在在 zotero 外给文件重命名了

## 修改文件标题
不要出现冒号、符号或撇号

## 修改 pdf 的格式
用Acrobat reader 修改成通用的 pdf 格式，比如PDF-X
>问题的提出者用 Adobe PDF file 格式覆盖原文件也成功了。
>我用的是 PDF-X

Acrobat reader -> 文件 - 另存为 -> 保存类型选 "PDF/X"

最后创建成功！