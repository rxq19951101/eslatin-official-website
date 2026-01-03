# 📸 上传项目图片说明

## ⚠️ 当前状态

项目图片文件尚未上传，网站会显示占位符图片。

## 📁 需要上传的文件

请将以下两张图片保存到 `public` 文件夹：

### 1. 小区商业项目图片
- **文件名**：`project-commercial.jpg`
- **完整路径**：`/Users/xiaoqingran/Desktop/EsLatin/eslatin-official-website/public/project-commercial.jpg`
- **描述**：显示充电站和建筑物的照片（小区商业综合体）

### 2. 政府车队项目图片
- **文件名**：`project-government.jpg`
- **完整路径**：`/Users/xiaoqingran/Desktop/EsLatin/eslatin-official-website/public/project-government.jpg`
- **描述**：显示充电站和竹子的照片（政府车队项目）

## 🚀 上传方法

### 方法 1：使用 Finder（最简单）

1. 打开 Finder
2. 导航到：`/Users/xiaoqingran/Desktop/EsLatin/eslatin-official-website/public`
3. 将你的两张图片拖拽到这个文件夹
4. 重命名为：
   - `project-commercial.jpg`（第一张图片）
   - `project-government.jpg`（第二张图片）

### 方法 2：使用终端

```bash
# 将图片复制到 public 文件夹
cp /path/to/your/commercial-image.jpg /Users/xiaoqingran/Desktop/EsLatin/eslatin-official-website/public/project-commercial.jpg
cp /path/to/your/government-image.jpg /Users/xiaoqingran/Desktop/EsLatin/eslatin-official-website/public/project-government.jpg
```

### 方法 3：在 Cursor IDE 中

1. 在左侧文件浏览器中，打开 `public` 文件夹
2. 右键点击 `public` 文件夹
3. 选择 "New File" 或直接将图片拖拽进去
4. 重命名为正确的文件名

## ✅ 验证上传

上传后，运行以下命令验证：

```bash
ls -la public/project-*.jpg
```

应该看到：
```
-rw-r--r--  ... project-commercial.jpg
-rw-r--r--  ... project-government.jpg
```

## 🔄 刷新网站

上传图片后：
1. 刷新浏览器页面（Cmd+R 或 Ctrl+R）
2. 如果还是显示占位符，尝试硬刷新（Cmd+Shift+R 或 Ctrl+Shift+R）
3. 检查浏览器控制台是否有错误

## 📋 文件要求

- **格式**：JPG、JPEG 或 PNG
- **推荐尺寸**：至少 800x600 像素
- **文件大小**：建议小于 1MB（可以压缩）

## 💡 提示

- 如果图片文件名不对，网站会显示占位符
- 确保文件名完全匹配：`project-commercial.jpg` 和 `project-government.jpg`
- 文件名区分大小写

上传完成后，图片会自动显示在网站上！

