// server.js
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import dotenv from 'dotenv';
import { connectDB } from './db.js';
import authRoutes from './routes/auth.js';

dotenv.config();
const PORT = process.env.PORT || 3000;

const app = express();

// Middleware — relax helmet CSP in development
app.use(helmet({
  contentSecurityPolicy: process.env.NODE_ENV === 'production' ? undefined : false
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// CORS
app.use(cors({
  origin: [`http://localhost:${PORT}`, `http://127.0.0.1:${PORT}`],
  credentials: true
}));

// Request logger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Serve static files
app.use(express.static(path.join(process.cwd(), 'public')));

// API routes
app.use('/api', authRoutes);

// Test route
app.get('/api/ping', (req, res) => {
  res.json({ ok: true, message: 'Server is running', timestamp: new Date().toISOString() });
});

// 404 handler for API routes
app.use('/api/*', (req, res) => {
  console.log('[404] API route not found:', req.method, req.url);
  res.status(404).json({ ok: false, message: 'API endpoint not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('[GLOBAL ERROR]', err);
  if (res.headersSent) return next(err);
  res.status(500).json({ ok: false, message: 'Internal server error', error: err.message });
});

// Start server
connectDB().then(() => {
  const server = app.listen(PORT, () => {
    const actualPort = server.address().port;
    console.log(`✓ MongoDB connected`);
    console.log(`✓ Server listening on: http://localhost:${actualPort}`);
    console.log(`✓ Open: http://localhost:${actualPort}/signup.html`);
  });
}).catch(err => {
  console.error('✗ Failed to start server:', err);
  process.exit(1);
});