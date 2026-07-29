---
title: 更好的 VS Code + C++ 编程体验：分离源文件和可执行文件
excerpt: 使用 run code 插件并将源文件（.cpp）和可执行文件（.exe）分离保存

categories: 
  -  学习记录
tags:
  -  博客
  -  记录
mins: 120
wip: true
comments: true
entries_layout: grid

header:
  teaser: /assets/images/2026-07-29-11-06-54.png

poll:
  question: "你通常怎么处理本地 C/C++ 编译产生的 .exe 可执行文件？"
  multiple: false
  options:
    - text: "顺其自然，和源码混在一起"
      emoji: "🤷‍♂️"
    - text: "手动建个文件夹把它拖进去"
      emoji: "📁"
    - text: "配置脚本/插件实现自动分离"
      emoji: "⚙️"
    - text: "从不在本地跑，都用在线 IDE"
      emoji: "☁️"

quiz:
  - question: "在作者修改的 Code Runner 配置中，`if (-not (Test-Path build))` 这一段代码的核心作用是什么？"
    type: "single"
    options:
      - text: "检查系统中是否安装了名为 build 的构建工具链"
      - text: "检测当前目录下是否存在 build 文件夹，若无则准备创建"
      - text: "测试代码编译后生成的 .exe 文件是否可用"
      - text: "屏蔽编译和链接过程中产生的所有警告信息"
    answer: 1
    explanation: "这段 PowerShell 脚本的作用是检查当前目录（$dir）下是否已经存在 `build` 文件夹。如果不存在（-not），才会执行花括号内的 `New-Item` 命令去新建文件夹，从而避免因文件夹已存在而重复创建导致的报错。"

  - question: "在修改 `settings.json` 里的路径时，为什么必须写成 `.\\build\\$fileNameWithoutExt`（使用双反斜杠），而不能只用单反斜杠？"
    type: "single"
    options:
      - text: "因为 Windows 系统的文件路径强制要求使用连续两个反斜杠"
      - text: "这是 Code Runner 插件的特殊语法，双反斜杠代表进入子文件夹"
      - text: "在被双引号包裹的 JSON 字符串中，需要使用反斜杠来对反斜杠本身进行转义"
      - text: "为了同时兼容 Windows 系统下的反斜杠和 Linux 系统下的正斜杠"
    answer: 2
    explanation: "在 JSON 格式的配置文件中，反斜杠 `\\` 具有特殊作用（即转义字符，Escape）。为了让底层的 PowerShell 系统能正确接收到代表路径分隔符的单个反斜杠，必须在 JSON 字符串里用 `\\` 来表示实际的 `\\`。"

  - question: "将编译产物统一收纳进 `build/` 文件夹后，为了避免将这些毫无意义的二进制文件提交到 Git 仓库，最高效的后续操作是？"
    type: "single"
    options:
      - text: "每次执行 git commit 之前，先运行清理命令删除整个 build 文件夹"
      - text: "在项目根目录新建或打开 `.gitignore` 文件，并在其中添加配置：`build/`"
      - text: "在提交变更时仔细检查暂存区，手动取消勾选每一个新生成的 .exe 文件"
      - text: "将整个代码仓库的权限设置为私有仓库（Private）"
    answer: 1
    explanation: "将产物统一分离到 build 文件夹的核心优势之一就是便于版本控制。只需在根目录的 `.gitignore` 文件中写入 `build/`，Git 便会自动忽略该文件夹下的所有内容，一劳永逸地解决仓库被二进制文件污染的问题。"

---
# 前言

本文前提：已完成编译链的配置，即已安装 MSCV （mingw64）的安装和环境变量配置

![](/assets/images/2026-07-29-11-09-44.png)

![](/assets/images/2026-07-29-11-10-15.png)

在编程的时候，直接使用 gcc（g++）的编译命令生成构建可执行文件的时候，.exe 文件会直接生成在 .cpp 文件的同级文件夹。一旦程序变多，就会变得很不美观且不方便管理和选中。

本文基于 run code 插件（VS Code），讲解了如何配置 run code 来把 .exe 的生成文件单独放到一个文件夹。

# 一、安装插件

在插件市场中安装插件 Code Runner

