# 完成部署配置的步骤

## 当前状态

✅ GitHub 仓库已创建：https://github.com/rxq19951101/eslatin-official-website
✅ 代码已推送到远程仓库
⚠️ Workflow 文件需要更新内容（当前为空）
⚠️ GitHub Pages 尚未配置

## 需要完成的步骤

### 步骤 1：更新 Workflow 文件内容

由于权限限制，需要在 GitHub 网页上手动更新 workflow 文件：

1. 访问：https://github.com/rxq19951101/eslatin-official-website/blob/main/.github/workflows/deploy.yml
2. 点击右上角的 "Edit" (铅笔图标)
3. 删除现有内容，复制以下完整内容并粘贴：

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches:
      - main
      - master
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'

      - name: Setup pnpm
        uses: pnpm/action-setup@v4
        with:
          version: latest

      - name: Install dependencies
        run: pnpm install

      - name: Build
        run: pnpm build

      - name: Setup Pages
        uses: actions/configure-pages@v5

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./out

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

4. 滚动到页面底部，点击 "Commit changes"

### 步骤 2：配置 GitHub Pages

1. 访问仓库设置：https://github.com/rxq19951101/eslatin-official-website/settings/pages
2. 在 "Source" 部分，选择：**GitHub Actions**
3. 点击 "Save" 保存设置

### 步骤 3：触发部署

更新 workflow 文件后，GitHub Actions 会自动触发部署。你也可以：

1. 访问 Actions 页面：https://github.com/rxq19951101/eslatin-official-website/actions
2. 点击 "Deploy to GitHub Pages" workflow
3. 点击 "Run workflow" 手动触发

### 步骤 4：等待部署完成

- 部署通常需要 2-5 分钟
- 在 Actions 页面可以查看部署进度
- 部署成功后，网站将在以下地址可访问：
  - https://rxq19951101.github.io/eslatin-official-website/

## 验证部署

部署成功后，你可以：
1. 访问网站 URL 查看效果
2. 在仓库 Settings → Pages 中查看部署状态
3. 在 Actions 页面查看部署日志

## 后续更新

之后每次推送代码到 `main` 分支，GitHub Actions 会自动：
1. 构建 Next.js 网站
2. 部署到 GitHub Pages

无需手动操作！

