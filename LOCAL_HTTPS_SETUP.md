# 本地HTTPS开发设置指南

## 快速开始

### 步骤1：生成SSL证书

```bash
npm run generate-cert
```

这会生成自签名SSL证书，用于本地HTTPS开发。

### 步骤2：启动HTTPS开发服务器

```bash
npm run dev:https
```

服务器将在 `https://localhost:3001` 启动。

**注意**：HTTPS服务使用3001端口，避免与HTTP服务(3000端口)冲突。

### 步骤3：访问网站

在浏览器中访问：`https://localhost:3001`

- HTTP服务：`http://localhost:3000`
- HTTPS服务：`https://localhost:3001`

**注意**：浏览器会显示"不安全"警告，因为使用的是自签名证书。这是正常的：
- 点击"高级"或"Advanced"
- 点击"继续访问"或"Proceed to localhost"

## 详细说明

### 证书生成

证书生成脚本会：
1. 创建 `certs/` 目录
2. 生成私钥 (`localhost-key.pem`)
3. 生成自签名证书 (`localhost.pem`)
4. 证书有效期：365天
5. 支持的域名：`localhost`, `*.localhost`
6. 支持的IP：`127.0.0.1`, `::1`

### 自定义服务器

`server.js` 文件配置了：
- HTTPS服务器（使用自签名证书）
- Next.js开发模式
- 端口：3000
- 主机：localhost

### 脚本说明

- `npm run dev` - 普通HTTP开发服务器
- `npm run dev:https` - HTTPS开发服务器
- `npm run generate-cert` - 生成SSL证书

## 使用mkcert（推荐，避免浏览器警告）

如果你想避免浏览器的"不安全"警告，可以使用 `mkcert` 生成本地信任的证书：

### 安装mkcert

**macOS:**
```bash
brew install mkcert
brew install nss # Firefox支持
```

**Linux:**
```bash
# Ubuntu/Debian
sudo apt install libnss3-tools
wget -O mkcert https://github.com/FiloSottile/mkcert/releases/latest/download/mkcert-v1.4.4-linux-amd64
chmod +x mkcert
sudo mv mkcert /usr/local/bin/
```

**Windows:**
```bash
# 使用Chocolatey
choco install mkcert

# 或下载: https://github.com/FiloSottile/mkcert/releases
```

### 使用mkcert生成证书

```bash
# 1. 安装本地CA
mkcert -install

# 2. 生成证书（在项目根目录）
mkcert -key-file certs/localhost-key.pem -cert-file certs/localhost.pem localhost 127.0.0.1 ::1

# 3. 启动HTTPS服务器
npm run dev:https
```

使用mkcert生成的证书会被浏览器信任，不会显示警告。

## 故障排查

### 问题1：OpenSSL未安装

**错误信息：** `openssl: command not found`

**解决方案：**
- macOS: `brew install openssl`
- Ubuntu/Debian: `sudo apt-get install openssl`
- Windows: 下载并安装 [OpenSSL for Windows](https://slproweb.com/products/Win32OpenSSL.html)

### 问题2：端口被占用

**错误信息：** `EADDRINUSE: address already in use`

**解决方案：**
```bash
# 查找占用端口的进程
lsof -i :3000

# 杀死进程（替换PID为实际进程ID）
kill -9 <PID>
```

### 问题3：证书文件不存在

**错误信息：** `SSL证书不存在`

**解决方案：**
```bash
npm run generate-cert
```

### 问题4：浏览器不信任证书

这是正常的，因为使用的是自签名证书。解决方案：
1. 点击"高级" → "继续访问"
2. 或使用mkcert生成受信任的证书（见上方说明）

## 安全提示

⚠️ **重要**：
- 这些证书**仅用于本地开发**
- **不要**在生产环境使用自签名证书
- 生产环境应使用Let's Encrypt或其他受信任的CA颁发的证书
- `certs/` 目录已添加到 `.gitignore`，不会提交到仓库

## 下一步

配置好本地HTTPS后，你可以：
1. 测试HTTPS功能
2. 验证安全头设置
3. 测试混合内容（HTTP/HTTPS资源）
4. 准备部署到生产服务器（参考 `SERVER_DEPLOYMENT.md`）

