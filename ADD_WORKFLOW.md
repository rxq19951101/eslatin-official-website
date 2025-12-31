# 手动添加 GitHub Actions Workflow 文件

由于 GitHub token 权限限制，需要在 GitHub 网页上手动添加 workflow 文件。

## 操作步骤

1. 访问仓库：https://github.com/rxq19951101/eslatin-official-website

2. 点击 "Add file" → "Create new file"

3. 在文件名输入框中输入：`.github/workflows/deploy.yml`

4. 复制以下内容并粘贴到编辑器：

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

5. 点击 "Commit new file" 提交文件

6. 完成！之后每次推送到 main 分支时，GitHub Actions 会自动构建并部署网站。

