# 样式系统文档

> 基于 CSS 自定义属性 (CSS Variables) 的设计系统，支持 Light/Dark 双模式。
> 主样式文件: `assets/css/main.scss`（约 3800 行，构建后压缩为 ~55KB）

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
- 瀑布流布局（CSS Columns）

### 4.4 精选文章 (`.featured-card`)

- 双列网格布局
- 封面图 + 内容区域
- 悬停时封面图放大
- 移动端单列

### 4.5 文章内容

- 最大宽度 720px
- 行高 1.9
- 标题底部边框（h2）/ Alice Blue 强调色（h3）
- 链接带下划线装饰
- 代码块深色主题 + 圆角
- 图片圆角 + 悬停放大
- 表格完整边框 + 行悬停高亮

### 4.6 分页 (`.pagination`)

- Flexbox 居中
- 按钮悬停变 Alice Blue + 上移 2px

### 4.7 文章页脚

- 分享链接：卡片式按钮，悬停变色 + 上移
- 相关文章：卡片列表，悬停右移 4px
- 评论区：Giscus 组件，跟随主题切换
- 上/下篇导航：左右布局

### 4.8 分类/标签页

- 分类：网格布局 `auto-fill, minmax(300px, 1fr)`
- 标签云：flex 换行，字号动态计算
- 标签文章列表：卡片分组

### 4.9 归档页

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

### 独立页面样式

分类、标签、归档页面的样式已迁移到 `main.css` 中统一管理：

| 页面 | CSS 类前缀 |
|------|------------|
| 分类 | `.taxonomy-*` |
| 标签 | `.tags-*`, `.tag-*` |
| 归档 | `.archive-*` |

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

---

## 9. 第六阶段增强系统

### 9.1 多层次阴影系统

| 变量 | Light 值 | Dark 值 | 用途 |
|------|----------|---------|------|
| `--shadow-xs` | `0 1px 2px rgba(43,141,214,0.04)` | `0 1px 2px rgba(0,0,0,0.2)` | 最轻阴影 |
| `--shadow-sm` | `0 2px 8px rgba(43,141,214,0.06)` | `0 2px 8px rgba(0,0,0,0.25)` | 小阴影 |
| `--shadow-elevated` | `0 20px 60px rgba(43,141,214,0.12), 0 8px 20px rgba(43,141,214,0.08)` | `0 20px 60px rgba(0,0,0,0.4), 0 8px 20px rgba(0,0,0,0.3)` | 高层阴影 |
| `--shadow-glow` | `0 0 20px rgba(43,141,214,0.15), 0 0 60px rgba(43,141,214,0.05)` | `0 0 20px rgba(43,141,214,0.1), 0 0 60px rgba(43,141,214,0.04)` | 发光阴影 |
| `--shadow-inner` | `inset 0 2px 4px rgba(43,141,214,0.06)` | `inset 0 2px 4px rgba(0,0,0,0.2)` | 内阴影 |

### 9.2 渐变变量系统

| 变量 | 用途 |
|------|------|
| `--gradient-primary` | Alice Blue → Lavender 主渐变 |
| `--gradient-subtle` | 微妙背景渐变 |
| `--gradient-warm` | Pink → Peach 暖色渐变 |
| `--gradient-cool` | Alice-300 → Teal 冷色渐变 |
| `--gradient-surface` | 卡片表面渐变 |
| `--gradient-hero-bg` | Hero 区域背景渐变 |

### 9.3 排版比例系统（Major Third 1.25）

| 变量 | 值 | 用途 |
|------|-----|------|
| `--font-size-xs` | `0.64rem` | 最小文字 |
| `--font-size-sm` | `0.8rem` | 次要文字 |
| `--font-size-base` | `1rem` | 正文 |
| `--font-size-md` | `1.125rem` | 大正文/引用 |
| `--font-size-lg` | `1.25rem` | h3 标题 |
| `--font-size-xl` | `1.563rem` | h2 标题 |
| `--font-size-2xl` | `1.953rem` | 文章标题 |
| `--font-size-3xl` | `2.441rem` | Hero 标题 |
| `--font-size-4xl` | `3.052rem` | 最大标题 |

