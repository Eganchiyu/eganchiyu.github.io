# 文章系统文档

> 文章存储在 `_posts/` 目录，使用 Markdown 格式编写，当前共 18 篇。

---

## 1. Front Matter 字段说明

每篇文章顶部使用 YAML 格式的 Front Matter 定义元数据：

```yaml
---
title: "文章标题"
excerpt: "文章摘要，用于 SEO 和卡片显示"
date: 2025-12-14
categories:
  - 分类名
tags:
  - 标签名1
  - 标签名2
comments: true
entries_layout: grid
mins: 10
mathjax: true
header:
  teaser: /assets/images/xxx.png
---
```

### 字段详解

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `title` | 字符串 | 是 | 文章标题，显示在页面标题、卡片、归档中 |
| `excerpt` | 字符串 | 否 | 文章摘要，用于 SEO `<meta description>` 和首页卡片 |
| `date` | 日期 | 是 | 发布日期，格式 `YYYY-MM-DD`，影响排序和永久链接 |
| `categories` | 数组 | 否 | 分类列表，仅第一个用于永久链接路径和显示 |
| `tags` | 数组 | 否 | 标签列表，首页卡片最多显示 3 个 |
| `comments` | 布尔 | 否 | 是否启用评论（`_config.yml` 默认 `true`） |
| `entries_layout` | 字符串 | 否 | 布局方式（`grid` 或 `list`），遗留字段 |
| `mins` | 数字 | 否 | 手动指定阅读时间（分钟），实际使用自动计算 |
| `mathjax` | 布尔 | 否 | 是否启用 MathJax 数学公式渲染 |
| `header.teaser` | 字符串 | 否 | 文章缩略图路径（Minimal Mistakes 遗留字段） |

### 默认值

`_config.yml` 中为所有 posts 设置了默认值：

```yaml
defaults:
  - scope:
      path: ""
      type: posts
    values:
      layout: single
      author_profile: true
      read_time: true
      comments: true
      share: true
```

---

## 2. 文章命名规范

文件名格式：`YYYY-M-D-slug.md` 或 `YYYY-MM-DD-slug.md`

### 示例

```
2025-12-14-1-why-i-start-a-blog.md     # 同日多篇用数字前缀
2025-12-14-2-ESP32LEDProject.md
2026-01-26-ssh-working-principle.md      # 月份可一位或两位
2026-1-10---LLM-Deepseek-Lora.md        # slug 中可包含连字符
```

### 命名约定

- **日期部分**：与 Front Matter 中的 `date` 字段一致
- **slug 部分**：使用英文连字符分隔，描述文章主题
- **同日多篇**：在日期后加数字序号（如 `1-`、`2-`）
- **扩展名**：`.md`（Markdown）

---

## 3. 分类和标签使用

### 分类 (Categories)

- 每篇文章属于**一个主分类**（数组第一个元素）
- 分类用于永久链接路径（`/:categories/:year/:month/:day/:title/`）
- 分类页面显示每个分类的文章数量
- 分类名使用**中文**

#### 当前分类

| 分类 | 文章数 | 说明 |
|------|--------|------|
| 随想 | 2 | 个人思考和感悟 |
| 学习记录 | 4 | 学习笔记和教程 |
| 树莓派 | 4 | 树莓派相关项目和配置 |
| ESP32 | 3 | ESP32 嵌入式开发 |
| 线性代数 | 2 | 数学和算法相关 |
| LLM | 1 | 大语言模型 |
| 小结 | 2 | 阶段性总结 |

### 标签 (Tags)

- 每篇文章可有**多个标签**
- 标签用于标签云和标签列表页
- 标签名使用**中文**（部分为英文技术术语）
- 首页卡片最多显示 3 个标签

#### 常用标签

`博客`、`记录`、`编程`、`软件`、`系统`、`树莓派`、`嵌入式`、`线性代数`、`OR-Tools`、`CSP`、`SSH`、`密钥`、`LoRA`、`Qt`

---

## 4. 图片引用规范

### 存储位置

所有图片存储在 `assets/images/` 目录下。

### 引用方式

```markdown
![图片描述](/assets/images/2025-12-14-21-02-11.png)
```

### 命名约定

图片文件名通常包含日期和时间戳：`YYYY-MM-DD-HH-MM-SS.png`

### Front Matter 中的图片

```yaml
header:
  teaser: /assets/images/2025-12-14-21-02-11.png
```

用于文章缩略图（Minimal Mistakes 遗留字段，当前自定义主题未使用）。

### CSS 样式

文章内容中的图片自动获得以下样式：
- 圆角 (`border-radius: var(--radius-lg)`)
- 阴影 (`box-shadow: var(--shadow-soft)`)
- 悬停放大 (`transform: scale(1.02)`)
- 最大宽度 100%

---

## 5. 现有文章列表

### 随想 (2 篇)

