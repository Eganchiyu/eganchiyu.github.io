---
title: 本地计算机、树莓派配置ssh
excerpt: 通过ssh优化远程访问

categories: 
  -  树莓派

tags:
  -  博客
  -  记录
  -  树莓派
  -  嵌入式
comments: true
entries_layout: grid

# header:
#     teaser: 

---

# 前言

相信其实大家对HTTPS协议网络了解比较深入，并且多多少少也感受到了它的一些不方便之处

我另外写了一篇[SSH的工作原理](https://eganchiyu.github.io/%E5%AD%A6%E4%B9%A0%E8%AE%B0%E5%BD%95/2026/01/26/ssh-working-principle/)，可以作为预备知识，不过对这篇文章的工作流没有影响，可以放心食用

接下来会围绕基本如何部署来展开

---

首先，前提是你的设备支持使用ssh进行登录，也就是可以：

```powershell
ssh asumi@192.168.2.212
```

连接后输入用户密码就可以登录shell

我们接下来的操作是通过部署公钥来为后续免密登录

# 部署ssh公钥

#### 为电脑生成公钥

```powershell
ssh-keygen -t rsa
```

这是生成的rsa公钥，也可以生成椭圆曲线公钥

相关文件默认保存在了 `C:\Users\你的用户名\.ssh\`

#### 将公钥发送到树莓派

有两种方法：直接发送文件或者复制内容后粘贴到指定文件

先来**方法一**：粘贴内容，这也是比较底层和保险的做法

用记事本**打开Windows生成的公钥文件** `C:\Users\你的用户名\.ssh\id_rsa.pub`，复制里面的全部内容

在树莓派上：
1. 输入 `mkdir -p ~/.ssh` 确保文件夹存在
2. 输入 `nano ~/.ssh/authorized_keys`
3. 把刚才复制的内容粘贴进去
4. 按 `Ctrl+O` 保存，`Ctrl+X` 退出
5. 设置权限
   ```bash
   chmod 700 ~/.ssh
   chmod 600 ~/.ssh/authorized_keys
   ```

---

再来**方法二**（其实我没尝试过）

```powershell
type $env:USERPROFILE\.ssh\id_rsa.pub | ssh <用户名>@<IP> "cat >> ~/.ssh/authorized_keys"
```

反正gemini说可以，我就写上去了（笑）

# 部署ssh公钥到别的地方

用相似的方法，也可以**把公钥部署到别的设备**，比如我的linux词典笔上

但是因为我的词典笔**没有nano**，所以有两种解决办法：**vim或者echo**

在PC上确认公钥：（id_xxx.pub 常见为id_ed25519.pub、id_rsa.pub）

```powershell
ls $env:USERPROFILE\.ssh

type $env:USERPROFILE\.ssh\id_xxx.pub
```

复制整行信息到剪切板

在词典笔上，先挂载系统分区为读写

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

---

测试连接：

新开一个cmd终端（不要关掉这个）

```powershell
ssh root@192.168.2.25 <--这个是ip地址
```

# 为github配置ssh

还是照样**拿到你的密钥文件内容**（一整行）

打开github，在上面添加公钥：GitHub → Settings → SSH and GPG keys → New SSH key → 粘贴并保存

**测试**ssh是否可用

```powershell
ssh -T git@github.com
```

看到 `Hi xxx! You've successfully authenticated, but GitHub does not provide shell access.` 即正常

---

使用ssh连接仓库

1. **克隆**的时候用：
   ```bash
   git clone git@github.com:用户名/仓库名.git
   ```
2. **已经有** HTTPS 仓库，改成 SSH:
  ``` bash
  git remote set-url origin git@github.com:用户名/仓库名.git
  ```
3. URL重做
   ```bash
   git config --global url."git@github.com:".insteadOf "https://github.com/"
   ```
  也就是让以后输入HTTPS网址也会**重定向到SSH地址**

# 结语

至此，我们就学会了怎样在`设备B`上部署`设备A`的公钥的工作流了

以后也可以用类似的方法来部署自己的公钥

接下来，无论是**树莓派**、**词典笔**还是**github**，都可以用SSH非常非常方便地**远程管理**！真是可喜可贺！

那么以后也请多多关照