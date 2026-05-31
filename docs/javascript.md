# 交互脚本文档

> 主脚本文件: `assets/js/main.js`（~2593 行）
> 采用 IIFE 立即执行函数封装，包含 25 个功能模块。

---

## 架构概览

```javascript
(function() {
  'use strict';

  const ThemeManager = { ... };       // 主题切换
  const MobileMenu = { ... };         // 移动端菜单
  const NavbarScroll = { ... };       // 导航栏滚动效果
  const SmoothScroll = { ... };       // 平滑滚动
  const CodeBlockManager = { ... };   // 代码块复制
  const BackToTop = { ... };          // 返回顶部
  const ReadingProgress = { ... };    // 阅读进度条
  const TOCManager = { ... };         // 文章目录
  const SearchManager = { ... };      // 搜索功能
  const LightboxManager = { ... };    // 图片灯箱
  const RippleManager = { ... };      // 涟漪效果
  const ScrollReveal = { ... };       // 滚动显示动画
  const ToastManager = { ... };       // Toast 通知
  const CommentManager = { ... };     // 评论管理
  const ShareManager = { ... };       // 分享功能
  const LikeManager = { ... };        // 点赞功能
  const PollManager = { ... };        // 投票功能
  const QuizManager = { ... };        // 测验功能
  const AchievementManager = { ... }; // 成就系统
  const PlaygroundManager = { ... };  // 代码 Playground
  const GameManager = { ... };        // 迷你游戏
  const SkeletonManager = { ... };    // 骨架屏
  const TypewriterManager = { ... };  // 打字机效果
  const Card3DManager = { ... };      // 3D 卡片效果
  const StatsManager = { ... };       // 统计数据

  document.addEventListener('DOMContentLoaded', () => {
    ThemeManager.init();
    MobileMenu.init();
    NavbarScroll.init();
    SmoothScroll.init();
    CodeBlockManager.init();
    BackToTop.init();
    ReadingProgress.init();
    TOCManager.init();
    SearchManager.init();
    LightboxManager.init();
    RippleManager.init();
    ScrollReveal.init();
    ToastManager.init();
    CommentManager.init();
    ShareManager.init();
    LikeManager.init();
    PollManager.init();
    QuizManager.init();
    AchievementManager.init();
    PlaygroundManager.init();
    GameManager.init();
    SkeletonManager.init();
    TypewriterManager.init();
    Card3DManager.init();
    StatsManager.init();
  });
})();
```

所有模块遵循统一接口：每个模块都是一个对象字面量，包含 `init()` 方法。在 `DOMContentLoaded` 事件中按顺序初始化。

---

## 1. ThemeManager — 主题切换

### 功能

在 Light / Dark 两个主题之间切换，并通过 `localStorage` 持久化用户选择。

### 常量

| 常量 | 值 | 用途 |
|------|-----|------|
| `STORAGE_KEY` | `'theme'` | localStorage 存储键名 |
| `DARK` | `'dark'` | Dark 主题标识 |
| `LIGHT` | `'light'` | Light 主题标识 |

### init() 方法

```
1. 获取 DOM 元素：document.getElementById('themeToggle')
2. 读取 localStorage 中保存的主题
3. 若无保存值，检测系统 prefers-color-scheme 媒体查询
4. 调用 apply() 应用主题
5. 绑定点击事件监听器
```

### apply(theme) 方法

```javascript
apply(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  // 更新 meta theme-color
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) {
    meta.content = theme === this.DARK ? '#0f172a' : '#f0f8ff';
  }
}
```

- 设置 `<html>` 元素的 `data-theme` 属性
- 更新 `<meta name="theme-color">` 的值（影响移动端浏览器顶栏颜色）
  - Dark: `#0f172a`（深蓝）
  - Light: `#f0f8ff`（Alice Blue）

### 点击事件逻辑

