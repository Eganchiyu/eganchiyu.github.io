# 布局系统文档

> 本项目使用 3 个自定义布局模板，采用继承式架构。

---

## 布局继承关系

```
default.html          ← 基础骨架（HTML 文档结构）
├── home.html         ← 首页（继承 default）
└── single.html       ← 文章详情页（继承 default）
```

所有页面均通过 `layout: default` 获得统一的 HTML 骨架、导航栏和页脚。

---

## 1. default.html — 基础骨架

**文件路径**: `_layouts/default.html`

提供完整的 HTML 文档结构，所有其他布局均通过 `layout: default` 继承此模板。

### 1.1 Head 结构

| 元素 | 说明 |
|------|------|
| `<meta charset="utf-8">` | 字符编码 |
| `<meta name="viewport">` | 响应式视口，含 `viewport-fit=cover` |
| `<meta name="theme-color">` | 主题色 `#f0f8ff`（Alice Blue），Dark 模式下 JS 动态切换为 `#0f172a` |
| `<title>` | 页面标题，格式：`页面标题 | 站点标题`，首页仅显示站点标题 |
| `<meta name="description">` | SEO 描述，优先使用页面摘要，回退到站点描述，截断 160 字符 |
| `<link rel="icon">` | Favicon，指向 `/assets/images/favicon.png` |

### 1.2 字体加载

通过 Google Fonts 加载两个字体家族：

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
```

- **Inter** — 主要正文和标题字体（400/500/600/700）
- **JetBrains Mono** — 代码字体（400/500）

使用 `preconnect` 提前建立连接，加速字体加载。

### 1.3 主题初始化内联脚本

位于 `<head>` 中，用于在页面渲染前同步设置主题，**防止主题闪烁 (FOUC)**：

```javascript
(function() {
  const saved = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  if (saved === 'dark' || (!saved && prefersDark)) {
    document.documentElement.setAttribute('data-theme', 'dark');
  }
})();
```

**逻辑**：
1. 读取 `localStorage` 中保存的用户偏好
2. 如果无保存值，检测系统 `prefers-color-scheme` 媒体查询
3. 仅在需要时设置 `data-theme="dark"`（默认为 light）

### 1.4 文档结构

```html
<!DOCTYPE html>
<html lang="{{ site.locale }}">
<head>...</head>
<body class="layout-{{ page.layout }}">
  {% include navigation.html %}      <!-- 导航栏 -->
  <main class="main-content">
    {{ content }}                     <!-- 子布局内容 -->
  </main>
  {% include footer.html %}           <!-- 页脚 -->
  <script src="main.js" defer></script>
