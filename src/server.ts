import { Hono } from "hono"
import { cors } from "hono/cors"
import { logger } from "hono/logger"

import { completionRoutes } from "./routes/chat-completions/route"
import { embeddingRoutes } from "./routes/embeddings/route"
import { modelRoutes } from "./routes/models/route"
import { apiKeyAuth } from "./lib/middleware/auth"

export const server = new Hono()

server.use(logger())
server.use(cors())

server.get("/", (c) => c.text("Server running"))

// 将API KEY验证中间件应用到所有API路由
server.use("/chat/completions/*", apiKeyAuth)
server.use("/models/*", apiKeyAuth)
server.use("/embeddings/*", apiKeyAuth)

server.route("/chat/completions", completionRoutes)
server.route("/models", modelRoutes)
server.route("/embeddings", embeddingRoutes)

// Compatibility with tools that expect v1/ prefix
// 同样为v1前缀路由添加认证中间件
server.use("/v1/chat/completions/*", apiKeyAuth)
server.use("/v1/models/*", apiKeyAuth)
server.use("/v1/embeddings/*", apiKeyAuth)

server.route("/v1/chat/completions", completionRoutes)
server.route("/v1/models", modelRoutes)
server.route("/v1/embeddings", embeddingRoutes)
