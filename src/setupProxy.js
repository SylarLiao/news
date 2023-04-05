const { createProxyMiddleware } = require('http-proxy-middleware')

module.exports = function(app) {
    app.use(
        '/api',
        createProxyMiddleware({
            target: 'https://piaofang.maoyan.com',
            changeOrigin: true,
            pathRewrite: {
                '^/api': ''
            }
        })
    );
};