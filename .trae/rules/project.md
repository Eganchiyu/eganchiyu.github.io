# 项目规则 - Eganchiyu 的 GitHub Pages 博客

> AI 助手在操作此项目时必须遵守以下规则。

---

## 1. 项目概述

- **框架**: Jekyll 4.4 (静态网站生成器)
- **运行环境**: Ruby 3.3 + Bundler
- **托管平台**: GitHub Pages
- **主题**: 自定义 Alice Blue 主题 (非第三方 gem 主题)
- **站点标题**: Eganchiyu的Github Pages
- **副标题**: 学习·记录·随想
- **语言/区域**: 中文 (zh-CN)

---

## 2. 文件结构约定

```
eganchiyu.github.io/
├── _config.yml            # Jekyll 主配置 (不要随意修改)
├── _layouts/              # 页面布局模板
│   ├── default.html       # 基础布局
│   ├── home.html          # 首页布局
│   └── single.html        # 文章详情布局
├── _includes/             # 可复用模板片段
│   ├── navigation.html    # 导航栏
│   └── footer.html        # 页脚
├── _posts/                # 博文目录 (Markdown)
├── _sass/                 # SCSS 源文件
│   └── minimal-mistakes/
│       └── _custom.scss   # 自定义样式 (遗留文件)
├── assets/
│   ├── css/
│   │   └── main.css       # 主样式表 (1279 行)
│   ├── js/
│   │   └── main.js        # 主脚本 (132 行)
│   └── images/            # 图片资源
├── .github/
│   └── workflows/
│       └── build.yml      # GitHub Actions 部署工作流
├── index.html             # 首页入口
├── Gemfile                # Ruby 依赖
├── Gemfile.lock           # 依赖锁定
├── localhost-build.cmd    # 本地开发启动脚本
└── _site/                 # ⚠️ 构建产物 - 禁止手动修改
```

### 禁止修改的目录/文件

| 路径 | 原因 |
|------|------|
| `_site/` | Jekyll 构建产物，每次构建都会被覆盖 |
| `Gemfile.lock` | 由 Bundler 自动生成，避免手动编辑 |
| `.jekyll-cache/` | Jekyll 缓存，构建时自动生成 |

---

## 3. 命名规范

### 博文文件

- 格式: `YYYY-MM-DD-slug.md`
- slug 使用英文小写，单词间用连字符 `-` 分隔
- 示例: `2025-06-15-raspberry-pi-setup.md`

### 布局与包含文件

- 使用小写字母和连字符
- 示例: `default.html`, `navigation.html`

### CSS 类名

- 使用 BEM 风格或连字符分隔的小写命名
- 示例: `.post-card`, `.post-card__title`, `.post-card--featured`

---

## 4. 编码规范

- **字符编码**: 统一使用 UTF-8 (无 BOM)
- **语言**: 博文内容以中文为主，技术术语可保留英文
- **缩进**: HTML/Liquid 使用 2 空格缩进；CSS 使用 2 空格缩进
- **行尾**: LF (Unix 风格换行符)
- **行宽**: Markdown 写作建议每行不超过 120 字符

---

## 5. Front Matter 规范

每篇博文必须包含以下 Front Matter:

```yaml
---
title: "文章标题"
excerpt: "文章摘要，用于列表页和 SEO"
date: YYYY-MM-DD HH:MM:SS +0800
categories: [分类名]
tags: [标签1, 标签2]
---
```

### 可选字段

```yaml
---
layout: single          # 默认为 single
author: Eganchiyu       # 作者
permalink: /custom/url/ # 自定义永久链接 (通常不需要)
---
```

### 支持的分类列表

- 随想
- 学习记录
- 树莓派
- ESP32
- 线性代数
- LLM
- 小结

> 新增分类需谨慎，应与已有分类体系保持一致。

---

## 6. CSS 变量系统

项目使用 Alice Blue 色系，通过 CSS 自定义属性实现 Light/Dark 双模式。

### 核心色彩变量

```css
/* Alice Blue 主色 */
--alice-50:  #f0f8ff;
--alice-100: #dbe9f7;
--alice-200: #b8d4ef;
--alice-300: #8ab8e2;
--alice-400: #5a9bd5;
--alice-500: #2b8dd6;  /* 主色 */
--alice-600: #1e6fb0;
--alice-700: #17568a;
--alice-800: #113e64;
--alice-900: #0b2740;

/* 强调色 */
--accent-pink:    /* 粉色系 */;
--accent-teal:    /* 青绿色系 */;
--accent-lavender: /* 薰衣草紫色系 */;
```

### 主题切换

- 通过 `data-theme` 属性 (`light` / `dark`) 切换
- 使用 `localStorage` 持久化用户偏好
- 页面加载时使用内联脚本防止主题闪烁 (FOUC)

### 规则

- **不要硬编码颜色值**，必须使用 CSS 变量
- **不要删除** Light 或 Dark 任一模式的变量定义
- 新增颜色需同时定义 Light 和 Dark 两套值

---

## 7. 提交规范

使用 [Conventional Commits](https://www.conventionalcommits.org/) 规范:

```
<type>(<scope>): <description>

[optional body]
[optional footer]
```

### 类型 (type)

| 类型 | 说明 |
|------|------|
| `feat` | 新功能或新文章 |
| `fix` | 修复问题 |
| `style` | 样式调整 (不影响功能) |
| `content` | 博文内容更新 |
| `config` | 配置文件变更 |
| `docs` | 文档更新 |
| `chore` | 构建/工具链变更 |
| `refactor` | 重构 (不改变功能) |

### 示例

```
feat(content): 新增树莓派5开箱评测文章
style(theme): 调整暗色模式代码块背景色
fix(navigation): 修复移动端导航菜单遮挡问题
config: 更新 jekyll-paginate 分页数为10
```

---

## 8. 关键提醒

1. **永远不要直接编辑 `_site/` 目录** — 它是构建产物
2. **修改样式时必须同时检查 Light 和 Dark 模式**
3. **新增分类前先确认是否有必要**，避免碎片化
4. **图片放入 `assets/images/`**，使用相对路径引用
5. **提交前先在本地验证构建** (`bundle exec jekyll build`)
6. **保持 `_config.yml` 的稳定性**，修改需谨慎评估影响
