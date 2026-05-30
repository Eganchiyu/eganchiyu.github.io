# 交互脚本文档

> 主脚本文件: `assets/js/main.js`（~720 行）
> 采用 IIFE 立即执行函数封装，包含 13 个功能模块。

---

## 架构概览

```javascript
(function() {
  'use strict';

  const ThemeManager = { ... };       // 主题切换
  const MobileMenu = { ... };         // 移动端菜单
  const NavbarScroll = { ... };       // 导航栏滚动效果
  const SmoothScroll = { ... };       // 平滑滚动
  const CodeBlockManager = { ... };   // 代码块复制
  const BackToTop = { ... };          // 返回顶部
  const ReadingProgress = { ... };    // 阅读进度条
  const TOCManager = { ... };         // 文章目录
  const SearchManager = { ... };      // 搜索功能
  const LightboxManager = { ... };    // 图片灯箱

  document.addEventListener('DOMContentLoaded', () => {
    ThemeManager.init();
    MobileMenu.init();
    NavbarScroll.init();
    SmoothScroll.init();
    CodeBlockManager.init();
    BackToTop.init();
    ReadingProgress.init();
    TOCManager.init();
    SearchManager.init();
    LightboxManager.init();
  });
})();
```

所有模块遵循统一接口：每个模块都是一个对象字面量，包含 `init()` 方法。在 `DOMContentLoaded` 事件中按顺序初始化。

---

## 1. ThemeManager — 主题切换

### 功能

在 Light / Dark 两个主题之间切换，并通过 `localStorage` 持久化用户选择。

### 常量

| 常量 | 值 | 用途 |
|------|-----|------|
| `STORAGE_KEY` | `'theme'` | localStorage 存储键名 |
| `DARK` | `'dark'` | Dark 主题标识 |
| `LIGHT` | `'light'` | Light 主题标识 |

### init() 方法

```
1. 获取 DOM 元素：document.getElementById('themeToggle')
2. 读取 localStorage 中保存的主题
3. 若无保存值，检测系统 prefers-color-scheme 媒体查询
4. 调用 apply() 应用主题
5. 绑定点击事件监听器
```

### apply(theme) 方法

```javascript
apply(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  // 更新 meta theme-color
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) {
    meta.content = theme === this.DARK ? '#0f172a' : '#f0f8ff';
  }
}
```

- 设置 `<html>` 元素的 `data-theme` 属性
- 更新 `<meta name="theme-color">` 的值（影响移动端浏览器顶栏颜色）
  - Dark: `#0f172a`（深蓝）
  - Light: `#f0f8ff`（Alice Blue）

### 点击事件逻辑

```javascript
this.toggle.addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === this.DARK ? this.LIGHT : this.DARK;
  this.apply(next);
  localStorage.setItem(this.STORAGE_KEY, next);
});
```

### 与默认布局的协作

`default.html` 的 `<head>` 中有一个内联脚本，在页面加载时同步应用主题（防止闪烁）。`ThemeManager.init()` 在 DOM 加载完成后再次确认主题状态并绑定交互。

---

## 2. MobileMenu — 移动端菜单

### 功能

控制汉堡菜单的展开/收起，提供移动端导航体验。

### DOM 元素

| ID | 元素 | 说明 |
|----|------|------|
| `menuToggle` | `<button>` | 汉堡按钮 (☰ / ✕) |
| `mobileMenu` | `<div>` | 移动端菜单面板 |

### init() 方法

注册三类事件监听器：

#### 2.1 汉堡按钮点击

```javascript
this.toggle.addEventListener('click', () => {
  this.menu.classList.toggle('active');
  this.toggle.textContent = this.menu.classList.contains('active') ? '✕' : '☰';
});
```

- 切换 `.mobile-menu` 的 `active` 类（控制显示/隐藏）
- 同步更新按钮图标

#### 2.2 菜单链接点击

```javascript
this.menu.querySelectorAll('.mobile-link').forEach(link => {
  link.addEventListener('click', () => {
    this.menu.classList.remove('active');
    this.toggle.textContent = '☰';
  });
});
```

点击任意菜单链接后自动关闭菜单。

#### 2.3 点击外部区域关闭

```javascript
document.addEventListener('click', (e) => {
  if (!this.toggle.contains(e.target) && !this.menu.contains(e.target)) {
    this.menu.classList.remove('active');
    this.toggle.textContent = '☰';
  }
});
```

点击页面其他区域（非按钮和菜单面板）时关闭菜单。

### CSS 配合

- `.mobile-menu` 默认 `display: none`
- `.mobile-menu.active` 设置 `display: block` + `slideDown` 动画
- `.menu-toggle` 在 > 768px 时 `display: none`

---

## 3. NavbarScroll — 导航栏滚动阴影

### 功能

页面滚动超过 50px 时，为导航栏添加阴影效果。

### DOM 元素

| 选择器 | 元素 |
|--------|------|
| `.navbar` | 导航栏 |

### init() 方法

```javascript
init() {
  this.navbar = document.querySelector('.navbar');
  if (!this.navbar) return;

  let lastScroll = 0;
  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const currentScroll = window.pageYOffset;
        if (currentScroll > 50) {
          this.navbar.style.boxShadow = 'var(--shadow-soft)';
        } else {
          this.navbar.style.boxShadow = 'none';
        }
        lastScroll = currentScroll;
        ticking = false;
      });
      ticking = true;
    }
  });
}
```

### 性能优化

使用 `requestAnimationFrame` 节流模式：

