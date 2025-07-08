---
title: Typst初了解
date: 2024-04-05
updated: 2025-06-03
share: true
tags:
  - Typst
categories: 教程
---
# 安装
- 非常简单，在 Vscode 下载拓展 `Tinymist Typst`  和  `vscode-pdf` <用来显示pdf>
- 然后创建 `.typ` 文件即可开始
- 快捷键 `ctrl+k` `v` 进行预览

# 相关资源
- [非官方的中文教程](https://typst-doc-cn.github.io/docs/tutorial/)
- [官方教程](https://typst.app/docs/)
- [在线编辑器](https://typst.app/)
- [模板社区](https://typst.app/universe/search?kind=templates)

# 如何制作一个模板
## 自定义函数
```
#let amazed(term) = box[✨ #term ✨]

You are #amazed[beautiful]!
```
>![](https://typst-doc-cn.github.io/assets/docs/f55a5389282e58c6cefb7ae2329cc761.png)

函数名是 amazed，输入参数为 term，box 的作用是让 `term` 与它的火花不会换行符分开。

也可以给自定义函数添加参数。
注意添加的颜色参数需要一个默认输入，以防使用时没有给参数。
```
#let amazed(term, color: blue) = {
  text(color, box[✨ #term ✨])
}

You are #amazed[beautiful]!
I am #amazed(color: purple)[amazed]!
```


## Show 规则
>Show 规则可以将自定义函数应用于整个文档。
```
#show: amazed
I choose to focus on the good
in my life and let go of any
negative thoughts or beliefs.
In fact, I am amazing!
```


>附上项目的 logo
```
#show "ArtosFlow": name => box[
  #box(image(
    "logo.svg",
    height: 0.7em,
  ))
  #name
]

This report is embedded in the
ArtosFlow project. ArtosFlow is a
project of the Artos Institute.
```

> `show` 关键字，后面跟着我们希望以不同方式显示的文本字符串，以及一个冒号。
> 
> 然后，我们编写一个函数，该函数将应显示的内容作为参数输入，在这里，我们称该参数为 `name`。我们现在可以使用函数体中的 `name` 变量来输出名称 `ArtosFlow`。
> 
>  Show 规则在名称前面添加 Logo 图像，并将结果放入 `box` 中，以防止 Logo 和名称之间出现换行符。图像也放在一个 `box` 中，这样它就不会出现在自己的段落中。

## 嵌入的 Set 和 Show 规则

要将一些 Set 和 Show 规则应用于我们的模板，我们可以在函数的内容块中使用 `set` 和 `show`，然后将文档插入到该内容块中。

```
#let template(doc) = [
  #set text(font: "Inria Serif")
  #show "something cool": [Typst]
  #doc
]

#show: template
I am learning something cool today.
It's going great so far!
```

在 template 函数里嵌入 Set 和 Show 规则。
Show 规则将我们的整个文档传递给 `template` 函数， 因此模板中的 `text` Set 规则和字符串 Show 规则将应用于整个文档。

##  set 规则
 >可以将样式属性应用于某类内容块的所有实例
 
 输入 `set` 关键字编写 Set 规则，后面是要设置属性的函数的名称，括号是需要的新默认参数列表。
```
#set par(justify: true)

= Background
In the case of glaciers, fluid
dynamics principles can be used
to understand how the movement
and behavior of the ice is
influenced by factors such as
temperature, pressure, and the
presence of other fluids (such as
water).
```

 Set 规则中常用的一些函数的列表
- [`text`](https://typst-doc-cn.github.io/docs/reference/text/text/) 用于设置文本的字体、大小、颜色和其他属性
- [`page`](https://typst-doc-cn.github.io/docs/reference/layout/page/) 用于设置页面大小、边距、页眉、启用栏和页脚
- [`par`](https://typst-doc-cn.github.io/docs/reference/model/par/) 用于对齐段落、设置行距等
- [`heading`](https://typst-doc-cn.github.io/docs/reference/model/heading/) 用于设置标题的外观与启用编号
- [`document`](https://typst-doc-cn.github.io/docs/reference/model/document/) 用于设置 PDF 输出中包含的元数据，例如标题和作者

### 一个示例
>更大的边距和衬线字体

```
#set text(
  font: "New Computer Modern",
  size: 10pt
)
#set page(
  paper: "a6",
  margin: (x: 1.8cm, y: 1.5cm),
)
#set par(
  justify: true,
  leading: 0.52em,
)

= Introduction
In this report, we will explore the
various factors that influence fluid
dynamics in glaciers and how they
contribute to the formation and
behavior of these natural structures.

...

#align(center + bottom)[
  #image("glacier.jpg", width: 70%)

  *Glaciers form an important
  part of the earth's climate
  system.*
]
```

-  [`text`](https://typst-doc-cn.github.io/docs/reference/text/text/) 的 Set 规则。将字体大小设置为 `10pt`，将字体设置为 `"New Computer Modern"`。

-  [`page`](https://typst-doc-cn.github.io/docs/reference/layout/page/) 的 Set 规则，它接收两个参数：页面大小和页面边距。

- 行距：它被指定为 [length](https://typst-doc-cn.github.io/docs/reference/layout/length/) 值，使用 `em` 单位来指定相对于字体大小的行距，`1em` 相当于当前字体大小（默认为 `11pt`）。

### 对标题进行编号
```
#set heading(numbering: "1.")

= Introduction
#lorem(10)

== Background
#lorem(12)

== Methods
#lorem(15)
```

>指定了字符串 `"1."` 作为编号参数。这将告诉 Typst 用阿拉伯数字对标题进行编号，并在每个级别的编号之间放置一个点。

```
#set heading(numbering: "1.a")

= Introduction
#lorem(10)

== Background
#lorem(12)

== Methods
#lorem(15)
```

>1. a
>1. b

