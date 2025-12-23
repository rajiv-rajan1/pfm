const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const { GoogleAuth } = require('google-auth-library');
const path = require('path');

const app = express();
const auth = new GoogleAuth();
const port = process.env.PORT || 8080;
const backendUrl = process.env.BACKEND_API_URL;

console.log(`Starting server. Backend URL: ${backendUrl}`);

// Serve static files from dist
app.use(express.static(path.join(__dirname, 'dist')));

const skipAuth = process.env.SKIP_AUTH === 'true';

// Authenticated Proxy
if (backendUrl) {
    // 1. Auth Middleware
    app.use('/api', async (req, res, next) => {
        if (skipAuth) {
            next();
            return;
        }
        try {
            const targetAudience = new URL(backendUrl).origin;
            const client = await auth.getIdTokenClient(targetAudience);
            const headers = await client.getRequestHeaders();
            req.headers['Authorization'] = headers['Authorization'];
            next();
        } catch (error) {
            console.error('Error fetching ID token:', error);
            res.status(500).json({ error: 'Failed to authenticate with backend' });
        }
    });

    // 2. Proxy Middleware
    app.use(createProxyMiddleware('/api', {
        target: backendUrl,
        changeOrigin: true,
        onProxyReq: (proxyReq, req, res) => {
            if (req.headers['Authorization']) {
                proxyReq.setHeader('Authorization', req.headers['Authorization']);
            }
        }
    }));
} else {
    console.warn('BACKEND_API_URL not set. API proxying will not work.');
}

// Fallback for SPA
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(port, () => {
    console.log(`Frontend server listening on port ${port}`);
});
