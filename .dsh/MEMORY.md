# Workspace Memory - eganchiyu.github.io

## 项目架构
- 基于 Jekyll 的个人博客（GitHub Pages），采用自定义二次元 Alice Blue 主题（支持 Light / Dark 双模式）。
- 核心模板：`_layouts/default.html`、`_layouts/home.html`、`_includes/navigation.html`。
- 核心样式与脚本：`assets/css/main.scss`、`assets/js/main.js`。

## 首页启动构建动效 (SwarmIntroManager)
- 首次访问首页自动触发（记录于 `localStorage` 的 `cyber_swarm_intro_seen_v1`），可通过导航栏右侧 `✨` 按钮（`#swarmReplayBtn`）或 URL 参数 `/?intro=1` 随时手动重播。
- 采用 12 个抽象人生羁绊/精神词汇（亲情、友情、同学、网络、热爱、理想、好奇心、初心、青春、灵感、代码、回忆）作为协同 Agent，使用四次方缓动（`easeOutQuart`）仅针对首屏核心可见区域构建，旋涡散开瞬间 0 停顿并发直奔各自首个任务，每个 Agent 完成自身最后任务后各自异步向右下角移出屏幕淡出消失。
