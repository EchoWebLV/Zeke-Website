import { NextResponse } from 'next/server'
import OAuth from 'oauth-1.0a'
import crypto from 'crypto'

const TWITTER_USERNAME = 'ZekePrivacy'

// Force dynamic rendering - don't cache this route statically
export const dynamic = 'force-dynamic'
export const revalidate = 0

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
    cache: 'no-store', // Ensure fresh data from Twitter API
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

  try {
    console.log('Fetching fresh tweets from API...')
    const data = await fetchTweetsFromAPI()
    
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
      }
    })
  } catch (error) {
    console.error('Twitter API error:', error)
    
    return NextResponse.json(
      { error: 'Failed to fetch tweets', details: String(error) },
      { status: 500 }
    )
  }
}
