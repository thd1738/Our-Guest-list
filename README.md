# T&C Guest List — Tafadzwa ❤️ Chengeto Wedding Directory

Official luxury guest list management application for the 2026 royal wedding celebration of **Tafadzwa (Groom)** and **Chengeto (Bride)**.

---

## ✨ Features
- **Cinematic Opening Splash Screen**: Luxury glassmorphism design with soft glowing dust particles, gold shimmer progress indicator, and smooth dissolve transition.
- **Dual Family Organization**: Separate directories for Groom and Bride sides with instant switching and summary statistics.
- **Real-Time Interactive Search & Filter**: Search guests by name or filter by attendance categories.
- **Custom Profile Photos**: Upload custom photos for Bride and Groom profiles directly from device gallery or camera.
- **Responsive Luxury Styling**: Styled with Tailwind CSS featuring rich gold borders (`#D4AF37`), romantic rose accents (`#F472B6`), and smooth layout animations powered by `motion/react`.

---

## 🚀 Deploying to Vercel (Recommended)

This project is fully optimized and pre-configured for instant deployment on [Vercel](https://vercel.com/).

### Option 1: Vercel Dashboard (Git Integration)
1. Push this project code to a Git repository (GitHub, GitLab, or Bitbucket).
2. Go to your [Vercel Dashboard](https://vercel.com/new) and click **Add New Project**.
3. Import your Git repository.
4. Vercel will automatically detect the **Vite** framework and read the pre-configured `vercel.json` file.
5. Click **Deploy**. Your app will build and go live in seconds!

### Option 2: Vercel CLI (Terminal Deploy)
If you have Node.js and npm installed locally, you can deploy directly from your terminal:

```bash
# 1. Install Vercel CLI globally
npm i -g vercel

# 2. Log in to your Vercel account
vercel login

# 3. Deploy to production
vercel --prod
```

---

## 🛠️ Local Development

To run the application on your local machine:

```bash
# Install dependencies
npm install

# Start the local development server
npm run dev
```

The application will be accessible at `http://localhost:3000`.

---

## 📁 Vercel Configuration Details
The project includes a `vercel.json` configuration file with:
- **SPA Routing Rewrites**: Prevents `404 Not Found` errors when refreshing or linking directly to internal paths by rewriting all requests to `/index.html`.
- **Immutable Asset Caching**: Sets long-term HTTP cache headers (`max-age=31536000, immutable`) for compiled assets in `/assets/*` for ultra-fast loading speeds.
- **Vite Build Preset**: Explicitly targets `dist` output and `npm run build` commands.
