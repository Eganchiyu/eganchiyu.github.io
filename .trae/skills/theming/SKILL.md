---
name: "theming"
description: "Alice Blue 主题定制指南，包含 CSS 设计系统、Light/Dark 双模式切换、响应式断点、字体系统和组件样式约定。当用户询问主题定制、样式修改或颜色配置时调用。"
---

# 主题定制指南

> 本项目使用自定义 Alice Blue 主题，支持 Light/Dark 双模式。

---

## 1. CSS 设计系统

### Alice Blue 色系

项目以 Alice Blue 为主色调，搭配粉/青/紫三种强调色。

```css
/* === Alice Blue 主色阶 === */
--alice-50:  #f0f8ff;   /* 最浅 - 背景色 */
--alice-100: #dbe9f7;   /* 浅色背景 */
--alice-200: #b8d4ef;   /* 边框/分割线 */
--alice-300: #8ab8e2;   /* 次要元素 */
--alice-400: #5a9bd5;   /* 交互元素悬停 */
--alice-500: #2b8dd6;   /* 主色 - 链接/按钮 */
--alice-600: #1e6fb0;   /* 主色按下状态 */
--alice-700: #17568a;   /* 深色强调 */
--alice-800: #113e64;   /* 深色文字 */
--alice-900: #0b2740;   /* 最深 - Dark 模式背景 */

/* === 强调色 === */
--accent-pink:     /* 粉色系 - 用于标签/徽章 */
--accent-teal:     /* 青绿色系 - 用于代码/技术内容 */
--accent-lavender: /* 薰衣草紫 - 用于特殊高亮 */
```

### 语义化颜色变量

```css
/* Light 模式 */
[data-theme="light"] {
  --bg-primary:    #ffffff;
  --bg-secondary:  #f8f9fa;
  --text-primary:  #1a1a2e;
  --text-secondary:#6c757d;
  --border-color:  #dee2e6;
  --link-color:    var(--alice-500);
  --code-bg:       #f4f4f8;
}

/* Dark 模式 */
[data-theme="dark"] {
  --bg-primary:    #0d1117;
  --bg-secondary:  #161b22;
  --text-primary:  #e6edf3;
  --text-secondary:#8b949e;
  --border-color:  #30363d;
  --link-color:    var(--alice-400);
  --code-bg:       #1e2330;
}
```

### 使用规则

1. **必须使用 CSS 变量**，禁止硬编码颜色值
2. 新增颜色时**同时定义 Light 和 Dark 值**
3. 语义化命名优于具体色名 (用 `--bg-primary` 而非 `--white`)

---

## 2. Light/Dark 主题切换机制

### 实现原理

1. HTML 根元素设置 `data-theme` 属性 (`light` / `dark`)
2. CSS 通过 `[data-theme="light"]` 和 `[data-theme="dark"]` 选择器应用不同变量值
3. 用户偏好存储在 `localStorage` 的 `theme` 键中
4. 页面 `<head>` 中有**内联脚本**在渲染前读取偏好，防止主题闪烁 (FOUC)

### 切换流程

```
用户点击切换按钮
    ↓
main.js 切换 data-theme 属性
    ↓
更新 localStorage
    ↓
CSS 变量立即生效 (无需重载)
```

### 内联防闪烁脚本 (位于 `<head>`)

```html
<script>
  (function() {
    var theme = localStorage.getItem('theme');
    if (theme) {
      document.documentElement.setAttribute('data-theme', theme);
    } else {
      // 默认跟随系统偏好
      var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
    }
  })();
</script>
```

### 注意事项

- 切换逻辑在 `assets/js/main.js` 中实现
- **不要移除内联防闪烁脚本**，否则切换页面时会闪白/闪黑
- 新增页面时确保加载顺序: 内联脚本 → CSS → 其他 JS

---

## 3. 响应式断点

```css
/* 桌面端: > 900px */
@media (min-width: 901px) { ... }

/* 平板端: 768px - 900px */
@media (min-width: 768px) and (max-width: 900px) { ... }

/* 手机端: < 768px */
@media (max-width: 767px) { ... }

/* 小屏手机: < 480px */
@media (max-width: 479px) { ... }
```

### 布局策略

