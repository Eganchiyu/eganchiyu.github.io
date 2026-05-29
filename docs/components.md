# 组件文档

> 项目包含 2 个全局组件（导航、页脚）和 3 个独立页面组件（分类、标签、归档）。

---

## 1. navigation.html — 导航组件

**文件路径**: `_includes/navigation.html`
**引用方式**: 在 `default.html` 中通过 `{% include navigation.html %}` 引入

### 1.1 桌面导航

结构：
```
<nav class="navbar">
  └── <div class="container">
       ├── Logo（🏠 + 站点标题前缀）
       └── <div class="nav-right">
            ├── 导航链接组 (.nav-links)
            ├── 主题切换按钮 (.theme-toggle)
            └── 移动端菜单按钮 (.menu-toggle)
```

#### Logo

- 图标：🏠 emoji，带 `float` 上下浮动动画
- 文本：从 `site.title` 中提取"的"之前的部分（即 "Eganchiyu"）
- 悬停效果：颜色变为 Alice Blue，轻微放大 (`scale(1.02)`)

#### 导航链接

| 链接 | 目标 | 激活条件 |
|------|------|----------|
| 首页 | `/` | `page.url == '/'` |
| 分类 | `/categories/` | `page.url == '/categories/'` |
| 标签 | `/tags/` | `page.url == '/tags/'` |
| 归档 | `/year-archive/` | `page.url == '/year-archive/'` |
| 关于 | `/about/` | `page.url == '/about/'` |
| GitHub | `https://github.com/Eganchiyu` | 无（外部链接） |

- 激活状态 (`.active`)：文字变为 Alice Blue，背景变为 `--alice-100`，底部有 2px 指示条
- 悬停效果：颜色变化 + 背景变化

#### 主题切换按钮

```html
<button class="theme-toggle" id="themeToggle" aria-label="切换主题">
  <span class="icon-moon">🌙</span>
  <span class="icon-sun">☀️</span>
</button>
```

- Light 模式显示 🌙（月亮），Dark 模式显示 ☀️（太阳）
- 通过 CSS `display: none/block` 切换，逻辑见 `[data-theme]` 选择器
- 点击事件由 `main.js` 中的 `ThemeManager` 处理

### 1.2 移动端汉堡菜单

```html
<button class="menu-toggle" id="menuToggle" aria-label="菜单">☰</button>
```

- 桌面端隐藏 (`display: none`)，手机端 (`max-width: 768px`) 显示
- 图标在 ☰（汉堡）和 ✕（关闭）之间切换

移动端菜单面板：

```html
<div class="mobile-menu" id="mobileMenu">
  <a class="mobile-link">🏠 首页</a>
  <a class="mobile-link">📁 分类</a>
  <a class="mobile-link">🏷️ 标签</a>
  <a class="mobile-link">📅 归档</a>
  <a class="mobile-link">👋 关于</a>
  <a class="mobile-link">🐙 GitHub</a>
</div>
```

- 固定定位，位于导航栏下方 (`top: 3.5rem`)
- 毛玻璃背景 + 卡片阴影
- 激活时带 `slideDown` 滑入动画
- 点击链接或页面其他区域自动关闭

### 1.3 滚动阴影

导航栏默认无阴影，页面滚动超过 50px 后通过 JS 添加 `box-shadow: var(--shadow-soft)`。

实现方式：使用 `requestAnimationFrame` 节流，详见 [JavaScript 文档](./javascript.md)。

### 1.4 响应式行为

| 断点 | 行为 |
|------|------|
| > 768px | 显示桌面导航链接，隐藏汉堡按钮 |
| ≤ 768px | 隐藏桌面链接，显示汉堡按钮和移动端菜单 |

---

## 2. footer.html — 页脚组件

**文件路径**: `_includes/footer.html`
**引用方式**: 在 `default.html` 中通过 `{% include footer.html %}` 引入

### 2.1 结构

```
<footer class="footer">
  └── <div class="footer-content">
       ├── 站点信息 (.footer-info)
       ├── 链接 (.footer-links)
       └── 版权 (.footer-copyright)
```

### 2.2 站点信息

```html
<div class="footer-info">
  <p class="footer-title">{{ site.title }}</p>
  <p class="footer-subtitle">{{ site.subtitle }}</p>
</div>
```

显示站点标题和副标题，水平排列。

### 2.3 链接

| 链接 | 目标 |
|------|------|
| GitHub | `https://github.com/Eganchiyu`（新窗口打开） |
| 邮箱 | `mailto:{{ site.author.email }}` |
| RSS | `/feed.xml`（由 `jekyll-feed` 插件生成） |

### 2.4 版权

```html
<p>&copy; {{ site.time | date: '%Y' }} {{ site.author.name }}.
   Powered by <a href="https://jekyllrb.com">Jekyll</a>.</p>
```