| 日期 | 标题 | 标签 |
|------|------|------|
| 2025-12-14 | 为什么我要搭一个博客 | 博客, 记录 |
| 2025-12-24 | 为什么有些压缩文件解压得那么慢？ | 博客, 软件, 哲学 |

### 学习记录 (4 篇)

| 日期 | 标题 | 标签 |
|------|------|------|
| 2026-01-20 | 什么是 Namespace：代码中的"地址系统" | 博客, 编程, 记录 |
| 2026-01-22 | Windows 中的 Hook 机制：从消息拦截到功能注入 | 博客, 编程, 记录 |
| 2026-01-26 | SSH 的工作原理：从密钥交换到身份认证的完整通信机制 | 博客, 记录 |
| 2026-01-28 | 解剖一支词典笔：从 SSH 接管到交叉编译的系统逆向记录 | 博客, 记录 |

### 树莓派 (4 篇)

| 日期 | 标题 | 标签 |
|------|------|------|
| 2026-01-23 | 树莓派 4B 从零起步：Raspberry Pi OS 安装与远程环境初配置 | 博客, 记录 |
| 2026-01-24 | 为树莓派搭建 Python 开发环境 | 博客, 记录 |
| 2026-01-25 | 从零配置 SSH 公钥：树莓派、嵌入式设备与 GitHub 的免密登录 | 博客, 记录, 树莓派, 嵌入式 |
| 2026-01-25 | 本地部署 Jekyll 博客（未完工） | 博客, 记录, 树莓派, 嵌入式 |

### ESP32 (3 篇)

| 日期 | 标题 | 标签 |
|------|------|------|
| 2025-12-14 | 从点灯到系统：ESP32 双灯环智能氛围灯完整工程实践 | 博客, 记录, 编程 |
| 2025-12-14 | 不用官方工具也能调参：ESP32 实现 HLK 人体传感器上位机 | 博客, 记录, 编程 |
| 2025-12-22 | ESP32 双灯氛围灯开发记录：夜间星光模式更新 | 博客, 记录, 编程 |

### 线性代数 (2 篇)

| 日期 | 标题 | 标签 |
|------|------|------|
| 2025-12-19 | 从卷积核到大矩阵：图像卷积的线性代数本质 | 博客, 记录, 线性代数 |
| 2026-02-06 | OR-Tools：从入门到系统构建 | 博客, 记录, OR-Tools, CSP |

### LLM (1 篇)

| 日期 | 标题 | 标签 |
|------|------|------|
| 2026-01-10 | DeepSeek LLM 本地部署与 LoRA 微调实录 | 博客, 系统, 编程, 记录 |

### 小结 (2 篇)

| 日期 | 标题 | 标签 |
|------|------|------|
| 2025-12-25 | 阶段性暂停的开发日志：在备考前按下保存键 | 博客, 软件 |
| 2026-01-07 | 2026 年开年的一些记录：学习、规划与自我对话 | 博客, 系统 |

---

## 6. 分页配置

`_config.yml` 中的分页设置：

```yaml
paginate: 10
paginate_path: /page:num/
```

| 配置项 | 值 | 说明 |
|--------|-----|------|
| `paginate` | `10` | 每页显示文章数 |
| `paginate_path` | `/page:num/` | 分页 URL 模式 |

### 分页 URL

| 页码 | URL |
|------|-----|
| 第 1 页 | `/` (首页) |
| 第 2 页 | `/page2/` |
| 第 3 页 | `/page3/` |

### 分页模板

首页 `home.html` 使用 `paginator` 对象：

```liquid
{% for post in paginator.posts %}
  ...
{% endfor %}

{% if paginator.total_pages > 1 %}
  {{ paginator.page }} / {{ paginator.total_pages }}
  {{ paginator.previous_page_path }}
  {{ paginator.next_page_path }}
{% endif %}
```

当前 18 篇文章，每页 10 篇，共 2 页。

---

## 7. 永久链接格式

```yaml
permalink: /:categories/:year/:month/:day/:title/
```

### 格式说明

| 部分 | 来源 | 示例 |
|------|------|------|
| `:categories` | 文章第一个分类 | `ESP32` |
| `:year` | 发布年份 | `2025` |
| `:month` | 发布月份（两位） | `12` |
| `:day` | 发布日期（两位） | `14` |
| `:title` | 文件名中的 slug | `ESP32LEDProject` |

### 实际 URL 示例

```
/ESP32/2025/12/14/ESP32LEDProject/
/树莓派/2026/01/23/connecting-raspi/
/随想/2025/12/14/why-i-start-a-blog/
/LLM/2026/01/10/---LLM-Deepseek-Lora/
```

### 注意事项

- 分类名中的中文会被 URL 编码（浏览器自动处理）
- 无分类的文章，URL 中省略 `:categories` 部分
- `title` 部分来自文件名（不含日期前缀），非 Front Matter 中的 title 字段