```javascript
this.toggle.addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === this.DARK ? this.LIGHT : this.DARK;
  this.apply(next);
  localStorage.setItem(this.STORAGE_KEY, next);
});
```

### 与默认布局的协作

`default.html` 的 `<head>` 中有一个内联脚本，在页面加载时同步应用主题（防止闪烁）。`ThemeManager.init()` 在 DOM 加载完成后再次确认主题状态并绑定交互。

---

## 2. MobileMenu — 移动端菜单

### 功能

控制汉堡菜单的展开/收起，提供移动端导航体验。

### DOM 元素

| ID | 元素 | 说明 |
|----|------|------|
| `menuToggle` | `<button>` | 汉堡按钮 (☰ / ✕) |
| `mobileMenu` | `<div>` | 移动端菜单面板 |

### init() 方法

注册三类事件监听器：

#### 2.1 汉堡按钮点击

```javascript
this.toggle.addEventListener('click', () => {
  this.menu.classList.toggle('active');
  this.toggle.textContent = this.menu.classList.contains('active') ? '✕' : '☰';
});
```

- 切换 `.mobile-menu` 的 `active` 类（控制显示/隐藏）
- 同步更新按钮图标

#### 2.2 菜单链接点击

```javascript
this.menu.querySelectorAll('.mobile-link').forEach(link => {
  link.addEventListener('click', () => {
    this.menu.classList.remove('active');
    this.toggle.textContent = '☰';
  });
});
```

点击任意菜单链接后自动关闭菜单。

#### 2.3 点击外部区域关闭

```javascript
document.addEventListener('click', (e) => {
  if (!this.toggle.contains(e.target) && !this.menu.contains(e.target)) {
    this.menu.classList.remove('active');
    this.toggle.textContent = '☰';
  }
});
```

点击页面其他区域（非按钮和菜单面板）时关闭菜单。

### CSS 配合

- `.mobile-menu` 默认 `display: none`
- `.mobile-menu.active` 设置 `display: block` + `slideDown` 动画
- `.menu-toggle` 在 > 768px 时 `display: none`

---

## 3. NavbarScroll — 导航栏滚动阴影

### 功能

页面滚动超过 50px 时，为导航栏添加阴影效果。

### DOM 元素

| 选择器 | 元素 |
|--------|------|
| `.navbar` | 导航栏 |

### init() 方法

```javascript
init() {
  this.navbar = document.querySelector('.navbar');
  if (!this.navbar) return;

  let lastScroll = 0;
  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const currentScroll = window.pageYOffset;
        if (currentScroll > 50) {
          this.navbar.style.boxShadow = 'var(--shadow-soft)';
        } else {
          this.navbar.style.boxShadow = 'none';
        }
        lastScroll = currentScroll;
        ticking = false;
      });
      ticking = true;
    }
  });
}
```

### 性能优化

使用 `requestAnimationFrame` 节流模式：

1. 滚动事件触发时，检查 `ticking` 标志
2. 如果没有待处理的动画帧，请求一个新的 `requestAnimationFrame`
3. 在动画帧回调中执行 DOM 操作
4. 重置 `ticking` 标志

这避免了在每个滚动事件上都执行 DOM 操作，确保每帧最多执行一次。

### 阴影值

| 条件 | box-shadow |
|------|------------|
| `scrollY > 50` | `var(--shadow-soft)`（Light: `0 4px 20px rgba(43,141,214,0.08)`, Dark: `0 4px 20px rgba(0,0,0,0.3)`） |
| `scrollY ≤ 50` | `none` |

---

## 4. SmoothScroll — 平滑滚动

### 功能

为页面内锚点链接 (`href="#xxx"`) 提供平滑滚动效果。

### init() 方法

```javascript
init() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}
```

### 逻辑

1. 选取所有 `href` 以 `#` 开头的链接
2. 跳过纯 `#` 链接（`targetId === '#'`）
3. 查找目标元素
4. 阻止默认跳转行为
5. 使用 `scrollIntoView` API 平滑滚动到目标位置

