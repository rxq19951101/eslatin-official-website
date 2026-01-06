# Spaceship Webhosting 部署指南

## 快速部署步骤

### 步骤1：构建静态文件

在项目根目录运行：

```bash
npm run build:webhost
```

或者：

```bash
DEPLOY_TARGET=server npm run build
```

构建完成后，所有静态文件会在 `out/` 目录中。

### 步骤2：准备上传文件

检查构建结果：

```bash
ls -la out/
```

你应该看到类似以下文件：
- `index.html`
- `404.html`
- `_next/` 目录（包含所有静态资源）
- 其他页面和资源文件

### 步骤3：上传到 Spaceship

#### 方法1：使用 cPanel File Manager（推荐）

1. **登录 cPanel**
   - 访问你的 Spaceship cPanel 控制面板

2. **打开 File Manager**
   - 在 cPanel 中找到 "File Manager" 并点击

3. **导航到网站根目录**
   - 在左侧目录树中，展开 `eslatin.com.co`
   - 点击 `public_html` 目录
   - **重要**：这是你的网站根目录，所有文件应该上传到这里

4. **清空 public_html（如果已有文件）**
   - 选中所有现有文件
   - 点击 "Delete" 删除（或移动到其他位置备份）

5. **上传文件**
   - 点击工具栏上的 "↑ Upload" 按钮
   - 选择 `out/` 目录中的所有文件和文件夹
   - 或者使用拖放功能上传

6. **确保文件结构正确**
   - 上传后，`public_html` 目录应该包含：
     - `index.html`
     - `404.html`
     - `_next/` 目录
     - 其他页面文件

#### 方法2：使用 FTP/SFTP

1. **获取 FTP 信息**
   - 在 cPanel 中找到 "FTP Accounts" 或 "File Manager"
   - 记录 FTP 服务器地址、用户名和密码

2. **使用 FTP 客户端**
   - 使用 FileZilla、Cyberduck 或其他 FTP 客户端
   - 连接到服务器
   - 导航到 `public_html` 目录
   - 上传 `out/` 目录中的所有内容

3. **上传命令（使用命令行）**
   ```bash
   # 使用 rsync（如果支持SSH）
   rsync -avz --delete ./out/ username@server:/home/username/public_html/
   
   # 或使用 scp
   scp -r ./out/* username@server:/home/username/public_html/
   ```

### 步骤4：验证部署

1. **访问网站**
   - 在浏览器中访问：`https://eslatin.com.co`
   - 检查页面是否正常加载

2. **检查文件**
   - 确认所有图片、CSS、JS 文件都能正常加载
   - 测试导航链接是否正常工作

3. **清除浏览器缓存**
   - 如果看到旧版本，按 `Ctrl+Shift+R` (Windows) 或 `Cmd+Shift+R` (Mac) 强制刷新

## 重要注意事项

### 1. 目录结构

确保上传后的目录结构是：
```
public_html/
├── index.html
├── 404.html
├── _next/
│   ├── static/
│   └── ...
├── logo.png
├── logo.svg
├── product-1.png
├── product-2.png
├── product-3.png
└── ... (其他资源文件)
```

**不要**上传整个 `out` 文件夹，而是上传 `out` 文件夹**内部的内容**。

### 2. 文件权限

确保文件有正确的读取权限：
- 文件：644 或 755
- 目录：755

在 cPanel File Manager 中：
- 选中文件/目录
- 点击 "Permissions"
- 设置适当的权限

### 3. .htaccess 文件（如果需要）

如果网站路由有问题，可能需要创建 `.htaccess` 文件：

在 `public_html` 目录创建 `.htaccess` 文件，内容：

```apache
# Next.js 静态导出路由支持
RewriteEngine On
RewriteBase /

# 处理 Next.js 路由
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ /index.html [L]

# 启用 Gzip 压缩
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript application/json
</IfModule>

# 缓存静态资源
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType image/svg+xml "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
</IfModule>
```

### 4. HTTPS 配置

Spaceship 通常会自动提供 SSL 证书。如果还没有启用 HTTPS：

1. 在 cPanel 中找到 "SSL/TLS Status"
2. 为 `eslatin.com.co` 启用 SSL
3. 等待证书自动配置完成

## 更新网站

每次更新网站内容后：

1. **本地修改代码**
2. **重新构建**：
   ```bash
   npm run build:webhost
   ```
3. **上传新的 `out/` 目录内容**到 `public_html`

## 故障排查

### 问题1：页面显示 404

- 检查是否上传了 `.htaccess` 文件
- 确认文件上传到了 `public_html` 而不是其他目录
- 检查文件权限

### 问题2：图片或资源无法加载

- 确认 `public/` 目录中的文件已正确上传
- 检查文件路径是否正确（应该是相对路径）
- 查看浏览器控制台的错误信息

### 问题3：样式或脚本不工作

- 确认 `_next/static/` 目录已上传
- 清除浏览器缓存
- 检查文件权限

### 问题4：路由不工作

- 确保 `.htaccess` 文件存在且配置正确
- 检查 Apache mod_rewrite 是否启用（通常默认启用）

## 快速部署脚本

创建一个简单的部署脚本 `deploy-spaceship.sh`：

```bash
#!/bin/bash

echo "开始构建..."
npm run build:webhost

echo ""
echo "构建完成！"
echo ""
echo "下一步："
echo "1. 登录 Spaceship cPanel"
echo "2. 打开 File Manager"
echo "3. 进入 public_html 目录"
echo "4. 上传 out/ 目录中的所有文件"
echo ""
echo "或者使用 FTP 上传："
echo "rsync -avz --delete ./out/ username@server:/path/to/public_html/"
```

运行：
```bash
chmod +x deploy-spaceship.sh
./deploy-spaceship.sh
```

## 总结

1. ✅ 运行 `npm run build:webhost` 构建
2. ✅ 上传 `out/` 目录内容到 `public_html`
3. ✅ 确保文件权限正确
4. ✅ 访问 `https://eslatin.com.co` 验证

完成！你的网站应该可以正常访问了。

