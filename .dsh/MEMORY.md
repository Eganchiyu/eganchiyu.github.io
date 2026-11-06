# Workspace Memory - eganchiyu.github.io

## 项目架构
- 基于 Jekyll 的个人博客（GitHub Pages），采用自定义二次元 Alice Blue 主题（支持 Light / Dark 双模式）。
- 核心模板：`_layouts/default.html`、`_layouts/home.html`、`_includes/navigation.html`。
- 核心样式与脚本：`assets/css/main.scss`、`assets/js/main.js`（约定：开发记录追加到 `memo/Log.md`）。
- 本机无 ruby/jekyll/bundle 与 sass，无法本地构建；验证动效可用 `/tmp` 静态桩页 + `google-chrome --headless=new --remote-debugging-port` + Python `websockets` 驱动 CDP。

## 首页布局与启动构建动效 (Bento Grid + SwarmIntroManager)
- 首页首屏（`.hero.hero-bento-screen`）采用独立占满一屏（`min-height: calc(100vh - 3.5rem)`）的 12 列 Bento Grid 现代仪表盘（主介绍卡 `.bento-intro`、个人名片卡 `.bento-profile`、技术栈卡 `.bento-tech`、探索方向卡 `.bento-focus`、近期文章卡 `.bento-latest`）。
- 精选文章（`.featured-grid`）与最新文章（`.posts-grid`）均采用双列等高 CSS Grid（`grid-template-columns: repeat(2, minmax(0, 1fr))`）。
- 首次访问首页自动触发 `SwarmIntroManager`（记录于 `localStorage` 的 `cyber_swarm_intro_seen_v1`），可通过导航栏右侧 `✨` 按钮（`#swarmReplayBtn`）或 URL 参数 `/?intro=1` 手动重播。
- 12 个羁绊 Agent 采用两级同步队列：先并发拉开主画板与 5 张 Bento 卡片外框及导航栏，父卡片完成后再构建卡片内部组件，确保无内容漏出框外。
- 打字机任务时长公式：`Math.min(1350, Math.max(400, len * 42))`（每字约 42ms）。
- 顶栏 `#swarmReplayBtn` 不参与构建任务，动画期间带 `swarm-replay-pending` 隐藏且不可点。
- 结尾演出：第 13 只光标「爱」衔重播图标（`.swarm-carry-icon`）飞入顶栏，按钮 `is-tilted` 歪放 → 模拟点击 + 涟漪 → `is-springing` Q 弹回正 → 光标退场，同时 HUD 进度条 `is-collapsed` 收起。
- 时间线用 `runId` + `isAlive(run)` 守卫（`moveAgentTo`/`wait`/`runTimeline` 均校验），防止中途重播导致新旧任务互踩、白屏。
