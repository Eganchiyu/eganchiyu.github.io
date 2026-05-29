# Eganchiyu 博客开发计划

> 最后更新：2026-05-29
> 基于对代码库的全面审查与分析制定
> **第一阶段已完成** ✅

---

## 目录

- [项目现状](#项目现状)
- [优化目标](#优化目标)
- [第一阶段：基础体验补全](#第一阶段基础体验补全)
- [第二阶段：交互体验增强](#第二阶段交互体验增强)
- [第三阶段：内容发现与社区](#第三阶段内容发现与社区)
- [第四阶段：性能与 SEO 优化](#第四阶段性能与-seo-优化)
- [第五阶段：视觉精致化](#第五阶段视觉精致化)
- [清理与维护](#清理与维护)
- [验收标准](#验收标准)

---

## 项目现状

### 技术栈

| 组件 | 版本/说明 |
|------|-----------|
| Jekyll | 4.4 |
| Ruby | 3.3 + Bundler |
| 主题 | 自定义 Alice Blue（非 gem 主题） |
| 托管 | GitHub Pages |
| 插件 | jekyll-paginate, jekyll-sitemap, jekyll-gist, jekyll-feed, jekyll-include-cache |

### 现有文件结构

```
_layouts/       → default.html, home.html, single.html（实际使用）
_includes/      → navigation.html, footer.html, skip-links.html（实际使用）
_posts/         → 18 篇博文
assets/css/     → main.css（~2270 行，完整设计系统）
assets/js/      → main.js（~260 行，主题/菜单/代码复制/返回顶部）
assets/images/  → avatar.png, favicon.svg
页面            → index.html, 404.html, categories.html, tags.html, year-archive.html
SEO             → robots.txt, sitemap.xml（自动生成）
```

### 已实现的功能

- [x] Light / Dark 双主题切换（localStorage 持久化 + 防闪烁脚本）
- [x] Alice Blue 色系 CSS 变量系统
- [x] 响应式布局（900px / 768px / 480px 三档断点）
- [x] 移动端汉堡菜单
- [x] 代码块复制按钮 + 语法高亮
- [x] MathJax LaTeX 渲染（全局加载）
- [x] RSS Feed + Sitemap
- [x] 分页功能
- [x] 分类 / 标签 / 归档页面
- [x] 文章阅读时间估算
- [x] WIP 文章标记
- [x] 分享链接（Twitter / Facebook / 微博）
- [x] 相关文章推荐
- [x] `prefers-reduced-motion` 无障碍支持
- [x] 打印样式
- [x] 自定义 404 错误页面
- [x] SVG Favicon
- [x] robots.txt SEO 配置
- [x] Skip Links 无障碍支持
- [x] Open Graph / Twitter Card 社交标签
- [x] 返回顶部按钮
- [x] 文章面包屑导航
- [x] 上一篇 / 下一篇导航
- [x] 样式统一管理（内联样式已迁移）

### 已识别的问题

| 类别 | 问题 | 影响 | 状态 |
|------|------|------|------|
| 缺失页面 | 没有 404 页面 | 用户遇到死链接时体验差 | ✅ 已解决 |
| 缺失资源 | favicon.png 被引用但不存在 | 浏览器标签页显示默认图标 | ✅ 已解决 |
| 性能 | MathJax 在每个页面都加载 | 非数学页面浪费带宽 | ✅ 已确认（全局加载更合适） |
| 性能 | Google Fonts 外部依赖 | 增加 DNS 查询和加载时间 | 待处理 |
| 样式 | 分类/标签/归档页使用内联 `<style>` | 样式管理不统一 | ✅ 已解决 |
| 功能 | 完全没有搜索功能 | 内容发现效率低 | 待处理 |
| 功能 | 没有评论系统 | 缺少读者互动渠道 | 待处理 |
| SEO | 缺少 Open Graph 标签 | 社交平台分享无预览卡片 | ✅ 已解决 |
| SEO | 缺少 JSON-LD 结构化数据 | 搜索引擎理解不充分 | 待处理 |
| 无障碍 | skip-links.html 存在但未引用 | 键盘用户无法跳过导航 | ✅ 已解决 |
| 遗留 | 大量未使用的 minimal-mistakes 模板文件 | 增加维护成本 | 待处理 |

---

## 优化目标

1. **补全基础体验**：404 页面、Favicon、面包屑、返回顶部等缺失的基础功能 ✅
2. **提升交互体验**：搜索、目录、进度条、灯箱等增强阅读体验的功能
3. **建立内容社区**：评论系统、精选文章、上/下篇导航等内容发现机制（部分完成）
4. **优化性能与 SEO**：条件加载、本地字体、OG 标签、结构化数据等（部分完成）
5. **视觉精致化**：布局优化、动效增强、暗色语法高亮验证等

---

## 第一阶段：基础体验补全 ✅ 已完成

> 目标：修复明显缺失，提升基础可用性
> 预计改动文件：6-8 个
> **实际改动文件：13 个** | **完成日期：2026-05-29**

### 1.1 创建 404 页面 ✅

**问题**：项目中没有 `404.html`，用户访问不存在的页面时会看到 GitHub Pages 的默认 404 页面，体验生硬且不一致。

**方案**：
- 在项目根目录创建 `404.html`，使用 `default` 布局
- 页面内容包含：
  - 友好的 404 提示信息（配合 Alice Blue 主题风格）
  - 返回首页的按钮
  - 最近 5 篇文章的推荐列表（使用 `{% for post in site.posts limit:5 %}`）
  - 搜索框（如第二阶段实现了搜索功能）
- 样式直接写在页面内或添加到 `main.css`

**涉及文件**：
- 新建：`404.html`
- 可能修改：`assets/css/main.css`（添加 404 页面样式）

**验收标准**：
- 访问 `http://localhost:4000/不存在的路径` 显示自定义 404 页面
- 404 页面风格与全站一致（Light / Dark 均正常）
- 移动端显示正常
- 返回首页和推荐文章链接可正常点击

---

### 1.2 创建 Favicon ✅

**问题**：`default.html` 第 11 行引用了 `/assets/images/favicon.png`，但该文件不存在。浏览器标签页显示默认图标，缺乏品牌识别度。

**方案**：
- 设计一个与 Alice Blue 主题一致的 favicon
  - 建议方案：使用品牌首字母 "E" 的简约设计，底色为 `--alice-500` (#2b8dd6)
  - 或使用一个简洁的图形标识
- 生成多种尺寸以适配不同设备：
  - `favicon.ico`（16x16, 32x32）
  - `favicon-16x16.png`
  - `favicon-32x32.png`
  - `apple-touch-icon.png`（180x180）
- 在 `default.html` 的 `<head>` 中添加完整的 favicon 声明

**涉及文件**：
- 新建：`assets/images/favicon.ico`, `assets/images/favicon-16x16.png`, `assets/images/favicon-32x32.png`, `assets/images/apple-touch-icon.png`
- 修改：`_layouts/default.html`（更新 favicon 引用）

**验收标准**：
- 浏览器标签页显示自定义图标
- 书签栏和移动端主屏幕图标正常显示
- 各尺寸图标清晰无模糊

---

### 1.3 添加面包屑导航 ✅

**问题**：文章详情页（`single.html`）没有面包屑导航，用户无法直观了解当前文章所属的分类层级。项目中已有 `_includes/breadcrumbs.html` 但未被使用。

**方案**：
- 在 `single.html` 的文章标题上方添加面包屑导航
- 结构：`首页 > 分类名 > 文章标题`
- 使用 CSS 变量保持主题一致性
- 移动端可适当简化（如只显示"返回分类"）

**涉及文件**：
- 修改：`_layouts/single.html`（添加面包屑引用或直接实现）
- 修改：`assets/css/main.css`（添加面包屑样式）

**验收标准**：
- 文章详情页标题上方显示面包屑
- 面包屑中的链接可正常跳转
- Light / Dark 模式下样式正常
- 移动端显示正常（不换行溢出）

---

### 1.4 添加上一篇 / 下一篇导航 ✅

**问题**：文章底部没有前后文章的导航链接，用户读完一篇后需要返回列表才能找到下一篇。

**方案**：
- 在 `single.html` 的 `post-footer-section` 中，在分享区域之后添加导航
- 使用 Jekyll 的 `page.previous` 和 `page.next` 变量
- 展示格式：左侧"上一篇"标题，右侧"下一篇"标题
- 添加简单的箭头图标

**涉及文件**：
- 修改：`_layouts/single.html`（添加导航 HTML）
- 修改：`assets/css/main.css`（添加导航样式）

**验收标准**：
- 文章底部显示上/下篇链接
- 最早和最新的文章只显示单侧导航
- 链接可正常跳转
- 移动端上下排列显示

---

### 1.5 添加 Open Graph 和社交标签 ✅

**问题**：`default.html` 缺少 OG 标签，在社交平台（微信、Twitter、Facebook）分享链接时无法显示标题、描述和预览图。

**方案**：
- 在 `default.html` 的 `<head>` 中添加以下标签：
  ```html
  <!-- Open Graph -->
  <meta property="og:title" content="...">
  <meta property="og:description" content="...">
  <meta property="og:url" content="...">
  <meta property="og:type" content="article"> <!-- 文章页 -->
  <meta property="og:type" content="website"> <!-- 首页 -->
  <meta property="og:site_name" content="...">
  <meta property="og:image" content="..."> <!-- 如有封面图 -->
  
  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary">
  <meta name="twitter:title" content="...">
  <meta name="twitter:description" content="...">
  ```
- 首页使用 `site.description`，文章页使用 `page.excerpt`

**涉及文件**：
- 修改：`_layouts/default.html`（添加 meta 标签）

**验收标准**：
- 使用 [Open Graph Debugger](https://www.opengraph.xyz/) 验证标签正确性
- 微信/QQ 分享时显示标题和描述
- Twitter 分享时显示卡片

---

### 1.6 添加返回顶部按钮 ✅

**问题**：长文章阅读时，用户需要手动滚动回顶部，操作不便。

**方案**：
- 在 `default.html` 底部添加一个浮动按钮（初始隐藏）
- 使用 `main.js` 监听滚动事件，滚动超过 300px 时显示按钮
- 点击后平滑滚动回顶部
- 按钮样式：圆形，使用 Alice Blue 主色，带向上箭头图标
- 位置：右下角固定定位

**涉及文件**：
- 修改：`_layouts/default.html`（添加按钮 HTML）
- 修改：`assets/js/main.js`（添加滚动监听和点击逻辑）
- 修改：`assets/css/main.css`（添加按钮样式和显示/隐藏动画）

**验收标准**：
- 页面未滚动时按钮不可见
- 滚动超过 300px 后按钮以渐显动画出现
- 点击后平滑滚动回顶部
- Light / Dark 模式下样式正常
- 移动端位置和大小合适（不遮挡内容）

---

### 1.7 引入 Skip Links ✅

**问题**：`_includes/skip-links.html` 文件已存在但未被引用，键盘用户无法跳过导航直接访问主内容。

**方案**：
- 在 `default.html` 的 `<body>` 开头引入 `{% include skip-links.html %}`
- 确保 skip link 的目标锚点 `#main-content` 存在于页面中
- skip link 默认隐藏，聚焦时显示

**涉及文件**：
- 修改：`_layouts/default.html`（添加 include）
- 修改：`assets/css/main.css`（如需补充 skip-links 样式）

**验收标准**：
- 按 Tab 键时页面顶部显示"跳到主内容"链接
- 点击链接后焦点移动到主内容区域
- 非键盘操作时链接不可见

---

### 1.8 创建 robots.txt ✅

**问题**：缺少 `robots.txt`，搜索引擎爬虫无法获取爬取指引。

**方案**：
- 在项目根目录创建 `robots.txt`：
  ```
  User-agent: *
  Allow: /
  Disallow: /assets/js/
  Sitemap: https://eganchiyu.github.io/sitemap.xml
  ```

**涉及文件**：
- 新建：`robots.txt`

**验收标准**：
- 访问 `https://eganchiyu.github.io/robots.txt` 显示正确内容
- Sitemap 链接可正常访问

---

### 1.9 内联样式迁移 ✅

**问题**：`categories.html`、`tags.html`、`year-archive.html` 三个页面使用 `<style>` 标签内联样式，与主样式文件 `main.css` 管理方式不统一。

**方案**：
- 将三个页面中的 `<style>` 内容迁移到 `main.css` 末尾
- 使用 `.taxonomy-*`、`.tags-*`、`.archive-*` 前缀避免类名冲突
- 删除三个页面中的 `<style>` 标签

**涉及文件**：
- 修改：`assets/css/main.css`（添加迁移的样式）
- 修改：`categories.html`（删除 `<style>`）
- 修改：`tags.html`（删除 `<style>`）
- 修改：`year-archive.html`（删除 `<style>`）

**验收标准**：
- 三个页面的样式显示与迁移前完全一致
- Light / Dark 模式均正常
- 移动端显示正常
- `main.css` 中的样式使用 CSS 变量（非硬编码颜色）

---

## 第二阶段：交互体验增强 ✅ 已完成

> 目标：提升阅读体验和操作流畅度
> 预计改动文件：4-6 个
> **实际改动文件：6 个** | **完成日期：2026-05-29**

### 2.1 添加阅读进度条 ✅

**问题**：长文章阅读时，用户无法直观了解阅读进度。

**方案**：
- 在导航栏下方添加一个细长的进度条（高度 3px）
- 使用 JavaScript 监听 `scroll` 事件，计算当前滚动位置占页面总高度的比例
- 进度条宽度动态设置为该比例
- 颜色使用 Alice Blue 渐变（`--alice-400` 到 `--accent-lavender`）
- 仅在文章详情页（`single.html`）显示

**涉及文件**：
- 修改：`_layouts/single.html`（添加进度条元素）
- 修改：`assets/js/main.js`（添加滚动计算逻辑）
- 修改：`assets/css/main.css`（添加进度条样式）

**验收标准**：
- 文章页导航栏下方显示进度条
- 滚动时进度条宽度实时变化
- 页面顶部时进度为 0%，底部时为 100%
- 不影响导航栏的 `sticky` 定位
- 移动端正常显示

---

### 2.2 添加文章目录 (TOC) ✅

**问题**：长文章（如 OR-Tools 文章约 45 分钟阅读时间）没有目录，用户无法快速跳转到感兴趣的小节。项目中已有 `_includes/toc.html` 但未使用。

**方案**：
- 在文章详情页添加浮动目录：
  - **桌面端**（> 900px）：目录固定在文章右侧，随滚动高亮当前小节
  - **移动端**（<= 900px）：在文章标题下方添加一个可折叠的目录面板
- 使用 kramdown 自动生成的标题 ID 作为锚点
- 利用 `IntersectionObserver` 实现滚动时自动高亮当前小节
- 可通过 Front Matter `toc: false` 关闭特定文章的目录

**涉及文件**：
- 修改：`_layouts/single.html`（添加目录结构）
- 修改：`assets/js/main.js`（添加目录高亮逻辑）
- 修改：`assets/css/main.css`（添加目录样式）

**验收标准**：
- 桌面端文章右侧显示固定目录
- 点击目录项平滑跳转到对应章节
- 滚动时当前章节在目录中高亮
- 移动端目录可折叠/展开
- `toc: false` 的文章不显示目录
- 文章中没有标题时不显示目录

---

### 2.3 添加搜索功能 ✅

**问题**：博客完全没有搜索功能，用户只能通过分类和标签浏览内容，内容发现效率低。

**方案**：
- 采用纯前端方案，不依赖外部服务：
  1. Jekyll 构建时生成 `search.json` 索引文件（包含每篇文章的标题、摘要、标签、URL）
  2. 在导航栏添加搜索图标按钮
  3. 点击后弹出搜索面板（模态框）
  4. 使用原生 JavaScript 实现关键词匹配搜索（或集成轻量级 Fuse.js 实现模糊搜索）
  5. 搜索结果实时显示，点击跳转到对应文章
- 搜索面板支持 ESC 键关闭
- 移动端搜索面板全屏显示

**涉及文件**：
- 新建：`search.json`（Liquid 模板生成索引）
- 修改：`_includes/navigation.html`（添加搜索按钮）
- 修改：`_layouts/default.html`（添加搜索模态框 HTML）
- 修改：`assets/js/main.js`（添加搜索逻辑）
- 修改：`assets/css/main.css`（添加搜索面板样式）

**验收标准**：
- 导航栏显示搜索图标
- 点击后弹出搜索面板
- 输入关键词后实时显示匹配结果
- 搜索结果包含文章标题、日期、分类
- 点击结果跳转到对应文章
- ESC 键和点击遮罩可关闭面板
- 移动端搜索体验良好

---

### 2.4 图片灯箱 (Lightbox) ✅

**问题**：技术文章中的截图和图表无法放大查看，小屏设备上细节难以辨认。

**方案**：
- 纯 JavaScript + CSS 实现，不依赖外部库
- 点击 `.post-content img` 时弹出全屏遮罩显示原图
- 遮罩支持点击关闭和 ESC 键关闭
- 添加简单的缩放动画
- 移动端支持双指缩放（使用 CSS `touch-action`）

**涉及文件**：
- 修改：`assets/js/main.js`（添加灯箱逻辑）
- 修改：`assets/css/main.css`（添加灯箱样式）

**验收标准**：
- 点击文章内图片弹出灯箱
- 灯箱显示原图，背景半透明遮罩
- 点击遮罩或按 ESC 关闭
- 关闭时有缩放动画
- 移动端可正常查看和关闭

---

### 2.5 移动端菜单优化 ✅

**问题**：移动端菜单使用 `display:none/block` 切换，无法实现平滑过渡；菜单展开时没有遮罩层。

**方案**：
- 将菜单显示方式从 `display:none` 改为 `transform: translateY(-100%)` + `opacity: 0`，实现平滑滑入/滑出
- 添加半透明遮罩层 `.mobile-overlay`，菜单展开时显示
- 点击遮罩层关闭菜单
- 菜单项添加入场动画（依次淡入）

**涉及文件**：
- 修改：`_includes/navigation.html`（添加遮罩层元素）
- 修改：`assets/css/main.css`（修改菜单过渡样式）
- 修改：`assets/js/main.js`（修改菜单切换逻辑）

**验收标准**：
- 菜单展开/收起有平滑过渡动画
- 展开时背景有半透明遮罩
- 点击遮罩层可关闭菜单
- 菜单项依次淡入显示
- 关闭后菜单项状态重置

---

### 2.6 表格响应式处理 ✅

**问题**：`main.css` 中的表格样式（第 1435-1459 行）没有处理小屏溢出，宽表格可能超出视口。

**方案**：
- 为 `.post-content table` 添加 `display: block; overflow-x: auto;` 或将其包裹在可滚动容器中
- 在小屏设备上表格可水平滚动

**涉及文件**：
- 修改：`assets/css/main.css`（修改表格样式）

**验收标准**：
- 宽表格在移动端可水平滚动
- 不会溢出视口
- 滚动时表格边框保持完整

---

## 第三阶段：内容发现与社区

> 目标：增强内容组织和用户互动
> 预计改动文件：5-7 个

### 3.1 首页文章网格布局

**问题**：首页文章列表是单列布局（`posts-grid` 只有 `gap` 没有 `grid-template-columns`），信息密度较低。

**方案**：
- 桌面端（> 900px）：双列网格布局
- 平板端（768-900px）：双列网格布局
- 移动端（< 768px）：保持单列
- 文章卡片高度自适应，使用 `align-items: start` 避免拉伸

**涉及文件**：
- 修改：`assets/css/main.css`（修改 `.posts-grid` 布局）

**验收标准**：
- 桌面端文章以双列网格显示
- 移动端保持单列
- 卡片高度自适应内容
- 卡片间距均匀

---

### 3.2 精选/置顶文章

**问题**：所有文章平等展示，优质内容无法突出。

**方案**：
- 利用 Front Matter 的 `featured: true` 标记精选文章
- 在首页 Hero 区域下方、文章列表上方添加"精选文章"区域
- 精选文章使用更大的卡片样式，可展示摘要
- 最多显示 2 篇精选文章

**涉及文件**：
- 修改：`_layouts/home.html`（添加精选区域）
- 修改：`assets/css/main.css`（添加精选卡片样式）
- 修改相关文章的 Front Matter（添加 `featured: true`）

**验收标准**：
- 标记为 `featured: true` 的文章在首页突出显示
- 精选区域位于文章列表上方
- 无精选文章时不显示该区域
- 移动端显示正常

---

### 3.3 集成 Giscus 评论系统

**问题**：博客缺少评论功能，读者无法互动和反馈。项目中已有 `_includes/comments-providers/giscus.html` 模板但未使用。

**方案**：
- 集成 Giscus（基于 GitHub Discussions 的评论系统）：
  1. 在 GitHub 仓库中启用 Discussions 功能
  2. 安装 Giscus App 并配置
  3. 在 `single.html` 文章底部添加 Giscus 组件
  4. 评论区跟随主题切换（Light / Dark）
- 通过 Front Matter `comments: true/false` 控制是否显示

**涉及文件**：
- 修改：`_layouts/single.html`（添加 Giscus 组件）
- 修改：`assets/js/main.js`（添加主题切换时同步 Giscus 主题的逻辑）

**验收标准**：
- 文章底部显示评论区
- 使用 GitHub 账号登录后可发表评论
- 切换主题时评论区主题同步变化
- `comments: false` 的文章不显示评论区
- 移动端评论区可用

---

### 3.4 添加"关于我"页面

**问题**：个人信息分散在首页 Hero 区域和 `_config.yml` 中，没有专门的个人介绍页面。

**方案**：
- 创建 `about.md` 页面，使用 `single` 布局
- 内容包括：
  - 个人简介
  - 技术栈和兴趣领域
  - 学习经历（NWPU · 智能无人系统）
  - 联系方式
  - GitHub 项目链接
- 在导航栏中添加"关于"链接

**涉及文件**：
- 新建：`about.md`
- 修改：`_includes/navigation.html`（添加"关于"导航项）

**验收标准**：
- 导航栏显示"关于"链接
- 点击后进入个人介绍页面
- 页面风格与文章页一致
- 移动端显示正常

---

### 3.5 文章封面图支持

**问题**：文章卡片没有封面图，首页视觉吸引力不足。

**方案**：
- 支持在 Front Matter 中添加 `cover_image` 字段
- 文章卡片顶部展示封面图（如未设置则不显示）
- 封面图使用 `object-fit: cover` 保持比例
- 首页卡片和文章详情页都支持显示

**涉及文件**：
- 修改：`_layouts/home.html`（文章卡片添加封面图）
- 修改：`_layouts/single.html`（文章详情添加封面图）
- 修改：`assets/css/main.css`（添加封面图样式）

**验收标准**：
- 设置了 `cover_image` 的文章在首页显示封面图
- 封面图不影响卡片布局
- 未设置封面图的文章正常显示（无空白区域）
- 移动端封面图比例正确

---

## 第四阶段：性能与 SEO 优化

> 目标：提升加载速度和搜索引擎表现
> 预计改动文件：3-5 个

### 4.1 MathJax 加载策略 ✅ 已确认

**问题**：`default.html` 第 51-74 行在每个页面都加载 MathJax 脚本，但只有包含 LaTeX 公式的文章才需要。MathJax 库约 200KB，对非数学页面是浪费。

**决策**：经评估，用户 LaTeX 使用频率较高，采用**全局加载**策略更合适。

**方案**：
- ~~方案 A（推荐）：在 Front Matter 中添加 `math: true` 字段，仅在该字段为 true 时加载 MathJax~~
- **最终方案**：保持全局加载，确保所有文章都能渲染 LaTeX 公式

**涉及文件**：
- 无需修改（保持现状）

**验收标准**：
- ✅ 所有文章正常渲染数学公式
- ✅ LaTeX 使用频率高的场景下用户体验一致

---

### 4.2 字体本地托管

**问题**：`default.html` 第 14-16 行加载 Google Fonts（Inter 和 JetBrains Mono），增加 2 次外部 DNS 查询和连接时间，在网络不佳时可能导致字体加载延迟。

**方案**：
- 下载 Inter（Regular, Medium, SemiBold, Bold）和 JetBrains Mono（Regular, Medium）的 woff2 格式文件
- 放置到 `assets/fonts/` 目录
- 在 `main.css` 中使用 `@font-face` 声明
- 移除 `default.html` 中的 Google Fonts `<link>` 标签
- 使用 `font-display: swap` 确保文字不被阻塞显示

**涉及文件**：
- 新建：`assets/fonts/` 目录及字体文件
- 修改：`assets/css/main.css`（添加 `@font-face` 声明）
- 修改：`_layouts/default.html`（移除 Google Fonts 链接）

**验收标准**：
- 字体正常显示，外观与之前一致
- 无外部字体请求
- 首次加载时使用系统字体，字体加载完成后平滑切换
- 字体文件大小合理（woff2 格式）

---

### 4.3 添加 JSON-LD 结构化数据

**问题**：缺少结构化数据标记，搜索引擎无法充分理解页面内容和关系。

**方案**：
- 在 `default.html` 中添加 JSON-LD `<script>` 标签
- 首页使用 `WebSite` 类型
- 文章页使用 `Article` 类型（包含 headline, datePublished, author, description 等）
- 使用 Liquid 模板动态生成

**涉及文件**：
- 修改：`_layouts/default.html`（添加 JSON-LD）

**验收标准**：
- 使用 [Google Rich Results Test](https://search.google.com/test/rich-results) 验证结构化数据
- 文章页包含完整的 Article 标记
- 首页包含 WebSite 标记

---

### 4.4 图片懒加载统一处理

**问题**：只有头像图片有 `loading="lazy"` 属性，文章内容中的图片没有统一的懒加载处理。

**方案**：
- 在 `main.js` 中使用 `MutationObserver` 或在 `DOMContentLoaded` 后为所有 `.post-content img` 添加 `loading="lazy"` 属性
- 添加渐显动画：图片加载完成后从透明渐变到不透明
- 为没有 `alt` 属性的图片添加默认 alt 文本

**涉及文件**：
- 修改：`assets/js/main.js`（添加图片懒加载逻辑）
- 修改：`assets/css/main.css`（添加图片渐显动画）

**验收标准**：
- 文章中的图片在滚动到视口附近时才开始加载
- 图片加载完成后有渐显效果
- 无 `alt` 属性的图片有默认提示

---

### 4.5 CSS 优化与压缩

**问题**：`main.css` 约 1790 行，作为普通 CSS 文件未利用 Jekyll 的 Sass 压缩功能。

**方案**：
- 将 `assets/css/main.css` 重命名为 `assets/css/main.scss`
- 在文件开头添加 Jekyll front matter（空的 `---`）
- 利用 `_config.yml` 中已配置的 `sass: style: compressed` 自动压缩
- 或保持 `.css` 但添加构建后的压缩步骤

**涉及文件**：
- 重命名：`assets/css/main.css` → `assets/css/main.scss`
- 修改：文件开头添加 Jekyll front matter

**验收标准**：
- 构建后的 CSS 文件被压缩（无多余空格和换行）
- 样式功能不受影响
- Light / Dark 模式均正常

---

## 第五阶段：视觉精致化

> 目标：提升视觉细节和品牌一致性
> 预计改动文件：3-5 个

### 5.1 暗色模式语法高亮验证

**问题**：`main.css` 第 1141-1370 行定义了 Light 和 Dark 两套语法高亮色，但需要验证所有语言的高亮在 Dark 模式下的可读性。

**方案**：
- 在 Dark 模式下逐个检查各语法元素的颜色对比度
- 使用 WebAIM 对比度检查器验证文字/背景对比度 >= 4.5:1（WCAG AA）
- 重点检查：注释、字符串、关键字、函数名
- 如发现不足，调整颜色值

**涉及文件**：
- 修改：`assets/css/main.css`（调整语法高亮色值）

**验收标准**：
- Dark 模式下所有语法元素清晰可读
- 对比度符合 WCAG AA 标准
- 代码块在两种主题下都有良好的视觉效果

---

### 5.2 引用块装饰增强

**问题**：当前引用块（blockquote）只有左边框和背景色，视觉效果较朴素。

**方案**：
- 在引用块左上角添加引号装饰（使用 CSS `::before` 伪元素）
- 使用 Alice Blue 渐变色作为引号颜色
- 保持简洁，不过度装饰

**涉及文件**：
- 修改：`assets/css/main.css`（增强 blockquote 样式）

**验收标准**：
- 引用块有引号装饰
- Light / Dark 模式下效果协调
- 不影响引用块内文字的可读性

---

### 5.3 文章卡片微交互增强

**问题**：文章卡片的悬停效果（`transform: translateY(-4px)`）已经不错，但可以添加更丰富的微交互。

**方案**：
- 添加点击时的缩放反馈（`transform: scale(0.98)` on `:active`）
- 为卡片左侧的渐变条添加展开动画（悬停时从 4px 宽度渐变到更宽）
- 标签悬停时添加轻微的缩放效果

**涉及文件**：
- 修改：`assets/css/main.css`（增强卡片交互样式）

**验收标准**：
- 点击卡片有按压反馈
- 悬停时左侧渐变条有动画
- 动画流畅不卡顿
- `prefers-reduced-motion` 时禁用动画

---

### 5.4 Footer 增强

**问题**：当前 footer（`footer.html`）内容较简单，只有站点名、链接和版权信息。

**方案**：
- 添加站点统计信息（文章数量、分类数量、最后更新时间）
- 添加 RSS 订阅链接（已有 feed.xml，但 footer 中未突出）
- 保持简洁风格，不增加过多内容

**涉及文件**：
- 修改：`_includes/footer.html`（添加统计信息）
- 修改：`assets/css/main.css`（调整 footer 样式）

**验收标准**：
- Footer 显示站点统计
- RSS 链接可正常访问
- 整体风格简洁协调

---

### 5.5 Hero 区域装饰优化

**问题**：Hero 区域使用 emoji 作为装饰元素（✨🌸），视觉上不够精致。

**方案**：
- 将 emoji 装饰替换为 CSS 渐变圆形或 SVG 图形
- 或使用更精致的 CSS 动画元素（如浮动的渐变圆点）
- 保持二次元/Alice Blue 的风格调性

**涉及文件**：
- 修改：`_layouts/home.html`（替换装饰元素）
- 修改：`assets/css/main.css`（添加新装饰样式）

**验收标准**：
- 装饰元素视觉更精致
- 动画流畅
- Dark 模式下效果协调
- 移动端隐藏（已有此逻辑）

---

## 清理与维护

### 遗留文件清理

以下文件来自 minimal-mistakes 主题，当前博客未使用，建议评估后清理：

**布局文件**（`_layouts/`）：
- `archive.html`, `archive-taxonomy.html`
- `categories.html`, `category.html`
- `collection.html`
- `compress.html`
- `posts.html`
- `search.html`
- `splash.html`
- `tag.html`, `tags.html`

**包含文件**（`_includes/`）：
- `analytics/` 目录（3 个文件）
- `comments-providers/` 目录（10+ 个文件，保留 `giscus.html` 如果计划集成）
- `search/` 目录（3 个文件，如计划实现搜索可参考）
- `head/`, `footer/` 子目录
- 其他未引用的模板文件

**其他文件**：
- `_sass/minimal-mistakes/_custom.scss`（遗留 SCSS）
- `assets/js/plugins/`（jQuery 插件，未使用）
- `assets/js/vendor/jquery/`（jQuery，未使用）
- `assets/js/lunr/`（Lunr 搜索库，如不使用可清理）
- `minimal-mistakes-jekyll.gemspec`
- `staticman.yml`
- `.travis.yml`

> ⚠️ 清理前请确认每个文件确实未被引用，建议逐个检查后再删除。

---

## 验收标准

每个阶段完成后，需通过以下检查：

### 功能检查
- [ ] 所有新增功能正常工作
- [ ] 现有功能未受影响
- [ ] 所有链接可正常跳转

### 主题检查
- [ ] Light 模式显示正常
- [ ] Dark 模式显示正常
- [ ] 主题切换功能正常

### 响应式检查
- [ ] 桌面端（> 900px）布局正确
- [ ] 平板端（768-900px）布局正确
- [ ] 移动端（< 768px）布局正确
- [ ] 小屏手机（< 480px）布局正确

### 性能检查
- [ ] 页面加载速度无明显下降
- [ ] 动画流畅（60fps）
- [ ] 无控制台错误

### 无障碍检查
- [ ] 键盘可操作所有交互元素
- [ ] `prefers-reduced-motion` 生效
- [ ] 图片有 alt 文本
- [ ] 颜色对比度符合 WCAG AA

### 构建检查
- [ ] `bundle exec jekyll build` 无错误
- [ ] `bundle exec jekyll serve` 本地预览正常
- [ ] 无死链接

---

> 本计划为迭代式开发，各阶段可独立实施。建议按阶段顺序推进，每完成一个阶段进行一次全面验证后再进入下一阶段。
