---
name: "jekyll-basics"
description: "Jekyll 4.4 开发基础知识，包含目录结构、Liquid 模板语法、配置文件说明、本地开发命令和常见问题排查。当用户询问 Jekyll 相关问题或需要了解项目基础架构时调用。"
---

# Jekyll 开发基础

> 本项目使用 Jekyll 4.4 构建静态博客，托管于 GitHub Pages。

---

## 1. Jekyll 目录结构说明

```
eganchiyu.github.io/
├── _config.yml          # 全站配置 (修改后需重启服务)
├── _layouts/            # 布局模板 (HTML 骨架)
│   ├── default.html     #   └─ 基础布局，所有页面继承
│   ├── home.html        #   └─ 首页布局
│   └── single.html      #   └─ 文章详情页布局
├── _includes/           # 可复用 HTML 片段
│   ├── navigation.html  #   └─ 顶部导航栏
│   └── footer.html      #   └─ 页脚
├── _posts/              # 博文 (Markdown 格式)
├── _sass/               # SCSS 源文件 (被 main.css 引用)
├── assets/              # 静态资源 (CSS/JS/图片)
├── _data/               # 数据文件 (如有)
├── _site/               # ⚠️ 构建输出目录 (不要手动修改)
├── .jekyll-cache/       # ⚠️ 缓存目录 (不要手动修改)
├── index.html           # 首页入口
└── 404.html             # 自定义 404 页面 (如有)
```

### 关键目录说明

| 目录 | 作用 | 是否手动编辑 |
|------|------|:---:|
| `_layouts/` | 定义页面骨架结构 | ✅ |
| `_includes/` | 可复用的页面片段 | ✅ |
| `_posts/` | 所有博文存放处 | ✅ |
| `_sass/` | SCSS 样式源文件 | ✅ |
| `assets/` | CSS、JS、图片等静态文件 | ✅ |
| `_site/` | Jekyll 构建输出 | ❌ |

---

## 2. Liquid 模板语法要点

Liquid 是 Jekyll 使用的模板语言，由 Shopify 开发。

### 输出变量

```liquid
{{ page.title }}
{{ site.description }}
{{ content }}
```

### 标签 (逻辑控制)

```liquid
{% if page.toc %}
  <nav class="toc">...</nav>
{% endif %}

{% for post in site.posts %}
  <a href="{{ post.url }}">{{ post.title }}</a>
{% endfor %}
```

### 常用过滤器

```liquid
{{ post.date | date: "%Y年%m月%d日" }}
{{ page.content | strip_html | truncatewords: 100 }}
{{ "hello world" | capitalize }}
{{ post.tags | join: ", " }}
{{ content | markdownify }}
```

### Include 引入片段

```liquid
{% include navigation.html %}
{% include footer.html %}
```

### 常用内置变量

| 变量 | 说明 |
|------|------|
| `site.*` | `_config.yml` 中的配置值 |
| `page.*` | 当前页面的 Front Matter 值 |
| `post.*` | 当前文章的属性 |
| `content` | 页面/文章的正文内容 (Markdown 已渲染) |
| `layout.*` | 布局文件的属性 |
| `paginator.*` | 分页器数据 (需 jekyll-paginate 插件) |

### 分页器用法

```liquid
{% for post in paginator.posts %}
  <article>{{ post.title }}</article>
{% endfor %}

{% if paginator.previous_page %}
  <a href="{{ paginator.previous_page_path }}">上一页</a>
{% endif %}
{% if paginator.next_page %}
  <a href="{{ paginator.next_page_path }}">下一页</a>
{% endif %}
```

---

## 3. _config.yml 关键配置项

```yaml
# 基本信息
title: Eganchiyu的Github Pages
subtitle: 学习·记录·随想
locale: zh-CN
description: >-
  个人技术博客，记录学习过程与思考。

# URL 配置
url: https://eganchiyu.github.io
baseurl: ""
permalink: /:categories/:year/:month/:day/:title/

# 分页
paginate: 10
paginate_path: "/page:num/"

# 插件
plugins:
  - jekyll-paginate
  - jekyll-sitemap
  - jekyll-gist
  - jekyll-feed
  - jekyll-include-cache

# 构建
markdown: kramdown
highlighter: rouge
encoding: UTF-8
```