</body>
</html>
```

- `<body>` 自动添加 `layout-{布局名}` CSS 类，可用于按布局类型定制样式
- JS 使用 `defer` 加载，不阻塞渲染

---

## 2. home.html — 首页布局

**文件路径**: `_layouts/home.html`
**继承**: `default`

首页由两个主要区域组成：**Hero 区域** 和 **文章卡片列表**。

### 2.1 Hero 区域

采用 CSS Grid 两栏布局（`1fr 280px`），左侧为个人简介，右侧为头像卡片。

#### 左侧内容

| 元素 | CSS 类 | 说明 |
|------|--------|------|
| 状态徽章 | `.hero-badge` | 显示"正在学习中..."，含脉冲动画圆点 (`hero-badge-dot`) |
| 问候语 | `.hero-greeting` | "你好，我是" |
| 名称 | `.hero-name` | 从 `site.author.name` 读取，渐变色文字（Alice Blue → Lavender） |
| 描述 | `.hero-description` | 从 `site.description` 读取 |
| 地点 | `.hero-location` | SVG 地标图标 + `site.author.location` |
| 链接 | `.hero-links` | GitHub 主页链接（实心按钮）+ 邮箱链接（描边按钮） |

#### 右侧头像卡片

| 元素 | CSS 类 | 说明 |
|------|--------|------|
| 卡片容器 | `.avatar-card` | 毛玻璃背景，顶部渐变装饰条 (`::before`) |
| 头像 | `.avatar-wrapper` | 120px 圆形，悬停放大旋转效果 |
| 名称 | `.avatar-name` | `site.author.name` |
| 角色 | `.avatar-role` | 硬编码 "NWPU · 智能无人系统" |
| 统计 | `.avatar-stats` | 动态显示文章数 (`site.posts.size`)、分类数 (`site.categories.size`)、标签数 (`site.tags.size`) |

#### 装饰元素

使用 emoji 作为浮动装饰（`✨` 和 `🌸`），带 `float` 动画，Dark 模式降低透明度。

### 2.2 文章卡片列表

使用 `paginator.posts` 进行分页遍历，每张卡片包含：

| 元素 | 说明 |
|------|------|
| 日期 | `post.date`，格式 `"%Y年%m月%d日"`，带 `datetime` 属性 |
| 分类 | 显示第一个分类 (`post.categories \| first`) |
| 标题 | 可点击链接到文章详情 |
| 摘要 | `post.excerpt`，去除 HTML，截断 100 字符，最多 2 行 (`-webkit-line-clamp`) |
| 标签 | 最多显示 3 个标签 |
| 阅读时间 | 按 250 字/分钟计算，显示 `📖 X min` |

### 2.3 分页导航

当 `paginator.total_pages > 1` 时显示，包含：
- "← 上一页" 按钮（仅有上一页时显示）
- 页码信息：`当前页 / 总页数`
- "下一页 →" 按钮（仅有下一页时显示）

### 2.4 使用的 Liquid 语法

| 语法 | 用途 |
|------|------|
| `{{ site.xxx }}` | 访问 `_config.yml` 中的站点配置 |
| `{{ page.xxx }}` | 访问当前页面的 Front Matter |
| `{% for post in paginator.posts %}` | 遍历分页文章 |
| `{% if xxx.size > 0 %}` | 条件判断（空集合检查） |
| `{{ post.excerpt \| strip_html \| truncate: 100 }}` | 过滤器链：去 HTML → 截断 |
| `{% assign words = post.content \| number_of_words %}` | 计算字数 |
| `{{ post.categories \| first }}` | 数组取第一个元素 |
| `{% for tag in post.tags limit:3 %}` | 限制循环次数 |

---

## 3. single.html — 文章详情页布局

**文件路径**: `_layouts/single.html`
**继承**: `default`

### 3.1 文章头部 (Post Header)

| 元素 | CSS 类 | 说明 |
|------|--------|------|
| 日期 | `.post-meta time` | `page.date`，格式 `"%Y年%m月%d日"` |
| 分类 | `.post-category` | 第一个分类，胶囊样式 |
| 阅读时间 | `.read-time` | 250 字/分钟计算 |
| 标题 | `.post-title` | `page.title`，2rem 粗体 |
| 摘要 | `.post-excerpt` | `page.excerpt`，去 HTML（可选） |
| 标签列表 | `.post-tags` | 遍历 `page.tags`，每个标签链接到 `/tags/#标签名` |

### 3.2 文章内容

```html
<div class="post-content">
  {{ content }}
</div>
```

内容区域最大宽度 720px，行高 1.9。CSS 对以下元素做了专项排版优化：

- **标题** (h2/h3) — h2 带底部边框，h3 使用 Alice Blue 强调色
- **段落** — 1.25rem 底部间距
- **链接** — 带下划线装饰（`text-underline-offset: 3px`）
- **列表** — 左侧 1.5rem 内边距
- **引用块** — 左侧 4px Alice Blue 边框 + 半透明背景
- **代码** — 行内代码用 `tag-bg` 背景，代码块用深色主题 + 圆角阴影
- **图片** — 圆角 + 阴影，悬停放大
- **表格** — 完整边框 + 表头背景色 + 行悬停高亮

### 3.3 分享链接

```html
<div class="share-section">
  <h3>📤 分享文章</h3>
  <div class="share-links">
    <!-- Twitter / Facebook / 微博 -->
  </div>
</div>
```

三个分享渠道，均使用 `target="_blank" rel="noopener"` 安全打开：
- **Twitter** — `twitter.com/intent/tweet`，参数 `url` + `text`
- **Facebook** — `facebook.com/sharer/sharer.php`，参数 `u`
- **微博** — `service.weibo.com/share/share.php`，参数 `url` + `title`

URL 和标题均通过 Liquid 的 `uri_escape` 过滤器编码。

### 3.4 相关文章

```html
{% if site.related_posts.size > 0 %}
<div class="related-posts">
  <h3>📚 相关文章</h3>
  <div class="related-grid">
    {% for related in site.related_posts limit:3 %}
    ...
    {% endfor %}
  </div>
</div>
{% endif %}
```

- 使用 Jekyll 内置的 `site.related_posts`（默认返回最近 10 篇）
- 限制显示 3 篇
- 每篇显示日期和标题，悬停时向右平移 4px

---

## 布局使用方式

在文章的 Front Matter 中指定布局：

```yaml
---
layout: single    # 文章详情页
title: "文章标题"
---
```

```yaml
---
layout: home      # 首页（通过 index.html 引用）
---
```

**默认值**: `_config.yml` 中为所有 `posts` 类型设置了默认布局 `single`：

```yaml
defaults:
  - scope:
      path: ""
      type: posts
    values:
      layout: single
```
