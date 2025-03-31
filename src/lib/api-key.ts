import fs from "node:fs/promises"
import crypto from "node:crypto"
import consola from "consola"
import { PATHS } from "./paths"

const API_KEY_PATH = `${PATHS.APP_DIR}/api_key`

export interface ApiKeyOptions {
  enabled: boolean
  key: string | null
}

export const DEFAULT_API_KEY_OPTIONS: ApiKeyOptions = {
  enabled: false,
  key: null,
}

export async function readApiKey(): Promise<ApiKeyOptions> {
  try {
    const content = await fs.readFile(API_KEY_PATH, "utf-8")
    return JSON.parse(content) as ApiKeyOptions
  } catch (error) {
    // 如果文件不存在或解析失败，返回默认配置
    return DEFAULT_API_KEY_OPTIONS
  }
}

export async function writeApiKey(options: ApiKeyOptions): Promise<void> {
  await fs.writeFile(API_KEY_PATH, JSON.stringify(options, null, 2))
  await fs.chmod(API_KEY_PATH, 0o600)
}

export async function generateApiKey(): Promise<string> {
  const key = crypto.randomBytes(32).toString("hex")
  await writeApiKey({ enabled: true, key })
  return key
}

export async function enableApiKey(enabled: boolean): Promise<void> {
  const options = await readApiKey()
  options.enabled = enabled
  await writeApiKey(options)
  
  if (enabled) {
    consola.success("API Key认证已启用")
    if (!options.key) {
      consola.warn("API Key未设置，请使用 --generate-key 选项生成")
    }
  } else {
    consola.info("API Key认证已禁用")
  }
}

export function validateApiKey(key: string | null, options: ApiKeyOptions): boolean {
  if (!options.enabled) return true
  if (!options.key) return true // 如果启用但未设置key，则不进行验证
  
  return options.key === key
}
