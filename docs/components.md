# 组件文档

> 项目包含 2 个全局组件（导航、页脚）、3 个独立页面组件（分类、标签、归档）和 5 个互动组件（Playground、游戏、投票、测验、成就通知）。

---

## 1. navigation.html — 导航组件

**文件路径**: `_includes/navigation.html`
**引用方式**: 在 `default.html` 中通过 `{% include navigation.html %}` 引入

### 1.1 桌面导航

结构：
```
<nav class="navbar">
  └── <div class="container">
       ├── Logo（🏠 + 站点标题前缀）
       └── <div class="nav-right">
            ├── 导航链接组 (.nav-links)
            ├── 主题切换按钮 (.theme-toggle)
            └── 移动端菜单按钮 (.menu-toggle)
```

#### Logo

- 图标：🏠 emoji，带 `float` 上下浮动动画
- 文本：从 `site.title` 中提取"的"之前的部分（即 "Eganchiyu"）
- 悬停效果：颜色变为 Alice Blue，轻微放大 (`scale(1.02)`)

#### 导航链接

| 链接 | 目标 | 激活条件 |
|------|------|----------|
| 首页 | `/` | `page.url == '/'` |
| 分类 | `/categories/` | `page.url == '/categories/'` |
| 标签 | `/tags/` | `page.url == '/tags/'` |
| 归档 | `/year-archive/` | `page.url == '/year-archive/'` |
| 关于 | `/about/` | `page.url == '/about/'` |
| GitHub | `https://github.com/Eganchiyu` | 无（外部链接） |

- 激活状态 (`.active`)：文字变为 Alice Blue，背景变为 `--alice-100`，底部有 2px 指示条
- 悬停效果：颜色变化 + 背景变化

#### 主题切换按钮

```html
<button class="theme-toggle" id="themeToggle" aria-label="切换主题">
  <span class="icon-moon">🌙</span>
  <span class="icon-sun">☀️</span>
</button>
```

- Light 模式显示 🌙（月亮），Dark 模式显示 ☀️（太阳）
- 通过 CSS `display: none/block` 切换，逻辑见 `[data-theme]` 选择器
- 点击事件由 `main.js` 中的 `ThemeManager` 处理

### 1.2 移动端汉堡菜单

```html
<button class="menu-toggle" id="menuToggle" aria-label="菜单">☰</button>
```

- 桌面端隐藏 (`display: none`)，手机端 (`max-width: 768px`) 显示
- 图标在 ☰（汉堡）和 ✕（关闭）之间切换

移动端菜单面板：

```html
<div class="mobile-menu" id="mobileMenu">
  <a class="mobile-link">🏠 首页</a>
  <a class="mobile-link">📁 分类</a>
  <a class="mobile-link">🏷️ 标签</a>
  <a class="mobile-link">📅 归档</a>
  <a class="mobile-link">👋 关于</a>
  <a class="mobile-link">🐙 GitHub</a>
</div>
```

- 固定定位，位于导航栏下方 (`top: 3.5rem`)
- 毛玻璃背景 + 卡片阴影
- 激活时带 `slideDown` 滑入动画
- 点击链接或页面其他区域自动关闭

### 1.3 滚动阴影

导航栏默认无阴影，页面滚动超过 50px 后通过 JS 添加 `box-shadow: var(--shadow-soft)`。

实现方式：使用 `requestAnimationFrame` 节流，详见 [JavaScript 文档](./javascript.md)。

### 1.4 响应式行为

| 断点 | 行为 |
|------|------|
| > 768px | 显示桌面导航链接，隐藏汉堡按钮 |
| ≤ 768px | 隐藏桌面链接，显示汉堡按钮和移动端菜单 |

---

## 2. footer.html — 页脚组件

**文件路径**: `_includes/footer.html`
**引用方式**: 在 `default.html` 中通过 `{% include footer.html %}` 引入

### 2.1 结构

```
<footer class="footer">
  └── <div class="footer-content">
       ├── 站点信息 (.footer-info)
       ├── 链接 (.footer-links)
       └── 版权 (.footer-copyright)
```

### 2.2 站点信息

```html
<div class="footer-info">
  <p class="footer-title">{{ site.title }}</p>
  <p class="footer-subtitle">{{ site.subtitle }}</p>
</div>
```

显示站点标题和副标题，水平排列。

### 2.3 链接