行高系统：`--leading-tight` (1.3) → `--leading-loose` (2.2)
字间距系统：`--tracking-tight` (-0.02em) → `--tracking-wider` (0.05em)

### 9.4 玻璃态效果 (`.glass-card`)

```css
.glass-card {
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(16px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: var(--shadow-sm), inset 0 1px 0 rgba(255, 255, 255, 0.4);
}
```

### 9.5 渐变边框效果

精选文章卡片悬浮时显示渐变边框，使用 CSS `mask-composite` 技术实现：

```css
.featured-card::after {
  background: linear-gradient(135deg, var(--alice-400), var(--accent-lavender), var(--accent-pink));
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask-composite: exclude;
}
```

### 9.6 滚动触发动画

CSS 类 `.reveal`、`.reveal-left`、`.reveal-right`、`.reveal-scale`、`.reveal-stagger` 配合 JS `ScrollReveal` 模块使用：

- 元素初始 `opacity: 0`，进入视口时添加 `.revealed` 类变为 `opacity: 1`
- `.reveal-stagger` 为子元素提供交错动画延迟（0.05s ~ 0.5s）
- 遵守 `prefers-reduced-motion` 设置

### 9.7 焦点环样式

所有交互元素使用 `:focus-visible` 提供清晰的键盘导航焦点环：

```css
:focus-visible {
  outline: 2px solid var(--alice-500);
  outline-offset: 3px;
  box-shadow: 0 0 0 4px rgba(43, 141, 214, 0.15);
}
```

### 9.8 触摸设备优化

`@media (hover: none)` 下：
- 禁用悬浮变换效果
- 确保最小点击区域 44px
- 使用 `:active` 替代 `:hover` 反馈

### 9.9 自定义滚动条

WebKit 浏览器自定义滚动条：8px 宽度，圆角，主题跟随。

---

## 10. 高级设计系统

### 10.1 渐变系统

项目定义了 6 种预设渐变变量，覆盖主要视觉场景：

| 变量 | Light 值 | Dark 值 | 用途 |
|------|----------|---------|------|
| `--gradient-primary` | `linear-gradient(135deg, var(--alice-400), var(--accent-lavender))` | 同 Light | 主渐变，用于标题、徽章、标签悬停 |
| `--gradient-subtle` | `linear-gradient(135deg, var(--alice-50), rgba(184,169,232,0.08))` | `linear-gradient(135deg, rgba(43,141,214,0.06), rgba(184,169,232,0.04))` | 微妙背景渐变 |
| `--gradient-warm` | `linear-gradient(135deg, var(--accent-pink), var(--accent-peach))` | 同 Light | 暖色渐变 |
| `--gradient-cool` | `linear-gradient(135deg, var(--alice-300), var(--accent-teal))` | 同 Light | 冷色渐变 |
| `--gradient-surface` | `linear-gradient(180deg, var(--bg-card), var(--bg-secondary))` | 同 Light | 卡片表面渐变 |
| `--gradient-hero-bg` | `linear-gradient(135deg, var(--alice-50) 0%, #f8f4ff 30%, var(--alice-50) 60%, #f0f0ff 100%)` | `linear-gradient(135deg, #0f172a, #1a1530, #0f172a)` | Hero 区域背景 |

**使用示例**：

```css
.hero-name {
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.tag:hover::before {
  background: var(--gradient-primary);
  opacity: 1;
}
```

### 10.2 阴影系统

6 级层次阴影 + 内阴影 + 发光阴影，形成完整的深度体系：