| 断点 | 内容宽度 | 侧边栏 | 导航 |
|------|---------|---------|------|
| > 900px | ~800px | 可见 | 水平导航 |
| 768-900px | 100% - padding | 隐藏或折叠 | 水平导航 |
| < 768px | 100% - padding | 隐藏 | 汉堡菜单 |
| < 480px | 100% - padding | 隐藏 | 汉堡菜单 (紧凑) |

### 设计原则

- **移动优先**: 基础样式面向小屏，通过 `min-width` 逐步增强
- 图片使用 `max-width: 100%` 确保不溢出
- 文字使用 `rem` 单位，确保缩放一致性

---

## 4. 字体系统

### 字体栈

```css
/* 正文 (西文优先) */
--font-body: 'Inter', 'HarmonyOS Sans SC', -apple-system, BlinkMacSystemFont,
             'Segoe UI', Roboto, sans-serif;

/* 代码 */
--font-mono: 'JetBrains Mono', 'Fira Code', 'Cascadia Code', Consolas, monospace;

/* 中文标题 (可选) */
--font-heading: 'Inter', 'HarmonyOS Sans SC', sans-serif;
```

### 字体说明

| 字体 | 用途 | 加载方式 |
|------|------|---------|
| **Inter** | 主要西文字体 | Google Fonts / CDN |
| **JetBrains Mono** | 代码块字体 | Google Fonts / CDN |
| **HarmonyOS Sans SC** | 中文降级字体 | CDN / 系统字体 |

### 字号体系

```css
--text-xs:   0.75rem;   /* 12px - 辅助文字 */
--text-sm:   0.875rem;  /* 14px - 注释/脚注 */
--text-base: 1rem;      /* 16px - 正文 */
--text-lg:   1.125rem;  /* 18px - 强调正文 */
--text-xl:   1.25rem;   /* 20px - 小标题 */
--text-2xl:  1.5rem;    /* 24px - 二级标题 */
--text-3xl:  1.875rem;  /* 30px - 一级标题 */
```

### 行高

```css
--leading-tight:  1.25;  /* 标题 */
--leading-normal: 1.6;   /* 正文 */
--leading-loose:  1.8;   /* 长文阅读 */
```

---

## 5. 组件样式约定

### 文章卡片 (.post-card)

```css
.post-card {
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 1.5rem;
  transition: box-shadow 0.2s ease;
}

.post-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
```

### 导航栏 (.site-nav)

- 固定在页面顶部
- 支持响应式折叠
- 包含主题切换按钮

### 代码块

- 使用 `JetBrains Mono` 字体
- Dark 模式下使用深色背景
- 支持语法高亮 (Rouge 引擎)
- 行号可选

### 按钮

```css
.btn-primary {
  background: var(--alice-500);
  color: #ffffff;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  transition: background 0.2s ease;
}

.btn-primary:hover {
  background: var(--alice-600);
}
```

---

## 6. 修改样式的正确流程

### 1. 确定修改范围

```
问自己:
├─ 只改单篇文章? → 使用文章内的 <style> 标签 (不推荐)
├─ 改全局样式?   → 编辑 assets/css/main.css
├─ 改 SCSS 源文件? → 编辑 _sass/minimal-mistakes/_custom.scss
└─ 新增变量?     → 在 main.css 的 :root 中添加
```

### 2. 编辑文件

主要样式文件:
- **`assets/css/main.css`** — 主样式表 (1279行)，包含所有组件样式
- **`_sass/minimal-mistakes/_custom.scss`** — 自定义 SCSS (遗留文件)

### 3. 本地预览

```bash
bundle exec jekyll serve --livereload
# 浏览器访问 http://localhost:4000
# 修改后自动刷新
```

### 4. 双模式验证

修改样式后**必须同时检查**:
- [ ] Light 模式显示正常
- [ ] Dark 模式显示正常
- [ ] 桌面端布局正确
- [ ] 手机端布局正确

### 5. 提交

```bash
git add assets/css/main.css
git commit -m "style(theme): 描述你的修改"
```

### ⚠️ 注意事项

- **不要**直接修改 `_site/assets/css/` 中的文件 (构建产物)
- **不要**删除 Light 或 Dark 模式的 CSS 变量定义
- 新增组件时，确保在两种主题下都有合理的样式
- 尽量复用已有的 CSS 变量，减少重复定义