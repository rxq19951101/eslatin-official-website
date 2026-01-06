const { createServer } = require('https')
const { parse } = require('url')
const next = require('next')
const fs = require('fs')
const path = require('path')

const dev = process.env.NODE_ENV !== 'production'
const hostname = 'localhost'
const port = 3001  // 使用3001端口，避免与HTTP服务(3000)冲突

// 证书文件路径
const certPath = path.join(__dirname, 'certs')
const keyPath = path.join(certPath, 'localhost-key.pem')
const certFilePath = path.join(certPath, 'localhost.pem')

// 检查证书是否存在
if (!fs.existsSync(keyPath) || !fs.existsSync(certFilePath)) {
  console.log('⚠️  SSL证书不存在，正在生成...')
  console.log('   请运行: npm run generate-cert')
  console.log('   或: node scripts/generate-cert.js')
  process.exit(1)
}

// Next.js配置（注意：这里的port只用于内部，实际监听在下面的createServer中）
// 使用环境变量设置独立的构建目录，避免与HTTP服务冲突
process.env.NEXT_DIST_DIR = '.next-https'
const app = next({ 
  dev, 
  hostname
})
const handle = app.getRequestHandler()

app.prepare().then(() => {
  const httpsOptions = {
    key: fs.readFileSync(keyPath),
    cert: fs.readFileSync(certFilePath),
    // 添加SSL配置以提高兼容性
    minVersion: 'TLSv1.2',
    maxVersion: 'TLSv1.3',
    ciphers: [
      'ECDHE-RSA-AES128-GCM-SHA256',
      'ECDHE-ECDSA-AES128-GCM-SHA256',
      'ECDHE-RSA-AES256-GCM-SHA384',
      'ECDHE-ECDSA-AES256-GCM-SHA384',
    ].join(':'),
    honorCipherOrder: true,
  }

  createServer(httpsOptions, async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true)
      await handle(req, res, parsedUrl)
    } catch (err) {
      console.error('Error occurred handling', req.url, err)
      res.statusCode = 500
      res.end('internal server error')
    }
  }).listen(port, (err) => {
    if (err) throw err
    console.log(`> Ready on https://${hostname}:${port}`)
    console.log(`> HTTP服务运行在: http://${hostname}:3000`)
    console.log(`> HTTPS服务运行在: https://${hostname}:${port}`)
    console.log('> 注意: 浏览器可能会显示"不安全"警告，这是正常的（自签名证书）')
    console.log('> 点击"高级" → "继续访问"即可')
  })
})

