# 需要在 public_html 中创建的文件夹结构

## 方法1：在 cPanel File Manager 中手动创建文件夹

### 步骤1：创建主要文件夹

在 `public_html` 目录中，点击 "+ Folder" 按钮，依次创建以下文件夹：

1. `_next`
2. `_next/3fsrsqRCiralZUuhuEuAJ` (这个名称可能不同，检查你的out目录)
3. `_next/static`
4. `_next/static/chunks`
5. `_next/static/3fsrsqRCiralZUuhuEuAJ` (同样，检查实际名称)
6. `_next/static/media`
7. `about`
8. `platform`
9. `projects`
10. `solutions`
11. `solutions/products`
12. `solutions/products/ac-residential`
13. `solutions/products/dc-fast`
14. `solutions/products/dc-ultra`
15. `_not-found`

### 步骤2：上传文件

创建完所有文件夹后，按照以下顺序上传文件：

1. **根目录文件**：
   - `index.html`
   - `404.html`
   - 所有 `.png`, `.jpg`, `.svg` 等图片文件

2. **`_next` 文件夹**：
   - 上传 `out/_next/` 中的所有内容到 `public_html/_next/`

3. **各个页面文件夹**：
   - `about/` → 上传 `out/about/` 中的文件
   - `platform/` → 上传 `out/platform/` 中的文件
   - `projects/` → 上传 `out/projects/` 中的文件
   - `solutions/` → 上传 `out/solutions/` 中的文件
   - 等等...

## 方法2：压缩上传后解压（更简单！）

### 步骤1：压缩 out 目录

在本地运行：
```bash
cd /Users/xiaoqingran/Desktop/EsLatin/eslatin-official-website
zip -r website.zip out/*
```

### 步骤2：上传压缩文件

1. 在 cPanel File Manager 中，进入 `public_html`
2. 点击 "↑ Upload"
3. 上传 `website.zip` 文件

### 步骤3：解压文件

1. 上传完成后，在 File Manager 中找到 `website.zip`
2. 右键点击或选中文件
3. 点击 "Extract" 或 "解压"
4. 选择解压到当前目录
5. 解压后会有一个 `out` 文件夹

### 步骤4：移动文件

1. 进入 `out` 文件夹
2. 选中所有文件和文件夹
3. 点击 "Move"
4. 目标路径输入：`../` (上一级目录，即 public_html)
5. 确认移动

### 步骤5：删除空文件夹

1. 删除 `out` 文件夹（现在应该是空的）
2. 删除 `website.zip` 文件

## 方法3：使用 FTP 客户端（最简单）

使用 FileZilla 或其他 FTP 客户端：

1. 连接到你的 Spaceship FTP 服务器
2. 导航到 `public_html` 目录
3. 直接将整个 `out` 文件夹拖拽上传
4. 上传完成后，进入 `out` 文件夹，选中所有内容，移动到 `public_html` 根目录

## 推荐方法

**推荐使用方法2（压缩上传）**，因为：
- ✅ 最简单，不需要手动创建文件夹
- ✅ 一次上传，自动创建所有文件夹结构
- ✅ 不容易出错

