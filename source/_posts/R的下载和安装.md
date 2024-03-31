---
title: R的下载和安装
date: 2024-03-31
updated: 
share: true
tags: []
categories: 教程
excerpt: 
published: 
---
## 参考资料
>R 语言编程：基于 tidyverse

## 下载 R 和 RStudio
> https://mirrors.bfsu.edu.cn/CRAN/
> https://www.rstudio.com/products/rstudio/download

### R 安装设置
- 安装到 D 盘，不要有中文路径，且路径不要有空格，下载最新版本
- 建议取消勾选 “Message translations”（英文报错更容易搜索解决办  
法）

###  RStudio 软件设置
- 切换安装包的国内镜像源（任选其一），以保证正常安装 R 包：  
	Tools -> Global Options… -> Options -> Packages，点击  
	Change 修改为，比如 Beijing Foreign Studies University
- 设置保存文件的默认编码方式为 UTF-8, 已保证保存出来的各种 R 文件，都将采用 UTF-8 编码：
	Tools -> Global Options… -> code -> Saving，在  
	Default text encoding 框，点 change，修改为 UTF-8
- 勾选 Code -> Display 下的 Rainbow parentheses 框，这样代码中的配对括号将用不同彩虹色匹配；
- 设置 General -> Workspace 取消勾选 Restore .RData into workspace at startup, 并将其下的 save workspace to .RData on exit: 改为 Never. 避免每次打开 RStudio 都加载以前数据。

## R 包
>踩了大坑

- 来自官方 CRAN 的 R 包
	直接使用命令安装，将自动安装依赖包 
```
install.packages("openxlsx")
```

- Github 也是 R 包的较大的来源，手动下载
	- 打开 [github上的库)](https://github.com/tidyverse/dplyr)
	- clone 或者下载 zip 到本地并解压（记录地址）
	- 运行命令
```
install.packages("你的包地址", repos = NULL, type = "source")
```


## 包的相关操作
- 加载包
```
library(openxlsx)
```

- 更新包
```
update.packages("openxlsx")
update.packages() # 更新所有包
```

- 删除包
```
remove.packages("openxlsx")
```

## 绝对路径与相对路径
- 绝对路径
	从盘符开始的完整路径，比如 E:/R 语言/data/a123.csv

- 相对路径
	指相对于当前路径的路径。
	
	比如，当前文件夹 E:/R 语言中有 data 文件夹，里面有数据文件a123.csv，要写能访问到它的路径，只需写 data/a123.csv

- 获取或设置当前路径
```
getwd()
setwd("D:/R-4.1.1/tests")
```
>注意：R 路径中的` \` 必须用` /` 或 `\\` 代替


## R 项目
- R 脚本是单个可执行的 R 代码文件，后缀名为. R，单击 New File按钮，选择 R Script，或使用快捷键 Ctrl + Shift + N, 则新建R 脚本；
- R 项目是完成某个项目或任务的一系列文件的合集（文件夹），包括数据文件、若干 R 脚本及其他附件，其中包含一个 *.Rproj 文件；
- 建议使用 R 项目 + 相对路径，这样能方便系统地管理服务于共同目的一系列的文件，可以方便移动位置甚至是移到其他电脑，而不需要做任何有关路径的代码修改就能成功运行。