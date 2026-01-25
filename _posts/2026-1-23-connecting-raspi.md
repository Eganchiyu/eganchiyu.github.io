---
title: 安装树莓派OS并配置编程环境
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

工创基地的学长给我们（两个）软件组的新人发了两块开发板，于是我拿走了树莓派4B8G

寒假期间，要安装系统，配置好开发环境

# 安装树莓派OS

## TF卡的选择
首先，树莓派是没有内置的存储器的，所以需要安装一块TF卡来做ROM。

从而，TF卡的性能越好，系统就越流畅。

但是好的TF卡都实在是太贵了<span title = "你知道的太多了" class = "heimu">（虽然说工创基地可以给报销吧...）</span>

于是我就先在家里找以前闲置的TF卡

但是我只找到了3张1G，1张8G（憋笑）

我先用那张8G的刷了个系统，尝试开机，发现卡成PPT，几乎不能用

正当我打算买张几百的卡的时候，我妈和我讲，以前的监控里面好像有闲置的TF卡

所以我拆开来一看，好家伙，一张128G的TF卡躺在里面

于是我直接拿来格式化刷写系统。虽然说效果不是完美吧，不过也大概够用了

* 所以说，一张足够大、读写速度足够快的TF卡是树莓派性能表现的关键因素

## 软件下载 RaspBerry pi Imager

选用官方系统盘制作软件 [Raspberry Pi Imager](https://www.raspberrypi.com/software/)

![](/assets/images/2026-01-23-18-12-33.png)

这个软件的功能包括：
1. 将TF卡格式化为FAT32文件格式
2. 选择需要的系统镜像、系统设置
3. 提供系统下载
4. 刷写系统盘

一开始我选择用这个软件下载，发现实在是太慢太慢了，而且没有进度条，所以改变方式，换成自己下载镜像再用软件刷写

在官方网站下载适用于树莓派4B8G的64位[Raspberry Pi OS](https://www.raspberrypi.com/software/operating-systems/)

（现在看才发现原来还有Full的选项...~~早知道当时就下载full版本了~~）

![](/assets/images/2026-01-23-18-11-22.png)

自己挂个魔法再用上Motrix就下的比较快了

用软件的自定义镜像制作启动盘，稍微坐和放宽就完成了

![](/assets/images/2026-01-23-18-14-28.png)

## 开机启动

将TF卡插入树莓派（注意金手指的朝向正确）

树莓派的HDMI输出是micro HDMI，所以要提前购置好micro HDMI转HDMI的线

将树莓派连接到显示器，并配备鼠标和键盘

使用原装配备的3A电源适配器，启动！

第一次启动会进行系统设置，按要求设置用户名和密码，开启SSH和VNC，配置网络

第一次启动会进行更新检查，这一步会卡比较久，可以坐和放宽

然后就会直接进入桌面，恭喜你，成功运行了树莓派的原生系统Raspberry Pi OS！

# 配置realVNC

首先，这一步操作貌似是不需要安装额外的什么软件的，系统自己本身就有VNC Server功能

我就是那个去网上找了各种资料，去官网下载了RealVNC Server，又耗费九牛二虎之力安装，之后发现找不到软件，找到了不知道怎么运行，运行了要注册账号，成功登陆账号以后发现结果是用不了的那个大冤种（

扯远了，总之就是直接使用系统的VNC就行了，如果没有在设置的时候启用，那么可以在系统设置里把它打开

点击Control Centre

![](/assets/images/2026-01-23-18-26-50.png)

选择Interfaces，并启用VNC

![](/assets/images/2026-01-23-18-27-50.png)

然后最好重启一下树莓派，这样服务端就算配置好了

---

接下来控制端，在设备上安装[VNC Viewer](https://www.realvnc.com/en/connect/download/viewer/)，无论你用的是Windows，安卓还是Mac<span title = '你知道的太多了' class = 'heimu'>（对，袁圣杰，说给你听的）</span>，都可以安装VNC Viewer来控制你的树莓派

![](/assets/images/2026-01-23-18-30-56.png)

在树莓派终端输入ifconfig查看树莓派终端的ip地址，记下ip和用户名（就是终端里的@前面的那一串）

启动VNC Viewer，左上角的File选择New Connection，输入ip地址和用户名，按要求进行配置和输入密码

![](/assets/images/2026-01-23-20-39-34.png)

然后不出意外就成功连接到树莓派的桌面了

# 创建Python虚拟环境

首先，新的系统建议先更新apt源，并进行系统更新

```bash
sudo apt update
sudo apt upgrade
```

先检查内置Python版本

```bash
asumi@raspberrypi:~ $ python -V
Python 3.13.5
```

我这个内置的Python版本是3.13.5

在合适的位置创建一个文件夹

![](/assets/images/2026-01-23-20-53-45.png)

在bash中输入命令（`/path/to/venv`替换为自己的路径，我的路径是/home/asumi/python/venv）

这个文件夹的名字venv可以起个自己喜欢的，比如Nishiki之类的，然后这个虚拟环境的名字就会是Nishiki

```bash
python3 -m venv /path/to/venv
```

激活并进入虚拟环境

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
