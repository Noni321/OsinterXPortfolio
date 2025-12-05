
import express from 'express';
import { registerRoutes } from '../dist/routes.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Initialize routes
await registerRoutes(null, app);

// For non-API routes, serve index.html
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(__dirname, '../dist/public/index.html'));
  }
});

// Export for Vercel
export default app;
