---
title: Latex如何插入图片
date: 2024-03-26
updated: 2024-03-27
share: true
tags:
  - key_LaTeX
categories: 教程
---
## 图片的插入
### 控制
```
\FloatBarrier  #在图片后放置防止浮动

%%去掉子标题的标号（a）...  放在导言区域
\makeatletter
\renewcommand{\@thesubfigure}{\hskip\subfiglabelskip}
\makeatother
```
### 单图
```
\begin{figure}[htp]
	\centering
	\includegraphics[width=0.5\linewidth]{fig/15.png}
	\caption{}
\end{figure}
```
### 两图
%\usepackage{caption}
%\usepackage{subfigure}
%导言区域要添加以上两个包
```
\begin{figure}[htbp]
\centering  %居中
\subfigure[ ]{   %第一张子图
\begin{minipage}{7cm}
\centering    %子图居中
\includegraphics[scale=0.2]{fig/11.png}  
\end{minipage}
}
\subfigure[ ]{ %第二张子图
\begin{minipage}{7cm}
\centering    %子图居中
\includegraphics[scale=0.2]{fig/12.png}
\end{minipage}
}
\caption{}    %大图名称
\end{figure}
```
### 三图
```
\begin{figure}[htbp]
    \centering  %居中
    \subfigure[ ]{   %第一张子图
    \begin{minipage}{7cm}
    \centering    %子图居中
    \includegraphics[scale=0.2]{fig/21.png} 
    \end{minipage}
    }
    \subfigure[ ]{ %第二张子图
    \begin{minipage}{7cm}
    \centering    %子图居中
    \includegraphics[scale=0.2]{fig/22.png}
    \end{minipage}
    }
    \centering
    \includegraphics[width=0.5\linewidth]{fig/23.png}
    \label{fig:10}
    \caption{}    %大图名称
    \end{figure}
```
### 四图
```
\begin{figure}[htbp]
    \centering
    \subfigure[ ]{
        \includegraphics[width=2.5in]{fig/6.png}
    }
    \subfigure[ ]{
	\includegraphics[width=2.5in]{fig/7.png}
    }
    \quad    %用 \quad 来换行
    \subfigure[ ]{
    	\includegraphics[width=2.5in]{fig/8.png}
    }
    \subfigure[ ]{
	\includegraphics[width=2.5in]{fig/9.png}
    }
    \caption{MME，SGW，PGW的容量}
    \label{fig.1}
\end{figure}
```
### 五图
```
\begin{figure}[htbp]
    \centering
    \subfigure[ ]{
        \includegraphics[width=2.5in]{fig/16.png}
    }
    \subfigure[ ]{
	\includegraphics[width=2.5in]{fig/17.png}
    }
    \quad    %用 \quad 来换行
    \subfigure[ ]{
    	\includegraphics[width=2.5in]{fig/18.png}
    }
    \subfigure[ ]{
	\includegraphics[width=2.5in]{fig/19.png}
    }
    \centering
	\includegraphics[width=0.4\linewidth]{fig/20.png}
	\caption{}
\end{figure}
\FloatBarrier
```


