const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const { GoogleAuth } = require('google-auth-library');
const path = require('path');

const app = express();
const auth = new GoogleAuth();
const port = process.env.PORT || 8080;
const backendUrl = process.env.BACKEND_API_URL;

console.log(`Starting server. Backend URL: ${backendUrl}`);

// Serve static files
app.use(express.static(path.join(__dirname, '.')));

// Authenticated Proxy
if (backendUrl) {
    app.use('/api', async (req, res, next) => {
        try {
            // 1. Get the ID Token for the backend
            // NOTE: The audience must be the backend's URL (without path)
            const targetAudience = new URL(backendUrl).origin;
            const client = await auth.getIdTokenClient(targetAudience);
            const headers = await client.getRequestHeaders();

            // 2. Attach the Authorization header
            req.headers['Authorization'] = headers['Authorization'];
            next();
        } catch (error) {
            console.error('Error fetching ID token:', error);
            res.status(500).json({ error: 'Failed to authenticate with backend' });
        }
    }, createProxyMiddleware({
        target: backendUrl,
        changeOrigin: true,
        pathRewrite: {
            // If backend is /api/waitlist and frontend receives /api/waitlist, no rewrite needed
            // But if we need to adjust, do it here. 
            // Current Nginx config sent /api directly, implying backend listens on /api
            // '^/api': '/api' 
        },
        onProxyReq: (proxyReq, req, res) => {
            // Ensure the Authorization header is passed
            if (req.headers['Authorization']) {
                proxyReq.setHeader('Authorization', req.headers['Authorization']);
            }
        }
    }));
} else {
    console.warn('BACKEND_API_URL not set. API proxying will not work.');
}

// Fallback for SPA (if we had client-side routing, which we don't really, but good practice)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
    console.log(`Frontend server listening on port ${port}`);
});
