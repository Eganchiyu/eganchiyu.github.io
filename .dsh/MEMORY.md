# Workspace Memory - eganchiyu.github.io

## 项目架构
- 基于 Jekyll 的个人博客（GitHub Pages），采用自定义二次元 Alice Blue 主题（支持 Light / Dark 双模式）。
- 核心模板：`_layouts/default.html`、`_layouts/home.html`、`_includes/navigation.html`。
- 核心样式与脚本：`assets/css/main.scss`、`assets/js/main.js`。

## 首页启动构建动效 (SwarmIntroManager)
- 首次访问首页自动触发（记录于 `localStorage` 的 `cyber_swarm_intro_seen_v1`），可通过导航栏右侧 `✨` 按钮（`#swarmReplayBtn`）或 URL 参数 `/?intro=1` 随时手动重播。
- 采用 24 个抽象人生羁绊/精神词汇（亲情、友情、同学、网络、热爱、理想等）作为协同 Agent，在首屏视口内完成 Figma 风格蓝图拉框、标尺对齐与打字机生成。