- 年份从 `site.time` 动态获取
- Jekyll 链接带 `rel="noopener"`

### 2.5 样式特征

- 顶部边框分隔线
- 毛玻璃背景 (`backdrop-filter: blur(10px)`)
- 上方 4rem 外边距
- Flexbox 垂直居中布局

---

## 3. 独立页面组件

这些页面直接使用 `layout: default`，样式通过页面内 `<style>` 标签定义。

### 3.1 categories.html — 分类页面

**文件路径**: `categories.html`（项目根目录）
**URL**: `/categories/`
**布局**: `default`

#### 功能

- 标题："📁 分类"
- 使用 `site.categories | sort` 按字母排序
- 网格布局 (`auto-fill, minmax(300px, 1fr)`)

#### 单个分类卡片

| 元素 | 说明 |
|------|------|
| 分类名 | 可点击锚点链接 `#分类名` |
| 文章数 | 胶囊样式计数器 (`.taxonomy-count`) |
| 文章列表 | 最多显示 5 篇，超出显示"还有 N 篇" |
| 文章项 | 标题链接 + 月-日日期 |

#### 关键 CSS 类

| 类名 | 用途 |
|------|------|
| `.taxonomy-section` | 外层容器，3rem 上下内边距 |
| `.taxonomy-grid` | 网格布局容器 |
| `.taxonomy-card` | 单个分类卡片，毛玻璃 + 圆角 |
| `.taxonomy-name` | 分类标题栏，底部 2px Alice Blue 边框 |
| `.taxonomy-count` | 文章计数胶囊 |
| `.taxonomy-list` | 文章列表 |

### 3.2 tags.html — 标签页面

**文件路径**: `tags.html`（项目根目录）
**URL**: `/tags/`
**布局**: `default`

#### 功能

分为两个区域：**标签云** 和 **标签文章列表**。

#### 标签云 (Tags Cloud)

```html
<div class="tags-cloud">
  {% for tag in tags_sorted %}
  <a href="#{{ tag[0] }}" class="tag-item"
     style="font-size: {{ tag[1].size | times: 0.1 | plus: 0.9 }}rem;">
    #{{ tag[0] }}
    <span class="tag-count">{{ tag[1].size }}</span>
  </a>
  {% endfor %}
</div>
```

- 标签字号动态计算：`0.9 + 文章数 × 0.1` rem（文章越多字号越大）
- 每个标签可点击跳转到下方对应区域
- 胶囊样式，含文章计数
- 悬停变色 + 上移效果

#### 标签文章列表

每个标签为一个区块 (`.tag-section`)，含 `id` 锚点：
- 标签名 (`#标签名`)
- 文章列表（标题 + 日期）
- 使用 `site.tags | sort` 按字母排序

#### 关键 CSS 类

| 类名 | 用途 |
|------|------|
| `.tags-cloud` | 标签云容器，flex 换行 |
| `.tag-item` | 单个标签胶囊 |
| `.tag-count` | 标签内计数徽章 |
| `.tags-list` | 文章列表区域 |
| `.tag-section` | 单个标签的文章区块 |
| `.tag-posts` | 文章列表 |

### 3.3 year-archive.html — 归档页面

**文件路径**: `year-archive.html`（项目根目录）
**URL**: `/year-archive/`
**布局**: `default`

#### 功能

- 标题："📅 文章归档"
- 副标题：显示总文章数
- 时间线布局，按年分组

#### 时间线结构

```
时间线竖线 (::before 伪元素)
│
├── 2026 年 ●
│   ├── [01月28日] 文章标题 — 分类
│   ├── [01月25日] 文章标题 — 分类
│   └── ...
│
└── 2025 年 ●
    ├── [12月25日] 文章标题 — 分类
    └── ...
```

- 使用 `site.posts | group_by_exp` 按年份分组
- 时间线左侧有渐变竖线（Alice Blue → Lavender）
- 年份标题前有圆形节点（Alice Blue + 白色边框 + 外环）
- 每篇文章为一个卡片，悬停向右平移 4px

#### 关键 CSS 类

| 类名 | 用途 |
|------|------|
| `.archive-timeline` | 时间线容器，含左侧竖线 |
| `.archive-year` | 年份分组 |
| `.year-title` | 年份标题，含左侧圆点 |
| `.year-posts` | 该年文章列表 |
| `.archive-post` | 单篇文章卡片 |
| `.archive-date` | 日期（月日） |
| `.archive-post-title` | 文章标题 |
| `.archive-category` | 分类胶囊标签 |

#### 响应式

手机端 (≤768px)：
- 时间线竖线和圆点左移
- 文章卡片改为纵向排列
- 分类标签换行显示
