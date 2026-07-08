const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

const authRoutes = require('./routes/authRoutes');
const teamRoutes = require('./routes/teamRoutes');
const projectRoutes = require('./routes/projectRoutes');
const taskRoutes = require('./routes/taskRoutes');

connectDB();

const app = express();

app.use(
  cors({
    origin: [process.env.CLIENT_URL, 'http://localhost:5173',],
    credentials: true,
  })
);
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ success: true, message: 'SyncSpace API is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`SyncSpace API running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