### 使用场景

- 标签页面中，标签云点击跳转到对应标签的文章列表
- 分类页面中，分类卡片点击跳转到对应分类
- 文章内容中的目录锚点跳转

---

## 5. 事件绑定和初始化流程

### 时序

```
页面加载
│
├── <head> 中内联脚本执行（同步）
│   └── 读取 localStorage → 设置 data-theme（防闪烁）
│
├── HTML 解析
│   ├── 渲染 navigation.html
│   ├── 渲染页面内容
│   └── 渲染 footer.html
│
├── DOMContentLoaded 事件触发
│   ├── ThemeManager.init()          // 绑定主题按钮 + 确认主题
│   ├── MobileMenu.init()            // 绑定菜单按钮 + 关闭逻辑
│   ├── NavbarScroll.init()          // 绑定滚动监听
│   ├── SmoothScroll.init()          // 绑定锚点链接
│   ├── CodeBlockManager.init()      // 处理代码块复制按钮
│   ├── BackToTop.init()             // 绑定返回顶部按钮
│   ├── ReadingProgress.init()       // 绑定阅读进度条 + 庆祝动画
│   ├── TOCManager.init()            // 构建文章目录
│   ├── SearchManager.init()         // 加载搜索数据 + 绑定事件
│   ├── LightboxManager.init()       // 绑定图片灯箱
│   ├── RippleManager.init()         // 绑定涟漪效果
│   ├── ScrollReveal.init()          // 初始化滚动动画观察器
│   ├── ToastManager.init()          // 初始化 Toast 容器
│   ├── CommentManager.init()        // 初始化评论引导
│   ├── ShareManager.init()          // 绑定分享按钮
│   ├── LikeManager.init()           // 绑定点赞按钮
│   ├── PollManager.init()           // 初始化投票组件
│   ├── QuizManager.init()           // 初始化测验组件
│   ├── AchievementManager.init()    // 初始化成就系统
│   ├── PlaygroundManager.init()     // 加载 Monaco Editor + 初始化编辑器
│   ├── GameManager.init()           // 初始化迷你游戏
│   ├── SkeletonManager.init()       // 显示骨架屏 → 渐显内容
│   ├── TypewriterManager.init()     // 初始化标题打字机效果
│   ├── Card3DManager.init()         // 绑定卡片 3D 悬停效果
│   └── StatsManager.init()          // 加载统计数据
│
└── main.js 使用 defer 加载，确保在 DOM 解析后执行
```

### 防御性编程

每个模块的 `init()` 方法都包含 DOM 元素存在性检查：

```javascript
if (!this.toggle) return;  // ThemeManager
if (!this.toggle || !this.menu) return;  // MobileMenu
if (!this.navbar) return;  // NavbarScroll
```

如果对应的 DOM 元素不存在（例如某些特殊页面），模块会静默跳过，不会报错。

### 作用域隔离

所有代码封装在 IIFE `(function() { ... })()` 中，不会污染全局命名空间。各模块之间无依赖关系，可以独立修改。

---

## 6. CodeBlockManager — 代码块复制

### 功能

为代码块添加复制按钮和语言标签，提升代码阅读体验。

### 特性

- 自动检测代码语言
- 代码块头部显示三个圆点 + 语言标签
- 复制按钮带 SVG 图标
- 复制成功后显示"已复制!"提示
- 2 秒后自动恢复按钮状态

---

## 7. BackToTop — 返回顶部

### 功能

页面滚动超过 300px 后显示返回顶部按钮。

### 特性

- 初始隐藏，滚动后渐显
- 点击平滑滚动回顶部
- 使用 `requestAnimationFrame` 节流

---

## 8. ReadingProgress — 阅读进度条

### 功能

在文章详情页显示阅读进度条，读完全文时触发庆祝动画。

