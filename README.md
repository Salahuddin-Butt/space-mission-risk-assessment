# 🚀 Mission Risk Assessment System

A beautiful, interactive space-themed risk assessment application for space missions with AI-powered insights and real-time monitoring.

![Mission Risk Assessment](https://img.shields.io/badge/Status-Ready%20for%20Deployment-green)
![React](https://img.shields.io/badge/React-18.2.0-blue)
![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![Netlify](https://img.shields.io/badge/Deploy-Netlify-orange)

## ✨ Features

- 🌌 **Space-themed UI** with beautiful background and interactive elements
- 🤖 **AI-powered risk assessment** with neural networks and genetic algorithms
- 📊 **Real-time dashboard** with charts and analytics
- 👥 **Passenger management** system
- 🚀 **Mission tracking** and status monitoring
- 🎨 **Modern glass morphism** design with smooth animations
- 📱 **Responsive design** for all devices
- ⚡ **Real-time updates** with WebSocket connections

## 🚀 Quick Deploy to Netlify

### Option 1: One-Click Deploy
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/Salahuddin-Butt/space-mission-risk-assessment)

### Option 2: Manual Deploy

1. **Fork this repository** to your GitHub account
2. **Go to [Netlify](https://netlify.com)** and sign up/login
3. **Click "New site from Git"**
4. **Choose GitHub** and select your forked repository
5. **Configure build settings:**
   - Build command: `./netlify-build.sh`
   - Publish directory: `client/build`
   - Functions directory: `netlify/functions`
6. **Click "Deploy site"**

## 🛠️ Local Development

### Prerequisites
- Node.js 18 or higher
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/Salahuddin-Butt/space-mission-risk-assessment.git
cd space-mission-risk-assessment

# Install dependencies
npm install
cd client && npm install && cd ..

# Start development server
npm run dev
```

### Available Scripts

```bash
# Start development server (both frontend and backend)
npm run dev

# Start only the backend server
npm run server

# Start only the frontend client
npm run client

# Build for production
npm run build

# Run deployment script
./deploy.sh

# Run Netlify build script
./netlify-build.sh
```

## 📁 Project Structure

```
space-mission-risk-assessment/
├── client/                 # React frontend
│   ├── public/            # Static assets
│   ├── src/               # React source code
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   ├── contexts/      # React contexts
│   │   └── services/      # API services
│   └── package.json
├── routes/                # Express.js API routes
├── services/              # Backend services
├── netlify/               # Netlify configuration
│   └── functions/         # Serverless functions
├── server.js              # Express.js server
├── netlify.toml           # Netlify configuration
├── vercel.json            # Vercel configuration
├── Dockerfile             # Docker configuration
├── docker-compose.yml     # Docker Compose
├── build.sh               # Build script
├── netlify-build.sh       # Netlify build script
└── deploy.sh              # Deployment script
```

## 🌐 Deployment Options

### 1. Netlify (Recommended)
- ✅ Free hosting
- ✅ Automatic deployments
- ✅ Serverless functions
- ✅ Custom domain support

### 2. Vercel
- ✅ Free hosting
- ✅ Automatic deployments
- ✅ Edge functions
- ✅ Global CDN

### 3. Docker
```bash
# Build and run with Docker
docker-compose up -d
```

### 4. Manual Server
```bash
# Run deployment script
./deploy.sh

# Start production server
npm start
```

## 🎨 Customization

### Changing the Space Background
1. Replace `client/public/space-background.png` with your own image
2. The image will automatically be used as the background

### Modifying Colors
Edit `client/src/index.css` to customize:
- Button colors and gradients
- Card backgrounds
- Text colors
- Animation effects

### Adding New Features
- Add new pages in `client/src/pages/`
- Create new components in `client/src/components/`
- Add API routes in `routes/` directory

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:

```env
NODE_ENV=production
PORT=5000
```

### Netlify Environment Variables
In your Netlify dashboard, you can set:
- `NODE_ENV=production`
- Any other environment variables your app needs

## 📊 API Endpoints

- `GET /api/health` - Health check
- `GET /api/passengers` - Get all passengers
- `GET /api/missions` - Get all missions
- `GET /api/risks` - Get risk assessments
- `GET /api/assessments` - Get all assessments
- `GET /api/assessments/statistics/overview` - Get statistics
- `GET /api/assessments/ai/status` - Get AI model status
- `POST /api/assessments/ai/retrain` - Retrain AI model

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Space background image
- React and Node.js communities
- Netlify for hosting
- All contributors and supporters

## 📞 Support

If you have any questions or need help:
- Create an issue on GitHub
- Contact: [Your Email]
- Documentation: [Your Docs URL]

---

**Made with ❤️ by Salahuddin** 
