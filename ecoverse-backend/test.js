require('dotenv').config({ path: '../.env.local' })
const { createClient } = require('@supabase/supabase-js')

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  console.error('❌ ERROR: Missing Supabase credentials in .env.local')
  console.error('⚠️  Please update .env.local with:')
  console.error('   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co')
  console.error('   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here')
  process.exit(1)
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

async function test() {
  const { data, error } = await supabase
    .from('footprints')
    .insert([
      {
        user_id: 'test-user',
        type: 'car',
        carbon_footprint: 21
      }
    ])

  if (error) {
    console.log("ERROR:", error)
  } else {
    console.log({
      carbonFootprint: 21,
      equivalentTrees: 2
    })
  }
}

test()