| 链接 | 目标 |
|------|------|
| GitHub | `https://github.com/Eganchiyu`（新窗口打开） |
| 邮箱 | `mailto:{{ site.author.email }}` |
| RSS | `/feed.xml`（由 `jekyll-feed` 插件生成） |

### 2.4 版权

```html
<p>&copy; {{ site.time | date: '%Y' }} {{ site.author.name }}.
   Powered by <a href="https://jekyllrb.com">Jekyll</a>.</p>
```

- 年份从 `site.time` 动态获取
- Jekyll 链接带 `rel="noopener"`

### 2.5 样式特征

- 顶部边框分隔线
- 毛玻璃背景 (`backdrop-filter: blur(10px)`)
- 上方 4rem 外边距
- Flexbox 垂直居中布局

---

## 3. 独立页面组件

这些页面直接使用 `layout: default`，样式通过页面内 `<style>` 标签定义。

### 3.1 categories.html — 分类页面

**文件路径**: `categories.html`（项目根目录）
**URL**: `/categories/`
**布局**: `default`

#### 功能

- 标题："📁 分类"
- 使用 `site.categories | sort` 按字母排序
- 网格布局 (`auto-fill, minmax(300px, 1fr)`)

#### 单个分类卡片

| 元素 | 说明 |
|------|------|
| 分类名 | 可点击锚点链接 `#分类名` |
| 文章数 | 胶囊样式计数器 (`.taxonomy-count`) |
| 文章列表 | 最多显示 5 篇，超出显示"还有 N 篇" |
| 文章项 | 标题链接 + 月-日日期 |

#### 关键 CSS 类

| 类名 | 用途 |
|------|------|
| `.taxonomy-section` | 外层容器，3rem 上下内边距 |
| `.taxonomy-grid` | 网格布局容器 |
| `.taxonomy-card` | 单个分类卡片，毛玻璃 + 圆角 |
| `.taxonomy-name` | 分类标题栏，底部 2px Alice Blue 边框 |
| `.taxonomy-count` | 文章计数胶囊 |
| `.taxonomy-list` | 文章列表 |

### 3.2 tags.html — 标签页面

**文件路径**: `tags.html`（项目根目录）
**URL**: `/tags/`
**布局**: `default`

#### 功能

分为两个区域：**标签云** 和 **标签文章列表**。

#### 标签云 (Tags Cloud)

```html
<div class="tags-cloud">
  {% for tag in tags_sorted %}
  <a href="#{{ tag[0] }}" class="tag-item"
     style="font-size: {{ tag[1].size | times: 0.1 | plus: 0.9 }}rem;">
    #{{ tag[0] }}
    <span class="tag-count">{{ tag[1].size }}</span>
  </a>
  {% endfor %}
</div>
```

- 标签字号动态计算：`0.9 + 文章数 × 0.1` rem（文章越多字号越大）
- 每个标签可点击跳转到下方对应区域
- 胶囊样式，含文章计数
- 悬停变色 + 上移效果

#### 标签文章列表

每个标签为一个区块 (`.tag-section`)，含 `id` 锚点：
- 标签名 (`#标签名`)
- 文章列表（标题 + 日期）
- 使用 `site.tags | sort` 按字母排序

#### 关键 CSS 类

| 类名 | 用途 |
|------|------|
| `.tags-cloud` | 标签云容器，flex 换行 |
| `.tag-item` | 单个标签胶囊 |
| `.tag-count` | 标签内计数徽章 |
| `.tags-list` | 文章列表区域 |
| `.tag-section` | 单个标签的文章区块 |
| `.tag-posts` | 文章列表 |

### 3.3 year-archive.html — 归档页面

**文件路径**: `year-archive.html`（项目根目录）
**URL**: `/year-archive/`
**布局**: `default`

#### 功能

- 标题："📅 文章归档"
- 副标题：显示总文章数
- 时间线布局，按年分组

#### 时间线结构

```
时间线竖线 (::before 伪元素)
│
├── 2026 年 ●
│   ├── [01月28日] 文章标题 — 分类
│   ├── [01月25日] 文章标题 — 分类
│   └── ...
│
└── 2025 年 ●
    ├── [12月25日] 文章标题 — 分类
    └── ...
```

- 使用 `site.posts | group_by_exp` 按年份分组
- 时间线左侧有渐变竖线（Alice Blue → Lavender）
- 年份标题前有圆形节点（Alice Blue + 白色边框 + 外环）
- 每篇文章为一个卡片，悬停向右平移 4px

#### 关键 CSS 类

