// generateFakeNews.js
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
const { createClient } = require('@supabase/supabase-js');
const readline = require('readline');

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseServiceKey = process.env.REACT_APP_SUPABASE_SERVICE_ROLE;
const openaiKey = process.env.REACT_APP_OPENAI_API_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  global: { headers: { apikey: supabaseServiceKey, Authorization: `Bearer ${supabaseServiceKey}` } }
});

async function generateFakeNews(realContent) {
  const prompt = `Create a fake news article based around the general events in this story, but fabricate much of the details, don't make it too outlandish for someone to believe if they were to read it uncarefully, but also make sure it's removed from the actual events described.:\n${realContent}`;
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${openaiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4.1-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.9,
    }),
  });

  const data = await res.json();
  console.log(data);
    if (data.error) {
        console.error('Error generating fake news:', data.error);
        return '';
    }
  return data.choices[0]?.message?.content.trim() || '';
}

async function main() {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  rl.question('Number of fake news articles to generate? ', async (num) => {
    const count = parseInt(num, 10) || 1;

    const realRes = await fetch(`https://newsapi.org/v2/top-headlines?country=us&apiKey=${process.env.REACT_APP_NEWSAPI_KEY}`);
    const realData = await realRes.json();
    // guard against missing articles array
    console.log(realData);
    if (!realData.articles || !Array.isArray(realData.articles) || realData.articles.length === 0) {
      console.error('No articles retrieved from NewsAPI');
      rl.close();
      process.exit(1);
    }

    for (let i = 0; i < count; i++) {
      const realArticle = realData.articles[Math.floor(Math.random() * realData.articles.length)]
      const fakeContent = await generateFakeNews(realArticle.content)
      // generate unique ID
      const id = generateSigned64()
      await supabase.from('fake_news').insert([{
        id,
        content: fakeContent,
        created_at: new Date().toISOString()
      }])
      console.log(`Inserted fake article ${i + 1}`)
    }
    rl.close();
  });
}

main();