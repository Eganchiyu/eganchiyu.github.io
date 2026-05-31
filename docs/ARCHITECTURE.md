# 项目架构文档

> 最后更新: 2026-05-31

## 技术栈

| 分类 | 技术 | 说明 |
|------|------|------|
| 静态生成器 | Jekyll 4.4 | 核心构建工具 |
| 运行环境 | Ruby 3.3 + Bundler | 依赖管理 |
| 前端主题 | 自定义 Alice Blue 主题 | 支持 Light/Dark 双模式 |
| 代码编辑器 | Monaco Editor | 代码 Playground 组件 |
| 评论系统 | Giscus | 基于 GitHub Discussions |
| 托管平台 | GitHub Pages | CI/CD 自动部署 |
| 样式 | SCSS | 主样式表 5800+ 行 |
| 脚本 | 原生 JS（模块化） | 25 个功能模块 |

## 目录结构

```
eganchiyu.github.io/
├── _config.yml                    # Jekyll 主配置
├── _layouts/                      # 页面布局模板（3 个）
│   ├── default.html               # 基础骨架（所有页面继承）
│   ├── home.html                  # 首页布局
│   └── single.html                # 文章页布局
├── _includes/                     # 可复用组件（14 个）
│   ├── navigation.html            # 导航栏（桌面 + 移动端）
│   ├── footer.html                # 页脚
│   ├── skip-links.html            # 无障碍跳过链接
│   ├── head-seo.html              # SEO 元标签
│   ├── head-custom.html           # 自定义 head 内容
│   ├── post-card.html             # 文章卡片组件
│   ├── toc.html                   # 文章目录
│   ├── comments-providers/
│   │   └── giscus.html            # Giscus 评论组件
│   ├── poll.html                  # 投票组件
│   ├── quiz.html                  # 测验组件
│   ├── playground.html            # 代码 Playground 组件
│   ├── game.html                  # 迷你游戏组件
│   ├── achievement-toast.html     # 成就通知组件
│   └── copyright.js               # 版权声明脚本
├── _posts/                        # 博文（18 篇 Markdown）
├── assets/
│   ├── css/
│   │   └── main.scss              # 主样式表（5800+ 行，含设计系统 + 双主题）
│   ├── js/
│   │   └── main.js                # 主交互脚本（2600+ 行，25 个模块）
│   ├── fonts/                     # 本地字体（Inter + JetBrains Mono）
│   ├── images/                    # 图片资源（原图 + thumbs/ 压缩缩略图）
│   └── data/
│       └── stats.json             # 统计数据
├── scripts/                       # 工具脚本
│   ├── fetch-stats.js             # 统计数据获取脚本
│   └── generate_thumbs.py         # 缩略图生成脚本
├── docs/                          # 项目文档
├── about.md                       # 关于我页面
├── categories.html                # 分类页
├── tags.html                      # 标签页
├── year-archive.html              # 时间线归档页
├── index.html                     # 首页入口
├── feed.xml                       # RSS 订阅源
├── 404.html                       # 自定义 404 页面
├── robots.txt                     # SEO 爬虫配置
├── search.json                    # 搜索索引（Liquid 模板）
├── CHANGELOG.md                   # 变更日志
├── Gemfile                        # Ruby 依赖
├── Gemfile.lock                   # 依赖锁定
├── package.json                   # Node.js 依赖（工具脚本）
├── Rakefile                       # Rake 任务定义
├── localhost-build.cmd            # 本地开发启动脚本
└── .github/
    └── workflows/
        └── build.yml              # CI/CD 部署工作流
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

### `_includes/` 可复用组件

| 组件 | 职责 |
|------|------|
| `navigation.html` | 导航栏（桌面端链接 + 移动端汉堡菜单 + 搜索按钮 + 主题切换） |
| `footer.html` | 页脚内容 |
| `skip-links.html` | 无障碍跳过链接 |
| `head-seo.html` | SEO 元标签（Open Graph、Twitter Cards 等） |
| `head-custom.html` | 自定义 head 内容钩子 |
| `post-card.html` | 文章卡片组件（封面图 + 标题 + 摘要 + 元信息） |
| `toc.html` | 文章目录（桌面端右侧固定，移动端可折叠） |
| `giscus.html` | Giscus 评论组件 |
| `poll.html` | 投票组件 |
| `quiz.html` | 测验组件 |
| `playground.html` | 代码 Playground 组件 |
| `game.html` | 迷你游戏组件 |
| `achievement-toast.html` | 成就通知组件 |
| `copyright.js` | 版权声明脚本 |

### `assets/css/main.scss`

主样式表（5800+ 行）。职责：
- CSS 变量定义（Light/Dark 双主题）
- 全局样式重置
- 组件样式（导航、卡片、文章、精选、评论区等）
- 响应式适配
- 打印样式
- 无障碍（减少动画）

### `assets/js/main.js`

主交互脚本（2600+ 行，25 个模块）。职责：

| 模块 | 功能 |
|------|------|
| ThemeManager | 主题切换（localStorage 持久化）+ Giscus 主题同步 |
| MobileMenu | 移动端菜单开关 |
| NavbarScroll | 导航栏滚动阴影 |
| SmoothScroll | 平滑滚动 |
| CodeBlockManager | 代码块复制按钮 |
| BackToTop | 返回顶部按钮 |
| ReadingProgress | 阅读进度条 |
| TOCManager | 文章目录 |
| SearchManager | 搜索功能 |
| LightboxManager | 图片灯箱 |
| RippleManager | 波纹效果 |
| ScrollReveal | 滚动显示动画 |
| ToastManager | 消息提示 |
| CommentManager | 评论区管理 |
| ShareManager | 分享功能 |
| LikeManager | 点赞功能 |
| PollManager | 投票管理 |
| QuizManager | 测验管理 |
| AchievementManager | 成就系统 |
| PlaygroundManager | 代码 Playground |
| GameManager | 迷你游戏 |
| SkeletonManager | 骨架屏加载 |
| TypewriterManager | 打字机效果 |
| Card3DManager | 3D 卡片效果 |
| StatsManager | 统计数据 |

### 独立页面（根目录）

| 页面 | 用途 |
|------|------|
| `about.md` | 关于我页面 |
| `categories.html` | 分类聚合页 |
| `tags.html` | 标签聚合页 |
| `year-archive.html` | 时间线归档页 |

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
