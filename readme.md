# AI SDK - GitHub Models

The GitHub Models provider for the [AI SDK](https://ai-sdk.dev/docs) gives you access to the [GitHub Models][feature] catalog of large language models, designed for building modern web applications.
GitHub Models has support for multiple model families, like [xAI](https://github.com/marketplace?publisher=xAI&type=models), [OpenAI](https://github.com/marketplace?publisher=OpenAI&type=models) and [Meta](https://github.com/marketplace?publisher=Meta&type=models).

## Setup

The GitHub Models provider is available in the `@github/models` NPM package. You can install it with:

```bash
npm i @github/models
```

## Provider Instance

To get started, you'll need a [GitHub PAT (personal access token)](https://github.com/settings/tokens).

> [!TIP]
> If you want to use GitHub Models beyond the [free usage](https://gh.io/models-rate-limits) included in your account, you can choose to opt in to paid usage. For more information, visit the [pricing page](https://gh.io/github-models-pricing).

The GitHub Models provider instance is used to create model instances that call the [GitHub Models Inference API](https://docs.github.com/en/rest/models/inference?apiVersion=2022-11-28#run-an-inference-request).
Please find all the available models on the [models catalog](https://github.com/marketplace?type=models).

```ts
import {githubModels} from '@github/models'
```

#### Example

```ts
import {githubModels} from '@github/models'
import {generateText} from 'ai'

const {text} = await generateText({
  model: githubModels('meta/meta-llama-3.1-8b-instruct'),
  prompt: 'I want 100 words on how to inflate a balloon.',
})
```

If you need a customized setup, you can import `createGithubModels` from `@github/models` and create a provider instance with your settings:

```ts
import {createGithubModels} from '@github/models'

const githubModels = createGithubModels({
  org: 'my-org',
})
```

You can use the following optional settings to customize the GitHub Models provider instance:

- **org** _string_

  Set the organization that should be used to attribute inference.

- **baseURL** _string_

  Use a different URL prefix for API calls. The default prefix is `https://models.github.ai/inference`.

- **apiKey** _string_

  API key that is being sent using the `Authorization` header. Either a
  GitHub PAT [_(Personal Access Token)_](https://github.com/settings/tokens), or FGT [_(Fine-Grained Token)_](https://github.com/settings/personal-access-tokens) with the `read:models` scope.
  It defaults to the `GITHUB_TOKEN` environment variable.

- **headers** _Record&lt;string,string&gt;_

  Custom headers to include in the requests.

- **fetch** _(input: RequestInfo, init?: RequestInit) => Promise&lt;Response&gt;_

  Custom [fetch](https://developer.mozilla.org/en-US/docs/Web/API/fetch) implementation.
  Defaults to the global `fetch` function.
  You can use it as a middleware to intercept requests,
  or to provide a custom fetch implementation for e.g. testing.

## License

Distributed under the MIT license. See [LICENSE](./license.txt) for details.

<!-- LINKS -->

[feature]: https://github.com/features/models
