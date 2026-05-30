# 配置参考文档

> 项目配置文件一览及各配置项详解。

---

## 1. _config.yml — Jekyll 主配置

**文件路径**: `_config.yml`

### 1.1 站点设置

| 配置项 | 值 | 说明 |
|--------|-----|------|
| `locale` | `"zh-CN"` | 站点语言，影响 HTML `lang` 属性和 UI 文本 |
| `title` | `"Eganchiyu的Github Pages"` | 站点标题，显示在标题栏和页脚 |
| `subtitle` | `"学习 · 记录 · 随想"` | 站点副标题，显示在页脚 |
| `name` | `"Eganchiyu"` | 作者名称 |
| `description` | 长文本 | 站点描述，用于 SEO 和首页 Hero 区域 |
| `url` | `"https://eganchiyu.github.io/"` | 站点 URL，用于生成绝对链接 |
| `baseurl` | 空 | 子路径，GitHub Pages 根部署时为空 |
| `encoding` | `"utf-8"` | 文件编码 |

### 1.2 构建设置

| 配置项 | 值 | 说明 |
|--------|-----|------|
| `markdown` | `kramdown` | Markdown 处理器 |
| `highlighter` | `rouge` | 代码高亮引擎 |
| `lsi` | `false` | 关闭潜在语义索引（加速构建） |
| `excerpt_separator` | `"\n\n"` | 摘要分隔符（双换行） |
| `incremental` | `false` | 关闭增量构建 |

### 1.3 Kramdown 配置

```yaml
kramdown:
  input: GFM              # GitHub Flavored Markdown
  math_engine: mathjax     # 使用 MathJax 渲染数学公式
  hard_wrap: false         # 不强制换行
  auto_ids: true           # 自动为标题生成 ID
  footnote_nr: 1           # 脚注起始编号
  entity_output: as_char   # 实体输出为字符
  toc_levels: 1..6         # 目录包含 h1-h6
  smart_quotes: lsquo,rsquo,ldquo,rdquo  # 智能引号
  enable_coderay: false    # 禁用 CodeRay
```

### 1.4 Sass 配置

```yaml
sass:
  sass_dir: _sass          # Sass 源文件目录
  style: compressed        # 输出压缩样式
```

### 1.5 输出设置

| 配置项 | 值 | 说明 |
|--------|-----|------|
| `permalink` | `/:categories/:year/:month/:day/:title/` | 永久链接格式 |
| `paginate` | `10` | 每页文章数 |
| `paginate_path` | `/page:num/` | 分页 URL 模式 |

### 1.6 集合

```yaml
collections:
  posts:
    output: true           # 输出为独立页面
    sort_by: date          # 按日期排序
    order: descending      # 降序（最新在前）
```

### 1.7 插件

| 插件 | 用途 |
|------|------|
| `jekyll-paginate` | 首页文章分页 |
| `jekyll-sitemap` | 自动生成 `sitemap.xml` |
| `jekyll-gist` | GitHub Gist 嵌入标签 |
| `jekyll-feed` | 生成 RSS `feed.xml` |
| `jekyll-include-cache` | 模板缓存，加速构建 |

### 1.8 文件包含/排除

**包含**（默认会被忽略但需要输出的文件）：
- `.htaccess`
- `_pages`
- `assets/js/vendor`

**排除**（不参与构建的文件）：
- 编辑器文件：`*.sublime-project`、`*.sublime-workspace`
- 构建产物：`vendor`、`.asset-cache`、`.bundle`、`.sass-cache`、`node_modules`
- 项目文件：`Gemfile`、`Gemfile.lock`、`package.json`、`package-lock.json`、`Rakefile`
- 主题文件：`minimal-mistakes-jekyll.gemspec`
- 文档：`/docs`、`/test`、`README`、`CHANGELOG`、`LICENSE`

### 1.9 默认值

为所有 `posts` 类型的文章设置默认 Front Matter：

```yaml
defaults:
  - scope:
      path: ""
      type: posts
    values:
      layout: single           # 使用 single 布局
      author_profile: true     # 显示作者信息（遗留字段）
      read_time: true          # 显示阅读时间（遗留字段）
      comments: true           # 启用评论
      share: true              # 启用分享（遗留字段）
```

> 注：`author_profile`、`read_time`、`share` 为 Minimal Mistakes 主题的遗留字段，当前自定义主题不使用。

### 1.10 作者信息

```yaml
author:
  name: "Eganchiyu"
  avatar: "/assets/images/avatar.png"
  location: "西安"
  email: "eganchiyu@163.com"
  links:
    - label: "GitHub"
      icon: "fab fa-fw fa-github"
      url: "https://github.com/Eganchiyu"
    - label: "个人网站"
      icon: "fas fa-fw fa-link"
      url: "https://eganchiyu.github.io/"
```

`links` 中的 `icon` 字段使用 Font Awesome 类名（Minimal Mistakes 遗留），当前自定义主题使用 SVG 内联图标。

### 1.11 归档配置

```yaml
category_archive:
  type: liquid
  path: /categories/
tag_archive:
  type: liquid
  path: /tags/
```

### 1.12 HTML 压缩

```yaml
compress_html:
  clippings: all
  ignore:
    envs: development
```

生产环境压缩 HTML（去除空白），开发环境不压缩。

---

## 2. Gemfile — Ruby 依赖

**文件路径**: `Gemfile`

