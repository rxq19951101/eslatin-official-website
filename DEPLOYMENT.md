# GitHub Pages 部署说明

## 已完成的配置

1. ✅ Git 仓库已初始化
2. ✅ Next.js 已配置为静态导出模式 (`output: 'export'`)
3. ✅ GitHub Actions 工作流已创建 (`.github/workflows/deploy.yml`)
4. ✅ 代码已提交到本地仓库

## 下一步操作

### 1. 在 GitHub 上创建远程仓库

1. 访问 [GitHub](https://github.com) 并登录
2. 点击右上角的 "+" 号，选择 "New repository"
3. 仓库名称建议: `eslatin-official-website`
4. 选择 Public 或 Private
5. **不要**初始化 README、.gitignore 或 license（我们已经有了）
6. 点击 "Create repository"

### 2. 添加远程仓库并推送代码

在终端中运行以下命令（将 `YOUR_USERNAME` 替换为您的 GitHub 用户名）：

```bash
git remote add origin https://github.com/YOUR_USERNAME/eslatin-official-website.git
git branch -M main
git push -u origin main
```

### 3. 配置 GitHub Pages

1. 在 GitHub 仓库页面，点击 "Settings"
2. 在左侧菜单中找到 "Pages"
3. 在 "Source" 部分，选择：
   - Source: **GitHub Actions**
4. 保存设置

### 4. 触发部署

- 每次推送到 `main` 分支时，GitHub Actions 会自动构建并部署网站
- 或者，在 GitHub 仓库的 "Actions" 标签页中手动触发工作流

### 5. 访问网站

部署完成后，您的网站将在以下地址可访问：
- `https://YOUR_USERNAME.github.io/eslatin-official-website/`

## 注意事项

- 确保 GitHub 仓库的 Pages 设置中选择了 "GitHub Actions" 作为源
- 首次部署可能需要几分钟时间
- 如果需要自定义域名，可以在 Pages 设置中配置

