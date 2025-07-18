# AI SDK - GitHub Models

The GitHub Models provider for the [AI SDK](https://ai-sdk.dev/docs) gives you access to the [GitHub Models][feature] catalog of large language models, designed for building modern web applications.
GitHub Models has support for multiple model families, like [xAI](https://github.com/marketplace?publisher=xAI&type=models), [OpenAI](https://github.com/marketplace?publisher=OpenAI&type=models) and [Meta](https://github.com/marketplace?publisher=Meta&type=models).

## Setup

The GitHub Models provider is available in the `@github/models` NPM package. You can install it with:

```bash
npm i @github/models
```

## Quick Start

To get started, you'll need a [GitHub PAT (personal access token)](https://github.com/settings/tokens).

```ts
import {githubModels} from '@github/models'
import {generateText} from 'ai'

const result = await generateText({
  model: githubModels('meta/meta-llama-3.1-8b-instruct'),
  prompt: 'Write a haiku about programming.',
})

console.log(result.text)
```

> [!TIP]
> GitHub Models includes [free usage](https://gh.io/models-rate-limits) for all accounts. For higher usage limits, you can opt into [paid usage](https://gh.io/github-models-pricing).

If you need a customized setup, you can import `createGithubModels` from `@github/models` and create a provider instance with your settings:

```ts
import {createGithubModels} from '@github/models'

const githubModels = createGithubModels({
  org: 'my-organization',
})
```

### Configuration Options

- **apiKey** _string_

  Your GitHub [Personal Access Token](https://github.com/settings/tokens) or [Fine-Grained Token](https://github.com/settings/personal-access-tokens) with `read:models` scope.
  Defaults to the `GITHUB_TOKEN` environment variable.

- **org** _string_

  Organization to attribute API usage to (optional).

- **baseURL** _string_

  Custom API endpoint URL.
  Defaults to `https://models.github.ai/inference`.

- **headers** _Record<string, string>_

  Additional headers to include with requests.

- **fetch** _(input: RequestInfo, init?: RequestInit) => Promise<Response>_

  Custom [fetch](https://developer.mozilla.org/en-US/docs/Web/API/fetch) implementation.
  Defaults to the global `fetch` function.
  You can use it as a middleware to intercept requests,
  or to provide a custom fetch implementation for e.g. testing.

## Prompt Management

The `@github/models/prompt` sub-module provides a powerful way to integrate with AI SDK methods like `generateText` and `generateObject` using your `prompt.yml` files.
Prompt YAML files are designed to create reusable artifacts that integrate with GitHub's suite of AI tools. Check out the [Models tab](https://github.com/github/models-ai-sdk/models).

### Example

Create a `.prompt.yml` file:

```yaml
name: teacher
description: An elementary school teacher who explains concepts simply
model: openai/gpt-4o
modelParameters:
  temperature: 0.7
  maxTokens: 500
messages:
  - role: system
    content: You're an elementary school teacher who loves making learning fun.
  - role: user
    content: Explain {{subject}} in exactly {{sentences}} sentences for a 10-year-old.
```

Use `createTextPrompt` for text-based responses:

```ts
import {readFile} from 'node:fs/promises'
import {parseYAML} from 'confbox/yaml'
import {createTextPrompt} from '@github/models/prompt'
import {generateText} from 'ai'

const config = parseYAML(await readFile('./teacher.prompt.yml', 'utf8'))
const prompt = createTextPrompt(config)

const result = await generateText(
  prompt({
    subject: 'photosynthesis',
    sentences: '5',
  }),
)

console.log(result.text)
```

<details><summary>Structured Generation</summary>

Use `createObjectPrompt` for JSON responses with schema validation:

```yaml
name: recipe-generator
model: openai/gpt-4o
responseFormat: json_schema
jsonSchema: |-
  {
    "name": "recipe",
    "strict": true,
    "schema": {
      "type": "object",
      "properties": {
        "title": {"type": "string"},
        "ingredients": {
          "type": "array",
          "items": {"type": "string"}
        },
        "instructions": {
          "type": "array",
          "items": {"type": "string"}
        }
      },
      "required": ["title", "ingredients", "instructions"],
      "additionalProperties": false
    }
  }
messages:
  - role: user
    content: Create a recipe for {{dish}} that serves {{servings}} people.
```

```ts
import {createObjectPrompt} from '@github/models/prompt'
import {generateObject} from 'ai'

const config = parseYAML(await readFile('./recipe.prompt.yml', 'utf8'))
const prompt = createObjectPrompt(config)

const result = await generateObject(
  prompt({
    dish: 'chocolate chip cookies',
    servings: '4',
  }),
)

console.log(result.object.title)
console.log(result.object.ingredients)
```

</details>

## API Reference

The GitHub Models provider uses the [GitHub Models Inference API](https://docs.github.com/en/rest/models/inference?apiVersion=2022-11-28#run-an-inference-request).

## License

Distributed under the MIT License. See [LICENSE](./license.txt) for more information.

<!-- LINKS -->

[feature]: https://github.com/features/models
