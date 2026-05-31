require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Routes
// const aiRoutes = require('./routes/ai');
// const emissionsRoutes = require('./routes/emissions');
// const leaderboardRoutes = require('./routes/leaderboard');
// const externalRoutes = require('./routes/external');

// app.use('/api/ai', aiRoutes);
// app.use('/api/emissions', emissionsRoutes);
// app.use('/api/leaderboard', leaderboardRoutes);
// app.use('/api/external', externalRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'EcoLens Pro API is running' });
});

// Serve frontend static files
const path = require('path');
app.use(express.static(path.join(__dirname, 'public')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {

  console.log(`Server is running on port ${PORT}`);
});
