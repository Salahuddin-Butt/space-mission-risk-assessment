# 🚀 Mission Risk Assessment System

An AI-powered full-stack web application for managing space missions, passengers, and real-time risk assessment using neural networks and genetic algorithms.

## 🌟 Features

- **Mission Management**: Create and manage space missions with destinations, rockets, and crew assignments
- **Passenger Management**: Add passengers with health assessments and special needs
- **AI-Powered Risk Assessment**: Neural network-based risk calculation for mission safety
- **Real-time Analytics**: Interactive dashboards with charts and statistics
- **Route Optimization**: Genetic algorithm for optimal mission route planning
- **Live Updates**: Real-time data synchronization using Socket.IO

## 🛠️ Tech Stack

- **Frontend**: React.js, Tailwind CSS, Framer Motion, Recharts
- **Backend**: Node.js, Express.js, Socket.IO
- **AI/ML**: Synaptic.js (Neural Networks), Genetic.js (Genetic Algorithms)
- **Deployment**: GitHub Pages

## 🚀 Live Demo

**Access the live application**: [Mission Risk Assessment System](https://salahuddin.github.io/space-mission-risk-assessment)

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn

## 🏃‍♂️ Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/salahuddin/space-mission-risk-assessment.git
   cd space-mission-risk-assessment
   ```

2. **Install dependencies**
   ```bash
   npm install
   cd client && npm install
   cd ..
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 📁 Project Structure

```
space-mission-risk-assessment/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   └── contexts/      # React contexts
│   └── public/            # Static files
├── routes/                # Express.js API routes
├── services/              # Backend services (AI, health, etc.)
├── server.js              # Main server file
└── package.json           # Project configuration
```

## 🎯 Key Features Demo

### 1. **Dashboard Overview**
- Real-time mission statistics
- Risk distribution charts
- AI model performance metrics

### 2. **Mission Management**
- Create new missions with destinations and rockets
- Assign passengers to missions
- Real-time status updates

### 3. **Passenger Management**
- Add passengers with health assessments
- Experience level tracking
- Emergency contact management

### 4. **Risk Assessment**
- AI-powered risk calculation
- Real-time risk analysis
- Visual risk distribution

### 5. **AI Insights**
- Neural network training status
- Genetic algorithm optimization
- Model performance analytics

## 🔧 API Endpoints

- `GET /api/passengers` - Get all passengers
- `POST /api/passengers` - Create new passenger
- `GET /api/missions` - Get all missions
- `POST /api/missions` - Create new mission
- `GET /api/assessments` - Get risk assessments
- `POST /api/assessments` - Create risk assessment
- `POST /api/assessments/ai/retrain` - Retrain AI models

## 🚀 Deployment

### GitHub Pages (Current)
```bash
npm run deploy
```

### Netlify
1. Connect your GitHub repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `client/build`

### Vercel
```bash
npm install -g vercel
vercel
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Salahuddin**
- GitHub: [@Salahuddin-buttn](https://github.com/Salahuddin-Butt)

## 🙏 Acknowledgments

- React.js community
- Node.js ecosystem
- AI/ML libraries (Synaptic.js, Genetic.js)
- Open source contributors

---

⭐ **Star this repository if you found it helpful!** 
