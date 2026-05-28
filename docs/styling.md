# 样式系统文档

> 基于 CSS 自定义属性 (CSS Variables) 的设计系统，支持 Light/Dark 双模式。
> 主样式文件: `assets/css/main.css`（约 1279 行）

---

## 1. CSS 变量系统

### 1.1 全局变量（`:root`，不受主题影响）

#### Alice Blue 色系

| 变量 | Light 值 | Dark 值 | 用途 |
|------|----------|---------|------|
| `--alice-50` | `#f0f8ff` | `#1e293b` | 最浅背景色 |
| `--alice-100` | `#e0f0ff` | `rgba(43,141,214,0.15)` | 浅背景/标签背景 |
| `--alice-200` | `#bde0ff` | `rgba(43,141,214,0.25)` | 边框/分割线 |
| `--alice-300` | `#7cc4fa` | — | 中等强调 |
| `--alice-400` | `#4ba9e9` | — | 链接/引用边框 |
| `--alice-500` | `#2b8dd6` | — | 主色/交互色 |
| `--alice-600` | `#1a6fb8` | — | 标题/强调 |
| `--alice-700` | `#155a96` | — | 分类/标签文字 |
| `--alice-800` | `#164d7c` | — | 深色文字 |
| `--alice-900` | `#174168` | — | 最深色 |

> Dark 模式下仅覆盖 `--alice-50`、`--alice-100`、`--alice-200`，其余保持不变。

#### 强调色

| 变量 | 值 | 用途 |
|------|-----|------|
| `--accent-pink` | `#f5a0b8` | 装饰性粉色（背景光晕） |
| `--accent-teal` | `#7dd3c0` | 在线状态指示点 |
| `--accent-lavender` | `#b8a9e8` | 渐变色配合（标题/时间线） |
| `--accent-peach` | `#ffd4b8` | 装饰性暖色 |

#### 字体

| 变量 | 值 | 用途 |
|------|-----|------|
| `--font-sans` | `'Inter', 'Noto Sans SC', -apple-system, sans-serif` | 正文/标题 |
| `--font-mono` | `'JetBrains Mono', 'Fira Code', monospace` | 代码 |

#### 圆角

| 变量 | 值 | 典型用途 |
|------|-----|----------|
| `--radius-sm` | `8px` | 标签、行内代码、小按钮 |
| `--radius-md` | `12px` | 卡片、区块、分页按钮 |
| `--radius-lg` | `16px` | 文章卡片、代码块、头像卡片 |
| `--radius-xl` | `24px` | 头像卡片容器 |
| `--radius-full` | `9999px` | 胶囊形状、圆形 |

#### 动画曲线

| 变量 | 值 | 用途 |
|------|-----|------|
| `--bounce` | `cubic-bezier(0.68, -0.55, 0.265, 1.55)` | 弹性效果 |
| `--smooth` | `cubic-bezier(0.4, 0, 0.2, 1)` | 通用平滑过渡 |
| `--transition-fast` | `150ms ease` | 快速过渡 |
| `--transition-base` | `250ms ease` | 标准过渡 |

### 1.2 Light 主题变量

```css
[data-theme="light"], :root { ... }
```

| 变量 | 值 | 用途 |
|------|-----|------|
| `--text-primary` | `#2d3748` | 主文字色 |
| `--text-secondary` | `#718096` | 次文字色 |
| `--text-muted` | `#a0aec0` | 弱化文字 |
| `--bg-primary` | `#ffffff` | 主背景 |
| `--bg-secondary` | `var(--alice-50)` | 次背景（`#f0f8ff`） |
| `--bg-card` | `rgba(255,255,255,0.85)` | 卡片背景（半透明） |
| `--bg-card-solid` | `#ffffff` | 卡片实色背景 |
| `--border-color` | `rgba(189,224,255,0.4)` | 默认边框 |
| `--border-color-strong` | `rgba(189,224,255,0.6)` | 强调边框 |
| `--shadow-soft` | `0 4px 20px rgba(43,141,214,0.08)` | 柔和阴影 |
| `--shadow-card` | `0 8px 32px rgba(43,141,214,0.12)` | 卡片阴影 |
| `--shadow-hover` | `0 12px 40px rgba(43,141,214,0.18)` | 悬停阴影 |
| `--nav-bg` | `rgba(255,255,255,0.88)` | 导航栏背景 |
| `--code-bg` | `#1e293b` | 代码块背景 |
| `--code-text` | `#e2e8f0` | 代码块文字 |
| `--hero-gradient` | `linear-gradient(135deg, alice-50, #f8f4ff, alice-50)` | 首页背景渐变 |
| `--blockquote-bg` | `var(--alice-50)` | 引用块背景 |
| `--tag-bg` | `var(--alice-100)` | 标签背景 |
| `--tag-text` | `var(--alice-700)` | 标签文字 |
| `--category-bg` | `var(--alice-100)` | 分类背景 |
| `--category-text` | `var(--alice-700)` | 分类文字 |