| 变量 | Light 值 | Dark 值 | 层级 |
|------|----------|---------|------|
| `--shadow-xs` | `0 1px 2px rgba(43,141,214,0.04)` | `0 1px 2px rgba(0,0,0,0.2)` | 最轻 |
| `--shadow-sm` | `0 2px 8px rgba(43,141,214,0.06)` | `0 2px 8px rgba(0,0,0,0.25)` | 小 |
| `--shadow-card` | `0 8px 32px rgba(43,141,214,0.12)` | `0 8px 32px rgba(0,0,0,0.4)` | 卡片 |
| `--shadow-hover` | `0 12px 40px rgba(43,141,214,0.18)` | `0 12px 40px rgba(0,0,0,0.5)` | 悬停 |
| `--shadow-elevated` | `0 20px 60px rgba(43,141,214,0.12), 0 8px 20px rgba(43,141,214,0.08)` | `0 20px 60px rgba(0,0,0,0.4), 0 8px 20px rgba(0,0,0,0.3)` | 高层 |
| `--shadow-glow` | `0 0 20px rgba(43,141,214,0.15), 0 0 60px rgba(43,141,214,0.05)` | `0 0 20px rgba(43,141,214,0.1), 0 0 60px rgba(43,141,214,0.04)` | 发光 |
| `--shadow-inner` | `inset 0 2px 4px rgba(43,141,214,0.06)` | `inset 0 2px 4px rgba(0,0,0,0.2)` | 内阴影 |

**层级递进规则**：
- `xs` → `sm`：边框级阴影
- `card` → `hover`：卡片悬浮反馈
- `elevated`：弹窗、模态框
- `glow`：强调、激活状态
- `inner`：凹陷效果（输入框、代码块）

### 10.3 动画系统

#### 缓动函数

| 变量 | 值 | 用途 |
|------|-----|------|
| `--smooth` | `cubic-bezier(0.4, 0, 0.2, 1)` | 通用平滑过渡（Material Design 标准） |
| `--bounce` | `cubic-bezier(0.68, -0.55, 0.265, 1.55)` | 弹性效果，用于成就通知 |

#### 过渡时间变量

| 变量 | 值 | 用途 |
|------|-----|------|
| `--transition-fast` | `150ms ease` | 快速反馈（按钮、焦点） |
| `--transition-base` | `250ms ease` | 标准过渡（导航、卡片） |

#### 关键帧动画

| 动画名 | 时长 | 效果 | 应用组件 |
|--------|------|------|----------|
| `pulse` | `2s ease-in-out infinite` | 呼吸脉冲 | `.hero-badge-dot` |
| `float` | `3s ease-in-out infinite` | 上下浮动 | `.logo-icon` |
| `ripple` | `0.6s linear` | 按钮涟漪 | `.ripple-effect` |
| `fadeIn` | `0.5s ease` | 淡入上移 | `.comment-guide` |
| `slideUp` | `0.3s ease` | 底部滑入 | `.share-panel-content` |
| `badge-glow` | `3s ease-in-out infinite` | 徽章发光 | `.hero-badge` |
| `achievementBounce` | `0.6s ease` | 成就弹跳 | `.achievement-toast-icon` |
| `wip-pulse` | `2.4s ease-in-out infinite` | WIP 标签脉冲 | `.post-badge.wip` |
| `lightbox-spin` | `0.8s linear infinite` | 加载旋转 | `.lightbox-spinner` |

#### 滚动触发动画

| CSS 类 | 初始状态 | 触发后 |
|--------|----------|--------|
| `.reveal` | `opacity:0; translateY(30px)` | `opacity:1; translateY(0)` |
| `.reveal-left` | `opacity:0; translateX(-30px)` | `opacity:1; translateX(0)` |
| `.reveal-right` | `opacity:0; translateX(30px)` | `opacity:1; translateX(0)` |
| `.reveal-scale` | `opacity:0; scale(0.95)` | `opacity:1; scale(1)` |
| `.reveal-stagger` | 子元素交错延迟 | 0.05s ~ 0.5s 递增 |

### 10.4 玻璃态系统

基于 `backdrop-filter` 实现毛玻璃效果：

```css
.glass-card {
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(16px) saturate(180%);
  -webkit-backdrop-filter: blur(16px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: var(--shadow-sm), inset 0 1px 0 rgba(255, 255, 255, 0.4);
}

[data-theme="dark"] .glass-card {
  background: rgba(30, 41, 59, 0.6);
  border: 1px solid rgba(100, 160, 220, 0.1);
  box-shadow: var(--shadow-sm), inset 0 1px 0 rgba(255, 255, 255, 0.03);
}
```

**应用场景**：

