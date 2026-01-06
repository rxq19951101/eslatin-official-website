# 服务器部署和HTTPS配置指南

## 部署方案概述

本指南提供两种部署方案：
1. **静态文件部署**（推荐）- 使用Nginx + Let's Encrypt
2. **Node.js服务器部署** - 使用PM2 + Nginx反向代理

---

## 方案一：静态文件部署（推荐）

### 前置要求

- 服务器（Ubuntu/Debian推荐）
- 域名已解析到服务器IP
- SSH访问权限
- 已安装Node.js和pnpm

### 步骤1：构建静态文件

在本地或服务器上构建：

```bash
# 安装依赖
pnpm install

# 构建静态文件（移除basePath用于自己的服务器）
NODE_ENV=production pnpm build

# 构建后的文件在 ./out 目录
```

### 步骤2：修改Next.js配置（用于自己的服务器）

修改 `next.config.mjs`，移除basePath：

```javascript
/** @type {import('next').NextConfig} */
const isDev = process.env.NODE_ENV === 'development'
const nextConfig = {
  // 开发模式下不使用静态导出，生产环境才导出
  ...(isDev ? {} : { output: 'export' }),
  // 自己的服务器不需要basePath
  basePath: '',
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
}

export default nextConfig
```

### 步骤3：上传文件到服务器

```bash
# 使用rsync上传（推荐）
rsync -avz --delete ./out/ user@your-server.com:/var/www/eslatin/

# 或使用scp
scp -r ./out/* user@your-server.com:/var/www/eslatin/
```

### 步骤4：安装和配置Nginx

#### 4.1 安装Nginx

```bash
sudo apt update
sudo apt install nginx -y
```

#### 4.2 创建Nginx配置文件

创建文件 `/etc/nginx/sites-available/eslatin`：

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    root /var/www/eslatin;
    index index.html;

    # 启用gzip压缩
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json;

    # 静态文件缓存
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Next.js路由支持
    location / {
        try_files $uri $uri.html $uri/ /index.html;
    }

    # 安全头
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}
```

#### 4.3 启用站点

```bash
# 创建符号链接
sudo ln -s /etc/nginx/sites-available/eslatin /etc/nginx/sites-enabled/

# 测试配置
sudo nginx -t

# 重启Nginx
sudo systemctl restart nginx
```

### 步骤5：配置HTTPS（Let's Encrypt）

#### 5.1 安装Certbot

```bash
sudo apt install certbot python3-certbot-nginx -y
```

#### 5.2 获取SSL证书

```bash
# 自动配置HTTPS（推荐）
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# 或手动配置
sudo certbot certonly --nginx -d your-domain.com -d www.your-domain.com
```

Certbot会自动：
- 获取SSL证书
- 修改Nginx配置以启用HTTPS
- 设置HTTP到HTTPS的重定向
- 配置自动续期

#### 5.3 验证自动续期

```bash
# 测试续期
sudo certbot renew --dry-run
```

证书会自动每90天续期一次。

### 步骤6：最终Nginx配置（Certbot修改后）

Certbot会自动修改配置，最终配置类似：

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com www.your-domain.com;

    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;
    
    # SSL优化配置
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;

    root /var/www/eslatin;
    index index.html;

    # 启用gzip压缩
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json;

    # 静态文件缓存
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Next.js路由支持
    location / {
        try_files $uri $uri.html $uri/ /index.html;
    }

    # 安全头
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}
```

---

## 方案二：Node.js服务器部署

如果需要服务器端渲染（SSR），可以使用此方案。

### 步骤1：修改Next.js配置

修改 `next.config.mjs`：

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  // 不使用静态导出
  // output: 'export', // 注释掉这行
  basePath: '',
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
}

export default nextConfig
```

### 步骤2：安装PM2

```bash
npm install -g pm2
```

### 步骤3：启动应用

```bash
# 构建
pnpm build

# 使用PM2启动
pm2 start npm --name "eslatin" -- start

# 保存PM2配置
pm2 save

# 设置开机自启
pm2 startup
```

### 步骤4：配置Nginx反向代理

创建 `/etc/nginx/sites-available/eslatin`：

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com www.your-domain.com;

    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;
    
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
}
```

然后使用Certbot配置HTTPS（同方案一步骤5）。

---

## 快速部署脚本

创建一个部署脚本 `deploy.sh`：

```bash
#!/bin/bash

# 配置变量
SERVER_USER="your-username"
SERVER_HOST="your-server.com"
SERVER_PATH="/var/www/eslatin"
DOMAIN="your-domain.com"

echo "开始构建..."
pnpm install
NODE_ENV=production pnpm build

echo "上传文件到服务器..."
rsync -avz --delete ./out/ ${SERVER_USER}@${SERVER_HOST}:${SERVER_PATH}/

echo "重启Nginx..."
ssh ${SERVER_USER}@${SERVER_HOST} "sudo systemctl reload nginx"

echo "部署完成！"
echo "访问: https://${DOMAIN}"
```

使用：

```bash
chmod +x deploy.sh
./deploy.sh
```

---

## 验证HTTPS配置

### 1. 检查SSL证书

```bash
# 在服务器上检查
sudo certbot certificates

# 在线检查
# 访问: https://www.ssllabs.com/ssltest/analyze.html?d=your-domain.com
```

### 2. 测试HTTPS访问

```bash
# 测试HTTP重定向
curl -I http://your-domain.com

# 测试HTTPS
curl -I https://your-domain.com
```

### 3. 检查安全头

```bash
curl -I https://your-domain.com | grep -i "strict-transport-security"
```

---

## 常见问题

### 1. 证书续期失败

```bash
# 手动续期
sudo certbot renew

# 查看日志
sudo tail -f /var/log/letsencrypt/letsencrypt.log
```

### 2. Nginx配置错误

```bash
# 测试配置
sudo nginx -t

# 查看错误日志
sudo tail -f /var/log/nginx/error.log
```

### 3. 文件权限问题

```bash
# 设置正确的权限
sudo chown -R www-data:www-data /var/www/eslatin
sudo chmod -R 755 /var/www/eslatin
```

### 4. 防火墙配置

```bash
# 允许HTTP和HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw reload
```

---

## 维护和更新

### 更新网站内容

1. 在本地修改代码
2. 运行 `pnpm build`
3. 使用rsync上传到服务器
4. 重启Nginx（如果需要）

### 监控和日志

```bash
# 查看Nginx访问日志
sudo tail -f /var/log/nginx/access.log

# 查看Nginx错误日志
sudo tail -f /var/log/nginx/error.log

# 查看PM2日志（如果使用方案二）
pm2 logs eslatin
```

---

## 安全建议

1. ✅ 使用HTTPS（已完成）
2. ✅ 启用HSTS（Strict-Transport-Security）
3. ✅ 定期更新系统和软件包
4. ✅ 配置防火墙规则
5. ✅ 使用强密码和SSH密钥认证
6. ✅ 定期备份网站文件
7. ✅ 监控SSL证书到期时间

---

## 总结

- **方案一（静态部署）**：适合大多数情况，性能好，维护简单
- **方案二（Node.js部署）**：需要SSR功能时使用

推荐使用**方案一**，配置简单，性能优秀，HTTPS通过Let's Encrypt免费获取。