### 1.3 Dark 主题变量

```css
[data-theme="dark"] { ... }
```

| 变量 | 值 | 用途 |
|------|-----|------|
| `--text-primary` | `#e2e8f0` | 主文字色 |
| `--text-secondary` | `#a0aec0` | 次文字色 |
| `--text-muted` | `#718096` | 弱化文字 |
| `--bg-primary` | `#0f172a` | 主背景 |
| `--bg-secondary` | `#1e293b` | 次背景 |
| `--bg-card` | `rgba(30,41,59,0.85)` | 卡片背景 |
| `--bg-card-solid` | `#1e293b` | 卡片实色背景 |
| `--border-color` | `rgba(100,160,220,0.15)` | 默认边框 |
| `--border-color-strong` | `rgba(100,160,220,0.25)` | 强调边框 |
| `--shadow-soft` | `0 4px 20px rgba(0,0,0,0.3)` | 柔和阴影 |
| `--shadow-card` | `0 8px 32px rgba(0,0,0,0.4)` | 卡片阴影 |
| `--shadow-hover` | `0 12px 40px rgba(0,0,0,0.5)` | 悬停阴影 |
| `--nav-bg` | `rgba(15,23,42,0.92)` | 导航栏背景 |
| `--code-bg` | `#0d1525` | 代码块背景 |
| `--hero-gradient` | `linear-gradient(135deg, #0f172a, #1a1530, #0f172a)` | 首页背景渐变 |
| `--blockquote-bg` | `rgba(43,141,214,0.1)` | 引用块背景 |
| `--tag-bg` | `rgba(43,141,214,0.15)` | 标签背景 |
| `--tag-text` | `var(--alice-300)` | 标签文字 |
| `--category-bg` | `rgba(43,141,214,0.15)` | 分类背景 |
| `--category-text` | `var(--alice-300)` | 分类文字 |

---

## 2. 基础重置

```css
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  scroll-behavior: smooth;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
```

- 全局 `box-sizing: border-box`
- 平滑滚动
- 字体抗锯齿优化

---

## 3. 背景装饰

`body::before` 伪元素创建三个径向渐变光晕：
- 20% 20% 位置：粉色光晕 (`--accent-pink`)
- 80% 80% 位置：青色光晕 (`--accent-teal`)
- 50% 50% 位置：薰衣草光晕 (`--accent-lavender`)

Dark 模式降低透明度（从 0.05 降到 0.03）。

---

## 4. 组件样式分类

### 4.1 导航栏 (`.navbar`)

- `position: sticky; top: 0; z-index: 100`
- 毛玻璃效果：`backdrop-filter: blur(20px) saturate(180%)`
- 高度：3.5rem
- Flexbox 水平布局

### 4.2 Hero 区域

- CSS Grid 两栏：`1fr 280px`
- 右侧背景光晕装饰 (`::before` 600px 径向渐变)
- 标题文字渐变：`background-clip: text` + `-webkit-text-fill-color: transparent`
- 头像卡片顶部装饰条（渐变背景 + 半透明）
- 装饰 emoji 带浮动动画

### 4.3 文章卡片 (`.post-card`)

- 毛玻璃背景 + 1px 边框
- 左侧 4px 渐变指示条（悬停时显示）
- 悬停效果：上移 4px + 边框变色 + 阴影加深
- 摘要限制 2 行（`-webkit-line-clamp: 2`）

### 4.4 文章内容

