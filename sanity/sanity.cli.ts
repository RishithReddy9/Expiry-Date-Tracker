import { defineCliConfig } from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: '6snf0jry',
    dataset: 'production'
  }
})

console.log(process.env.SANITY_PROJECT_ID)