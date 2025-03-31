# Copilot API

⚠️ **仅供教育目的使用** ⚠️
本项目是GitHub Copilot API的反向工程实现，仅用于教育目的。它不受GitHub官方支持，不应在生产环境中使用。

[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/E1E519XS7W)

## 项目概述

围绕GitHub Copilot API的包装器，使其与OpenAI API兼容，从而可用于AI助手、本地界面和开发工具等其他工具。

## 演示

https://github.com/user-attachments/assets/7654b383-669d-4eb9-b23c-06d7aefee8c5

## 先决条件

- Bun (>= 1.2.x)
- 拥有Copilot订阅的GitHub账户（个人版或商业版）

## 安装

要安装依赖项，请运行：

```sh
bun install
```

## 使用Docker

构建镜像

```sh
docker build -t copilot-api .
```

运行容器

```sh
docker run -p 4141:4141 copilot-api
```

## 使用npx

您可以直接使用npx运行项目：

```sh
npx copilot-api@latest
```

使用选项：

```sh
npx copilot-api --port 8080
```

## 命令行选项

提供以下命令行选项：

| 选项         | 描述                            | 默认值   | 别名  |
| ------------ | ------------------------------- | -------- | ----- |
| --port       | 监听端口                        | 4141     | -p    |
| --host       | 监听主机                        | 0.0.0.0  | -h    |
| --verbose    | 启用详细日志                    | false    | -v    |
| --business   | 使用商业版GitHub账户            | false    | 无    |
| --manual     | 启用手动请求批准                | false    | 无    |
| --rate-limit | 请求之间的速率限制（秒）        | 无       | -r    |
| --wait       | 达到速率限制时等待而不是报错    | false    | -w    |
| --api-key    | 启用API密钥认证                 | false    | -k    |
| --generate-key | 生成新API密钥并退出           | false    | -g    |

使用示例：

```sh
# 在自定义端口上运行并启用详细日志记录
npx copilot-api@latest --port 8080 --verbose

# 使用商业版GitHub账户
npx copilot-api@latest --business

# 为每个请求启用手动批准
npx copilot-api@latest --manual

# 设置请求之间的速率限制为30秒
npx copilot-api@latest --rate-limit 30

# 达到速率限制时等待而不是报错
npx copilot-api@latest --rate-limit 30 --wait

# 启用API密钥认证
npx copilot-api@latest --api-key

# 生成新API密钥并启用认证
npx copilot-api@latest --generate-key
```

## 网络配置

### 主机和端口设置

默认情况下，服务器监听所有网络接口（`0.0.0.0`）和端口`4141`。这意味着：

- 服务器可以从您网络上的其他设备访问
- 您可以通过`http://localhost:4141`从同一台机器访问
- 您可以通过您机器的IP地址从其他设备访问

要更改这些设置：

```sh
# 仅监听localhost（不可从其他设备访问）
npx copilot-api --host 127.0.0.1

# 使用不同的端口
npx copilot-api --port 8080

# 组合主机和端口设置
npx copilot-api --host 127.0.0.1 --port 8080
```

## API密钥认证

为增加安全性，您可以启用API密钥认证来保护您的API端点。

### 生成和启用API密钥

```sh
# 生成新API密钥（自动启用认证）
npx copilot-api --generate-key
# 输出: API Key已生成: abcdef1234567890...

# 仅启用API密钥认证（使用现有密钥）
npx copilot-api --api-key
```

### 客户端使用API密钥

启用API密钥认证后，客户端必须使用以下方式之一在请求中包含密钥：

1. **Authorization头**：
   ```
   Authorization: Bearer YOUR_API_KEY
   ```

2. **查询参数**：
   ```
   http://your-server:4141/models?api_key=YOUR_API_KEY
   ```

### API密钥存储

API密钥存储在：`~/.local/share/copilot-api/api_key`

## 从源码运行

可以通过几种方式从源码运行项目：

### 开发模式

```sh
bun run dev
```

### 生产模式

```sh
bun run start
```

## 使用技巧

- 考虑使用免费模型（如Gemini、Mistral、Openrouter）作为`weak-model`
- 谨慎使用architect模式
- 在aider配置中禁用`yes-always`
- 注意Claude 3.7思考模式消耗更多令牌
- 启用`--manual`标志以在处理前审核和批准每个请求
- 如果您有带Copilot的GitHub商业账户，请使用`--business`标志

### 手动请求批准

使用`--manual`标志时，服务器将提示您批准每个传入的请求：

```
? Accept incoming request? › (y/N)
```

这有助于您控制使用情况并实时监控请求。

## 开发路线图

- [ ] 手动认证流程
- [x] 手动请求批准系统
- [x] 速率限制实现
- [x] 令牌计数
- [x] 增强的错误处理和恢复
