import {describe, expect, test} from 'vitest'

import {createObjectPrompt, createTextPrompt} from './prompt'

describe('#createTextPrompt', () => {
  test('can create a text prompt', () => {
    const prompt = createTextPrompt(mockTextPrompt)
    expect(
      prompt({
        name: 'mona',
      }),
    ).toMatchObject({
      model: expect.anything(),
      messages: [
        {role: 'system', content: 'You are a helpful assistant.'},
        {role: 'user', content: 'Hello mona!'},
      ],
      temperature: 0.7,
    })
  })

  test('fails because responseFormat is not text', () => {
    expect(() => createTextPrompt(mockObjectPrompt)).toThrowError(/responseFormat must be "text"/)
  })
})

describe('createObjectPrompt', () => {
  test('can create a object prompt', () => {
    const prompt = createObjectPrompt(mockObjectPrompt)
    expect(
      prompt({
        name: 'mona',
      }),
    ).toMatchObject({
      model: expect.anything(),
      messages: [
        {role: 'system', content: 'You are a helpful assistant.'},
        {role: 'user', content: 'Hello mona!'},
      ],
      temperature: 0.7,
    })
  })

  test('fails because responseFormat is not json like', () => {
    expect(() => createObjectPrompt(mockTextPrompt)).toThrowError(/responseFormat must be either "json_object"/)
  })

  test('allows json_object without a schema', () => {
    const prompt = createObjectPrompt(mockJsonSchemaPrompt)
    expect(
      prompt({
        name: 'mona',
      }),
    ).toMatchObject({
      model: expect.anything(),
      messages: [
        {role: 'system', content: 'You are a helpful assistant.'},
        {role: 'user', content: 'Hello mona!'},
      ],
      temperature: 0.7,
      schema: expect.any(Object),
      schemaName: 'schema_name',
    })
  })
})

const mockTextPrompt = {
  model: 'abc-123',
  messages: [
    {role: 'system', content: 'You are a helpful assistant.'},
    {role: 'user', content: 'Hello {{name}}!'},
  ],
  modelParameters: {
    temperature: 0.7,
  },
}

const mockObjectPrompt = {
  model: 'abc-123',
  messages: [
    {role: 'system', content: 'You are a helpful assistant.'},
    {role: 'user', content: 'Hello {{name}}!'},
  ],
  modelParameters: {
    temperature: 0.7,
  },
  responseFormat: 'json_object',
}

const mockJsonSchemaPrompt = {
  model: 'abc-123',
  messages: [
    {role: 'system', content: 'You are a helpful assistant.'},
    {role: 'user', content: 'Hello {{name}}!'},
  ],
  modelParameters: {
    temperature: 0.7,
  },
  responseFormat: 'json_schema',
  jsonSchema: JSON.stringify({
    name: 'schema_name',
    schema: {},
  }),
}