| 类名 | 用途 |
|------|------|
| `.archive-timeline` | 时间线容器，含左侧竖线 |
| `.archive-year` | 年份分组 |
| `.year-title` | 年份标题，含左侧圆点 |
| `.year-posts` | 该年文章列表 |
| `.archive-post` | 单篇文章卡片 |
| `.archive-date` | 日期（月日） |
| `.archive-post-title` | 文章标题 |
| `.archive-category` | 分类胶囊标签 |

#### 响应式

手机端 (≤768px)：
- 时间线竖线和圆点左移
- 文章卡片改为纵向排列
- 分类标签换行显示

---

## 4. playground.html — 代码 Playground 组件

**文件路径**: `_includes/playground.html`
**引用方式**: 在 `single.html` 中通过 `{% include playground.html %}` 引入
**触发条件**: 文章 Front Matter 中包含 `playground` 配置

### 4.1 功能

- 提供内嵌的代码编辑器和实时预览
- 支持 HTML、CSS、JS 三种语言模式
- 三种视图模式：编辑、预览、分屏
- 支持运行、重置、复制代码操作
- 代码通过 iframe sandbox 安全运行

### 4.2 Front Matter 配置

```yaml
playground:
  - id: "demo1"
    title: "CSS 动画演示"
    language: "html"       # html | css | js
    code: |
      <div class="box"></div>
      <style>
        .box { width: 100px; height: 100px; background: var(--alice-500); animation: spin 2s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
      </style>
    height: "300px"        # 预览区域高度（可选）

  - id: "demo2"
    title: "JS 交互示例"
    language: "js"
    code: |
      document.body.innerHTML = '<h1>Hello World!</h1>';
```

### 4.3 结构

```
<div class="playground-container">
  └── Playground 头部 (.playground-header)
       ├── 标题 (.playground-title)
       │   ├── 图标 (🎮)
       │   └── 标题文本
       ├── 视图切换 (.playground-tabs)
       │   ├── 编辑按钮 (.playground-tab[data-tab="editor"])
       │   ├── 预览按钮 (.playground-tab[data-tab="preview"])
       │   └── 分屏按钮 (.playground-tab[data-tab="split"])
       └── 操作按钮 (.playground-actions)
           ├── 运行 (.playground-run)
           ├── 重置 (.playground-reset)
           └── 复制 (.playground-copy)
  └── Playground 主体 (.playground-body)
       ├── 编辑器区域 (.playground-editor-wrapper)
       │   └── 编辑器 (.playground-editor)
       └── 预览区域 (.playground-preview-wrapper)
           └── iframe (.playground-preview, sandbox="allow-scripts allow-modals")
  └── Playground 底部 (.playground-footer)
       ├── 语言标签 (.playground-language)
       └── 运行状态 (.playground-status)
```

### 4.4 关键 CSS 类

| 类名 | 用途 |
|------|------|
| `.playground-container` | 外层容器 |
| `.playground-tab.active` | 当前激活的视图标签 |
| `.playground-editor` | 代码编辑器 |
| `.playground-preview` | 预览 iframe |
| `.playground-run` | 运行按钮 |
| `.playground-reset` | 重置按钮 |

### 4.5 视图模式

| 模式 | 行为 |
|------|------|
| `editor` | 只显示编辑器 |
| `preview` | 只显示预览 |
| `split` | 编辑器和预览左右分屏 |

### 4.6 JavaScript

由 `PlaygroundManager` 管理，详见 [JavaScript 文档](./javascript.md)。

---

## 5. game.html — 迷你游戏组件

**文件路径**: `_includes/game.html`
**引用方式**: 在 `single.html` 中通过 `{% include game.html %}` 引入
**触发条件**: 文章 Front Matter 中包含 `game` 配置

### 5.1 功能

- 内置三种迷你游戏：CSS 选择器挑战、代码打字练习、终端猜数字
- 实时计分系统，支持最高分记录
- 游戏进度和得分通过 localStorage 持久化

### 5.2 Front Matter 配置

#### CSS 选择器挑战

```yaml
game:
  type: "css-selector"
  title: "CSS 选择器挑战"
  description: "用 CSS 选择器选中高亮的 HTML 元素，共 10 关，越来越难！"
```

#### 代码打字练习

```yaml
game:
  type: "typing-race"
  title: "代码打字练习"
  description: "60 秒内尽可能快地输入显示的代码，测试你的打字速度！"
```

#### 终端猜数字

