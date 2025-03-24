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

interface RunServerOptions {
  port: number
  verbose: boolean
  business: boolean
  manual: boolean
  rateLimit: number
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

  await ensurePaths()
  await cacheVSCodeVersion()
  await setupGitHubToken()
  await setupCopilotToken()
  await cacheModels()

  const serverUrl = `http://localhost:${options.port}`
  consola.box(`Server started at ${serverUrl}`)

  serve({
    fetch: server.fetch as ServerHandler,
    port: options.port,
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
    rateLimit: {
      alias: "r",
      type: "string",
      default: "5",
      description: "Rate limit in seconds between requests",
    },
  },
  run({ args }) {
    const port = Number.parseInt(args.port, 10)
    const rateLimit = Number.parseInt(args.rateLimit, 10)

    return runServer({
      port,
      verbose: args.verbose,
      business: args.business,
      manual: args.manual,
      rateLimit,
    })
  },
})

await runMain(main)
