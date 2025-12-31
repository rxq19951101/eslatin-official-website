# 授权 GitHub CLI 的 Workflow 权限

## 方法 1：使用命令行重新授权（推荐）

在终端中运行以下命令：

```bash
gh auth refresh -h github.com -s workflow
```

这会打开浏览器，要求你授权 workflow 权限。点击 "Authorize" 即可。

## 方法 2：完全重新登录

如果方法1不起作用，可以完全重新登录：

```bash
gh auth login --hostname github.com --scopes repo,workflow
```

按照提示选择：
1. GitHub.com
2. HTTPS
3. 认证方式（浏览器或token）
4. 授权时确保勾选 workflow 权限

## 方法 3：在 GitHub 网站上手动撤销并重新授权

1. 访问：https://github.com/settings/tokens
2. 找到 "gh" 相关的 token
3. 撤销旧 token
4. 运行 `gh auth login` 重新登录

## 验证授权是否成功

授权完成后，运行以下命令验证：

```bash
gh auth status
```

你应该看到 `workflow` 在 token scopes 列表中。

## 授权后推送 Workflow 文件

授权成功后，运行：

```bash
git add .github/workflows/deploy.yml
git commit -m "Add GitHub Pages deployment workflow"
git push origin main
```

