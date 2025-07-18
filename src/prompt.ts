import type {ProviderV2} from '@ai-sdk/provider'
import {jsonSchema} from '@ai-sdk/provider-utils'
import templite from 'templite'
import invariant from 'tiny-invariant'
import {z} from 'zod/v4'

import {githubModels} from './provider'

type Variables = Record<string, string | number | boolean>

export function createTextPrompt(config: unknown, provider?: ProviderV2) {
  const p = schema.parse(config)
  if (p.responseFormat) invariant(p.responseFormat === 'text', 'responseFormat must be "text" to generate text')

  provider ||= githubModels

  const model = provider.languageModel(p.model)

  return <V extends Variables>(variables: V) => {
    return {
      model,
      messages: messages(p, variables),
      ...settings(p),
    } as const
  }
}

export function createObjectPrompt(config: unknown, provider?: ProviderV2) {
  const p = schema.parse(config)
  invariant(
    p.responseFormat === 'json_object' || p.responseFormat === 'json_schema',
    'responseFormat must be either "json_object" or "json_schema" to generate objects',
  )

  provider ||= githubModels
  const model = provider.languageModel(p.model)

  let schemaProperties = {}
  if (p.responseFormat === 'json_schema' && p.jsonSchema) {
    const jSchema = JSON.parse(p.jsonSchema)
    schemaProperties = {
      output: undefined,
      schema: jsonSchema(jSchema.schema),
      schemaName: jSchema.name,
      schemaDescription: jSchema.description,
    }
  }

  return <V extends Variables>(variables: V) => {
    return {
      model,
      messages: messages(p, variables),
      output: 'no-schema',
      ...schemaProperties,
      ...settings(p),
    } as const
  }
}

// ---

function messages<V extends Variables>(config: Schema, variables: V) {
  const msgs = [] as Message[]
  for (const msg of config.messages) {
    msgs.push({
      role: msg.role,
      content: templite(msg.content, variables),
    })
  }
  return msgs
}

function settings(config: Schema) {
  return {
    maxOutputTokens: config.modelParameters?.maxTokens,
    temperature: config.modelParameters?.temperature,
    topP: config.modelParameters?.topP,
  } as const
}

const message = z.discriminatedUnion('role', [
  z.object({role: z.literal('user'), content: z.string()}),
  z.object({role: z.literal('system'), content: z.string()}),
])

type Message = z.infer<typeof message>

const schema = z
  .object({
    name: z.string().optional(),
    description: z.string().optional(),
    model: z.string(),
    modelParameters: z
      .object({
        maxTokens: z.number().positive().optional(),
        temperature: z.number().min(0).max(1).optional(),
        topP: z.number().min(0).max(1).optional(),
      })
      .optional(),
    messages: z.array(message),
    responseFormat: z.enum(['text', 'json_object', 'json_schema']).optional(),
    jsonSchema: z.string().optional(),
  })
  .refine(
    data => {
      if (data.responseFormat === 'json_schema') {
        return data.jsonSchema !== undefined
      }
      return true
    },
    {
      message: "jsonSchema must be provided when responseFormat is 'json_schema'",
      path: ['jsonSchema'],
    },
  )

type Schema = z.infer<typeof schema>
