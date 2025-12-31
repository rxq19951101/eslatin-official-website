# 移动端测试指南

## 方法 1：浏览器开发者工具（最简单快速）

### Chrome/Edge 浏览器：

1. **启动开发服务器**：
   ```bash
   npm run dev
   ```

2. **打开开发者工具**：
   - 按 `F12` 或 `Cmd+Option+I` (Mac) / `Ctrl+Shift+I` (Windows/Linux)
   - 或右键点击页面 → 选择"检查"

3. **进入响应式设计模式**：
   - 点击工具栏上的设备切换图标（📱 或 Toggle device toolbar）
   - 或按 `Cmd+Shift+M` (Mac) / `Ctrl+Shift+M` (Windows/Linux)

4. **选择设备预设**：
   - 在顶部工具栏中选择预设设备（iPhone、iPad、Galaxy等）
   - 或手动调整尺寸

5. **测试触摸交互**：
   - 启用触摸模拟（默认已启用）
   - 点击导航菜单测试移动端交互

### 常用设备预设：
- iPhone 12/13/14 Pro (390x844)
- iPhone SE (375x667)
- iPad Pro (1024x1366)
- Samsung Galaxy S20 (360x800)
- 自定义尺寸（如 375x812）

## 方法 2：在真实手机上测试（推荐用于最终验证）

### 步骤：

1. **确保开发服务器允许外部访问**：
   开发服务器默认运行在 `localhost:3000`，需要绑定到 `0.0.0.0` 以便手机访问。

2. **获取你的电脑IP地址**：
   
   **macOS/Linux**:
   ```bash
   ifconfig | grep "inet " | grep -v 127.0.0.1
   ```
   或
   ```bash
   ipconfig getifaddr en0  # macOS 有线连接
   ipconfig getifaddr en1  # macOS WiFi
   ```
   
   **Windows**:
   ```cmd
   ipconfig
   ```
   查找 "IPv4 地址"，通常是 `192.168.x.x` 或 `10.x.x.x`

3. **启动开发服务器（绑定到所有网络接口）**：
   
   修改 `package.json` 中的 dev 脚本，或直接运行：
   ```bash
   npm run dev -- -H 0.0.0.0
   ```
   
   或者创建一个新脚本：
   ```json
   "dev:mobile": "next dev -H 0.0.0.0"
   ```

4. **在手机上访问**：
   - 确保手机和电脑连接在**同一个WiFi网络**中
   - 在手机浏览器中输入：`http://YOUR_IP_ADDRESS:3000`
   - 例如：`http://192.168.1.100:3000`

## 方法 3：使用 ngrok（跨网络测试）

如果你想让其他人也能访问，可以使用 ngrok：

1. **安装 ngrok**：
   ```bash
   # macOS
   brew install ngrok
   
   # 或下载 https://ngrok.com/download
   ```

2. **启动开发服务器**：
   ```bash
   npm run dev
   ```

3. **创建隧道**：
   ```bash
   ngrok http 3000
   ```

4. **在手机上访问**：
   - 使用 ngrok 提供的 URL（如 `https://xxxx.ngrok.io`）
   - 这个URL可以从任何网络访问

## 方法 4：使用在线工具

- **BrowserStack**: https://www.browserstack.com
- **Responsively App**: https://responsively.app （免费桌面应用）
- **Chrome DevTools Device Mode**: 直接在浏览器中使用

## 测试检查清单

### 移动端导航测试：
- [ ] 菜单按钮是否正常显示
- [ ] 点击菜单按钮能打开/关闭侧边栏
- [ ] 导航链接是否正确高亮当前页面
- [ ] 语言切换器是否清晰可见
- [ ] 语言切换是否正常工作

### 响应式布局测试：
- [ ] 文字大小是否合适
- [ ] 图片是否适配屏幕
- [ ] 按钮是否足够大，易于点击（至少 44x44px）
- [ ] 内容是否横向溢出
- [ ] WhatsApp 浮窗是否显示正常

### 交互测试：
- [ ] 触摸滑动是否流畅
- [ ] 点击区域是否有足够反馈
- [ ] 表单输入是否正常
- [ ] 滚动性能是否流畅

## 快速测试命令

我已经在 `package.json` 中添加了 `dev:mobile` 脚本，可以直接运行：

```bash
npm run dev:mobile
```

这会在所有网络接口上启动开发服务器，然后你可以用手机的浏览器访问 `http://YOUR_IP:3000`。

