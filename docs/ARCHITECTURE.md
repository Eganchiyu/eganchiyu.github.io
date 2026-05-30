# 项目架构文档

> 最后更新: 2026-05-30

## 目录结构

```
eganchiyu.github.io/
├── _config.yml              # Jekyll 全局配置
├── _data/                   # 数据文件
│   ├── navigation.yml       # 导航菜单配置
│   └── ui-text.yml          # 多语言 UI 文本
├── _includes/               # 可复用模板片段
│   ├── navigation.html      # 导航栏（桌面 + 移动端）
│   ├── footer.html          # 页脚
│   ├── skip-links.html      # 无障碍跳过链接
│   └── comments-providers/  # 评论系统
│       └── giscus.html      # Giscus 评论组件
├── _layouts/                # 页面布局模板
│   ├── default.html         # 基础骨架（所有页面继承）
│   ├── home.html            # 首页布局
│   └── single.html          # 文章页布局
├── _posts/                  # 博客文章（Markdown）
├── assets/
│   ├── css/
│   │   └── main.scss        # 主样式表（含设计系统 + 双主题）
│   ├── fonts/               # 本地字体（Inter + JetBrains Mono）
│   ├── images/
│   │   ├── avatar.png       # 头像图片
│   │   ├── favicon.svg      # SVG Favicon
│   │   └── thumbs/          # 压缩缩略图
│   └── js/
│       └── main.js          # 主交互脚本
├── about.md                 # 关于我页面
├── categories.html          # 分类页
├── tags.html                # 标签页
├── year-archive.html        # 时间线归档页
├── index.html               # 首页入口
├── 404.html                 # 自定义 404 页面
├── robots.txt               # SEO 爬虫配置
├── search.json              # 搜索索引（Liquid 模板）
├── CHANGELOG.md             # 变更日志
├── Gemfile                  # Ruby 依赖
└── docs/                    # 项目文档
    ├── README.md            # 文档入口
    ├── ARCHITECTURE.md      # 本文件
    └── ...                  # 其他模块文档
```

## 设计系统

### 色彩方案

主题采用 **Alice Blue** 色系，支持 Light/Dark 双模式。

| 变量 | Light | Dark | 用途 |
|------|-------|------|------|
| `--alice-500` | `#2b8dd6` | `#4ba9e9` | 主色调 |
| `--text-primary` | `#2d3748` | `#e2e8f0` | 主要文字 |
| `--bg-primary` | `#ffffff` | `#0f172a` | 页面背景 |
| `--bg-card` | `rgba(255,255,255,0.85)` | `rgba(30,41,59,0.85)` | 卡片背景 |

强调色来自头像配色：
- `--accent-pink`: `#f5a0b8`
- `--accent-teal`: `#7dd3c0`
- `--accent-lavender`: `#b8a9e8`

### 响应式断点

| 断点 | 宽度 | 布局变化 |
|------|------|---------|
| 桌面 | > 900px | 双栏 Hero + 完整导航 |
| 平板 | 768-900px | 缩小 Hero 间距 |
| 手机 | < 768px | 单栏 + 汉堡菜单 |
| 小屏 | < 480px | 紧凑间距 + 垂直按钮 |

## 文件职责

### `_layouts/default.html`

所有页面的基础骨架。职责：
- HTML 结构（head/body）
- 字体加载（Google Fonts）
- 主题初始化脚本（防止闪烁）
- 引入 navigation、footer、main.js

### `_layouts/home.html`

首页布局。职责：
- Hero 区域（头像卡片 + 个人简介）
- 精选文章区域（`featured: true` 标记，仅第一页显示）
- 文章卡片列表（瀑布流布局，支持封面图）
- 分页导航

### `_layouts/single.html`

文章页布局。职责：
- 阅读进度条
- 面包屑导航
- 文章头部（标题 + 元信息 + 标签）
- 文章封面图（可选）
- 文章目录 TOC（桌面端右侧固定，移动端可折叠）
- 文章内容渲染
- 分享链接
- 相关文章推荐
- Giscus 评论区
- 上一篇 / 下一篇导航

### `_includes/navigation.html`

导航栏组件。职责：
- 桌面端导航链接（首页、分类、标签、归档、关于、GitHub）
- 移动端汉堡菜单
- 搜索按钮（打开搜索模态框）
- 主题切换按钮

### `assets/css/main.css`

主样式表。职责：
- CSS 变量定义（Light/Dark 双主题）
- 全局样式重置
- 组件样式（导航、卡片、文章、精选、评论区等）
- 响应式适配
- 打印样式
- 无障碍（减少动画）

### `assets/js/main.js`

主交互脚本（~580 行）。职责：
- ThemeManager — 主题切换（localStorage 持久化）+ Giscus 主题同步
- MobileMenu — 移动端菜单开关
- NavbarScroll — 导航栏滚动阴影
- SmoothScroll — 平滑滚动
- CodeBlockManager — 代码块复制按钮
- BackToTop — 返回顶部按钮
- ReadingProgress — 阅读进度条
- TOCManager — 文章目录
- SearchManager — 搜索功能
- LightboxManager — 图片灯箱

## 主题切换机制

1. 用户点击 🌙/☀️ 按钮
2. JS 切换 `data-theme` 属性（`light` ↔ `dark`）
3. 保存到 `localStorage`
4. CSS 通过 `[data-theme="dark"]` 选择器切换变量
5. 页面加载时内联脚本读取 localStorage，防止闪烁

**浏览器强制深色模式处理**：
- 默认不跟随系统深色模式
- 用户主动选择后才启用深色主题
- 使用 `color-scheme` 属性告知浏览器

## Git 工作流

```
main                    ← 生产分支（GitHub Pages 自动部署）
feature/modern-redesign ← 功能分支（开发完成后合并到 main）
```

提交规范：[Conventional Commits](https://www.conventionalcommits.org/)
