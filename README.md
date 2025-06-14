# 中文汉字复习工具

## 项目概述
帮助用户通过动画演示复习汉字书写的工具，支持多行输入和动画控制功能。

### 核心功能
- 汉字书写动画展示
- 多行文本输入处理
- 播放/暂停控制
- 不支持的汉字检测

### 技术栈
- React + Vite
- Hanzi Writer
- React Spring

## 安装与运行
```bash
git clone https://github.com/your-username/chinese-character-review.git
cd chinese-character-review
npm install
npm run dev
```

## 使用说明
1. 在输入框中输入中文文本（每行一个汉字或词语）
2. 点击"生成复习动画"按钮
3. 查看生成的汉字动画
4. 使用控制按钮：
   - 单个汉字：播放/暂停/重置
   - 整行汉字：播放/暂停

## 项目结构
```
src/
├── App.jsx         # 主应用组件
├── index.jsx       # 应用入口
├── components/
│   ├── HanziWriter.jsx   # 汉字动画组件
│   └── InputPanel.jsx    # 用户输入组件
```

## 部署指南
参考项目中的 [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) 文件

## 贡献指南
欢迎通过以下方式贡献项目：
1. 提交issue报告问题
2. Fork仓库并提交Pull Request
3. 遵循现有代码风格

## 许可证
MIT License