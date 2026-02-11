---
title: "Callout 功能测试"
description: "测试 Obsidian 风格的可折叠 Callout"
slug: callout-test
date: 2026-02-11
categories:
  - 测试
tags:
  - callout
  - obsidian
  - markdown
draft: true
---

> [!example]- 使用方法
> {{< details "点击展开查看代码" >}}
> 这里是隐藏的内容。
> 可以包含代码块、图片等。
>  {{< /details >}}

<details>
<summary>代码</summary>

```
.highlight {
    background-color: var (--pre-background-color);
    padding: var (--card-padding);
    position: relative;
    border-radius: 10px;
    max-width: 100% !important;
    margin: 0 !important;
    box-shadow: var (--shadow-l1) !important;

```

</details>


> [!example]- 代码
> ```html
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




