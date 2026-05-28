# 写博文指南

> 如何在本 Jekyll 博客中创建和编写文章。

---

## 1. 文章命名规范

所有博文放在 `_posts/` 目录下，命名格式:

```
YYYY-MM-DD-slug.md
```

| 部分 | 说明 | 示例 |
|------|------|------|
| `YYYY` | 四位年份 | `2025` |
| `MM` | 两位月份 | `06` |
| `DD` | 两位日期 | `15` |
| `slug` | 英文小写，连字符分隔 | `raspberry-pi-5-review` |
| `.md` | Markdown 扩展名 | `.md` |

### 命名示例

```
_posts/2025-06-15-raspberry-pi-5-review.md
_posts/2025-06-10-esp32-mqtt-setup.md
_posts/2025-06-01-linear-algebra-basics.md
_posts/2025-05-28-llm-fine-tuning-notes.md
```

### slug 命名原则

- 使用**英文小写字母**
- 单词间用**连字符** `-` 分隔
- 简短但能描述内容
- **不要使用中文**作为 slug
- **不要使用下划线** `_`

---

## 2. Front Matter 模板

### 标准模板

```yaml
---
title: "文章标题"
excerpt: "一句话摘要，会显示在文章列表和 SEO 中"
date: 2025-06-15 10:00:00 +0800
categories: [学习记录]
tags: [标签1, 标签2, 标签3]
---
```

### 完整模板 (含可选字段)

```yaml
---
title: "文章标题"
excerpt: "一句话摘要"
date: 2025-06-15 10:00:00 +0800
categories: [学习记录]
tags: [标签1, 标签2, 标签3]
layout: single              # 可选，默认 single
author: Eganchiyu           # 可选
---
```

### 字段说明

| 字段 | 必填 | 说明 |
|------|:---:|------|
| `title` | ✅ | 文章标题 (含特殊字符时加引号) |
| `excerpt` | ✅ | 文章摘要，用于列表展示和 meta description |
| `date` | ✅ | 发布日期时间，必须带时区 `+0800` |
| `categories` | ✅ | 分类 (数组格式，通常只填一个) |
| `tags` | ✅ | 标签 (数组格式，建议 2-5 个) |
| `layout` | ❌ | 布局模板，默认 `single` |
| `author` | ❌ | 作者名，默认 Eganchiyu |

### 日期格式注意事项

```yaml
# ✅ 正确
date: 2025-06-15 10:00:00 +0800

# ✅ 也可以 (Jekyll 会自动补零点)
date: 2025-06-15

# ❌ 错误 - 缺少时区
date: 2025-06-15 10:00:00

# ❌ 错误 - 日期格式不对
date: 2025/06/15
```

---

## 3. 支持的分类列表

本博客现有以下分类:

| 分类 | 说明 | 典型内容 |
|------|------|---------|
| **随想** | 个人思考和感悟 | 生活、技术思考、观点 |
| **学习记录** | 学习过程的笔记 | 课程笔记、读书笔记 |
| **树莓派** | 树莓派相关 | 开箱、项目、教程 |
| **ESP32** | ESP32 相关 | 项目、教程、调试 |
| **线性代数** | 数学相关 | 概念、计算、应用 |
| **LLM** | 大语言模型 | 技术分析、使用体验、微调 |
| **小结** | 阶段性总结 | 月度/年度总结 |

### 分类使用原则

- 每篇文章**只归属一个分类**
- 选择最匹配的分类
- **新增分类前请三思**，避免分类过于碎片化
- 如确需新增分类，应与现有分类保持风格一致 (2-4个中文字)

---

## 4. Markdown 写作规范

### 标题层级

```markdown
# 一级标题 (文章内通常不用，title 已在 Front Matter 中)

## 二级标题 - 主要章节

### 三级标题 - 子章节

#### 四级标题 - 尽量少用
```

- 文章正文从 `##` (h2) 开始
- 标题层级不要跳跃 (不要从 h2 直接到 h4)

### 段落与换行

```markdown
这是第一段。

这是第二段。(空行分隔段落)

这是同一段内的换行，
需要在行尾加两个空格。
```

### 列表

```markdown
无序列表:
- 项目一
- 项目二
  - 子项目 (2空格缩进)

有序列表:
1. 第一步
2. 第二步
3. 第三步
```

### 链接

```markdown
[链接文字](https://example.com)
[站内链接](/学习记录/2025/06/15/article-title/)
```