```ruby
source "https://rubygems.org"

# Jekyll 核心
gem "jekyll", "~> 4.4"
gem "webrick", "~> 1.9"

# 插件
gem "jekyll-paginate", "~> 1.1"
gem "jekyll-sitemap", "~> 1.3"
gem "jekyll-gist", "~> 1.5"
gem "jekyll-feed", "~> 0.1"
gem "jekyll-include-cache", "~> 0.1"
```

| Gem | 版本 | 说明 |
|-----|------|------|
| `jekyll` | ~> 4.4 | Jekyll 核心引擎 |
| `webrick` | ~> 1.9 | Ruby 3.0+ 需要的 HTTP 服务器（`jekyll serve` 依赖） |
| `jekyll-paginate` | ~> 1.1 | 文章分页插件 |
| `jekyll-sitemap` | ~> 1.3 | 站点地图生成 |
| `jekyll-gist` | ~> 1.5 | Gist 嵌入标签 |
| `jekyll-feed` | ~> 0.1 | RSS 订阅源 |
| `jekyll-include-cache` | ~> 0.1 | 模板缓存加速 |

---

## 3. _data/navigation.yml — 导航配置

**文件路径**: `_data/navigation.yml`

```yaml
main:
  - title: "分类"
    url: /categories/
  - title: "标签"
    url: /tags/
  - title: "归档"
    url: /year-archive/
  - title: "关于"
    url: /about/
  - title: "GitHub"
    url: https://github.com/Eganchiyu
```

### 说明

| 字段 | 说明 |
|------|------|
| `main` | 主导航菜单数组 |
| `title` | 菜单项显示文本 |
| `url` | 菜单链接地址（内部相对路径或外部 URL） |

> 注意：当前自定义主题的导航栏 (`navigation.html`) 是硬编码的，此文件主要供 Minimal Mistakes 主题的遗留组件参考。"关于" 链接指向独立关于页 `/about/`。

---

## 4. staticman.yml — 评论配置

**文件路径**: `staticman.yml`

### 概述

Staticman 是一个将用户评论转换为 Git 提交的服务。评论数据以 YAML 文件形式存储在仓库中。

### 配置结构

```yaml
comments:
  allowedFields: ["name", "email", "url", "message"]
  branch: "main"
  commitMessage: "New comment by {fields.name}"
  filename: "comment-{@timestamp}"
  format: "yaml"
  moderation: true
  path: "docs/_data/comments/{options.slug}"
  requiredFields: ["name", "email", "message"]
```

### 关键配置项

| 配置项 | 值 | 说明 |
|--------|-----|------|
| `allowedFields` | `name, email, url, message` | 允许提交的表单字段 |
| `branch` | `main` | 提交目标分支 |
| `filename` | `comment-{@timestamp}` | 评论文件名模式 |
| `format` | `yaml` | 评论数据格式 |
| `moderation` | `true` | 启用审核（通过 PR 提交） |
| `path` | `docs/_data/comments/{options.slug}` | 评论存储路径 |
| `requiredFields` | `name, email, message` | 必填字段 |

### 自动生成字段

```yaml
generatedFields:
  date:
    type: "date"
    options:
      format: "iso8601"
```

每条评论自动添加 ISO 8601 格式的时间戳。

### 字段转换

```yaml
transforms:
  email: md5
```

邮箱地址进行 MD5 哈希（用于 Gravatar 头像）。

### reCaptcha 配置

```yaml
reCaptcha:
  enabled: true
  siteKey: "6LdRBykTAAAAAFB46MnIu6ixuxwu9W1ihFF8G60Q"
  secret: "PznnZGu3P6eTHRPLORniSq+J61Y..."  # 加密后的密钥
```

- 使用 Google reCAPTCHA V2
- 已启用，防止机器人提交垃圾评论
- 密钥通过 Staticman 的 `/encrypt` 端点加密存储

### 可选功能（当前未启用）

- **Akismet 反垃圾**: 注释状态
- **邮件通知**: 需要 Mailgun 账户
- **allowedOrigins**: 来源域名限制

---

## 5. package.json — Node 依赖（遗留文件）

**文件路径**: `package.json`

```json
{
  "name": "minimal-mistakes",
  "private": true,
  "version": "4.27.3",
  "description": "Minimal Mistakes 2 column Jekyll theme.",
  "author": "Michael Rose",
  "license": "MIT",
  "engines": { "node": ">= 0.10.0" },
  "devDependencies": {
    "uglify-js": "^3.17.4"
  }
}
```

### 说明

这是 Minimal Mistakes 主题的遗留文件。当前自定义主题**不依赖此文件**。

| 字段 | 说明 |
|------|------|
| `name` | 仍为 `minimal-mistakes`（可改为项目名） |
| `version` | `4.27.3`（Minimal Mistakes 版本号） |
| `devDependencies` | `uglify-js` — JS 压缩工具（当前未使用） |

### 建议

此文件可以安全清理或更新：

```json
{
  "name": "eganchiyu.github.io",
  "private": true,
  "description": "Eganchiyu's personal blog"
}
```

如果不需要 `uglify-js`，可以直接删除整个 `package.json` 和 `package-lock.json`。

---

## 6. 其他配置文件

### _data/ui-text.yml

多语言 UI 文本配置，供 Minimal Mistakes 主题遗留组件参考。当前自定义主题的 UI 文本硬编码在 HTML 模板中。

### index.html

首页入口文件，Front Matter 指定 `layout: home`：

```yaml
---
layout: home
---
```

### sync.sh

部署同步脚本，用于拉取远程更新并构建。

### localhost-build.cmd

Windows 本地构建快捷脚本。
