import {readFile} from 'node:fs/promises'
import {parseYAML} from 'confbox/yaml'
import {createObjectPrompt} from '@github/models/prompt'
import {generateObject} from 'ai'
import 'dotenv/config'

const promptFile = parseYAML(await readFile('./teacher.prompt.yml', 'utf8'))
const prompt = createObjectPrompt(promptFile)

const result = await generateObject(
  prompt({
    subject: 'balloon popping',
  }),
)

console.log('Object:')
console.log(result.object)
console.log()

console.log('Token usage:', result.usage)
console.log('Finish reason:', result.finishReason)