| 组件 | backdrop-filter 值 | 说明 |
|------|-------------------|------|
| `.navbar` | `blur(20px) saturate(180%)` | 导航栏毛玻璃 |
| `.mobile-menu` | `blur(20px)` | 移动端菜单 |
| `.glass-card` | `blur(16px) saturate(180%)` | 通用玻璃卡片 |
| `.hero-badge` | `blur(10px)` | Hero 徽章 |
| `.share-panel` | `blur(4px)` | 分享面板遮罩 |

### 10.5 季节主题色

根据当前月份自动切换季节配色，通过 JavaScript 动态设置 CSS 变量：

| 季节 | 月份 | `--season-accent` | `--season-hover` |
|------|------|-------------------|------------------|
| 春 (spring) | 3-5 月 | `#f9a8d4` (粉) | `#f472b6` |
| 夏 (summer) | 6-8 月 | `#5eead4` (青) | `#2dd4bf` |
| 秋 (autumn) | 9-11 月 | `#fdba74` (橙) | `#fb923c` |
| 冬 (winter) | 12-2 月 | `#c4b5fd` (紫) | `#a78bfa` |

**实现逻辑**（`assets/js/main.js`）：

```javascript
applySeasonalTheme() {
  const month = new Date().getMonth() + 1;
  let season = 'winter';
  if (month >= 3 && month <= 5) season = 'spring';
  if (month >= 6 && month <= 8) season = 'summer';
  if (month >= 9 && month <= 11) season = 'autumn';

  const colors = {
    spring: { accent: '#f9a8d4', hover: '#f472b6' },
    summer: { accent: '#5eead4', hover: '#2dd4bf' },
    autumn: { accent: '#fdba74', hover: '#fb923c' },
    winter: { accent: '#c4b5fd', hover: '#a78bfa' }
  };

  const root = document.documentElement;
  root.style.setProperty('--season-accent', colors[season].accent);
  root.style.setProperty('--season-hover', colors[season].hover);
}
```

**使用方式**：

```css
.hero-badge-dot {
  background: var(--season-accent);
}
```

### 10.6 排版比例系统

基于 Major Third (1.25) 比例的模块化字体系统：

#### 字体大小

| 变量 | 值 | 计算 | 用途 |
|------|-----|------|------|
| `--font-size-xs` | `0.64rem` | 1rem ÷ 1.25³ | 最小文字 |
| `--font-size-sm` | `0.8rem` | 1rem ÷ 1.25 | 次要文字 |
| `--font-size-base` | `1rem` | 基准 | 正文 |
| `--font-size-md` | `1.125rem` | — | 大正文/引用 |
| `--font-size-lg` | `1.25rem` | 1rem × 1.25 | h3 标题 |
| `--font-size-xl` | `1.563rem` | 1rem × 1.25² | h2 标题 |
| `--font-size-2xl` | `1.953rem` | 1rem × 1.25³ | 文章标题 |
| `--font-size-3xl` | `2.441rem` | 1rem × 1.25⁴ | Hero 标题 |
| `--font-size-4xl` | `3.052rem` | 1rem × 1.25⁵ | 最大标题 |

#### 行高系统

| 变量 | 值 | 用途 |
|------|-----|------|
| `--leading-tight` | `1.3` | 标题 |
| `--leading-snug` | `1.5` | 副标题 |
| `--leading-normal` | `1.7` | 正文基础 |
| `--leading-relaxed` | `1.9` | 文章正文 |
| `--leading-loose` | `2.2` | 大段落 |

#### 字间距系统

| 变量 | 值 | 用途 |
|------|-----|------|
| `--tracking-tight` | `-0.02em` | 大标题 |
| `--tracking-normal` | `0` | 正文 |
| `--tracking-wide` | `0.02em` | 小标题 |
| `--tracking-wider` | `0.05em` | 标签、徽章 |

**应用示例**：

```css
.hero-name {
  font-size: var(--font-size-3xl);
  font-weight: 800;
  letter-spacing: var(--tracking-tight);
  line-height: var(--leading-tight);
}

.post-content {
  font-size: var(--font-size-base);
  line-height: var(--leading-relaxed);
}

.post-content h2 {
  font-size: var(--font-size-xl);
  letter-spacing: var(--tracking-tight);
  line-height: var(--leading-snug);
}
```
