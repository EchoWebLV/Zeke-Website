# Zeke - Privacy-First AI Analyst

A Fallout-inspired, privacy-focused landing page for Zeke - an AI-powered privacy bot on X (Twitter).

## About Zeke

Zeke is a privacy-focused AI bot that:
- Posts daily content about ZK proofs, Zcash, privacy tech, and crypto
- Generates unique artwork featuring the Zeke mascot
- Offers **paid analysis** via Zcash shielded memos - send ZEC with a question, get a public analysis tweet

## Design Theme

**Fallout + Security Aesthetic:**
- Vault-Tec inspired color palette (#afaa71, #6c6a39)
- CRT scanline overlay effects
- Retro-futuristic typography (Orbitron, Rajdhani, Share Tech Mono)
- Pip-Boy style panels and terminals
- Vignette and noise overlays for atmosphere
- Military/classified document styling

## Features

- 🛡️ **Fallout-Style UI** - Vault-Tec inspired design with security elements
- 📺 **CRT Effects** - Scanlines, vignette, and noise overlays
- 📱 **Fully Responsive** - Mobile-first design
- ✨ **Smooth Animations** - Framer Motion powered transitions
- 📋 **Copy-to-Clipboard** - Easy copying of Zcash address
- 📷 **QR Code** - Toggleable QR code for payments
- 🔒 **Terminal Styling** - Retro computer aesthetic

## Tech Stack

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Custom Fallout theme
- **Framer Motion** - Animation library
- **Lucide React** - Icons
- **QRCode.React** - QR code generation

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, or pnpm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/zeke-website.git
cd zeke-website
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
zeke-website/
├── app/
│   ├── globals.css      # Global styles and Tailwind config
│   ├── layout.tsx       # Root layout with metadata
│   └── page.tsx         # Main landing page
├── public/
│   └── zeke-mascot.png  # Zeke mascot image
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

## Customization

### Colors

The Fallout-inspired color palette is defined in `tailwind.config.ts`:

```typescript
colors: {
  'vault': {
    'primary': '#afaa71',      // Main tan/olive
    'secondary': '#6c6a39',    // Dark olive/army green
    'dark': '#4a4825',         // Darker shade
    'light': '#c9c48f',        // Lighter shade
    'cream': '#d4d0a8',        // Cream highlight
    'bg': '#1a1a14',           // Dark sepia-tinted background
    'amber': '#f0a830',        // Pip-Boy amber accent
  }
}
```

### Zcash Address

Update the `ZCASH_ADDRESS` constant in `app/page.tsx` with your own shielded address.

### Social Links

Update the Twitter/X links throughout the page to point to your actual handle.

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the repository in [Vercel](https://vercel.com)
3. Deploy!

### Static Export

```bash
npm run build
```

The output will be in the `.next` folder.

## License

MIT License - feel free to use this for your own projects!

## Follow Zeke

- Twitter/X: [@ZekePrivacy](https://x.com/ZekePrivacy)

---

*Built with privacy in mind. Powered by Zcash shielded transactions.*

*"Your payment stays private. Your question gets answered."*

