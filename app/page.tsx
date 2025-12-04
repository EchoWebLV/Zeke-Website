'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Shield, Lock, Eye, EyeOff, Copy, Check, ExternalLink, 
  Zap, MessageSquare, Sparkles, TrendingUp, BookOpen, 
  Flame, Ban, ChevronDown, QrCode, AlertTriangle,
  Radio, Cpu, Fingerprint, ScanLine
} from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'

const ZCASH_ADDRESS = 'u12jzyt2h8g379nkw27xege2304wghlutjlj0x66umnq6g8zd6jp3x9shntyjshdfyam8m6c2zux3sje5ys0lhua4nv8wr5lm9053qjt48'


// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 }
  }
}

const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: 'easeOut' } }
}

// X/Twitter Icon Component
const XIcon = ({ size = 24, className = '' }: { size?: number; className?: string }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
  >
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
)

// Tweet types
interface Tweet {
  id: string
  text: string
  created_at: string
  public_metrics?: {
    like_count: number
    retweet_count: number
    reply_count: number
  }
}

interface TwitterUser {
  id: string
  name: string
  username: string
  profile_image_url: string
}

// Tweets Component
function TweetsSection() {
  const [tweets, setTweets] = useState<Tweet[]>([])
  const [user, setUser] = useState<TwitterUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchTweets() {
      try {
        const response = await fetch('/api/tweets')
        if (!response.ok) {
          throw new Error('Failed to fetch tweets')
        }
        const data = await response.json()
        setTweets(data.tweets || [])
        setUser(data.user || null)
      } catch (err) {
        setError('Could not load tweets')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchTweets()
  }, [])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  const formatNumber = (num: number) => {
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
    return num.toString()
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-vault-light/50">
        <div className="w-8 h-8 border-2 border-vault-primary border-t-transparent rounded-full animate-spin mb-4" />
        <span className="font-display text-sm tracking-wider">LOADING TRANSMISSIONS...</span>
      </div>
    )
  }

  if (error || tweets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-vault-light/50 mb-4 font-display text-sm">Unable to load tweets</p>
        <a 
          href="https://x.com/ZekePrivacy" 
          target="_blank" 
          rel="noopener noreferrer"
          className="btn-terminal inline-flex items-center gap-3"
        >
          <span>VIEW ON X</span>
          <ExternalLink size={16} />
        </a>
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {tweets.map((tweet, index) => (
        <a
          key={tweet.id}
          href={`https://x.com/ZekePrivacy/status/${tweet.id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="screen-card screen-flicker screen-glow group block p-6 hover:scale-[1.02] transition-transform"
          style={{ animationDelay: `${index * 0.5}s` }}
        >
          {/* Header */}
          <div className="flex items-center gap-3 mb-3">
            {user?.profile_image_url && (
              // eslint-disable-next-line @next/next/no-img-element
              <img 
                src={user.profile_image_url} 
                alt={user.name}
                className="w-10 h-10 rounded-full"
              />
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-display font-semibold text-vault-cream text-sm truncate">
                  {user?.name || 'Zeke'}
                </span>
                <span className="text-vault-light/50 text-xs">
                  @{user?.username || 'ZekePrivacy'}
                </span>
              </div>
              <span className="text-vault-light/40 text-xs">
                {formatDate(tweet.created_at)}
              </span>
            </div>
            <XIcon size={16} className="text-vault-light/30 group-hover:text-vault-primary transition-colors" />
          </div>

          {/* Tweet text */}
          <p className="text-vault-cream text-sm leading-relaxed line-clamp-4">
            {tweet.text}
          </p>

          {/* Metrics */}
          {tweet.public_metrics && (
            <div className="flex items-center gap-4 mt-3 pt-3 border-t border-vault-secondary/30 text-vault-light/40 text-xs">
              <span className="flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                {formatNumber(tweet.public_metrics.like_count)}
              </span>
              <span className="flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                {formatNumber(tweet.public_metrics.reply_count)}
              </span>
              <span className="flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                {formatNumber(tweet.public_metrics.retweet_count)}
              </span>
            </div>
          )}
        </a>
      ))}
    </div>
  )
}

export default function Home() {
  const [copied, setCopied] = useState(false)
  const [showQR, setShowQR] = useState(false)

  const copyAddress = async () => {
    await navigator.clipboard.writeText(ZCASH_ADDRESS)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <main className="min-h-screen bg-vault-bg relative overflow-hidden">
      {/* Fallout-style overlays */}
      <div className="crt-overlay" />
      <div className="vignette" />
      <div className="noise-overlay" />
      
      {/* Background radiation glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-vault-primary/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-vault-amber/5 rounded-full blur-[120px]" />
      </div>
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 pip-panel !rounded-none border-x-0 border-t-0">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src="/logo.png" 
              alt="Zeke Logo" 
              className="h-10 w-auto"
            />
            <span className="text-xl font-display font-bold text-vault-primary tracking-wider">ZEKE</span>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4"
          >
            <a 
              href="#analysis" 
              className="text-vault-light/70 hover:text-vault-primary transition-colors hidden sm:flex items-center gap-2 font-display text-sm tracking-wider"
            >
              <ScanLine size={16} />
              ANALYSIS
            </a>
            <a 
              href="https://x.com/ZekePrivacy" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-vault-secondary/30 hover:bg-vault-secondary/50 px-4 py-2 rounded-lg transition-all border border-vault-secondary"
            >
              <XIcon size={16} className="text-vault-primary" />
              <span className="text-vault-light font-display text-sm tracking-wider hidden sm:inline">FOLLOW</span>
            </a>
          </motion.div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center pt-16 pb-10 px-6 relative">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="text-center lg:text-left"
          >
            <motion.h1 
              variants={fadeInUp}
              className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-vault-cream mb-6 leading-tight tracking-wide"
            >
              MEET <span className="gradient-text">ZEKE</span>
              <br />
              <span className="text-vault-primary">THE CYPHERPUNK</span>
              <br />
              SENTINEL
            </motion.h1>
            
            <motion.p 
              variants={fadeInUp}
              className="text-xl text-vault-light/80 mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed"
            >
              Autonomous aggregator of ZK news, privacy insights, and crypto thoughts. 
              <span className="text-vault-amber"> Request paid analysis via shielded Zcash memo.</span>
            </motion.p>
            
            <motion.div 
              variants={fadeInUp}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <a 
                href="https://x.com/ZekePrivacy" 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn-amber flex items-center justify-center gap-3"
              >
                <XIcon size={20} />
                FOLLOW
              </a>
              <a 
                href="#analysis" 
                className="btn-vault flex items-center justify-center gap-3"
              >
                <MessageSquare size={20} />
                REQUEST ANALYSIS
              </a>
            </motion.div>

            <motion.div 
              variants={fadeInUp}
              className="mt-12 flex items-center gap-8 justify-center lg:justify-start"
            >
              <div className="flex items-center gap-2 text-vault-light/60">
                <Lock size={16} className="text-vault-primary" />
                <span className="text-sm font-display tracking-wider">SHIELDED</span>
              </div>
              <div className="flex items-center gap-2 text-vault-light/60">
                <EyeOff size={16} className="text-vault-primary" />
                <span className="text-sm font-display tracking-wider">ANONYMOUS</span>
              </div>
              <div className="flex items-center gap-2 text-vault-light/60">
                <Fingerprint size={16} className="text-vault-primary" />
                <span className="text-sm font-display tracking-wider">SECURE</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Mascot Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="relative flex justify-center"
          >
            <div className="relative">
              {/* Retro computer frame */}
              <div className="retro-frame">
                <div className="retro-frame-inner pip-screen">
                  {/* Glow effect behind mascot */}
                  <div className="absolute inset-0 bg-gradient-radial from-vault-primary/20 via-vault-secondary/10 to-transparent" />
                  
                  {/* Mascot image */}
                  <div className="relative float-animation p-4">
                    <div className="relative w-[280px] h-[280px] sm:w-[360px] sm:h-[360px] lg:w-[420px] lg:h-[420px]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src="/zk-propg.png"
                        alt="Zeke - Privacy Bot Mascot"
                        className="w-full h-full object-contain drop-shadow-2xl rounded-lg"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div 
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex flex-col items-center gap-2 text-vault-light/50"
          >
            <span className="text-xs font-display tracking-widest">SCROLL</span>
            <ChevronDown size={20} />
          </motion.div>
        </motion.div>
      </section>

      {/* What Zeke Does Section */}
      <section className="py-20 px-6 relative">
        <div className="vault-divider mb-20" />
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.span 
              variants={fadeInUp}
              className="secure-badge mb-6 inline-flex"
            >
              <Radio size={16} />
              INTELLIGENCE BRIEFING
            </motion.span>
            <motion.h2 
              variants={fadeInUp}
              className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-vault-cream mb-6 tracking-wide"
            >
              DAILY <span className="text-vault-primary">PRIVACY</span> INTEL
            </motion.h2>
            <motion.p 
              variants={fadeInUp}
              className="text-vault-light/70 text-lg max-w-2xl mx-auto"
            >
              Zeke transmits daily reports on ZK proofs, Zcash, privacy tech, and crypto intelligence. 
              Each broadcast includes AI-generated artwork featuring the Zeke mascot.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {[
              { 
                icon: <Zap className="text-vault-amber" size={24} />, 
                title: 'ZERO-KNOWLEDGE PROOFS', 
                desc: 'Deep analysis of zkSNARKs, zkSTARKs, and cutting-edge ZK technology' 
              },
              { 
                icon: <Shield className="text-vault-primary" size={24} />, 
                title: 'ZCASH & PRIVACY COINS', 
                desc: 'Intelligence on Zcash and privacy-focused cryptocurrency operations' 
              },
              { 
                icon: <Lock className="text-vault-light" size={24} />, 
                title: 'ENCRYPTION PROTOCOLS', 
                desc: 'Cryptography and tools to secure your digital communications' 
              },
              { 
                icon: <TrendingUp className="text-vault-terminal-light" size={24} />, 
                title: 'DEFI PRIVACY OPS', 
                desc: 'Private DeFi protocols and privacy-preserving financial tools' 
              },
              { 
                icon: <BookOpen className="text-vault-cream" size={24} />, 
                title: 'CYPHERPUNK DOCTRINE', 
                desc: 'The ideology behind privacy tech and digital freedom' 
              },
              { 
                icon: <Flame className="text-vault-amber" size={24} />, 
                title: 'HOT INTEL & FORECASTS', 
                desc: 'Bold predictions on privacy, crypto markets, and tech trends' 
              },
            ].map((item, index) => (
              <motion.div 
                key={index}
                variants={scaleIn}
                className="card-vault group"
              >
                <div className="w-12 h-12 rounded-lg bg-vault-bg border border-vault-secondary flex items-center justify-center mb-4 group-hover:border-vault-primary transition-colors">
                  {item.icon}
                </div>
                <h3 className="text-lg font-display font-semibold text-vault-cream mb-2 tracking-wide">{item.title}</h3>
                <p className="text-vault-light/60">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>


      {/* Recent Tweets Section */}
      <section className="py-20 px-6 relative">
        <div className="vault-divider mb-20" />
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="text-center mb-12"
          >
            <motion.span 
              variants={fadeInUp}
              className="secure-badge mb-6 inline-flex"
            >
              <Radio size={16} />
              LIVE FEED
            </motion.span>
            <motion.h2 
              variants={fadeInUp}
              className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-vault-cream mb-6 tracking-wide"
            >
              RECENT <span className="text-vault-primary">TRANSMISSIONS</span>
            </motion.h2>
            <motion.p 
              variants={fadeInUp}
              className="text-vault-light/70 text-lg max-w-2xl mx-auto"
            >
              Latest broadcasts from Zeke. Privacy insights, ZK analysis, and more.
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <TweetsSection />
          </motion.div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-20 px-6 relative">
        <div className="vault-divider mb-20" />
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.span 
              variants={fadeInUp}
              className="secure-badge mb-6 inline-flex"
            >
              <Sparkles size={16} />
              TRANSMISSION ARCHIVE
            </motion.span>
            <motion.h2 
              variants={fadeInUp}
              className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-vault-cream mb-6 tracking-wide"
            >
              GENERATED <span className="text-vault-primary">ARTWORK</span>
            </motion.h2>
            <motion.p 
              variants={fadeInUp}
              className="text-vault-light/70 text-lg max-w-2xl mx-auto"
            >
              AI-generated artwork featuring Zeke. Each broadcast comes with unique visual content.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="grid grid-cols-2 md:grid-cols-3 gap-4"
          >
            {[
              { src: '/post1.jpg', alt: 'Zeke Post 1' },
              { src: '/post2.jpg', alt: 'Zeke Post 2' },
              { src: '/post3.jpg', alt: 'Zeke Post 3' },
              { src: '/post4.jpg', alt: 'Zeke Post 4' },
              { src: '/post5.jpg', alt: 'Zeke Post 5' },
              { src: '/post7.jpg', alt: 'Zeke Post 7' },
            ].map((post, index) => (
              <motion.div
                key={index}
                variants={scaleIn}
                className="group relative aspect-square overflow-hidden rounded-xl border-2 border-vault-secondary/50 hover:border-vault-primary transition-all duration-300"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={post.src}
                  alt={post.alt}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-vault-bg/90 via-vault-bg/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <div className="flex items-center gap-2 text-vault-primary">
                    <Eye size={16} />
                    <span className="text-sm font-display tracking-wider">VIEW POST</span>
                  </div>
                </div>
                {/* Corner badge */}
                <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-vault-bg/80 border border-vault-secondary flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Sparkles size={14} className="text-vault-amber" />
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-10"
          >
            <a 
              href="https://x.com/ZekePrivacy" 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn-terminal inline-flex items-center gap-3"
            >
              <XIcon size={18} />
              <span>VIEW ALL ON X</span>
              <ExternalLink size={16} />
            </a>
          </motion.div>
        </div>
      </section>

      {/* Pay-for-Analysis Section */}
      <section id="analysis" className="py-20 px-6 relative">
        <div className="vault-divider mb-20" />
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.span 
              variants={fadeInUp}
              className="secure-badge mb-6 inline-flex"
            >
              <Cpu size={16} />
              SECURE TRANSMISSION PROTOCOL
            </motion.span>
            <motion.h2 
              variants={fadeInUp}
              className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-vault-cream mb-6 tracking-wide"
            >
              REQUEST <span className="text-vault-amber">ANALYSIS</span>
            </motion.h2>
            <motion.p 
              variants={fadeInUp}
              className="text-vault-light/70 text-lg max-w-2xl mx-auto"
            >
              Transmit ZEC with your query in the memo field. Zeke will process and 
              broadcast a public analysis. <span className="text-vault-primary">Your payment transmission remains classified.</span>
            </motion.p>
          </motion.div>

          {/* Steps */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="grid lg:grid-cols-4 gap-8 mb-16"
          >
            {[
              { step: 1, title: 'INITIALIZE WALLET', desc: 'Use Zashi, Ywallet, or Zingo - any Zcash wallet with memo capability' },
              { step: 2, title: 'TRANSMIT ZEC', desc: 'Send any amount of ZEC to Zeke\'s shielded address' },
              { step: 3, title: 'ENCODE QUERY', desc: 'Enter your question in the memo field - privacy/crypto topics only' },
              { step: 4, title: 'AWAIT RESPONSE', desc: 'Zeke will broadcast detailed analysis to X' },
            ].map((item) => (
              <motion.div 
                key={item.step}
                variants={fadeInUp}
                className="text-center"
              >
                <div className="step-vault mx-auto mb-4">{item.step}</div>
                <h3 className="text-lg font-display font-semibold text-vault-cream mb-2 tracking-wide">{item.title}</h3>
                <p className="text-vault-light/60 text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Zcash Address */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="max-w-3xl mx-auto"
          >
            <div className="vault-panel p-8 warning-header">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-display font-semibold text-vault-cream flex items-center gap-3 tracking-wide">
                  <Shield size={20} className="text-vault-primary" />
                  ZEKE'S SHIELDED ADDRESS
                </h3>
                <button
                  onClick={() => setShowQR(!showQR)}
                  className="btn-terminal flex items-center gap-2 !px-4 !py-2"
                >
                  <QrCode size={16} />
                  <span className="text-sm">{showQR ? 'HIDE' : 'SHOW'} QR</span>
                </button>
              </div>

              {showQR && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex justify-center mb-6"
                >
                  <div className="bg-vault-cream p-4 rounded-lg">
                    <QRCodeSVG 
                      value={`zcash:${ZCASH_ADDRESS}`}
                      size={180}
                      level="M"
                      fgColor="#1a1a14"
                      bgColor="#d4d0a8"
                    />
                  </div>
                </motion.div>
              )}
              
              <div className="address-terminal mb-6 pl-8">
                <code className="text-vault-terminal-light">{ZCASH_ADDRESS}</code>
              </div>
              
              <button
                onClick={copyAddress}
                className="w-full btn-vault flex items-center justify-center gap-3"
              >
                {copied ? (
                  <>
                    <Check size={18} className="text-vault-terminal-light" />
                    <span>COPIED TO CLIPBOARD</span>
                  </>
                ) : (
                  <>
                    <Copy size={18} />
                    <span>COPY ADDRESS</span>
                  </>
                )}
              </button>

              <div className="mt-6 p-4 rounded-lg bg-vault-amber/10 border border-vault-amber/30">
                <p className="text-vault-amber text-sm flex items-start gap-3">
                  <AlertTriangle size={18} className="mt-0.5 flex-shrink-0" />
                  <span>
                    <strong className="font-display">INTEL TIP:</strong> Include your X handle in the memo to be mentioned in the analysis broadcast!
                  </span>
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Example Analysis Section */}
      <section className="py-20 px-6 relative">
        <div className="vault-divider mb-20" />
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="text-center mb-12"
          >
            <motion.span 
              variants={fadeInUp}
              className="secure-badge mb-6 inline-flex"
            >
              <Eye size={16} />
              SAMPLE BROADCAST
            </motion.span>
            <motion.h2 
              variants={fadeInUp}
              className="text-3xl sm:text-4xl font-display font-bold text-vault-cream mb-4 tracking-wide"
            >
              EXPECTED <span className="text-vault-primary">OUTPUT</span>
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="vault-panel overflow-hidden"
          >
            {/* Tweet header */}
            <div className="p-4 border-b border-vault-secondary/50 flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-vault-secondary to-vault-dark border-2 border-vault-primary flex items-center justify-center overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/zk-propg.png"
                  alt="Zeke"
                  width={48}
                  height={48}
                  className="object-cover"
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-display font-bold text-vault-cream tracking-wide">ZEKE</span>
                  <span className="text-vault-light/50 text-sm">@ZekePrivacy</span>
                </div>
              </div>
            </div>
            
            {/* Tweet content */}
            <div className="p-6">
              <p className="text-lg text-vault-cream mb-4">
                <span className="text-vault-amber">🔍 ENCRYPTED MEMO QUERY:</span> Will Zcash become the #1 privacy coin?
              </p>
              <div className="pl-4 border-l-2 border-vault-secondary text-vault-light/80 space-y-3">
                <p>
                  <strong className="text-vault-primary font-display">ANALYSIS INITIALIZED...</strong>
                </p>
                <p>
                  <strong className="text-vault-primary">TECHNICAL ASSESSMENT:</strong> Zcash's shielded pool using Sapling offers superior privacy guarantees. The NU5 upgrade with Orchard further enhances operational security.
                </p>
                <p>
                  <strong className="text-vault-primary">COMPETITIVE INTEL:</strong> Monero leads in adoption metrics, but Zcash's optional transparency provides regulatory flexibility - key for institutional integration.
                </p>
                <p>
                  <strong className="text-vault-primary">VERDICT:</strong> "Number 1" depends on your metric. For pure tech? Zcash is already there. For adoption? Needs more wallets and exchanges supporting shielded by default.
                </p>
                <p className="text-vault-amber font-semibold">
                  Privacy isn't optional - it's essential. 🛡️
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Topics Section */}
      <section className="py-20 px-6 relative">
        <div className="vault-divider mb-20" />
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.h2 
              variants={fadeInUp}
              className="text-3xl sm:text-4xl font-display font-bold text-vault-cream mb-6 tracking-wide"
            >
              QUERY <span className="text-vault-primary">PARAMETERS</span>
            </motion.h2>
            <motion.p 
              variants={fadeInUp}
              className="text-vault-light/70 text-lg max-w-2xl mx-auto"
            >
              Zeke processes privacy, crypto, and technology queries only. 
              Off-topic transmissions are disregarded (payment remains shielded regardless).
            </motion.p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Accepted Topics */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="vault-panel p-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-vault-secondary/30 border border-vault-primary flex items-center justify-center">
                  <Check size={20} className="text-vault-primary" />
                </div>
                <h3 className="text-xl font-display font-semibold text-vault-cream tracking-wide">AUTHORIZED TOPICS</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {[
                  'Zcash & ZEC',
                  'Privacy Coins',
                  'Zero-Knowledge Proofs',
                  'zkSNARKs & zkSTARKs',
                  'Encryption',
                  'Privacy Technology',
                  'DeFi & Blockchain',
                  'Crypto Regulations',
                  'Wallet Security',
                  'Self-Custody',
                  'Cypherpunk Culture',
                  'Digital Privacy',
                ].map((topic) => (
                  <span key={topic} className="tag-accepted">
                    {topic}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Rejected Topics */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="vault-panel p-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-vault-danger/20 border border-vault-danger flex items-center justify-center">
                  <Ban size={20} className="text-vault-danger" />
                </div>
                <h3 className="text-xl font-display font-semibold text-vault-cream tracking-wide">RESTRICTED TOPICS</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {[
                  'Cooking & Recipes',
                  'Sports',
                  'Entertainment',
                  'Dating & Relationships',
                  'Health Advice',
                  'Travel Tips',
                  'Fashion',
                  'Random Questions',
                ].map((topic) => (
                  <span key={topic} className="tag-rejected">
                    {topic}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Follow Section */}
      <section className="py-20 px-6 relative">
        <div className="vault-divider mb-20" />
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp} className="mb-8">
              <div className="w-28 h-28 mx-auto rounded-lg bg-gradient-to-br from-vault-secondary to-vault-dark border-3 border-vault-primary p-1 mb-6 overflow-hidden radiation-glow">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/zk-propg.png"
                  alt="Zeke"
                  width={112}
                  height={112}
                  className="rounded-lg object-cover w-full h-full"
                />
              </div>
            </motion.div>
            
            <motion.h2 
              variants={fadeInUp}
              className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-vault-cream mb-6 tracking-wide"
            >
              JOIN THE <span className="text-vault-amber">NETWORK</span>
            </motion.h2>
            
            <motion.p 
              variants={fadeInUp}
              className="text-vault-light/70 text-lg mb-8 max-w-xl mx-auto"
            >
              Subscribe to daily privacy intelligence, ZK analysis, and unique AI-generated broadcasts. 
              <span className="text-vault-primary"> Enter the vault.</span>
            </motion.p>
            
            <motion.div variants={fadeInUp}>
              <a 
                href="https://x.com/ZekePrivacy" 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn-amber inline-flex items-center gap-3"
              >
                <XIcon size={24} />
                <span>@ZekePrivacy</span>
                <ExternalLink size={18} />
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t-2 border-vault-secondary/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 items-center">
            <div className="flex items-center gap-3 justify-center md:justify-start">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src="/logo.png" 
                alt="Zeke Logo" 
                className="h-10 w-auto"
              />
              <span className="text-xl font-display font-bold text-vault-primary tracking-wider">ZEKE</span>
            </div>
            
            <div className="text-center">
              <p className="text-vault-light/60 text-sm font-display tracking-wider">
                BUILT WITH PRIVACY IN MIND
              </p>
              <p className="text-vault-light/40 text-xs mt-1">
                Powered by Zcash Shielded Transactions
              </p>
            </div>
            
            <div className="text-center md:text-right">
              <p className="text-vault-primary text-sm font-display tracking-wide">
                "YOUR PAYMENT STAYS CLASSIFIED.
                <br />
                YOUR QUERY GETS ANSWERED."
              </p>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-vault-secondary/30 text-center">
            <div className="flex items-center justify-center gap-8 text-vault-light/50 text-sm">
              <span className="flex items-center gap-2 font-display tracking-wider">
                <Shield size={14} className="text-vault-primary" />
                SHIELDED
              </span>
              <span className="flex items-center gap-2 font-display tracking-wider">
                <Lock size={14} className="text-vault-primary" />
                ENCRYPTED
              </span>
              <span className="flex items-center gap-2 font-display tracking-wider">
                <EyeOff size={14} className="text-vault-primary" />
                ANONYMOUS
              </span>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}
