---
title: 为树莓派配置Python环境
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

树莓派如果想要成为一个合格的工控机，那么我们就需要配置基础Python环境来运行代码

树莓派OS是内置Python解释器的，我们就不用再下载Python了，这很方便

# 检查Python环境

新的系统**先更新apt源，并进行系统更新**

```bash
sudo apt update
sudo apt upgrade
```

**检查内置Python版本**

```bash
asumi@raspberrypi:~ $ python -V
Python 3.13.5
```

我这个内置的Python版本是**3.13.5**

# 创建虚拟环境（**！仅做展示，其实不用做**）

我们的每个项目最好配置一个虚拟环境，来隔离库之间的影响。接下来我会用python主程序来配置一个虚拟环境。这里你不用跟着做，因为正常来说我们会用VSCode直接进行配置，很方便，我这里知识做一个记录，并展示Python配置虚拟环境的基本步骤

好，接下来开始配置一个（我永远也用不到的）虚拟环境

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

这样就**成功创建虚拟环境了**

# python工程开发环境

一般来说，我们直接在代码编辑器（比如我用的VSCode）里直接创建和激活虚拟环境就好了，所以上面的只是展示，习惯上我们不会这样做

记下来会记录在树莓派上**配置VSCode（远程工作）**的过程

(总之，安装VSCode总没错。其实我还安装了**Pycharm**，但是实在是**太卡了**，不明白的也可以自己去试试有多卡~~（笑）~~，所以我决定就还是用VSCode好了)

我们的配置步骤主要分以下四步走：
1. **安装**VSCode
2. **登录**git/VSCode/github
3. 部署**ssh**
4. **在PC上配置环境**

## 1. 安装VSCode

在[官网](https://code.visualstudio.com/Download)下载VSCode适用于树莓派（aarch64/ARM64）的版本（**.deb**）

右键下载好的文件，使用**安装器安装**，然后VSCode就安装好了（是不是非常简单）

打开VSCode

![](/assets/images/2026-01-29-09-08-29.png)

然后可以在**左下角登录**，接下来这个VSCode就可以按你喜欢的来配置了，**就像PC一样**

![](/assets/images/2026-01-29-09-09-43.png)

至此，**VSCode安装完成**

## 2. 检查git

这一步不是必须，不过考虑到后期可能会频繁**使用github**，就还是先配置好比较好

检查git版本

```bash
git -version
```

如果没有安装，就**先安装**

```bash
sudo apt-get install git
```

git全局设置，在xxxx位置填上自己的账户名称和注册邮箱

```bash
git config --global user.name "xxxx"
git config --global user.email "xxxx@xxxx.xxxxx"
```

然后接下来就是**按照Github上**的指引操作，可以**新建一个仓库**，然后在新建的页面会**给出相应的代码**

在你想要创建仓库的项目里面**打开终端**（cd到指定目录），然后复制和执行代码内容，就成功初始化这个仓库了，接下来也可以继续方便地维护

如果想切换到ssh模式也可以，我会在另一篇博客中记录相关操作

至此，git和github的配置工作基本完成

## 3. 部署ssh

这一部分我就不过多赘述，相关内容可以参考我写的另一篇文章。放心，这两篇文章是可以完美融合的，所以不用担心看了这个忘了那个

最终结果就是，**使用终端连接树莓派**可以**不用再次输入密码**，例如：

```bash
C:\Users\Eganchi>ssh asumi@192.168.2.121
Linux raspberrypi 6.12.62+rpt-rpi-v8 #1 SMP PREEMPT Debian 1:6.12.62-1+rpt1 (2025-12-18) aarch64

The programs included with the Debian GNU/Linux system are free software;
the exact distribution terms for each program are described in the
individual files in /usr/share/doc/*/copyright.

Debian GNU/Linux comes with ABSOLUTELY NO WARRANTY, to the extent
permitted by applicable law.
Last login: Wed Jan 28 10:59:00 2026 from 192.168.2.21
asumi@raspberrypi:~ $
```

就这样就能轻松连接到它的shell了

## 4. 在PC上配置环境（注意，接下来全程在你的电脑上操作，不用动树莓派一点）

打开你的PC上的VSCode，**安装一个插件（包）**，名字叫做`Remote Development`

这个官方的插件包包含了4个常用组件，直接下载安装就行

然后等安装完成，会出现一个新的图标

![](/assets/images/2026-01-29-09-21-31.png)

啊对就是这个，然后点进去，会有一个**ssh**的选项。我因为已经部署过了所以有内容，刚开始用是空的

![](/assets/images/2026-01-29-09-22-29.png)

点击右上方的加号**新建远程**，输入你**连接树莓派的ssh代码**，比如我上面的那个

```bash
ssh asumi@192.168.2.121
```

然后就成功连上了，是不是很简单？第一次会要求进行一些个配置，就按情况配置就好了。选个Linux

等待初始化完成，你现在这个VSCode就可以自己理解为“**完全跑在树莓派上了**”（但其实不是）

接下来就一切**当做正常VSCode使用**。我们接下来要配置Python解释器

---

可以先新建一个代码文件来做测试

随便打开一个你的本地文件夹，新建文件hello_world.py，内容大致如下：

```python
import cv2  #我这里有一个模块引用是为了测试虚拟环境的模块功能

print("Hello World from Asumi!")
```

然后去安装VSCode的**Python插件**

![](/assets/images/2026-01-29-09-27-30.png)

安装完成回到你的代码，在左下角有一些配置：

![](/assets/images/2026-01-29-09-29-03.png)

对就是这个红色的框（再次说明，我是已经配置过了所以有东西，你要自己配置）

点进去以后在窗口上面会出现配置界面，选择那个**推荐的项目**

![](/assets/images/2026-01-29-09-30-24.png)

然后再进入，选择**创建虚拟环境**（就是上面那个选项），然后创建venv或者conda都行，我创建的venv所以我不知道conda的事（转过头去）

然后打开这个“终端”，就进入了真的终端，并且虚拟环境也是对的（应该是会进入bash，你运行了程序以后就会显示程序终端）

![](/assets/images/2026-01-29-09-59-11.png)

可以在这里进行pip3的**安装模块**，比如我就是安装了opencv-python来测试插件功能（结果是完美的）

最后，点击**右上方的运行**，就可以看到程序的输出，配置环节完全完成！

# 结语

至此，我们的树莓派成为了一个**合格的工程机**，可以**运行和调试代码**，可以**远程**调试代码，可以**使用github**进行代码同步

那么这篇博客也就**到此为止**了，接下来我会记录ssh的配置过程，如果**对大家有用的话那就最好了**

**接下来也请多多指教！**

![](/assets/images/2026-01-29-09-38-55.png)