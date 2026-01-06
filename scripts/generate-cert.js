const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

const certsDir = path.join(__dirname, '..', 'certs')

// 创建certs目录
if (!fs.existsSync(certsDir)) {
  fs.mkdirSync(certsDir, { recursive: true })
}

console.log('🔐 正在生成自签名SSL证书...')
console.log('')

try {
  // 生成私钥
  console.log('1. 生成私钥...')
  execSync(
    `openssl genrsa -out "${path.join(certsDir, 'localhost-key.pem')}" 2048`,
    { stdio: 'inherit' }
  )

  // 生成证书签名请求配置
  const csrConfig = `
[req]
default_bits = 2048
prompt = no
default_md = sha256
distinguished_name = dn
req_extensions = v3_req

[dn]
C=CN
ST=State
L=City
O=Organization
CN=localhost

[v3_req]
basicConstraints = CA:FALSE
keyUsage = nonRepudiation, digitalSignature, keyEncipherment
subjectAltName = @alt_names

[alt_names]
DNS.1 = localhost
DNS.2 = *.localhost
IP.1 = 127.0.0.1
IP.2 = ::1
`

  const csrConfigPath = path.join(certsDir, 'csr.conf')
  fs.writeFileSync(csrConfigPath, csrConfig)

  // 生成证书
  console.log('2. 生成证书...')
  execSync(
    `openssl req -new -x509 -key "${path.join(certsDir, 'localhost-key.pem')}" -out "${path.join(certsDir, 'localhost.pem')}" -days 365 -config "${csrConfigPath}"`,
    { stdio: 'inherit' }
  )

  // 清理临时文件
  fs.unlinkSync(csrConfigPath)

  console.log('')
  console.log('✅ SSL证书生成成功！')
  console.log('')
  console.log('证书位置:')
  console.log(`  - 私钥: ${path.join(certsDir, 'localhost-key.pem')}`)
  console.log(`  - 证书: ${path.join(certsDir, 'localhost.pem')}`)
  console.log('')
  console.log('现在可以运行: npm run dev:https')
  console.log('')
} catch (error) {
  console.error('❌ 生成证书失败:', error.message)
  console.log('')
  console.log('请确保已安装 OpenSSL:')
  console.log('  macOS: brew install openssl')
  console.log('  Linux: sudo apt-get install openssl')
  console.log('  Windows: 下载并安装 OpenSSL for Windows')
  process.exit(1)
}

