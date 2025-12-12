# NapLink Documentation

> NapLink SDK 官方文档站点（基于 VitePress）

## 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建
npm run build

# 预览构建结果
npm run preview
```

## 目录结构

```
docs/
├── .vitepress/
│   └── config.ts      # VitePress 配置
├── guide/             # 指南文档
│   ├── index.md       # 简介
│   ├── getting-started.md
│   ├── configuration.md
│   └── ...
├── api/               # API 文档
│   ├── index.md
│   ├── naplink.md
│   └── ...
└── index.md           # 首页
```

## 部署

文档会自动部署到 GitHub Pages。

## 许可证

MIT
