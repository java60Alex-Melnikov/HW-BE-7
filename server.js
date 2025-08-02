import express, { json } from 'express';
import rateLimit from 'express-rate-limit';
const app = express();
const PORT = 3000;

app.use(json());

const requestTime = (req, next) => {
    req.requestTime = new Date().toISOString();
    next();
};

const limitRequests = rateLimit({
    windowMs: 60 * 1000, 
    max: 3, 
    message: "Too Many Requests",
});

app.use(requestTime);

app.post('/api/greet', limitRequests, (req, res) => {
    res.json({
        message: "Hello!",
        requestedAt: req.requestTime
    });
});

app.get('/api/status', (req, res) => {
    res.json({
        status: "Up and running",
        requestedAt: req.requestTime
    });
});

app.use((req, res) => {
    const error = new Error(`Route ${req.method} ${req.path} not found`);
    console.error('404 Error:', error.message);
    res.status(404).json({
        error: 'Not Found',
        message: error.message,
        timestamp: new Date().toISOString()
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log('POST /api/greet - Rate limited (3/min)');
    console.log('GET /api/status - No rate limit');
});

export default app;