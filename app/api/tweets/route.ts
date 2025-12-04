import { NextResponse } from 'next/server'
import OAuth from 'oauth-1.0a'
import crypto from 'crypto'

const TWITTER_USERNAME = 'ZekePrivacy'

// Simple in-memory cache with longer duration
let cache: { data: any; timestamp: number } | null = null
const CACHE_DURATION = 10 * 60 * 1000 // 10 minutes
const STALE_CACHE_DURATION = 60 * 60 * 1000 // 1 hour - use stale cache if API fails

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
  })

  return response
}

export async function GET() {
  // Check cache first
  if (cache && Date.now() - cache.timestamp < CACHE_DURATION) {
    return NextResponse.json(cache.data)
  }

  if (!process.env.X_API_KEY || !process.env.X_API_SECRET || 
      !process.env.X_ACCESS_TOKEN || !process.env.X_ACCESS_SECRET) {
    return NextResponse.json(
      { error: 'Twitter API not configured' },
      { status: 500 }
    )
  }

  try {
    // First, get the user ID from username
    const userUrl = `https://api.twitter.com/2/users/by/username/${TWITTER_USERNAME}?user.fields=profile_image_url,name,username`
    const userResponse = await makeRequest(userUrl)

    if (!userResponse.ok) {
      const error = await userResponse.text()
      console.error('User fetch error:', userResponse.status, error)
      // Return stale cache if available
      if (cache && Date.now() - cache.timestamp < STALE_CACHE_DURATION) {
        console.log('Returning stale cache due to API error')
        return NextResponse.json(cache.data)
      }
      return NextResponse.json(
        { error: 'Failed to fetch user', details: error },
        { status: userResponse.status }
      )
    }

    const userData = await userResponse.json()
    const userId = userData.data?.id

    if (!userId) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Then fetch the user's tweets
    const tweetsUrl = `https://api.twitter.com/2/users/${userId}/tweets?max_results=5&tweet.fields=created_at,public_metrics,text&expansions=attachments.media_keys&media.fields=url,preview_image_url,type`
    const tweetsResponse = await makeRequest(tweetsUrl)

    if (!tweetsResponse.ok) {
      const error = await tweetsResponse.text()
      console.error('Tweets fetch error:', tweetsResponse.status, error)
      // Return stale cache if available
      if (cache && Date.now() - cache.timestamp < STALE_CACHE_DURATION) {
        console.log('Returning stale cache due to API error')
        return NextResponse.json(cache.data)
      }
      return NextResponse.json(
        { error: 'Failed to fetch tweets', details: error },
        { status: tweetsResponse.status }
      )
    }

    const tweetsData = await tweetsResponse.json()

    // Combine user and tweets data (limit to 4 tweets)
    const response = {
      user: {
        id: userData.data.id,
        name: userData.data.name,
        username: userData.data.username,
        profile_image_url: userData.data.profile_image_url,
      },
      tweets: (tweetsData.data || []).slice(0, 4),
      media: tweetsData.includes?.media || [],
    }

    // Cache the response
    cache = { data: response, timestamp: Date.now() }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Twitter API error:', error)
    // Return stale cache if available
    if (cache && Date.now() - cache.timestamp < STALE_CACHE_DURATION) {
      console.log('Returning stale cache due to API error')
      return NextResponse.json(cache.data)
    }
    return NextResponse.json(
      { error: 'Failed to fetch tweets', details: String(error) },
      { status: 500 }
    )
  }
}
