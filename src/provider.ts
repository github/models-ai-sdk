import {OpenAICompatibleChatLanguageModel, OpenAICompatibleEmbeddingModel} from '@ai-sdk/openai-compatible'
import type {OpenAICompatibleChatConfig} from '@ai-sdk/openai-compatible/internal'
import {type EmbeddingModelV2, type LanguageModelV2, NoSuchModelError, type ProviderV2} from '@ai-sdk/provider'
import {type FetchFunction, loadApiKey, withoutTrailingSlash} from '@ai-sdk/provider-utils'

import type {GitHubModelsChatModelId, GitHubModelsEmbeddingModelId} from './model-id'

export interface GitHubModelsProviderOptions {
  /**
   Set the organization that should be used to attribute inference.
   */
  org?: string
  /**
  GitHub PAT (Personal Access Token), or FGT (Fine-Grained Token) with the `read:models` scope.
  */
  apiKey?: string
  /**
  Base URL for the API calls.
  */
  baseURL?: string
  /**
  Custom headers to include in the requests.
  */
  headers?: Record<string, string>
  /**
  Custom fetch implementation. You can use it as a middleware to intercept requests,
  or to provide a custom fetch implementation for e.g. testing.
  */
  fetch?: FetchFunction
}

export interface GitHubModelsProvider extends ProviderV2 {
  /**
  Creates a model for text generation.
  */
  (modelId: GitHubModelsChatModelId): LanguageModelV2

  /**
  Creates a language model for text generation.
  */
  languageModel(modelId: GitHubModelsChatModelId): LanguageModelV2

  /**
  Creates a language model for text embedding.
  */
  textEmbeddingModel(modelId: GitHubModelsEmbeddingModelId): EmbeddingModelV2<string>
}

export function createGitHubModels(options: GitHubModelsProviderOptions = {}): GitHubModelsProvider {
  const baseURL = withoutTrailingSlash(
    options.baseURL ?? `https://models.github.ai/${options.org ? `orgs/${options.org}/` : ''}inference`,
  )

  const getHeaders = () => ({
    Authorization: `Bearer ${loadApiKey({
      apiKey: options.apiKey,
      environmentVariableName: 'GITHUB_TOKEN',
      description: 'GitHub Models',
    })}`,
    ...options.headers,
  })

  const baseOptions = {
    provider: 'github-models',
    url: ({path}) => `${baseURL}${path}`,
    headers: getHeaders,
    fetch: options.fetch,
    includeUsage: true,
  } satisfies OpenAICompatibleChatConfig

  const createModel = (modelId: GitHubModelsChatModelId) => new OpenAICompatibleChatLanguageModel(modelId, baseOptions)

  const provider = (modelId: GitHubModelsChatModelId) => createModel(modelId)
  provider.languageModel = createModel

  provider.textEmbeddingModel = (modelId: GitHubModelsEmbeddingModelId) =>
    new OpenAICompatibleEmbeddingModel(modelId, baseOptions)

  provider.imageModel = (modelId: string) => {
    throw new NoSuchModelError({modelId, modelType: 'imageModel'})
  }

  return provider
}

export const githubModels = createGitHubModels()
