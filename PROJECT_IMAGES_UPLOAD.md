# 项目图片上传说明

## 📸 需要上传的图片

请将以下两张图片保存到 `public` 文件夹：

1. **小区商业项目图片**
   - 文件名：`project-commercial.jpg`
   - 路径：`public/project-commercial.jpg`
   - 描述：显示充电站和建筑物的照片

2. **政府车队项目图片**
   - 文件名：`project-government.jpg`
   - 路径：`public/project-government.jpg`
   - 描述：显示充电站和竹子的照片

## 📝 已完成的更新

### 1. 代码更新 (`app/page.tsx`)
- ✅ 第一张图片路径改为：`/project-commercial.jpg`
- ✅ 第二张图片路径改为：`/project-government.jpg`
- ✅ 更新了图片 alt 文本
- ✅ 更新了标签（添加了"试点项目"标签）

### 2. 翻译更新 (`lib/translations.ts`)

**西班牙语：**
- ✅ 项目1标题：改为 "Proyecto Comercial Residencial - China"
- ✅ 项目1描述：更新为小区商业综合体试点项目描述
- ✅ 项目2标题：改为 "Proyecto de Flota Gubernamental - China"
- ✅ 项目2描述：更新为政府车队试点项目描述
- ✅ 添加了 "pilotProject" 和 "governmentFleet" 翻译

**中文：**
- ✅ 项目1标题：改为 "小区商业项目 - 中国试点"
- ✅ 项目1描述：更新为小区商业综合体试点项目描述
- ✅ 项目2标题：改为 "政府车队项目 - 中国试点"
- ✅ 项目2描述：更新为政府车队试点项目描述
- ✅ 添加了 "pilotProject" 和 "governmentFleet" 翻译

## 🚀 上传步骤

### 方法 1：直接拖拽（推荐）
1. 打开 Finder
2. 导航到：`/Users/xiaoqingran/Desktop/EsLatin/eslatin-official-website/public`
3. 将两张图片拖拽到这个文件夹
4. 重命名为：
   - `project-commercial.jpg`
   - `project-government.jpg`

### 方法 2：使用终端
```bash
# 将图片复制到 public 文件夹
cp /path/to/your/commercial-image.jpg /Users/xiaoqingran/Desktop/EsLatin/eslatin-official-website/public/project-commercial.jpg
cp /path/to/your/government-image.jpg /Users/xiaoqingran/Desktop/EsLatin/eslatin-official-website/public/project-government.jpg
```

## ✅ 验证

上传后：
1. 刷新浏览器页面
2. 检查项目部分是否显示新图片
3. 检查描述是否正确

## 📋 文件格式要求

- **格式**：JPG 或 PNG
- **推荐尺寸**：至少 800x600 像素
- **文件大小**：建议小于 500KB（可以压缩）

## 🎯 项目描述总结

### 项目1：小区商业项目
- **类型**：小区商业综合体试点项目
- **地点**：中国
- **特点**：为居民和访客安装充电站，智能管理系统

### 项目2：政府车队项目
- **类型**：政府车队试点项目
- **地点**：中国
- **特点**：公务车辆充电网络，智能管理、负载平衡

上传图片后，网站会自动显示新的项目信息和图片！