### 特性

- 仅在 `single.html` 布局显示
- 进度条宽度随滚动位置动态变化
- 0% 在顶部，100% 在底部
- 使用 `requestAnimationFrame` 节流
- 遵守 `prefers-reduced-motion` 设置

### 完成庆祝动画

当阅读进度达到 100% 时触发：

1. **Canvas 彩纸动画**：使用 Canvas 绘制 100 个彩色矩形纸片，从屏幕上方飘落，持续 180 帧后自动移除
2. **Toast 通知**：显示"🎉 恭喜你读完了这篇文章！"
3. **成就联动**：触发 `read_complete` 成就解锁
4. **阅读记录**：将文章标题保存到 localStorage `read_posts` 数组
5. **只触发一次**：`hasCelebrated` 标志防止重复播放

---

## 9. TOCManager — 文章目录

### 功能

自动从文章内容中提取标题生成目录。

### 特性

- 提取 h2/h3/h4 标题
- 桌面端：右侧固定目录，滚动时高亮当前章节
- 移动端：可折叠目录面板
- 使用 `IntersectionObserver` 实现滚动高亮
- 通过 Front Matter `toc: false` 可关闭

---

## 10. SearchManager — 搜索功能

### 功能

纯前端搜索，支持关键词匹配。

### 特性

- 异步加载 `search.json` 索引
- 支持标题、摘要、分类、标签搜索
- 搜索结果高亮匹配文本
- Ctrl/Cmd+K 快捷键打开
- ESC 键关闭
- 300ms 防抖

---

## 11. LightboxManager — 图片灯箱（缩略图 + 按需加载原图）

### 功能

点击文章内图片弹出全屏查看，支持缩略图快速加载和原图按需加载。

### 特性

- 自动将 `.post-content img` 的 src 替换为压缩缩略图（`assets/images/thumbs/`）
- 原图路径存储在 `data-original` 属性
- 点击图片打开灯箱时：显示旋转加载圈 → 后台加载原图 → 加载完成后渐显显示
- 半透明遮罩 + 居中显示
- 点击遮罩或 ESC 关闭
- 关闭时带缩放动画
- 移动端支持
- `prefers-reduced-motion` 时禁用动画

### 图片压缩

- 使用 `scripts/generate_thumbs.py` 生成压缩缩略图
- 缩略图最大宽度 800px，JPEG 质量 60%
- 原始图片 57MB → 缩略图 1.3MB（压缩率 98%）
- 页面加载时只下载缩略图，点击后才加载原图

---

## 12. RippleManager — 涟漪效果

### 功能

为按钮添加 Material Design 风格的涟漪点击效果。

### 使用方式

在 HTML 元素上添加 `data-ripple` 属性即可启用涟漪效果。

### 特性

- 事件委托：监听 `document` 上的 `click` 事件
- 自动计算涟漪大小和位置
- 涟漪动画 600ms 后自动移除 DOM 元素

---

## 13. ScrollReveal — 滚动显示动画

### 功能

使用 `IntersectionObserver` 实现元素进入视口时的淡入/滑入动画。

### 使用方式

在 HTML 元素上添加对应的 CSS 类：

| CSS 类 | 动画效果 |
|--------|----------|
| `.reveal` | 从下方淡入 |
| `.reveal-left` | 从左侧滑入 |
| `.reveal-right` | 从右侧滑入 |
| `.reveal-scale` | 缩放淡入 |
| `.reveal-stagger` | 子元素交错淡入 |

### 特性

- 使用 `IntersectionObserver` API，性能优秀
- 元素进入视口后添加 `.revealed` 类触发 CSS 过渡
- 触发后自动取消观察（只执行一次）
- 遵守 `prefers-reduced-motion` 设置

---

## 14. ToastManager — Toast 通知

### 功能

提供轻量级的浮动通知组件。

### 使用方式

