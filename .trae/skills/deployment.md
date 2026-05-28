# 部署与 CI/CD 指南

> 本项目通过 GitHub Actions 自动部署到 GitHub Pages。

---

## 1. GitHub Pages 部署流程

### 整体流程

```
本地开发 → git push (main 分支)
    → GitHub Actions 触发
    → 构建 Jekyll 站点
    → 部署到 GitHub Pages
    → https://eganchiyu.github.io 更新
```

### 部署架构

- **构建方式**: GitHub Actions 自定义构建 (非 GitHub Pages 默认的 Jekyll 构建)
- **优势**: 可使用任意 Jekyll 插件，不受 GitHub Pages 插件白名单限制
- **输出**: 构建产物部署到 GitHub Pages 的静态托管

---

## 2. GitHub Actions Workflow 说明

### 工作流文件

位置: `.github/workflows/build.yml`

### 工作流概要

```yaml
name: Deploy Jekyll to GitHub Pages

on:
  push:
    branches: ["main"]    # 仅 main 分支触发
  workflow_dispatch:       # 允许手动触发

# 设置 GITHUB_TOKEN 权限
permissions:
  contents: read
  pages: write
  id-token: write

# 同时只允许一个部署，跳过排队中的运行
concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Ruby
        uses: ruby/setup-ruby@v1
        with:
          ruby-version: '3.3'
          bundler-cache: true

      - name: Setup Pages
        id: pages
        uses: actions/configure-pages@v4

      - name: Build with Jekyll
        run: bundle exec jekyll build --baseurl "${{ steps.pages.outputs.base_path }}"
        env:
          JEKYLL_ENV: production

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

### 关键点

| 配置项 | 说明 |
|--------|------|
| 触发条件 | push 到 main 分支，或手动触发 |
| Ruby 版本 | 3.3 (与本地一致) |
| 构建命令 | `bundle exec jekyll build` |
| 环境变量 | `JEKYLL_ENV=production` |
| 部署目标 | GitHub Pages |

---

## 3. 本地构建验证

### 推送前必须本地验证

```bash
# 1. 确保依赖是最新的
bundle install

# 2. 清理旧的构建产物
bundle exec jekyll clean

# 3. 构建站点
bundle exec jekyll build

# 4. 检查构建输出是否有警告/错误
# 关注 stderr 输出

# 5. 本地预览验证
bundle exec jekyll serve
# 浏览器访问 http://localhost:4000
```

### 使用项目脚本

```bash
# Windows 项目自带的启动脚本
localhost-build.cmd
# 等同于 bundle exec jekyll serve
```

### 构建检查清单

- [ ] `bundle exec jekyll build` 无错误
- [ ] 本地预览页面正常显示
- [ ] 新文章出现在首页列表
- [ ] 文章内容和样式正确
- [ ] 图片正常加载
- [ ] 主题切换 (Light/Dark) 正常
- [ ] 手机端显示正常
- [ ] 链接可以正确跳转

---

## 4. 分支策略

### 分支模型

```
main ─────────────────────────────────→ (生产分支)
  │
  ├── feature/new-post    (临时功能分支)
  ├── fix/nav-mobile      (临时修复分支)
  └── content/update-post (临时内容分支)
```

### 规则

| 分支 | 用途 | 是否自动部署 |
|------|------|:---:|
| `main` | 生产环境，所有内容合并到这里 | ✅ |
| `feature/*` | 新功能开发 | ❌ |
| `fix/*` | 问题修复 | ❌ |
| `content/*` | 内容更新 | ❌ |

### 工作流程

1. 从 `main` 创建功能/修复分支
2. 在分支上开发和测试
3. 完成后合并回 `main`
4. push 到 `main` 触发自动部署

```bash
# 创建分支
git checkout -b content/new-post-title

# 开发...
git add .
git commit -m "feat(content): 新增文章标题"

# 合并到 main
git checkout main
git merge content/new-post-title
git push origin main
```

### 注意事项

- 直接 push 到 `main` 也是可以的 (个人博客不需要严格的 PR 流程)
- 但建议养成分支习惯，避免半成品被部署
- 合并前确保本地构建通过

---

## 5. 自定义域名配置

### 当前状态

- 默认域名: `eganchiyu.github.io`
- 如果需要自定义域名 (如 `blog.example.com`)

### 配置步骤 (如需要)

#### 1. GitHub 仓库设置

进入仓库 Settings → Pages → Custom domain，填入域名。

#### 2. DNS 配置

**使用 apex 域名 (example.com):**
```
A 记录:
  185.199.108.153
  185.199.109.153
  185.199.110.153
  185.199.111.153
```

**使用子域名 (blog.example.com):**
```
CNAME 记录:
  blog.example.com → eganchiyu.github.io
```

#### 3. 更新 `_config.yml`

```yaml
url: https://blog.example.com  # 替换为自定义域名
```

#### 4. CNAME 文件

在项目根目录创建 `CNAME` 文件:
```
blog.example.com
```

#### 5. 启用 HTTPS

在 GitHub Pages 设置中勾选 "Enforce HTTPS"。

> 注意: 目前项目使用 `eganchiyu.github.io` 默认域名，无需额外配置。

---

## 6. 常见部署问题排查

### 构建失败

**症状**: GitHub Actions 显示红色 ❌

**排查步骤**:
1. 点击 Actions 标签页查看失败的工作流
2. 展开 `Build with Jekyll` 步骤查看错误日志
3. 常见原因:
   - Markdown 语法错误
   - Front Matter YAML 格式错误
   - Liquid 模板语法错误
   - 引用了不存在的 include 文件

**本地复现**:
```bash
bundle exec jekyll build 2>&1 | tee build.log
# 查看 build.log 中的错误
```

### 部署成功但页面空白

**排查**:
- 检查 `_config.yml` 中的 `url` 和 `baseurl` 设置
- 确认 `baseurl` 在 GitHub Pages 环境下是否正确
- 检查是否有 JavaScript 错误 (浏览器 F12)

### 样式丢失

**可能原因**:
- `baseurl` 配置不正确导致 CSS 路径错误
- CSS 文件未被正确包含在构建产物中
- 缓存问题 (等几分钟或强制刷新)

**解决**:
```yaml
# _config.yml
baseurl: ""  # 对于 user.github.io 仓库，baseurl 应为空
```

### 404 错误

**排查**:
- 检查 `permalink` 配置是否正确
- 确认文件名和路径是否正确
- GitHub Pages 部署有延迟 (通常几分钟)

### 本地正常但部署后异常

**可能原因**:
- 本地和生产环境的 Jekyll 版本不同
- 插件版本不一致
- `JEKYLL_ENV` 环境变量差异

**解决**:
- 确保 `Gemfile.lock` 已提交到仓库
- GitHub Actions 中使用与本地相同的 Ruby 版本

### 部署延迟

- GitHub Pages 部署通常需要 1-5 分钟
- 可在 Actions 标签页查看部署状态
- 部署完成后可能还需要 CDN 缓存更新时间

---

## 7. 监控与维护

### 查看部署状态

- GitHub 仓库 → **Actions** 标签页
- 查看每次 push 触发的工作流状态
- 绿色 ✅ = 成功，红色 ❌ = 失败

### 定期维护

- **依赖更新**: 定期运行 `bundle update` 并测试
- **Ruby 版本**: 保持与 GitHub Actions 中的版本一致
- **清理分支**: 合并后删除已使用的功能分支

```bash
# 查看远程分支
git branch -r

# 删除已合并的远程分支
git push origin --delete feature/old-branch
```
