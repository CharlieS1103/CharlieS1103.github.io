require('dotenv').config()
const crypto = require('crypto')
// generate signed 8-byte integer ID
function generateSigned64() {
  const buf = crypto.randomBytes(8)
  return buf.readBigInt64BE().toString()
}
let fetch
try {
  fetch = require('node-fetch')
} catch {
  fetch = global.fetch
}
const readline = require('readline')
const { createClient } = require('@supabase/supabase-js')

const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL
const SUPABASE_KEY = process.env.REACT_APP_SUPABASE_SERVICE_ROLE
const OPENAI_KEY = process.env.REACT_APP_OPENAI_API_KEY

if (!SUPABASE_URL || !SUPABASE_KEY || !OPENAI_KEY) {
  console.error('Missing env vars. Check .env for SUPABASE and OpenAI keys.')
  process.exit(1)
}

// rebuild client with fetch polyfill and service‐role override
const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_KEY,
  {
    global: {
      fetch,                                       // use node-fetch
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
      }
    }
  }
)

async function getRedditPoems(limit = 100) {
  const sub = 'OCPoetry'
  const endpoints = [
    `https://www.reddit.com/r/${sub}/new.json?limit=${limit}`,
    `https://www.reddit.com/r/${sub}/hot.json?limit=${limit}`,
  ]
  let list = []
  for (const url of endpoints) {
    try {
      const res = await fetch(url)
      const body = await res.json()
      if (body.data?.children) {
        body.data.children.forEach(c => {
          const txt = c.data.selftext?.trim()
          if (txt && txt.length > 50 && txt.split('\n').filter(Boolean).length >= 3) {
            list.push({ title: c.data.title, author: c.data.author, text: txt })
          }
        })
      }
    } catch (_) { }
  }
  // dedupe by text
  const seen = new Set()
  list = list.filter(p => {
    if (seen.has(p.text)) return false
    seen.add(p.text)
    return true
  })
  return list
}



async function mimicPoem(original) {
  const prompt = `
Mimic the following poem's length, theme, and quirks/errors. Do not make it an exact replica, it should be a distinct work. 
Here is the poem:

${original}

Provide only the poem text:
`
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${OPENAI_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-4.1-mini', messages: [{ role: 'user', content: prompt }],
      temperature: 1.0,
    }),
  })
  const data = await res.json().catch(() => ({}))
  return data.choices?.[0]?.message?.content?.trim() ?? ''
}

async function main() {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
  const num = await new Promise(resolve => {
    rl.question('How many poems to generate? ', ans => {
      rl.close()
      const n = parseInt(ans, 10)
      resolve(isNaN(n) || n < 1 ? 1 : n)
    })
  })

  console.log(`Fetching source poems...`)
  const sources = await getRedditPoems()
  if (sources.length === 0) {
    console.error('No poems found on Reddit. Exiting.')
    return
  }

  for (let i = 0; i < num; i++) {
    const src = sources[Math.floor(Math.random() * sources.length)]
    console.log(`\n[${i+1}] Original by ${src.author}: "${src.title}"`)

    // attempt mimic, retry after 15s on empty
    let aiPoem = ''
    do {
      aiPoem = await mimicPoem(src.text)
      if (!aiPoem) {
        console.warn('Empty AI response, retrying in 15s...')
        await new Promise(r => setTimeout(r, 15000))
      }
    } while (!aiPoem)

    console.log(`AI Mimic:\n${aiPoem}\n`)


    {
      const { data: dup, error: dupErr } = await supabase
        .from('ai_poems')
        .select('id')
        .eq('text', aiPoem)
        .limit(1)
      if (dupErr) {
        console.error('DB check error:', dupErr)
      } else if (dup && dup.length) {
        console.log('Duplicate AI poem, skipping insert.')
        continue
      }
    }
    // generate signed 8-byte integer id
    const id = generateSigned64()

    // check if id already exists
    const { data: dup, error: dupErr } = await supabase
      .from('ai_poems')
      .select('id')
      .eq('id', id)
      .limit(1)
    if (dupErr) {
        console.error('DB check error:', dupErr)
        }

    if (dup && dup.length) {
        console.log('Duplicate AI poem id, skipping insert.')
        continue
        }

    const { data, error } = await supabase
      .from('ai_poems')
      .insert([{
        id,
        text: aiPoem,
        mimiced_author: src.author,
        created_at: new Date().toISOString()
      }])
    if (error) {
      console.error('Insert error:', error)
    } else {
      console.log('Poem inserted with id:', id)
    }
  }
    console.log('Done.')
}
main().catch(err => {
  console.error('Error:', err)
  process.exit(1)
})