1. 滚动事件触发时，检查 `ticking` 标志
2. 如果没有待处理的动画帧，请求一个新的 `requestAnimationFrame`
3. 在动画帧回调中执行 DOM 操作
4. 重置 `ticking` 标志

这避免了在每个滚动事件上都执行 DOM 操作，确保每帧最多执行一次。

### 阴影值

| 条件 | box-shadow |
|------|------------|
| `scrollY > 50` | `var(--shadow-soft)`（Light: `0 4px 20px rgba(43,141,214,0.08)`, Dark: `0 4px 20px rgba(0,0,0,0.3)`） |
| `scrollY ≤ 50` | `none` |

---

## 4. SmoothScroll — 平滑滚动

### 功能

为页面内锚点链接 (`href="#xxx"`) 提供平滑滚动效果。

### init() 方法

```javascript
init() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}
```

### 逻辑

1. 选取所有 `href` 以 `#` 开头的链接
2. 跳过纯 `#` 链接（`targetId === '#'`）
3. 查找目标元素
4. 阻止默认跳转行为
5. 使用 `scrollIntoView` API 平滑滚动到目标位置

### 使用场景

- 标签页面中，标签云点击跳转到对应标签的文章列表
- 分类页面中，分类卡片点击跳转到对应分类
- 文章内容中的目录锚点跳转

---

## 5. 事件绑定和初始化流程

### 时序

```
页面加载
│
├── <head> 中内联脚本执行（同步）
│   └── 读取 localStorage → 设置 data-theme（防闪烁）
│
├── HTML 解析
│   ├── 渲染 navigation.html
│   ├── 渲染页面内容
│   └── 渲染 footer.html
│
├── DOMContentLoaded 事件触发
│   ├── ThemeManager.init()       // 绑定主题按钮 + 确认主题
│   ├── MobileMenu.init()         // 绑定菜单按钮 + 关闭逻辑
│   ├── NavbarScroll.init()       // 绑定滚动监听
│   ├── SmoothScroll.init()       // 绑定锚点链接
│   ├── CodeBlockManager.init()   // 处理代码块复制按钮
│   ├── BackToTop.init()          // 绑定返回顶部按钮
│   ├── ReadingProgress.init()    // 绑定阅读进度条
│   ├── TOCManager.init()         // 构建文章目录
│   ├── SearchManager.init()      // 加载搜索数据 + 绑定事件
│   └── LightboxManager.init()    // 绑定图片灯箱
│
└── main.js 使用 defer 加载，确保在 DOM 解析后执行
```

### 防御性编程

每个模块的 `init()` 方法都包含 DOM 元素存在性检查：

```javascript
if (!this.toggle) return;  // ThemeManager
if (!this.toggle || !this.menu) return;  // MobileMenu
if (!this.navbar) return;  // NavbarScroll
```

如果对应的 DOM 元素不存在（例如某些特殊页面），模块会静默跳过，不会报错。

### 作用域隔离

所有代码封装在 IIFE `(function() { ... })()` 中，不会污染全局命名空间。各模块之间无依赖关系，可以独立修改。

---

## 6. CodeBlockManager — 代码块复制

### 功能

为代码块添加复制按钮和语言标签，提升代码阅读体验。

### 特性

- 自动检测代码语言
- 代码块头部显示三个圆点 + 语言标签
- 复制按钮带 SVG 图标
- 复制成功后显示"已复制!"提示
- 2 秒后自动恢复按钮状态

---

## 7. BackToTop — 返回顶部

### 功能

页面滚动超过 300px 后显示返回顶部按钮。

### 特性

- 初始隐藏，滚动后渐显
- 点击平滑滚动回顶部
- 使用 `requestAnimationFrame` 节流

---

## 8. ReadingProgress — 阅读进度条

### 功能

在文章详情页显示阅读进度条。

### 特性

- 仅在 `single.html` 布局显示
- 进度条宽度随滚动位置动态变化
- 0% 在顶部，100% 在底部

---

## 9. TOCManager — 文章目录

### 功能

自动从文章内容中提取标题生成目录。

### 特性

- 提取 h2/h3/h4 标题
- 桌面端：右侧固定目录，滚动时高亮当前章节
- 移动端：可折叠目录面板
- 使用 `IntersectionObserver` 实现滚动高亮
- 通过 Front Matter `toc: false` 可关闭

---

## 10. SearchManager — 搜索功能

### 功能

纯前端搜索，支持关键词匹配。

### 特性

- 异步加载 `search.json` 索引
- 支持标题、摘要、分类、标签搜索
- 搜索结果高亮匹配文本
- Ctrl/Cmd+K 快捷键打开
- ESC 键关闭
- 300ms 防抖

---

## 11. LightboxManager — 图片灯箱（缩略图 + 按需加载原图）

### 功能

点击文章内图片弹出全屏查看，支持缩略图快速加载和原图按需加载。

### 特性

- 自动将 `.post-content img` 的 src 替换为压缩缩略图（`assets/images/thumbs/`）
- 原图路径存储在 `data-original` 属性
- 点击图片打开灯箱时：显示旋转加载圈 → 后台加载原图 → 加载完成后渐显显示
- 半透明遮罩 + 居中显示
- 点击遮罩或 ESC 关闭
- 关闭时带缩放动画
- 移动端支持
- `prefers-reduced-motion` 时禁用动画

### 图片压缩

- 使用 `scripts/generate_thumbs.py` 生成压缩缩略图
- 缩略图最大宽度 800px，JPEG 质量 60%
- 原始图片 57MB → 缩略图 1.3MB（压缩率 98%）
- 页面加载时只下载缩略图，点击后才加载原图
