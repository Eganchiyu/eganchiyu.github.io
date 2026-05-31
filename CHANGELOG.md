# Changelog

本文档记录项目的重要变更。

格式基于 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.0.0/)，
版本遵循 [语义化版本](https://semver.org/lang/zh-CN/)。

## [未发布]

### 新增
- 评论系统优化：Giscus 容器样式定制（圆角、边框）、评论引导提示
- 内容分享功能：微信二维码分享、微博/X/复制链接/系统分享
- 文章点赞系统：心形动画、粒子爆炸效果、本地存储
- 阅读统计：阅读时长计算（400字/分钟）、站点总阅读时长显示
- 文章投票系统：Front Matter 配置、支持单选/多选、结果动画
- 知识小测验：单选/多选/判断题、即时反馈、分数统计
- 成就徽章系统：13种徽章、成就墙、进度追踪、解锁通知
- GitHub Actions 统计：每小时自动更新全局互动数据

### 修复
- 修复 Toast 通知 CSS 类名不匹配问题（`.toast.visible` → `.toast.show`）
- 修复搜索结果 XSS 安全风险（添加 `escapeHtml` 函数转义 HTML 实体）
- 修复 CSS 重复定义（清理重复的 `.post-content code`、`img:hover`、`.hero::before`）
- 修复 LightboxManager 硬编码路径（添加图片存在性检查，防止 404）
- 修复硬编码颜色值（添加 `--color-error` 变量替换硬编码红色）

### 计划
- 深色模式图片适配（减少亮度）

## [2.7.0] - 2026-05-30

### 移除
- 遗留文件清理：删除 116 个未使用的 Minimal Mistakes 主题文件（-77%）
  - `_layouts/`：11 个未使用的布局文件（archive, categories, tags 等）
  - `_includes/`：54 个未使用的模板文件（analytics, comments-providers, search 等）
  - `_sass/`：整个目录（68 个 SCSS 文件，含 vendor 库 susy/breakpoint/magnific-popup）
  - `assets/js/`：14 个遗留 JS 文件（jQuery、插件、Lunr 搜索库、旧版 main.js）
  - 根目录：3 个配置文件（gemspec、staticman.yml、.travis.yml）

### 变更
- `_config.yml` 移除 `assets/js/vendor` include 引用
- `_config.yml` 移除 `minimal-mistakes-jekyll.gemspec` exclude 项
- 构建速度提升 18%（0.405s → 0.333s）

### 文档
- 更新 `docs/ARCHITECTURE.md` 目录结构（移除已清理文件，添加 fonts/thumbs）
- 更新 `docs/DEVELOPMENT-PLAN.md` 遗留文件清理状态为已完成
- 更新 `docs/configuration.md` 修正 math_engine 配置说明

## [2.6.0] - 2026-05-30

### 新增
- 多层次阴影系统（--shadow-xs/sm/elevated/glow/inner）
- 渐变变量系统（--gradient-primary/subtle/warm/cool/surface/hero-bg）
- 玻璃态效果工具类（.glass-card）
- 渐变边框效果（精选文章卡片悬浮渐变边框）
- 排版比例系统（Major Third 1.25，9 级字体大小 + 行高 + 字间距变量）
- 滚动触发动画系统（.reveal/.reveal-left/.reveal-right/.reveal-scale/.reveal-stagger）
- 涟漪效果模块（RippleManager）
- Toast 通知系统（ToastManager，支持 success/error/info）
- 焦点环样式（:focus-visible 键盘导航无障碍）
- 触摸设备优化（@media (hover: none) 最小点击区域 44px）
- 自定义滚动条样式（WebKit 浏览器）
- 3D 卡片悬浮效果（头像卡片、文章卡片）
- Hero 按钮光泽扫过动画
- Hero 徽章呼吸发光动画
- 文章封面图底部渐变叠加层
- 标签渐变背景填充悬停效果

### 变更
- 导航栏添加玻璃态增强阴影
- 精选文章卡片悬浮效果增强（translateY -6px + 渐变边框）
- 文章卡片悬浮阴影升级为 --shadow-elevated
- 图标系统统一添加 transition 和悬浮缩放
- Hero 装饰元素添加发光阴影
- 文章封面图添加渐变叠加层
- 分享链接、相关文章、归档文章悬浮效果增强
- DEVELOPMENT-PLAN.md 标记第六阶段为已完成
- 同步更新 docs/styling.md 和 docs/javascript.md

## [2.5.0] - 2026-05-29

### 新增
- 字体本地托管（Inter + JetBrains Mono woff2 文件）
- JSON-LD 结构化数据（首页 WebSite 类型，文章页 Article 类型）
- 图片压缩缩略图系统（57MB → 1.3MB，压缩率 98%）
- 灯箱按需加载原图（点击后显示旋转加载圈，加载完成后渐显）
- `scripts/generate_thumbs.py` 图片压缩脚本

### 变更
- 移除 Google Fonts 外部依赖（消除 2 次 DNS 查询）
- `main.css` 重命名为 `main.scss`，利用 Jekyll Sass 自动压缩
- 灯箱从直接加载原图改为缩略图 + 按需加载模式
- 文章内图片 src 自动替换为压缩缩略图路径

### 文档
- 更新 `docs/styling.md` 反映 main.scss 变更
- 更新 `docs/layouts.md` 字体加载章节（本地托管）
- 更新 `docs/javascript.md` 灯箱功能说明（缩略图 + 按需加载）
- 更新 `DEVELOPMENT-PLAN.md` 第四阶段为已完成

## [2.4.0] - 2026-05-29

### 新增
- 首页双列网格布局（桌面端）
- 精选/置顶文章功能（Front Matter `featured: true`）
- Giscus 评论系统集成（基于 GitHub Discussions）
- 评论区主题跟随站点主题切换
- "关于我"页面 (`about.md`)
- 文章封面图支持（Front Matter `cover_image`）
- 首页精选文章区域样式
- 文章卡片封面图样式

### 变更
- 导航栏添加"关于"链接
- 移动端菜单添加"关于"链接
- 修复 `giscus.html` 中 `data-reactions-enabled` 属性值错误

### 文档
- 更新 `DEVELOPMENT-PLAN.md` 第三阶段为已完成
- 新增 11 项功能到已实现功能列表

## [2.3.0] - 2026-05-29

### 新增
- 阅读进度条（文章详情页顶部，3px 高渐变色）
- 文章目录 (TOC)（桌面端右侧固定，移动端可折叠）
- 搜索功能（纯前端实现，支持 Ctrl/Cmd+K 快捷键）
- 图片灯箱 (Lightbox)（点击图片全屏查看，ESC 关闭）
- 移动端菜单平滑过渡动画
- 移动端菜单遮罩层
- 表格响应式处理（移动端水平滚动）
- `search.json` 搜索索引文件

### 变更
- 移动端菜单从 `display:none/block` 改为 `transform` + `opacity` 过渡
- 菜单项添加依次淡入动画
- 表格样式添加 `display:block` 和 `overflow-x:auto`

### 文档
- 更新 `DEVELOPMENT-PLAN.md` 第二阶段为已完成
- 更新 `.trae/skills/theming.md` 添加新组件样式说明

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