![](/assets/images/2026-07-29-11-13-32.png)

安装后按照指示重启 IDE （VS Code），可以激活插件。

# 二、进入插件设置界面

进入插件的设置界面

![](/assets/images/2026-07-29-11-15-51.png)

寻找设置选项 `Code Runner: Executor Map` ，点击 `在 settings.json 中编辑` 快捷方式进入设置界面。

![](/assets/images/2026-07-29-11-16-50.png)

# 三、在插件设置窗口进行配置

这个文件（功能）它的作用是让你自定义不同编程语言在 Code Runner 插件中的一键运行命令。我们需要对 `C` 和 `C++` 的构建命令进行自定义，来实现创建文件夹和分文件夹构建功能。

寻找到 c 和 cpp 的构建指令部分（如下图所示）：

![](/assets/images/2026-07-29-11-20-49.png)

```json
"c": "gcc $fileName -o $fileNameWithoutExt && $fileNameWithoutExt",
"zig": "zig run",
"cpp": "g++ $fileName -o $fileNameWithoutExt && $fileNameWithoutExt",
```

> 这部分可能有些许出入，不过大概就是长这样。需要寻找到 c 和 cpp 的指令即可。可以关注 'gcc' 'g++' '-o' 这样的部分/

> 其中，中间夹了一个 zig ，我们可以不用管，就放在那里不动就行。

将上述内容修改为：

```json
"c": "cd $dir && if (-not (Test-Path build)) { New-Item -ItemType Directory -Path build | Out-Null } && gcc $fileName -o .\\build\\$fileNameWithoutExt && .\\build\\$fileNameWithoutExt",
"zig": "zig run",
"cpp": "cd $dir && if (-not (Test-Path build)) { New-Item -ItemType Directory -Path build | Out-Null } && g++ $fileName -o .\\build\\$fileNameWithoutExt && .\\build\\$fileNameWithoutExt",
```

这行代码是最终在命令行 （Powershell） 中实际运行的指令。因此可以书写任何兼容 Powershell 的指令。

这里的 `cd $dir && if (-not (Test-Path build)) { New-Item -ItemType Directory -Path build | Out-Null }` 代码的作用是，先进入当前文件所在的目录，然后检查是否存在名为 build 的文件夹，如果不存在就自动创建一个。

通过修改编译参数 `-o .\\build\\$fileNameWithoutExt && .\\build\\$fileNameWithoutExt"` ，我们修改了编译命令的目标文件夹和运行命令的目标文件夹到同一目录下的 `/build` 文件夹。这里可以按照自己的喜好进行自定义，如 `.\\Asumi\\` 等。

这里命令中添加两个反斜杠的原因是，这句命令被引号 `""` 包裹，所以是字符串，而字符串中的反斜杠需要用反斜杠进行转义（Escape），以便系统能正确识别出它是一个单纯的路径分隔符，而不是具有特殊含义的控制字符。（这部分在C++课上会上，我看看谁没认真听讲）

做完这些操作后，请记得 `Ctrl + S` **保存文件**，否则不生效。

# 四、小结和其他

⭐ 通过以上配置，我们便成功实现了 Code Runner 的分文件夹自动构建与整理。这样修改带来的核心好处有两个：

1. 保持工作区整洁：所有的 .exe 可执行文件都会被统一收纳进 build 文件夹中，再也不会和你的 .c 或 .cpp 源代码文件混在一起，让项目目录一目了然。
2. 避免 Git 污染：如果你使用 Git 进行版本控制，现在只需在项目根目录下新建一个 .gitignore 文件并写上 build/，就能一键忽略所有编译产物，避免无意义的二进制文件提交。

---

Q: 为什么修改完 `settings.json` 文件后有红色波浪线？

A: JSON 是一种对格式要求极度严苛的配置文件。请检查：

1. 逗号缺失、`/`多余：每一行配置的末尾都需要有一个英文逗号 `,` 。但请注意，如果是最后一行配置，其末尾绝对不能加逗号，否则会直接导致整个配置文件解析失败。
2. 符号中英文：请确保所有引号 `"`、逗号 `,`、括号 `()` 均为英文半角符号。

---

现在文件夹干净了没有无用的 exe文件了，又可以愉快的玩耍了

