require('dotenv').config()
const crypto = require('crypto')
const readline = require('readline')
const { createClient } = require('@supabase/supabase-js')

// generate signed 8-byte integer ID
function generateSigned64() {
  const buf = crypto.randomBytes(8)
  return buf.readBigInt64BE().toString()
}

const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL
const SUPABASE_KEY = process.env.REACT_APP_SUPABASE_SERVICE_ROLE
if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE in .env')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  global: {
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
    }
  }
})

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

async function ask(question) {
  return new Promise(resolve => rl.question(question, answer => resolve(answer.trim())))
}

async function main() {
  const title = await ask('Essay title: ')
  const content = await ask('Essay content: ')
  const tagsInput = await ask('Tags (comma separated): ')
  rl.close()

  const tags = tagsInput
    .split(',')
    .map(t => t.trim())
    .filter(Boolean)

  const id = generateSigned64()
  const created_at = new Date().toISOString()

  const { data, error } = await supabase
    .from('essays')
    .insert([{ id, title, content, tags, created_at }])

  if (error) {
    console.error('Insert error:', error)
    process.exit(1)
  }

  console.log('Essay uploaded with id:', data[0].id)
}

main()
  .catch(err => {
    console.error('Error:', err)
    process.exit(1)
  })
