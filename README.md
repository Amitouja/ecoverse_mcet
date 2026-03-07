# EcoVerse - Conscious Fashion Marketplace

A gamified eco-fashion marketplace built with Next.js 16, featuring sustainable clothing, Eco Points rewards system, and AI-powered styling assistance.

## Features

- 🌱 Eco-conscious product catalog with sustainability scores
- 🎯 Gamified rewards system with Eco Points
- 🎨 Beautiful, animated UI with custom cursor
- 📱 Fully responsive design
- ⚡ Built with Next.js 16 and React 19
- 🎭 TypeScript for type safety

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
app/
├── components/          # React components
│   ├── AnnouncementBar.tsx
│   ├── Categories.tsx
│   ├── CustomCursor.tsx
│   ├── Footer.tsx
│   ├── Hero.tsx
│   ├── ImpactStrip.tsx
│   ├── Navigation.tsx
│   ├── Shop.tsx
│   └── Toast.tsx
├── globals.css         # Global styles
├── styles.css          # Additional component styles
├── layout.tsx          # Root layout
└── page.tsx            # Home page

public/                 # Static assets (images)
```

## Technologies

- Next.js 16.1.6
- React 19.2.3
- TypeScript 5
- Tailwind CSS 4
- Google Fonts (Playfair Display, Jost, Space Mono)

## Features Breakdown

### Product Catalog
- Filter by category (Organic, Recycled, Vegan)
- Eco scores for each product
- Material information
- Add to cart with animated feedback

### Rewards System
- Earn Eco Points on purchases
- Visual toast notifications
- Points tracking in navigation

### UI/UX
- Custom animated cursor
- Smooth scroll navigation
- Hover effects and transitions
- Responsive design for mobile

## Build for Production

```bash
npm run build
npm start
```

## License

© 2025 EcoVerse · Powered by Google · Wear the Future
