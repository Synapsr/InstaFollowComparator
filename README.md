# 📊 InstaFollow Comparator

**A privacy-first, production-grade Instagram follower analysis tool that respects Meta's Terms of Service.**

[![Docker Hub](https://img.shields.io/docker/pulls/synapsr/instafollowcomparator?style=flat-square&logo=docker)](https://hub.docker.com/r/synapsr/instafollowcomparator)
[![GitHub release](https://img.shields.io/github/v/release/Synapsr/InstaFollowComparator?style=flat-square&logo=github)](https://github.com/Synapsr/InstaFollowComparator/releases)
[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green?style=flat-square)](https://github.com/Synapsr/InstaFollowComparator/blob/main/LICENSE.md)

## 🚀 **Quick Start with Docker**

Deploy InstaFollow Comparator in seconds with a single command:

```bash
docker run -p 3000:3000 synapsr/instafollowcomparator
```

Then open your browser to [`http://localhost:3000`](http://localhost:3000) and start analyzing your Instagram relationships! 🎉

> **🔥 That's it!** No installation, no dependencies, no configuration needed.

## ✨ Features

- **🔒 100% Privacy-First**: All processing happens in your browser - no data ever leaves your device
- **⚡ Lightning Fast**: Optimized algorithms for instant analysis of large datasets  
- **🎨 Modern UI/UX**: Beautiful, responsive interface built with modern design principles
- **📱 Mobile Friendly**: Works seamlessly across all devices and screen sizes
- **📊 Comprehensive Analytics**: Detailed insights into your Instagram relationships
- **📥 Export Functionality**: Download your analysis results as JSON
- **🔗 Share Results**: Share summary statistics with friends
- **🛡️ Compliant**: Uses official Instagram data export - no API scraping

## 🚀 What You'll Discover

### 💝 Mutual Follows
People who follow you and you follow back - your genuine connections!

### ➡️ You Follow (No Follow Back)
Accounts you follow but don't get a follow back from - time to clean up your following list?

### ⬅️ They Follow You (You Don't Follow Back)  
Your followers that you're not following back - potential new connections to explore!

### 📈 Statistics
- Total followers and following counts
- Follow-back percentage
- Relationship breakdowns with timestamps

## 🏗️ Tech Stack

**Frontend & Framework**
- [Next.js 14](https://nextjs.org/) - React framework with App Router
- [TypeScript](https://www.typescriptlang.org/) - Type safety and better DX
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first styling
- [Framer Motion](https://www.framer.com/motion/) - Smooth animations
- [Lucide React](https://lucide.dev/) - Beautiful icons

**Data Processing**
- [JSZip](https://stuk.github.io/jszip/) - Client-side ZIP file processing
- Custom TypeScript parsers for Instagram data formats

**Development & Production**
- [ESLint](https://eslint.org/) - Code linting
- [PostCSS](https://postcss.org/) - CSS processing
- [Autoprefixer](https://github.com/postcss/autoprefixer) - CSS vendor prefixes

## 📱 How to Get Your Instagram Data

1. **Open Instagram Settings**
   - Go to Instagram (app or web)
   - Navigate to Settings → Privacy and Security

2. **Request Data Download**  
   - Click "Data Download"
   - Choose **JSON format** (important!)
   - Select "Connections" data
   - Request download

3. **Wait for Email**
   - Instagram will send you a download link
   - This can take up to 14 days

4. **Upload & Analyze**
   - Download the ZIP file from Instagram's email
   - Upload it to InstaFollow Comparator
   - Get instant analysis!

## 🛠️ Development Setup

### Prerequisites
- Node.js 18+ 
- Docker (optional but recommended)
- Git

### Option 1: Docker Development (Recommended)

```bash
# Clone the repository
git clone https://github.com/Synapsr/InstaFollowComparator.git
cd InstaFollowComparator

# Build and run with Docker
docker build -t instafollowcomparator .
docker run -p 3000:3000 instafollowcomparator
```

### Option 2: Local Development

```bash
# Clone the repository  
git clone https://github.com/Synapsr/InstaFollowComparator.git
cd InstaFollowComparator

# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:3000 in your browser
```

### Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript checks

# Docker Commands
docker build -t instafollowcomparator .           # Build Docker image
docker run -p 3000:3000 instafollowcomparator     # Run container

# Build Scripts (Recommended)
./scripts/build.sh --dev      # Development mode with hot reload
./scripts/build.sh --prod     # Production build and validation
./scripts/build.sh --docker   # Docker build with validation
```

## 🌐 Deployment Options

### Docker Hub (Recommended)
```bash
# Pull and run the latest version
docker run -p 3000:3000 synapsr/instafollowcomparator

# Run with custom port
docker run -p 8080:3000 synapsr/instafollowcomparator

# Run in detached mode with health checks
docker run -d -p 3000:3000 --name instafollowcomparator synapsr/instafollowcomparator

# Check container health
docker ps  # Shows health status
```

### Docker Compose (Production Ready)
```yaml
# docker-compose.yml
version: '3.8'
services:
  instafollowcomparator:
    image: synapsr/instafollowcomparator
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    restart: unless-stopped
```

```bash
# Deploy with docker-compose
curl -o docker-compose.yml https://raw.githubusercontent.com/Synapsr/InstaFollowComparator/main/docker-compose.yml
docker-compose up -d
```

### Vercel (One-Click Deploy)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Synapsr/InstaFollowComparator)

### Netlify (One-Click Deploy)
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/Synapsr/InstaFollowComparator)

### Railway (One-Click Deploy)
[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template/github.com/Synapsr/InstaFollowComparator)

### Self-Hosted
```bash
# Build and run locally
npm run build
npm start

# Or with Docker
docker build -t instafollowcomparator .
docker run -p 3000:3000 instafollowcomparator
```

### Project Structure

```
src/
├── app/                 # Next.js App Router pages
│   ├── layout.tsx      # Root layout with error boundary
│   ├── page.tsx        # Home page with upload interface
│   ├── results/        # Results page
│   └── globals.css     # Global styles
├── components/         # Reusable React components
│   └── ErrorBoundary.tsx
├── lib/               # Utility functions
│   └── instagram-parser.ts
└── types/             # TypeScript definitions
    └── instagram.ts
```

## 🔧 Core Architecture

### Data Processing Pipeline

1. **ZIP Upload** - User selects Instagram data export ZIP file
2. **File Validation** - Verify ZIP structure and required files
3. **JSON Parsing** - Extract and parse followers/following data  
4. **Relationship Analysis** - Compare datasets to find relationships
5. **Results Display** - Present findings in beautiful, interactive UI

### Key Components

**Instagram Data Parser** (`src/lib/instagram-parser.ts`)
- Handles ZIP file processing
- Parses Instagram's JSON data structure
- Implements comparison algorithms
- Type-safe data transformation

**Results Page** (`src/app/results/page.tsx`)
- Interactive tabbed interface
- Real-time filtering and sorting
- Export and sharing functionality
- Mobile-optimized design

**Error Boundary** (`src/components/ErrorBoundary.tsx`)
- Graceful error handling
- User-friendly error messages  
- Development vs production error display
- Recovery options

## 🔒 Privacy & Security

### Data Handling
- **Zero Server Processing**: All data processing happens client-side
- **No Data Storage**: Nothing is saved to databases or servers
- **Session-Only**: Data only exists in browser session storage
- **No Analytics**: No tracking or analytics on user data

### Compliance  
- ✅ Uses official Instagram data export (no scraping)
- ✅ Respects Meta's Terms of Service
- ✅ No API violations or unauthorized access
- ✅ Privacy-first architecture

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help improve InstaFollow Comparator:

### 🐛 Bug Reports & Feature Requests
- [Report bugs](https://github.com/Synapsr/InstaFollowComparator/issues/new?assignees=&labels=bug&template=bug_report.md) 
- [Request features](https://github.com/Synapsr/InstaFollowComparator/issues/new?assignees=&labels=enhancement&template=feature_request.md)

### 💻 Development Contributions

1. **Fork & Clone**
   ```bash
   git clone https://github.com/yourusername/InstaFollowComparator.git
   cd InstaFollowComparator
   ```

2. **Set Up Development Environment**
   ```bash
   npm install
   npm run dev
   ```

3. **Create Feature Branch**
   ```bash
   git checkout -b feature/your-awesome-feature
   ```

4. **Make Your Changes**
   - Write clean, typed code
   - Follow existing code style
   - Add tests where appropriate
   - Update documentation if needed

5. **Test Thoroughly**
   ```bash
   npm run lint
   npm run type-check
   npm run build
   
   # Test with Docker
   docker build -t instafollowcomparator .
   docker run -p 3000:3000 instafollowcomparator
   ```

6. **Submit Pull Request**
   - Clear description of changes
   - Reference related issues
   - Include screenshots if UI changes

### 📝 Code Style Guidelines
- **TypeScript**: All new code must be typed
- **ESLint**: Follow the established linting rules
- **Tailwind CSS**: Use utility classes for styling
- **Commits**: Write clear, descriptive commit messages
- **Components**: Keep components focused and reusable

### 🏗️ Areas for Contribution
- 🌍 **Internationalization**: Help translate the app
- 📊 **Analytics**: Add more insights and statistics
- 🎨 **UI/UX**: Improve the design and user experience
- 🔧 **Performance**: Optimize parsing and rendering
- 📱 **Mobile**: Enhance mobile experience
- 🐳 **DevOps**: Improve Docker setup and CI/CD
- 📚 **Documentation**: Expand guides and examples

## 🌟 Show Your Support

If you find InstaFollow Comparator helpful, please consider:

- ⭐ **Starring** this repository
- 🐳 **Pulling** the Docker image: `docker pull synapsr/instafollowcomparator`
- 📢 **Sharing** with friends who use Instagram
- 🐛 **Contributing** by reporting bugs or suggesting features
- 💖 **Sponsoring** the project development

## 📊 Stats & Metrics

[![GitHub stars](https://img.shields.io/github/stars/Synapsr/InstaFollowComparator?style=social)](https://github.com/Synapsr/InstaFollowComparator)
[![GitHub forks](https://img.shields.io/github/forks/Synapsr/InstaFollowComparator?style=social)](https://github.com/Synapsr/InstaFollowComparator/network/members)
[![Docker Pulls](https://img.shields.io/docker/pulls/synapsr/instafollowcomparator)](https://hub.docker.com/r/synapsr/instafollowcomparator)
[![GitHub issues](https://img.shields.io/github/issues/Synapsr/InstaFollowComparator)](https://github.com/Synapsr/InstaFollowComparator/issues)
[![GitHub last commit](https://img.shields.io/github/last-commit/Synapsr/InstaFollowComparator)](https://github.com/Synapsr/InstaFollowComparator/commits/main)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## 🙏 Acknowledgments

- 📸 **Instagram** for providing the official data export feature
- ⚡ **Next.js Team** for the incredible React framework
- 🎨 **Tailwind CSS** for the utility-first CSS framework
- 🐳 **Docker** for containerization technology
- 💜 **Open Source Community** for inspiration and support
- 👥 **All Contributors** who help improve this tool

## ❓ Frequently Asked Questions

<details>
<summary><strong>🔒 Is this safe to use? Will my data be stolen?</strong></summary>
<br>
Absolutely safe! Your data never leaves your browser. Everything is processed locally using client-side JavaScript. We don't have servers to collect your data even if we wanted to.
</details>

<details>
<summary><strong>⚖️ Does this violate Instagram's Terms of Service?</strong></summary>
<br>
No! This tool only uses Instagram's official data export feature - no scraping, no unauthorized API calls, no violations. It's the same data Instagram gives you directly.
</details>

<details>
<summary><strong>⏱️ How long does Instagram take to prepare my export?</strong></summary>
<br>
Instagram says up to 14 days, but it's usually much faster (24-48 hours). You'll receive an email with a download link when it's ready.
</details>

<details>
<summary><strong>💼 Can I use this for business/creator accounts?</strong></summary>
<br>
Yes! The tool works with personal, business, and creator accounts. Any Instagram account that can request a data export will work.
</details>

<details>
<summary><strong>❌ My ZIP file doesn't work. What's wrong?</strong></summary>
<br>
Make sure you:
- Selected <strong>JSON format</strong> (not HTML) when requesting the export
- Included <strong>Connections data</strong> in your export request
- Downloaded the complete ZIP file from Instagram's email
- The file isn't corrupted (try re-downloading)
</details>

<details>
<summary><strong>📊 Why are the numbers different from my profile?</strong></summary>
<br>
Instagram's official export doesn't include:
- Deleted/deactivated accounts
- Users who have blocked you
- Some private accounts
- Very recent follows/unfollows

This is a limitation of Instagram's export, not our tool.
</details>

<details>
<summary><strong>🐳 How do I update to the latest Docker version?</strong></summary>
<br>

```bash
# Pull the latest image
docker pull synapsr/instafollowcomparator:latest

# Stop and remove old container
docker stop instafollowcomparator
docker rm instafollowcomparator

# Run with latest image
docker run -d -p 3000:3000 --name instafollowcomparator synapsr/instafollowcomparator
```
</details>

---

<div align="center">

**🎉 Ready to discover your Instagram relationships?**

### [`🚀 Try it now with Docker`](https://hub.docker.com/r/synapsr/instafollowcomparator)

```bash
docker run -p 3000:3000 synapsr/instafollowcomparator
```

Made with 💜 by [Synapsr](https://github.com/Synapsr) for the Instagram community

[⭐ Star on GitHub](https://github.com/Synapsr/InstaFollowComparator) • [🐳 Docker Hub](https://hub.docker.com/r/synapsr/instafollowcomparator) • [🐛 Report Issue](https://github.com/Synapsr/InstaFollowComparator/issues) • [💡 Request Feature](https://github.com/Synapsr/InstaFollowComparator/issues/new?assignees=&labels=enhancement&template=feature_request.md)

</div>