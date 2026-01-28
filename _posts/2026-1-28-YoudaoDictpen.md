---
title: 有道词典笔Linux系统研究（未完工）
excerpt: 使用shell对系统进行剖析，以期望破解和外挂程序

categories: 
  -  词典笔

tags:
  -  博客
  -  记录
  -  Linux

comments: true
entries_layout: grid

# header:
#     teaser: 

---

## 部署ssh公钥

在PC上确认公钥：（id_xxx.pub 常见为id_ed25519.pub、id_rsa.pub）

```powershell
ls $env:USERPROFILE\.ssh

type $env:USERPROFILE\.ssh\id_xxx.pub
```

复制整行信息到剪切板

在词典笔上

```bash
mkdir -p /root/.ssh
chmod 700 /root/.ssh
nano /root/.ssh/authorized_keys
```

发现这些问题：

1. 系统对/大部分文件夹是只读文件
2. 系统没有nano或者vim

所以先挂载系统分区为读写

```bash
mount -o remount,rw /
```

然后使用更通用的echo

```bash
echo '......你的公钥......' >> /root/.ssh/authorized_keys
```

* 外面用单引号，防止 shell 展开
* 必须是一整行，中间不要换行
* 用 >>，避免覆盖已有 key

给文件设置权限：

```bash
chmod 600 /root/.ssh/authorized_keys
```

检查是否写对：

```bash
ls -ld /root/.ssh
ls -l /root/.ssh/authorized_keys
cat /root/.ssh/authorized_keys
```

测试连接：

新开一个cmd终端（不要关掉这个）

```powershell
ssh root@192.168.2.25 <--这个是ip地址
```

关机重启后尝试，仍然通过，说明ssh key部署完成，这个词典笔设备就是一个合格的linux终端了

确认SSH服务类型

```bash
[root@YoudaoDictionaryPen-880:~]# ps | grep ssh
  789 root      6292 S    sshd: /usr/sbin/sshd [listener] 0 of 10-100 startups
 3136 root      6296 S    sshd: root@pts/0
 3637 root      2432 S    grep ssh

[root@YoudaoDictionaryPen-880:~]# sshd -T | head
port 22
addressfamily any
listenaddress [::]:22
listenaddress 0.0.0.0:22
logingracetime 120
x11displayoffset 10
maxauthtries 6
maxsessions 10
clientaliveinterval 0
clientalivecountmax 3
```

说明这是一个没有被裁剪的，完整的OpenSSH服务，可以放心大胆地使用

## 确认init系统

```bash
[root@YoudaoDictionaryPen-880:~]# ps -p 1 -o comm=
ps: invalid option -- 'p'
BusyBox v1.27.2 (2024-08-29 15:15:06 CST) multi-call binary.

Usage: ps

Show list of processes

        w       Wide output
        l       Long output
        T       Show threads


[root@YoudaoDictionaryPen-880:~]# ps | head
  PID USER       VSZ STAT COMMAND
    1 root      2432 S    init
    2 root         0 SW   [kthreadd]
    3 root         0 SW   [ksoftirqd/0]
    5 root         0 SW<  [kworker/0:0H]
    6 root         0 SW   [kworker/u8:0]
    7 root         0 SW   [rcu_sched]
    8 root         0 SW   [rcu_bh]
    9 root         0 SW   [migration/0]
   10 root         0 SW   [watchdog/0]
```

所以可以确认，
1. 这是 BusyBox + OpenSSH 的嵌入式 Linux
2. init 系统是 BusyBox init，不是 systemd

系统启动流程是：

```swift
kernel
 → BusyBox init (PID 1)
   → /etc/inittab
   → /etc/init.d/*
```

解释：

#### init是什么

init 是“内核之后，第一个跑起来的用户态程序”

```txt
Linux 内核只负责硬件、进程、内存

内核自己不会启动 ssh、不会联网

内核做完事后，会启动一个程序,这个程序的名字通常叫 init

它的进程号永远是 PID 1
```