```yaml
game:
  type: "terminal-guess"
  title: "终端猜数字"
  description: "在终端中猜测 1-100 之间的数字，看看你能几次猜中！"
```

### 5.3 结构

```
<div class="game-container" id="game-{type}" data-type="{type}">
  └── 游戏头部 (.game-header)
       ├── 标题 (.game-title)
       │   ├── 图标（根据 type 动态选择 🎯/⌨️/💻）
       │   └── 标题文本
       └── 得分 (.game-score)
           ├── 标签 ("得分")
           └── 分数值 (#gameScore)
  └── 游戏主体 (.game-body)
       └── [根据 type 渲染不同游戏界面]
  └── 游戏底部 (.game-footer)
       ├── 重新开始按钮 (.game-restart)
       └── 最高分 (.game-highscore)
```

### 5.4 CSS 选择器挑战模式

- 10 个递增难度的关卡
- 显示 HTML 元素结构，高亮目标元素
- 玩家输入 CSS 选择器（jQuery 风格 `$("")`）选中目标
- 即时反馈正确/错误

#### 关键 CSS 类

| 类名 | 用途 |
|------|------|
| `.game-html-preview` | HTML 元素可视化预览 |
| `.game-target-elements` | 目标高亮元素 |
| `.game-input-wrapper` | 输入框（带 `$("")` 前后缀） |
| `.game-feedback` | 正确/错误反馈 |
| `.game-level` | 当前关卡信息 |

### 5.5 代码打字练习模式

- 60 秒倒计时
- 显示待输入代码
- 实时统计：正确字符、错误字符、准确率、WPM（每分钟字数）

#### 关键 CSS 类

| 类名 | 用途 |
|------|------|
| `.game-timer-value` | 倒计时秒数 |
| `.game-code-display` | 待输入代码展示 |
| `.game-typing-input` | 文本输入区 |
| `.game-stat` | 统计项 |
| `.game-start-btn` | 开始按钮 |

### 5.6 终端猜数字模式

- 模拟终端界面（红黄绿三点 + Terminal 标题栏）
- 猜测 1-100 之间的数字
- 显示"大了/小了"提示
- 统计猜测次数，记录最佳成绩

#### 关键 CSS 类

| 类名 | 用途 |
|------|------|
| `.terminal-window` | 终端窗口容器 |
| `.terminal-header` | 终端标题栏（含红黄绿三点） |
| `.terminal-body` | 终端输出区域 |
| `.terminal-input` | 数字输入框 |
| `.game-terminal-stats` | 猜测次数和最佳记录 |

### 5.7 JavaScript

由 `GameManager` 管理，详见 [JavaScript 文档](./javascript.md)。

---

## 6. poll.html — 投票组件

**文件路径**: `_includes/poll.html`
**引用方式**: 在 `single.html` 中通过 `{% include poll.html id="article-poll" %}` 引入
**触发条件**: 文章 Front Matter 中包含 `poll` 配置

### 6.1 功能

- 显示投票问题和选项
- 支持单选和多选模式
- 投票后显示结果动画（水平柱状图 + 百分比）
- 使用 localStorage 存储投票状态，防止重复投票

### 6.2 Front Matter 配置

```yaml
poll:
  question: "你更喜欢哪种编程语言？"
  multiple: false  # false=单选, true=多选
  options:
    - text: "Python"
      emoji: "🐍"
    - text: "JavaScript"
      emoji: "⚡"
    - text: "Rust"
      emoji: "🦀"
```

### 6.3 结构

```
<div class="poll-container">
  └── <div class="poll-card">
       ├── 投票头部 (.poll-header)
       │   ├── 问题 (.poll-question)
       │   └── 多选徽章 (.poll-badge) [可选]
       ├── 选项列表 (.poll-options)
       │   └── 选项按钮 (.poll-option)
       │       ├── Emoji (.poll-option-emoji) [可选]
       │       ├── 文本 (.poll-option-text)
       │       ├── 进度条 (.poll-option-bar)
       │       └── 百分比 (.poll-option-percent)
       └── 投票底部 (.poll-footer)
           ├── 总票数 (.poll-total)
           └── 提交按钮 (.poll-submit)
```

### 6.4 关键 CSS 类

| 类名 | 用途 |
|------|------|
| `.poll-container` | 外层容器 |
| `.poll-card` | 投票卡片，毛玻璃效果 |
| `.poll-option` | 选项按钮 |
| `.poll-option.selected` | 选中状态 |
| `.poll-option.voted` | 已投票状态 |
| `.poll-option-bar` | 结果进度条 |

