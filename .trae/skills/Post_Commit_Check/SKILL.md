---
name: "Post_Commit_Check"
description: "执行提交后检查，包括文档一致性验证、代码测试、gitignore检查、代码质量审查和完整的提交流程。在每次代码提交后或用户请求验证提交质量时调用。确保代码风格统一、命名规范，并执行完整的提交和推送操作。"
---

# Post_Commit_Check 技能模块

此技能用于在代码提交后执行全面的质量检查，确保代码变更符合项目标准并保持文档与代码的一致性。同时确保代码风格统一、命名规范，并执行完整的提交和推送操作。

## 触发条件

在以下情况下调用此技能：
- 用户完成代码提交后请求质量检查
- 用户要求验证提交的完整性和规范性
- 用户需要确保文档与代码实现保持一致
- 用户完成项目撰写或功能模块开发后，需要执行完整的commit和push操作
- 用户要求检查代码风格的一致性和规范性

## 检查流程

### 1. 文档一致性验证

#### 1.1 检查文档更新需求
- 扫描最近的代码变更（git diff）
- 识别新增功能、修复的bug、性能优化等变更类型
- 检查相应的文档文件是否已更新

#### 1.2 文档更新规范
- **新增功能**：必须在相应模块文档中添加功能说明
- **API变更**：必须更新API文档或使用示例
- **配置变更**：必须更新配置说明文档
- **修复bug**：必须在已知问题或changelog中记录

#### 1.3 文档文件检查
- 检查 `_posts/` 目录下的Markdown文件格式
- 验证Front Matter必填字段完整性
- 确保分类和标签符合项目规范

### 2. 代码测试执行

#### 2.1 Jekyll构建测试
```bash
# 执行Jekyll构建验证
bundle exec jekyll build --trace

# 检查构建是否成功
if [ $? -ne 0 ]; then
    echo "构建失败，请检查错误"
    exit 1
fi
```

#### 2.2 本地服务测试
```bash
# 启动本地服务器进行功能测试
bundle exec jekyll serve --detach

# 验证服务启动成功
curl -s http://localhost:4000 > /dev/null
if [ $? -ne 0 ]; then
    echo "本地服务启动失败"
    exit 1
fi

# 停止服务
pkill -f jekyll
```

#### 2.3 链接检查
- 检查内部链接是否有效
- 验证外部链接可访问性
- 确保图片资源路径正确

### 3. Gitignore配置检查

#### 3.1 必须忽略的文件类型
```gitignore
# Jekyll构建产物
_site/
.jekyll-cache/
.jekyll-metadata

# 依赖目录
vendor/
.bundle/

# IDE配置
.vscode/
.idea/
*.swp
*.swo

# 操作系统文件
.DS_Store
Thumbs.db

# 环境文件
.env
.env.local

# 日志文件
*.log

# 临时文件
*.tmp
*.temp
```

#### 3.2 检查项目
- 验证 `.gitignore` 文件存在且包含必要规则
- 检查是否有敏感文件被意外提交
- 确保构建产物不会进入版本控制

### 4. 代码质量检查

#### 4.1 代码风格标准

##### 4.1.1 缩进规范
- **HTML/Liquid模板**：使用2个空格缩进
- **SCSS/CSS**：使用2个空格缩进
- **JavaScript**：使用2个空格缩进
- **YAML配置文件**：使用2个空格缩进
- **Markdown**：使用2个空格缩进（嵌套列表时）

##### 4.1.2 括号使用规范
- **CSS/SCSS**：开括号与属性同行，闭括号独占一行
  ```scss
  .class-name {
    property: value;
  }
  ```
- **JavaScript**：开括号与控制语句同行，函数开括号同行
  ```javascript
  if (condition) {
    // code
  }
  
  function name() {
    // code
  }
  ```
- **HTML标签**：闭合标签完整，自闭合标签使用 `/>` 结尾