而这里，init就是BusyBox的init。它决定先启动谁，后启动谁。如果它挂了，那么整个系统就完了

而init本身不知道怎样启动各种程序和配置，所以会按顺序读取和执行一堆脚本文件，通常是一下两个：

---

/etc/inittab（总目录 / 总规则）

这是BusyBox init 的主配置文件

它告诉 init：

* 系统启动时要跑哪些脚本

* 要不要开终端

* 某些程序挂了要不要重启

它不写复杂逻辑，只是“指路”

---

/etc/init.d/（具体干活的脚本）

这是一个目录，里面每个文件通常是一个 shell 脚本

每个脚本一般负责一件事：

* S10network → 启动网络

* S50sshd → 启动 sshd

* S99app → 启动主程序

init 会按名字顺序执行它们

---

所以，知晓init这件事非常关键，因为它意味着：

可以知道在哪里插一段你自己的代码，让系统每次开机都跑它。

#### ps是什么

ps 是“看现在系统里正在跑什么”的工具，也可以看做是Linux 的“任务管理器（命令行版）”

它做的事就是，向内核要一份“当前进程列表”，然后把它打印出来

#### 词典笔端确认

```bash
[root@YoudaoDictionaryPen-880:~]# ls -l /sbin/init
lrwxrwxrwx 1 root root 14 Dec 22 20:14 /sbin/init -> ../bin/busybox
```

> 该系统并未使用 systemd 或 sysvinit，而是直接由 BusyBox 提供 init 进程（PID 1）

```bash
[root@YoudaoDictionaryPen-880:~]# ls -l /etc/inittab
-rw-r--r-- 1 root root 1093 Sep 10  2021 /etc/inittab
```

```bash
[root@YoudaoDictionaryPen-880:~]# cat /etc/inittab
# /etc/inittab
#
# Copyright (C) 2001 Erik Andersen <andersen@codepoet.org>
#
# Note: BusyBox init doesn't support runlevels.  The runlevels field is
# completely ignored by BusyBox init. If you want runlevels, use
# sysvinit.
#
# Format for each entry: <id>:<runlevels>:<action>:<process>
#
# id        == tty to run on, or empty for /dev/console
# runlevels == ignored
# action    == one of sysinit, respawn, askfirst, wait, and once
# process   == program to run

# Startup the system
::sysinit:/bin/mount -t proc proc /proc  #挂载proc
::sysinit:/bin/mount -o remount,ro /     #挂载文件系统为只读
::sysinit:/bin/mkdir -p /dev/pts
::sysinit:/bin/mkdir -p /dev/shm
::sysinit:/bin/mount -a 2>/dev/null      #挂载定义里的其他分区
::sysinit:/bin/hostname -F /etc/hostname
# now run any rc scripts
::respawn:-/bin/login
::sysinit:/etc/init.d/rcS   #进入启动脚本阶段
#::respawn:/usr/bin/guardian

# Put a getty on the serial port
#ttyFIQ0::respawn:/sbin/getty -L  ttyFIQ0 0 vt100 # GENERIC_SERIAL

# Stuff to do for the 3-finger salute
#::ctrlaltdel:/sbin/reboot

# Stuff to do before rebooting
::shutdown:/etc/init.d/rcK   # 关机时按顺序停止服务
::shutdown:/sbin/swapoff -a
::shutdown:/bin/umount -a -r    
```

> BusyBox init 在系统初始化阶段，会执行 /etc/init.d/rcS