```javascript
// 在 JS 中调用
ToastManager.success('操作成功');
ToastManager.error('操作失败');
ToastManager.info('提示信息');
```

### 特性

- 支持三种类型：`success`、`error`、`info`
- 自动创建容器元素
- 3 秒后自动消失（可自定义）
- CSS 过渡动画

---

## 15. CommentManager — 评论系统管理器

### 功能

管理 Giscus 评论系统的交互体验。

### 特性

- 评论引导提示：首次访问时显示友好提示
- 提示可关闭，状态保存在 localStorage
- 与 Giscus 主题同步

---

## 16. ShareManager — 分享管理器

### 功能

提供多种文章分享方式。

### 分享方式

| 方式 | 说明 |
|------|------|
| 微信 | Canvas 生成二维码，弹窗显示 |
| 微博 | 跳转分享链接 |
| X/Twitter | 跳转分享链接 |
| 复制链接 | Clipboard API + Toast 提示 |
| 系统分享 | Web Share API（移动端优先） |

### 特性

- 分享统计：localStorage 记录分享次数
- 成就联动：触发"分享达人"成就
- Glassmorphism 风格弹窗

---

## 17. LikeManager — 点赞管理器

### 功能

文章点赞系统，带粒子爆炸动画。

### 特性

- 心形动画：点赞时心形放大缩小
- 粒子爆炸：Canvas 绘制彩色粒子动画
- 本地存储：localStorage 持久化点赞状态
- 状态同步：点赞后按钮样式实时更新

### 数据结构

```javascript
{
  "post_likes": {
    "post-slug": {
      "count": 5,
      "liked": true
    }
  }
}
```

---

## 18. PollManager — 投票管理器

### 功能

文章投票系统，支持单选和多选。

### 特性

- Front Matter 配置投票选项
- 单选/多选模式
- 投票后显示结果动画（水平柱状图 + 百分比）
- 本地存储：防止重复投票
- 成就联动：触发"投票达人"成就

### 使用方式

在文章 Front Matter 中添加：

```yaml
poll:
  question: "你的问题"
  multiple: false  # 或 true
  options:
    - text: "选项1"
      emoji: "😀"
    - text: "选项2"
      emoji: "😎"
```

---

## 19. QuizManager — 测验管理器

### 功能

知识小测验系统，支持多种题型。

### 题型

| 类型 | 说明 |
|------|------|
| `single` | 单选题 |
| `multi` | 多选题 |

### 特性

- 即时反馈：选择后立即显示正确/错误
- 解释显示：每道题显示详细解释
- 分数统计：完成后显示总分和评语
- 重新测验：支持重新开始
- 成就联动：满分触发"测验满分"成就

### 使用方式

在文章 Front Matter 中添加：

```yaml
quiz:
  - question: "问题"
    type: "single"  # 或 "multi"
    options:
      - text: "选项A"
      - text: "选项B"
    answer: 0  # 正确答案索引（单选）或数组（多选）
    explanation: "解释说明"
```

---

## 20. AchievementManager — 成就管理器

### 功能

成就徽章系统，激励用户互动。

### 成就列表

| 成就 | 触发条件 |
|------|----------|
| 👋 初来乍到 | 首次访问 |
| 🌙 暗夜精灵 | 切换暗色模式 |
| 📖 求知若渴 | 阅读 5 篇文章 |
| 💻 代码达人 | 复制代码 10 次 |
| 💬 互动先锋 | 首次评论 |
| 🔗 分享达人 | 首次分享 |
| 🔍 探索者 | 使用搜索 |
| 🎓 学富五车 | 阅读 15 篇文章 |
| 🏆 全文通读 | 阅读进度 100% |
| 🗳️ 投票达人 | 投票 5 次 |
| 🧠 测验满分 | 测验满分 |
| ⭐ 忠实读者 | 连续 7 天访问 |
| 👑 博学多才 | 解锁 10 个徽章 |

