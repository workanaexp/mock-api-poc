// Ensures that ".env.local" has VITE_USE_MSW=true.
// This runs before "npm run dev" via the "predev" script.

// Using CommonJS here on purpose so it works regardless of project "type".
const fs = require('fs')
const path = require('path')

const envPath = path.join(__dirname, '..', '.env.local')

let content = ''
if (fs.existsSync(envPath)) {
  content = fs.readFileSync(envPath, 'utf8')
}

// If VITE_USE_MSW is not present, append it as "true".
if (!content.includes('VITE_USE_MSW=')) {
  const needsNewline = content.length > 0 && !content.endsWith('\n')
  const line = 'VITE_USE_MSW=true\n'
  const nextContent = (needsNewline ? `${content}\n` : content) + line
  fs.writeFileSync(envPath, nextContent, 'utf8')
}

