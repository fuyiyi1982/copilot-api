import type { ModelsResponse } from "~/services/copilot/get-models"
import type { ApiKeyOptions } from "./api-key"

export interface State {
  githubToken?: string
  copilotToken?: string

  accountType: string
  models?: ModelsResponse
  vsCodeVersion?: string

  manualApprove: boolean
  rateLimitWait: boolean

  // Rate limiting configuration
  rateLimitSeconds?: number
  lastRequestTimestamp?: number
  
  // API Key configuration
  apiKeyOptions?: ApiKeyOptions
}

export const state: State = {
  accountType: "individual",
  manualApprove: false,
  rateLimitWait: false,
}