```bash
[root@YoudaoDictionaryPen-880:~]# ls -l /etc/init.d
total 55
# S 代表 start，数字越小启动越早
-rwxr-xr-x 1 root root  303 Sep 10  2021 S01DisableDebugUart # 早期关闭调试串口，防止泄露
-rwxr-xr-x 1 root root  193 Sep  9  2021 S10init
-rwxr-xr-x 1 root root 1636 Sep  9  2021 S10udev             # 设备管理，负责 /dev 下设备节点
-rwxr-xr-x 1 root root 1272 Sep  9  2021 S20urandom
-rwxr-xr-x 1 root root 9236 Sep 10  2021 S21mountall.sh      # 挂载剩余文件系统（非常关键）
-rwxr-xr-x 1 root root 1691 Sep  9  2021 S30dbus
-rwxr-xr-x 1 root root  712 Sep  9  2021 S36load_wifi_modules
-rwxr-xr-x 1 root root  618 Sep 10  2021 S40network          # 网络初始化 + DHCP 获取 IP
-rwxr-xr-x 1 root root  642 Aug  5  2022 S41dhcpcd
-rwxr-xr-x 1 root root  242 Aug  5  2022 S48_UBUSD_INIT
-rwx------ 1 root root 2340 Aug  5  2022 S49_EQ_init
-rwxr-xr-x 1 root root  763 Sep  9  2021 S49ntp
-rwxr-xr-x 1 root root 3946 Aug  5  2022 S50launcher         # 高概率是词典笔主程序的启动入口
-rwxr-xr-x 1 root root 8445 Aug  5  2022 S51system_config
-rwxr-xr-x 1 root root  462 Sep  9  2021 S80dnsmasq
-rwxr-xr-x 1 root root 9644 Dec 22 20:14 S98usbdevice
-rwxr-xr-x 1 root root  478 Aug  5  2022 S99_run_test_scripts # 厂商预留测试 hook（你以后可能会用）
-rwxr-xr-x 1 root root  837 Sep 10  2021 S99input-event-daemon # 输入事件（按键、触控）后台守护
-rwxr-xr-x 1 root root  161 Sep  9  2021 bootenv.sh
-rwxr-xr-x 1 root root  423 Sep  9  2021 rcK
-rwxr-xr-x 1 root root  433 Sep  9  2021 rcS
```

> 因此，可以确认这台词典笔使用的是：BusyBox + BusyBox init + SysV 风格启动脚本（rcS + /etc/init.d）
> 全链条启动是embedded Linux + busybox init + inittab + Wayland UI

### 修改init脚本，注入启动时程序

先创建一个最小脚本

```bash
vi /etc/init.d/S99boot_test
```

使用i进入插入模式，使用:wq保存并推出。编辑以下内容

```bash
#!/bin/sh
echo "boot at $(date)" >> /tmp/boot_test.log
```

设置可执行权限，并试运行

```bash
chmod 755 /etc/init.d/S99boot_test
/etc/init.d/S99boot_test
cat /tmp/boot_test.log

输出：
boot at Wed Jan 28 10:31:45 CST 2026
```

---

解释：init.d是个什么？

它是一个约定俗成的目录，作用只有一个：

存放“系统启动/关机时要执行的脚本”，而这些脚本本质上就是普通的 shell 文件

所以这就是个文件夹，里面是sh文件

rcS脚本就会遍历这个目录，按顺序执行这些文件

---

接下来验证

```bash
reboot
[root@YoudaoDictionaryPen-880:~]# cat /tmp/boot_test.log
boot at Wed Jan 28 10:36:46 CST 2026
```

时间正确，脚本运行成功！

该设备根文件系统默认以只读方式挂载，但内核与文件系统本身支持 rw。实际使用中，可在系统启动完成后手动或通过启动脚本将根分区 remount 为 rw，以便修改系统文件

所以我在脚本后面还添加了

```bash
if mount | grep ' on / ' | grep -q 'ro,'; then
    mount -o remount,rw /
fi
```

## 确认显示协议和显示系统

这个系统是：

Wayland+Qt 5.15.2 (arm64-little_endian-lp64 shared (dynamic) release build; by GCC 6.5.0)

其中，Wayland 是“显示协议”，不是显示服务器，也不是桌面环境。它定义了应用如何把图像交给显示系统，以及如何接收输入事件，取代了X11协议

Wayland特点如下：

