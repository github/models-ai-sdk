import {githubModels} from '@github/models'
import {generateText} from 'ai'
import 'dotenv/config'

const result = await generateText({
  model: githubModels('openai/gpt-4o'),
  prompt: 'I want 100 words on how to inflate a balloon.',
})

console.log('Text:')
console.log(result.text)
console.log()

console.log('Token usage:', result.usage)
console.log('Finish reason:', result.finishReason)
