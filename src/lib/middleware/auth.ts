import type { MiddlewareHandler } from "hono"
import { state } from "../state"

export const apiKeyAuth: MiddlewareHandler = async (c, next) => {
  if (!state.apiKeyOptions || !state.apiKeyOptions.enabled) {
    await next()
    return
  }

  const apiKey = c.req.header("Authorization") || c.req.query("api_key")

  let key: string | null = null
  if (apiKey) {
    // 处理 Bearer token 格式
    if (apiKey.startsWith("Bearer ")) {
      key = apiKey.substring(7)
    } else {
      key = apiKey
    }
  }

  if (!state.apiKeyOptions.key || state.apiKeyOptions.key === key) {
    await next()
    return
  }

  c.status(401)
  return c.json({
    error: {
      message: "Unauthorized: Invalid API key",
      type: "api_key_error",
    }
  })
}