- 最大宽度 720px
- 行高 1.9
- 标题底部边框（h2）/ Alice Blue 强调色（h3）
- 链接带下划线装饰
- 代码块深色主题 + 圆角
- 图片圆角 + 悬停放大
- 表格完整边框 + 行悬停高亮

### 4.5 分页 (`.pagination`)

- Flexbox 居中
- 按钮悬停变 Alice Blue + 上移 2px

### 4.6 文章页脚

- 分享链接：卡片式按钮，悬停变色 + 上移
- 相关文章：卡片列表，悬停右移 4px

### 4.7 分类/标签页

- 分类：网格布局 `auto-fill, minmax(300px, 1fr)`
- 标签云：flex 换行，字号动态计算
- 标签文章列表：卡片分组

### 4.8 归档页

- 时间线布局：左侧渐变竖线 + 年份节点圆点
- 文章卡片：flex 横向排列，悬停右移

---

## 5. 响应式断点

### 平板 (≤ 900px)

```css
@media (max-width: 900px) {
  .hero-grid { grid-template-columns: 1fr 240px; gap: 2rem; }
  .hero-name { font-size: 2rem; }
}
```

### 手机 (≤ 768px)

```css
@media (max-width: 768px) {
  .nav-links { display: none; }         /* 隐藏桌面导航 */
  .menu-toggle { display: block; }      /* 显示汉堡按钮 */
  .hero-grid { grid-template-columns: 1fr; }  /* 单栏 */
  .hero-avatar { order: -1; }           /* 头像移到顶部 */
  .hero-name { font-size: 2rem; }
  .post-header .post-title { font-size: 1.5rem; }
  .decoration { display: none; }        /* 隐藏装饰元素 */
}
```

### 小屏 (≤ 480px)

```css
@media (max-width: 480px) {
  .container { padding: 0 1rem; }
  .hero-name { font-size: 1.75rem; }
  .hero-links { flex-direction: column; }  /* 按钮纵向排列 */
  .post-card { padding: 1.25rem; }
  .post-footer { flex-direction: column; }
}
```

### 断点汇总

| 断点 | 范围 | 主要变化 |
|------|------|----------|
| > 900px | 桌面 | 完整双栏 Hero，全功能导航 |
| 768px ~ 900px | 平板 | Hero 右栏收窄 |
| < 768px | 手机 | 单栏布局，汉堡菜单，隐藏装饰 |
| < 480px | 小屏 | 容器内边距收窄，按钮纵向排列 |

---

## 6. 打印样式

```css
@media print {
  .navbar, .theme-toggle, .decoration,
  .hero-links, .share-section, .footer {
    display: none !important;
  }
  body { background: white; color: black; }
  .post-content a::after {
    content: " (" attr(href) ")";
    font-size: 0.8em;
    color: #666;
  }
}
```

- 隐藏导航栏、主题按钮、装饰、链接、分享、页脚
- 强制白底黑字
- 链接后显示 URL 地址

---

## 7. 无障碍支持

### 减少动画

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

当用户系统设置"减少动态效果"时，禁用所有动画和过渡。

### 其他无障碍特性

- 主题切换按钮：`aria-label="切换主题"`
- 菜单按钮：`aria-label="菜单"`
- 链接安全：外部链接均使用 `rel="noopener"`
- 图片：`loading="lazy"` 延迟加载
- 字体抗锯齿：`-webkit-font-smoothing: antialiased`

---

## 8. 自定义样式扩展点

### 独立页面内联样式

以下页面在各自的 `.html` 文件中通过 `<style>` 标签定义专属样式：

| 页面 | 文件 | 样式行数 |
|------|------|----------|
| 分类 | `categories.html` | ~90 行 |
| 标签 | `tags.html` | ~110 行 |
| 归档 | `year-archive.html` | ~155 行 |

这些样式使用相同的 CSS 变量系统，确保与全局主题一致。

### 添加新主题变量

在 `main.css` 的 `:root` 中添加变量，然后在 `[data-theme="dark"]` 中覆盖 Dark 模式的值：

```css
:root {
  --my-new-color: #ff6b6b;
}

[data-theme="dark"] {
  --my-new-color: #ff8787;
}
```
