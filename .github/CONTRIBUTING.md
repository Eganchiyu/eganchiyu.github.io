# 贡献指南

感谢你对本博客项目的关注！虽然这是一个个人博客，但欢迎各种形式的贡献。

## 如何贡献

### 报告问题

如果你发现了网站的问题，请通过 [Issue](https://github.com/Eganchiyu/eganchiyu.github.io/issues) 反馈，选择合适的模板填写。

### 提交内容修正

如果你发现文章中有错误（错别字、代码 bug、过时信息等），欢迎提交 PR 修正。

### 建议新功能

有改进博客的想法？请提交一个 [功能建议](https://github.com/Eganchiyu/eganchiyu.github.io/issues/new?template=feature_request.yml)。

## 开发流程

### 1. Fork 仓库

点击页面右上角的 Fork 按钮，将仓库复制到你的账户下。

### 2. 克隆到本地

```bash
git clone https://github.com/<你的用户名>/eganchiyu.github.io.git
cd eganchiyu.github.io
```

### 3. 安装依赖

确保你已安装 Ruby 和 Bundler，然后执行：

```bash
bundle install
```

### 4. 创建分支

```bash
git checkout -b feature/你的功能名称
```

分支命名建议：
- `feature/xxx` - 新功能
- `fix/xxx` - Bug 修复
- `content/xxx` - 内容更新

### 5. 本地预览

```bash
bundle exec jekyll serve --livereload
```

访问 `http://localhost:4000` 查看效果。

### 6. 提交改动

```bash
git add .
git commit -m "简要描述你的改动"
```

提交信息建议：
- `fix: 修复了xxx问题`
- `feat: 添加了xxx功能`
- `content: 更新了xxx文章`
- `style: 调整了xxx样式`

### 7. 推送并创建 PR

```bash
git push origin feature/你的功能名称
```

然后在 GitHub 上创建 Pull Request。

## 项目结构

```
├── _config.yml          # Jekyll 配置
├── _layouts/            # 页面布局模板
├── _includes/           # 可复用的页面组件
├── _posts/              # 博客文章
├── _sass/               # Sass 样式文件
├── assets/              # 静态资源（CSS、图片等）
├── Gemfile              # Ruby 依赖
└── index.md             # 首页
```

## 技术栈

- **Jekyll 4.4** - 静态网站生成器
- **自定义 Alice Blue 主题** - 博客主题
- **GitHub Pages** - 托管平台
- **Sass** - CSS 预处理器

## 注意事项

- 请确保本地构建成功后再提交 PR
- 新增文章请遵循 `_posts/` 目录下的命名规范：`YYYY-MM-DD-title.md`
- 样式修改请在 `_sass/` 目录下进行
- 不要提交 `_site/` 目录下的构建产物

## 联系方式

如有任何问题，欢迎通过 Issue 或邮件联系。

再次感谢你的贡献！🎉
