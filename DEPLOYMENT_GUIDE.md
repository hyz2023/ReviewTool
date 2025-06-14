# 中文错别字复习工具部署指南

## 基础环境配置
```bash
# 更新系统
sudo apt update && sudo apt upgrade -y

# 安装Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install nodejs -y

# 安装Nginx
sudo apt install nginx -y

# 安装Git
sudo apt install git -y
```

## 部署应用
```bash
# 克隆代码
git clone https://github.com/你的用户名/ReviewTool.git
cd ReviewTool

# 安装依赖
npm install

# 构建生产包（Vite输出到dist目录）
npm run build
```

## Nginx配置
```bash
sudo nano /etc/nginx/sites-available/reviewtool
```

```nginx
server {
    listen 80;
    server_name 你的域名或IP;
    root /root/ReviewTool/dist;  # Vite构建输出目录
    
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

```bash
# 启用配置
sudo ln -s /etc/nginx/sites-available/reviewtool /etc/nginx/sites-enabled
sudo nginx -t
sudo systemctl reload nginx
```

## 防火墙配置
```bash
sudo ufw allow 80
sudo ufw allow 22
sudo ufw enable
```

## 权限配置（关键步骤）
```bash
# 更改dist目录所有权（解决500错误）
sudo chown -R www-data:www-data /root/ReviewTool/dist
sudo chmod -R 755 /root/ReviewTool/dist

# 或者移动项目到标准位置（推荐）
sudo mkdir -p /var/www/reviewtool
sudo cp -r /root/ReviewTool/dist/* /var/www/reviewtool/
sudo chown -R www-data:www-data /var/www/reviewtool
sudo chmod -R 755 /var/www/reviewtool

# 更新Nginx配置中的root路径
sudo nano /etc/nginx/sites-available/reviewtool
# 修改为：root /var/www/reviewtool;
```

## 访问应用
浏览器打开：`http://服务器IP地址`

## 验证部署
1. 本地测试：
```bash
# 在服务器上测试本地访问
curl http://localhost
```

2. 外部访问：
   - 打开浏览器访问 `http://<your_server_ip>`
   - 应看到应用主界面
   - 检查控制台无错误（F12打开开发者工具）

3. 自动化测试：
```bash
# 检查HTTP响应状态
curl -I http://localhost
# 应返回 200 OK
```

## 更新应用
```bash
cd ReviewTool
git pull
npm install
npm run build

# 复制新文件到Web目录
sudo cp -r dist/* /var/www/reviewtool/

# 确保权限正确
sudo chown -R www-data:www-data /var/www/reviewtool
sudo systemctl reload nginx
```

## 高级配置

### 启用HTTPS
1. 安装Certbot：
```bash
sudo apt install certbot python3-certbot-nginx
```

2. 获取证书：
```bash
sudo certbot --nginx -d your-domain.com
```

3. 自动续期测试：
```bash
sudo certbot renew --dry-run
```

### 配置防火墙
```bash
# 允许HTTPS
sudo ufw allow 'Nginx Full'
sudo ufw delete allow 'Nginx HTTP'

# 验证规则
sudo ufw status
```

## 其他部署方案
### GitHub Pages
1. 安装gh-pages: `npm install gh-pages --save-dev`
2. package.json添加:
```json
"homepage": "https://<username>.github.io/<repo-name>",
"scripts": {
  "predeploy": "npm run build",
  "deploy": "gh-pages -d dist"  # Vite输出目录
}
```
3. 部署: `npm run deploy`

### Vercel
1. 注册vercel.com
2. 导入GitHub仓库
3. 构建命令: `npm run build`
4. 输出目录: `dist`
## 高级配置

### 启用HTTPS
1. 安装Certbot：
```bash
sudo apt install certbot python3-certbot-nginx
```

2. 获取证书：
```bash
sudo certbot --nginx -d your-domain.com
```

3. 自动续期测试：
```bash
sudo certbot renew --dry-run
```

### 配置防火墙
```bash
# 允许HTTPS
sudo ufw allow 'Nginx Full'
sudo ufw delete allow 'Nginx HTTP'

# 验证规则
sudo ufw status
```

## 故障排除

### 检查Nginx错误日志
```bash
sudo tail -f /var/log/nginx/error.log
```

### 常见错误解决方案

#### 500 Internal Server Error
1. **文件权限问题**：
   ```bash
   # 检查整个目录树权限
   namei -l /var/www/reviewtool/
   
   # 递归修复权限
   sudo chown -R www-data:www-data /var/www/reviewtool
   sudo chmod -R 755 /var/www/reviewtool
   ```

2. **Nginx配置错误**：
   ```bash
   # 测试Nginx配置
   sudo nginx -t
   
   # 重新加载配置
   sudo systemctl reload nginx
   ```

3. **应用构建失败**：
   ```bash
   # 检查构建过程
   npm run build -- --debug
   
   # 确保dist目录存在
   ls -l dist
   ```

#### 403 Forbidden
1. 检查目录索引设置
2. 确认index.html文件存在
3. 验证SELinux状态（如果启用）

### 资源监控
```bash
# 实时监控服务器资源
top

# 检查磁盘空间
df -h

# 检查内存使用
free -m
```

### 获取更多帮助
如问题仍未解决，请提供以下信息：
1. Nginx错误日志片段
2. 执行`ls -l /var/www/reviewtool`的输出
3. 执行`nginx -T`的输出（完整Nginx配置）
## 最终检查清单
部署完成后请验证：
- [ ] 通过`curl -I http://localhost`返回200状态
- [ ] 浏览器访问无控制台错误
- [ ] `sudo nginx -t`配置测试通过
- [ ] 错误日志`/var/log/nginx/error.log`无报错

> 提示：执行以下命令快速验证部署：
```bash
echo "部署验证命令包：" && \
echo "1. 本地访问测试: curl -I http://localhost" && \
echo "2. 文件权限检查: namei -l /var/www/reviewtool | grep 'www-data'" && \
echo "3. 进程状态: systemctl status nginx --no-pager" && \
echo "4. 最新错误: sudo tail -n 20 /var/log/nginx/error.log"
```

**部署成功标志**：浏览器访问服务器IP应显示应用界面，并能正常进行汉字复习操作。