```
应用只画自己的内容

合成器（compositor）负责窗口管理

应用不知道屏幕上还有谁

更安全、更适合嵌入式
```
```arduino
Qt 应用
  ↓（buffer）
Wayland compositor（显示服务）
  ↓
Framebuffer / DRM
```

```bash
[root@YoudaoDictionaryPen-880:~]# weston
librga:RGA_GET_VERSION:4.00,4.000000
ctx=0x19630c20,ctx->rgaFd=3
Rga built version:version:+2017-09-28 10:12:42
Date: 2026-01-28 CST
[10:52:23.922] weston 8.0.0
               https://wayland.freedesktop.org
               Bug reports to: https://gitlab.freedesktop.org/wayland/weston/issues/
               Build: Cherry_V2.0.3-209-gda784a88da+
[10:52:23.923] Command line: weston
[10:52:23.923] OS: Linux, 4.4.159, #1 SMP Wed Sep 4 14:32:30 CST 2024, aarch64
[10:52:23.924] Using config file '/etc/xdg/weston/weston.ini'
[10:52:23.924] Output repaint window is 7 ms maximum.
[10:52:23.924] Loading module '/usr/lib/libweston-8/drm-backend.so'
[10:52:23.927] initializing drm backend
[10:52:23.928] Entering mirror mode.
[10:52:23.928] <stdin> not a vt
[10:52:23.928] if running weston from ssh, use --tty to specify a tty
[10:52:23.928] fatal: drm backend should be run using weston-launch binary, or your system should provide the logind D-Bus API.
[10:52:23.928] fatal: failed to create compositor backend
Internal warning: debug scope 'drm-backend' has not been destroyed.
```
```bash
[root@YoudaoDictionaryPen-880:~]# ls /usr/lib | grep Wayland
libQt5WaylandClient.prl
libQt5WaylandClient.so
libQt5WaylandClient.so.5
libQt5WaylandClient.so.5.15
libQt5WaylandClient.so.5.15.2
libQt5WaylandCompositor.prl
libQt5WaylandCompositor.so
libQt5WaylandCompositor.so.5
libQt5WaylandCompositor.so.5.15
libQt5WaylandCompositor.so.5.15.
```
```bash
[root@YoudaoDictionaryPen-880:~]# ls /usr/lib/qt/plugins/platforms
libqlinuxfb.so  libqminimal.so  libqoffscreen.so  libqvnc.so  libqwayland-egl.so  libqwayland-generic.so
```

## 尝试使用树莓派4B8G来原生编译（失败）

我之前花了很久很久搞交叉编译链，真的是头都秃了也没搞好

好在好在，我现在有一块（学长借给我的）树莓派4B8G（aarch64 Linux），可以走原生编译，只不过现在没有编译环境

接下来我将尝试在树莓派上安装和配置Qt编程环境（基于Wayland和Wseston）

```bash 
sudo apt update
sudo apt install qtbase5-dev qtwayland5
```

---

然而，然而啊，用树莓派是不行滴

编译运行以后发现它的glibc的版本太高了，运行程序会报错。具体情况请看VCR：

1. 无法逾越的 GLIBC 鸿沟

* 词典笔环境：运行在极其保守的 glibc 2.27（2018 年版本）。

* 树莓派环境：现代的 Raspberry Pi OS 基于较新的 Debian，其自带的 glibc 通常在 2.31 甚至 2.34+。

* 核心矛盾：根据 Linux 的符号版本机制，高版本 glibc 编译出的 ELF 文件，无法在低版本 glibc 系统上运行。即便架构一致，执行时也会报出： /lib/libc.so.6: version 'GLIBC_2.34' not found。

2. 动态库污染风险 如果尝试在树莓派上 apt install qtbase5-dev，安装的库会带有树莓派特有的配置和依赖。即便绕过了 glibc，这些动态库在链接时也会将特定的符号绑定到 ELF 中，导致拷贝到词典笔后出现海量的 Symbol not found。

3. 结论：必须进行“版本可控”的交叉编译 要解决这个问题，唯有两条路：

