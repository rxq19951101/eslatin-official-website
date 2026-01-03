# 产品图片上传说明

## 📸 需要上传的产品图片

请将以下三张产品图片保存到 `public` 文件夹：

### 1. 交流住宅充电桩
- **文件名**：`product-1.jpg`
- **完整路径**：`/Users/xiaoqingran/Desktop/EsLatin/eslatin-official-website/public/product-1.jpg`
- **产品**：7kW - 22kW 交流充电桩

### 2. 电动汽车交流充电桩 7kW Type2
- **文件名**：`product-2.png`
- **完整路径**：`/Users/xiaoqingran/Desktop/EsLatin/eslatin-official-website/public/product-2.png`
- **产品**：7kW 交流充电桩 Type2

### 3. 60KW双枪直流桩 (GB+CCS2)
- **文件名**：`product-3.png`
- **完整路径**：`/Users/xiaoqingran/Desktop/EsLatin/eslatin-official-website/public/product-3.png`
- **产品**：60kW 双枪直流充电桩

## 🚀 上传方法

### 方法 1：使用 Finder（最简单）

1. 打开 Finder
2. 导航到：`/Users/xiaoqingran/Desktop/EsLatin/eslatin-official-website/public`
3. 将你的三张产品图片拖拽到这个文件夹
4. 重命名为：
   - `product-1.jpg`（第一张产品图片）
   - `product-2.png`（第二张产品图片）
   - `product-3.png`（第三张产品图片）

### 方法 2：使用终端

```bash
# 将产品图片复制到 public 文件夹
cp /path/to/your/product1.jpg /Users/xiaoqingran/Desktop/EsLatin/eslatin-official-website/public/product-1.jpg
cp /path/to/your/product2.png /Users/xiaoqingran/Desktop/EsLatin/eslatin-official-website/public/product-2.png
cp /path/to/your/product3.png /Users/xiaoqingran/Desktop/EsLatin/eslatin-official-website/public/product-3.png
```

## ✅ 验证上传

上传后，运行以下命令验证：

```bash
ls -la public/product-*.jpg
```

应该看到：
```
-rw-r--r--  ... product-1.jpg
-rw-r--r--  ... product-2.png
-rw-r--r--  ... product-3.png
```

## 📋 文件格式要求

- **格式**：JPG、JPEG 或 PNG
- **推荐尺寸**：至少 800x600 像素
- **文件大小**：建议小于 1MB（可以压缩）

## 🎯 产品信息

### 产品 1：交流住宅充电桩
- **功率**：7kW - 22kW
- **类型**：AC（交流）
- **适用场景**：住宅、办公室、小型商业

### 产品 2：直流快充桩
- **功率**：60kW - 180kW
- **类型**：DC（直流）
- **适用场景**：购物中心、公共停车场、商业车队

### 产品 3：60KW双枪直流桩 (GB+CCS2)
- **功率**：60kW
- **类型**：DC（直流）
- **适用场景**：购物中心、公共停车场、商业车队、服务站

## 🔄 刷新网站

上传图片后：
1. 刷新浏览器页面（Cmd+R 或 Ctrl+R）
2. 如果还是显示占位符，尝试硬刷新（Cmd+Shift+R 或 Ctrl+Shift+R）
3. 检查浏览器控制台是否有错误

## 💡 提示

- 如果图片文件名不对，网站会显示占位符
- 确保文件名完全匹配：`product-1.jpg`、`product-2.png`、`product-3.png`
- 文件名区分大小写

上传完成后，产品图片会自动显示在网站上！

