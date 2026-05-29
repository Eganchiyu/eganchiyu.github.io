# Changelog

本文档记录项目的重要变更。

格式基于 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.0.0/)，
版本遵循 [语义化版本](https://semver.org/lang/zh-CN/)。

## [未发布]

### 计划
- 深色模式图片适配（减少亮度）
- 代码块语法高亮优化
- 文章目录（TOC）支持
- 搜索功能
- 评论系统集成

## [2.2.0] - 2026-05-29

### 新增
- 自定义 404 错误页面，展示最新文章推荐
- SVG Favicon（蓝色圆形 + 白色 "E" 字母）
- `robots.txt` SEO 爬虫指引文件
- Skip Links 无障碍支持（Tab 键触发）
- Open Graph 和 Twitter Card 社交分享标签
- 返回顶部按钮（滚动 300px 后显示，平滑滚动）
- 文章页面包屑导航（首页 > 分类 > 标题）
- 上一篇/下一篇文章导航

### 变更
- MathJax 改为全局加载（移除条件判断），所有页面支持 LaTeX 渲染
- 分类/标签/归档页内联样式迁移到 `main.css` 统一管理
- Favicon 引用从 PNG 更新为 SVG 格式

### 修复
- Skip Links 默认隐藏，仅键盘聚焦时显示

## [2.1.1] - 2026-05-29

### 修复
- LaTeX 数学公式渲染：将 kramdown `math_engine` 从 `null` 改为 `mathjax`，添加 MathJax v3 CDN 脚本到布局
- MathJax 容器样式适配暗色模式

### 变更
- `.gitignore` 添加 `.trae/` 目录忽略规则，移除 IDE 配置文件的版本控制
- Post_Commit_Check 技能增强：新增 docs 文件夹同步检查脚本、CHANGELOG 更新流程、提交推送规范

## [2.1.0] - 2026-05-28

### 新增
- GitHub Issue 模板：Bug 报告、功能建议、内容反馈（YAML 表单格式）
- GitHub PR 模板、贡献指南、CODEOWNERS、FUNDING.yml
- GitHub Actions 部署 workflow (actions/deploy-pages)
- `.trae/` 目录：项目规则 + 4 个 Skill 文件（Jekyll 基础、主题定制、写作、部署）
- `docs/` 模块文档：layouts、components、styling、javascript、posts、configuration（共 6 篇）

### 变更
- `.github/workflows/build.yml` 从 Minimal Mistakes 模板替换为 GitHub Pages 标准部署
- `docs/README.md` 更新为完整文档导航入口
- `README.md` 项目结构更新，添加 `.github/`、`.trae/`、`docs/` 说明

### 移除
- Minimal Mistakes 主题仓库的 Issue 模板（bug_report、documentation）
- Minimal Mistakes 的 PR 模板和 CONTRIBUTING.md（指向 mmistakes/minimal-mistakes）

## [2.0.0] - 2026-05-27

### 新增
- 深色模式支持（手动切换，localStorage 持久化）
- 主题切换按钮（🌙/☀️）
- 分类页面 (`/categories/`)
- 标签云页面 (`/tags/`)
- 时间线归档页面 (`/year-archive/`)
- 响应式移动端适配
- 打印样式
- 无障碍支持（减少动画偏好）
- 主题初始化内联脚本（防止页面闪烁）

### 变更
- 从 Minimal Mistakes 迁移至完全自定义布局
- 设计系统采用 Alice Blue 色系
- 导航栏增加 emoji 图标和毛玻璃效果
- 文章卡片增加左侧彩色条和悬浮动画
- 头像卡片增加统计数据展示
- 代码块采用深色背景配色

### 修复
- 移动端导航菜单兼容性
- 浏览器强制深色模式导致的样式问题
- 背景图在移动端的显示问题

## [1.1.0] - 2026-05-27

### 变更
- 清理 `_custom.scss` 重复定义
- 精简 `_config.yml` 配置
- 启用 giscus 评论系统
- 补全导航菜单
- 字体 CDN 迁移至 jsdelivr

## [1.0.0] - 2025-12-14

### 新增
- 基于 Minimal Mistakes 主题的博客
- GitHub Pages 自动部署
- 文章分类和标签
- 评论系统（giscus）
- 搜索功能（lunr）