### 重要配置说明

| 配置项 | 说明 |
|--------|------|
| `permalink` | 文章 URL 格式，包含分类和日期 |
| `paginate` | 每页显示文章数 (10篇) |
| `locale` | 站点语言，影响日期格式和 sitemap |
| `markdown` | Markdown 解析器 (kramdown) |
| `highlighter` | 代码高亮引擎 (rouge) |

> ⚠️ 修改 `_config.yml` 后需要重启 Jekyll 服务才能生效。

---

## 4. Gemfile 依赖说明

```ruby
source "https://rubygems.org"

gem "jekyll", "~> 4.4"

group :jekyll_plugins do
  gem "jekyll-paginate"          # 分页功能
  gem "jekyll-sitemap"           # 生成 sitemap.xml
  gem "jekyll-gist"              # 嵌入 GitHub Gist
  gem "jekyll-feed"              # 生成 RSS feed
  gem "jekyll-include-cache"     # 缓存 include 提升构建速度
end
```

### 插件功能一览

| 插件 | 功能 |
|------|------|
| `jekyll-paginate` | 首页分页 (每10篇一页) |
| `jekyll-sitemap` | 自动生成 `/sitemap.xml` |
| `jekyll-gist` | `{% gist gist_id %}` 嵌入代码片段 |
| `jekyll-feed` | 自动生成 `/feed.xml` RSS |
| `jekyll-include-cache` | 缓存频繁使用的 include 片段 |

---

## 5. 本地开发命令

### 安装依赖

```bash
bundle install
```

### 启动开发服务器

```bash
# 推荐方式 (使用项目提供的脚本)
localhost-build.cmd

# 或直接运行
bundle exec jekyll serve

# 带实时重载 + 监听所有网络接口
bundle exec jekyll serve --livereload --host 0.0.0.0

# 增量构建 (大型站点更快，但可能不完全准确)
bundle exec jekyll serve --incremental
```

### 仅构建不启动服务

```bash
bundle exec jekyll build

# 构建结果在 _site/ 目录
```

### 清理缓存

```bash
bundle exec jekyll clean
# 删除 _site/ 和 .jekyll-cache/
```

### 更新依赖

```bash
bundle update
# 更新 Gemfile.lock 中的所有 gem
```

---

## 6. 常见问题排查

### 构建失败

**症状**: `bundle exec jekyll build` 报错

**排查步骤**:
1. 检查 Ruby 版本: `ruby -v` (需要 3.3+)
2. 检查 Bundler 版本: `bundler -v`
3. 重新安装依赖: `bundle install`
4. 清理缓存: `bundle exec jekyll clean && bundle exec jekyll build`
5. 查看完整错误日志定位具体问题

### 样式修改未生效

**原因**: 浏览器缓存或 Jekyll 未自动重建

**解决**:
1. 确认开发服务器正在运行
2. 强制刷新浏览器: `Ctrl + Shift + R`
3. 如果使用 `--incremental`，重启服务试试
4. 检查 CSS 文件是否在 `assets/css/` 下

### Front Matter 格式错误

**症状**: 文章内容显示为纯文本，未被 Markdown 渲染

**排查**:
- 确保 Front Matter 以 `---` 开头和结尾
- 检查 YAML 缩进是否正确 (使用空格，不要用 Tab)
- 确认 `title` 等含特殊字符的值用引号包裹

### 本地与 GitHub Pages 行为不一致

**原因**: GitHub Pages 使用自己的 Jekyll 版本和插件白名单

**解决**:
- GitHub Pages 支持的插件有限，查看 [白名单](https://pages.github.com/versions/)
- 本项目通过 GitHub Actions 自定义构建，不受白名单限制
- 确保 `.github/workflows/build.yml` 配置正确

### 分页不工作

**排查**:
- 分页只在 `index.html` 或 `index.md` 中有效
- 确保文件中有 `paginator` 相关的 Liquid 代码
- 检查 `_config.yml` 中 `paginate` 值是否 > 0