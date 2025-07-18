import {defineConfig} from 'tsup'

export default defineConfig([
  {
    entry: {
      index: 'src/index.ts',
      prompt: 'src/prompt.ts',
    },
    format: ['esm'],
    dts: true,
    sourcemap: true,
  },
])
