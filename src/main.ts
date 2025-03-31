#!/usr/bin/env node

import { defineCommand, runMain } from "citty"
import consola from "consola"
import { serve, type ServerHandler } from "srvx"

import { cacheModels } from "./lib/models"
import { ensurePaths } from "./lib/paths"
import { state } from "./lib/state"
import { setupCopilotToken, setupGitHubToken } from "./lib/token"
import { cacheVSCodeVersion } from "./lib/vscode-version"
import { server } from "./server"
import { DEFAULT_API_KEY_OPTIONS, enableApiKey, generateApiKey, readApiKey } from "./lib/api-key"

interface RunServerOptions {
  port: number
  verbose: boolean
  business: boolean
  manual: boolean
  rateLimit: number | undefined
  rateLimitWait: boolean
  host: string
  apiKey: boolean
  generateKey: boolean
}

export async function runServer(options: RunServerOptions): Promise<void> {
  if (options.verbose) {
    consola.level = 5
    consola.info("Verbose logging enabled")
  }

  if (options.business) {
    state.accountType = "business"
    consola.info("Using business plan GitHub account")
  }

  state.manualApprove = options.manual
  state.rateLimitSeconds = options.rateLimit
  state.rateLimitWait = options.rateLimitWait

  await ensurePaths()
  await cacheVSCodeVersion()
  
  // API Key处理
  if (options.generateKey) {
    const key = await generateApiKey()
    consola.success(`API Key已生成: ${key}`)
    consola.info("API Key认证已自动启用")
    process.exit(0)
  }

  // 读取API Key配置
  state.apiKeyOptions = await readApiKey() || DEFAULT_API_KEY_OPTIONS
  
  // 根据命令行参数启用/禁用API Key
  if (options.apiKey !== state.apiKeyOptions.enabled) {
    await enableApiKey(options.apiKey)
    state.apiKeyOptions.enabled = options.apiKey
  }
  
  if (state.apiKeyOptions.enabled && state.apiKeyOptions.key) {
    consola.success("API Key认证已启用")
  }
  
  await setupGitHubToken()
  await setupCopilotToken()
  await cacheModels()

  const hostDisplay = options.host === "0.0.0.0" ? "all interfaces" : options.host
  const serverUrl = `http://${hostDisplay}:${options.port}`
  consola.box(`Server started at ${serverUrl}`)

  serve({
    fetch: server.fetch as ServerHandler,
    port: options.port,
    hostname: options.host, // 添加hostname配置，使服务器监听指定主机
  })
}

const main = defineCommand({
  args: {
    port: {
      alias: "p",
      type: "string",
      default: "4141",
      description: "Port to listen on",
    },
    host: {
      alias: "h",
      type: "string",
      default: "0.0.0.0", // 默认监听所有IP
      description: "Host to listen on (default: 0.0.0.0 - all addresses)",
    },
    verbose: {
      alias: "v",
      type: "boolean",
      default: false,
      description: "Enable verbose logging",
    },
    business: {
      type: "boolean",
      default: false,
      description: "Use a business plan GitHub Account",
    },
    manual: {
      type: "boolean",
      default: false,
      description: "Enable manual request approval",
    },
    "rate-limit": {
      alias: "r",
      type: "string",
      description: "Rate limit in seconds between requests",
    },
    wait: {
      alias: "w",
      type: "boolean",
      default: false,
      description:
        "Wait instead of error when rate limit is hit. Has no effect if rate limit is not set",
    },
    "api-key": {
      alias: "k",
      type: "boolean",
      default: false,
      description: "Enable API Key authentication",
    },
    "generate-key": {
      alias: "g",
      type: "boolean",
      default: false,
      description: "Generate a new API Key and exit",
    },
  },
  run({ args }) {
    const rateLimitRaw = args["rate-limit"]
    const rateLimit =
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      rateLimitRaw === undefined ? undefined : Number.parseInt(rateLimitRaw, 10)

    const port = Number.parseInt(args.port, 10)

    return runServer({
      port,
      verbose: args.verbose,
      business: args.business,
      manual: args.manual,
      rateLimit,
      rateLimitWait: Boolean(args.wait),
      host: args.host,
      apiKey: Boolean(args["api-key"]),
      generateKey: Boolean(args["generate-key"]),
    })
  },
})

await runMain(main)