### 特性

- 解锁通知：Toast 通知动画
- 成就墙：独立面板展示所有徽章
- 进度追踪：未解锁徽章显示当前进度
- 本地存储：localStorage 持久化状态

---

## 21. PlaygroundManager — 代码 Playground

### 功能

内嵌代码编辑器，支持 HTML/CSS/JavaScript 实时编辑和预览，基于 Monaco Editor（VS Code 同款编辑器引擎）。

### 特性

- 按需加载 Monaco Editor（CDN），仅在页面存在 `.playground-container` 时加载
- 支持三种语言：HTML、CSS、JavaScript
- 自定义 Light/Dark 两套编辑器主题，跟随站点主题自动切换
- 三种视图模式：编辑器（editor）、预览（preview）、分屏（split）
- 工具栏：运行、重置、复制代码按钮
- HTML 代码直接写入 iframe；CSS 代码注入预设 HTML 模板；JavaScript 代码在 iframe 中执行并捕获错误
- 每种语言提供内置默认代码模板
- 与 ThemeManager 联动：主题切换时同步更新编辑器主题
- 与 ToastManager 联动：复制代码成功时显示 Toast

### DOM 结构

| 选择器 | 元素 | 说明 |
|--------|------|------|
| `.playground-container` | `<div>` | Playground 容器（`id="playground-{id}"`） |
| `.playground-editor` | `<div>` | Monaco Editor 挂载点（`data-default-code` 存储默认代码） |
| `.playground-preview` | `<iframe>` | 代码预览 iframe |
| `.playground-tab` | `<button>` | 视图切换标签（`data-tab="editor/preview/split"`） |
| `.playground-run` | `<button>` | 运行按钮 |
| `.playground-reset` | `<button>` | 重置按钮 |
| `.playground-copy` | `<button>` | 复制按钮 |
| `.playground-status` | `<span>` | 运行状态指示 |

### Monaco Editor 配置

```javascript
{
  minimap: { enabled: false },
  fontSize: 14,
  lineHeight: 22,
  padding: { top: 16, bottom: 16 },
  scrollBeyondLastLine: false,
  automaticLayout: true,
  tabSize: 2,
  wordWrap: 'on',
  scrollbar: { verticalScrollbarSize: 8, horizontalScrollbarSize: 8 }
}
```

---

## 22. GameManager — 迷你游戏

### 功能

提供三种可嵌入文章的交互式小游戏。

### 支持的游戏类型

| 类型 | `data-type` | 说明 |
|------|-------------|------|
| CSS 选择器挑战 | `css-selector` | 输入 CSS 选择器选中目标元素 |
| 代码打字练习 | `typing-race` | 60 秒内尽可能多地输入代码片段 |
| 终端猜数字 | `terminal-guess` | 终端风格的 1-100 猜数字游戏 |

### 通用特性

- 最高分记录：localStorage 持久化（按游戏类型分别存储）
- 分数系统：实时更新当前分数和最高分
- 重启功能：支持重新开始游戏
- 成就联动：与 ToastManager 集成，游戏完成时显示通知

### CSS 选择器挑战

- 10 个递进难度的关卡，从基础元素选择器到复合选择器
- 实时 DOM 预览，正确选中时高亮目标元素
- 每关显示提示信息
- 输入无效选择器时显示语法错误提示
- 答对 +10 分

### 代码打字练习

- 5 个 JavaScript 代码片段随机出现
- 60 秒倒计时
- 实时统计：正确字符数、错误字符数、准确率、WPM（每分钟字数）
- 字符级实时对比：正确字符绿色，错误字符红色
- 得分 = 正确字符 × 10 - 错误字符 × 5

### 终端猜数字

- 终端风格 UI，模拟命令行交互
- 随机生成 1-100 的目标数字
- 猜测后显示"太大"/"太小"提示
- 记录猜测次数和最佳纪录
- 得分 = max(0, 100 - 猜测次数 × 5)