### 引用

```markdown
> 这是一段引用文字。
> 可以多行。
>
> —— 引用来源
```

### 表格

```markdown
| 列1 | 列2 | 列3 |
|-----|-----|-----|
| 值1 | 值2 | 值3 |
```

### 加粗与斜体

```markdown
**加粗文字**
*斜体文字*
***加粗且斜体***
`行内代码`
```

---

## 5. 代码块使用

### 基本语法

使用三个反引号包裹代码块，指定语言实现语法高亮:

````markdown
```python
def hello():
    print("Hello, World!")
```
````

### 常用语言标识

```
python, javascript, bash, shell, yaml, json,
html, css, c, cpp, rust, go, ruby, sql,
markdown, text, diff
```

### 代码块示例

````markdown
```bash
bundle exec jekyll serve --livereload
```

```yaml
title: "Hello World"
date: 2025-06-15
```

```python
import numpy as np
arr = np.array([1, 2, 3])
```

```html
<div class="post-card">
  <h2>{{ post.title }}</h2>
</div>
```
````

### 带标题的代码块

某些 Markdown 处理器支持代码块标题:

````markdown
```python title:hello.py
print("Hello!")
```
````

### 行内代码

用单个反引号包裹: `variable_name`, `function()`, `file.md`

---

## 6. 图片引用方式

### 存放位置

所有图片放在 `assets/images/` 目录下:

```
assets/
└── images/
    ├── 2025/
    │   ├── 06/
    │   │   ├── raspberry-pi-photo.jpg
    │   │   └── circuit-diagram.png
    │   └── 05/
    │       └── screenshot.png
    └── common/
        └── logo.png
```

### 建议的子目录结构

按年月组织: `assets/images/YYYY/MM/`

### 引用语法

```markdown
![图片替代文字](/assets/images/2025/06/photo.jpg)

![带标题的图片](/assets/images/2025/06/photo.jpg "图片标题")
```

### 图片优化建议

| 格式 | 适用场景 |
|------|---------|
| `.jpg` | 照片、色彩丰富的图片 |
| `.png` | 截图、需要透明背景 |
| `.svg` | 图标、矢量图 |
| `.webp` | 现代格式，体积更小 (兼容性需确认) |

### 尺寸建议

- 最大宽度: 1200px (足够清晰且不会过大)
- 文件大小: 尽量控制在 200KB 以内
- 使用压缩工具处理图片 (如 TinyPNG)
- 使用相对路径或绝对路径均可，但建议统一用绝对路径 `/assets/images/...`

---

## 7. 完整示例

以下是一篇完整博文的示例:

```markdown
---
title: "树莓派5开箱与初步体验"
excerpt: "入手了树莓派5，记录开箱过程和初次配置体验"
date: 2025-06-15 14:30:00 +0800
categories: [树莓派]
tags: [树莓派5, 开箱, ARM, Linux]
---

## 开箱

今天收到了期待已久的树莓派5，包装比想象中小巧...

![树莓派5开箱](/assets/images/2025/06/rpi5-unbox.jpg "树莓派5开箱")

## 硬件规格

| 项目 | 规格 |
|------|------|
| CPU | BCM2712, 四核 Cortex-A76 |
| 内存 | 8GB LPDDR4X |
| 接口 | 2x USB 3.0, 2x USB 2.0 |

## 系统安装

使用 Raspberry Pi Imager 烧录系统:

```bash
# 下载 Raspberry Pi Imager
# 选择 OS: Raspberry Pi OS (64-bit)
# 选择 SD 卡
# 写入
```

## 初步配置

```bash
sudo apt update && sudo apt upgrade -y
sudo raspi-config
```

## 总结

树莓派5相比前代有了显著提升...
```

---

## 8. 常见问题

### Q: 文章没有出现在首页?

- 检查文件名格式是否正确 (`YYYY-MM-DD-slug.md`)
- 检查 Front Matter 的 `date` 是否正确
- 确认文件在 `_posts/` 目录下
- 确认 Front Matter 以 `---` 开头和结尾

### Q: 分类/标签页面 404?

- Jekyll 不会自动生成分类/标签页面
- 需要手动创建对应的页面文件
- 或使用插件自动生成

### Q: 图片不显示?

- 检查路径是否正确
- 确认图片文件存在于 `assets/images/` 下
- 文件名大小写需完全匹配
- 使用绝对路径: `/assets/images/...`