### 6.5 JavaScript

由 `PollManager` 管理，详见 [JavaScript 文档](./javascript.md)。

---

## 7. quiz.html — 测验组件

**文件路径**: `_includes/quiz.html`
**引用方式**: 在 `single.html` 中通过 `{% include quiz.html id="article-quiz" %}` 引入
**触发条件**: 文章 Front Matter 中包含 `quiz` 配置

### 7.1 功能

- 支持单选、多选、判断题
- 即时反馈正确/错误
- 显示详细解释
- 分数统计和评语
- 支持重新测验

### 7.2 Front Matter 配置

```yaml
quiz:
  - question: "SSH 默认端口号是？"
    type: "single"  # single=单选, multi=多选
    options:
      - text: "21"
      - text: "22"
      - text: "80"
      - text: "443"
    answer: 1  # 正确答案索引（从0开始）
    explanation: "SSH 默认使用 22 端口"

  - question: "以下哪些是 HTTP 方法？"
    type: "multi"
    options:
      - text: "GET"
      - text: "PUSH"
      - text: "POST"
      - text: "FETCH"
    answer: [0, 2]  # 多选答案用数组
    explanation: "GET 和 POST 是标准 HTTP 方法"
```

### 7.3 结构

```
<div class="quiz-container">
  └── <div class="quiz-card">
       ├── 测验头部 (.quiz-header)
       │   ├── 标题 (.quiz-title)
       │   └── 进度 (.quiz-progress)
       ├── 问题列表 (.quiz-questions)
       │   └── 问题 (.quiz-question)
       │       ├── 问题头部 (.quiz-question-header)
       │       │   ├── 问题编号 (.quiz-question-number)
       │       │   └── 问题文本 (.quiz-question-text)
       │       ├── 选项列表 (.quiz-options)
       │       │   └── 选项按钮 (.quiz-option)
       │       │       ├── 选项字母 (.quiz-option-letter)
       │       │       ├── 选项文本 (.quiz-option-text)
       │       │       └── 选项图标 (.quiz-option-icon)
       │       └── 解释 (.quiz-explanation) [可选]
       └── 测验底部 (.quiz-footer)
           ├── 下一题按钮 (.quiz-next)
           └── 结果区域 (.quiz-result)
               ├── 分数 (.quiz-score)
               ├── 评语 (.quiz-result-text)
               └── 重新测验按钮 (.quiz-restart)
```

### 7.4 关键 CSS 类

| 类名 | 用途 |
|------|------|
| `.quiz-container` | 外层容器 |
| `.quiz-card` | 测验卡片 |
| `.quiz-option` | 选项按钮 |
| `.quiz-option.correct` | 正确答案状态 |
| `.quiz-option.wrong` | 错误答案状态 |
| `.quiz-explanation` | 解释区域 |

### 7.5 JavaScript

由 `QuizManager` 管理，详见 [JavaScript 文档](./javascript.md)。

---

## 8. achievement-toast.html — 成就通知组件

**文件路径**: `_includes/achievement-toast.html`
**引用方式**: 由 `AchievementManager` 动态创建

### 8.1 功能

- 显示成就解锁通知
- 带弹跳动画的 Emoji
- 自动消失（3秒）
- 可手动关闭

### 8.2 成就列表

| 成就 | 图标 | 触发条件 |
|------|------|----------|
| 初来乍到 | 👋 | 首次访问博客 |
| 暗夜精灵 | 🌙 | 切换暗色模式 |
| 求知若渴 | 📖 | 阅读 5 篇文章 |
| 代码达人 | 💻 | 复制代码 10 次 |
| 互动先锋 | 💬 | 首次发表评论 |
| 分享达人 | 🔗 | 首次分享文章 |
| 探索者 | 🔍 | 使用搜索功能 |
| 学富五车 | 🎓 | 阅读 15 篇文章 |
| 全文通读 | 🏆 | 阅读进度 100% |
| 投票达人 | 🗳️ | 投票 5 次 |
| 测验满分 | 🧠 | 测验全部答对 |
| 忠实读者 | ⭐ | 连续 7 天访问 |
| 博学多才 | 👑 | 解锁 10 个徽章 |

### 8.3 成就墙

点击页面右下角的 🏆 按钮打开成就墙，显示所有徽章的解锁状态。

### 8.4 JavaScript

由 `AchievementManager` 管理，详见 [JavaScript 文档](./javascript.md)。
