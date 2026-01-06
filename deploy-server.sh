#!/bin/bash

# 服务器部署脚本
# 使用方法: ./deploy-server.sh

# 配置变量 - 请根据实际情况修改
SERVER_USER="${SERVER_USER:-your-username}"
SERVER_HOST="${SERVER_HOST:-your-server.com}"
SERVER_PATH="${SERVER_PATH:-/var/www/eslatin}"
DOMAIN="${DOMAIN:-your-domain.com}"

echo "=========================================="
echo "开始部署到服务器..."
echo "=========================================="

# 检查必要的命令
command -v pnpm >/dev/null 2>&1 || { echo "错误: 需要安装 pnpm"; exit 1; }

# 步骤1: 安装依赖
echo ""
echo "步骤1: 安装依赖..."
pnpm install

# 步骤2: 构建（使用DEPLOY_TARGET=server）
echo ""
echo "步骤2: 构建静态文件（服务器模式）..."
DEPLOY_TARGET=server NODE_ENV=production pnpm build

# 检查构建是否成功
if [ ! -d "out" ]; then
    echo "错误: 构建失败，out目录不存在"
    exit 1
fi

# 步骤3: 上传文件
echo ""
echo "步骤3: 上传文件到服务器..."
echo "目标: ${SERVER_USER}@${SERVER_HOST}:${SERVER_PATH}/"

# 检查rsync是否可用
if command -v rsync >/dev/null 2>&1; then
    rsync -avz --delete --progress ./out/ ${SERVER_USER}@${SERVER_HOST}:${SERVER_PATH}/
else
    echo "警告: rsync不可用，使用scp..."
    ssh ${SERVER_USER}@${SERVER_HOST} "mkdir -p ${SERVER_PATH}"
    scp -r ./out/* ${SERVER_USER}@${SERVER_HOST}:${SERVER_PATH}/
fi

# 步骤4: 设置文件权限
echo ""
echo "步骤4: 设置文件权限..."
ssh ${SERVER_USER}@${SERVER_HOST} "sudo chown -R www-data:www-data ${SERVER_PATH} && sudo chmod -R 755 ${SERVER_PATH}"

# 步骤5: 重启Nginx
echo ""
echo "步骤5: 重启Nginx..."
ssh ${SERVER_USER}@${SERVER_HOST} "sudo nginx -t && sudo systemctl reload nginx"

echo ""
echo "=========================================="
echo "部署完成！"
echo "=========================================="
echo "网站地址: https://${DOMAIN}"
echo ""

