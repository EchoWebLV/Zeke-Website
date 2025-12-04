import { NextResponse } from 'next/server'
import OAuth from 'oauth-1.0a'
import crypto from 'crypto'
import fs from 'fs'
import path from 'path'

const TWITTER_USERNAME = 'ZekePrivacy'
const CACHE_FILE = path.join(process.cwd(), '.tweet-cache.json')
const CACHE_DURATION = 30 * 60 * 1000 // 30 minutes

// OAuth 1.0a setup
const oauth = new OAuth({
  consumer: {
    key: process.env.X_API_KEY!,
    secret: process.env.X_API_SECRET!,
  },
  signature_method: 'HMAC-SHA1',
  hash_function(base_string, key) {
    return crypto.createHmac('sha1', key).update(base_string).digest('base64')
  },
})

const token = {
  key: process.env.X_ACCESS_TOKEN!,
  secret: process.env.X_ACCESS_SECRET!,
}

// File-based cache functions
function getCache(): { data: any; timestamp: number } | null {
  try {
    if (fs.existsSync(CACHE_FILE)) {
      const content = fs.readFileSync(CACHE_FILE, 'utf-8')
      return JSON.parse(content)
    }
  } catch (error) {
    console.error('Error reading cache:', error)
  }
  return null
}

function setCache(data: any): void {
  try {
    const cache = { data, timestamp: Date.now() }
    fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2))
    console.log('Cache updated at', new Date().toISOString())
  } catch (error) {
    console.error('Error writing cache:', error)
  }
}

function isCacheValid(cache: { data: any; timestamp: number } | null): boolean {
  if (!cache) return false
  return Date.now() - cache.timestamp < CACHE_DURATION
}

async function makeRequest(url: string) {
  const requestData = {
    url,
    method: 'GET',
  }

  const headers = oauth.toHeader(oauth.authorize(requestData, token))

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      ...headers,
      'Content-Type': 'application/json',
    },
  })

  return response
}

async function fetchTweetsFromAPI() {
  // First, get the user ID from username
  const userUrl = `https://api.twitter.com/2/users/by/username/${TWITTER_USERNAME}?user.fields=profile_image_url,name,username`
  const userResponse = await makeRequest(userUrl)

  if (!userResponse.ok) {
    const error = await userResponse.text()
    throw new Error(`User fetch error: ${userResponse.status} ${error}`)
  }

  const userData = await userResponse.json()
  const userId = userData.data?.id

  if (!userId) {
    throw new Error('User not found')
  }

  // Then fetch the user's tweets
  const tweetsUrl = `https://api.twitter.com/2/users/${userId}/tweets?max_results=5&tweet.fields=created_at,public_metrics,text&expansions=attachments.media_keys&media.fields=url,preview_image_url,type`
  const tweetsResponse = await makeRequest(tweetsUrl)

  if (!tweetsResponse.ok) {
    const error = await tweetsResponse.text()
    throw new Error(`Tweets fetch error: ${tweetsResponse.status} ${error}`)
  }

  const tweetsData = await tweetsResponse.json()

  // Combine user and tweets data (limit to 4 tweets)
  return {
    user: {
      id: userData.data.id,
      name: userData.data.name,
      username: userData.data.username,
      profile_image_url: userData.data.profile_image_url,
    },
    tweets: (tweetsData.data || []).slice(0, 4),
    media: tweetsData.includes?.media || [],
    cachedAt: new Date().toISOString(),
  }
}

export async function GET() {
  // Check if API is configured
  if (!process.env.X_API_KEY || !process.env.X_API_SECRET || 
      !process.env.X_ACCESS_TOKEN || !process.env.X_ACCESS_SECRET) {
    return NextResponse.json(
      { error: 'Twitter API not configured' },
      { status: 500 }
    )
  }

  // Check cache first
  const cache = getCache()
  
  if (isCacheValid(cache)) {
    console.log('Serving from cache (valid)')
    return NextResponse.json(cache!.data, {
      headers: {
        'X-Cache': 'HIT',
        'X-Cache-Age': String(Math.floor((Date.now() - cache!.timestamp) / 1000)),
      }
    })
  }

  // Cache expired or doesn't exist - fetch fresh data
  try {
    console.log('Fetching fresh tweets from API...')
    const data = await fetchTweetsFromAPI()
    
    // Update cache
    setCache(data)
    
    return NextResponse.json(data, {
      headers: {
        'X-Cache': 'MISS',
      }
    })
  } catch (error) {
    console.error('Twitter API error:', error)
    
    // If we have any cache (even expired), return it
    if (cache) {
      console.log('Serving stale cache due to API error')
      return NextResponse.json(cache.data, {
        headers: {
          'X-Cache': 'STALE',
          'X-Cache-Age': String(Math.floor((Date.now() - cache.timestamp) / 1000)),
        }
      })
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch tweets', details: String(error) },
      { status: 500 }
    )
  }
}