### DOM 结构

| 选择器 | 元素 | 说明 |
|--------|------|------|
| `.game-container` | `<div>` | 游戏容器（`data-type` 指定游戏类型） |
| `#gameScore` | `<span>` | 当前分数 |
| `#highScore` | `<span>` | 最高分 |
| `#gameRestart` | `<button>` | 重启按钮 |

---

## 23. SkeletonManager — 骨架屏

### 功能

在首页文章列表加载时显示骨架屏占位，内容就绪后平滑过渡。

### 特性

- DOM 加载完成后延迟 500ms 显示内容（模拟加载等待）
- 骨架屏渐隐 → 内容渐显的过渡动画（各 300ms CSS transition）
- 骨架屏隐藏后切换为 `display: none`
- 内容显示后触发 `ScrollReveal.init()` 重新初始化滚动动画
- 仅在首页（存在 `#skeletonGrid` 和 `#postsGrid`）生效

### DOM 元素

| ID | 元素 | 说明 |
|----|------|------|
| `skeletonGrid` | `<div>` | 骨架屏占位网格 |
| `postsGrid` | `<div>` | 实际文章列表网格 |

---

## 24. TypewriterManager — 打字机效果

### 功能

文章标题逐字打出的打字机动画效果。

### 特性

- 仅在文章详情页生效（存在 `#postTitle` 元素）
- 每篇文章首次访问时播放，后续访问跳过（localStorage 记录）
- 遵守 `prefers-reduced-motion`：用户开启减弱动态效果时直接显示原文
- 打字速度：每字符 50ms
- 打字完成后光标闪烁 3 次（6 次切换，每次 500ms），然后移除动画类

### 动画流程

```
1. 检查 prefers-reduced-motion → 如开启则跳过
2. 检查 localStorage typewriter_shown 数组 → 如已访问则跳过
3. 保存原始文本，清空标题内容
4. 添加 typewriter-active 类
5. 逐字添加字符（50ms 间隔）
6. 打字完成 → 光标闪烁 3 次
7. 移除 typewriter-active 和 typewriter-cursor 类
```

### 常量

| 常量 | 值 | 用途 |
|------|-----|------|
| `STORAGE_KEY` | `'typewriter_shown'` | localStorage 存储键名，值为已访问路径数组 |

---

## 25. Card3DManager — 3D 卡片效果

### 功能

为文章卡片添加鼠标跟随的 3D 悬停效果。

### 特性

- 仅桌面端生效（检测 `ontouchstart`，触屏设备跳过）
- 鼠标移动时根据光标位置计算旋转角度
- 透视距离 1000px，最大旋转角 ±（卡片宽高 / 20）度
- 悬停时轻微放大（scale3d 1.02）
- 动态阴影：阴影偏移方向与旋转方向相反
- 鼠标离开时平滑恢复原始状态

### 目标元素

| 选择器 | 说明 |
|--------|------|
| `.post-card` | 普通文章卡片 |
| `.featured-card` | 精选文章卡片 |

### 变换公式

```javascript
rotateX = (mouseY - centerY) / 20;  // 垂直旋转
rotateY = (centerX - mouseX) / 20;  // 水平旋转
transform: perspective(1000px) rotateX(rotateX) rotateY(rotateY) scale3d(1.02, 1.02, 1.02);
boxShadow: ${-rotateY * 2}px ${rotateX * 2}px 30px rgba(0, 0, 0, 0.15);
```

---

## 26. StatsManager — 统计数据管理器

### 功能

读取全局统计数据并显示。

### 特性

- 异步加载 `assets/data/stats.json`
- 更新页脚统计信息
- 更新文章页面的全局数据
- 静默处理加载失败

### 数据来源

由 GitHub Actions 定期更新，使用 GitHub GraphQL API 获取 Discussions 的 reactions 和评论数。
