# Logo 部署说明

## ✅ 是的，上传到服务器的代码也可以这样做！

你的项目使用 **GitHub Pages** 部署，工作流程如下：

### 📦 部署流程

1. **本地开发**
   - 将 logo 文件放在 `public/logo.svg` 或 `public/logo.png`
   - 代码中引用 `/logo.svg` 或 `/logo.png`

2. **构建过程**
   - 运行 `npm run build` 或 `pnpm build` 时
   - Next.js 会自动将 `public` 文件夹中的所有文件复制到 `out` 目录
   - Logo 文件会被包含在构建输出中

3. **GitHub Actions 自动部署**
   - 当你推送代码到 GitHub 时
   - GitHub Actions 会自动：
     1. 安装依赖
     2. 运行构建 (`pnpm build`)
     3. 将 `out` 目录部署到 GitHub Pages

4. **结果**
   - Logo 文件会出现在部署的网站上
   - 路径为：`https://YOUR_USERNAME.github.io/eslatin-official-website/logo.svg`

## 🔄 完整工作流程

### 步骤 1: 上传 Logo 到本地项目

```bash
# 将你的 logo 文件复制到 public 文件夹
cp /path/to/your/logo.svg /Users/xiaoqingran/Desktop/EsLatin/eslatin-official-website/public/logo.svg
```

### 步骤 2: 提交代码到 Git

```bash
cd /Users/xiaoqingran/Desktop/EsLatin/eslatin-official-website
git add public/logo.svg
git commit -m "Add custom logo"
git push origin main
```

### 步骤 3: 自动部署

- GitHub Actions 会自动检测到代码推送
- 自动构建并部署网站
- 几分钟后，你的 logo 就会出现在线上网站

## 📁 文件结构

```
eslatin-official-website/
├── public/
│   ├── logo.svg          ← 你的 logo 文件放在这里
│   ├── icon.svg
│   └── ...
├── app/
│   └── ...
├── components/
│   └── navbar.tsx        ← 代码中引用 /logo.svg
└── .github/
    └── workflows/
        └── deploy.yml    ← 自动部署配置
```

## ✅ 验证部署

部署完成后，你可以通过以下方式验证：

1. **检查 GitHub Actions**
   - 在 GitHub 仓库页面，点击 "Actions" 标签
   - 查看最新的部署工作流是否成功

2. **访问网站**
   - 访问：`https://YOUR_USERNAME.github.io/eslatin-official-website/`
   - 检查导航栏和页脚是否显示你的 logo

3. **直接访问 Logo**
   - 访问：`https://YOUR_USERNAME.github.io/eslatin-official-website/logo.svg`
   - 应该能看到你的 logo 文件

## 💡 重要提示

1. **文件路径**
   - 代码中使用 `/logo.svg`（以 `/` 开头）
   - 这会被解析为 `public/logo.svg`
   - 部署后路径为 `/eslatin-official-website/logo.svg`（因为有 basePath）

2. **basePath 配置**
   - 你的项目配置了 `basePath: '/eslatin-official-website'`
   - Next.js 会自动处理路径，你不需要在代码中手动添加 basePath

3. **文件格式**
   - SVG 格式推荐（矢量图，质量最好）
   - PNG 格式也可以（需要透明背景）

4. **Git 提交**
   - 确保将 logo 文件提交到 Git 仓库
   - 不要将 logo 文件添加到 `.gitignore`

## 🚀 快速开始

1. 将 logo 文件放到 `public/logo.svg`
2. 提交并推送代码
3. 等待 GitHub Actions 自动部署
4. 访问网站查看效果

就是这么简单！🎉