* Sysroot 隔离：在树莓派上构建一个完全隔离的词典笔根文件系统镜像，但这极其沉重。

* 更现代的工具链（Zig + xmake）：Zig 编译器内置了对不同版本 libc 的支持。通过指定 -target aarch64-linux-gnu.2.27，我们可以直接在 Windows 上生成“穿越回 2018 年”的二进制文件。

> 因此，我决定停止在树莓派上的尝试，全力转战 Zig + xmake.lua 方案

真是精彩，不愧是gemini，写的真好（划去）

不过大概来说就是这样，所以接下来我要在Windows上配置Zig编程方案

## 尝试使用Windows+Zig指定版本交叉编译

在电脑上安装xmake和zig，并配置环境变量

创建工程

```c
#include <stdio.h>
int main() {
    printf("Hello From Zig and glibc 2.27\n");
    return 0;
}
```

先使用zig进行编译

```powershell
zig build-exe test.c -target aarch64-linux-gnu.2.27 -lc
```

将生成的test文件传输到词典笔上

```powershell
scp test root@192.168.2.25:/userdata
```

在词典笔上运行

```bash
chmod +x /userdata/test
/userdata/test
```
输出：

```
Hello From Zig and glibc 2.27
```

成功运行！这说明zig交叉编译成功，且生成的二进制文件可以在词典笔上运行

接下来尝试构造xmake.lua，来尝试用xmake来进行交叉编译

```powershell
xmake create -l c test_project
```

注意，在每次重新构建之前，最好先执行

```powershell
xmake clean -a
xmake f -p linux -a arm64 -c
```

```lua
-- 1. 定义 Zig 工具链 (这是 PenMods 建议的方案)
toolchain("zig-cross")
    set_kind("standalone")
    set_toolset("cc", "zig cc")
    set_toolset("cxx", "zig c++")
    set_toolset("ld", "zig cc")
    set_toolset("ar", "zig ar")
toolchain_end()

-- 2. 项目基础设定
set_project("DictPenProject")
set_version("1.0.0")
-- 强制指定 C++23 (模仿 PenMods) 和 C11
set_languages("cxx23", "c11")

target("hello_pen_qt")
    set_kind("binary")
    set_toolchains("zig-cross")
    
    -- 3. 核心：指定 Target Triple
    -- 这解决了你之前的 unknown file type 报错，确保生成的是 ELF 而不是 OBJ
    add_cxflags("-target aarch64-linux-gnu.2.27", {force = true})
    add_asflags("-target aarch64-linux-gnu.2.27", {force = true})
    add_ldflags("-target aarch64-linux-gnu.2.27", {force = true})

    -- 4. 路径配置 (把我们之前准备的 sysroot 缝合进来)
    add_includedirs("sysroot/include")
    add_linkdirs("sysroot/lib")
    
    -- 5. 链接 Qt 库 (先只连核心的，保证能过链接关)
    add_links("Qt5Widgets", "Qt5Gui", "Qt5Core")
    
    -- 模仿 PenMods 的静态链接策略，防止 GLIBCXX 版本过低报错
    add_ldflags("-static-libstdc++")

    -- 6. 添加你的源代码
    add_files("src/*.c")
    -- add_files("src/*.cpp")

```

运行xmake进行编译

```powershell
xmake
```

> 工程化转折点

我们现在终于成功配置好了稳定的工具链来交叉编译文件到指定版本的glibc上了！

接下来我们要从词典笔上“借用”Qt5的动态库和头文件，来进行完整的Qt5应用交叉编译，也就是构建一个迷你的Sysroot

## 构建迷你Sysroot，借用词典笔Qt5库进行交叉编译

在词典笔上创建一个临时目录

先尝试进行文件的侦查工作

```bash
# 确认 Qt 头文件所在位置，通常在 /usr/include/qt 或 /usr/include/qt5
ls -d /usr/include/qt*
# 确认 Qt 库所在位置
ls /usr/lib/libQt5Core.so*
```