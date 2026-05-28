# Eganchiyu 的 GitHub Pages

> 学习 · 记录 · 随想

个人技术博客，记录学习、思考与项目实践。

**线上地址**: https://eganchiyu.github.io/

## 特性

- 🎨 **二次元 Alice Blue 主题** - 清新淡雅的配色方案
- 🌙 **深色模式** - 手动切换，自动记忆
- 📱 **响应式设计** - 完美适配手机、平板、桌面
- ✨ **可爱装饰** - 浮动动画、毛玻璃效果
- 📝 **Markdown 写作** - 支持代码高亮、数学公式
- 🔍 **分类与标签** - 文章组织与归档

## 本地开发

### 环境要求

- Ruby >= 3.0
- Bundler

### 安装与启动

```powershell
# 安装 Ruby (如果未安装)
winget install RubyInstallerTeam.RubyWithDevKit.3.3

# 安装依赖
$env:Path = "C:\Ruby33-x64\bin;" + $env:Path
bundle install

# 本地预览
bundle exec jekyll serve
```

打开 http://localhost:4000

### 项目结构

```
_layouts/          → 页面布局模板 (default, home, single)
_includes/         → 可复用组件 (navigation, footer)
_sass/             → Sass 样式源码
assets/css/        → 主样式表 (Alice Blue 设计系统 + 双主题)
assets/js/         → 交互脚本 (主题切换、移动菜单)
_posts/            → 博客文章 (18篇)
.github/           → GitHub 模板与 Actions 部署
.trae/             → Trae IDE 规则与技能文件
docs/              → 项目文档 (架构、布局、样式、脚本等)
```

详细文档见 [docs/](./docs/README.md)

## 部署

推送到 `main` 分支后，GitHub Pages 自动构建部署。

## 技术栈

- [Jekyll](https://jekyllrb.com/) - 静态站点生成器
- [GitHub Pages](https://pages.github.com/) - 托管服务
- [Google Fonts](https://fonts.google.com/) - Inter + JetBrains Mono

## 许可

内容 © Eganchiyu | 代码 MIT License
