# Workspace Memory - eganchiyu.github.io

## 项目架构
- 基于 Jekyll 的个人博客（GitHub Pages），采用自定义二次元 Alice Blue 主题（支持 Light / Dark 双模式）。
- 核心模板：`_layouts/default.html`、`_layouts/home.html`、`_includes/navigation.html`。
- 核心样式与脚本：`assets/css/main.scss`、`assets/js/main.js`。

## 首页布局与启动构建动效 (Bento Grid + SwarmIntroManager)
- 首页首屏（`.hero.hero-bento-screen`）采用独立占满一屏（`min-height: calc(100vh - 3.5rem)`）的 12 列 Bento Grid 现代仪表盘（主介绍卡 `.bento-intro`、个人名片卡 `.bento-profile`、技术栈卡 `.bento-tech`、探索方向卡 `.bento-focus`、近期文章卡 `.bento-latest`）。
- 精选文章（`.featured-grid`）与最新文章（`.posts-grid`）均采用双列等高 CSS Grid（`grid-template-columns: repeat(2, minmax(0, 1fr))`）。
- 首次访问首页自动触发 `SwarmIntroManager`（记录于 `localStorage` 的 `cyber_swarm_intro_seen_v1`），可通过导航栏右侧 `✨` 按钮（`#swarmReplayBtn`）或 URL 参数 `/?intro=1` 手动重播。
- 12 个羁绊 Agent 采用两级同步队列：先并发拉开主画板与 5 张 Bento 卡片外框及导航栏，父卡片完成后再构建卡片内部组件，确保无内容漏出框外。