##### 4.1.3 命名规范
- **变量命名**：使用有意义的名称，遵循驼峰命名法（camelCase）
  ```javascript
  let postTitle = "标题";
  let isPublished = true;
  ```
- **CSS类名**：使用连字符分隔（kebab-case），采用BEM风格
  ```css
  .post-card { }
  .post-card__title { }
  .post-card--featured { }
  ```
- **文件命名**：
  - 博文文件：`YYYY-MM-DD-slug.md`
  - 布局文件：小写字母和连字符（如 `default.html`）
  - 包含文件：小写字母和连字符（如 `header.html`）
  - SCSS文件：小写字母和连字符（如 `main.scss`）

##### 4.1.4 代码注释规范
- **HTML/Liquid**：使用 `{% comment %}...{% endcomment %}` 或 `<!-- -->`
- **SCSS/CSS**：使用 `/* 块注释 */` 或 `// 行注释`
- **JavaScript**：使用 `// 行注释` 或 `/* 块注释 */`
- **注释内容**：解释代码目的和逻辑，而非重复代码本身

##### 4.1.5 代码组织方式
- **HTML结构**：语义化标签，合理嵌套层级
- **SCSS组织**：按组件/功能模块组织，使用嵌套但不超过3层
- **JavaScript**：模块化组织，避免全局变量污染
- **Liquid模板**：合理使用 includes 复用代码片段

#### 4.2 文件格式检查
- HTML文件缩进规范（2空格）
- SCSS/CSS文件格式
- Markdown文件格式规范

#### 4.3 命名规范检查
- 博文文件命名：`YYYY-MM-DD-slug.md`
- 布局文件命名：小写字母和连字符
- CSS类名：BEM风格或连字符分隔

#### 4.4 Front Matter检查
```yaml
# 必填字段验证
required_fields:
  - title
  - excerpt
  - date
  - categories
  - tags

# 可选字段验证
optional_fields:
  - layout
  - author
  - permalink
```

### 5. 提交规范检查

#### 5.1 Conventional Commits验证
检查提交信息是否符合规范：
```
<type>(<scope>): <description>

[optional body]
[optional footer]
```

支持的提交类型：
- `feat`: 新功能或新文章
- `fix`: 修复问题
- `style`: 样式调整
- `content`: 博文内容更新
- `config`: 配置文件变更
- `docs`: 文档更新
- `chore`: 构建/工具链变更
- `refactor`: 重构

#### 5.2 提交信息示例
```
feat(content): 新增树莓派5开箱评测文章
style(theme): 调整暗色模式代码块背景色
fix(navigation): 修复移动端导航菜单遮挡问题
config: 更新 jekyll-paginate 分页数为10
```

#### 5.3 完整提交流程
每次完成项目撰写或功能模块开发后，必须执行以下操作：

##### 5.3.1 提交前检查
```bash
# 1. 检查文件状态
git status

# 2. 查看变更内容
git diff

# 3. 检查是否有未跟踪的文件需要添加
git ls-files --others --exclude-standard
```

##### 5.3.2 执行提交
```bash
# 1. 添加所有变更文件到暂存区
git add .

# 2. 提交变更（使用规范的提交信息）
git commit -m "type(scope): description"

# 示例：
git commit -m "feat(content): 新增ESP32开发入门指南"
git commit -m "fix(theme): 修复暗色模式下代码块背景色显示问题"
git commit -m "docs: 更新README项目说明"
```

##### 5.3.3 推送到远程仓库
```bash
# 1. 推送到远程仓库（GitHub）
git push origin main

# 2. 如果是新分支，设置上游分支
git push -u origin feature/new-feature

# 3. 检查推送状态
git status
```

##### 5.3.4 推送后验证
```bash
# 1. 验证远程仓库状态
git log --oneline -5

# 2. 检查GitHub Actions构建状态（如果配置了CI/CD）
# 访问 GitHub 仓库的 Actions 页面查看构建状态

# 3. 验证部署是否成功
# 访问 https://eganchiyu.github.io 检查网站是否更新
```

