# Eganchiyu's GitHub Pages 文档

> 个人技术博客，记录学习、思考与项目实践。

**线上地址**: https://eganchiyu.github.io/  
**仓库地址**: https://github.com/Eganchiyu/eganchiyu.github.io  
**作者**: Eganchiyu (池宇健) — 西北工业大学

---

## 快速导航

| 文档 | 说明 |
|------|------|
| [ARCHITECTURE.md](./ARCHITECTURE.md) | 项目结构与技术架构 |
| [WRITING.md](./WRITING.md) | 如何撰写和发布文章 |
| [CHECKLIST.md](./CHECKLIST.md) | 文档与项目一致性检查清单 |

---

## 项目概述

基于 **Jekyll + Minimal Mistakes** 主题的静态博客，部署于 GitHub Pages。

### 核心技术栈

| 组件 | 版本/说明 |
|------|----------|
| Jekyll | >= 3.7, < 5.0 |
| Minimal Mistakes | v4.27.3 (remote_theme) |
| 皮肤 | contrast |
| 语言 | zh-CN |
| Markdown | kramdown + GFM |
| 评论系统 | giscus |
| 搜索 | lunr |
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

- Ruby >= 2.5
- Bundler
- Node.js >= 0.10.0

### 启动命令

```bash
# 安装依赖
bundle install

# 本地构建并启动（localhost:4000）
bundle exec jekyll serve

# 或使用快捷脚本
localhost-build.cmd
```

### 同步与部署

```bash
# 拉取远程更新并构建
bash sync.sh
```

推送到 `master` 分支后，GitHub Pages 自动构建部署。

---

## 目录结构概览

```
eganchiyu.github.io/
├── _config.yml          # Jekyll 主配置
├── _data/               # 数据文件
│   ├── navigation.yml   # 导航菜单
│   └── ui-text.yml      # 多语言 UI 文本
├── _includes/           # 模板片段
├── _layouts/            # 页面布局模板
├── _posts/              # 博客文章 (Markdown)
├── _sass/               # Sass 样式源码
├── assets/              # 静态资源 (图片/JS/CSS)
├── docs/                # 项目文档 (本目录)
├── index.html           # 首页
├── staticman.yml        # 评论表单配置
├── Gemfile              # Ruby 依赖
├── package.json         # Node 依赖
└── sync.sh              # 部署同步脚本
```

---

## 联系方式

- **邮箱**: eganchiyu@163.com / eganchiyu@gmail.com / chiyujian@mail.nwpu.edu.cn
- **GitHub**: https://github.com/Eganchiyu
