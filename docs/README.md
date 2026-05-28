# Eganchiyu's GitHub Pages 文档

> 个人技术博客，记录学习、思考与项目实践。

**线上地址**: https://eganchiyu.github.io/  
**仓库地址**: https://github.com/Eganchiyu/eganchiyu.github.io  
**作者**: Eganchiyu (池宇健) — 西北工业大学

---

## 快速导航

### 模块文档

| 文档 | 说明 |
|------|------|
| [layouts.md](./layouts.md) | 布局系统：default/home/single 模板与继承关系 |
| [components.md](./components.md) | 组件：导航栏、页脚、分类/标签/归档页面 |
| [styling.md](./styling.md) | 样式系统：CSS 变量、Alice Blue 色系、响应式、无障碍 |
| [javascript.md](./javascript.md) | 交互脚本：主题切换、移动菜单、滚动效果 |
| [posts.md](./posts.md) | 文章系统：Front Matter、分类标签、文章列表 |
| [configuration.md](./configuration.md) | 配置参考：_config.yml、Gemfile、staticman |

### 总览文档

| 文档 | 说明 |
|------|------|
| [ARCHITECTURE.md](./ARCHITECTURE.md) | 项目结构、设计系统与技术架构 |

---

## 项目概述

基于 **Jekyll 4.4** 的静态博客，采用完全自定义的 **Alice Blue** 二次元主题，部署于 GitHub Pages。

### 核心技术栈

| 组件 | 版本/说明 |
|------|----------|
| Jekyll | ~> 4.4 |
| Ruby | 3.3 |
| 主题 | 完全自定义 (Alice Blue 二次元风格) |
| 语言 | zh-CN |
| Markdown | kramdown + GFM |
| 语法高亮 | rouge |
| 分页 | jekyll-paginate (每页 10 篇) |

### 主要插件

- `jekyll-paginate` — 文章分页
- `jekyll-sitemap` — 站点地图生成
- `jekyll-gist` — GitHub Gist 嵌入
- `jekyll-feed` — RSS 订阅源
- `jekyll-include-cache` — 模板缓存加速

---

## 本地开发

### 环境要求

- Ruby >= 3.0 (推荐 3.3)
- Bundler

### 启动命令

```bash
# 安装依赖
bundle install

# 本地构建并启动（localhost:4000）
bundle exec jekyll serve

# 或使用快捷脚本
localhost-build.cmd
```

### 部署

推送到 `main` 分支后，GitHub Pages 通过 Actions 自动构建部署。

---

## 目录结构概览

```
eganchiyu.github.io/
├── _config.yml          # Jekyll 主配置
├── _data/               # 数据文件
│   └── navigation.yml   # 导航菜单
├── _includes/           # 模板片段 (navigation, footer)
├── _layouts/            # 页面布局 (default, home, single)
├── _posts/              # 博客文章 (Markdown, 18篇)
├── _sass/               # Sass 样式源码
├── assets/              # 静态资源 (css/js/images)
├── .github/             # GitHub 模板与 Actions
├── .trae/               # Trae IDE 规则与技能
├── docs/                # 项目文档 (本目录)
├── index.html           # 首页
├── categories.html      # 分类页
├── tags.html            # 标签页
├── year-archive.html    # 归档页
├── staticman.yml        # 评论表单配置
├── Gemfile              # Ruby 依赖
└── localhost-build.cmd  # 本地启动脚本
```

---

## 联系方式

- **邮箱**: eganchiyu@163.com
- **GitHub**: https://github.com/Eganchiyu
