---
title: Typst初了解
date: 2024-04-05
updated: 
share: true
tags:
  - 摘抄_Typst
categories: 教程
---
# 安装
- 非常简单，在 Vscode 下载两个拓展 `Typst LSP` 和`Typst Preview`
- 然后创建 `.typ` 文件即可开始
- 快捷键 `ctrl+k` `v` 进行预览

# 文档
- 非官方的中文[教程](https://typst-doc-cn.github.io/docs/tutorial/)
- 官方[教程](https://typst.app/docs/)

### 数学
>  基本用法和 ob 中简化的 markdown 很相似

-  [数学语法](https://typst-doc-cn.github.io/docs/reference/math/)
-  [符号部分](https://typst-doc-cn.github.io/docs/reference/symbols/sym/) （比如箭头） 

公式与周围的文本默认在同一行上。
如果想让它新起一行，要在在其开头和结尾插入一个空格
```
$ Q = rho A v + C $
```


 数学模式将始终原样地显示单个字母。要隐式地表明这是单个字母之间的乘法，请在它们之间加入空格。
 
 多个字母将被视作为符号、变量或函数名称。用 `""` 包起来
```
Q = rho A v + "time offset"
```
 
# 格式
>一个 语法糖
>
>任何 `fn(...)[XXX][YYY][ZZZ]`，都会被自动转成 `fn(..., [XXX], [YYY], [ZZZ])`


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

## Show 规则
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
> 然后，我们编写一个函数，该函数将应显示的内容作为参数输入，在这里，我们称该参数为 `name`。我们现在可以使用函数体中的 `name` 变量来输出名称 `ArtosFlow`。
> 
>  Show 规则在名称前面添加 Logo 图像，并将结果放入 `box` 中，以防止 Logo 和名称之间出现换行符。 图像也放在一个 `box` 中，这样它就不会出现在自己的段落中。

# 在线处理
- [在线编辑器](https://typst.app/)
- [模板社区](https://typst.app/universe/search?kind=templates)