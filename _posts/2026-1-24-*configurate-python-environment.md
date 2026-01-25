---
title: 为树莓派配置Python环境（未完工）
excerpt: 树莓派配置记录

categories: 
  -  树莓派

tags:
  -  博客
  -  记录
comments: true
entries_layout: grid

# header:
#     teaser: 

---

# 前言

树莓派作为工控机，需要基础Python环境来运行代码

树莓派OS是内置Python解释器的，基于此我们可以配置**方便运行的环境**

# 创建Python虚拟环境

新的系统建议**先更新apt源，并进行系统更新**

```bash
sudo apt update
sudo apt upgrade
```

**检查内置Python版本**

```bash
asumi@raspberrypi:~ $ python -V
Python 3.13.5
```

我这个内置的Python版本是3.13.5

在合适的位置创建一个文件夹

![](/assets/images/2026-01-23-20-53-45.png)

在bash中输入命令（`/path/to/venv`替换为自己的路径，我的路径是/home/asumi/python/venv）

这个文件夹的名字`venv`可以起个自己喜欢的，比如`Nishiki`之类的，然后这个虚拟环境的名字就会是`Nishiki`

```bash
python3 -m venv /path/to/venv
```

激活并**进入虚拟环境**

先cd到/path/to/env，或者使用绝对路径

```bash
asumi@raspberrypi:~ $ cd /home/asumi/python/venv/bin
asumi@raspberrypi:~/python/venv/bin $ source activate
(venv) asumi@raspberrypi:~/python/venv/bin $


asumi@raspberrypi:~ $ source /home/asumi/python/venv/bin/activate
(venv) asumi@raspberrypi:~ $
```

这样就成功创建虚拟环境了

# python工程开发环境

未完工...