#### 5.4 分支管理策略
- **main分支**：生产环境代码，保持稳定
- **feature/*分支**：新功能开发
- **fix/*分支**：问题修复
- **content/*分支**：博文内容更新

```bash
# 创建并切换到新功能分支
git checkout -b feature/new-feature

# 完成开发后合并到main分支
git checkout main
git merge feature/new-feature

# 删除功能分支（可选）
git branch -d feature/new-feature
```

## 执行命令

### 快速检查命令
```bash
# 1. 检查git状态
git status

# 2. 检查最近提交
git log --oneline -5

# 3. 检查文件变更
git diff --name-only HEAD~1

# 4. 执行Jekyll构建
bundle exec jekyll build

# 5. 检查gitignore
cat .gitignore | head -20
```

### 完整检查脚本
创建 `scripts/post-commit-check.sh`:
```bash
#!/bin/bash

echo "=== Post Commit Check 开始 ==="

# 检查Jekyll构建
echo "1. 检查Jekyll构建..."
bundle exec jekyll build --quiet
if [ $? -eq 0 ]; then
    echo "   ✓ 构建成功"
else
    echo "   ✗ 构建失败"
    exit 1
fi

# 检查gitignore
echo "2. 检查.gitignore..."
if [ -f .gitignore ]; then
    echo "   ✓ .gitignore存在"
    # 检查关键忽略项
    grep -q "_site/" .gitignore && echo "   ✓ 包含_site/忽略规则"
    grep -q ".jekyll-cache" .gitignore && echo "   ✓ 包含.jekyll-cache忽略规则"
else
    echo "   ✗ .gitignore文件缺失"
fi

# 检查文档更新
echo "3. 检查文档更新..."
# 获取最近修改的文件
changed_files=$(git diff --name-only HEAD~1 HEAD)
echo "   最近变更的文件:"
echo "$changed_files" | head -10

# 检查Front Matter
echo "4. 检查Front Matter..."
for file in _posts/*.md; do
    if [ -f "$file" ]; then
        # 检查必填字段
        if grep -q "^title:" "$file" && \
           grep -q "^date:" "$file" && \
           grep -q "^categories:" "$file"; then
            echo "   ✓ $file Front Matter完整"
        else
            echo "   ✗ $file Front Matter不完整"
        fi
    fi
done

echo "=== Post Commit Check 完成 ==="
```

## 使用方式

### 手动执行
用户可以手动请求执行Post Commit Check：
```
请执行Post Commit Check，验证最近的提交质量
```

### 自动执行建议
建议在以下场景自动调用：
1. 每次 `git commit` 后
2. 推送到远程仓库前
3. 创建Pull Request前
4. 定期质量检查

## 结果输出

检查完成后，输出格式化的报告：
```
=== Post Commit Check 报告 ===

构建状态: ✓ 成功
文档更新: ✓ 已同步
Gitignore: ✓ 配置正确
代码质量: ✓ 符合规范
代码风格: ✓ 统一规范
提交规范: ✓ 格式正确
推送状态: ✓ 已推送到远程仓库

总体评估: 通过
建议: 无
============================
```

## 注意事项

1. **文档同步要求**：所有代码变更必须同步更新文档
2. **测试覆盖**：确保关键功能有测试验证
3. **配置安全**：敏感信息不得提交到版本控制
4. **格式规范**：遵循项目既定的编码和命名规范
5. **提交信息**：使用规范的Conventional Commits格式
6. **代码风格**：严格遵循统一的缩进、括号、命名和注释规范
7. **提交推送**：每次完成项目撰写或功能模块开发后，必须执行完整的commit和push操作
8. **版本备份**：确保代码及时推送到GitHub仓库，实现版本控制和代码备份